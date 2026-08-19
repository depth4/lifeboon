/**
 * A car you can actually drive.
 *
 * This is the thin layer between the pedals and the world: it turns steering
 * input into a change of heading, works out what the ground is doing under the
 * wheels, and hands the result to the longitudinal model that already knows
 * about engines, gears and grip. Everything that makes one car different from
 * another lives in the specification, not here.
 *
 * Two things are honestly modelled rather than faked:
 *
 *   - **Steering is limited by grip, not by a magic speed curve.** A corner of
 *     radius R at speed v demands a lateral acceleration of v²/R, and the road
 *     can only supply µg. Asking for more is understeer — the wheels are
 *     turned further than the car will follow. That falls out of the same
 *     friction number that decides wheelspin and stopping distance, so ice and
 *     bald tyres make the car vague in corners for the same reason they make
 *     it slow to stop.
 *
 *   - **The surface under the wheels is looked up, not assumed.** On asphalt
 *     the car uses its specified rolling resistance and full grip; off the
 *     road it gets neither, so leaving the street is a decision with a cost.
 *
 * What is deliberately NOT here yet: tyre slip angles, weight transfer,
 * suspension travel, and any collision that is not a building wall. A car that
 * loses grip here understeers and stops turning; it does not slide.
 */

import type { BuildingIndex } from '../render/buildings';
import type { Terrain } from '../terrain/heightfield';
import type { RoadIndex, RoadHit } from './roadindex';
import {
  CONDITION_NEW,
  GRAVITY,
  availableGrip,
  stepLongitudinal,
  type DriveState,
  type Surface,
  type VehicleCondition,
  type VehicleSpec,
} from './vehicle';

/** Steering lock at the road wheel. About 33°, typical for a small car. */
const MAX_STEER_RAD = 0.58;
/** How fast the front wheels can be turned, in radians of lock per second. */
const STEER_RATE = 2.6;
/** How fast they centre themselves when the driver lets go. */
const STEER_RETURN_RATE = 3.4;

/** Rolling resistance off the tarmac, as a multiple of the road figure. */
const OFFROAD_ROLLING = 3.2;
/**
 * Grip off the tarmac, as a fraction of the road figure.
 *
 * This used to be 0.62 *and* the surface was separately downgraded a step for
 * the longitudinal model, which counted the same penalty twice: drifting a
 * metre wide in a corner fell off a cliff you could feel. One penalty now.
 */
const OFFROAD_GRIP = 0.72;
/** How far from a centreline still counts as being on the road, beyond half-width. */
const ROAD_EDGE_TOLERANCE = 1.2;

export interface DriveControls {
  /** 0..1 accelerator. */
  throttle: number;
  /** 0..1 brake. */
  brake: number;
  /** −1 full left … +1 full right. */
  steer: number;
  /** Reverse gear. Only engages below walking pace. */
  reverse: boolean;
  /** Handbrake: locks the wheels regardless of the brake pedal. */
  handbrake: boolean;
}

export const NO_CONTROLS: DriveControls = {
  throttle: 0, brake: 0, steer: 0, reverse: false, handbrake: false,
};

export interface DriveTelemetry {
  speedKmh: number;
  gear: number;
  /** Negative when reversing, so the HUD can print "R". */
  gearLabel: string;
  rpm: number;
  /** Fraction of the redline, for a rev counter. */
  revFraction: number;
  wheelspin: boolean;
  /** True when the driver is asking for more cornering than the tyres have. */
  understeer: boolean;
  /** Road gradient ahead, as a percentage. */
  gradePercent: number;
  onRoad: boolean;
  /** Name of the street under the wheels, when the map has one. */
  streetName: string | null;
  surface: Surface;
}

export class DrivenVehicle {
  readonly spec: VehicleSpec;
  condition: VehicleCondition;
  /** Weather under the wheels. One value for the whole car, for now. */
  surface: Surface = 'dry';

