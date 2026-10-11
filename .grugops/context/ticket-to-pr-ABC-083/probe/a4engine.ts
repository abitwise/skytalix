/**
 * PROBE: the A4 candidates in BOTH shapes — fixed depth (search()) and deepened to the same depth
 * (chooseMove), correct LMR vs PVS alone vs the review's noLmrResearch / noResearch variants.
 * ABC-083 copy: candidates = the two shipped A4 fixtures plus a4scan-branch-d4.jsonl's hits.
 */
import { parseFen } from "../../../../src/fen.ts";
import { lbl } from "./corpus.ts";
import { BASE, type Cfg, deepen, fixed } from "./lmr-ref.ts";

const CANDIDATES: Array<[string, string]> = [
 [
  "A4_FEN position-3/b4b1",
  "8/2p5/3p4/KP5r/5p1k/8/4P1P1/1R6 b - - 1 1"
 ],
 [
  "A4_SEARCH_FEN position-3/b4b1/h5h6",
  "8/2p5/3p3r/KP6/5p1k/8/4P1P1/1R6 w - - 2 2"
 ],
 [
  "position-3/b4d4/h5f5",
  "8/2p5/3p4/KP3r2/3R1p1k/8/4P1P1/8 w - - 2 2"
 ],
 [
  "position-3/b4e4/h5f5",
  "8/2p5/3p4/KP3r2/4Rp1k/8/4P1P1/8 w - - 2 2"
 ],
 [
  "position-3/b4a4/h5f5",
  "8/2p5/3p4/KP3r2/R4p1k/8/4P1P1/8 w - - 2 2"
 ],
 [
  "position-3/b4b3/f4f3",
  "8/2p5/3p4/KP5r/7k/1R3p2/4P1P1/8 w - - 0 2"
 ],
 [
  "position-3/b4b3/h4g4",
  "8/2p5/3p4/KP5r/5pk1/1R6/4P1P1/8 w - - 2 2"
 ],
 [
  "position-3/b4b3/h5d5",
  "8/2p5/3p4/KP1r4/5p1k/1R6/4P1P1/8 w - - 2 2"
 ],
 [
  "position-3/b4b2/h5h6",
  "8/2p5/3p3r/KP6/5p1k/8/1R2P1P1/8 w - - 2 2"
 ],
 [
  "position-3/a5a6/h5f5",
  "8/2p5/K2p4/1P3r2/1R3p1k/8/4P1P1/8 w - - 2 2"
 ]
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
