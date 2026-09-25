/**
 * PROBE: the A4 candidates in BOTH shapes — fixed depth (search()) and deepened to the same depth
 * (chooseMove), correct LMR vs PVS alone vs the review's noLmrResearch / noResearch variants.
 */
import { parseFen } from "../../../../src/fen.ts";
import { lbl } from "./corpus.ts";
import { BASE, type Cfg, deepen, fixed } from "./lmr-ref.ts";

const CANDIDATES: Array<[string, string]> = [
  ["position-3/b4b1", "8/2p5/3p4/KP5r/5p1k/8/4P1P1/1R6 b - - 1 1"],
  ["position-3/e2e4", "8/2p5/3p4/KP5r/1R2Pp1k/8/6P1/8 b - e3 0 1"],
  ["position-3/b4b3/h5d5", "8/2p5/3p4/KP1r4/5p1k/1R6/4P1P1/8 w - - 2 2"],
];
const PVS: Cfg = { ...BASE, pvs: true };
const LMR: Cfg = { ...BASE, pvs: true, lmr: true };
for (const [name, fen] of CANDIDATES) {
  for (const d of [4, 5]) {
    const row: Record<string, unknown> = { name, d };
    for (const [shape, run] of [
      ["fixed", (c: Cfg) => fixed(parseFen(fen), d, c)],
      ["deepen", (c: Cfg) => deepen(parseFen(fen), c, d)],
    ] as const) {
      const r = (c: Cfg) => {
        const x = run(c);
        return [x.score, lbl(x.move)];
      };
      row[shape] = {
        pvs: r(PVS),
        lmr: r(LMR),
        noLmrResearch: r({ ...LMR, bug: "noLmrResearch" }),
        noResearch: r({ ...LMR, bug: "noResearch" }),
      };
    }
    console.log(JSON.stringify(row));
  }
}
