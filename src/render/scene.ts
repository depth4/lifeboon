/**
 * Scene, sky and light.
 *
 * The sun is driven by the simulation clock, so the shadows across a street at
 * nine in the morning point where they would actually point at that latitude
 * and time of year. At dusk the key light fades to moonlight, the ambient goes
 * blue, and the windows come on.
 */

import * as THREE from 'three';

/** Sky gradient stops for, in order: night, twilight, low sun, daylight. */
const SKY_TOP = [0x070b18, 0x1d2740, 0x3f5c86, 0x5a8fc8].map((c) => new THREE.Color(c));
const SKY_BOTTOM = [0x0d1220, 0x51486a, 0xd8a06c, 0xbcd4ea].map((c) => new THREE.Color(c));
const SUN_TINT = [0x223046, 0x8a5a46, 0xffb46b, 0xfff4e2].map((c) => new THREE.Color(c));

const skyVertex = /* glsl */ `
  varying vec3 vWorldDirection;
  void main() {
    vWorldDirection = normalize((modelMatrix * vec4(position, 0.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position.z = gl_Position.w; // always on the far plane
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uBottom;
  uniform vec3 uSunColor;
  uniform vec3 uSunDirection;
  varying vec3 vWorldDirection;

  void main() {
    vec3 dir = normalize(vWorldDirection);
    float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 sky = mix(uBottom, uTop, pow(h, 0.62));

    // Glow around the sun, strongest when it is near the horizon.
    float sun = max(dot(dir, normalize(uSunDirection)), 0.0);
    sky += uSunColor * pow(sun, 24.0) * 0.9;
    sky += uSunColor * pow(sun, 3.0) * 0.14;

    gl_FragColor = vec4(sky, 1.0);
    #include <colorspace_fragment>
  }
`;

export interface SceneLighting {
  sun: THREE.DirectionalLight;
  ambient: THREE.HemisphereLight;
  /** 0 by day, 1 in full darkness — drives window lights and street lamps. */
  nightFactor: number;
}

export class SceneRig {
  readonly scene = new THREE.Scene();
  readonly renderer: THREE.WebGLRenderer;
  readonly sun: THREE.DirectionalLight;
  readonly ambient: THREE.HemisphereLight;
  readonly skyMesh: THREE.Mesh;
  private readonly skyMaterial: THREE.ShaderMaterial;
  private readonly fog: THREE.Fog;
  nightFactor = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      // Terrain widened the depth range enough that moving the near plane is
      // no longer sufficient on its own. A logarithmic buffer distributes
      // precision across the whole range instead of crowding it near the
      // camera, which is what a view spanning a doorstep and a horizon needs.
      logarithmicDepthBuffer: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.fog = new THREE.Fog(0xbcd4ea, 600, 4000);
    this.scene.fog = this.fog;

