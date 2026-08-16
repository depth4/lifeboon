/**
 * Checks the drivable car: steering geometry, the grip limit on cornering,
 * reverse, and the road lookup underneath it all.
 *
 * The longitudinal physics is already validated against published figures in
 * vehicle-physics.ts. What is tested here is everything the driver adds on
 * top — and in particular that the steering limit really is grip, so that a
 * corner behaves differently on ice for the same reason a stop does.
 */

import { DrivenVehicle, type DriveControls } from '../src/sim/driver';
import { RoadIndex } from '../src/sim/roadindex';
import { CITY_MICROCAR } from '../src/sim/vehicles';
import { CONDITION_NEW, GRAVITY, availableGrip } from '../src/sim/vehicle';
import { FlatTerrain } from '../src/terrain/heightfield';
import type { Road, Vec2 } from '../src/world/types';

let failures = 0;
function check(label: string, ok: boolean, detail?: unknown) {
  if (ok) console.log(`  ok   ${label}`);
  else {
    failures++;
    console.log(`  FAIL ${label}${detail !== undefined ? ` -> ${JSON.stringify(detail)}` : ''}`);
  }
}

const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

const controls = (over: Partial<DriveControls> = {}): DriveControls => ({
  throttle: 0, brake: 0, steer: 0, reverse: false, handbrake: false, ...over,
});

function road(id: string, points: Vec2[], over: Partial<Road> = {}): Road {
  return {
    id, points, cls: 'residential', width: 7, lanes: 2, oneway: false, layer: 0,
    bridge: false, tunnel: false, walkable: true, drivable: true,
    isSidewalkLine: false, isCrossing: false, ...over,
  };
}

/** Run the car for `seconds` under fixed controls. */
function drive(car: DrivenVehicle, seconds: number, input: DriveControls): void {
  const DT = 1 / 120;
  for (let t = 0; t < seconds; t += DT) car.update(DT, input);
}

/* --------------------------------------------------------- the road index */

console.log('--- road lookup ---');
{
  // A street running due east through the origin, and one crossing it.
  const index = new RoadIndex(
    [
      road('a', [[-100, 0], [100, 0]]),
      road('b', [[0, -100], [0, 100]]),
    ],
    new FlatTerrain(),
  );

  const onTop = index.nearest(30, 0);
  check('finds the way a point sits on', onTop?.road.id === 'a', onTop?.road.id);
  check('and the point on its centreline',
    onTop !== null && near(onTop.point[0], 30, 0.01) && near(onTop.point[1], 0, 0.01),
    onTop?.point);
  check('with the direction it runs in',
    onTop !== null && near(Math.abs(onTop.direction[0]), 1, 0.01),
    onTop?.direction);

  const beside = index.nearest(30, 12);
  check('measures how far off the centreline you are',
    beside !== null && near(beside.distance, 12, 0.01), beside?.distance);

  const far = index.nearest(4000, 4000, 200);
  check('and gives up beyond the search radius', far === null);

  // The renderer lifts road surfaces clear of the ground; the car must agree.
  check('reports the drawn surface height, not the bare ground',
    onTop !== null && onTop.surfaceY > 0.2 && onTop.surfaceY < 0.4, onTop?.surfaceY);
}

/* ------------------------------------------------------ straight running */

console.log('\n--- going where it points ---');
{
  const car = new DrivenVehicle(CITY_MICROCAR, new FlatTerrain(), null, null);
  // Heading π/2: forward is (sin, cos) = (1, 0), due east.
  car.placeAt(0, 0, Math.PI / 2);
  drive(car, 12, controls({ throttle: 1 }));

  check('accelerates along its heading', car.x > 40 && Math.abs(car.z) < 0.01,
    { x: car.x, z: car.z });
  check('and picks up gears on the way', car.state.gear >= 2, car.state.gear);

  const before = car.state.speed;
  drive(car, 3, controls({ brake: 1 }));
  check('the brake pedal slows it', car.state.speed < before * 0.4,
    { before, after: car.state.speed });

  drive(car, 6, controls({ brake: 1 }));
  check('and brings it to a stop', car.state.speed < 0.01, car.state.speed);
}

/* ------------------------------------------------------- turning circle */

