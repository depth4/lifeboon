/**
 * Longitudinal vehicle dynamics.
 *
 * This is the half of car physics that every vehicle in the world runs, all
 * the time: engine, gearbox, the forces resisting motion, and the grip limit
 * on how much of it can reach the road. It answers "how fast is this thing
 * going, and can it get up that hill" — which is what decides traffic flow,
 * journey times and fuel burn.
 *
 * The other half — tyre slip, weight transfer, suspension travel — is what
 * makes a car *feel* like something, and costs roughly five hundred times as
 * much per vehicle. It only ever runs for cars near the camera. Splitting the
 * work by axis rather than by vehicle keeps one car definition and one set of
 * numbers: a distant car and the player's car agree on top speed and on
 * whether they make it up the hill, because they share this code.
 *
 * Everything here is SI: metres, seconds, kilograms, newtons, watts.
 */

const RPM_TO_RAD = (2 * Math.PI) / 60;
/** Air density at sea level, 15 °C. */
const AIR_DENSITY = 1.225;
const GRAVITY = 9.81;

export interface EngineSpec {
  /** Peak power in watts, and the crank speed it happens at. */
  peakPowerW: number;
  peakPowerRpm: number;
  /** Peak torque in newton-metres, and the crank speed it happens at. */
  peakTorqueNm: number;
  peakTorqueRpm: number;
  idleRpm: number;
  redlineRpm: number;
}

export interface VehicleSpec {
  /** Descriptive, never a marque. */
  name: string;
  /** Kerb mass plus a nominal occupant, in kilograms. */
  massKg: number;
  engine: EngineSpec;
  /** Ratios from first gear up; no reverse. */
  gearRatios: number[];
  finalDrive: number;
  /** Fraction of crank torque reaching the wheels. */
  drivetrainEfficiency: number;
  /** Rolling radius under load, in metres. */
  wheelRadiusM: number;
  dragCoefficient: number;
  frontalAreaM2: number;
  /** Rolling resistance coefficient. */
  rollingResistance: number;
  /** Share of weight over the driven axle when stationary and level. */
  drivenAxleLoadShare: number;
  /** Dry-road tyre friction coefficient when new. */
  tyreFriction: number;
  /** Peak deceleration the brakes can demand, m/s². */
  brakeDecelMs2: number;
}

/**
 * How worn each system is, from 1 (as new) down towards 0.
 *
 * Wear is deliberately not a separate simulation: each value scales a
 * parameter the physics already uses. That is what makes a tired car a
 * genuinely different car to drive rather than the same car with a warning
 * light, and it costs nothing — the multiplications were happening anyway.
 */
export interface VehicleCondition {
  /** Compression, timing, general tune — scales torque. */
  engine: number;
  /** Scales the torque the clutch can transmit before it slips. */
  clutch: number;
  /** Tread depth — scales grip, and much more so in the wet. */
  tyres: number;
  /** Pad and disc wear — scales braking force. */
  brakes: number;
  /** Damper health. Unused here; the vertical model reads it. */
  dampers: number;
}

export const CONDITION_NEW: VehicleCondition = {
  engine: 1,
  clutch: 1,
  tyres: 1,
  brakes: 1,
  dampers: 1,
};

/** Road surface, which multiplies available grip. */
export type Surface = 'dry' | 'wet' | 'snow' | 'ice';

const SURFACE_GRIP: Record<Surface, number> = {
  dry: 1,
  wet: 0.7,
  snow: 0.35,
  ice: 0.18,
};

/**
 * Engine torque at a given crank speed.
 *
 * Manufacturers publish two points — peak torque and peak power — and nothing
 * in between. A parabola through both, peaking where the torque peak is
 * quoted, reproduces the shape of a real curve closely enough that top speed
 * and acceleration come out right, which is what we are actually after.
 *
 * The narrower the gap between the two quoted speeds, the flatter the curve;
 * a small two-cylinder with its peaks far apart gets the peaky delivery it
 * really has.
 */
export function engineTorque(engine: EngineSpec, rpm: number): number {
  const clamped = Math.max(engine.idleRpm, Math.min(engine.redlineRpm, rpm));

  // Torque implied by the quoted peak power: P = T * omega.
  const torqueAtPowerPeak = engine.peakPowerW / (engine.peakPowerRpm * RPM_TO_RAD);
  const ratio = torqueAtPowerPeak / engine.peakTorqueNm;

  // Solve the parabola's curvature so it passes through that second point.
  const offset = (engine.peakPowerRpm - engine.peakTorqueRpm) / engine.peakTorqueRpm;
  const curvature = offset === 0 ? 0 : (1 - ratio) / (offset * offset);

  const x = (clamped - engine.peakTorqueRpm) / engine.peakTorqueRpm;
  const normalised = 1 - curvature * x * x;

  // Never let the fitted curve go negative or above the quoted peak.
  return engine.peakTorqueNm * Math.max(0.05, Math.min(1, normalised));
}

