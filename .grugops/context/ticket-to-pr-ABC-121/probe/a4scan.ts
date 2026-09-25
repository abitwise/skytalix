/**
 * PROBE: A4 fixture scan. Positions where the correct PVS+LMR equals PVS alone (score AND move) at
 * depth d, and `noLmrResearch` (the review's variant) does NOT — so a build without the reduced-move
 * re-search is red on it. Reference recursion: lmr-ref.ts (the review's probe, unchanged).
 * Corpus: the 190 plus every position one ply from the 190's endgames and position-3's children.
 */
import { makeMove, unmakeMove } from "../../../../src/apply.ts";
import { parseFen, toFen } from "../../../../src/fen.ts";
import { gameStatus } from "../../../../src/gameend.ts";
import { legalMoves } from "../../../../src/legal.ts";
import { BASE, type Cfg, deepen, fixed } from "./lmr-ref.ts";
import { broad, lbl } from "./corpus.ts";

const d = Number(process.argv[2]);
const PVS: Cfg = { ...BASE, pvs: true };
const LMR: Cfg = { ...BASE, pvs: true, lmr: true };
const NOLMR: Cfg = { ...LMR, bug: "noLmrResearch" };
const NORES: Cfg = { ...LMR, bug: "noResearch" };
const seen = new Set<string>();
const list: Array<[string, string]> = [];
for (const [name, fen] of broad()) {
  if (!seen.has(fen)) { seen.add(fen); list.push([name, fen]); }
  if (!(name.startsWith("position-3") || !name.includes("/") && !name.startsWith("start") && !name.startsWith("kiwi") && !name.startsWith("position"))) continue;
  const p = parseFen(fen);
  for (const m of legalMoves(p)) {
    const u = makeMove(p, m);
    const f = toFen(p);
    if (gameStatus(p).result === "in-progress" && !seen.has(f)) { seen.add(f); list.push([`${name}/${lbl(m)}`, f]); }
    unmakeMove(p, m, u);
  }
}
const hits: unknown[] = [];
for (const [name, fen] of list) {
  const t = performance.now();
  const a = fixed(parseFen(fen), d, PVS);
  const b = fixed(parseFen(fen), d, LMR);
  if (a.score !== b.score || lbl(a.move) !== lbl(b.move)) continue;
  const c = fixed(parseFen(fen), d, NOLMR);
  if (c.score === b.score && lbl(c.move) === lbl(b.move)) continue;
  const e = fixed(parseFen(fen), d, NORES);
  const ms = Math.round(performance.now() - t);
  hits.push({ name, fen, d, correct: [b.score, lbl(b.move), b.nodes, b.stats.lmrReSearches], noLmrResearch: [c.score, lbl(c.move)], noResearch: [e.score, lbl(e.move)], ms });
}
for (const h of hits) console.log(JSON.stringify(h));
console.log(JSON.stringify({ summary: "a4scan", depth: d, scanned: list.length, hits: hits.length }));
