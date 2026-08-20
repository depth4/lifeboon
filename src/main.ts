/**
 * Lifeboon — a life simulator that runs on the real world map.
 *
 * Boot order: put something on screen fast, then load real data. The city is
 * assembled in steps that yield to the browser between them, so the loading
 * panel actually animates instead of freezing while a few hundred thousand
 * triangles are built.
 */

import * as THREE from 'three';
import { SimClock } from './core/clock';
import { bboxAround } from './core/geo';
import type { LatLon } from './core/geo';
import { fetchArea, geocode, OverpassError } from './data/overpass';
import { parseOsm } from './data/osm';
import { generateCity } from './data/procedural';
import { carveWaterways, fetchHeightfield } from './terrain/elevation';
import { FlatTerrain, Heightfield } from './terrain/heightfield';
import { NavGraph } from './sim/navgraph';
import { Population, type Agent } from './sim/population';
import { RoadIndex } from './sim/roadindex';
import { DrivenVehicle, type DriveControls } from './sim/driver';
import { CITY_MICROCAR } from './sim/vehicles';
import { GRADING_GRID_M, RoadProfiles, isUnderground } from './world/roadprofile';
import { SceneRig } from './render/scene';
import { CameraController } from './render/camera';
import { buildBuildingMeshes, BuildingIndex, type BuildingMeshes } from './render/buildings';
import { buildRailwayMeshes, buildRoadMeshes, type RoadMeshes } from './render/roads';
import { buildGround, type GroundMeshes } from './render/ground';
import { groundGrid, shoulderFor } from './render/groundgrid';
import { StreetMask } from './render/streetmask';
import { buildProps, type Props } from './render/props';
import { OcclusionField } from './render/occlusion';
import { PeopleRenderer } from './render/people';
import { CarModel } from './render/car';
import { Hud } from './ui/hud';
import type { World } from './world/types';

/** Where we start, when the network allows it: a dense, well-mapped centre. */
const DEFAULT_PLACE: LatLon = { lat: 52.3702, lon: 4.8952 };
const DEFAULT_PLACE_NAME = 'Amsterdam, Centrum';
/**
 * Deliberately modest for the first load: Amsterdam's centre is dense enough
 * that a wider box turns the opening screen into a long wait on a public
 * Overpass mirror. Bigger areas are one dropdown away.
 */
const DEFAULT_RADIUS_M = 500;

/** Yield to the browser so the loading UI can repaint between build steps. */
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

class App {
  private readonly canvas = document.getElementById('viewport') as HTMLCanvasElement;
  private readonly rig = new SceneRig(this.canvas);
  private readonly cameras = new CameraController(
    this.canvas,
    window.innerWidth / window.innerHeight,
  );
  private readonly clock = new SimClock(7.5, 10);
  private readonly people = new PeopleRenderer({ maxInstances: 5000 });
  private readonly hud: Hud;

  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();

  private world: World | null = null;
  private graph: NavGraph | null = null;
  private population: Population | null = null;
  private buildingIndex: BuildingIndex | null = null;
  private roadIndex: RoadIndex | null = null;

  private buildingMeshes: BuildingMeshes | null = null;
  private roadMeshes: RoadMeshes | null = null;
  private railMeshes: RoadMeshes | null = null;
  private groundMeshes: GroundMeshes | null = null;
  private props: Props | null = null;
  private readonly worldGroup = new THREE.Group();

  /** The car, once one has been put on the road. It stays parked when you get out. */
  private car: DrivenVehicle | null = null;
  private carModel: CarModel | null = null;
  private readonly driveKeys = new Set<string>();
  private reverseIntent = false;
  private stoppedFor = 0;

  private selected: Agent | null = null;
  private loading = false;
  private lastFrameTime = performance.now();
  private fps = 60;
  private realElapsed = 0;

  /** Distinguishes a click from the end of a drag. */
  private pointerDownAt = { x: 0, y: 0, time: 0 };