/** Crank speed implied by road speed in a given gear. */
export function engineRpmAt(spec: VehicleSpec, speedMs: number, gear: number): number {
  const ratio = spec.gearRatios[gear] * spec.finalDrive;
  const wheelRadPerSec = speedMs / spec.wheelRadiusM;
  return (wheelRadPerSec * ratio) / RPM_TO_RAD;
}

/**
 * Rotating parts have to be spun up as well as the car pushed along, which
 * makes a car behave as though it were heavier — dramatically so in first
 * gear. This is the standard approximation used in vehicle engineering.
 */
function effectiveMass(spec: VehicleSpec, gear: number): number {
  const ratio = spec.gearRatios[gear] * spec.finalDrive;
  return spec.massKg * (1.04 + 0.0025 * ratio * ratio);
}

export interface DriveState {
  /** Metres per second along the road. */
  speed: number;
  gear: number;
  rpm: number;
}

export interface StepInput {
  /** 0..1 how far the accelerator is pressed. */
  throttle: number;
  /** 0..1 how hard the brake is pressed. */
  brake: number;
  /** Road gradient as rise over run; positive is uphill. */
  grade: number;
  surface: Surface;
  dt: number;
}

export interface StepResult {
  /** Newtons actually reaching the road after the grip limit. */
  tractiveForce: number;
  /** Newtons of drag, rolling resistance and gravity opposing motion. */
  resistance: number;
  /** Metres per second squared. */
  acceleration: number;
  /** True when the engine is asking for more grip than the tyres have. */
  wheelspin: boolean;
}

/**
 * Pick a gear the way an unhurried driver would: change up near the power
 * peak, change down when the engine falls out of its usable range.
 */
export function selectGear(spec: VehicleSpec, speedMs: number, current: number): number {
  const upshiftRpm = spec.engine.peakPowerRpm * 0.95;
  const downshiftRpm = Math.max(spec.engine.idleRpm * 1.6, spec.engine.peakTorqueRpm * 0.55);

  let gear = current;
  if (gear < spec.gearRatios.length - 1) {
    if (engineRpmAt(spec, speedMs, gear) > upshiftRpm) gear++;
  }
  if (gear > 0 && engineRpmAt(spec, speedMs, gear) < downshiftRpm) gear--;
  return gear;
}

/**
 * Advance one vehicle by `dt` seconds.
 *
 * Mutates and returns the drive state, and reports the forces so callers can
 * use them for fuel burn, emissions, or — later — for the impact energy of a
 * collision.
 */
export function stepLongitudinal(
  spec: VehicleSpec,
  condition: VehicleCondition,
  state: DriveState,
  input: StepInput,
): StepResult {
  const { dt, grade, surface } = input;

  state.gear = selectGear(spec, state.speed, state.gear);
  state.rpm = Math.max(spec.engine.idleRpm, engineRpmAt(spec, state.speed, state.gear));

  // --- what the engine offers -------------------------------------------
  const ratio = spec.gearRatios[state.gear] * spec.finalDrive;
  const crankTorque = engineTorque(spec.engine, state.rpm) * condition.engine * input.throttle;

  // A tired clutch cannot pass the whole torque; it slips instead, which is
  // exactly what makes a worn car struggle on a hill rather than everywhere.
  const clutchLimit = spec.engine.peakTorqueNm * (0.6 + 0.6 * condition.clutch);
  const deliveredTorque = Math.min(crankTorque, clutchLimit);

  const wheelTorque = deliveredTorque * ratio * spec.drivetrainEfficiency;
  const demandedForce = wheelTorque / spec.wheelRadiusM;

  // --- what the road will take ------------------------------------------
  const grip = spec.tyreFriction * SURFACE_GRIP[surface] * (0.55 + 0.45 * condition.tyres);
  const drivenLoad = spec.massKg * GRAVITY * spec.drivenAxleLoadShare;
  const tractionLimit = grip * drivenLoad;

  const tractiveForce = Math.min(demandedForce, tractionLimit);
  const wheelspin = demandedForce > tractionLimit * 1.001;

  // --- what resists ------------------------------------------------------
  const drag =
    0.5 * AIR_DENSITY * spec.dragCoefficient * spec.frontalAreaM2 * state.speed * state.speed;
  const rolling = spec.rollingResistance * spec.massKg * GRAVITY * Math.cos(Math.atan(grade));
  const gradeForce = spec.massKg * GRAVITY * Math.sin(Math.atan(grade));
  const braking =
    input.brake * spec.brakeDecelMs2 * spec.massKg * (0.5 + 0.5 * condition.brakes);

  const resistance = drag + (state.speed > 0.05 ? rolling : 0) + gradeForce + braking;

  // --- integrate ---------------------------------------------------------
  const acceleration = (tractiveForce - resistance) / effectiveMass(spec, state.gear);
  state.speed = Math.max(0, state.speed + acceleration * dt);

  return { tractiveForce, resistance, acceleration, wheelspin };
}
