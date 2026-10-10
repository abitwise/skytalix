// Re-verify every selected row with the INDEPENDENT oracle in its slow, full-window form (QE's
// rootScores) and the exhaustive mate search; print the facts the corpus row will carry.
import { readFileSync } from "node:fs";
import { parse, legal, make, inCheck, otherInCheck, matingMoves, rootScores, materialBest, quiet, label, mirrorFen, plausible } from "./oracle.mjs";
const pick = process.argv[2].split(",");
const cands = [...readFileSync("pools/cand-m3.jsonl", "utf8").trim().split("\n"), ...readFileSync("pools/cand-wm.jsonl", "utf8").trim().split("\n")].map((l) => JSON.parse(l));
const mat = (pos, side) => { const order = "qrbnp"; const c = {}; for (let sq = 0; sq < 128; sq++) { if (sq & 0x88) continue; const p = pos.board[sq]; if (p === "." || p.toLowerCase() === "k") continue; if ((p === p.toUpperCase()) !== (side === "w")) continue; c[p.toLowerCase()] = (c[p.toLowerCase()] ?? 0) + 1; } return order.split("").filter((t) => c[t]).map((t) => (c[t] > 1 ? c[t] : "") + t.toUpperCase()).join("+") || "-"; };
for (const n of pick) {
  const r = cands.find((c) => c.name === n);
  const pos = parse(r.fen);
  const ok = [];
  ok.push(!inCheck(pos) && !otherInCheck(pos) && plausible(pos));
  let facts;
  if (r.kind === "mate-in-3") {
    const m1 = matingMoves(pos, 1), m2 = matingMoves(pos, 2), m3 = [...new Set(matingMoves(pos, 3))].sort();
    ok.push(m1.length === 0 && m2.length === 0 && JSON.stringify(m3) === JSON.stringify([...r.accept].sort()));
    facts = `m3=[${m3}]`;
  } else {
    const sc = rootScores(pos, 4);
    const best = sc[0].gain;
    const top = [...new Set(sc.filter((s) => s.gain === best).map((s) => s.move))].sort();
    const next = sc.find((s) => s.gain < best);
    const fast = materialBest(pos);
    ok.push(JSON.stringify(top) === JSON.stringify([...r.accept].sort()) && best >= 2 && (!next || best - next.gain >= 2) && JSON.stringify(fast.setLabels) === JSON.stringify(top) && fast.gain === best);
    ok.push(matingMoves(pos, 1).length === 0 && matingMoves(pos, 2).length === 0);
    facts = `gain +${best} top=[${top}] next=${next ? `${next.move}:${next.gain}` : "-"}`;
  }
  const keys = legal(pos).filter((m) => r.accept.includes(label(m)));
  const q = keys.every((m) => quiet(pos, m));
  console.log(JSON.stringify({ name: n, ok: ok.every(Boolean), fen: r.fen, accept: [...r.accept].sort(), quiet: q, side: pos.side, white: mat(pos, "w"), black: mat(pos, "b"), facts, mirror: mirrorFen(r.fen) }));
}
