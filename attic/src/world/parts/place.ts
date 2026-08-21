/**
 * Placing the network: the one operation that puts streets into the world.
 *
 * This is the step the project has been missing. Until now geometry was
 * *derived* from OpenStreetMap ways at draw time, by whichever module needed
 * it, and each derivation made its own decisions about where a street stopped
 * and what it covered. Here the decisions are made once, in order, and
 * everything downstream reads the result:
 *
 *   1. every node gets **one** height;
 *   2. every edge gets a crown profile, pinned to its two nodes;
 *   3. every arm of every junction gets **one** port — a mouth with a place,
 *      a heading, a width and a height;
 *   4. streets are built back from those ports, junctions are built out of
 *      them.
 *
 * Step 3 is the load-bearing one. A port is computed before any geometry
 * exists, from the network alone, and then handed to both builders. Two parts
 * cannot fight over a square metre when the boundary between them was decided
 * before either was built.
 *
 * The order matters as much as the content: profiles are taken on **un-graded**
 * ground, before the earth is cut to carry them. Recomputing one afterwards
 * describes a road built on top of a road.
 */

import type { Terrain } from '../../terrain/heightfield';
import type { RoadNetwork } from '../network';
import { isUnderground, bridgeProfile, gradedProfile, ROAD_SURFACE_Y } from '../roadprofile';
import {
  gradedHalfWidth, sectionHeightAt, streetSection, type StreetEdge, type StreetNorm,
} from '../street';
import type { Part, Port } from '../parts';
import { MappedPaths } from '../sidewalks';
import type { Road, Vec2 } from '../types';
import { buildStreetPart } from './street';
import { buildJunctionPart, junctionStops } from './junction';
import { chainage, valueAt } from './polyline';

export interface PlacedNetwork {
  parts: Part[];
  /** Ports by node, in no particular order. What a junction is built from. */
  portsByNode: Map<number, Port[]>;
  /** Surface height of each network node. One node, one height. */
  nodeY: number[];
  /** Cross-section of each edge, so nothing recomputes it and disagrees. */
  sections: StreetEdge[][];
  /** Crown height at each point of each edge. */
  crowns: number[][];
}

export function placeNetwork(
  net: RoadNetwork, roads: Road[], terrain: Terrain, norm: StreetNorm,
): PlacedNetwork {
  // Pavements the map already has. Built once for the whole city and read by
  // every street part, so one street cannot decide differently from the next.
  const mapped = new MappedPaths(roads);
  const nodeY = net.nodes.map((node) => terrain.heightAt(node.x, node.z) + ROAD_SURFACE_Y);

  // A way that is not drawn must not be placed either: a tunnel has no
  // surface, and giving it one hands the car tarmac and a street name in the
  // middle of a field.
  const live = net.edges.map((edge) => !isUnderground(edge));

  const sections: StreetEdge[][] = net.edges.map((edge) => streetSection(
    // The width and class the *street* settled on, not the ones this piece of
    // way happened to carry. That reconciliation is the network's job and it
    // has already been done.
    { ...roads[edge.road], width: edge.width, cls: edge.cls, bridge: edge.bridge },
    norm,
  ));

  const crowns: number[][] = net.edges.map((edge, i) => {
    if (!live[i]) return edge.points.map(() => 0);
    const profile = edge.bridge
      ? bridgeProfile(edge.points, terrain, ROAD_SURFACE_Y, edge.layer)
      : gradedProfile(edge.points, terrain, ROAD_SURFACE_Y);
    // Pin the ends to the node heights. This is what makes a node one place
    // rather than two streets that happen to arrive nearby: whatever the
    // smoothing did along the way, both edges leave this node at its height.
    if (!edge.bridge) {
      profile[0] = nodeY[edge.from];
      profile[profile.length - 1] = nodeY[edge.to];
    }
    return profile;
  });

  const portsByNode = buildPorts(net, live, sections, crowns, nodeY);

  const parts: Part[] = [];
  net.edges.forEach((edge, i) => {
    if (!live[i]) return;
    const ports = portsByNode.get(edge.from) ?? [];
    const start = ports.find((p) => p.edge === i && p.end === 'from');
    const ends = portsByNode.get(edge.to) ?? [];
    const end = ends.find((p) => p.edge === i && p.end === 'to');
    if (!start || !end) return;
    const part = buildStreetPart({
      edge,
      edgeIndex: i,
      road: roads[edge.road],
      section: sections[i],
      crown: crowns[i],
      startPort: start,
      endPort: end,
      terrain,
      mapped: mapped.count ? mapped : null,
    });
    if (part) parts.push(part);
  });

  net.nodes.forEach((node, i) => {
    const ports = portsByNode.get(i);
    if (!ports || ports.length < 3) return;
    // A junction is surfaced as the biggest road that reaches it: where a lane
    // meets a main road it is the main road that carries its surface through.
    const cls = node.edges
      .filter((e) => live[e])
      .reduce((best, e) => (sections[e][1].offset > sections[best][1].offset ? e : best),
        node.edges.find((e) => live[e]) ?? node.edges[0]);
    const part = buildJunctionPart(i, [node.x, node.z], ports, net.edges[cls].cls);
    if (part) parts.push(part);
  });

  return { parts, portsByNode, nodeY, sections, crowns };
}

