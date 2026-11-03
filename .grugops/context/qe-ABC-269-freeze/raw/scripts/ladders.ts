import { analyse, edit, parseFen } from "./lib.ts";
const POS4 = "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1";
const POS5 = "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8";
function ladder(name: string, base: string, order: string[]) {
  let f = base; const out: any[] = [];
  for (const sq of order) {
    const next = edit(f, [sq]);
    try { parseFen(next); } catch (e) { console.log(name, "SKIP", sq, String(e).slice(0, 90)); continue; }
    f = next; const a = analyse(f); out.push({ name, removed: sq, ...a });
  }
  return out;
}
const L1 = ladder("L1", POS4, ["f3","a5","a4","b6","b4","f6","h6","g6","a1","a8","f1","h8","d1","a3"]);
const L3 = ladder("L3", POS4, ["d1","a3","f3","a5","a4","b6","b4","f6","h6","g6","a1","a8","f1","h8"]);
const L2 = ladder("L2", POS5, ["d1","d8","a1","a8","h1","h8","b1","b8","c1","c8","c4","e7","e2","f2"]);
for (const r of [...L1, ...L3, ...L2]) console.log(r.name, r.removed, r.raw, r.mgW, r.delta, r.rem, r.check, r.fen);
