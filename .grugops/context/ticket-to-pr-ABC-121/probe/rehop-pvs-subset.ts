// ABC-121 lane re-hop: which positions of the default PVS-identity guard (six endgames + position-3
// at depth 4) red `door-withoutReductions-reduces`, and what each costs. That mutant makes
// searchWithoutReductions reduce, i.e. score what search() scores; the guard reds it on a position
// iff search() and searchWithoutPvsOrReductions differ there. Plain node, from the worktree root:
//   node .grugops/context/ticket-to-pr-ABC-121/probe/rehop-pvs-subset.ts
import { parseFen } from "../../../../src/fen.ts";
import { search, searchWithoutPvsOrReductions, searchWithoutReductions } from "../../../../src/search.ts";

const POSITIONS: ReadonlyArray<[string, string]> = [
  ["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"],
  ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"],
  ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"],
  ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"],
  ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"],
  ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
];

for (let pass = 0; pass < 2; pass++) {
  // pass 0 warms the JIT; pass 1 is reported
  for (const [name, fen] of POSITIONS) {
    const t0 = performance.now();
    const pvs = searchWithoutReductions(parseFen(fen), 4).score;
    const base = searchWithoutPvsOrReductions(parseFen(fen), 4).score;
    const ms = performance.now() - t0;
    const mutant = search(parseFen(fen), 4).score;
    if (pass === 1) {
      console.log(
        `${name}\tguard cost ${ms.toFixed(1)} ms\tidentity ${pvs === base ? "holds" : "BROKEN"}\t` +
          `mutant (reducing door) ${mutant} vs ${base}: ${mutant !== base ? "RED" : "green"}`,
      );
    }
  }
}
