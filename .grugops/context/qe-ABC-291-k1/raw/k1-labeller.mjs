// qe-ABC-291-k1: an independent labeller from ADR-0075 d1's words, on (file, R) coordinates, no bitboards, no src import.
export const CONNECTED = [0, 0, 2, 5, 10, 17, 28, 0];
export const PHALANX = [0, 0, 1, 2, 5, 8, 14, 0];
export const BACKWARD = 10;
const sq = (s) => [s.charCodeAt(0) - 97, Number(s[1]) - 1];
export function fenOf(row) {
  if (row.fen) return row.fen;
  const g = Array.from({ length: 8 }, () => Array(8).fill(""));
  const put = (p, s) => { const [f, k] = sq(s); if (g[k][f]) throw new Error(`${row.id}: ${s} taken`); g[k][f] = p; };
  put("K", row.kw ?? "e1"); put("k", row.kb ?? "e8");
  for (const s of row.w.split(" ").filter(Boolean)) put("P", s);
  for (const s of row.b.split(" ").filter(Boolean)) put("p", s);
  if (row.bx) put(row.bx[0], row.bx.slice(1));
  return `${boardOf(g)} ${row.stm ?? "w"} - - 0 1`;
}
const boardOf = (g) => [7, 6, 5, 4, 3, 2, 1, 0].map((k) => {
  let o = "", e = 0;
  for (let f = 0; f < 8; f++) { if (g[k][f]) { if (e) o += e; e = 0; o += g[k][f]; } else e++; }
  return o + (e || "");
}).join("/");
export function parse(fen) {
  const [b, stm, , ep] = fen.split(" ");
  const g = Array.from({ length: 8 }, () => Array(8).fill(""));
  b.split("/").forEach((line, i) => { let f = 0; for (const c of line) { if (/\d/.test(c)) f += Number(c); else g[7 - i][f++] = c; } });
  return { g, stm, ep };
}
// images: V swaps colours and turns the board over; H flips the files. Castling is dropped on an image.
export function image(fen, v, h) {
  if (!v && !h) return fen;
  const { g, stm, ep } = parse(fen);
  const o = Array.from({ length: 8 }, () => Array(8).fill(""));
  for (let k = 0; k < 8; k++) for (let f = 0; f < 8; f++) {
    const c = g[k][f]; if (!c) continue;
    o[v ? 7 - k : k][h ? 7 - f : f] = v ? (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()) : c;
  }
  let e = "-";
  if (ep !== "-") { const [f, k] = sq(ep); e = String.fromCharCode(97 + (h ? 7 - f : f)) + ((v ? 7 - k : k) + 1); }
  return `${boardOf(o)} ${v ? (stm === "w" ? "b" : "w") : stm} - ${e} 0 1`;
}
const pawnsOf = (g, c) => { const a = []; for (let k = 0; k < 8; k++) for (let f = 0; f < 8; f++) if (g[k][f] === c) a.push([f, c === "P" ? k : 7 - k]); return a; };
// R is pawn-relative: own = own pawns at (f, R); enemy pawns are turned into the same frame by R' = 7 - R.
function side(own, enemyOwnFrame) {
  const en = enemyOwnFrame.map(([f, r]) => [f, 7 - r]);
  const has = (set, f, r) => set.some(([a, b]) => a === f && b === r);
  let c = 0, p = 0, b = 0;
  for (const [f, R] of own) {
    if (R >= 2 && (has(own, f - 1, R - 1) || has(own, f + 1, R - 1))) c += CONNECTED[R];
    if (R >= 2 && (has(own, f - 1, R) || has(own, f + 1, R))) p += PHALANX[R];
    const nb = own.filter(([a]) => a === f - 1 || a === f + 1);
    const A = nb.length > 0;
    const Bc = nb.every(([, r]) => r > R);
    const Cc = has(en, f, R + 1) || has(en, f - 1, R + 2) || has(en, f + 1, R + 2);
    if (A && Bc && Cc) b += BACKWARD;
  }
  return [c, p, b];
}
export function label(fen) {
  const { g } = parse(fen);
  const w = pawnsOf(g, "P"), b = pawnsOf(g, "p");
  return { W: side(w, b), B: side(b, w) };
}
// a pawn check on the side not to move, only to keep the fixtures legal
export function illegal(fen) {
  const { g, stm } = parse(fen);
  const find = (c) => { for (let k = 0; k < 8; k++) for (let f = 0; f < 8; f++) if (g[k][f] === c) return [f, k]; };
  const [kf, kk] = find(stm === "w" ? "k" : "K");
  const d = stm === "w" ? -1 : 1, a = stm === "w" ? "P" : "p";
  return [kf - 1, kf + 1].some((f) => f >= 0 && f < 8 && g[kk + d]?.[f] === a);
}
