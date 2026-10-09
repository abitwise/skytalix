// QE probe (qe-ABC-082): the pawn term in isolation, against HAND-COMPUTED values and an
// independent reference, plus mirror and file-reflection symmetry far beyond the corpus.
//
// Usage: node terms.ts <base-tree> <branch-tree> [<tree-under-test>]
//   <base-tree>   a tree whose evaluate is material + PST only (5ebe1d8)
//   <branch-tree> the build (873911d or 720b92d; evaluate.ts is identical in both)
//   <tree-under-test> defaults to <branch-tree>; pass a mutant copy to see what it breaks.
// term(p) := whiteMinusBlack(test) - whiteMinusBlack(base) = the pawn term, white's view.
import { pathToFileURL } from "node:url";

const [baseTree, branchTree, testTree = branchTree] = process.argv.slice(2);
const load = (tree: string, file: string) => import(pathToFileURL(`${tree}/src/${file}`).href);

const base = await load(baseTree, "evaluate.ts");
const test = await load(testTree, "evaluate.ts");
const { parseFen } = await load(branchTree, "fen.ts");
const { legalMoves } = await load(branchTree, "legal.ts");
const { makeMove } = await load(branchTree, "apply.ts");
const { mirrorPosition, clonePosition, PERFT_POSITIONS } = await load(
  branchTree,
  "evaluate.mirror-corpus.ts",
);

const white = (ev: (p: unknown) => number, p: { blackToMove: boolean }) =>
  p.blackToMove ? -ev(p) : ev(p);
const term = (p: { blackToMove: boolean }) =>
  white(test.evaluate, p) - white(base.evaluate, p);

