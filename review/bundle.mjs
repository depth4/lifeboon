/**
 * Rebuild the review package.
 *
 *   node review/bundle.mjs
 *
 * Writes review/CORE-CODE.md (the architecture-critical source), review/DIGEST.md
 * (every source file and document, for a model that will take the whole thing)
 * and review/lifeboon-source.zip.
 *
 * DIGEST.md exists because a chat model cannot clone a repository and a bare
 * GitHub link gets it the README and a top-level file list. Third-party
 * services do this (gitingest and the like); doing it here means the owner
 * does not have to hand their repository to one.
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

// Everything, for a model with room for it. Ordered so the argument arrives
// before the evidence: the framing, then the state, then the code.
const all = execFileSync('git', ['ls-files', 'src', 'tests', 'docs', 'review', 'CLAUDE.md', 'AGENTS.md'], { encoding: 'utf8' })
  .split('\n')
  .filter((f) => /\.(ts|md)$/.test(f) && f !== 'review/CORE-CODE.md' && f !== 'review/DIGEST.md');
const order = (f) => (f === 'review/BRIEF.md' ? 0 : f.startsWith('docs/') ? 1 : f.endsWith('.md') ? 2 : 3);
all.sort((a, b) => order(a) - order(b) || a.localeCompare(b));

const lang = (f) => (f.endsWith('.ts') ? 'typescript' : 'markdown');
writeFileSync('review/DIGEST.md',
  `# Lifeboon — the whole project in one file\n\n`
  + `Every TypeScript source, test and document. ${all.length} files.\n`
  + `Repository: https://github.com/depth4/lifeboon (branch\n`
  + `\`claude/world-map-life-simulator-wthhom\` — there is no \`main\`).\n\n`
  + `Read \`review/BRIEF.md\` first — it is the first section below and it says\n`
  + `what the review is for.\n\n## Contents\n\n`
  + all.map((f) => `- \`${f}\`\n`).join('')
  + '\n---\n'
  + all.map((f) => `\n## \`${f}\`\n\n\`\`\`${lang(f)}\n${readFileSync(f, 'utf8')}\`\`\`\n`).join(''));

execFileSync('zip', ['-q', '-r', 'review/lifeboon-source.zip',
  'src', 'tests', 'docs', 'CLAUDE.md', 'package.json', 'tsconfig.json',
  'index.html', 'vite.config.ts']);

console.log('rebuilt: CORE-CODE.md, DIGEST.md, lifeboon-source.zip');
