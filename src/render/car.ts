/**
 * The car you see.
 *
 * Built entirely from the vehicle specification — wheelbase, track, body
 * dimensions, wheel radius — so a different car really is a different shape on
 * screen rather than the same box with a new colour. Nothing here copies a
 * registered body shape: it is a generic two-box silhouette with a raked
 * screen, which is what almost every small hatchback of the last forty years
 * looks like in outline and what none of them owns.
 *
 * Local axes match the simulation's: +Z is forward, +X is the car's left, +Y
 * is up, and the origin sits on the road surface between the wheels.
 */

import * as THREE from 'three';
import type { DrivenVehicle } from '../sim/driver';
import type { VehicleSpec } from '../sim/vehicle';

/** Ground clearance under the sills, in metres. */
const CLEARANCE = 0.16;

/** Plain, unbranded paint. */
const BODY_COLORS = [0xb8c0c6, 0x5d7f9c, 0x9c6b5a, 0x6f7f63, 0xc4b391, 0x8a8f96];

export class CarModel {
  readonly group = new THREE.Group();

  private readonly wheels: THREE.Object3D[] = [];
  private readonly frontWheels: THREE.Object3D[] = [];
  private readonly headMat: THREE.MeshStandardMaterial;
  private readonly tailMat: THREE.MeshStandardMaterial;
  private readonly materials: THREE.Material[] = [];
  private readonly geometries: THREE.BufferGeometry[] = [];

  constructor(spec: VehicleSpec, colorIndex = 0) {
    this.group.name = 'car';
    // Yaw first, then pitch and roll in the car's own frame — otherwise a car
    // on a side slope leans in a direction that has nothing to do with the hill.
    this.group.rotation.order = 'YXZ';

    const L = spec.lengthM;
    const W = spec.widthM;
    const H = spec.heightM;
    const halfW = W / 2;
    const belt = H * 0.6;

    const bodyMat = this.material({
      color: BODY_COLORS[colorIndex % BODY_COLORS.length],
      roughness: 0.42,
      metalness: 0.12,
    });
    const glassMat = this.material({ color: 0x2b3138, roughness: 0.22, metalness: 0.3 });
    const tyreMat = this.material({ color: 0x1d1d1f, roughness: 0.95 });
    const rimMat = this.material({ color: 0x9aa0a6, roughness: 0.4, metalness: 0.6 });
    const trimMat = this.material({ color: 0x35383c, roughness: 0.7 });

    this.headMat = this.material({
      color: 0xfff2d8, roughness: 0.25, emissive: 0xffe9c0, emissiveIntensity: 0,
    });
    this.tailMat = this.material({
      color: 0x8c2020, roughness: 0.4, emissive: 0xff2a1e, emissiveIntensity: 0,
    });

    // --- lower body: widest at the belt line, tucked in at the sills --------
    // The tuck is what lets the wheels show. Run the sides straight down and
    // the tyres disappear inside the bodywork, which is exactly what the first
    // version of this did — a car with no visible wheels reads as a brick.
    const body = this.hexahedron(
      [
        [halfW * 0.8, CLEARANCE, L * 0.48], [-halfW * 0.8, CLEARANCE, L * 0.48],
        [-halfW * 0.8, CLEARANCE, -L * 0.48], [halfW * 0.8, CLEARANCE, -L * 0.48],
      ],
      [
        [halfW, belt, L * 0.5], [-halfW, belt, L * 0.5],
        [-halfW, belt, -L * 0.5], [halfW, belt, -L * 0.5],
      ],
    );
    this.add(body, bodyMat);

    // --- greenhouse: raked screen at the front, upright tailgate behind -----
    const cabin = this.hexahedron(
      [
        [halfW * 0.93, belt, L * 0.16], [-halfW * 0.93, belt, L * 0.16],
        [-halfW * 0.93, belt, -L * 0.44], [halfW * 0.93, belt, -L * 0.44],
      ],
      [
        [halfW * 0.8, H, -L * 0.05], [-halfW * 0.8, H, -L * 0.05],
        [-halfW * 0.8, H, -L * 0.41], [halfW * 0.8, H, -L * 0.41],
      ],
    );
    this.add(cabin, glassMat);

    // Roof panel, so the greenhouse does not read as one slab of glass.
    const roof = new THREE.BoxGeometry(W * 0.78, 0.05, L * 0.34);
    roof.translate(0, H, -L * 0.23);
    this.add(roof, bodyMat);

    // --- bumpers ------------------------------------------------------------
    for (const end of [1, -1]) {
      const bumper = new THREE.BoxGeometry(W * 0.86, H * 0.16, 0.14);
      bumper.translate(0, CLEARANCE + H * 0.14, end * L * 0.5);
      this.add(bumper, trimMat);
    }

    // --- lights -------------------------------------------------------------
    const lampY = belt * 0.78;
    for (const side of [1, -1]) {
      const head = new THREE.BoxGeometry(W * 0.26, H * 0.12, 0.07);
      head.translate(side * halfW * 0.62, lampY, L * 0.5);
      this.add(head, this.headMat);

      const tail = new THREE.BoxGeometry(W * 0.22, H * 0.11, 0.06);
      tail.translate(side * halfW * 0.66, lampY, -L * 0.5);
      this.add(tail, this.tailMat);
    }

    // --- wheels -------------------------------------------------------------
    const r = spec.wheelRadiusM;
    const tyreWidth = Math.max(0.13, W * 0.11);
    // Outer face of the tyre almost flush with the widest point of the body,
    // which puts it clearly proud of the tucked-in sill below it.
    const track = halfW * 0.99 - tyreWidth * 0.5;
    const axleZ = spec.wheelbaseM / 2;

    for (const front of [true, false]) {
      for (const side of [1, -1]) {
        // A group, not a mesh: the front wheels steer about Y and every wheel
        // spins about X, and 'YXZ' applies the steer first so the axle is
        // already pointing the right way when the tyre turns on it.
        const wheel = new THREE.Group();
        wheel.rotation.order = 'YXZ';

        const tyre = new THREE.CylinderGeometry(r, r, tyreWidth, 16);
        tyre.rotateZ(Math.PI / 2);
        const tyreMesh = new THREE.Mesh(tyre, tyreMat);
        tyreMesh.castShadow = true;
        this.geometries.push(tyre);
        wheel.add(tyreMesh);

        // A disc just proud of the tyre so the wheel visibly turns.
        const rim = new THREE.CylinderGeometry(r * 0.58, r * 0.58, tyreWidth * 1.04, 12);
        rim.rotateZ(Math.PI / 2);
        const rimMesh = new THREE.Mesh(rim, rimMat);
        this.geometries.push(rim);
        wheel.add(rimMesh);
        // One flat marker on the rim, so rotation reads even on a plain disc.
        const spoke = new THREE.BoxGeometry(tyreWidth * 1.06, r * 1.05, r * 0.16);
        const spokeMesh = new THREE.Mesh(spoke, trimMat);
        this.geometries.push(spoke);
        wheel.add(spokeMesh);

        wheel.position.set(side * track, r, front ? axleZ : -axleZ);
        this.group.add(wheel);
        this.wheels.push(wheel);
        if (front) this.frontWheels.push(wheel);
      }
    }
  }

