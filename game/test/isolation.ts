/**
 * The rule that keeps the slate clean, enforced by the build rather than by
 * good intentions.
 *
 * `attic/` is the previous project. It is kept because the mistakes and the
 * decisions in it are worth having, and deleted from nobody's memory. It is
 * **not** a source of code: anything wanted from it has to be read, understood
 * and rewritten here, deliberately, as its own small thing.
 *
 * Good intentions were tried. The rule "do not hand-roll polygon booleans" was
 * written down in that project and then broken five times, by the same person
 * who wrote it. So this is a check, and it fails the build.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const FORBIDDEN = /from\s+['"][^'"]*\.\.\/(attic|frozen)\//;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (name.endsWith('.ts')) out.push(path);
  }
  return out;
}

const offenders = walk('game')
  .filter((path) => FORBIDDEN.test(readFileSync(path, 'utf8')));

if (offenders.length) {
  console.log('The game must not import from the attic:');
  for (const path of offenders) console.log(`  ${path}`);
  process.exit(1);
}
console.log(`  ok   the game imports nothing from the attic (${walk('game').length} files)`);