  /** Position in projected metres, and the height of the surface it rests on. */
  x = 0;
  z = 0;
  y = 0;
  /** Radians. Forward is (sin heading, 0, cos heading). */
  heading = 0;

  /** Road-wheel angle, positive to the left so it matches `heading`. */
  steerAngle = 0;

  readonly state: DriveState = { speed: 0, gear: 0, rpm: 0 };
  /** +1 driving forwards, −1 reversing. */
  direction: 1 | -1 = 1;

  /** Body attitude from the ground and from the driver's inputs. */
  pitch = 0;
  roll = 0;
  /** Wheel rotation for the renderer, in radians. */
  wheelSpin = 0;

  private lastAccel = 0;
  private lastLateral = 0;
  private lastHit: RoadHit | null = null;
  private understeering = false;
  private spinning = false;
  private grade = 0;

  /** Reverse runs through the same physics, with a one-speed gearbox. */
  private readonly reverseSpec: VehicleSpec;

  constructor(
    spec: VehicleSpec,
    private readonly terrain: Terrain,
    private readonly roads: RoadIndex | null,
    private readonly buildings: BuildingIndex | null,
    condition: VehicleCondition = CONDITION_NEW,
  ) {
    this.spec = spec;
    this.condition = { ...condition };
    this.reverseSpec = { ...spec, gearRatios: [spec.reverseRatio] };
  }

  /** Put the car down somewhere, stopped and pointing along `heading`. */
  placeAt(x: number, z: number, heading: number): void {
    this.x = x;
    this.z = z;
    this.heading = heading;
    this.state.speed = 0;
    this.state.gear = 0;
    this.state.rpm = this.spec.engine.idleRpm;
    this.direction = 1;
    this.steerAngle = 0;
    this.lastHit = this.roads?.nearest(x, z, 60) ?? null;
    this.y = this.restingHeight(x, z);
  }

  get speedKmh(): number {
    return this.state.speed * 3.6 * this.direction;
  }

  /**
   * Advance the car by `dt` real seconds.
   *
   * Long frames are split up: a car doing 90 km/h covers 2.5 m in a single
   * 100 ms hitch, which is enough to step straight through a wall or to swing
   * the steering integration well past where it should be.
   */
  update(dt: number, controls: DriveControls): void {
    const MAX_STEP = 1 / 60;
    let remaining = Math.min(dt, 0.25);
    while (remaining > 1e-4) {
      const step = Math.min(MAX_STEP, remaining);
      this.advance(step, controls);
      remaining -= step;
    }
  }

