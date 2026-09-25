/**
 * PROBE: ABC-121 A1 against THE BUILD (src/, not the reference recursion).
 *   node oracle-build.ts drift <d>   search() vs searchWithoutReductions at fixed depth d, 190 corpus
 *   node oracle-build.ts mates <d>   mate floor: searchWithoutReductions mate at d -> search() at d+1,
 *                                    same sign and no longer, BOTH signs; on src/search.mate-corpus.ts
 * Prints one JSON summary line (plus the offending positions).
 */
import { parseFen } from "../../../../src/fen.ts";
import { MATE_CORPUS } from "../../../../src/search.mate-corpus.ts";
import { MATE_SCORE, search, searchWithoutReductions } from "../../../../src/search.ts";
import { broad, lbl } from "./corpus.ts";

const [mode, dArg] = process.argv.slice(2);
const d = Number(dArg);
const isMate = (s: number): boolean => Math.abs(s) > MATE_SCORE - 1000;
const t0 = performance.now();

if (mode === "drift") {
  const deltas: number[] = [];
  const worst: Array<[number, string, number, number]> = [];
  let flips = 0;
  let moveDiff = 0;
  let nOn = 0;
  let nRef = 0;
  for (const [name, fen] of broad()) {
    const ref = searchWithoutReductions(parseFen(fen), d);
    const on = search(parseFen(fen), d);
    nOn += on.nodes;
    nRef += ref.nodes;
    if (lbl(ref.move) !== lbl(on.move)) moveDiff++;
    if (isMate(ref.score) !== isMate(on.score) || (isMate(ref.score) && Math.sign(ref.score) !== Math.sign(on.score))) {
      flips++;
      console.log(JSON.stringify({ mateFlip: name, ref: ref.score, on: on.score }));
      continue;
    }
    if (isMate(ref.score)) continue;
    const delta = Math.abs(on.score - ref.score);
    deltas.push(delta);
    worst.push([delta, name, ref.score, on.score]);
  }
  deltas.sort((a, b) => a - b);
  worst.sort((a, b) => b[0] - a[0]);
  const within = (cp: number) => +(deltas.filter((x) => x <= cp).length / deltas.length).toFixed(4);
  console.log(JSON.stringify({ summary: "drift", depth: d, compared: deltas.length, mateFlips190: flips, identical: within(0), within25: within(25), within50: within(50), max: deltas[deltas.length - 1], moveDiffers: moveDiff, nodesOnOverRef: +(nOn / nRef).toFixed(4), worst5: worst.slice(0, 5), ms: Math.round(performance.now() - t0) }));
} else if (mode === "mates") {
  let mates = 0;
  let flips = 0;
  let longer = 0;
  let longerPositive = 0;
  const bad: unknown[] = [];
  for (const fen of MATE_CORPUS) {
    const ref = searchWithoutReductions(parseFen(fen), d);
    if (!isMate(ref.score)) continue;
    mates++;
    const on = search(parseFen(fen), d + 1);
    if (!isMate(on.score) || Math.sign(on.score) !== Math.sign(ref.score)) {
      flips++;
      bad.push({ flip: fen, ref: ref.score, on: on.score });
    } else if (Math.abs(on.score) < Math.abs(ref.score)) {
      longer++;
      if (ref.score > 0) longerPositive++;
      bad.push({ longer: fen, ref: ref.score, on: on.score });
    }
  }
  for (const b of bad.slice(0, 10)) console.log(JSON.stringify(b));
  console.log(JSON.stringify({ summary: "mates", refDepth: d, onDepth: d + 1, positions: MATE_CORPUS.length, mateScoredByRef: mates, flips, longerEitherSign: longer, longerSideToMoveMates: longerPositive, ms: Math.round(performance.now() - t0) }));
}
