/**
 * Mechanic 1, in the window: a hillside, and a road that presses it.
 *
 * The same scene the test measures, so what you see and what the numbers say
 * are about one thing. Drag to turn, scroll to zoom.
 */

import { Ground } from './world/ground';
import { Road } from './world/road';
import { View } from './render/view';
import { groundMesh, roadMesh } from './render/meshes';

declare const __BUILD_STAMP__: string;

const land = (x: number, z: number): number =>
  x * 0.09 + z * 0.03
  + 9 * Math.exp(-((x - 40) ** 2 + (z + 20) ** 2) / 1400)
  - 7 * Math.exp(-((x + 45) ** 2 + (z - 30) ** 2) / 1800);

const ground = new Ground(300, 2, land);
const road = new Road({
  centre: [[-120, -60], [-40, -20], [30, 10], [110, 60]],
  width: 7,
  maxGrade: 0.06,
  blend: 6,
}, ground);
road.build(ground);

const view = new View(document.getElementById('viewport') as HTMLCanvasElement);
view.scene.add(groundMesh(ground));
view.scene.add(roadMesh(road));
view.lookAt(0, road.levelAt(road.chainage[road.chainage.length - 1] / 2), 0, 240);
view.start();

const caption = document.getElementById('caption');
if (caption) {
  caption.textContent = `Mechanic 1 — a road presses the ground. `
    + `${road.chainage[road.chainage.length - 1].toFixed(0)} m long, `
    + `climbing ${(road.level[road.level.length - 1] - road.level[0]).toFixed(1)} m, `
    + `never steeper than ${(road.steepest * 100).toFixed(1)}%. · ${__BUILD_STAMP__}`;
}
