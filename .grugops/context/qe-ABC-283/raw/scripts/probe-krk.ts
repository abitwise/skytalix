// qe-ABC-283 break attempt (INFORMATION, not a bar): the same-depth d5 mate floor on a FRESH corpus QE draws itself, to
// probe R-283-LMR ("the floor holds on the 287, not by construction"). Seeded LCG (seed 283), 600 random legal positions:
// 300 KRK and 300 KQK (the strong side is White or Black, either side to move), no side to move already mated/stalemated.
// For each: head search() d5 vs searchWithoutBundle d5, and head chooseMove d5 vs chooseMoveWithoutBundle d5 (frozen clock).
// A violation is a door mate the head does not score as a same-sign mate. usage: node probe-krk.ts <treeRoot>
const [root] = process.argv.slice(2);
const S = await import(`${root}/src/search.ts`);
const E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { legalMoves } = await import(`${root}/src/legal.ts`);
let x = 283;
const rnd = (n: number) => { x = (Math.imul(x, 1103515245) + 12345) >>> 0; return (x >>> 8) % n; };
const fenOf = (b: (string | null)[], stm: "w" | "b") => {
  const rows: string[] = [];
  for (let r = 7; r >= 0; r--) { let s = "", e = 0; for (let f = 0; f < 8; f++) { const p = b[r * 8 + f]; if (!p) e++; else { if (e) s += e; e = 0; s += p; } } if (e) s += e; rows.push(s); }
  return `${rows.join("/")} ${stm} - - 0 1`;
};
const adj = (a: number, c: number) => Math.abs((a >> 3) - (c >> 3)) <= 1 && Math.abs((a & 7) - (c & 7)) <= 1;
const corpus: string[] = [];
for (const piece of ["R", "Q"]) {
  let made = 0;
  while (made < 300) {
    const white = rnd(2) === 0; const stm = rnd(2) === 0 ? "w" : "b";
    const sq = [rnd(64), rnd(64), rnd(64)];
    if (new Set(sq).size < 3 || adj(sq[0], sq[1])) continue;
    const b: (string | null)[] = Array(64).fill(null);
    b[sq[0]] = white ? "K" : "k"; b[sq[1]] = white ? "k" : "K"; b[sq[2]] = white ? piece : piece.toLowerCase();
    const fen = fenOf(b, stm as "w" | "b");
    let p;
    try { p = parseFen(fen); } catch { continue; } // parseFen refuses a side not to move in check
    if (legalMoves(p).length === 0) continue;
    corpus.push(fen); made++;
  }
}
const isMate = (s: number) => Math.abs(s) > S.MATE_SCORE - 1000;
const ch = (fn: any, fen: string, d: number) => fn(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }).score as number;
const res: any = {};
for (const [what, head, door] of [
  ["search d5", (f: string) => S.search(parseFen(f), 5).score, (f: string) => S.searchWithoutBundle(parseFen(f), 5).score],
  ["chooseMove d5", (f: string) => ch(E.chooseMove, f, 5), (f: string) => ch(E.chooseMoveWithoutBundle, f, 5)],
  ["chooseMove d6", (f: string) => ch(E.chooseMove, f, 6), (f: string) => ch(E.chooseMoveWithoutBundle, f, 6)],
] as const) {
  let mates = 0; const v: string[] = []; let headOnly = 0;
  for (const f of corpus) { const r = door(f), g = head(f); if (isMate(g) && !isMate(r)) headOnly++; if (!isMate(r)) continue; mates++; if (!isMate(g) || Math.sign(g) !== Math.sign(r)) v.push(`${f}: ${r} -> ${g}`); }
  res[what] = { corpus: corpus.length, doorMates: mates, violations: v.length, headOnlyMates: headOnly, v };
  console.log(JSON.stringify({ probe: what, ...res[what] }));
}
