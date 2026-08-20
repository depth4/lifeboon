/**
 * The shape of the ground mesh's grid, on its own so more than one thing can
 * ask about it without pulling in a renderer.
 *
 * Two callers need these numbers and they must not disagree. The mesh builds
 * its triangles from them; the grading needs the cell width, because the earth
 * is forbidden to stand higher than a street for about a cell beyond its edge
 * and "a cell" has to mean a cell of the mesh that will actually draw it. A
 * test measures the result, and it reads them from here too.
 */

/**
 * Grid resolution of the base mesh, per side.
 *
 * Derived from the elevation data rather than fixed, because the ground now
 * carries detail finer than the satellite ever saw: carved river beds and the
 * cut made for every street. A mesh coarser than the field it samples cuts the
 * corners off both, and measurement found the result — the base mesh standing
 * 1.1 m above a road that the heightfield put 0.4 m below it.
 *
 * Bounded at both ends: fine enough to matter, never so fine that a wide city
 * pays for detail nobody can see.
 */
export const MIN_BASE_GRID = 160;
export const MAX_BASE_GRID = 512;

/** How far past the loaded area the stretched grid reaches, as a multiple. */
export const HORIZON_FACTOR = 5;

/**
 * Share of the grid spent on the loaded area itself.
 *
 * The rest runs out to the horizon. Getting this wrong is what caused stable
 * z-fighting across the outer half of every city: the old curve widened
 * smoothly from the centre, so by 750 m out the ground was made of 40 m facets
 * and by 1300 m of 200 m facets, while land cover was subdivided to 16 m and
 * hugged the real surface.
 */
export const CORE_FRACTION = 0.72;

/**
 * How many cells across the mesh is built, and how wide one cell of its core
 * comes out.
 *
 * The core spans the **full 2 × radius** of the loaded area, not half of it.
 * Getting that factor wrong put the facets at 8 m when they were meant to be
 * at 4, and left the mesh ramping across a carved riverbank the heightfield
 * resolved sharply — 4.8 m of daylight at the water's edge. It has cost a
 * session once; it lives in one place now.
 */
export function groundGrid(radius: number, resolution: number): { cells: number; spacing: number } {
  const cells = Math.max(
    MIN_BASE_GRID,
    Math.min(MAX_BASE_GRID, Math.round((2 * radius) / (CORE_FRACTION * Math.max(2, resolution)))),
  );
  return { cells, spacing: (2 * radius) / (CORE_FRACTION * cells) };
}

/**
 * Grid position along one axis.
 *
 * Uniform across the loaded area, at a spacing matched to the elevation data,
 * so the ground is exactly as detailed as the data it is drawn from. Only
 * beyond the data — where we are extrapolating anyway — does spacing widen,
 * and there it widens fast so the horizon costs almost nothing. Monotonic over
 * [-1, 1], so the grid never folds back.
 */
export function stretch(u: number, radius: number): number {
  const a = Math.abs(u);
  const sign = u < 0 ? -1 : 1;
  if (a <= CORE_FRACTION) return sign * (a / CORE_FRACTION) * radius;
  const t = (a - CORE_FRACTION) / (1 - CORE_FRACTION);
  return sign * radius * (1 + t * (HORIZON_FACTOR - 1) * (0.3 + 0.7 * t));
}

/**
 * How far past a street's built edge the earth may not stand higher than the
 * street.
 *
 * One mesh cell is not quite enough: the triangle covering a point at the road
 * edge can reach a corner a cell away in *both* axes, so the reach has to
 * cover the diagonal. Measured with only one cell of margin, ground still came
 * through the edge of a road on a 1-in-3 hillside; with the diagonal covered
 * it does not, anywhere. Four metres is the floor — a narrower shelf than that
 * is not a shoulder, it is a kerb.
 */
export function shoulderFor(spacing: number): number {
  return Math.max(4, spacing * 1.6);
}
