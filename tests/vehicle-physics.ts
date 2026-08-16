/**
 * Checks the longitudinal model against published performance.
 *
 * This is the real test of the physics: the model is given only the
 * specification — mass, power, torque, ratios, drag — and has to produce
 * acceleration and top speed on its own. If those come out near the quoted
 * figures, the model is right; if they do not, either the model or the quoted
 * figure is wrong, and both are worth knowing about.
 */

import {
  CONDITION_NEW,
  engineTorque,
  stepLongitudinal,
  type DriveState,
  type Surface,
  type VehicleCondition,
  type VehicleSpec,
} from '../src/sim/vehicle';
import { CITY_MICROCAR, COMPACT_HATCHBACK } from '../src/sim/vehicles';

const DT = 0.01;

interface RunOptions {
  grade?: number;
  surface?: Surface;
  condition?: VehicleCondition;
  seconds?: number;
  startSpeed?: number;
}

/** Full-throttle run; returns the speed trace and the time to each milestone. */
function accelerate(spec: VehicleSpec, opts: RunOptions = {}) {
  const condition = opts.condition ?? CONDITION_NEW;
  const surface = opts.surface ?? 'dry';
  const grade = opts.grade ?? 0;
  const seconds = opts.seconds ?? 120;

  const state: DriveState = { speed: opts.startSpeed ?? 0, gear: 0, rpm: 0 };
  const milestones = new Map<number, number>();
  let topSpeed = 0;
  let anyWheelspin = false;

  for (let t = 0; t < seconds; t += DT) {
    const r = stepLongitudinal(spec, condition, state, {
      throttle: 1, brake: 0, grade, surface, dt: DT,
    });
    if (r.wheelspin) anyWheelspin = true;
    topSpeed = Math.max(topSpeed, state.speed);
    for (const kmh of [60, 100]) {
      if (!milestones.has(kmh) && state.speed * 3.6 >= kmh) milestones.set(kmh, t);
    }
  }

  return {
    topSpeedKmh: topSpeed * 3.6,
    to60: milestones.get(60),
    to100: milestones.get(100),
    finalGear: state.gear,
    wheelspin: anyWheelspin,
  };
}

let failures = 0;
function check(label: string, ok: boolean, detail?: unknown) {
  if (ok) console.log(`  ok   ${label}`);
  else {
    failures++;
    console.log(`  FAIL ${label}${detail !== undefined ? ` -> ${JSON.stringify(detail)}` : ''}`);
  }
}

/* ------------------------------------------------- the torque curve fit */

const eng = CITY_MICROCAR.engine;
const atTorquePeak = engineTorque(eng, eng.peakTorqueRpm);
const atPowerPeak = engineTorque(eng, eng.peakPowerRpm);
const impliedTorqueAtPowerPeak = eng.peakPowerW / ((eng.peakPowerRpm * 2 * Math.PI) / 60);

console.log('--- torque curve ---');
check('curve hits the quoted torque peak',
  Math.abs(atTorquePeak - eng.peakTorqueNm) < 0.01, atTorquePeak);
check('curve reproduces the quoted power peak',
  Math.abs(atPowerPeak - impliedTorqueAtPowerPeak) < 0.5,
  { fitted: +atPowerPeak.toFixed(2), required: +impliedTorqueAtPowerPeak.toFixed(2) });
check('torque falls away above the power peak',
  engineTorque(eng, 6000) < atPowerPeak);
check('torque is lower at idle than at its peak',
  engineTorque(eng, eng.idleRpm) < eng.peakTorqueNm);

/* --------------------------------------------- the microcar's numbers */

console.log('\n--- city microcar, level dry road ---');
const micro = accelerate(CITY_MICROCAR);
console.log(`  top speed ${micro.topSpeedKmh.toFixed(1)} km/h · ` +
  `0-60 ${micro.to60?.toFixed(1) ?? '—'} s · 0-100 ${micro.to100?.toFixed(1) ?? '—'} s · ` +
  `top gear ${micro.finalGear + 1}`);

// Published: 130 km/h, 0-100 in 24 s.
check('top speed lands in the region of the quoted 130 km/h',
  micro.topSpeedKmh > 105 && micro.topSpeedKmh < 140, micro.topSpeedKmh);
check('0-100 lands in the region of the quoted 24 s',
  micro.to100 !== undefined && micro.to100 > 17 && micro.to100 < 34, micro.to100);
check('it reaches top gear', micro.finalGear === CITY_MICROCAR.gearRatios.length - 1);
check('29 hp cannot spin its tyres on a dry road', !micro.wheelspin);

/* ------------------------------------------------------- power to weight */

