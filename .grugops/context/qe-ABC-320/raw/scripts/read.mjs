// qe-ABC-320 night read (sealed in the PREREG before any graded game). usage: node read.mjs <level> <E> <st-ms> <chunk-dir>...
// Copy of qe-ABC-317's sealed read.mjs (740f1658) with three changes, all in what it reads, none in a formula: level 1-7;
// any number of chunk dirs, pooled; each game's opening is the chunk's start (cmd.txt `start=S`, else 1) + Round - 1, so
// the opening-cluster interval and the FEN check run over the night's openings. Latency, the option counts and the
// termination counts are the sealed ones, summed over the chunks.
// Reads <dir>/r.pgn, <dir>/r.out (cutechess-cli -debug all) and <dir>/cmd.txt. Score is skytalix's.
import { readFileSync } from "node:fs";
const [level, E, stArg, ...dirs] = process.argv.slice(2), st = Number(stArg);
if (!/^[1-7]$/.test(level ?? "") || !/^\d{4}$/.test(E ?? "") || !(st > 0) || dirs.length === 0)
  throw new Error("usage: node read.mjs <level> <E> <st-ms> <chunk-dir>...");
const tag = (g, t) => new RegExp(`\\[${t} "([^"]*)"\\]`).exec(g)?.[1];
const rows = [], logs = [];
for (const out of dirs) {
  const start = Number(/ start=(\d+) /.exec(readFileSync(`${out}/cmd.txt`, "utf8"))?.[1] ?? 1);
  const pgn = readFileSync(`${out}/r.pgn`, "utf8");
  logs.push(readFileSync(`${out}/r.out`, "utf8"));
  for (const g of pgn.split(/\n(?=\[Event )/).filter((x) => x.trim())) {
    const white = tag(g, "White"), res = tag(g, "Result"), round = Number(tag(g, "Round"));
    const skyWhite = white === "skytalix";
    const s = res === "1/2-1/2" ? 0.5 : (res === "1-0") === skyWhite ? 1 : 0;
    const last = /\{([^}]*)\}\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/.exec(g)?.[1] ?? "?";
    const term = last.includes(", ") ? last.slice(last.lastIndexOf(", ") + 2) : last;
    const dur = (tag(g, "GameDuration") ?? "0:0:0").split(":").map(Number);
    rows.push({ op: start + round - 1, fen: tag(g, "FEN"), skyWhite, s, res, term, plies: Number(tag(g, "PlyCount")), sec: dur[0] * 3600 + dur[1] * 60 + dur[2] });
  }
}
const log = logs.join("\n");
const n = rows.length, sum = (a) => a.reduce((x, y) => x + y, 0), mean = (a) => sum(a) / a.length;
const sd = (a) => { const m = mean(a); return Math.sqrt(sum(a.map((x) => (x - m) ** 2)) / (a.length - 1)); };
const S = mean(rows.map((r) => r.s)), eloOf = (p) => -400 * Math.log10(1 / p - 1);
const slope = 400 / (Math.LN10 * S * (1 - S));
const W = rows.filter((r) => r.s === 1).length, L = rows.filter((r) => r.s === 0).length, D = n - W - L;
console.log(`chunks ${dirs.length}; games ${n}; W/D/L ${W}/${D}/${L}; points ${sum(rows.map((r) => r.s)).toFixed(1)} of ${n} = ${(100 * S).toFixed(2)} %; Elo(score) ${eloOf(S).toFixed(1)}`);
for (const w of [true, false]) { const a = rows.filter((r) => r.skyWhite === w); console.log(`  as ${w ? "White" : "Black"}: ${sum(a.map((r) => r.s)).toFixed(1)} / ${a.length}`); }
const byOp = new Map(); const fenBad = new Set();
for (const r of rows) { if (!byOp.has(r.op)) byOp.set(r.op, []); const a = byOp.get(r.op); if (a.length && a[0].fen !== r.fen) fenBad.add(r.op); a.push(r); }
const seIid = sd(rows.map((r) => r.s)) / Math.sqrt(n);
const opMeans = [...byOp.values()].map((a) => mean(a.map((r) => r.s)));
const seOp = sd(opMeans) / Math.sqrt(opMeans.length);
const show = (label, se) => `${label}: SE(score) ${se.toFixed(4)}; 95 % +/- ${(1.96 * se * slope).toFixed(1)} Elo; deff ${((se / seIid) ** 2).toFixed(3)}; effective games ${(n / (se / seIid) ** 2).toFixed(0)}`;
console.log(`openings ${byOp.size} (sizes ${JSON.stringify([...new Set([...byOp.values()].map((a) => a.length))])}); FEN mismatches ${fenBad.size}; openings ${Math.min(...byOp.keys())}-${Math.max(...byOp.keys())}`);
console.log(show("iid per game (trinomial)", seIid));
console.log(show(`per opening cluster (2 games x ${byOp.size}, both colours) = opening-cluster interval`, seOp));
const terms = {}; for (const r of rows) { const k = `${r.s === 1 ? "win" : r.s === 0 ? "loss" : "draw"}: ${r.term}`; terms[k] = (terms[k] ?? 0) + 1; }
console.log("terminations (skytalix's view):"); for (const [k, v] of Object.entries(terms).sort()) console.log(`  ${k}  ${v}`);
const timeLoss = rows.filter((r) => /on time|timeout|forfeit/i.test(r.term));
console.log(`time losses (PGN result text): ${timeLoss.length}; "loses on time" lines in r.out: ${(log.match(/loses on time/g) ?? []).length}`);
const plies = rows.map((r) => r.plies).sort((a, b) => a - b);
console.log(`plies per game: median ${plies[n >> 1]}, mean ${mean(plies).toFixed(1)}, max ${plies[n - 1]}; game seconds: mean ${mean(rows.map((r) => r.sec)).toFixed(1)}, max ${Math.max(...rows.map((r) => r.sec))}; seconds a ply ${(sum(rows.map((r) => r.sec)) / sum(plies)).toFixed(3)}`);
// latency go -> bestmove per engine (qe-ABC-269 lat.mjs method), ms timestamps first field of -debug lines; per chunk log
const lat = {};
for (const one of logs) { const go = {};
  for (const l of one.split("\n")) { const m = l.match(/^(\d+) ([<>])(\w+)\(\d+\): (go |bestmove)/); if (!m) continue;
    const [, t, dir, who] = m; if (dir === ">") go[who] = +t; else if (go[who] !== undefined) { (lat[who] ??= []).push(+t - go[who]); delete go[who]; } } }