  constructor() {
    this.rig.scene.add(this.worldGroup);
    this.rig.scene.add(this.people.mesh);

    this.hud = new Hud({
      onSpeedChange: (scale) => {
        this.clock.paused = scale === 0;
        if (scale > 0) this.clock.timeScale = scale;
      },
      onModeChange: (mode) => {
        this.leaveCar();
        this.cameras.setMode(mode);
        this.hud.setMode(mode);
      },
      onFollow: () => {
        if (!this.selected) return;
        this.leaveCar();
        this.cameras.setMode('follow');
        this.hud.setMode('follow');
      },
      onDrive: () => this.enterCar(),
      onDeselect: () => {
        this.selected = null;
        if (this.cameras.mode === 'follow') {
          this.cameras.setMode('orbit');
          this.hud.setMode('orbit');
        }
      },
      onSearch: (query) => void this.search(query),
      onPickResult: (lat, lon, name, radius) => void this.loadPlace({ lat, lon }, name, radius),
    });

    window.addEventListener('resize', this.onResize);
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('keydown', this.onDriveKeyDown);
    window.addEventListener('keyup', this.onDriveKeyUp);
    this.onResize();
  }

  /* ----------------------------------------------------------- loading */

  async boot(): Promise<void> {
    this.hud.setLoading('Looking for map data…', 0.05);
    try {
      await this.loadPlace(DEFAULT_PLACE, DEFAULT_PLACE_NAME, DEFAULT_RADIUS_M);
    } catch (err) {
      // No network, a blocked host, or every mirror busy: fall back to the
      // generated city rather than showing an empty screen.
      const message =
        err instanceof OverpassError
          ? err.message
          : 'Could not reach OpenStreetMap from this browser.';
      this.hud.setLoadError(`${message} Showing the offline city instead — search for a place to try again.`);
      this.hud.setLoading('Generating an offline city…', 0.35);
      await nextFrame();
      await this.installWorld(generateCity('lifeboon', 900));
    }
    this.start();
  }

  private async search(query: string): Promise<void> {
    this.hud.setSearchBusy(true);
    try {
      const results = await geocode(query);
      this.hud.showSearchResults(results);
    } catch {
      this.hud.showSearchResults([]);
    } finally {
      this.hud.setSearchBusy(false);
    }
  }

  private async loadPlace(centre: LatLon, name: string, radiusM: number): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    this.hud.hideSearchResults();
    this.hud.showLoader();
    this.hud.setLoading('Querying OpenStreetMap…', 0.1);

