/**
 * The pedestrian network.
 *
 * Streets arrive as independent polylines that happen to share coordinates at
 * junctions, so the first job is welding: points within half a metre of each
 * other become one node, which is what turns a pile of lines into a graph you
 * can route across.
 *
 * The graph is stored in compressed-sparse-row form (one flat array of
 * neighbours plus an index of where each node's run begins). With a few tens of
 * thousands of nodes that keeps the whole thing in a handful of typed arrays,
 * so A* stays cache-friendly and allocates nothing per query.
 */

import type { Road, Vec2 } from '../world/types';

/** Points closer than this weld into a single junction node. */
const WELD_M = 0.6;
/** Grid cell size for nearest-node lookups. */
const CELL_M = 25;

export class NavGraph {
  /** Interleaved x,z per node. */
  readonly positions: Float32Array;
  readonly nodeCount: number;
  /** CSR: neighbours of node i live in [offsets[i], offsets[i+1]). */
  private readonly offsets: Int32Array;
  private readonly neighbours: Int32Array;
  private readonly costs: Float32Array;
  /** Spatial hash for findNearest. */
  private readonly buckets: Map<number, number[]>;

  // Scratch buffers reused across queries so pathfinding does not allocate.
  private readonly gScore: Float32Array;
  private readonly fScore: Float32Array;
  private readonly cameFrom: Int32Array;
  private readonly visitStamp: Int32Array;
  private readonly closed: Uint8Array;
  private stamp = 0;
  private readonly heap: Int32Array;
  private heapSize = 0;

  private constructor(
    positions: Float32Array,
    offsets: Int32Array,
    neighbours: Int32Array,
    costs: Float32Array,
  ) {
    this.positions = positions;
    this.offsets = offsets;
    this.neighbours = neighbours;
    this.costs = costs;
    this.nodeCount = offsets.length - 1;

    this.gScore = new Float32Array(this.nodeCount);
    this.fScore = new Float32Array(this.nodeCount);
    this.cameFrom = new Int32Array(this.nodeCount);
    this.visitStamp = new Int32Array(this.nodeCount);
    this.closed = new Uint8Array(this.nodeCount);
    this.heap = new Int32Array(this.nodeCount + 1);

    this.buckets = new Map();
    for (let i = 0; i < this.nodeCount; i++) {
      const key = this.cellKey(positions[i * 2], positions[i * 2 + 1]);
      let bucket = this.buckets.get(key);
      if (!bucket) this.buckets.set(key, (bucket = []));
      bucket.push(i);
    }
  }

  private cellKey(x: number, z: number): number {
    // Pack two 16-bit cell coordinates into one number.
    const cx = Math.floor(x / CELL_M) + 32768;
    const cz = Math.floor(z / CELL_M) + 32768;
    return cx * 65536 + cz;
  }

