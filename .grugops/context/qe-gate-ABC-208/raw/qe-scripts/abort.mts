// QE: does an abort inside the null subtree leave the caller's position changed? Usage: node abort.mts <tree>
const root = process.argv[2];
const e = await import(`${root}/src/engine.ts`);
const { parseFen, toFen } = await import(`${root}/src/fen.ts`);
const FENS = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
let runs = 0, changed = 0; const first: string[] = [];
for (const [name, fen] of Object.entries(FENS)) {
  for (let budgetMs = 1; budgetMs <= 300; budgetMs++) {
    let t = 0; const now = () => { const r = t; t += 1; return r; };
    const p = parseFen(fen); const before = JSON.stringify({ ...p, board: Array.from(p.board) });
    e.chooseMove(p, { budgetMs, now });
    runs++;
    if (JSON.stringify({ ...p, board: Array.from(p.board) }) !== before) { changed++; if (first.length < 3) first.push(`${name}@${budgetMs}: ${toFen(p)}`); }
  }
}
console.log(`${root.split("/").pop()}: ${changed} of ${runs} aborted chooseMove calls left the position changed`, first);