    try {
      const bbox = bboxAround(centre, radiusM);
      // Map and elevation come from unrelated services, so fetch them at the
      // same time. Terrain is the optional half: if it fails we still get a
      // city, just a flat one.
      const [response, terrain] = await Promise.all([
        fetchArea(bbox, { onProgress: (msg) => this.hud.setLoading(msg, 0.25) }),
        fetchHeightfield(bbox).catch(() => new FlatTerrain()),
      ]);

      this.hud.setLoading('Reading footprints and streets…', 0.5);
      await nextFrame();
      const world = parseOsm(response, bbox, name, terrain);

      if (!world.buildings.length && !world.roads.length) {
        throw new OverpassError('That area has no mapped buildings or streets yet.');
      }

      this.clock.latitude = centre.lat;
      await this.installWorld(world);
    } finally {
      this.loading = false;
    }
  }

  /** Swap in a new world, disposing everything the old one owned. */
  private async installWorld(world: World): Promise<void> {
    this.teardownWorld();

    this.world = world;
    // Resample the ground before anything reads a height off it. Elevation
    // tiles are far too coarse to have a street cut into them, and every
    // consumer below — the camera, the people, the geometry — has to see the
    // same surface the streets were graded into.
    //
    // It is also grown to cover every street. Ways run past the edge of the
    // downloaded elevation — OSM returns whole ways, not clipped ones, and the
    // offline city overshoots its own radius by eighteen metres — and grading
    // can only cut into the array it has. Bounded, so one way running out of
    // the county does not resample the world: half again the loaded radius.
    if (world.terrain instanceof Heightfield) {
      world.terrain = world.terrain.resampled(GRADING_GRID_M, streetBounds(world));
    }
    this.hud.setWorld(world);
    this.cameras.setTerrain(world.terrain);
    this.people.setTerrain(world.terrain);
    this.selected = null;
    this.hud.hideInspector();

    this.hud.setLoading('Cutting the terrain…', 0.6);
    await nextFrame();
    // Cut the river beds before anything is built on the result: buildings,
    // roads and bridges all need to see the carved channel, not the flat
    // satellite surface that hides it.
    const water = carveWaterways(world.terrain, world.areas, world.waterways);

    // Then cut the streets into what is left. The profiles are taken first,
    // off the ground as it stands, and everything downstream reads those same
    // numbers — the geometry, the embankments and the car. Recomputing a
    // profile after grading would describe a road built on top of a road.
    const profiles = new RoadProfiles(world.roads, world.terrain);
    const corridors = profiles.corridors(world.roads, world.norm);
    // The shoulder — how far beyond a street's edge the earth may not stand
    // higher than the street — has to be at least one cell of the mesh that
    // will draw the ground, so the mesh is asked how wide its cells are.
    const grid = groundGrid(world.radius, world.terrain.resolution);
    world.terrain.gradeStreets(corridors, shoulderFor(grid.spacing));

    // Where the buildings shut the ground in. Every surface that meets the
    // earth is shaded with this, which is what makes a wall look like it is
    // standing on the ground rather than passing through it.
    const occlusion = new OcclusionField(world.buildings, world.radius, corridors);

    // Streets are built before the ground now, and that order is load-bearing:
    // the ground has to be told where paving actually ended up before it can
    // cut itself away underneath it. Working it out from the centrelines
    // instead would be wrong exactly at junctions, where the paving stops.
    this.hud.setLoading('Paving the streets…', 0.65);
    await nextFrame();
    const mask = new StreetMask(world.radius);
    this.roadMeshes = buildRoadMeshes(
      world.roads, world.terrain, profiles, world.norm, occlusion, mask,
    );
    mask.finish(grid.spacing);
    this.worldGroup.add(this.roadMeshes.group);

    this.hud.setLoading('Laying out the ground…', 0.72);
    await nextFrame();
    this.groundMeshes = buildGround(
      world.areas, world.radius, world.seed, world.terrain,
      water.areaLevels, world.waterways, water.flowLevels, occlusion, mask,
    );
    this.worldGroup.add(this.groundMeshes.group);

    this.railMeshes = buildRailwayMeshes(world.railways, world.terrain);
    this.worldGroup.add(this.railMeshes.group);

    this.hud.setLoading(`Raising ${world.stats.buildings.toLocaleString()} buildings…`, 0.8);
    await nextFrame();
    this.buildingMeshes = buildBuildingMeshes(world.buildings, world.terrain);
    this.worldGroup.add(this.buildingMeshes.walls, this.buildingMeshes.roofs);
    this.buildingIndex = new BuildingIndex(world.buildings);

    this.hud.setLoading('Planting trees, hanging lamps…', 0.87);
    await nextFrame();
    this.props = buildProps(
      this.groundMeshes.treeSpots.concat(this.roadMeshes.treeSpots),
      world.roads, world.seed, world.terrain, world.radius, occlusion,
    );
    this.worldGroup.add(this.props.group);

    this.hud.setLoading('Mapping walkable routes…', 0.92);
    await nextFrame();
    this.graph = NavGraph.build(world.roads);
    // Streets a car may use, indexed so the simulation can ask what is under
    // the wheels sixty times a second.
    // Underground ways are not drawn, so the car must not feel tarmac over
    // them either — otherwise you get grip and a street name while visibly
    // driving across a field.
    this.roadIndex = new RoadIndex(
      world.roads.filter((r) => r.drivable && !isUnderground(r)),
      world.terrain, profiles, world.norm,
    );
    this.hud.setDriveAvailable(this.roadIndex.roadCount > 0);

    this.hud.setLoading('Moving people in…', 0.97);
    await nextFrame();
    this.population = new Population(world, this.graph, world.seed);
    // Enough people that streets feel used, few enough to stay smooth.
    this.population.spawn(Math.min(4000, Math.max(400, Math.round(world.buildings.length * 1.1))));
    this.hud.setPopulationCount(this.population.count);

    // Frame the city from a low angle — the view that shows it is 3D.
    this.cameras.goTo(0, 0, Math.min(1200, world.radius * 1.4));

    this.hud.setLoading('Ready', 1);
    await nextFrame();
    this.hud.hideLoader();
  }

  private teardownWorld(): void {
    this.leaveCar();
    this.carModel?.dispose();
    this.carModel = null;
    this.car = null;
    this.worldGroup.clear();
    this.buildingMeshes?.dispose();
    this.roadMeshes?.dispose();
    this.railMeshes?.dispose();
    this.groundMeshes?.dispose();
    this.props?.dispose();
    this.buildingMeshes = null;
    this.roadMeshes = null;
    this.railMeshes = null;
    this.groundMeshes = null;
    this.props = null;
    this.graph = null;
    this.population = null;
    this.buildingIndex = null;
    this.roadIndex = null;
  }

  /* -------------------------------------------------------------- loop */

  private start(): void {
    this.lastFrameTime = performance.now();
    this.rig.renderer.setAnimationLoop(this.frame);
  }

  private frame = (): void => {
    const now = performance.now();
    const dtReal = Math.min(0.1, (now - this.lastFrameTime) / 1000);
    this.lastFrameTime = now;
    this.realElapsed += dtReal;
    this.fps += (1 / Math.max(dtReal, 0.0001) - this.fps) * 0.08;

    const dtSim = this.clock.advance(dtReal);

    if (this.population && dtSim > 0) {
      this.population.update(dtSim, this.clock);
    }

    // The car runs on real time whatever the clock is doing: a simulation
    // speed is a choice about watching the city, not about how a car behaves.
    let braking = false;
    if (this.driving && this.car) {
      const controls = this.driveControls(dtReal);
      braking = controls.brake > 0 || controls.handbrake;
      this.car.update(dtReal, controls);
      this.cameras.setDrivePose(
        this.car.x, this.car.y, this.car.z, this.car.heading, this.car.state.speed,
      );
    }

    // Follow mode tracks the selected person, even while they are indoors —
    // the camera waits outside the door rather than jumping away.
    if (this.selected && this.cameras.mode === 'follow') {
      this.cameras.setFollowPoint(this.selected.x, this.selected.z);
    }

    this.cameras.update(dtReal);

    const camera = this.cameras.camera;
    const focus = new THREE.Vector3(
      this.cameras.target.x,
      0,
      this.cameras.target.z,
    );
    this.rig.update(this.clock.sunDirection(), focus, this.cameras.currentDistance);
    this.rig.syncSky(camera);

    this.buildingMeshes?.setWindowLight(this.rig.nightFactor * 0.8);
    this.props?.setNight(this.rig.nightFactor);
    if (this.car && this.carModel) {
      this.carModel.sync(this.car, braking, this.rig.nightFactor);
    }

    if (this.population) {
      this.people.update(this.population.visible, camera.position, this.realElapsed);
    }

    this.hud.updateClock(this.clock.formatTime(), this.clock.formatDay());
    this.hud.updateDrive(now, this.driving && this.car ? this.car.telemetry() : null);
    this.hud.updateStats(
      now,
      this.cameras.altitude,
      this.population?.visible.length ?? 0,
      this.fps,
    );

    // Keep the inspector live while somebody is selected.
    if (this.selected && this.population && this.world) {
      if (now - this.lastInspectorUpdate > 500) {
        this.lastInspectorUpdate = now;
        this.hud.showAgent(this.selected, this.population, this.world);
      }
    }

    this.rig.renderer.render(this.rig.scene, camera);
  };

  private lastInspectorUpdate = 0;


  /* ------------------------------------------------------------ driving */

  /**
   * Get in. If there is already a car parked nearby, that one; otherwise put a
   * new one on the nearest street to whatever the view is centred on.
   */
  private enterCar(): void {
    if (!this.roadIndex || !this.world) return;

    const anchor = this.cameras.target;
    if (this.car) {
      const away = Math.hypot(this.car.x - anchor.x, this.car.z - anchor.z);
      // Far from the parked car, fetch a fresh one rather than teleporting.
      if (away > 400) this.car = null;
    }

    if (!this.car) {
      const spot = this.findParkingSpot(anchor.x, anchor.z);
      if (!spot) return;

      this.car = new DrivenVehicle(
        CITY_MICROCAR, this.world.terrain, this.roadIndex, this.buildingIndex,
      );
      this.car.placeAt(spot.x, spot.z, spot.heading);

      this.carModel?.dispose();
      this.carModel = new CarModel(CITY_MICROCAR, this.world.seed % 6);
      this.worldGroup.add(this.carModel.group);
    }

    // Driving happens in real time. At 60× a minute passes every second, which
    // is fine to watch and impossible to drive in, so step the clock back down.
    this.clock.paused = false;
    this.clock.timeScale = 1;
    this.hud.setSpeed(1);

    this.selected = null;
    this.hud.hideInspector();
    this.driveKeys.clear();
    this.reverseIntent = false;
    this.cameras.setMode('drive');
    this.hud.setMode('drive');
  }

  /** Get out, leaving the car where it stands. */
  private leaveCar(): void {
    if (this.cameras.mode !== 'drive') return;
    this.cameras.setMode('orbit');
    this.hud.setMode('orbit');
    this.driveKeys.clear();
  }

  /**
   * Somewhere on a street to put a car down, working outwards from the point
   * the view is centred on.
   *
   * The clearance check is the part that matters. Building footprints and road
   * centrelines overlap more often than you would expect — arcades, gateways,
   * service roads through courtyards, and plain mapping error — and dropping a
   * car onto one of those puts it inside a wall before it has moved a metre.
   */
  private findParkingSpot(
    anchorX: number,
    anchorZ: number,
  ): { x: number; z: number; heading: number } | null {
    if (!this.roadIndex) return null;
    let fallback: { x: number; z: number; heading: number } | null = null;

    for (let ring = 0; ring < 14; ring++) {
      const radius = ring * 30;
      const probes = ring === 0 ? 1 : 8;
      for (let p = 0; p < probes; p++) {
        const angle = (p / probes) * Math.PI * 2;
        const hit = this.roadIndex.nearest(
          anchorX + Math.cos(angle) * radius,
          anchorZ + Math.sin(angle) * radius,
          150,
        );
        if (!hit) continue;

        const [dx, dz] = hit.direction;
        const heading = Math.atan2(dx, dz);
        // Sit off the centreline rather than astride it. There is no lane
        // model yet, so which side is a display choice, not a rule.
        const offset = Math.min(hit.road.width / 4, 2.2);

        // Try both sides: on a narrow street one of them may be built over.
        for (const side of [1, -1]) {
          const x = hit.point[0] - dz * offset * side;
          const z = hit.point[1] + dx * offset * side;
          if (!fallback) fallback = { x, z, heading };
          if (this.carFitsAt(x, z, heading)) return { x, z, heading };
        }
      }
    }
    // Every candidate was built over. Better a car in an awkward spot — which
    // it can now drive out of — than a Drive button that does nothing.
    return fallback;
  }

  /** Whether a car standing here would be clear of every building. */
  private carFitsAt(x: number, z: number, heading: number): boolean {
    if (!this.buildingIndex) return true;
    const fx = Math.sin(heading);
    const fz = Math.cos(heading);
    const lx = Math.cos(heading);
    const lz = -Math.sin(heading);
    // A little larger than the car, so it starts with room to pull away.
    const halfL = CITY_MICROCAR.lengthM / 2 + 0.6;
    const halfW = CITY_MICROCAR.widthM / 2 + 0.4;

    for (const [a, b] of [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 0]] as const) {
      if (this.buildingIndex.at(x + fx * halfL * a + lx * halfW * b,
                                z + fz * halfL * a + lz * halfW * b)) return false;
    }
    return true;
  }

  private get driving(): boolean {
    return this.cameras.mode === 'drive' && this.car !== null;
  }

  private onDriveKeyDown = (e: KeyboardEvent): void => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
    if (!this.driving) return;

    if (e.code === 'Escape') {
      this.leaveCar();
      return;
    }
    if (e.code === 'KeyR') this.reverseIntent = !this.reverseIntent;
    // Space scrolls the page otherwise, and the handbrake is worth a key.
    if (e.code === 'Space') e.preventDefault();
    this.driveKeys.add(e.code);
  };

  private onDriveKeyUp = (e: KeyboardEvent): void => {
    this.driveKeys.delete(e.code);
  };

  /**
   * Pedals from keys.
   *
   * W and S are "go" and "stop" rather than "forwards" and "backwards": brake
   * to a standstill while holding S and the car takes reverse, which is how
   * every car with an automatic-feeling control scheme behaves and means there
   * is nothing to learn. R still selects it outright.
   */
  private driveControls(dt: number): DriveControls {
    const held = (...codes: string[]) => codes.some((c) => this.driveKeys.has(c));
    const forward = held('KeyW', 'ArrowUp');
    const backward = held('KeyS', 'ArrowDown');

    const stopped = (this.car?.state.speed ?? 0) < 0.6;
    this.stoppedFor = stopped ? this.stoppedFor + dt : 0;
    if (this.stoppedFor > 0.35) {
      if (backward && !forward) this.reverseIntent = true;
      if (forward && !backward) this.reverseIntent = false;
    }

    const reverse = this.reverseIntent;
    return {
      throttle: (reverse ? backward : forward) ? 1 : 0,
      brake: (reverse ? forward : backward) ? 1 : 0,
      steer: (held('KeyD', 'ArrowRight') ? 1 : 0) - (held('KeyA', 'ArrowLeft') ? 1 : 0),
      reverse,
      handbrake: held('Space'),
    };
  }

  /* ----------------------------------------------------------- picking */

  private onPointerDown = (e: PointerEvent): void => {
    this.pointerDownAt = { x: e.clientX, y: e.clientY, time: performance.now() };
  };

  private onPointerUp = (e: PointerEvent): void => {
    const moved = Math.hypot(e.clientX - this.pointerDownAt.x, e.clientY - this.pointerDownAt.y);
    const elapsed = performance.now() - this.pointerDownAt.time;
    // A drag is a camera move, not a selection.
    if (moved > 5 || elapsed > 700) return;
    // A click while driving is the camera looking around, not a selection.
    if (this.cameras.mode === 'drive') return;
    this.pick(e.clientX, e.clientY);
  };

  private pick(clientX: number, clientY: number): void {
    if (!this.world || !this.population) return;

    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.cameras.camera);

    // People first: they are small, and they are the point of the thing.
    const peopleHits = this.raycaster.intersectObject(this.people.mesh, false);
    if (peopleHits.length && peopleHits[0].instanceId !== undefined) {
      const agent = this.people.agentAtInstance(peopleHits[0].instanceId);
      if (agent) {
        this.selected = agent;
        this.lastInspectorUpdate = 0;
        this.hud.showAgent(agent, this.population, this.world);
        return;
      }
    }

    // Otherwise, whatever piece of city is under the cursor.
    const targets: THREE.Object3D[] = [];
    if (this.buildingMeshes) targets.push(this.buildingMeshes.walls, this.buildingMeshes.roofs);
    if (this.groundMeshes) targets.push(this.groundMeshes.group);
    const hits = this.raycaster.intersectObjects(targets, true);
    if (!hits.length) {
      this.selected = null;
      this.hud.hideInspector();
      return;
    }

    // Nudge along the ray so a glancing hit on a wall lands inside the
    // footprint rather than exactly on its edge.
    const point = hits[0].point.clone().addScaledVector(this.raycaster.ray.direction, 0.35);
    const building = this.buildingIndex?.at(point.x, point.z) ?? null;
    if (building) {
      this.selected = null;
      this.hud.showBuilding(building, this.world.pois);
    } else {
      this.selected = null;
      this.hud.hideInspector();
    }
  }

  /* ------------------------------------------------------------ resize */

  private onResize = (): void => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.rig.setSize(width, height);
    this.cameras.setAspect(width / height);
  };
}

const app = new App();
void app.boot();

// Handy in the console when poking at a city; harmless otherwise.
(window as unknown as { lifeboon: App }).lifeboon = app;

/**
 * The box the streets occupy, clamped to something sane around the city.
 *
 * The clamp is what stops a single long way — a motorway leaving the bbox, a
 * river-following track — from deciding the size of the elevation array.
 */
function streetBounds(world: World): { minX: number; minZ: number; maxX: number; maxZ: number } {
  const limit = world.radius * 1.5;
  let minX = -world.radius;
  let maxX = world.radius;
  let minZ = -world.radius;
  let maxZ = world.radius;
  for (const road of world.roads) {
    for (const [x, z] of road.points) {
      if (Math.abs(x) > limit || Math.abs(z) > limit) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
  }
  // A margin for the shoulder the grading cuts beyond each street.
  const pad = 12;
  return { minX: minX - pad, minZ: minZ - pad, maxX: maxX + pad, maxZ: maxZ + pad };
}
