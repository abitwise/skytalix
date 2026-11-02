// qe-ABC-268 SCRATCH driver for the cut audit on a hooked copy of the ABC-268 build (qe-audit-patch.py).
// Follows probe3.ts audit mode: search() d6 over the 190 (endgames included), every 10th firing node; each sampled
// node re-searched fresh: rule on at its null window (h), rule off same window (dnw), rule off full window (v).
// usage (from the copy's root): node qe-audit.ts <fire|audit> [D] [EVERY] [sampleOut.jsonl]
import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { makeMove, unmakeMove } from "./src/apply.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { legalMoves } from "./src/legal.ts";
import { squareName } from "./src/position.ts";
import { QE, qeNode, qeReset, search, searchWithoutFutility } from "./src/search.ts";
const [mode, dArg, eArg, sampleOut] = process.argv.slice(2);
const D = Number(dArg ?? 6), EVERY = Number(eArg ?? 10);
const ROOTS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
];
const ENDGAMES = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const corpus: string[] = [];
for (const f of ROOTS) {
  corpus.push(f);
  const p = parseFen(f);
  for (const m of legalMoves(p)) {
    const u = makeMove(p, m);
    if (gameStatus(p).result === "in-progress") corpus.push(toFen(p));
    unmakeMove(p, m, u);
  }
}
corpus.push(...ENDGAMES);
if (corpus.length !== 190) throw new Error(`corpus ${corpus.length}`);
void squareName;
if (mode === "fire") {
  qeReset(0);
  let hn = 0, dn = 0;
  for (const f of corpus) hn += search(parseFen(f), D).nodes;
  const head = { firing: QE.firing, skipped: QE.skipped };
  qeReset(0);
  for (const f of corpus) dn += searchWithoutFutility(parseFen(f), D).nodes;
  console.log(JSON.stringify({ mode, depth: D, rows: corpus.length, headNodes: hn, doorNodes: dn, ratio: +(hn / dn).toFixed(4), head, door: { firing: QE.firing, skipped: QE.skipped } }));
} else if (mode === "audit") {
  // One run per corpus row, the hook's firing counter reset per row (probe3.ts: setCfg per row, so its fired%AUD
  // phase restarts at each root search). Sample = every EVERY-th firing node within each row's search.
  let firing = 0;
  const sample: Array<{ fen: string; depth: number; alpha: number; beta: number }> = [];
  for (const f of corpus) {
    qeReset(EVERY);
    search(parseFen(f), D);
    firing += QE.firing;
    sample.push(...QE.sample);
  }
  const sampleText = sample.map((r) => `${r.fen}|${r.depth}|${r.alpha}|${r.beta}`).join("\n");
  if (sampleOut) writeFileSync(sampleOut, `${sampleText}\n`);
  const blank = () => ({ n: 0, flips: 0, ffl: 0, ffh: 0, e100: 0, e200: 0, e300: 0, e500: 0, unstable: 0, doorNoise: 0, nullWindow: 0, skippedBand: 0 });
  const by: Record<string, ReturnType<typeof blank>> = {};
  const flips: unknown[] = [];
  const INF = Number.POSITIVE_INFINITY;
  for (const r of sample) {
    const keysFor = ["all", `d${r.depth}`];
    if (Math.abs(r.alpha) > 15000) { for (const k of keysFor) (by[k] ??= blank()).skippedBand++; continue; }
    const h = qeNode(parseFen(r.fen), r.depth, r.alpha, r.beta, true);
    const dnw = qeNode(parseFen(r.fen), r.depth, r.alpha, r.beta, false);
    const v = qeNode(parseFen(r.fen), r.depth, 0 - INF, INF, false);
    for (const k of keysFor) {
      const row = (by[k] ??= blank());
      row.n++;
      if (r.alpha + 1 === r.beta) row.nullWindow++;
      if ((dnw <= r.alpha) !== (v <= r.alpha)) row.doorNoise++;
      const hFL = h <= r.alpha, dFL = dnw <= r.alpha;
      if (hFL === dFL) continue;
      row.flips++;
      const err = hFL ? v - r.alpha : r.beta - v;
      if (hFL) row.ffl++; else row.ffh++;
      if (err <= 0) { row.unstable++; continue; }
      if (err >= 100) row.e100++;
      if (err >= 200) row.e200++;
      if (err >= 300) row.e300++;
      if (err >= 500) row.e500++;
      if (k === "all") flips.push({ err, ...r, h, dnw, v });
    }
  }
  console.log(JSON.stringify({ mode, depth: D, every: EVERY, rows: corpus.length, firing, sampled: sample.length, sampleSha: createHash("sha256").update(sampleText).digest("hex").slice(0, 16) }));
  for (const [k, row] of Object.entries(by).sort()) console.log(JSON.stringify({ key: k, ...row, flipPct: +(100 * row.flips / row.n).toFixed(3) }));
  for (const f of flips.slice(0, 10)) console.log(JSON.stringify({ flip: f }));
}