console.log('\n--- steering ---');
{
  // At walking pace nothing limits the steering but the lock itself, so the
  // car should trace the circle the bicycle model predicts: R = L / tan(δ).
  const car = new DrivenVehicle(CITY_MICROCAR, new FlatTerrain(), null, null);
  car.placeAt(0, 0, 0);
  drive(car, 2.5, controls({ throttle: 0.12, steer: 1 }));

  const startHeading = car.heading;
  const sx = car.x;
  const sz = car.z;
  drive(car, 2, controls({ throttle: 0.12, steer: 1 }));

  const turned = Math.abs(car.heading - startHeading);
  const travelled = Math.hypot(car.x - sx, car.z - sz);
  // Chord to radius for a small arc: R ≈ chord / (2 sin(θ/2)).
  const radius = travelled / (2 * Math.sin(turned / 2));
  const geometric = CITY_MICROCAR.wheelbaseM / Math.tan(0.58);

  console.log(`  full lock at walking pace: ${radius.toFixed(2)} m radius ` +
    `(bicycle model says ${geometric.toFixed(2)} m)`);
  check('the slow-speed turning circle matches the steering geometry',
    near(radius, geometric, 0.4), { radius, geometric });

  check('right lock turns right', car.heading < startHeading, car.heading - startHeading);
}

{
  /** Heading change over two seconds at a set speed, so the arc is measurable. */
  function swing(steer: number): number {
    const car = new DrivenVehicle(CITY_MICROCAR, new FlatTerrain(), null, null);
    car.placeAt(0, 0, 0);
    car.state.speed = 3;
    drive(car, 2, controls({ steer }));
    return car.heading;
  }

  check('left lock turns left', swing(-1) > 0.5, swing(-1));
  check('right lock turns right by the same amount',
    near(swing(1), -swing(-1), 0.01), { right: swing(1), left: swing(-1) });
  check('straight ahead stays straight', Math.abs(swing(0)) < 1e-9, swing(0));
}

/* --------------------------------------------------- the grip limit */

console.log('\n--- grip limits the corner, not a speed curve ---');
{
  // A deliberately enormous expanse of tarmac, so the car stays on the road
  // for the whole measurement instead of running off the edge mid-corner.
  const pad = new RoadIndex(
    [road('pad', [[0, -3000], [0, 3000]], { width: 800 })],
    new FlatTerrain(),
  );

  /**
   * Full lock at a set speed: the lateral acceleration the car actually
   * achieves, alongside what pure steering geometry would have demanded.
   */
  function corneringAt(speedMs: number, surface: 'dry' | 'ice', onRoad = true) {
    const car = new DrivenVehicle(
      CITY_MICROCAR, new FlatTerrain(), onRoad ? pad : null, null,
    );
    car.surface = surface;
    car.placeAt(0, 0, 0);
    car.state.speed = speedMs;
    // Let the steering reach full lock, then measure over a short window.
    drive(car, 1, controls({ steer: 1 }));
    const h0 = car.heading;
    const seconds = 0.5;
    drive(car, seconds, controls({ steer: 1 }));

    const v = car.state.speed;
    const achieved = (Math.abs(car.heading - h0) / seconds) * v;
    const geometric = (v * v * Math.tan(0.58)) / CITY_MICROCAR.wheelbaseM;
    return { achieved, geometric, understeer: car.telemetry().understeer };
  }

  const grip = availableGrip(CITY_MICROCAR, CONDITION_NEW, 'dry');
  const ceiling = grip * GRAVITY * 0.85;
  console.log(`  the tyres are good for ${ceiling.toFixed(2)} m/s² of cornering`);

  // Below the limit the car goes exactly where the front wheels point.
  const slow = corneringAt(3, 'dry');
  console.log(`  3 m/s: wants ${slow.geometric.toFixed(2)}, gets ${slow.achieved.toFixed(2)} m/s²`);
  check('under the limit the car follows its steering geometry exactly',
    near(slow.achieved, slow.geometric, 0.05), slow);
  check('and nothing is reported as lost grip', !slow.understeer);

  // Above it, the wheels are turned further than the car will follow.
  const fast = corneringAt(25, 'dry');
  console.log(`  25 m/s: wants ${fast.geometric.toFixed(1)}, gets ${fast.achieved.toFixed(2)} m/s²`);
  check('over the limit the corner is capped by grip, not geometry',
    near(fast.achieved, ceiling, 0.3), { got: fast.achieved, ceiling });
  check('which is exactly what understeer is', fast.understeer);

  const icy = corneringAt(25, 'ice');
  console.log(`  25 m/s on ice: gets ${icy.achieved.toFixed(2)} m/s²`);
  check('and ice caps it far lower', icy.achieved < fast.achieved * 0.3,
    { icy: icy.achieved, dry: fast.achieved });

  const offRoad = corneringAt(25, 'dry', false);
  console.log(`  25 m/s off the tarmac: gets ${offRoad.achieved.toFixed(2)} m/s²`);
  check('leaving the road costs grip in a corner too',
    offRoad.achieved < fast.achieved * 0.75, { offRoad: offRoad.achieved, fast: fast.achieved });

}