/**
 * A port carries which edge-end it belongs to, so a street can find its own
 * two mouths again without matching on coordinates.
 */
type EndedPort = Port & { edge: number; end: 'from' | 'to' };

function buildPorts(
  net: RoadNetwork, live: boolean[], sections: StreetEdge[][],
  crowns: number[][], nodeY: number[],
): Map<number, EndedPort[]> {
  interface Arm {
    edge: number;
    end: 'from' | 'to';
    dir: Vec2;
    half: number;
    /** Half-width of everything built, paving and verge but not the batter. */
    built: number;
    stop: number;
    sideStop: number;
  }
  const byNode = new Map<number, Arm[]>();

  net.nodes.forEach((node, nodeIndex) => {
    const arms: Arm[] = node.edges
      .filter((e) => live[e])
      .map((e) => {
        const edge = net.edges[e];
        return {
          edge: e,
          end: (edge.from === nodeIndex ? 'from' : 'to') as 'from' | 'to',
          dir: net.directionAt(e, nodeIndex),
          half: sections[e][1].offset,
          built: gradedHalfWidth(sections[e]),
          stop: 0,
          sideStop: 0,
        };
      });
    if (!arms.length) return;
    // Only a real junction takes ground away from its streets. Where two
    // streets simply continue into one another, or a street ends, the street
    // owns its own ground right up to the node and there is nothing to trim.
    if (arms.length >= 3) {
      const stops = junctionStops(arms);
      arms.forEach((arm, i) => {
        arm.stop = stops[i].stop;
        arm.sideStop = stops[i].sideStop;
      });
    }
    byNode.set(nodeIndex, arms);
  });

  // Two junctions cannot both eat the same short edge.
  //
  // A 12 m block between two crossroads is real and common, and each junction
  // working alone claims six or nine metres of it. Left to overlap, the street
  // is drawn *inside* both pads and its surface disagrees with theirs by the
  // whole of its gradient — measured before this pass: a 77 cm step at a
  // mouth. Pulling both mouths back keeps the ports authoritative: the pads
  // shrink with them, so the seam stays exact.
  const ends = new Map<number, Arm[]>();
  for (const arms of byNode.values()) {
    for (const arm of arms) {
      const list = ends.get(arm.edge) ?? [];
      list.push(arm);
      ends.set(arm.edge, list);
    }
  }
  for (const [edgeIndex, arms] of ends) {
    const length = net.edges[edgeIndex].length;
    const total = arms.reduce((sum, arm) => sum + arm.stop, 0);
    const room = length * 0.8;
    if (total <= room || total <= 0) continue;
    const scale = room / total;
    for (const arm of arms) {
      arm.stop *= scale;
      arm.sideStop *= scale;
    }
  }

  const out = new Map<number, EndedPort[]>();
  for (const [nodeIndex, arms] of byNode) {
    const node = net.nodes[nodeIndex];
    out.set(nodeIndex, arms.map((arm) => {
      const edge = net.edges[arm.edge];
      const chain = chainage(edge.points);
      const span = chain[chain.length - 1];
      const along = arm.end === 'from' ? arm.stop : span - arm.stop;
      const probe = arm.end === 'from'
        ? Math.min(span, along + 5) : Math.max(0, along - 5);
      const y = valueAt(crowns[arm.edge], chain, along);
      const dy = valueAt(crowns[arm.edge], chain, probe) - y;
      const at: Vec2 = [
        node.x + arm.dir[0] * arm.stop,
        node.z + arm.dir[1] * arm.stop,
      ];
      return {
        node: nodeIndex,
        at,
        dir: arm.dir,
        half: arm.half,
        // A junction is levelled to its node, and each street climbs away from
        // it at its own gradient. Taking the mouth height from anywhere but
        // the street's own profile lets the two disagree by that gradient.
        y: arm.stop > 0 ? y : nodeY[nodeIndex],
        edgeDy: sectionHeightAt(sections[arm.edge], arm.half),
        stop: arm.stop,
        sideStop: arm.sideStop,
        slope: dy / (Math.abs(probe - along) || 1),
        edge: arm.edge,
        end: arm.end,
      };
    }));
  }

  return out;
}
