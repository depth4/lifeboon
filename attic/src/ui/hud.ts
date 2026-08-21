/**
 * The interface layer: everything that is DOM rather than WebGL.
 *
 * Kept deliberately free of simulation logic — the HUD is handed values and
 * raises callbacks, so the render loop never has to know how a panel is built.
 */

import type { DriveTelemetry } from '../sim/driver';
import type { Agent, Population } from '../sim/population';
import type { Building, DataAudit, Poi, World } from '../world/types';
import { POI_LABEL } from '../data/tags';

const $ = <T extends HTMLElement>(id: string): T => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
};

export interface HudCallbacks {
  onSpeedChange(scale: number): void;
  onModeChange(mode: 'orbit' | 'walk'): void;
  /** The Drive chip: find a street, put a car on it, get in. */
  onDrive(): void;
  onSearch(query: string, radius: number): void;
  onPickResult(lat: number, lon: number, name: string, radius: number): void;
  onFollow(): void;
  onDeselect(): void;
  /** Save the loaded area to a file that can be sent to somebody else. */
  onExportPlace(): void;
  /** Load an area somebody else saved. */
  onImportPlace(file: File): void;
}

const BUILDING_LABEL: Record<Building['kind'], string> = {
  residential: 'Homes',
  commercial: 'Commercial',
  office: 'Offices',
  retail: 'Retail',
  industrial: 'Industrial',
  civic: 'Civic building',
  education: 'Education',
  religious: 'Place of worship',
  other: 'Outbuilding',
};

const NEED_COLORS: Record<string, string> = {
  Energy: '#6fb2ff',
  Food: '#ffb454',
  Social: '#9d8cff',
  Fun: '#5fd39a',
};

export class Hud {
  private readonly loader = $('loader');
  private readonly loaderFill = $('loader-fill');
  private readonly loaderStatus = $('loader-status');
  private readonly loaderError = $('loader-error');

  private readonly placeName = $('place-name');
  private readonly sourceBadge = $('source-badge');
  private readonly attribText = $('attrib-text');
  private readonly aboutAttrib = $('about-attrib');
  private readonly aboutAudit = $('about-audit');
  private readonly aboutBuild = $('about-build');
  private readonly buildTag = $('build-tag');

  private readonly clockTime = $('clock-time');
  private readonly clockDay = $('clock-day');

  private readonly statAltitude = $('stat-altitude');
  private readonly statOutdoors = $('stat-outdoors');
  private readonly statPopulation = $('stat-population');
  private readonly statBuildings = $('stat-buildings');
  private readonly statRoads = $('stat-roads');
  private readonly statFps = $('stat-fps');

  private readonly drivePanel = $('drive-panel');
  private readonly driveKmh = $('drive-kmh');
  private readonly driveGear = $('drive-gear');
  private readonly driveRev = $('drive-rev');
  private readonly driveWhere = $('drive-where');
  private readonly driveFlags = $('drive-flags');
  private readonly driveBtn = $<HTMLButtonElement>('drive-btn');

  private readonly inspector = $('inspector');
  private readonly inspectorBody = $('inspector-body');
  private readonly followBtn = $<HTMLButtonElement>('follow-btn');

  private readonly searchForm = $<HTMLFormElement>('search-form');
  private readonly searchInput = $<HTMLInputElement>('search-input');
  private readonly searchBtn = $<HTMLButtonElement>('search-btn');
  private readonly radiusSelect = $<HTMLSelectElement>('radius-select');
  private readonly captureStatus = $('capture-status');
  private readonly searchResults = $('search-results');

  private lastStatsUpdate = 0;

  constructor(private readonly cb: HudCallbacks) {
    this.aboutBuild.textContent = __BUILD_STAMP__;
    this.buildTag.textContent = __BUILD_STAMP__;
    this.bindSpeeds();
    this.bindModes();
    this.bindSearch();
    this.bindInspector();
    this.bindAbout();
  }

  /* ------------------------------------------------------------ loader */

  setLoading(message: string, progress: number): void {
    this.loaderStatus.textContent = message;
    this.loaderFill.style.width = `${Math.round(progress * 100)}%`;
  }

  setLoadError(message: string): void {
    this.loaderError.textContent = message;
    this.loaderError.hidden = false;
  }

  hideLoader(): void {
    this.loader.classList.add('is-hidden');
    window.setTimeout(() => {
      this.loader.hidden = true;
    }, 600);
  }

  showLoader(): void {
    this.loader.hidden = false;
    this.loaderError.hidden = true;
    // Force a reflow so the fade-in transition restarts.
    void this.loader.offsetHeight;
    this.loader.classList.remove('is-hidden');
  }

