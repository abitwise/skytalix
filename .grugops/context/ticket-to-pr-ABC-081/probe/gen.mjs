const W = process.argv[2];
const { search } = await import(W + "/src/search.ts");
const { parseFen } = await import(W + "/src/fen.ts");
const { legalMoves, isInCheck } = await import(W + "/src/legal.ts");
const { makeMove, unmakeMove } = await import(W + "/src/apply.ts");
const { squareName } = await import(W + "/src/position.ts");
const lab = (m) => squareName(m.from) + squareName(m.to);
let seed = 12345; const rnd = (n) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
const sq = (f, r) => ({ f, r });
function fenOf(pieces) { const b = Array.from({ length: 8 }, () => Array(8).fill(null)); for (const [c, f, r] of pieces) { if (b[r][f]) return null; b[r][f] = c; } return b.slice().reverse().map((row) => { let s = "", e = 0; for (const c of row) { if (!c) e++; else { if (e) s += e; e = 0; s += c; } } return s + (e ? e : ""); }).join("/") + " w - - 0 1"; }
const found = [];
for (let i = 0; i < 4000 && found.length < 4; i++) {
  // black king in the h8 corner area, a few own pawns boxing it, heavy black pieces on the queen side
  const bk = [[7, 7], [6, 7], [7, 6]][rnd(3)];
  const pieces = [["k", bk[0], bk[1]], ["K", 7, 0], ["P", 6, 1], ["P", 7, 1], ["q", rnd(3), rnd(3) + 2], ["r", rnd(3), rnd(3) + 2]];
  for (const [f, r] of [[5, 6], [6, 6], [7, 6], [6, 5], [7, 5], [5, 5]]) if (rnd(3) === 0) pieces.push(["p", f, r]);
  pieces.push(["Q", rnd(8), rnd(6) + 2]);
  const fen = fenOf(pieces); if (!fen) continue;
  let p; try { p = parseFen(fen); } catch { continue; }
  p.blackToMove = true; const blackInCheck = isInCheck(p); p.blackToMove = false;
  if (blackInCheck || isInCheck(p)) continue;
  const moves = legalMoves(p); if (moves.length === 0) continue;
  const scores = [];
  for (const m of moves) { const u = makeMove(p, m); scores.push([lab(m), 0 - search(p, 4).score]); unmakeMove(p, m, u); }
  const ok = scores.filter(([, s]) => s >= -300);
  if (ok.length === 1 && ok[0][1] === 0) { found.push(fen); console.log("FOUND", fen, ok[0][0], "others max", Math.max(...scores.filter(([m]) => m !== ok[0][0]).map(([, s]) => s))); }
}
console.log("done", found.length);
