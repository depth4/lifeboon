/**
 * Rebuild the review package.
 *
 *   node review/bundle.mjs
 *
 * Writes review/CORE-CODE.md (the architecture-critical source, concatenated
 * for models that take one big file) and review/lifeboon-source.zip (the lot).
 * Both are generated and git-ignored — the repository is public, so anything
 * that can clone should clone instead. BRIEF.md and ASK.md are written by hand
 * and are the part worth keeping.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const FILES = [
  'src/render/roads.ts',
  'src/terrain/heightfield.ts',
  'src/world/junctions.ts',
  'src/world/network.ts',
  'src/world/roadprofile.ts',
  'src/world/street.ts',
  'src/render/claims.ts',
  'src/render/groundgrid.ts',
  'src/render/ground.ts',
  'src/render/streetmask.ts',
  'src/world/types.ts',
  'tests/ground.ts',
];

const head = `# Lifeboon — the architecture-critical source

Concatenated for review. Read \`BRIEF.md\` first; it says what to look for.
Full repository: https://github.com/depth4/lifeboon
(branch \`claude/world-map-life-simulator-wthhom\` — there is no \`main\`)

TypeScript, Three.js, no game engine. Coordinate convention throughout:
projected metres on a local ENU tangent plane, \`x\` = east, \`z\` = south,
\`y\` = up. Triangle winding is counter-clockwise seen from outside and
backface culling is on.

## Contents

`;

const sources = FILES.map((f) => [f, readFileSync(f, 'utf8')]);
const toc = sources.map(([f, s]) => `- \`${f}\` (${s.split('\n').length - 1} lines)\n`).join('');
const body = sources.map(([f, s]) => `\n## \`${f}\`\n\n\`\`\`typescript\n${s}\`\`\`\n`).join('');
writeFileSync('review/CORE-CODE.md', head + toc + '\n---\n' + body);

execFileSync('zip', ['-q', '-r', 'review/lifeboon-source.zip',
  'src', 'tests', 'docs', 'CLAUDE.md', 'package.json', 'tsconfig.json',
  'index.html', 'vite.config.ts']);

console.log('review/CORE-CODE.md and review/lifeboon-source.zip rebuilt');