for (const [w, a] of Object.entries(lat)) { a.sort((x, y) => x - y); const q = (p) => a[Math.min(a.length - 1, Math.floor(p * a.length))];
  console.log(`latency ${w}: moves ${a.length} median ${q(0.5)} p95 ${q(0.95)} p99 ${q(0.99)} max ${a[a.length - 1]} ms; >${st + 10} ${a.filter((x) => x > st + 10).length} >=${st + 50}(margin) ${a.filter((x) => x >= st + 50).length}`); }
// Each engine process that was sent a go: did it get the sealed option first? restart=on, so one process a game. Per chunk log.
let gos = { skytalix: 0, stockfish: 0 }, got = { skytalix: 0, stockfish: 0 }, movetime = {}, other = 0;
for (const one of logs) { const sent = { skytalix: new Map(), stockfish: new Map() }, went = { skytalix: new Set(), stockfish: new Set() };
  for (const l of one.split("\n")) { const m = l.match(/^\d+ >(skytalix|stockfish)\((\d+)\): (.*)$/); if (!m) continue;
    const [, who, id, cmd] = m; if (cmd.startsWith("go ")) { went[who].add(id); if (cmd === `go movetime ${st}`) movetime[who] = (movetime[who] ?? 0) + 1; else other++; }
    const o = who === "skytalix" ? /^setoption name Skill Level value (\S+)$/.exec(cmd) : /^setoption name UCI_Elo value (\S+)$/.exec(cmd);
    if (o) sent[who].set(id, o[1]); }
  for (const [who, want] of [["skytalix", level], ["stockfish", E]]) { const ids = [...went[who]]; gos[who] += ids.length; got[who] += ids.filter((i) => sent[who].get(i) === want).length; } }
for (const [who, want] of [["skytalix", level], ["stockfish", E]])
  console.log(`${who === "skytalix" ? "Skill Level" : "UCI_Elo"} ${want}: processes with a go ${gos[who]}; got ${want} ${got[who]}; missing or other ${gos[who] - got[who]}`);
console.log(`go movetime ${st}: skytalix ${movetime.skytalix ?? 0}, stockfish ${movetime.stockfish ?? 0}; any other go ${other}`);
