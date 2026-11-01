// qe-EPIC-010-close RISK-EPIC010-08 check (pre-registered in PREREG.txt): the C3'' interval with repeated openings.
// usage: node cluster.mjs <d.pgn> <openings count, 100>
// Score is the first-named engine's ("skytalix" = head). Opening index = (Round - 1) mod N, checked against the FEN tag.
import { readFileSync } from "node:fs";
const [pgnPath, nText] = process.argv.slice(2);
const N = Number(nText ?? 100);
const games = readFileSync(pgnPath, "utf8").split(/\n(?=\[Event )/).filter((g) => g.trim());
const tag = (g, t) => new RegExp(`\\[${t} "([^"]*)"\\]`).exec(g)?.[1];
const rows = games.map((g) => {
  const white = tag(g, "White"), res = tag(g, "Result"), round = Number(tag(g, "Round"));
  const headWhite = white === "skytalix";
  const s = res === "1/2-1/2" ? 0.5 : (res === "1-0") === headWhite ? 1 : 0;
  const moves = g.replace(/^\[.*\]$/gm, "").replace(/\{[^}]*\}/g, "").replace(/\d+\.+/g, "").replace(/(1-0|0-1|1\/2-1\/2|\*)\s*$/, "").trim().split(/\s+/).join(" ");
  return { round, op: (round - 1) % N, fen: tag(g, "FEN"), headWhite, s, res, moves };
});
const n = rows.length;
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const sd = (a) => { const m = mean(a); return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / (a.length - 1)); };
const S = mean(rows.map((r) => r.s));
const eloOf = (p) => -400 * Math.log10(1 / p - 1);
const slope = 400 / (Math.LN10 * S * (1 - S)); // dElo/dS at S
const fenBad = new Set();
const byOp = new Map();
for (const r of rows) { if (!byOp.has(r.op)) byOp.set(r.op, []); const a = byOp.get(r.op); if (a.length && a[0].fen !== r.fen) fenBad.add(r.op); a.push(r); }
const byPair = new Map();
for (const r of rows) { if (!byPair.has(r.round)) byPair.set(r.round, []); byPair.get(r.round).push(r.s); }
const seIid = sd(rows.map((r) => r.s)) / Math.sqrt(n);
const pairMeans = [...byPair.values()].map(mean);
const sePair = sd(pairMeans) / Math.sqrt(pairMeans.length);
const opMeans = [...byOp.values()].map((a) => mean(a.map((r) => r.s)));
const seOp = sd(opMeans) / Math.sqrt(opMeans.length);
const show = (label, se) => `${label}: SE(score) ${se.toFixed(4)}; 95 % +/- ${(1.96 * se * slope).toFixed(1)} Elo; deff ${((se / seIid) ** 2).toFixed(3)}; effective games ${(n / (se / seIid) ** 2).toFixed(0)}`;
console.log(`games ${n}; openings ${byOp.size} (sizes ${JSON.stringify([...new Set([...byOp.values()].map((a) => a.length))])}); pairs ${byPair.size}; FEN mismatches ${fenBad.size}`);
console.log(`score ${(S * n).toFixed(1)} of ${n} = ${S.toFixed(4)}; Elo ${eloOf(S).toFixed(1)}`);
console.log(show("iid per game (trinomial)", seIid));
console.log(show(`per colour-swapped pair (pentanomial-like, ${pairMeans.length} pairs)`, sePair));
console.log(show(`per opening cluster (${n / byOp.size} games, ${byOp.size} clusters) = effective resolution`, seOp));
// repeats: same opening, same colour, rounds r and r+N
let sameRes = 0, sameMoves = 0, reps = 0;
for (const a of byOp.values()) for (const hw of [true, false]) { const g = a.filter((r) => r.headWhite === hw); if (g.length === 2) { reps++; if (g[0].res === g[1].res) sameRes++; if (g[0].moves === g[1].moves) sameMoves++; } }
console.log(`repeat pairs (same opening, same colours, round r vs r+${N}): ${reps}; identical result ${sameRes} (${(100 * sameRes / reps).toFixed(1)} %); identical movetext ${sameMoves} (${(100 * sameMoves / reps).toFixed(1)} %)`);
// correlation between the two halves (rounds 1..N vs N+1..2N), per opening pair score
const half = (lo, hi) => [...byOp.keys()].sort((a, b) => a - b).map((op) => mean(byOp.get(op).filter((r) => r.round > lo && r.round <= hi).map((r) => r.s)));
const h1 = half(0, N), h2 = half(N, 2 * N);
const m1 = mean(h1), m2 = mean(h2);
const cov = h1.reduce((x, v, i) => x + (v - m1) * (h2[i] - m2), 0) / (h1.length - 1);
console.log(`half 1 (rounds 1-${N}) score ${(mean(h1)).toFixed(4)}; half 2 score ${(mean(h2)).toFixed(4)}; per-opening correlation half1 vs half2 r = ${(cov / (sd(h1) * sd(h2))).toFixed(3)}`);