  /* ------------------------------------------------------------- world */

  setWorld(world: World): void {
    this.placeName.textContent = world.stats.placeName;
    const synthetic = world.stats.source === 'synthetic';
    this.sourceBadge.textContent = synthetic ? 'synthetic' : 'OpenStreetMap';
    this.sourceBadge.classList.toggle('is-synthetic', synthetic);
    this.attribText.textContent = world.stats.attribution;
    this.aboutAttrib.textContent = synthetic
      ? 'This view is a generated city, not a real place. Load somewhere by name to switch to real map data.'
      : `Currently showing ${world.stats.placeName}, built from ${world.stats.buildings.toLocaleString()} OpenStreetMap building footprints and ${world.stats.roadLengthKm.toFixed(1)} km of mapped streets.`;

    this.statBuildings.textContent = world.stats.buildings.toLocaleString();
    this.statRoads.textContent = `${world.stats.roadLengthKm.toFixed(1)} km`;
    this.renderAudit(world.audit);
  }

  /**
   * The coverage report. The pavement rows are the ones that matter most:
   * OpenStreetMap distinguishes "surveyed, and there is no pavement" from
   * "nobody has looked", and so does this table, because in thinly-mapped
   * towns almost everything falls into the second category.
   */
  private renderAudit(audit: DataAudit | null): void {
    if (!audit) {
      this.aboutAudit.innerHTML =
        '<p class="fineprint">Nothing to audit — this is the generated offline city, not real map data.</p>';
      return;
    }

    const pct = (n: number, total: number) =>
      total > 0 ? `${Math.round((n / total) * 100)}%` : '—';
    const unsurveyed = audit.streetsTotal - audit.streetsWithSidewalkTag;

    this.aboutAudit.innerHTML = `
      <div class="audit">
        <h4>Buildings</h4>
        ${auditRow('Total', audit.buildingsTotal.toLocaleString())}
        ${auditRow('Surveyed height', `${audit.buildingsWithHeight.toLocaleString()} · ${pct(audit.buildingsWithHeight, audit.buildingsTotal)}`)}
        ${auditRow('Storey count only', `${audit.buildingsWithLevels.toLocaleString()} · ${pct(audit.buildingsWithLevels, audit.buildingsTotal)}`)}
        ${auditRow('Height guessed by us', `${audit.buildingsGuessed.toLocaleString()} · ${pct(audit.buildingsGuessed, audit.buildingsTotal)}`, audit.buildingsGuessed > audit.buildingsTotal / 2)}

        <h4>Walking</h4>
        ${auditRow('Streets for cars', `${audit.roadKmDrivable.toFixed(1)} km`)}
        ${auditRow('Pavements &amp; paths as their own lines', `${audit.roadKmFootway.toFixed(1)} km`, audit.roadKmFootway < 0.2)}
        ${auditRow('Streets that say whether they have a pavement', `${audit.streetsWithSidewalkTag} of ${audit.streetsTotal}`)}
        ${auditRow('…of those, pavement present', String(audit.sidewalkYes))}
        ${auditRow('…of those, explicitly none', String(audit.sidewalkNo))}
        ${auditRow('Streets nobody has surveyed', `${unsurveyed} of ${audit.streetsTotal}`, unsurveyed > audit.streetsTotal / 2)}
        ${auditRow('Marked crossings', String(audit.crossings), audit.crossings === 0)}

        <h4>Other</h4>
        ${auditRow('Railway', `${audit.railwayKm.toFixed(1)} km`)}
        ${auditRow('Tram track', `${audit.tramKm.toFixed(1)} km`)}
        ${auditRow('Places (shops, schools, cafes…)', audit.poisTotal.toLocaleString())}
      </div>
      <p class="fineprint">
        A missing pavement tag means <em>nobody has mapped it</em>, not that the
        street has no pavement. Highlighted rows are where this area is thin
        enough that the simulation is filling gaps rather than reading facts.
      </p>
    `;
  }

  setPopulationCount(count: number): void {
    this.statPopulation.textContent = count.toLocaleString();
  }

  /* ------------------------------------------------------------- frame */

  updateClock(time: string, day: string): void {
    this.clockTime.textContent = time;
    this.clockDay.textContent = day;
  }

  /** Throttled: rewriting six DOM nodes every frame is pure waste. */
  updateStats(now: number, altitude: number, outdoors: number, fps: number): void {
    if (now - this.lastStatsUpdate < 250) return;
    this.lastStatsUpdate = now;
    this.statAltitude.textContent =
      altitude >= 1000 ? `${(altitude / 1000).toFixed(2)} km` : `${Math.round(altitude)} m`;
    this.statOutdoors.textContent = outdoors.toLocaleString();
    this.statFps.textContent = String(Math.round(fps));
  }