    this.skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTop: { value: new THREE.Color(0x5a8fc8) },
        uBottom: { value: new THREE.Color(0xbcd4ea) },
        uSunColor: { value: new THREE.Color(0xfff4e2) },
        uSunDirection: { value: new THREE.Vector3(0.3, 0.8, 0.5) },
      },
      vertexShader: skyVertex,
      fragmentShader: skyFragment,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      fog: false,
    });
    this.skyMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), this.skyMaterial);
    this.skyMesh.frustumCulled = false;
    this.skyMesh.renderOrder = -1000;
    this.scene.add(this.skyMesh);

    this.sun = new THREE.DirectionalLight(0xffffff, 2.6);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.bias = -0.0006;
    this.sun.shadow.normalBias = 0.35;
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);

    this.ambient = new THREE.HemisphereLight(0xbcd4ea, 0x6b6558, 1.1);
    this.scene.add(this.ambient);
  }

  setSize(width: number, height: number): void {
    this.renderer.setSize(width, height, false);
  }

  /**
   * Position the sun, recolour the sky and retune the fog.
   *
   * The shadow frustum is re-centred on whatever the camera is looking at and
   * sized from the viewing distance: a tight box near the ground gives crisp
   * shadows on a street, and it widens as you pull back so the whole visible
   * city still casts.
   */
  update(
    sunDir: { x: number; y: number; z: number; altitude: number },
    focus: THREE.Vector3,
    viewDistance: number,
  ): void {
    // 0 = deep night, 1 = high noon, with dawn and dusk in between.
    const t = THREE.MathUtils.clamp((sunDir.altitude + 0.12) / 0.72, 0, 1);
    const stops = SKY_TOP.length - 1;
    const scaled = t * stops;
    const i = Math.min(stops - 1, Math.floor(scaled));
    const f = scaled - i;

    const top = SKY_TOP[i].clone().lerp(SKY_TOP[i + 1], f);
    const bottom = SKY_BOTTOM[i].clone().lerp(SKY_BOTTOM[i + 1], f);
    const tint = SUN_TINT[i].clone().lerp(SUN_TINT[i + 1], f);

    this.skyMaterial.uniforms.uTop.value.copy(top);
    this.skyMaterial.uniforms.uBottom.value.copy(bottom);
    this.skyMaterial.uniforms.uSunColor.value.copy(tint);
    this.skyMaterial.uniforms.uSunDirection.value.set(sunDir.x, sunDir.y, sunDir.z);

    this.nightFactor = 1 - THREE.MathUtils.clamp((sunDir.altitude + 0.09) / 0.28, 0, 1);

    // Key light: the sun by day, a weak blue moon after dark.
    const dayStrength = THREE.MathUtils.clamp(sunDir.altitude / 0.35, 0, 1);
    if (sunDir.altitude > -0.08) {
      this.sun.color.copy(tint);
      this.sun.intensity = 0.15 + dayStrength * 2.6;
      this.sun.position.set(sunDir.x, Math.max(0.05, sunDir.y), sunDir.z);
    } else {
      this.sun.color.setHex(0x9fb4d8);
      this.sun.intensity = 0.18;
      this.sun.position.set(-sunDir.x, Math.max(0.25, -sunDir.y), -sunDir.z);
    }
    this.sun.position.multiplyScalar(Math.max(400, viewDistance * 2)).add(focus);
    this.sun.target.position.copy(focus);
    this.sun.target.updateMatrixWorld();

    const shadowSpan = THREE.MathUtils.clamp(viewDistance * 1.1, 90, 900);
    const cam = this.sun.shadow.camera;
    cam.left = -shadowSpan;
    cam.right = shadowSpan;
    cam.top = shadowSpan;
    cam.bottom = -shadowSpan;
    cam.near = 1;
    cam.far = Math.max(2000, viewDistance * 5);
    cam.updateProjectionMatrix();
    // Shadows at city scale cost more than they add; drop them when far out.
    this.sun.castShadow = viewDistance < 2200;

    this.ambient.color.copy(top).lerp(new THREE.Color(0xffffff), 0.25);
    this.ambient.groundColor.setHex(this.nightFactor > 0.5 ? 0x1a1f2b : 0x6b6558);
    // A night floor of ~0.5 keeps facades readable rather than pitch black;
    // real cities are never as dark as an unlit render suggests.
    this.ambient.intensity = 0.5 + (1 - this.nightFactor) * 0.85;

    // Fog recedes as you climb, so a wide view is not a wall of haze.
    this.fog.color.copy(bottom);
    this.fog.near = Math.max(120, viewDistance * 1.2);
    this.fog.far = Math.max(1600, viewDistance * 9);

    this.renderer.toneMappingExposure = 1.05 - this.nightFactor * 0.18;
  }

  /**
   * Keep the sky centred on the camera and comfortably inside the far plane.
   * Both move constantly, because the near/far range is recomputed from
   * altitude on every frame.
   */
  syncSky(camera: THREE.PerspectiveCamera): void {
    this.skyMesh.position.copy(camera.position);
    this.skyMesh.scale.setScalar(Math.max(50, camera.far * 0.4));
  }

  dispose(): void {
    this.skyMaterial.dispose();
    (this.skyMesh.geometry as THREE.BufferGeometry).dispose();
    this.renderer.dispose();
  }
}
