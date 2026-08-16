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
import { FlatTerrain } from './terrain/heightfield';
import { NavGraph } from './sim/navgraph';
import { Population, type Agent } from './sim/population';
import { SceneRig } from './render/scene';
import { CameraController } from './render/camera';
import { buildBuildingMeshes, BuildingIndex, type BuildingMeshes } from './render/buildings';
import { buildRailwayMeshes, buildRoadMeshes, type RoadMeshes } from './render/roads';
import { buildGround, type GroundMeshes } from './render/ground';
import { buildProps, type Props } from './render/props';
import { PeopleRenderer } from './render/people';
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

  private buildingMeshes: BuildingMeshes | null = null;
  private roadMeshes: RoadMeshes | null = null;
  private railMeshes: RoadMeshes | null = null;
  private groundMeshes: GroundMeshes | null = null;
  private props: Props | null = null;
  private readonly worldGroup = new THREE.Group();

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
        this.cameras.setMode(mode);
        this.hud.setMode(mode);
      },
      onFollow: () => {
        if (!this.selected) return;
        this.cameras.setMode('follow');
        this.hud.setMode('follow');
      },
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
    this.hud.setWorld(world);
    this.cameras.setTerrain(world.terrain);
    this.people.setTerrain(world.terrain);
    this.selected = null;
    this.hud.hideInspector();

    this.hud.setLoading('Laying out the ground…', 0.6);
    await nextFrame();
    // Cut the river beds before anything is built on the result: buildings,
    // roads and bridges all need to see the carved channel, not the flat
    // satellite surface that hides it.
    const waterLevels = carveWaterways(world.terrain, world.areas);
    this.groundMeshes = buildGround(
      world.areas, world.radius, world.seed, world.terrain, waterLevels,
    );
    this.worldGroup.add(this.groundMeshes.group);

    this.hud.setLoading('Paving the streets…', 0.7);
    await nextFrame();
    this.roadMeshes = buildRoadMeshes(world.roads, world.terrain);
    this.worldGroup.add(this.roadMeshes.group);

    this.railMeshes = buildRailwayMeshes(world.railways, world.terrain);
    this.worldGroup.add(this.railMeshes.group);

    this.hud.setLoading(`Raising ${world.stats.buildings.toLocaleString()} buildings…`, 0.8);
    await nextFrame();
    this.buildingMeshes = buildBuildingMeshes(world.buildings, world.terrain);
    this.worldGroup.add(this.buildingMeshes.walls, this.buildingMeshes.roofs);
    this.buildingIndex = new BuildingIndex(world.buildings);

    this.hud.setLoading('Planting trees, hanging lamps…', 0.87);
    await nextFrame();
    this.props = buildProps(this.groundMeshes.treeSpots, world.roads, world.seed, world.terrain);
    this.worldGroup.add(this.props.group);

    this.hud.setLoading('Mapping walkable routes…', 0.92);
    await nextFrame();
    this.graph = NavGraph.build(world.roads);

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

    if (this.population) {
      this.people.update(this.population.visible, camera.position, this.realElapsed);
    }

    this.hud.updateClock(this.clock.formatTime(), this.clock.formatDay());
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

  /* ----------------------------------------------------------- picking */

  private onPointerDown = (e: PointerEvent): void => {
    this.pointerDownAt = { x: e.clientX, y: e.clientY, time: performance.now() };
  };

  private onPointerUp = (e: PointerEvent): void => {
    const moved = Math.hypot(e.clientX - this.pointerDownAt.x, e.clientY - this.pointerDownAt.y);
    const elapsed = performance.now() - this.pointerDownAt.time;
    // A drag is a camera move, not a selection.
    if (moved > 5 || elapsed > 700) return;
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
