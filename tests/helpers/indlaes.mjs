import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rod = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

// Kører klassiske browser-scripts i en vm-kontekst, hvor self og window er konteksten selv.
// Stier er relative til repo-roden. Returnerer konteksten, så fx ctx.LK kan bruges.
export function indlaes(filer, ekstra = {}) {
  const ctx = { ...ekstra };
  ctx.self = ctx;
  ctx.window = ctx;
  createContext(ctx);
  for (const fil of filer) {
    const kode = readFileSync(resolve(rod, fil), 'utf8');
    runInContext(kode, ctx, { filename: fil });
  }
  return ctx;
}
