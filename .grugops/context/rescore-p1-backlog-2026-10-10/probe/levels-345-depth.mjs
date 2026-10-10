// BA/PM probe, rescore-p1-backlog-2026-10-10. Read-only use of merged src/ modules; writes nothing.
// Question: on a virtual clock (ABC-085 A5's mode), how often do levels 3, 4 and 5 (rate 0, budget
// 3000 / 4000 / 4500 ms) complete a DIFFERENT depth, or choose a DIFFERENT move, on the same position?
// An aborted iteration is discarded and the TT is cleared per search, so equal completed depth =>
// identical move. Also records real wall ms per virtual reading, to price ABC-085's run per step.
// Usage: node levels-345-depth.mjs <step> [stride]   (run from the repository root)
import { performance } from "node:perf_hooks";
import { buildCorpus } from "../../../../src/evaluate.mirror-corpus.ts";
import { createLevel, LEVELS } from "../../../../src/levels.ts";
import { virtualClock } from "../../../../src/virtual-clock.ts";

const step = Number(process.argv[2]);
const stride = Number(process.argv[3] ?? 4);
const corpus = buildCorpus().filter((e, i) => !e.name.includes("child") || i % stride === 0);

let depthDiff34 = 0;
let depthDiff45 = 0;
let moveDiff34 = 0;
let moveDiff45 = 0;
let readings = 0;
let wallMs = 0;
const depths = { 3: [], 4: [], 5: [] };
for (const { position } of corpus) {
  const out = {};
  for (const id of [3, 4, 5]) {
    const t0 = performance.now();
    const choice = createLevel(LEVELS[id], { seed: 1, now: virtualClock(step) })(position);
    wallMs += performance.now() - t0;
    readings += choice.elapsedMs / step + 1;
    out[id] = choice;
    depths[id].push(choice.depth);
  }
  const key = (c) => JSON.stringify(c.move);
  if (out[3].depth !== out[4].depth) depthDiff34++;
  if (out[4].depth !== out[5].depth) depthDiff45++;
  if (key(out[3]) !== key(out[4])) moveDiff34++;
  if (key(out[4]) !== key(out[5])) moveDiff45++;
}
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
console.log(
  JSON.stringify({
    step,
    positions: corpus.length,
    medianDepth: { 3: median(depths[3]), 4: median(depths[4]), 5: median(depths[5]) },
    depthDiffers: { "3v4": depthDiff34, "4v5": depthDiff45 },
    moveDiffers: { "3v4": moveDiff34, "4v5": moveDiff45 },
    realMsPerReading: Number((wallMs / readings).toFixed(3)),
    realMsPerMove: {
      level3: Number(((wallMs / readings) * (3000 / step)).toFixed(1)),
      level5: Number(((wallMs / readings) * (4500 / step)).toFixed(1)),
    },
    node: process.version,
  }),
);
