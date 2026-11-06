// qe-ABC-291-k1: SEAM_ROWS against the labeller, then clause mutants of the labeller over both row sets. Reads no engine code. Usage: node k1-compare.mjs <evaluate.pawns.test.ts>
import { readFileSync } from "node:fs";
import { ROWS } from "./k1-rows.mjs";
import { fenOf, image, parse, label, CONNECTED, PHALANX, BACKWARD } from "./k1-labeller.mjs";
const text = readFileSync(process.argv[2], "utf8");
const from = text.indexOf("= [", text.indexOf("const SEAM_ROWS")) + 2;
const seam = (0, eval)(text.slice(from, text.indexOf("\n];\n", from) + 2));
// 1. values
let differ = 0;
for (const [id, fen, w, b] of seam) {
  const got = label(fen);
  if (got.W.join() !== w.join() || got.B.join() !== b.join()) { differ++; console.log("DIFFERS", id, fen, "row", w, b, "labeller", got.W, got.B); }
}
console.log(JSON.stringify({ seamRows: seam.length, valuesDiffer: differ }));
// 2. which (definition, R) cells the rows read, as SEAM_ROWS reads them: as written and colour-mirrored
const pawns = (g, c) => { const a = []; for (let k = 0; k < 8; k++) for (let f = 0; f < 8; f++) if (g[k][f] === c) a.push([f, c === "P" ? k : 7 - k]); return a; };
function cells(fen) {
  const { g } = parse(fen); const out = new Set();
  for (const [c, e] of [["P", "p"], ["p", "P"]]) {
    const own = pawns(g, c), en = pawns(g, e).map(([f, r]) => [f, 7 - r]);
    const has = (s, f, r) => s.some(([a, b]) => a === f && b === r);
    for (const [f, R] of own) {
      const col = c === "P" ? "w" : "b", ed = f === 0 ? "a" : f === 7 ? "h" : "";
      if (R >= 2 && (has(own, f - 1, R - 1) || has(own, f + 1, R - 1))) { out.add(`C${R}`); out.add(`C-${col}`); if (ed) out.add(`C-${ed}`); }
      if (R >= 2 && (has(own, f - 1, R) || has(own, f + 1, R))) { out.add(`P${R}`); out.add(`P-${col}`); if (ed) out.add(`P-${ed}`); }
      const nb = own.filter(([a]) => a === f - 1 || a === f + 1);
      const stop = has(en, f, R + 1), al = has(en, f - 1, R + 2), ar = has(en, f + 1, R + 2);
      if (nb.length && nb.every(([, r]) => r > R) && (stop || al || ar)) {
        out.add(`B-${col}`); out.add(`BR${R}`); if (ed) out.add(`B-${ed}`); if (ed && stop) out.add(`B-${ed}-stop`); if (ed && (al || ar)) out.add(`B-${ed}-attack`);
        if (stop) out.add("B-stop"); if (al) out.add("B-left"); if (ar) out.add("B-right");
      }
    }
  }
  return out;
}
const seamFens = seam.flatMap(([, fen]) => [fen, image(fen, 1, 0)]);
const myFens = ROWS.flatMap((r) => [[0, 0], [1, 0], [0, 1], [1, 1]].map(([v, h]) => image(fenOf(r), v, h)));
const seamCells = new Set(seamFens.flatMap((f) => [...cells(f)])), myCells = new Set(myFens.flatMap((f) => [...cells(f)]));
console.log("cells read by my rows and not by SEAM_ROWS:", [...myCells].filter((c) => !seamCells.has(c)).sort().join(" ") || "none");
console.log("cells read by SEAM_ROWS and not by my rows:", [...seamCells].filter((c) => !myCells.has(c)).sort().join(" ") || "none");
// 3. mutants: one clause of d1 or one table cell changed. A mutant no row tells apart is a fault that row set cannot see.
const base = { adj: (a, f) => a === f - 1 || a === f + 1 };
function side(own, enFrame, board, c, m) {
  const en = enFrame.map(([f, r]) => [f, 7 - r]);
  const has = (s, f, r) => s.some(([a, b]) => a === f && b === r);
  const wrap = (f) => (f + 8) % 8;
  let C = 0, P = 0, B = 0;
  const conT = [...CONNECTED], phT = [...PHALANX];
  if (m === "table-phalanx-R5") phT[5] = 9;
  if (m === "table-phalanx-R2") phT[2] = 2;
  if (m === "table-connected-R2") conT[2] = 3;
  const pieceAt = (f, R) => { const k = c === "P" ? R : 7 - R; return k >= 0 && k < 8 ? board[k]?.[f] ?? "" : ""; };
  for (const [f, R] of own) {
    const defs = [has(own, f - 1, R - 1), has(own, f + 1, R - 1)];
    if (m === "wrap-connected") { defs[0] ||= f === 0 && has(own, 7, R - 2); defs[1] ||= f === 7 && has(own, 0, R); }
    if (R >= 2 && defs.some(Boolean)) C += conT[R] * (m === "connected-per-defender" ? defs.filter(Boolean).length : 1);
    const beside = [has(own, f - 1, R), has(own, f + 1, R)];
    if (m === "wrap-phalanx") { beside[0] ||= f === 0 && has(own, 7, R - 1); beside[1] ||= f === 7 && has(own, 0, R + 1); }
    if ((R >= 2 || m === "phalanx-at-R1") && beside.some(Boolean)) P += (m === "phalanx-at-R1" && R === 1 ? 1 : phT[R]) * (m === "phalanx-per-neighbour" ? beside.filter(Boolean).length : 1);
    let nb = own.filter(([a]) => a === f - 1 || a === f + 1);
    if (m === "wrap-a") nb = own.filter(([a]) => a === wrap(f - 1) || a === wrap(f + 1));
    let A = nb.length > 0;
    if (m === "a-any-colour") A = A || en.some(([a]) => a === f - 1 || a === f + 1);
    if (m === "a-dropped") A = true;
    let Bc = nb.every(([, r]) => r > R);
    if (m === "b-only-R-and-R-1") Bc = nb.every(([, r]) => r > R || r < R - 1);
    if (m === "b-frontmost") { const fr = {}; for (const [a, r] of nb) fr[a] = Math.max(fr[a] ?? -1, r); Bc = Object.values(fr).every((r) => r > R); }
    if (m === "b-strict-rank-ok") Bc = nb.every(([, r]) => r >= R);
    if (m === "b-one-side") { const l = nb.filter(([a]) => a === f - 1), r = nb.filter(([a]) => a === f + 1); Bc = (l.length ? l : r).every(([, q]) => q > R); }
    if (m === "b-dropped") Bc = true;
    let stop = has(en, f, R + 1), al = has(en, f - 1, R + 2), ar = has(en, f + 1, R + 2);
    if (m === "c-no-stop") stop = false;
    if (m === "c-no-left") al = false;
    if (m === "c-no-right") ar = false;
    if (m === "c-stop-any-pawn") stop = stop || has(own, f, R + 1);
    const enemyPiece = (ff, rr) => { const q = pieceAt(ff, rr); return q !== "" && !/[kKpP]/.test(q) && (c === "P" ? q === q.toLowerCase() : q === q.toUpperCase()); };
    if (m === "c-enemy-piece-on-stop") stop = stop || enemyPiece(f, R + 1);
    if (m === "c-enemy-piece-attacks") { al = al || enemyPiece(f - 1, R + 2); ar = ar || enemyPiece(f + 1, R + 2); }
    if (m === "c-friend-on-stop-blocks" && has(own, f, R + 1)) { al = false; ar = false; }
    if (m === "c-attacks-pawn-too") stop = stop || has(en, f - 1, R + 1) || has(en, f + 1, R + 1);
    if (m === "c-attack-one-further") { al = al || has(en, f - 1, R + 3); ar = ar || has(en, f + 1, R + 3); }
    if (m === "c-two-ahead") stop = stop || has(en, f, R + 2);
    if (m === "c-double-step-target" && R === 1) { stop = stop || has(en, f, 3); al = al || has(en, f - 1, 4); ar = ar || has(en, f + 1, 4); }
    if (m === "wrap-c") { al = al || (f === 0 && has(en, 7, R + 1)); ar = ar || (f === 7 && has(en, 0, R + 3)); }
    if (m === "c-dropped") { stop = true; }
    let fires = A && Bc && (stop || al || ar);
    if (m === "rear-of-doubled-free" && has(own, f, R + 1)) fires = false;
    if (m === "doubled-front-only" && own.some(([a, r]) => a === f && r > R)) fires = false;
    if (fires) B += BACKWARD;
  }
  return [C, P, B];
}
const labelM = (fen, m) => { const { g } = parse(fen); const w = pawns(g, "P"), b = pawns(g, "p"); return { W: side(w, b, g, "P", m), B: side(b, w, g, "p", m) }; };
const MUT = ["connected-per-defender", "phalanx-per-neighbour", "phalanx-at-R1", "table-phalanx-R2", "table-phalanx-R5", "table-connected-R2", "a-dropped", "a-any-colour", "b-dropped", "b-only-R-and-R-1", "b-frontmost", "b-strict-rank-ok", "b-one-side", "c-dropped", "c-no-stop", "c-no-left", "c-no-right", "c-stop-any-pawn", "c-enemy-piece-on-stop", "c-enemy-piece-attacks", "c-friend-on-stop-blocks", "c-attacks-pawn-too", "c-attack-one-further", "c-two-ahead", "c-double-step-target", "rear-of-doubled-free", "doubled-front-only", "wrap-connected", "wrap-phalanx", "wrap-a", "wrap-c"];
const kills = (fens, m) => fens.filter((f) => { const a = label(f), b = labelM(f, m); return a.W.join() !== b.W.join() || a.B.join() !== b.B.join(); }).length;
const none = kills(myFens, "none") + kills(seamFens, "none");
console.log("unmutated side() against label(), differing rows:", none);
for (const m of MUT) console.log(m.padEnd(26), "SEAM_ROWS", String(kills(seamFens, m)).padStart(3), " mine", String(kills(myFens, m)).padStart(3));
