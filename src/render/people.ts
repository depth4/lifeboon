/**
 * Drawing the population.
 *
 * Thousands of walking figures have to cost about as much as one, so everybody
 * shares a single InstancedMesh and the walk cycle happens on the GPU: each
 * vertex carries a part id (torso, left leg, right arm…), and the vertex shader
 * swings limbs around the hip and shoulder from a per-instance phase. No
 * skinning, no per-agent objects, one draw call.
 *
 * Only people who are outdoors are ever submitted. Somebody at home or at work
 * is inside a building, and the simulator does not render interiors.
 */

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Agent } from '../sim/population';
import type { Terrain } from '../terrain/heightfield';
import { FlatTerrain } from '../terrain/heightfield';

const PART_BODY = 0;
const PART_LEG_L = 1;
const PART_LEG_R = 2;
const PART_ARM_L = 3;
const PART_ARM_R = 4;

const HIP_Y = 0.88;
const SHOULDER_Y = 1.42;

/** Clothing tones — muted, varied, nothing branded. */
const PALETTE = [
  0x37415a, 0x6b4f3a, 0x8a3f3a, 0x2f5d4a, 0x4a4a52, 0x7a6a45,
  0x59496b, 0x2e4a63, 0x8a7a63, 0x455a3c, 0x6d3f52, 0x3d3d44,
];
const SKIN = [0xf0d5bd, 0xe0b795, 0xc99a72, 0xa9764f, 0x855c3c, 0x5d3f2a];

function tagged(geom: THREE.BufferGeometry, part: number): THREE.BufferGeometry {
  const count = geom.getAttribute('position').count;
  const parts = new Float32Array(count).fill(part);
  geom.setAttribute('aPart', new THREE.BufferAttribute(parts, 1));
  // Merging needs a consistent attribute set; drop anything we do not use.
  geom.deleteAttribute('uv');
  return geom;
}

/**
 * A blocky little figure, ~1.72 m tall, facing +Z. Roughly 300 triangles: too
 * coarse to identify anybody, which is the point — these are statistical
 * inhabitants, not residents of the real address you are looking at.
 */
function personGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  const torso = new THREE.BoxGeometry(0.36, 0.56, 0.22);
  torso.translate(0, 1.14, 0);
  parts.push(tagged(torso, PART_BODY));

  const neck = new THREE.BoxGeometry(0.12, 0.07, 0.12);
  neck.translate(0, 1.45, 0);
  parts.push(tagged(neck, PART_BODY));

  const head = new THREE.SphereGeometry(0.115, 10, 8);
  head.scale(1, 1.15, 0.95);
  head.translate(0, 1.58, 0);
  parts.push(tagged(head, PART_BODY));

  const hips = new THREE.BoxGeometry(0.32, 0.2, 0.2);
  hips.translate(0, 0.94, 0);
  parts.push(tagged(hips, PART_BODY));

  for (const [side, part] of [[-1, PART_LEG_L], [1, PART_LEG_R]] as const) {
    const leg = new THREE.BoxGeometry(0.14, HIP_Y, 0.16);
    leg.translate(side * 0.09, HIP_Y / 2, 0);
    parts.push(tagged(leg, part));
  }

  for (const [side, part] of [[-1, PART_ARM_L], [1, PART_ARM_R]] as const) {
    const arm = new THREE.BoxGeometry(0.1, 0.56, 0.12);
    arm.translate(side * 0.235, SHOULDER_Y - 0.28, 0);
    parts.push(tagged(arm, part));
  }

  const merged = mergeGeometries(parts, false);
  for (const p of parts) p.dispose();
  if (!merged) throw new Error('Failed to build the person geometry');
  return merged;
}

export interface PeopleRendererOptions {
  /** Hard cap on figures drawn at once. */
  maxInstances?: number;
}

export class PeopleRenderer {
  readonly mesh: THREE.InstancedMesh;
  private readonly material: THREE.MeshStandardMaterial;
  private readonly geometry: THREE.BufferGeometry;
  private readonly phase: THREE.InstancedBufferAttribute;
  private readonly gait: THREE.InstancedBufferAttribute;
  private readonly maxInstances: number;
  private readonly dummy = new THREE.Object3D();
  private readonly color = new THREE.Color();
  /** instance index -> agent, so a click can be traced back to a person. */
  private readonly instanceAgents: Agent[] = [];
  /** Adaptive cut-off distance used when there are more people than slots. */
  private cullDistance = 4000;
  /** Ground the crowd stands on. */
  private terrain: Terrain = new FlatTerrain();

  setTerrain(terrain: Terrain): void {
    this.terrain = terrain;
  }