/* ----------------------------------------------------------- reverse */

console.log('\n--- reverse ---');
{
  const car = new DrivenVehicle(CITY_MICROCAR, new FlatTerrain(), null, null);
  car.placeAt(0, 0, 0);
  drive(car, 6, controls({ throttle: 1, reverse: true }));

  check('reversing moves the car backwards', car.z < -5, car.z);
  check('and shows R rather than a gear number', car.telemetry().gearLabel === 'R');

  const reverseKmh = car.state.speed * 3.6;
  console.log(`  flat out in reverse: ${reverseKmh.toFixed(1)} km/h`);
  check('a very short ratio and a rev limiter cap reverse at a crawl',
    reverseKmh > 10 && reverseKmh < 45, reverseKmh);

  // Same steering input, opposite result: the whole reason reversing is hard.
  const back = new DrivenVehicle(CITY_MICROCAR, new FlatTerrain(), null, null);
  back.placeAt(0, 0, 0);
  drive(back, 3, controls({ throttle: 0.3, steer: 1, reverse: true }));

  const fwd = new DrivenVehicle(CITY_MICROCAR, new FlatTerrain(), null, null);
  fwd.placeAt(0, 0, 0);
  drive(fwd, 3, controls({ throttle: 0.3, steer: 1 }));

  check('steering right reverses the other way round',
    Math.sign(back.heading) === -Math.sign(fwd.heading) && Math.abs(back.heading) > 0.1,
    { reversing: back.heading, forwards: fwd.heading });
}

/* -------------------------------------------------------- the handbrake */

console.log('\n--- handbrake ---');
{
  const car = new DrivenVehicle(CITY_MICROCAR, new FlatTerrain(), null, null);
  car.placeAt(0, 0, 0);
  car.state.speed = 15;
  drive(car, 1, controls({ steer: 1, handbrake: true }));
  check('locked wheels do not steer', Math.abs(car.heading) < 0.01, car.heading);
  check('and they stop the car', car.state.speed < 8, car.state.speed);
}

/* ------------------------------------------------------------- gradient */

console.log('\n--- hills ---');
{
  // A synthetic slope: the terrain interface is all the car reads.
  const slope = {
    heightAt: (_x: number, z: number) => -z * 0.08,
    slopeAt: () => 0.08,
    minHeight: -100, maxHeight: 100, hasRelief: true, resolution: 10,
  };

  // A road up it, so the car is on tarmac and the answer has to match the
  // figure vehicle-physics.ts already validated for an 8% climb.
  const hillRoad = new RoadIndex(
    [road('hill', [[0, 3000], [0, -3000]], { width: 30 })],
    slope,
  );

  const up = new DrivenVehicle(CITY_MICROCAR, slope, hillRoad, null);
  // Heading π faces −z, which climbs.
  up.placeAt(0, 0, Math.PI);
  drive(up, 60, controls({ throttle: 1 }));

  const down = new DrivenVehicle(CITY_MICROCAR, slope, hillRoad, null);
  down.placeAt(0, 0, 0);
  drive(down, 60, controls({ throttle: 1 }));

  console.log(`  8% grade: ${(up.state.speed * 3.6).toFixed(1)} km/h up, ` +
    `${(down.state.speed * 3.6).toFixed(1)} km/h down`);
  check('the car reads the gradient it is on', near(up.telemetry().gradePercent, 8, 0.5),
    up.telemetry().gradePercent);
  check('climbing it reproduces the validated 76 km/h',
    near(up.state.speed * 3.6, 76, 3), up.state.speed * 3.6);
  check('and downhill it goes faster than it can on the flat',
    down.state.speed * 3.6 > 118, down.state.speed * 3.6);
  check('the body pitches with the slope', up.pitch < -0.05, up.pitch);
}

console.log(failures ? `\n${failures} FAILURE(S)` : '\nall checks passed');
process.exit(failures ? 1 : 0);
