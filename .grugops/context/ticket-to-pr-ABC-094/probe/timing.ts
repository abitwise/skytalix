// ABC-094 N-LOAD and the NFR-004-derived 30 ms hit bar, measured OUTSIDE the suite (test note 4).
// Run from the repository root: node .grugops/context/ticket-to-pr-ABC-094/probe/timing.ts
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { makeMove } from "../../../../src/apply.ts";
import { createBookProbe } from "../../../../src/book.ts";
import { parseFen } from "../../../../src/fen.ts";
import { legalMoves } from "../../../../src/legal.ts";
import { seededRandom } from "../../../../src/levels.ts";
import { squareName } from "../../../../src/position.ts";

const ARTIFACT = new URL("../../../../data/opening-book/book.json", import.meta.url);
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let reads = 0;
const options = { read: () => (reads++, readFileSync(ARTIFACT)), warn: () => {}, random: seededRandom(1) };

let t = performance.now();
const probe = createBookProbe(options);
const construct = performance.now() - t;
const readsAtConstruction = reads;

const start = parseFen(START);
t = performance.now();
probe.bookMove(start);
const firstCall = performance.now() - t; // read + decode + JSON.parse + schema check + one hit

const afterE4 = parseFen(START);
const e4 = legalMoves(afterE4).find((m) => `${squareName(m.from)}${squareName(m.to)}` === "e2e4");
if (e4 === undefined) throw new Error("e2e4 not legal");
makeMove(afterE4, e4);

const hits: number[] = [];
for (let i = 0; i < 1000; i++) {
  const position = i % 2 === 0 ? start : afterE4;
  t = performance.now();
  if (probe.bookMove(position) === undefined) throw new Error("expected a book hit");
  hits.push(performance.now() - t);
}
hits.sort((a, b) => a - b);
console.log(
  JSON.stringify({
    node: process.version,
    readsAtConstruction,
    constructMs: +construct.toFixed(3),
    firstCallLoadMs: +firstCall.toFixed(2),
    readsAfter1001Calls: reads,
    hitMedianMs: +(hits[499] as number).toFixed(4),
    hitP99Ms: +(hits[989] as number).toFixed(4),
    hitMaxMs: +(hits[999] as number).toFixed(4),
  }),
);