  private advance(dt: number, controls: DriveControls): void {
    if (dt <= 0) return;

    const forwardX = Math.sin(this.heading);
    const forwardZ = Math.cos(this.heading);

    // --- what is under the wheels ------------------------------------------
    const hit = this.roads?.nearest(this.x, this.z, 90) ?? null;
    this.lastHit = hit;
    const onRoad =
      hit !== null && hit.distance <= hit.road.width / 2 + ROAD_EDGE_TOLERANCE;

    const grip = availableGrip(this.spec, this.condition, this.surface)
      * (onRoad ? 1 : OFFROAD_GRIP);
    const totalGrip = grip * GRAVITY;

    // --- gearbox direction --------------------------------------------------
    // Reverse only engages once the car has effectively stopped, which is both
    // realistic and what stops the driver flipping direction at 50 km/h.
    if (this.state.speed < 0.6) {
      this.direction = controls.reverse ? -1 : 1;
    }

    // --- the slope the car is actually on -----------------------------------
    // Sampled a few metres either side along the direction the car points, so
    // it is the gradient of the road rather than of one elevation pixel.
    const ahead = this.restingHeight(this.x + forwardX * 3, this.z + forwardZ * 3);
    const behind = this.restingHeight(this.x - forwardX * 3, this.z - forwardZ * 3);
    this.grade = (ahead - behind) / 6;

    // --- longitudinal -------------------------------------------------------
    // Off the tarmac the car drags: same physics, worse numbers.
    const spec = this.direction === -1 ? this.reverseSpec : this.spec;
    const effective: VehicleSpec = onRoad
      ? spec
      : { ...spec, rollingResistance: spec.rollingResistance * OFFROAD_ROLLING };

    // The handbrake locks the wheels; a locked wheel gives all the deceleration
    // the surface allows and no steering, which is exactly the point of it.
    const brake = Math.max(controls.brake, controls.handbrake ? 1 : 0);

    const result = stepLongitudinal(effective, this.condition, this.state, {
      throttle: controls.throttle,
      brake,
      // Gravity resists whichever way you are travelling, so reversing up the
      // same hill is the same fight.
      grade: this.grade * this.direction,
      surface: this.surface,
      dt,
    });
    this.spinning = result.wheelspin;
    this.lastAccel = result.acceleration;

    // --- steering -----------------------------------------------------------
    const target = -clamp(controls.steer, -1, 1) * MAX_STEER_RAD;
    const rate = Math.abs(target) < Math.abs(this.steerAngle) ? STEER_RETURN_RATE : STEER_RATE;
    this.steerAngle += clamp(target - this.steerAngle, -rate * dt, rate * dt);

    // A locked wheel does not steer.
    const steerable = controls.handbrake ? 0 : this.steerAngle;

    // Grip limit on the corner: a = v² tan(δ) / L must stay under what the
    // tyres have left.
    //
    // The friction circle: a tyre has one grip budget and cornering, driving
    // and braking all spend from it. Standing on the throttle or the brake
    // genuinely costs you turn-in; coasting gives the whole budget back. This
    // replaces a flat 15% cornering tax that applied even when the car was
    // doing nothing else, and which made the thing feel like it refused to
    // turn at all.
    const v = this.state.speed;
    const longitudinalUse = Math.min(totalGrip, Math.max(
      result.tractiveForce / spec.massKg,
      brake * spec.brakeDecelMs2 * (0.5 + 0.5 * this.condition.brakes),
    ));
    const maxLateral = Math.sqrt(
      Math.max(0.2, totalGrip * totalGrip - longitudinalUse * longitudinalUse),
    );
    let usedSteer = steerable;
    const demanded = (v * v * Math.abs(Math.tan(steerable))) / this.spec.wheelbaseM;
    this.understeering = false;
    if (demanded > maxLateral && v > 1) {
      const allowed = Math.atan((maxLateral * this.spec.wheelbaseM) / (v * v));
      usedSteer = Math.sign(steerable) * Math.min(Math.abs(steerable), allowed);
      this.understeering = demanded > maxLateral * 1.02;
    }

    // Kinematic bicycle model, referenced at the rear axle. Travelling
    // backwards flips the sign, which is why reversing turns the other way.
    const signedSpeed = v * this.direction;
    const headingRate = (signedSpeed / this.spec.wheelbaseM) * Math.tan(usedSteer);
    this.heading += headingRate * dt;
    this.lastLateral = signedSpeed * headingRate;

    // --- move ---------------------------------------------------------------
    const step = signedSpeed * dt;
    const nx = this.x + forwardX * step;
    const nz = this.z + forwardZ * step;

    if (this.blocked(nx, nz)) {
      // No crash model yet: the car is stopped by the wall rather than crumpled
      // by it. Better a hard stop than driving through somebody's kitchen.
      this.state.speed = 0;
      this.lastAccel = 0;
    } else {
      this.x = nx;
      this.z = nz;
    }

    this.wheelSpin += (signedSpeed / this.spec.wheelRadiusM) * dt;

    // --- attitude -----------------------------------------------------------
    this.y = this.restingHeight(this.x, this.z);

    // Cross-slope: the ground under the left wheels against the right.
    const leftX = Math.cos(this.heading);
    const leftZ = -Math.sin(this.heading);
    const halfTrack = this.spec.widthM / 2;
    const leftY = this.restingHeight(this.x + leftX * halfTrack, this.z + leftZ * halfTrack);
    const rightY = this.restingHeight(this.x - leftX * halfTrack, this.z - leftZ * halfTrack);

    // Static attitude from the ground, plus the dive and lean the driver is
    // causing. This is a stand-in for suspension, not a model of it: it moves
    // the body the way the forces would, without any spring or damper behind
    // it. `condition.dampers` will mean something once there is.
    const staticPitch = -Math.atan(this.grade);
    const staticRoll = Math.atan((leftY - rightY) / this.spec.widthM);
    const dynamicPitch = clamp(-this.lastAccel * 0.010, -0.05, 0.05);
    const dynamicRoll = clamp(this.lastLateral * 0.012, -0.06, 0.06);

    const ease = Math.min(1, dt * 8);
    this.pitch += (staticPitch + dynamicPitch - this.pitch) * ease;
    this.roll += (staticRoll + dynamicRoll - this.roll) * ease;
  }

