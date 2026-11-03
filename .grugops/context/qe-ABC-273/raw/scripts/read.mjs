// qe-ABC-273 R1 read (method sealed in the PREREG before any game). usage: node read.mjs <out-dir>
// Reads <out>/r.pgn and <out>/r.out (cutechess-cli -debug all). Score is skytalix's. Opening index = Round - 1
// (r: -games 2 -rounds 100 -repeat, so one round = one opening with both colours), checked against the FEN tag.
import { readFileSync } from "node:fs";
const out = process.argv[2];
const pgn = readFileSync(`${out}/r.pgn`, "utf8"), log = readFileSync(`${out}/r.out`, "utf8");
const games = pgn.split(/\n(?=\[Event )/).filter((g) => g.trim());
const tag = (g, t) => new RegExp(`\\[${t} "([^"]*)"\\]`).exec(g)?.[1];
const rows = games.map((g) => {
  const white = tag(g, "White"), res = tag(g, "Result"), round = Number(tag(g, "Round"));
  const skyWhite = white === "skytalix";
  const s = res === "1/2-1/2" ? 0.5 : (res === "1-0") === skyWhite ? 1 : 0;
  const last = /\{([^}]*)\}\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/.exec(g)?.[1] ?? "?";
  const term = last.includes(", ") ? last.slice(last.lastIndexOf(", ") + 2) : last; // cutechess appends the result text to the last comment
  const dur = (tag(g, "GameDuration") ?? "0:0:0").split(":").map(Number);
  return { round, op: round - 1, fen: tag(g, "FEN"), skyWhite, s, res, term, plies: Number(tag(g, "PlyCount")), sec: dur[0] * 3600 + dur[1] * 60 + dur[2] };
});
const n = rows.length, sum = (a) => a.reduce((x, y) => x + y, 0), mean = (a) => sum(a) / a.length;
const sd = (a) => { const m = mean(a); return Math.sqrt(sum(a.map((x) => (x - m) ** 2)) / (a.length - 1)); };
const S = mean(rows.map((r) => r.s)), eloOf = (p) => -400 * Math.log10(1 / p - 1);
const slope = 400 / (Math.LN10 * S * (1 - S));
const W = rows.filter((r) => r.s === 1).length, L = rows.filter((r) => r.s === 0).length, D = n - W - L;
console.log(`games ${n}; W/D/L ${W}/${D}/${L}; points ${sum(rows.map((r) => r.s)).toFixed(1)} of ${n} = ${(100 * S).toFixed(2)} %; Elo(score) ${eloOf(S).toFixed(1)}`);
for (const w of [true, false]) { const a = rows.filter((r) => r.skyWhite === w); console.log(`  as ${w ? "White" : "Black"}: ${sum(a.map((r) => r.s)).toFixed(1)} / ${a.length}`); }
const byOp = new Map(); const fenBad = new Set();
for (const r of rows) { if (!byOp.has(r.op)) byOp.set(r.op, []); const a = byOp.get(r.op); if (a.length && a[0].fen !== r.fen) fenBad.add(r.op); a.push(r); }
const seIid = sd(rows.map((r) => r.s)) / Math.sqrt(n);
const opMeans = [...byOp.values()].map((a) => mean(a.map((r) => r.s)));
const seOp = sd(opMeans) / Math.sqrt(opMeans.length);
const show = (label, se) => `${label}: SE(score) ${se.toFixed(4)}; 95 % +/- ${(1.96 * se * slope).toFixed(1)} Elo; deff ${((se / seIid) ** 2).toFixed(3)}; effective games ${(n / (se / seIid) ** 2).toFixed(0)}`;
console.log(`openings ${byOp.size} (sizes ${JSON.stringify([...new Set([...byOp.values()].map((a) => a.length))])}); FEN mismatches ${fenBad.size}; opening rounds ${Math.min(...byOp.keys()) + 1}-${Math.max(...byOp.keys()) + 1}`);
console.log(show("iid per game (trinomial)", seIid));
console.log(show(`per opening cluster (2 games x ${byOp.size}, both colours) = opening-cluster interval`, seOp));
const terms = {}; for (const r of rows) { const k = `${r.s === 1 ? "win" : r.s === 0 ? "loss" : "draw"}: ${r.term}`; terms[k] = (terms[k] ?? 0) + 1; }
console.log("terminations (skytalix's view):"); for (const [k, v] of Object.entries(terms).sort()) console.log(`  ${k}  ${v}`);
const timeLoss = rows.filter((r) => /on time|timeout|forfeit/i.test(r.term));
console.log(`time losses (PGN result text): ${timeLoss.length}; "loses on time" lines in r.out: ${(log.match(/loses on time/g) ?? []).length}`);
console.log(`plies per game: median ${rows.map((r) => r.plies).sort((a, b) => a - b)[n >> 1]}, mean ${mean(rows.map((r) => r.plies)).toFixed(1)}; game seconds: mean ${mean(rows.map((r) => r.sec)).toFixed(1)}, max ${Math.max(...rows.map((r) => r.sec))}`);
// latency go -> bestmove per engine (qe-ABC-269 lat.mjs method), ms timestamps first field of -debug lines
const go = {}, lat = {};
for (const l of log.split("\n")) { const m = l.match(/^(\d+) ([<>])(\w+)\(\d+\): (go |bestmove)/); if (!m) continue;
  const [, t, dir, who] = m; if (dir === ">") go[who] = +t; else if (go[who] !== undefined) { (lat[who] ??= []).push(+t - go[who]); delete go[who]; } }
for (const [w, a] of Object.entries(lat)) { a.sort((x, y) => x - y); const q = (p) => a[Math.min(a.length - 1, Math.floor(p * a.length))];
  console.log(`latency ${w}: moves ${a.length} median ${q(0.5)} p95 ${q(0.95)} p99 ${q(0.99)} max ${a[a.length - 1]} ms; >110 ${a.filter((x) => x > 110).length} >150 ${a.filter((x) => x > 150).length} >=150(margin) ${a.filter((x) => x >= 150).length}`); }
