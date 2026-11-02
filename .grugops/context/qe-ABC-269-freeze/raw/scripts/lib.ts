export const W = "/home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-269-freeze/src/";
const fen = await import(W + "fen.ts");
const ev = await import(W + "evaluate.ts");
const pos = await import(W + "position.ts");
const legal = await import(W + "legal.ts");
export const { parseFen, toFen } = fen;
export const { evaluate } = ev;
export const { isInCheck } = legal;
const PW = [0, 0, 1, 1, 2, 4, 0];
const KT = ev.VALUE_TABLES_FOR_TEST.KING_TABLE as number[];
const PB = [0, 5, 10, 20, 35, 60, 100, 0];
export function rawPhase(p: any) { let s = 0; for (let sq = 0; sq < 128; sq++) { if (sq & 0x88) continue; const pc = p.board[sq]; if (pc) s += PW[pc & 7]; } return s; }
const kingEg = (sq: number) => { const f = sq & 7, r = sq >> 4; const m = Math.min(...[[3,3],[4,3],[3,4],[4,4]].map(([cf, cr]) => Math.abs(f-cf)+Math.abs(r-cr))); return 40 - 15*m; };
// white-minus-black mg (= main's evaluate from white's side), delta (eg - mg) analytic, phase
export function analyse(f: string) {
  const p = parseFen(f);
  const e = evaluate(p); const mgW = p.blackToMove ? 0 - e : e;
  let delta = 0;
  for (let sq = 0; sq < 128; sq++) {
    if (sq & 0x88) continue; const pc = p.board[sq]; if (!pc) continue;
    const t = pc & 7, black = (pc & 8) !== 0, r = sq >> 4, fl = sq & 7;
    if (t === 6) { const idx = (black ? r : 7 - r) * 8 + fl; const d = kingEg(sq) - KT[idx]; delta += black ? -d : d; }
    if (t === 1 && ev.isPassedPawn(p.board, sq)) { const b = black ? PB[7 - r] : PB[r]; delta += black ? -b : b; }
  }
  const raw = rawPhase(p); const w = Math.min(24, raw);
  const blendW = mgW + Math.trunc((delta * (24 - w)) / 24);
  const fullW = Math.trunc((mgW * w + (mgW + delta) * (24 - w)) / 24);
  const stm = (x: number) => (p.blackToMove ? 0 - x : x);
  return { fen: toFen(p), raw, w, mgW, delta, rem: (delta * (24 - w)) % 24, forecastW: blendW, forecast: stm(blendW), forecastFullForm: stm(fullW), main: e, stmBlack: p.blackToMove, check: isInCheck(p) };
}
export function edit(f: string, remove: string[], add: Record<string, string> = {}, stm?: "w" | "b") {
  const p = parseFen(f);
  const sq = (n: string) => (Number(n[1]) - 1) * 16 + (n.charCodeAt(0) - 97);
  const code: Record<string, number> = { P: 1, N: 2, B: 3, R: 4, Q: 5, K: 6 };
  for (const r of remove) { if (!p.board[sq(r)]) throw new Error("empty " + r + " in " + f); p.board[sq(r)] = 0; }
  for (const [s, c] of Object.entries(add)) { p.board[sq(s)] = code[c.toUpperCase()] | (c === c.toLowerCase() ? 8 : 0); }
  if (stm) p.blackToMove = stm === "b";
  p.epSquare = -1;
  const keep = toFen(p);
  try { parseFen(keep); return keep; } catch { p.castling = 0; return toFen(p); }
}
