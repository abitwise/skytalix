// SCRATCH PROBE (arch-ABC-292-probe), addendum 1: rule 2's defect check on PR7's NEWLY-MISSED row, seed 1700. Runs on the
// `cand` copy, copied to its root. Usage: node defect.ts det | tree. `det`: the row alone, ON and OFF, in this fresh process,
// as the suite's runSuite scores it. `tree`: every position of the full-width tree to depth 3 from the row's root; the seam
// against the labeller as whole objects, and evaluate minus the off evaluation against the labeller's signed net. Counts
// only: no per-term figure, no search under one term alone.
import { makeMove, unmakeMove } from "./src/apply.ts";
import { chooseMove, chooseMoveWithoutPieceTerms } from "./src/engine.ts";
import { evaluate, evaluateAtPhaseWithoutPieceTerms, phaseOf, pieceTermsForTest } from "./src/evaluate.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { legalMoves } from "./src/legal.ts";
import { squareName } from "./src/position.ts";
import { virtualClock } from "./src/virtual-clock.ts";
import { label } from "./labeller.ts";
const FEN = "8/7B/6r1/1P2b1p1/1k6/3p2N1/2nK4/N5B1 b - - 0 1";
const ACCEPT = ["g6g7", "g6h6"];
const mode = process.argv[2];
const mv = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "-");
const KEYS = ["BISHOP_PAIR", "ROOK_OPEN_FILE", "ROOK_SEMI_OPEN_FILE"] as const;
const sum = (x: any) => KEYS.reduce((a, k) => a + x[k].mg, 0);
const eq = (a: any, b: any) => KEYS.every((k) => a[k].mg === b[k].mg && a[k].eg === b[k].eg);
if (mode === "det") {
  for (const [f, choose] of [["OFF", chooseMoveWithoutPieceTerms], ["ON", chooseMove]] as const) {
    const c = choose(parseFen(FEN), { budgetMs: 25, now: virtualClock(1) }) as any;
    const chosen = c === null ? "null" : mv(c.move);
    console.log(JSON.stringify({ form: f, chosen, solved: ACCEPT.includes(chosen), depth: c?.depth, nodes: c?.nodes }));
  }
} else if (mode === "tree") {
  let positions = 0, seamBad = 0, relBad = 0;
  const p = parseFen(FEN);
  const visit = (d: number) => {
    positions++;
    const fen = toFen(p);
    const seam = pieceTermsForTest(p);
    const want = label(fen);
    if (!eq(seam.white, want.white) || !eq(seam.black, want.black)) seamBad++;
    const net = sum(want.white) - sum(want.black);
    if (evaluate(p) - evaluateAtPhaseWithoutPieceTerms(p, phaseOf(p)) !== (p.blackToMove ? 0 - net : net)) relBad++;
    if (d === 0) return;
    for (const m of legalMoves(p)) { const u = makeMove(p, m); visit(d - 1); unmakeMove(p, m, u); }
  };
  visit(3);
  console.log(JSON.stringify({ root: FEN, depth: 3, positions, seamBad, relBad }));
} else throw new Error(`mode ${mode}`);
