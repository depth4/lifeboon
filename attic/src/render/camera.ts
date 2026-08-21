/**
 * Camera control.
 *
 * The whole point of the project is the range: you should be able to sit two
 * kilometres above the city and then come down to somebody's eye level without
 * a loading screen or a mode switch. That means
 *   - exponential zoom, so each wheel notch is a constant *ratio*, not a
 *     constant number of metres;
 *   - near/far planes recomputed from the current altitude, otherwise depth
 *     precision falls apart at one end of the range or the other;
 *   - pan and rotate speeds proportional to distance, so the controls feel the
 *     same whether you are looking at a district or a doorstep.
 */

import * as THREE from 'three';
import type { Terrain } from '../terrain/heightfield';
import { FlatTerrain } from '../terrain/heightfield';

export type CameraMode = 'orbit' | 'walk' | 'follow' | 'drive';

const MIN_DISTANCE = 1.8;
const MAX_DISTANCE = 9000;
const WALK_EYE_HEIGHT = 1.68;

export class CameraController {
  readonly camera: THREE.PerspectiveCamera;
  mode: CameraMode = 'orbit';

  /** Point the orbit camera looks at, on the ground. */
  readonly target = new THREE.Vector3(0, 0, 0);
  private distance = 900;
  private targetDistance = 900;
  private yaw = Math.PI * 0.25;
  private pitch = 0.95;

  /** Walk-mode state. */
  private readonly walkPos = new THREE.Vector3(0, WALK_EYE_HEIGHT, 0);
  private walkYaw = 0;
  private walkPitch = 0;
  private readonly keys = new Set<string>();

  /** Follow-mode subject position, updated externally each frame. */
  private readonly followPoint = new THREE.Vector3();
  followDistance = 14;

  /** Drive-mode chase camera: where the car is and which way it points. */
  private readonly drivePoint = new THREE.Vector3();
  private driveHeading = 0;
  private driveSpeed = 0;
  /** Distance behind the car, adjustable with the wheel. */
  driveDistance = 8.5;
  /** Look-around offset, which eases back to straight-behind when released. */
  private driveYawOffset = 0;
  private drivePitchOffset = 0;
  /** The eye position, lagged so the camera swings rather than snaps. */
  private readonly driveEye = new THREE.Vector3();
  private driveEyeValid = false;

  private dragging: 'rotate' | 'pan' | null = null;
  private lastX = 0;
  private lastY = 0;
  private readonly domElement: HTMLElement;
  private disposed = false;

  /** Minimum eye height above the ground for the orbit camera, in metres. */
  groundClearance = 2.4;
  /** Ground the camera stands on; swapped whenever a new place is loaded. */
  private terrain: Terrain = new FlatTerrain();

  setTerrain(terrain: Terrain): void {
    this.terrain = terrain;
  }