// ---- 1. hand-computed table. Weights read from the ticket's build: D 15/extra pawn on a file,
// I 10/isolated pawn, P by own-side rank [0,5,10,20,35,60,100,0]. Each value below was worked by
// hand (QE notebook in the observation note), NOT read from the code's output.
const HAND: ReadonlyArray<[string, string, number]> = [
  ["H1 lone c2: I -10, P(r2) +5", "4k3/8/8/8/8/8/2P5/4K3 w - - 0 1", -5],
  ["H2 doubled c3/c4: D -15, I -20, P +10 +20", "4k3/8/8/8/2P5/2P5/8/4K3 w - - 0 1", -5],
  ["H3 tripled d3/d4/d5: D -30, I -30, P +65", "4k3/8/8/3P4/3P4/3P4/8/4K3 w - - 0 1", 5],
  ["H4 d5 v c6 adjacent-ahead blocker: both not passed, both isolated", "4k3/8/2p5/3P4/8/8/8/4K3 w - - 0 1", 0],
  ["H5 d5 v d3 behind: both passed (+35, -60), both isolated", "4k3/8/8/3P4/8/3p4/8/4K3 w - - 0 1", -25],
  ["H6 a5 v h7 edges: +35 -10 | -5 +10", "4k3/7p/8/P7/8/8/8/4K3 w - - 0 1", 30],
  ["H7 h5 v a6 edges (wrap trap): +35 -10 | -10 +10", "4k3/8/p7/7P/8/8/8/4K3 w - - 0 1", 25],
  ["H8 b7 promotion rank: P +100, I -10", "4k3/1P6/8/8/8/8/8/4K3 w - - 0 1", 90],
  ["H9 black c2 one step from promotion v d3: -100 +10 | +10 -10", "4k3/8/8/8/8/3P4/2p5/4K3 b - - 0 1", -90],
  ["H10 d5 beside c5, same rank: both passed (+35, -20)", "4k3/8/8/2pP4/8/8/8/4K3 w - - 0 1", 15],
  ["H11 a2b2 v a7b7: connected, none passed", "4k3/pp6/8/8/8/8/PP6/4K3 w - - 0 1", 0],
  ["H12 islands b2 d2 f2 v a7 c7: f2 passed +5", "4k3/p1p5/8/8/8/8/1P1P1P2/4K3 w - - 0 1", -5],
  ["H13 black doubled d6/d5: D +15, I +20, P -30", "4k3/8/3p4/3p4/8/8/8/4K3 w - - 0 1", 5],
  ["H14 d5 v b6 two files away: both passed", "4k3/8/1p6/3P4/8/8/8/4K3 w - - 0 1", 25],
  ["H15 b6 (+60) v a2 (-100), both isolated", "8/8/1P6/8/8/5k2/p7/4K3 w - - 0 1", -40],
  ["H16 position-3: three white isolated, f4 isolated, no passer", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 b - - 0 1", -20],
  ["H17 start position", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 0],
  ["H18 kiwipete: eight files each, nothing passed", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", 0],
  ["H19 h-file pair h2/h3 with g-file friend g2: D -15 only, no passer v h7", "4k3/7p/8/8/8/7P/6PP/4K3 w - - 0 1", -5],
  ["H20 a4 with friend b2 only: neither isolated, both passed +20 +5", "4k3/8/8/8/P7/8/1P6/4K3 w - - 0 1", 25],
];
// H19 by hand: white g2,h2,h3: h doubled -15; g2 has h (not iso), h2/h3 have g (not iso);
//   passed: g2 sees h7 on h-file ahead -> not; h2,h3 see h7 -> not. Black h7: isolated +10
//   (no g pawn), passed? ahead g/h: g2,h2,h3 -> not.  => -15 + 10 = -5.
// H20 by hand: white a4: b2 on adjacent b -> not isolated; passed (no black pawns) +20 (rank 4).
//   b2: a4 on a -> not isolated; passed +5 (rank 2). => +25.

let handFail = 0;
const handRows: string[] = [];
for (const [name, fen, expected] of HAND) {
  const got = term(parseFen(fen));
  const want = expected;
  const ok = got === want;
  if (!ok) handFail++;
  handRows.push(`${ok ? "ok " : "BAD"} ${String(got).padStart(5)} want ${String(want).padStart(5)}  ${name}`);
}
// Harness self-test: a deliberately wrong expectation (H20 + 1) must disagree with the tree.
const selfTest = term(parseFen(HAND[19][1])) !== HAND[19][2] + 1;

// ---- 2. an independent reference of the term, written from the ticket's definitions.
function reference(board: Uint8Array): number {
  const W = 1;
  const B = 9;
  const pawns: Array<{ f: number; r: number; c: number }> = [];
  for (let r = 0; r < 8; r++)
    for (let f = 0; f < 8; f++) {
      const x = board[r * 16 + f];
      if (x === W || x === B) pawns.push({ f, r, c: x });
    }
  let s = 0;
  for (const c of [W, B]) {
    const sign = c === W ? 1 : -1;
    const mine = pawns.filter((p) => p.c === c);
    const theirs = pawns.filter((p) => p.c !== c);
    for (let f = 0; f < 8; f++) {
      const n = mine.filter((p) => p.f === f).length;
      if (n > 1) s -= sign * 15 * (n - 1);
    }
    for (const p of mine) {
      if (!mine.some((q) => Math.abs(q.f - p.f) === 1)) s -= sign * 10;
      const ahead = (q: { r: number }) => (c === W ? q.r > p.r : q.r < p.r);
      const passed = !theirs.some((q) => Math.abs(q.f - p.f) <= 1 && ahead(q));
      const own = c === W ? p.r : 7 - p.r;
      if (passed) s += sign * [0, 5, 10, 20, 35, 60, 100, 0][own];
    }
  }
  return s;
}

const flipFiles = (p: { board: Uint8Array }) => {
  const q = clonePosition(p);
  q.board.fill(0);
  for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) q.board[r * 16 + (7 - f)] = p.board[r * 16 + f];
  q.castling = 0; // castling has no file-reflected meaning; the base PST cancels in the difference
  q.epSquare = -1;
  return q;
};

// deterministic PRNG
let seed = 0x082082;
const rnd = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type P = ReturnType<typeof parseFen>;
const positions: P[] = [];
// (a) random legal games from the six perft roots, every position sampled
for (const { fen } of PERFT_POSITIONS) {
  for (let g = 0; g < 60; g++) {
    const p = parseFen(fen);
    for (let ply = 0; ply < 80; ply++) {
      const moves = legalMoves(p);
      if (moves.length === 0) break;
      makeMove(p, moves[Math.floor(rnd() * moves.length)]);
      positions.push(clonePosition(p));
    }
  }
}
const legalCount = positions.length;
// (b) random pawn-only boards (kings on e1/e8), 0-8 pawns a side anywhere on ranks 2-7
for (let i = 0; i < 20000; i++) {
  const p = parseFen("4k3/8/8/8/8/8/8/4K3 w - - 0 1");
  for (const pc of [1, 9]) {
    const n = Math.floor(rnd() * 9);
    for (let k = 0; k < n; k++) {
      const sq = (1 + Math.floor(rnd() * 6)) * 16 + Math.floor(rnd() * 8);
      if (p.board[sq] === 0) p.board[sq] = pc;
    }
  }
  p.blackToMove = rnd() < 0.5;
  positions.push(p);
}

let mirrorFail = 0;
let flipFail = 0;
let refFail = 0;
const firstFails: string[] = [];
for (const p of positions) {
  const m = mirrorPosition(p);
  if (!Object.is(test.evaluate(m), test.evaluate(p))) {
    mirrorFail++;
    if (firstFails.length < 3) firstFails.push(`mirror ${JSON.stringify(Array.from(p.board))}`);
  }
  if (term(flipFiles(p)) !== term(p)) flipFail++;
  if (term(p) !== reference(p.board)) {
    refFail++;
    if (firstFails.length < 6) firstFails.push(`ref got ${term(p)} want ${reference(p.board)}`);
  }
}

console.log(handRows.join("\n"));
console.log(
  JSON.stringify({
    tree: testTree,
    hand: { rows: HAND.length, fail: handFail, harnessCanFail: selfTest },
    beyondCorpus: { positions: positions.length, legalGamePositions: legalCount, pawnBoards: positions.length - legalCount },
    mirrorFail,
    fileFlipFail: flipFail,
    referenceFail: refFail,
    firstFails,
  }),
);
process.exitCode = handFail + mirrorFail + flipFail + refFail === 0 && selfTest ? 0 : 1;