  /* --------------------------------------------------------- dashboard */

  /** Grey out the Drive chip where the map has no street to put a car on. */
  setDriveAvailable(available: boolean): void {
    this.driveBtn.disabled = !available;
    this.driveBtn.title = available
      ? 'Put a car on the street below and drive it'
      : 'No street nearby to start from — move the view over a road first';
  }

  /** One line under the capture buttons: what just happened, or what failed. */
  setCaptureStatus(text: string): void {
    this.captureStatus.textContent = text;
  }

  /**
   * The dashboard. Passing null puts the car away.
   *
   * Throttled like the other stats: at 60 fps this is six DOM writes a frame
   * for numbers nobody can read that fast.
   */
  updateDrive(now: number, telemetry: DriveTelemetry | null): void {
    if (!telemetry) {
      this.drivePanel.hidden = true;
      return;
    }
    this.drivePanel.hidden = false;
    if (now - this.lastDriveUpdate < 70) return;
    this.lastDriveUpdate = now;

    this.driveKmh.textContent = String(Math.round(telemetry.speedKmh));
    this.driveGear.textContent = telemetry.gearLabel;
    this.driveRev.style.width = `${Math.min(100, telemetry.revFraction * 92)}%`;

    const where = telemetry.streetName
      ? telemetry.streetName
      : telemetry.onRoad
        ? 'Unnamed street'
        : 'Off the road';
    const grade = Math.abs(telemetry.gradePercent) >= 1.5
      ? ` · ${telemetry.gradePercent > 0 ? '↑' : '↓'} ${Math.abs(telemetry.gradePercent).toFixed(0)}%`
      : '';
    this.driveWhere.textContent = where + grade;

    const flags: string[] = [];
    if (telemetry.wheelspin) flags.push('wheelspin');
    if (telemetry.understeer) flags.push('no grip');
    if (!telemetry.onRoad) flags.push('rough going');
    this.driveFlags.textContent = flags.join(' · ');
  }

  private lastDriveUpdate = 0;

  /* --------------------------------------------------------- inspector */

  showAgent(agent: Agent, population: Population, world: World): void {
    const home = population.homeBuilding(agent);
    const job = population.jobPoi(agent);
    const homeAddress = describeBuilding(home);

    this.inspectorBody.innerHTML = `
      <h3 class="insp-title">${escapeHtml(agent.name)}</h3>
      <p class="insp-sub">${escapeHtml(population.describe(agent))}</p>
      ${row('Age', `${agent.age}`)}
      ${row('Lives in', homeAddress)}
      ${row('Works at', job ? POI_LABEL[job.kind] : 'Not employed')}
      ${row('Walking pace', `${agent.walkSpeed.toFixed(2)} m/s`)}
      <div class="needs">
        ${need('Energy', agent.energy)}
        ${need('Food', 1 - agent.hunger)}
        ${need('Social', agent.social)}
        ${need('Fun', agent.fun)}
      </div>
      <p class="insp-note">
        An invented inhabitant. Their home is a real mapped building; who actually
        lives there is not known to this simulation and is not modelled.
      </p>
    `;
    this.inspector.hidden = false;
    this.followBtn.disabled = false;
    void world;
  }

  showBuilding(building: Building, pois: Poi[]): void {
    const inside = pois.filter((p) => p.buildingId === building.id);
    const categories = [...new Set(inside.map((p) => POI_LABEL[p.kind]))];

    this.inspectorBody.innerHTML = `
      <h3 class="insp-title">${BUILDING_LABEL[building.kind]}</h3>
      <p class="insp-sub">${describeBuilding(building)}</p>
      ${row('Height', `${building.height.toFixed(1)} m`)}
      ${row('Storeys', String(building.levels))}
      ${row('Footprint', `${Math.round(building.area).toLocaleString()} m²`)}
      ${row('Capacity', building.capacity ? `~${building.capacity} people` : '—')}
      ${categories.length ? row('Ground floor', categories.join(', ')) : ''}
      <p class="insp-note">
        Shape, height and use come from the map. Categories only — any shop or
        business name in the source data is discarded on import, and the inside of
        the building is neither drawn nor simulated.
      </p>
    `;
    this.inspector.hidden = false;
    this.followBtn.disabled = true;
  }

  hideInspector(): void {
    this.inspector.hidden = true;
    this.followBtn.disabled = true;
  }

  /* ------------------------------------------------------------ search */

  setSearchBusy(busy: boolean): void {
    this.searchBtn.disabled = busy;
    this.searchBtn.textContent = busy ? '…' : 'Load';
  }

