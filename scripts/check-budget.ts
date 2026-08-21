import fs from 'fs';
import path from 'path';
import { gzipSync } from 'zlib';

/**
 * Guards against JavaScript creep. This is a content site: the only client
 * components are the nav, the scroll-spy table of contents and a copy button,
 * so the shipped bundle should stay small and any jump means something got
 * pulled into a client component by accident.
 *
 * Budgets are on gzipped bytes, which is what users actually download.
 */
const BUDGETS = {
  /** Every client chunk Next emits, combined. */
  totalChunksKb: 400,
  /** The single largest chunk, to catch one fat dependency. */
  largestChunkKb: 180,
};

const chunksDir = path.join(process.cwd(), '.next', 'static', 'chunks');

if (!fs.existsSync(chunksDir)) {
  console.error('No build output found. Run `npm run build` first.');
  process.exit(1);
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.js') ? [full] : [];
  });
}

const files = walk(chunksDir)
  .map((file) => ({
    name: path.relative(chunksDir, file),
    kb: gzipSync(fs.readFileSync(file)).length / 1024,
  }))
  .sort((a, b) => b.kb - a.kb);

const total = files.reduce((sum, file) => sum + file.kb, 0);
const largest = files[0];

const failures: string[] = [];
if (total > BUDGETS.totalChunksKb) {
  failures.push(
    `total client JS ${total.toFixed(1)} KB exceeds budget ${BUDGETS.totalChunksKb} KB`
  );
}
if (largest && largest.kb > BUDGETS.largestChunkKb) {
  failures.push(
    `largest chunk ${largest.name} is ${largest.kb.toFixed(1)} KB, budget ${BUDGETS.largestChunkKb} KB`
  );
}

console.log(`Client JS (gzipped): ${total.toFixed(1)} KB across ${files.length} chunks`);
for (const file of files.slice(0, 5)) {
  console.log(`  ${file.kb.toFixed(1).padStart(7)} KB  ${file.name}`);
}

if (failures.length > 0) {
  console.error('\nBundle budget exceeded:');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error('\nEither trim the dependency or raise the budget deliberately.');
  process.exit(1);
}

console.log('\nWithin budget.');
