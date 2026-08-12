// Lane builder for the narrow re-gate. Re-pinned to THIS tip: `src/history-pane.nfr.test.ts` moved
// to `16bf2f50…` under `ABC-029`'s `7084c5e` after the previous gate, so the old pin is stale and
// the rig THROWS rather than measuring the wrong tree.
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const PRISTINE = join(HERE, "pristine");

const PINS = {
  "src/history-pane.ts": "c4653c4c263c4c417ea34969164ccd86",
  "src/history-pane.test.ts": "9533f05038780def980bf5a86707cdbd",
  "src/history-pane.nfr.test.ts": "16bf2f50c93e2e896b5406cbfa772b8b",
};

const md5 = (text) => createHash("md5").update(text).digest("hex");

export function read(relative) {
  const text = readFileSync(join(PRISTINE, relative), "utf8");
  const want = PINS[relative];
  if (want !== undefined && md5(text) !== want) {
    throw new Error(`PIN MISMATCH ${relative}: ${md5(text)} != ${want} — REFUSING to measure`);
  }
  return text;
}

export function replaceOnce(text, anchor, replacement, label) {
  const parts = text.split(anchor);
  if (parts.length !== 2) throw new Error(`anchor not unique (${parts.length - 1}x): ${label}`);
  return parts[0] + replacement + parts[1];
}

export function buildLane(name, { editTest = null, editPane = null } = {}) {
  const lane = join(HERE, "lanes", name);
  rmSync(lane, { recursive: true, force: true });
  mkdirSync(lane, { recursive: true });
  cpSync(join(PRISTINE, "src"), join(lane, "src"), { recursive: true });
  for (const file of ["package.json", "tsconfig.json", "biome.json"]) {
    cpSync(join(PRISTINE, file), join(lane, file));
  }
  symlinkSync(join(PRISTINE, "node_modules"), join(lane, "node_modules"));
  if (editTest !== null) {
    writeFileSync(join(lane, "src/history-pane.test.ts"), editTest(read("src/history-pane.test.ts")));
  }
  if (editPane !== null) {
    writeFileSync(join(lane, "src/history-pane.ts"), editPane(read("src/history-pane.ts")));
  }
  return lane;
}
