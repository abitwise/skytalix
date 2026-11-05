// qe-ABC-301-s0: the three forms of P1 on one tree, plus an independent derivation of the forced form's misses.
// usage: node formprobe.ts <tree>/src/ <label>. Reads the FENs with its own parser and ADR-0070 d1's text, not passerTerms.
import { readFileSync } from "node:fs";
const [R, label] = process.argv.slice(2);
const ev = await import(R + "evaluate.ts"); const P = await import(R + "evaluate-params.ts");
const { parseFen } = await import(R + "fen.ts");
const F = JSON.parse(readFileSync(R + "evaluate.passer-fixtures.json", "utf8"));
const byRank = (v: number[]) => [...v, 0];
const PROBED = { ...P,
  PASSED_KING_ENEMY: { mg: P.PASSED_KING_ENEMY.mg, eg: byRank(F.values.PASSED_KING_ENEMY) },
  PASSED_KING_OWN: { mg: P.PASSED_KING_OWN.mg, eg: byRank(F.values.PASSED_KING_OWN) },
  PASSED_FREE: { mg: P.PASSED_FREE.mg, eg: byRank(F.values.PASSED_FREE) },
  PASSED_UNSTOPPABLE: { mg: 0, eg: F.values.PASSED_UNSTOPPABLE } };
const pov = (p: any, k: number) => { const s = ev.evaluateAtPhase(p, k); return p.blackToMove ? 0 - s : s; };
const net = (p: any) => { const { white: w, black: b } = ev.passerTermsForTest(p); return w.kd + w.free + w.un - b.kd - b.free - b.un; };
// ---- own reading of the square rule from the FEN text alone
function squareRule(fen: string) {
  const [placement, stm] = fen.split(" "); const g: string[][] = [];
  for (const row of (placement as string).split("/").reverse()) { const r: string[] = []; for (const c of row) { if (/\d/.test(c)) for (let i = 0; i < +c; i++) r.push(""); else r.push(c); } g.push(r); }
  const at = (r: number, f: number) => (g[r] as string[])[f] as string;
  const find = (c: string) => { for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) if (at(r, f) === c) return [r, f] as const; throw new Error(c); };
  const res: Record<string, number> = {};
  for (const white of [true, false]) {
    const own = white ? "P" : "p", foe = white ? "p" : "P", up = white ? 1 : -1, qr = white ? 7 : 0;
    const [er, ef] = find(white ? "k" : "K"); const defenderToMove = white ? stm === "b" : stm === "w"; let u = 0;
    for (let f = 0; f < 8; f++) {
      const ranks = white ? [6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6];
      for (const r of ranks) {
        if (at(r, f) !== own) continue;
        let passed = true;
        for (let rr = r + up; rr >= 0 && rr <= 7; rr += up) for (let ff = Math.max(0, f - 1); ff <= Math.min(7, f + 1); ff++) if (at(rr, ff) === foe) passed = false;
        if (!passed) continue;
        let free = true; for (let rr = r + up; rr >= 0 && rr <= 7; rr += up) if (at(rr, f) !== "") free = false;
        const Rn = white ? r : 7 - r, moves = Rn === 1 ? 5 : 7 - Rn, d = Math.max(Math.abs(er - qr), Math.abs(ef - f));
        if (free && moves < d - (defenderToMove ? 1 : 0)) u = 1;
        break;
      }
    }
    res[white ? "w" : "b"] = u;
  }
  return res as { w: number; b: number };
}
const rows = F.k1c.map((row: any) => { const p = parseFen(row.fen); const mg = pov(p, 24); return { row, p, mg, base0: pov(p, 0), seam0: net(p) }; });
const forced: string[] = [], own: string[] = [], phase0: string[] = []; const stats = { e0: 0, uOwn: 0, ownPhaseOk: 0, wt: 0, trunc1: 0, kGt0: 0 };
const pred: string[] = []; let predBad = 0;
ev.withParametersForTest(PROBED, () => { for (const { row, p, mg, base0, seam0 } of rows) {
  const e = net(p); const k = row.phase;
  if (ev.phaseOf(p) === k) stats.ownPhaseOk++;
  if (ev.evaluateWithoutTaper && (p.blackToMove ? 0 - ev.evaluateWithoutTaper(p) : ev.evaluateWithoutTaper(p)) === mg) stats.wt++;
  if (e !== 0) stats.e0++;
  const { white: w, black: b } = ev.passerTermsForTest(p); if (w.un || b.un) stats.uOwn++;
  const dF = pov(p, 0) - base0 - e;
  if (dF !== 0) forced.push(row.id);
  if (k === 0 && dF !== 0) phase0.push(row.id);
  const D = base0 - mg; const want = mg + Math.trunc(((D + e - seam0) * (24 - k)) / 24);
  if (pov(p, k) !== want) own.push(row.id);
  const s = squareRule(row.fen); const predicted = k === 0 ? 0 : 400 * (s.w - s.b);
  if (predicted !== 0) pred.push(row.id); if (predicted !== dF) predBad++;
  if (k > 0) { stats.kGt0++; if (Math.trunc(((D + e + 1) * (24 - k)) / 24) === Math.trunc(((D + e) * (24 - k)) / 24) || Math.trunc(((D + e - 1) * (24 - k)) / 24) === Math.trunc(((D + e) * (24 - k)) / 24)) stats.trunc1++; }
} });
console.log(JSON.stringify({ label, forced: forced.length, forcedIds: forced, own: own.length, ownIds: own, phase0: phase0.length, phase0Ids: phase0, predicted: pred.length, predictedDisagree: predBad, stats }));
