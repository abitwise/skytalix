/**
 * PROBE: the G6 knight-g1 pair (transposition.test.ts, ABC-081 A1) under every configuration, in
 * the build and in the review's reference recursion (lmr-ref.ts), at depths 3-6. Scores, moves, and
 * — for the build's shipped search — nodes.
 */
import { parseFen } from "../../../../src/fen.ts";
import {
  search,
  searchWithoutPvsOrReductions,
  searchWithoutReductions,
  searchWithoutTable,
} from "../../../../src/search.ts";
import { lbl } from "./corpus.ts";
import { BASE, type Cfg, fixed } from "./lmr-ref.ts";

const PAIR: Array<[string, string]> = [
  ["knight-g1 w K", "4k3/8/8/8/8/8/8/4K1NR w K - 0 1"],
  ["knight-g1 w -", "4k3/8/8/8/8/8/8/4K1NR w - - 0 1"],
];
const PVS: Cfg = { ...BASE, pvs: true };
const LMR: Cfg = { ...BASE, pvs: true, lmr: true };
for (const [name, fen] of PAIR) {
  for (let d = 3; d <= 6; d++) {
    const shipped = search(parseFen(fen), d);
    console.log(
      JSON.stringify({
        name,
        d,
        build: {
          search: [shipped.score, lbl(shipped.move), shipped.nodes],
          withoutReductions: searchWithoutReductions(parseFen(fen), d).score,
          withoutPvsOrReductions: searchWithoutPvsOrReductions(parseFen(fen), d).score,
          withoutTable: searchWithoutTable(parseFen(fen), d).score,
        },
        reference: {
          base: fixed(parseFen(fen), d, BASE).score,
          pvs: fixed(parseFen(fen), d, PVS).score,
          lmr: fixed(parseFen(fen), d, LMR).score,
          lmrTableOff: fixed(parseFen(fen), d, { ...LMR, table: false }).score,
        },
      }),
    );
  }
}