  static build(roads: Road[]): NavGraph {
    const walkable = roads.filter((r) => r.walkable && r.points.length >= 2);

    // --- weld coincident points into shared nodes -------------------------
    const nodeX: number[] = [];
    const nodeZ: number[] = [];
    const weldGrid = new Map<number, number[]>();
    const weldKey = (x: number, z: number) =>
      (Math.floor(x / WELD_M) + 32768) * 65536 + (Math.floor(z / WELD_M) + 32768);

    const nodeFor = (p: Vec2): number => {
      const kx = Math.floor(p[0] / WELD_M);
      const kz = Math.floor(p[1] / WELD_M);
      // Check the 3x3 neighbourhood so points either side of a cell border weld.
      for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
          const bucket = weldGrid.get((kx + dx + 32768) * 65536 + (kz + dz + 32768));
          if (!bucket) continue;
          for (const idx of bucket) {
            if (Math.hypot(nodeX[idx] - p[0], nodeZ[idx] - p[1]) <= WELD_M) return idx;
          }
        }
      }
      const idx = nodeX.length;
      nodeX.push(p[0]);
      nodeZ.push(p[1]);
      const key = weldKey(p[0], p[1]);
      let bucket = weldGrid.get(key);
      if (!bucket) weldGrid.set(key, (bucket = []));
      bucket.push(idx);
      return idx;
    };

    // --- collect edges ----------------------------------------------------
    const edgeA: number[] = [];
    const edgeB: number[] = [];
    const edgeCost: number[] = [];

    for (const road of walkable) {
      // Walking beside a motorway is unpleasant; steps are slow. Costs are in
      // "effective metres" so A* prefers a slightly longer pleasant route.
      const penalty =
        road.cls === 'steps' ? 2.4
        : road.cls === 'footway' || road.cls === 'pedestrian' ? 0.85
        : road.cls === 'primary' || road.cls === 'secondary' ? 1.25
        : 1;

      let prev = nodeFor(road.points[0]);
      for (let i = 1; i < road.points.length; i++) {
        const cur = nodeFor(road.points[i]);
        if (cur === prev) continue;
        const dx = nodeX[cur] - nodeX[prev];
        const dz = nodeZ[cur] - nodeZ[prev];
        const len = Math.hypot(dx, dz);
        if (len > 0) {
          edgeA.push(prev);
          edgeB.push(cur);
          edgeCost.push(len * penalty);
        }
        prev = cur;
      }
    }

    // --- build CSR (both directions; pavements are two-way) ---------------
    const count = nodeX.length;
    const degree = new Int32Array(count);
    for (let i = 0; i < edgeA.length; i++) {
      degree[edgeA[i]]++;
      degree[edgeB[i]]++;
    }
    const offsets = new Int32Array(count + 1);
    for (let i = 0; i < count; i++) offsets[i + 1] = offsets[i] + degree[i];

    const cursor = offsets.slice(0, count);
    const neighbours = new Int32Array(offsets[count]);
    const costs = new Float32Array(offsets[count]);
    for (let i = 0; i < edgeA.length; i++) {
      const a = edgeA[i];
      const b = edgeB[i];
      neighbours[cursor[a]] = b;
      costs[cursor[a]++] = edgeCost[i];
      neighbours[cursor[b]] = a;
      costs[cursor[b]++] = edgeCost[i];
    }

    const positions = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      positions[i * 2] = nodeX[i];
      positions[i * 2 + 1] = nodeZ[i];
    }

    return new NavGraph(positions, offsets, neighbours, costs);
  }

  nodePosition(index: number): Vec2 {
    return [this.positions[index * 2], this.positions[index * 2 + 1]];
  }

  /** Nearest graph node to a point, searching outwards ring by ring. */
  findNearest(x: number, z: number, maxRadius = 220): number {
    const cx = Math.floor(x / CELL_M);
    const cz = Math.floor(z / CELL_M);
    const maxRings = Math.ceil(maxRadius / CELL_M);
    let best = -1;
    let bestDist = Infinity;

    for (let ring = 0; ring <= maxRings; ring++) {
      for (let dx = -ring; dx <= ring; dx++) {
        for (let dz = -ring; dz <= ring; dz++) {
          // Only the outer shell of each ring is new.
          if (ring > 0 && Math.max(Math.abs(dx), Math.abs(dz)) !== ring) continue;
          const bucket = this.buckets.get((cx + dx + 32768) * 65536 + (cz + dz + 32768));
          if (!bucket) continue;
          for (const idx of bucket) {
            const d = Math.hypot(this.positions[idx * 2] - x, this.positions[idx * 2 + 1] - z);
            if (d < bestDist) {
              bestDist = d;
              best = idx;
            }
          }
        }
      }
      // Once something is found, one more ring guarantees it is the closest.
      if (best >= 0 && bestDist <= ring * CELL_M) break;
    }
    return best;
  }

  private heuristic(a: number, b: number): number {
    return Math.hypot(
      this.positions[a * 2] - this.positions[b * 2],
      this.positions[a * 2 + 1] - this.positions[b * 2 + 1],
    );
  }

  /* ------------------------------------------------------- binary heap */

  private heapPush(node: number): void {
    let i = ++this.heapSize;
    this.heap[i] = node;
    while (i > 1) {
      const parent = i >> 1;
      if (this.fScore[this.heap[parent]] <= this.fScore[this.heap[i]]) break;
      const tmp = this.heap[parent];
      this.heap[parent] = this.heap[i];
      this.heap[i] = tmp;
      i = parent;
    }
  }

  private heapPop(): number {
    const top = this.heap[1];
    this.heap[1] = this.heap[this.heapSize--];
    let i = 1;
    for (;;) {
      const l = i << 1;
      const r = l + 1;
      let smallest = i;
      if (l <= this.heapSize && this.fScore[this.heap[l]] < this.fScore[this.heap[smallest]]) smallest = l;
      if (r <= this.heapSize && this.fScore[this.heap[r]] < this.fScore[this.heap[smallest]]) smallest = r;
      if (smallest === i) break;
      const tmp = this.heap[smallest];
      this.heap[smallest] = this.heap[i];
      this.heap[i] = tmp;
      i = smallest;
    }
    return top;
  }

  /**
   * A* between two nodes. Returns node indices from start to goal, or null if
   * they are in disconnected components (islands across a river, say).
   *
   * `maxExpansions` bounds the work per call so one hopeless query cannot
   * stall a frame.
   */
  findPath(start: number, goal: number, maxExpansions = 12000): number[] | null {
    if (start < 0 || goal < 0 || start >= this.nodeCount || goal >= this.nodeCount) return null;
    if (start === goal) return [start];

    const stamp = ++this.stamp;
    this.heapSize = 0;

    this.visitStamp[start] = stamp;
    this.gScore[start] = 0;
    this.fScore[start] = this.heuristic(start, goal);
    this.cameFrom[start] = -1;
    this.closed[start] = 0;
    this.heapPush(start);

    let expansions = 0;
    while (this.heapSize > 0) {
      const current = this.heapPop();
      if (current === goal) return this.reconstruct(current);
      if (this.closed[current] === 1 && this.visitStamp[current] === stamp) continue;
      this.closed[current] = 1;

      if (++expansions > maxExpansions) return null;

      const end = this.offsets[current + 1];
      for (let e = this.offsets[current]; e < end; e++) {
        const next = this.neighbours[e];
        const tentative = this.gScore[current] + this.costs[e];
        const seen = this.visitStamp[next] === stamp;
        if (seen && this.closed[next] === 1) continue;
        if (!seen || tentative < this.gScore[next]) {
          this.visitStamp[next] = stamp;
          this.closed[next] = 0;
          this.gScore[next] = tentative;
          this.fScore[next] = tentative + this.heuristic(next, goal);
          this.cameFrom[next] = current;
          this.heapPush(next);
        }
      }
    }
    return null;
  }

  private reconstruct(goal: number): number[] {
    const path: number[] = [];
    let node = goal;
    while (node !== -1) {
      path.push(node);
      node = this.cameFrom[node];
      if (path.length > 20000) break;
    }
    return path.reverse();
  }
}