  /** Copy the simulation's pose onto the mesh. */
  sync(car: DrivenVehicle, braking: boolean, night: number): void {
    this.group.position.set(car.x, car.y, car.z);
    this.group.rotation.set(car.pitch, car.heading, car.roll);

    for (const wheel of this.wheels) wheel.rotation.x = car.wheelSpin;
    for (const wheel of this.frontWheels) wheel.rotation.y = car.steerAngle;

    // Lights come on with the dusk, and the brake lamps are always brighter
    // than the tail lamps — that difference is the whole signal.
    this.headMat.emissiveIntensity = night * 1.6;
    this.tailMat.emissiveIntensity = braking ? 2.2 : night * 0.9;
  }

  dispose(): void {
    for (const geometry of this.geometries) geometry.dispose();
    for (const material of this.materials) material.dispose();
    this.group.clear();
    // Take the now-empty group out of the scene too, or swapping cars leaves
    // a trail of them behind.
    this.group.removeFromParent();
  }

  /* ------------------------------------------------------------- helpers */

  private material(params: THREE.MeshStandardMaterialParameters): THREE.MeshStandardMaterial {
    const mat = new THREE.MeshStandardMaterial(params);
    this.materials.push(mat);
    return mat;
  }

  private add(geometry: THREE.BufferGeometry, material: THREE.Material): void {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    this.geometries.push(geometry);
    this.group.add(mesh);
  }

  /**
   * A six-sided solid from eight explicit corners: four at the bottom, four at
   * the top, each running front-left, front-right, back-right, back-left.
   *
   * A plain box cannot rake a windscreen or tuck in a sill, and both of those
   * are most of what stops a car looking like a shipping container.
   */
  private hexahedron(bottom: number[][], top: number[][]): THREE.BufferGeometry {
    const v = [...bottom, ...top];
    // Wound counter-clockwise seen from outside, so back-face culling keeps
    // the solid rather than the inside of it.
    const faces = [
      [4, 6, 5], [4, 7, 6],   // roof
      [0, 1, 2], [0, 2, 3],   // floor
      [0, 5, 1], [0, 4, 5],   // front
      [2, 6, 7], [2, 7, 3],   // back
      [0, 3, 7], [0, 7, 4],   // left
      [1, 5, 6], [1, 6, 2],   // right
    ];

    const positions = new Float32Array(faces.length * 9);
    let p = 0;
    for (const face of faces) {
      for (const index of face) {
        positions[p++] = v[index][0];
        positions[p++] = v[index][1];
        positions[p++] = v[index][2];
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    return geometry;
  }
}