  telemetry(): DriveTelemetry {
    const onRoad =
      this.lastHit !== null &&
      this.lastHit.distance <= this.lastHit.road.width / 2 + ROAD_EDGE_TOLERANCE;
    return {
      speedKmh: Math.abs(this.state.speed) * 3.6,
      gear: this.state.gear,
      gearLabel: this.direction === -1 ? 'R' : String(this.state.gear + 1),
      rpm: this.state.rpm,
      revFraction: clamp(this.state.rpm / this.spec.engine.redlineRpm, 0, 1.08),
      wheelspin: this.spinning,
      understeer: this.understeering,
      gradePercent: this.grade * 100,
      onRoad,
      streetName: onRoad ? this.lastHit?.road.name ?? null : null,
      surface: this.surface,
    };
  }

  /**
   * Height the car rests at over a point: the street surface where there is
   * one, otherwise the bare ground.
   *
   * "Street" means the whole built width — carriageway, kerb, verge, pavement
   * — and not just the asphalt. The earth beneath a street is cut a third of a
   * metre below its crown to carry it, and the only thing covering that cut is
   * the drawn street itself. Asking for the terrain one centimetre past the
   * kerb therefore dropped the car into a trench it could see the far side of:
   * half a wheel buried in ground that the picture showed as a pavement.
   *
   * The grip test is separate and still uses the carriageway, because driving
   * onto the verge should feel like driving onto a verge.
   */
  private restingHeight(x: number, z: number): number {
    const hit = this.roads?.nearest(x, z, 40);
    if (hit && hit.distance <= hit.streetHalfWidth + ROAD_EDGE_TOLERANCE) return hit.surfaceY;
    return this.terrain.heightAt(x, z);
  }

  /**
   * True if the move into (x, z) should be refused.
   *
   * A car already standing in a footprint is let out. Footprints and streets
   * do overlap in real map data — arcades, gateways, service roads through
   * courtyards — and a car that started life inside one would otherwise be
   * welded to the spot forever with no way to tell why.
   */
  private blocked(x: number, z: number): boolean {
    if (!this.buildings) return false;
    if (!this.overlapsBuilding(x, z)) return false;
    return !this.overlapsBuilding(this.x, this.z);
  }

  /** Whether the body, at this position and heading, intersects a footprint. */
  private overlapsBuilding(x: number, z: number): boolean {
    if (!this.buildings) return false;
    const fx = Math.sin(this.heading);
    const fz = Math.cos(this.heading);
    const lx = Math.cos(this.heading);
    const lz = -Math.sin(this.heading);
    const halfL = this.spec.lengthM / 2;
    const halfW = this.spec.widthM / 2;

    // The four corners of the body. Testing the centre alone lets a car park
    // itself halfway through a wall before anything notices.
    for (const [a, b] of [[1, 1], [1, -1], [-1, 1], [-1, -1]] as const) {
      const cx = x + fx * halfL * a + lx * halfW * b;
      const cz = z + fz * halfL * a + lz * halfW * b;
      if (this.buildings.at(cx, cz)) return true;
    }
    return false;
  }
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}