  constructor(opts: PeopleRendererOptions = {}) {
    this.maxInstances = opts.maxInstances ?? 5000;
    this.geometry = personGeometry();

    const phaseArray = new Float32Array(this.maxInstances);
    const gaitArray = new Float32Array(this.maxInstances);
    this.phase = new THREE.InstancedBufferAttribute(phaseArray, 1);
    this.gait = new THREE.InstancedBufferAttribute(gaitArray, 1);
    this.phase.setUsage(THREE.DynamicDrawUsage);
    this.gait.setUsage(THREE.DynamicDrawUsage);
    this.geometry.setAttribute('aPhase', this.phase);
    this.geometry.setAttribute('aGait', this.gait);

    this.material = new THREE.MeshStandardMaterial({
      roughness: 0.85,
      metalness: 0,
      vertexColors: false,
    });

    this.material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
           attribute float aPart;
           attribute float aPhase;
           attribute float aGait;

           // Rotate a point about the X axis around a pivot height.
           vec3 swingAround(vec3 p, float pivotY, float angle) {
             float c = cos(angle);
             float s = sin(angle);
             p.y -= pivotY;
             float ny = p.y * c - p.z * s;
             float nz = p.y * s + p.z * c;
             p.y = ny + pivotY;
             p.z = nz;
             return p;
           }

           float limbAngle(float part, float phase, float gait) {
             if (part < 0.5) return 0.0;
             // Legs and the opposite arm swing together.
             float dir = (part == 1.0 || part == 4.0) ? 1.0 : -1.0;
             float amp = (part < 2.5) ? 0.62 : 0.40;
             return sin(phase) * amp * gait * dir;
           }`,
        )
        .replace(
          '#include <beginnormal_vertex>',
          `vec3 objectNormal = vec3( normal );
           {
             float a = limbAngle(aPart, aPhase, aGait);
             if (a != 0.0) {
               float pivot = (aPart < 2.5) ? ${HIP_Y.toFixed(2)} : ${SHOULDER_Y.toFixed(2)};
               objectNormal = swingAround(objectNormal + vec3(0.0, pivot, 0.0), pivot, a) - vec3(0.0, pivot, 0.0);
             }
           }`,
        )
        .replace(
          '#include <begin_vertex>',
          `vec3 transformed = vec3( position );
           {
             float a = limbAngle(aPart, aPhase, aGait);
             if (a != 0.0) {
               float pivot = (aPart < 2.5) ? ${HIP_Y.toFixed(2)} : ${SHOULDER_Y.toFixed(2)};
               transformed = swingAround(transformed, pivot, a);
             }
             // Slight bob in time with the stride.
             transformed.y += abs(sin(aPhase)) * 0.035 * aGait;
           }`,
        );
    };
    // Materials with different shader source must not share a program cache key.
    this.material.customProgramCacheKey = () => 'lifeboon-walker-v1';

    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.maxInstances);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.count = 0;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;
    this.mesh.frustumCulled = false;
    this.mesh.name = 'people';

    // Per-instance colour: clothing for the body, skin for head and hands.
    // One colour per instance is all InstancedMesh gives us, so the figure is
    // tinted as a whole and the head is left slightly lighter by the shader.
    const colors = new Float32Array(this.maxInstances * 3);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
    this.mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
  }

  /**
   * Rebuild the instance buffers from the currently-outdoors agents.
   * `realTime` drives the walk cycle so legs move at a believable cadence
   * regardless of how fast the simulation clock is running.
   */
  update(visible: Agent[], cameraPos: THREE.Vector3, realTime: number): void {
    const matrixArray = this.mesh.instanceMatrix.array as Float32Array;
    const colorArray = this.mesh.instanceColor!.array as Float32Array;
    const phaseArray = this.phase.array as Float32Array;
    const gaitArray = this.gait.array as Float32Array;

    // Keep the drawn crowd within budget by trimming the far end, easing the
    // threshold so figures do not pop in and out on the boundary.
    if (visible.length > this.maxInstances) this.cullDistance *= 0.94;
    else if (this.cullDistance < 4000) this.cullDistance *= 1.03;
    const cullSq = this.cullDistance * this.cullDistance;

    let count = 0;
    this.instanceAgents.length = 0;

    for (const agent of visible) {
      if (count >= this.maxInstances) break;
      const dx = agent.x - cameraPos.x;
      const dz = agent.z - cameraPos.z;
      if (dx * dx + dz * dz > cullSq) continue;

      const walking = agent.path !== null;
      // Sampling per person per frame is a few thousand bilinear lookups —
      // far cheaper than carrying a height on every nav-graph node and
      // keeping it in step with the terrain.
      this.dummy.position.set(agent.x, this.terrain.heightAt(agent.x, agent.z), agent.z);
      this.dummy.rotation.set(0, agent.heading, 0);
      this.dummy.scale.setScalar(agent.age < 14 ? 0.72 + agent.age * 0.02 : 1);
      this.dummy.updateMatrix();
      this.dummy.matrix.toArray(matrixArray, count * 16);

      this.color.set(PALETTE[agent.colorIndex % PALETTE.length]);
      // Nudge towards a skin tone so heads and hands do not read as cloth.
      this.color.lerp(new THREE.Color(SKIN[agent.id % SKIN.length]), 0.18);
      colorArray[count * 3] = this.color.r;
      colorArray[count * 3 + 1] = this.color.g;
      colorArray[count * 3 + 2] = this.color.b;

      phaseArray[count] = agent.phase + realTime * 5.6;
      gaitArray[count] = walking ? 1 : 0.08;

      this.instanceAgents.push(agent);
      count++;
    }

    this.mesh.count = count;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor!.needsUpdate = true;
    this.phase.needsUpdate = true;
    this.gait.needsUpdate = true;
  }

  agentAtInstance(instanceId: number): Agent | null {
    return this.instanceAgents[instanceId] ?? null;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
    this.mesh.dispose();
  }
}
