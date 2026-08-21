/**
 * Vehicle definitions.
 *
 * Numbers here are published technical specifications — mass, power, torque,
 * gear ratios — which are facts and carry no rights of their own. What is
 * deliberately absent is anything that does: no marque, no model name, no
 * badge, and nothing in the eventual 3D model will copy a registered body
 * shape. A car here is described by what it does, not by whose it is.
 *
 * Where a figure is not published (the shape of the torque curve between its
 * two quoted peaks, drag coefficient, centre of gravity) it is estimated from
 * standard engineering practice, and said so in the comment. Guesses are
 * marked as guesses.
 */

import type { VehicleSpec } from './vehicle';

/**
 * A late-1980s Soviet two-cylinder city microcar: 0.65 litres, under 30 hp,
 * 635 kg, front-wheel drive, four speeds.
 *
 * Published: mass 635 kg kerb; 21.5 kW at 5600 rpm; 44.1 N·m at 3400 rpm;
 * gear ratios 3.70 / 2.06 / 1.27 / 0.90; final drive 4.54.
 *
 * Estimated: drag coefficient 0.44 for an upright two-box body of the period;
 * frontal area from roughly 1.42 m wide by 1.40 m tall at 85% fill; rolling
 * radius 0.25 m for the standard 135/80 R12 fitment; 62% of weight over the
 * front axle, typical for a transverse front-drive layout. Wheelbase 2.18 m
 * and the body dimensions are the commonly quoted ones for this class and
 * should be confirmed against a primary source.
 */
export const CITY_MICROCAR: VehicleSpec = {
  name: 'City microcar, 0.65 L twin',
  // Kerb mass plus one occupant.
  massKg: 635 + 75,
  engine: {
    peakPowerW: 21_500,
    peakPowerRpm: 5600,
    peakTorqueNm: 44.1,
    peakTorqueRpm: 3400,
    idleRpm: 850,
    redlineRpm: 6000,
  },
  gearRatios: [3.7, 2.06, 1.27, 0.9],
  reverseRatio: 3.5,
  finalDrive: 4.54,
  // Manual gearbox and short driveshafts; losses are modest.
  drivetrainEfficiency: 0.9,
  wheelRadiusM: 0.25,
  wheelbaseM: 2.18,
  lengthM: 3.2,
  widthM: 1.42,
  heightM: 1.4,
  dragCoefficient: 0.44,
  frontalAreaM2: 1.69,
  // Bias-ply-era tyres on a rough surface.
  rollingResistance: 0.014,
  drivenAxleLoadShare: 0.62,
  tyreFriction: 0.85,
  brakeDecelMs2: 7.5,
};

/**
 * A modern compact hatchback, for comparison: 1.6 litres, four cylinders,
 * about 1200 kg. Included so the physics can be checked against something
 * with a completely different power-to-weight ratio, and so the difference
 * between vehicles is visible from the first prototype.
 */
export const COMPACT_HATCHBACK: VehicleSpec = {
  name: 'Compact hatchback, 1.6 L four',
  massKg: 1180 + 75,
  engine: {
    peakPowerW: 78_000,
    peakPowerRpm: 5800,
    peakTorqueNm: 148,
    peakTorqueRpm: 4000,
    idleRpm: 800,
    redlineRpm: 6500,
  },
  gearRatios: [3.64, 1.95, 1.36, 1.03, 0.82],
  reverseRatio: 3.58,
  finalDrive: 3.94,
  drivetrainEfficiency: 0.92,
  wheelRadiusM: 0.3,
  wheelbaseM: 2.6,
  lengthM: 4.2,
  widthM: 1.75,
  heightM: 1.47,
  dragCoefficient: 0.32,
  frontalAreaM2: 2.1,
  rollingResistance: 0.011,
  drivenAxleLoadShare: 0.61,
  tyreFriction: 1.0,
  brakeDecelMs2: 9.5,
};

export const VEHICLES = [CITY_MICROCAR, COMPACT_HATCHBACK];