  showSearchResults(results: Array<{ name: string; lat: number; lon: number }>): void {
    if (!results.length) {
      this.searchResults.innerHTML =
        '<div class="search-result" style="color:var(--muted)">Nothing found. Try adding a city or country.</div>';
      this.searchResults.hidden = false;
      return;
    }
    this.searchResults.innerHTML = '';
    for (const r of results) {
      const btn = document.createElement('button');
      btn.className = 'search-result';
      btn.type = 'button';
      btn.textContent = r.name;
      btn.addEventListener('click', () => {
        this.searchResults.hidden = true;
        this.searchInput.value = r.name.split(',')[0];
        this.cb.onPickResult(r.lat, r.lon, r.name, this.radius);
      });
      this.searchResults.appendChild(btn);
    }
    this.searchResults.hidden = false;
  }

  hideSearchResults(): void {
    this.searchResults.hidden = true;
  }

  get radius(): number {
    return parseInt(this.radiusSelect.value, 10);
  }

  setMode(mode: string): void {
    for (const chip of document.querySelectorAll<HTMLElement>('[data-mode]')) {
      chip.classList.toggle('is-active', chip.dataset.mode === mode);
    }
  }

  /** Move the speed selection without raising the callback that set it. */
  setSpeed(scale: number): void {
    for (const chip of document.querySelectorAll<HTMLElement>('[data-speed]')) {
      chip.classList.toggle('is-active', Number(chip.dataset.speed) === scale);
    }
  }

  /* ------------------------------------------------------------- bind */

  private bindSpeeds(): void {
    for (const chip of document.querySelectorAll<HTMLElement>('[data-speed]')) {
      chip.addEventListener('click', () => {
        for (const other of document.querySelectorAll<HTMLElement>('[data-speed]')) {
          other.classList.remove('is-active');
        }
        chip.classList.add('is-active');
        this.cb.onSpeedChange(Number(chip.dataset.speed));
      });
    }
  }

  private bindModes(): void {
    for (const chip of document.querySelectorAll<HTMLElement>('[data-mode]')) {
      chip.addEventListener('click', () => {
        const mode = chip.dataset.mode as 'orbit' | 'walk' | 'follow' | 'drive';
        if (mode === 'follow') this.cb.onFollow();
        else if (mode === 'drive') this.cb.onDrive();
        else this.cb.onModeChange(mode);
      });
    }
  }

  private bindSearch(): void {
    this.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = this.searchInput.value.trim();
      if (query) this.cb.onSearch(query, this.radius);
    });
    document.addEventListener('click', (e) => {
      if (!this.searchResults.contains(e.target as Node) && e.target !== this.searchInput) {
        this.searchResults.hidden = true;
      }
    });
  }

  private bindInspector(): void {
    $('inspector-close').addEventListener('click', () => {
      this.hideInspector();
      this.cb.onDeselect();
    });
  }

  private bindAbout(): void {
    $('export-place').addEventListener('click', () => this.cb.onExportPlace());
    const picker = $<HTMLInputElement>('import-file');
    $('import-place').addEventListener('click', () => picker.click());
    picker.addEventListener('change', () => {
      const file = picker.files?.[0];
      // Cleared so picking the same file twice in a row still fires.
      picker.value = '';
      if (file) this.cb.onImportPlace(file);
    });

    const modal = $('about-modal');
    modal.hidden = true;
    $('about-btn').addEventListener('click', () => {
      modal.hidden = false;
    });
    $('about-close').addEventListener('click', () => {
      modal.hidden = true;
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.hidden = true;
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.hidden = true;
    });
  }
}

/* ------------------------------------------------------------- helpers */

/** A row in the coverage table; `weak` flags a gap the simulation is papering over. */
function auditRow(label: string, value: string, weak = false): string {
  return `<div class="audit-row${weak ? ' is-weak' : ''}"><span>${label}</span><span>${escapeHtml(value)}</span></div>`;
}

function row(label: string, value: string): string {
  return `<div class="insp-row"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`;
}

function need(label: string, value: number): string {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const color = NEED_COLORS[label] ?? '#6fb2ff';
  return `
    <div class="need">
      <span>${label}</span>
      <div class="need-bar"><div class="need-fill" style="width:${pct}%;background:${color}"></div></div>
    </div>`;
}

function describeBuilding(b: Building): string {
  const storeys = b.levels === 1 ? 'single storey' : `${b.levels} storeys`;
  return `${BUILDING_LABEL[b.kind]}, ${storeys}`;
}

/** The map is user-supplied data; never inject it into HTML unescaped. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

