// QE qe-gate-ABC-208: the mate floor's unchecked direction. At depth 5, does search() (null move on)
// claim a mate the door does not see, or a SHORTER mate than the door's (a horizon-bounded pruned
// search cannot genuinely see a shorter mate), on the 287 and the 190? Usage: node mates.mts <headTree>
const [root] = process.argv.slice(2);
const s = await import(`${root}/src/search.ts`);
const e = await import(`${root}/src/engine.ts`);
const { parseFen, toFen } = await import(`${root}/src/fen.ts`);
const { MATE_CORPUS } = await import(`${root}/src/search.mate-corpus.ts`);
const { legalMoves } = await import(`${root}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${root}/src/apply.ts`);
const { gameStatus } = await import(`${root}/src/gameend.ts`);
const isMate = (x: number) => Math.abs(x) > s.MATE_SCORE - 1_000;

const ROOTS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
];
const ENDG = [
  "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1",
];
const c190: string[] = [];
for (const fen of ROOTS) {
  c190.push(fen);
  const p = parseFen(fen);
  for (const mv of legalMoves(p)) {
    const u = makeMove(p, mv);
    if (gameStatus(p).result === "in-progress") c190.push(toFen(p));
    unmakeMove(p, mv, u);
  }
}
c190.push(...ENDG);
console.log(`corpora: 190 = ${c190.length}, 287 = ${MATE_CORPUS.length}`);

const tally = (label: string, fens: string[], on: (f: string) => number, door: (f: string) => number) => {
  let falseMate = 0, shorter = 0, longer = 0, lost = 0, sign = 0, doorMates = 0;
  const lines: string[] = [];
  for (const fen of fens) {
    const d = door(fen), h = on(fen);
    if (isMate(d)) doorMates++;
    if (isMate(h) && !isMate(d)) { falseMate++; lines.push(`FALSE-MATE ${fen}: door ${d}, null ${h}`); }
    else if (isMate(d) && !isMate(h)) { lost++; lines.push(`LOST ${fen}: door ${d}, null ${h}`); }
    else if (isMate(d) && isMate(h)) {
      if (Math.sign(d) !== Math.sign(h)) { sign++; lines.push(`SIGN ${fen}: ${d} / ${h}`); }
      else if (Math.abs(h) > Math.abs(d)) { shorter++; lines.push(`SHORTER ${fen}: door ${d}, null ${h}`); }
      else if (Math.abs(h) < Math.abs(d)) { longer++; lines.push(`LONGER ${fen}: door ${d}, null ${h}`); }
    }
  }
  console.log(`${label}: door mates ${doorMates}; null-only mates ${falseMate}; shorter ${shorter}; longer ${longer}; lost ${lost}; sign ${sign}`);
  for (const l of lines.slice(0, 12)) console.log("   " + l);
};
const deepen = (choose: any) => (f: string) => choose(parseFen(f), { budgetMs: 1_000, now: () => 0, maxDepth: 5 }).score;
tally("search() d5 vs searchWithoutNullMove d5, the 287", MATE_CORPUS as string[], (f) => s.search(parseFen(f), 5).score, (f) => s.searchWithoutNullMove(parseFen(f), 5).score);
tally("search() d5 vs searchWithoutNullMove d5, the 190", c190, (f) => s.search(parseFen(f), 5).score, (f) => s.searchWithoutNullMove(parseFen(f), 5).score);
tally("chooseMove d5 vs chooseMoveWithoutNullMove d5, the 287", MATE_CORPUS as string[], deepen(e.chooseMove), deepen(e.chooseMoveWithoutNullMove));
