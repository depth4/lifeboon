import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';

/**
 * Stamp the build so a running page can say which version it is.
 * Without this the only way to tell whether a fix has reached the browser is
 * to guess, and a stale cache looks exactly like a fix that did not work.
 */
function buildStamp(): string {
  let commit = 'dev';
  try {
    commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch {
    // Not a git checkout; the timestamp alone still identifies the build.
  }
  const when = new Date().toISOString().slice(0, 16).replace('T', ' ');
  return `${commit} · ${when} UTC`;
}

export default defineConfig({
  define: {
    __BUILD_STAMP__: JSON.stringify(buildStamp()),
  },
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
});