  constructor(domElement: HTMLElement, aspect: number) {
    this.domElement = domElement;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.5, 20000);
    this.updateProjection();
    this.attach();
  }

  private attach(): void {
    const el = this.domElement;
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    el.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    el.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  dispose(): void {
    this.disposed = true;
    const el = this.domElement;
    el.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    el.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  /* ------------------------------------------------------------- input */

  private onPointerDown = (e: PointerEvent): void => {
    if (e.button === 1) return;
    // Left drag rotates, right drag (or shift) pans.
    this.dragging = e.button === 2 || e.shiftKey ? 'pan' : 'rotate';
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.dragging || this.disposed) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    if (this.mode === 'walk') {
      this.walkYaw -= dx * 0.0035;
      this.walkPitch = clamp(this.walkPitch - dy * 0.0035, -1.4, 1.4);
      return;
    }

    if (this.mode === 'drive') {
      // Look around the car while driving; let go and the view swings back
      // behind it, which is what every chase camera worth using does.
      this.driveYawOffset = clamp(this.driveYawOffset - dx * 0.006, -2.6, 2.6);
      this.drivePitchOffset = clamp(this.drivePitchOffset - dy * 0.004, -0.5, 0.9);
      return;
    }

    if (this.dragging === 'rotate') {
      this.yaw -= dx * 0.005;
      // Never quite reach the poles: straight down loses all sense of depth.
      this.pitch = clamp(this.pitch - dy * 0.005, 0.06, 1.52);
    } else {
      // Pan across the ground plane, scaled so a drag moves the same fraction
      // of the screen no matter how high up we are.
      const scale = this.distance * 0.0016;
      const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
      const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
      this.target.addScaledVector(right, -dx * scale);
      this.target.addScaledVector(forward, dy * scale);
    }
  };

  private onPointerUp = (): void => {
    this.dragging = null;
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    if (this.mode === 'walk') return;
    // Constant ratio per notch: the same gesture works at 5 m and at 5 km.
    const factor = Math.exp(Math.sign(e.deltaY) * Math.min(1, Math.abs(e.deltaY) / 320) * 0.55);
    if (this.mode === 'drive') {
      this.driveDistance = clamp(this.driveDistance * factor, 3, 120);
    } else if (this.mode === 'follow') {
      this.followDistance = clamp(this.followDistance * factor, 3, 400);
    } else {
      this.targetDistance = clamp(this.targetDistance * factor, MIN_DISTANCE, MAX_DISTANCE);
    }
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
    this.keys.add(e.code);
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };

  /* ------------------------------------------------------------ modes */

  setMode(mode: CameraMode): void {
    if (mode === this.mode) return;
    if (mode === 'drive') {
      this.driveEyeValid = false;
      this.driveYawOffset = 0;
      this.drivePitchOffset = 0;
    } else if (this.mode === 'drive') {
      // Step back out to where the car was, so the view does not teleport.
      this.target.copy(this.drivePoint);
      this.yaw = this.driveHeading + Math.PI;
      this.targetDistance = Math.max(40, this.driveDistance * 4);
      this.distance = this.targetDistance;
    }
    if (mode === 'walk') {
      // Step down to where the camera is currently looking.
      const ground = this.terrain.heightAt(this.target.x, this.target.z);
      this.walkPos.set(this.target.x, ground + WALK_EYE_HEIGHT, this.target.z);
      this.walkYaw = this.yaw;
      this.walkPitch = -0.05;
    } else if (this.mode === 'walk') {
      this.target.set(
        this.walkPos.x,
        this.terrain.heightAt(this.walkPos.x, this.walkPos.z),
        this.walkPos.z,
      );
      this.yaw = this.walkYaw;
      this.targetDistance = Math.max(this.targetDistance, 60);
    }
    this.mode = mode;
  }

  setFollowPoint(x: number, z: number): void {
    this.followPoint.set(x, this.terrain.heightAt(x, z), z);
  }

  /** Move the view to a place, keeping the current angle. */
  goTo(x: number, z: number, distance?: number): void {
    const ground = this.terrain.heightAt(x, z);
    this.target.set(x, ground, z);
    this.walkPos.set(x, ground + WALK_EYE_HEIGHT, z);
    if (distance !== undefined) {
      this.targetDistance = clamp(distance, MIN_DISTANCE, MAX_DISTANCE);
      this.distance = this.targetDistance;
    }
  }

  /**
   * Metres above the ground directly below, not above sea level — on a hill
   * town the second number tells you nothing useful about how close you are.
   */
  get altitude(): number {
    const ground = this.terrain.heightAt(this.camera.position.x, this.camera.position.z);
    return Math.max(0, this.camera.position.y - ground);
  }

  get currentDistance(): number {
    if (this.mode === 'follow') return this.followDistance;
    if (this.mode === 'drive') return this.driveDistance;
    return this.distance;
  }

  update(dt: number): void {
    if (this.mode === 'walk') this.updateWalk(dt);
    else if (this.mode === 'drive') this.updateDrive(dt);
    else this.updateOrbit(dt);
    this.updateProjection();
  }

  /**
   * Where the car is, in world metres, plus which way it points and how fast
   * it is going. Fed in every frame by the simulation.
   */
  setDrivePose(x: number, y: number, z: number, heading: number, speedMs: number): void {
    this.drivePoint.set(x, y, z);
    this.driveHeading = heading;
    this.driveSpeed = speedMs;
  }

  /**
   * Chase camera.
   *
   * Two things make this feel like driving rather than like dragging a box
   * around. The eye lags the car, so it swings wide on a corner instead of
   * being welded behind the boot; and it pulls back and drops as speed rises,
   * which is what gives a sense of pace on a screen with no wind and no noise.
   */
  private updateDrive(dt: number): void {
    // Let go of the mouse and the view returns behind the car.
    if (!this.dragging) {
      const settle = 1 - Math.pow(0.06, dt);
      this.driveYawOffset -= this.driveYawOffset * settle;
      this.drivePitchOffset -= this.drivePitchOffset * settle;
    }

    const speedPull = Math.min(1, Math.abs(this.driveSpeed) / 30);
    const dist = this.driveDistance * (1 + speedPull * 0.28);
    const height = Math.max(1.7, this.driveDistance * 0.42) * (1 - speedPull * 0.18);

    const yaw = this.driveHeading + this.driveYawOffset;
    // Forward is (sin, cos) to match the simulation, so behind is its negative.
    const wanted = new THREE.Vector3(
      this.drivePoint.x - Math.sin(yaw) * dist,
      this.drivePoint.y + height + this.drivePitchOffset * dist * 0.6,
      this.drivePoint.z - Math.cos(yaw) * dist,
    );

    if (!this.driveEyeValid) {
      this.driveEye.copy(wanted);
      this.driveEyeValid = true;
    } else {
      // Lag, but never more than a car length behind where it should be, or a
      // fast corner leaves the camera looking at nothing.
      const lag = 1 - Math.pow(0.0009, dt);
      this.driveEye.lerp(wanted, lag);
      const drift = this.driveEye.distanceTo(wanted);
      if (drift > dist * 0.8) {
        this.driveEye.lerp(wanted, 1 - (dist * 0.8) / drift);
      }
    }

    // Never let the camera end up inside the hill behind the car.
    const ground = this.terrain.heightAt(this.driveEye.x, this.driveEye.z);
    this.driveEye.y = Math.max(this.driveEye.y, ground + 1.2);

    this.camera.position.copy(this.driveEye);
    // Look slightly ahead of the car rather than at it: you drive where you
    // are going, not where you are.
    const leadDistance = Math.min(14, 2 + Math.abs(this.driveSpeed) * 0.5);
    this.camera.lookAt(
      this.drivePoint.x + Math.sin(this.driveHeading) * leadDistance,
      this.drivePoint.y + 1.1,
      this.drivePoint.z + Math.cos(this.driveHeading) * leadDistance,
    );

    // Shadows and fog follow the camera target, so keep it on the car.
    this.target.set(this.drivePoint.x, this.drivePoint.y, this.drivePoint.z);
  }

  private updateOrbit(dt: number): void {
    // Ease towards the requested distance so the wheel feels smooth.
    const k = 1 - Math.pow(0.0015, dt);
    this.distance += (this.targetDistance - this.distance) * k;

    const anchor = this.mode === 'follow' ? this.followPoint : this.target;
    const dist = this.mode === 'follow' ? this.followDistance : this.distance;
    // Orbit around the ground under the target, not around sea level, or the
    // camera sinks into a hillside as soon as you pan uphill.
    anchor.y = this.terrain.heightAt(anchor.x, anchor.z);

    // Keyboard panning works in orbit mode too.
    if (this.mode === 'orbit') {
      const speed = this.distance * 0.6 * dt;
      const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
      const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
      if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) this.target.addScaledVector(forward, speed);
      if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) this.target.addScaledVector(forward, -speed);
      if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) this.target.addScaledVector(right, -speed);
      if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) this.target.addScaledVector(right, speed);
    }

    // Keep the eye above the pavement by raising the *angle* rather than
    // clamping the height. Clamping the height alone leaves the camera lying
    // on the ground looking along it; forcing a shallow minimum pitch as the
    // distance shrinks gives the natural "lean in and look down" instead, and
    // the user's chosen pitch is preserved for when they zoom back out.
    const minPitch = Math.asin(Math.min(1, this.groundClearance / Math.max(dist, this.groundClearance)));
    const pitch = Math.max(this.pitch, minPitch);

    const cosPitch = Math.cos(pitch);
    this.camera.position.set(
      anchor.x + dist * cosPitch * Math.sin(this.yaw),
      anchor.y + dist * Math.sin(pitch),
      anchor.z + dist * cosPitch * Math.cos(this.yaw),
    );
    this.camera.lookAt(anchor.x, anchor.y + (this.mode === 'follow' ? 1.1 : 0), anchor.z);
  }

  private updateWalk(dt: number): void {
    const sprint = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
    const speed = (sprint ? 9 : 2.4) * dt;
    const forward = new THREE.Vector3(-Math.sin(this.walkYaw), 0, -Math.cos(this.walkYaw));
    const right = new THREE.Vector3(Math.cos(this.walkYaw), 0, -Math.sin(this.walkYaw));

    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) this.walkPos.addScaledVector(forward, speed);
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) this.walkPos.addScaledVector(forward, -speed);
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) this.walkPos.addScaledVector(right, -speed);
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) this.walkPos.addScaledVector(right, speed);
    if (this.keys.has('KeyQ')) this.walkPos.y -= speed;
    if (this.keys.has('KeyE')) this.walkPos.y += speed;

    const ground = this.terrain.heightAt(this.walkPos.x, this.walkPos.z);
    this.walkPos.y = Math.max(ground + WALK_EYE_HEIGHT, this.walkPos.y);
    // Walking downhill should bring you down with the slope, not leave you
    // hovering at the height of the last hill you stood on.
    if (this.walkPos.y > ground + WALK_EYE_HEIGHT + 0.01) {
      this.walkPos.y += (ground + WALK_EYE_HEIGHT - this.walkPos.y) * Math.min(1, dt * 6);
    }
    this.camera.position.copy(this.walkPos);

    const look = new THREE.Vector3(
      Math.sin(this.walkYaw) * -Math.cos(this.walkPitch),
      Math.sin(this.walkPitch),
      -Math.cos(this.walkYaw) * Math.cos(this.walkPitch),
    );
    this.camera.lookAt(this.walkPos.clone().add(look));
    this.target.set(
      this.walkPos.x,
      this.terrain.heightAt(this.walkPos.x, this.walkPos.z),
      this.walkPos.z,
    );
  }

  /**
   * Depth range from altitude.
   *
   * Precision in a depth buffer falls off with the ratio of far to near, and
   * it is the NEAR plane that dominates: at 8 cm near and 3 km far, two
   * surfaces a kilometre away cannot be told apart until they are tens of
   * centimetres apart. That is what made road markings and land cover flicker
   * as soon as the camera turned towards the horizon from street level.
   *
   * So the near plane now has a real floor, and the far plane is tied to how
   * far you can actually see rather than to a fixed number — there is no point
   * keeping 3 km of range alive when fog closes the view at 1.6 km.
   */
  private updateProjection(): void {
    const alt = Math.max(1, this.camera.position.y);
    const near = clamp(alt * 0.05, 0.6, 20);
    const far = clamp(Math.max(alt * 40, this.currentDistance * 12), 1500, 50000);
    if (this.camera.near !== near || this.camera.far !== far) {
      this.camera.near = near;
      this.camera.far = far;
      this.camera.updateProjectionMatrix();
    }
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}
