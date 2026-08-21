/**
 * A window onto the world: a scene, a light, and a camera you can drag.
 *
 * Small on purpose. Everything about how the world *looks* belongs to the
 * things being drawn; this only puts them in front of you.
 */

import * as THREE from 'three';

export class View {
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;
  /** Where the camera looks, and where it sits relative to that. */
  private readonly focus = new THREE.Vector3();
  private distance = 260;
  private yaw = 0.7;
  private pitch = 0.55;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene.background = new THREE.Color(0xbfd0dc);
    this.scene.fog = new THREE.Fog(0xbfd0dc, 400, 1400);

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.5, 4000);

    const sun = new THREE.DirectionalLight(0xfff2e0, 2.1);
    sun.position.set(-120, 180, 90);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const s = 220;
    sun.shadow.camera.left = -s;
    sun.shadow.camera.right = s;
    sun.shadow.camera.top = s;
    sun.shadow.camera.bottom = -s;
    sun.shadow.camera.far = 700;
    this.scene.add(sun);
    this.scene.add(new THREE.HemisphereLight(0xcfe0ee, 0x5d5a4a, 1.0));

    addEventListener('resize', () => this.resize());
    this.drag(canvas);
    this.resize();
  }

  lookAt(x: number, y: number, z: number, distance: number): void {
    this.focus.set(x, y, z);
    this.distance = distance;
    this.place();
  }

  start(): void {
    const frame = () => {
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(frame);
    };
    frame();
  }

  private place(): void {
    const r = Math.cos(this.pitch) * this.distance;
    this.camera.position.set(
      this.focus.x + Math.sin(this.yaw) * r,
      this.focus.y + Math.sin(this.pitch) * this.distance,
      this.focus.z + Math.cos(this.yaw) * r,
    );
    this.camera.lookAt(this.focus);
  }

  private resize(): void {
    this.renderer.setSize(innerWidth, innerHeight, false);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private drag(canvas: HTMLCanvasElement): void {
    let last: { x: number; y: number } | null = null;
    canvas.addEventListener('pointerdown', (e) => { last = { x: e.clientX, y: e.clientY }; });
    addEventListener('pointerup', () => { last = null; });
    addEventListener('pointermove', (e) => {
      if (!last) return;
      this.yaw -= (e.clientX - last.x) * 0.005;
      this.pitch = Math.max(0.08, Math.min(1.45, this.pitch + (e.clientY - last.y) * 0.004));
      last = { x: e.clientX, y: e.clientY };
      this.place();
    });
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.distance = Math.max(20, Math.min(1200, this.distance * (1 + e.deltaY * 0.001)));
      this.place();
    }, { passive: false });
  }
}