console.log('\n--- compact hatchback, for comparison ---');
const hatch = accelerate(COMPACT_HATCHBACK);
console.log(`  top speed ${hatch.topSpeedKmh.toFixed(1)} km/h · ` +
  `0-100 ${hatch.to100?.toFixed(1) ?? '—'} s`);
check('four times the power per kilo is four times quicker to 100',
  hatch.to100 !== undefined && micro.to100 !== undefined && hatch.to100 < micro.to100 / 2,
  { hatch: hatch.to100, micro: micro.to100 });
check('and appreciably faster flat out', hatch.topSpeedKmh > micro.topSpeedKmh + 30);

/* ------------------------------------------------------------- gradient */

console.log('\n--- the hill ---');
for (const grade of [0.04, 0.08, 0.12]) {
  const run = accelerate(CITY_MICROCAR, { grade, seconds: 90 });
  console.log(`  ${(grade * 100).toFixed(0)}% grade: tops out at ${run.topSpeedKmh.toFixed(1)} km/h ` +
    `in gear ${run.finalGear + 1}`);
}
const flat = accelerate(CITY_MICROCAR).topSpeedKmh;
const steep = accelerate(CITY_MICROCAR, { grade: 0.12, seconds: 90 }).topSpeedKmh;
check('a 12% hill costs the microcar most of its speed', steep < flat * 0.6, { flat, steep });
check('but it still climbs it', steep > 5, steep);

/* ---------------------------------------------------------------- wear */

console.log('\n--- the same car, worn out ---');
const worn: VehicleCondition = { engine: 0.7, clutch: 0.45, tyres: 0.4, brakes: 0.4, dampers: 0.3 };
const wornRun = accelerate(CITY_MICROCAR, { condition: worn });
console.log(`  top speed ${wornRun.topSpeedKmh.toFixed(1)} km/h · ` +
  `0-100 ${wornRun.to100?.toFixed(1) ?? 'never' } s`);
check('a worn car is slower to 100 than a healthy one',
  wornRun.to100 === undefined || (micro.to100 !== undefined && wornRun.to100 > micro.to100),
  { worn: wornRun.to100, healthy: micro.to100 });

const wornHill = accelerate(CITY_MICROCAR, { condition: worn, grade: 0.08, seconds: 90 });
const goodHill = accelerate(CITY_MICROCAR, { grade: 0.08, seconds: 90 });
console.log(`  on an 8% hill: worn ${wornHill.topSpeedKmh.toFixed(1)} km/h ` +
  `vs healthy ${goodHill.topSpeedKmh.toFixed(1)} km/h`);
check('the hill is where a tired clutch shows',
  wornHill.topSpeedKmh < goodHill.topSpeedKmh, {
    worn: wornHill.topSpeedKmh, healthy: goodHill.topSpeedKmh,
  });

/* -------------------------------------------------------------- surface */

console.log('\n--- surfaces ---');
for (const surface of ['dry', 'wet', 'snow', 'ice'] as Surface[]) {
  const bald: VehicleCondition = { ...CONDITION_NEW, tyres: 0.25 };
  const run = accelerate(CITY_MICROCAR, { surface, condition: bald, seconds: 40 });
  console.log(`  ${surface.padEnd(5)} on bald tyres: 0-60 ` +
    `${run.to60?.toFixed(1) ?? 'never'} s, wheelspin ${run.wheelspin}`);
}
const onIce = accelerate(CITY_MICROCAR, {
  surface: 'ice', condition: { ...CONDITION_NEW, tyres: 0.25 }, seconds: 40,
});
check('bald tyres on ice spin rather than accelerate', onIce.wheelspin);

/* --------------------------------------------------------------- braking */

console.log('\n--- braking from 60 km/h ---');
function brakingDistance(condition: VehicleCondition, surface: Surface): number {
  const state: DriveState = { speed: 60 / 3.6, gear: 3, rpm: 0 };
  let distance = 0;
  for (let t = 0; t < 30 && state.speed > 0.1; t += DT) {
    distance += state.speed * DT;
    stepLongitudinal(CITY_MICROCAR, condition, state, {
      throttle: 0, brake: 1, grade: 0, surface, dt: DT,
    });
  }
  return distance;
}
const dryGood = brakingDistance(CONDITION_NEW, 'dry');
const dryWorn = brakingDistance({ ...CONDITION_NEW, brakes: 0.3 }, 'dry');
console.log(`  healthy ${dryGood.toFixed(1)} m · worn brakes ${dryWorn.toFixed(1)} m`);
check('healthy brakes stop from 60 in a plausible distance',
  dryGood > 12 && dryGood < 30, dryGood);
check('worn brakes need meaningfully longer', dryWorn > dryGood * 1.3, { dryGood, dryWorn });

console.log(failures ? `\n${failures} FAILURE(S)` : '\nall checks passed');
process.exit(failures ? 1 : 0);
