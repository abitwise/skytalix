// qe-ABC-255 read of one rating.ts out-dir (pre-registered method, PREREG.txt).
// usage: node analyse.mjs <out-dir> <mode r|d> <budget-ms> [blockLogDir]
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
const [out, mode, budgetText, blockDir] = process.argv.slice(2);
const budget = Number(budgetText);
const outText = readFileSync(join(out, `${mode}.out`), "utf8");
const pgn = existsSync(join(out, `${mode}.pgn`)) ? readFileSync(join(out, `${mode}.pgn`), "utf8") : "";
const q = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.ceil((p / 100) * s.length) - 1)]; };
const med = (a) => q(a, 50);
// 1. per-move think time from the -debug all log (cutechess's own ms clock): go -> bestmove, per engine instance
const per = new Map();
const pending = new Map();
const goLines = new Map();
for (const line of outText.split("\n")) {
  const m = /^(\d+) ([<>])([\w-]+)\((\d+)\): (.*)$/.exec(line);
  if (!m) continue;
  const [, t, dir, name, id, msg] = m;
  const key = `${name}(${id})`;
  if (!per.has(name)) per.set(name, { searched: [], book: 0, goTexts: new Map() });
  const e = per.get(name);
  if (dir === ">" && msg.startsWith("go ")) { pending.set(key, { t: Number(t), book: false }); e.goTexts.set(msg, (e.goTexts.get(msg) ?? 0) + 1); }
  else if (dir === "<" && msg === "info string book" && pending.has(key)) pending.get(key).book = true;
  else if (dir === "<" && msg.startsWith("bestmove") && pending.has(key)) {
    const p = pending.get(key); pending.delete(key);
    if (p.book) e.book++; else e.searched.push(Number(t) - p.t);
  }
}
console.log(`== think time (cutechess -debug clock), budget ${budget} ms for skytalix/base ==`);
for (const [name, e] of per) {
  const b = name === "stockfish" ? 500 : budget;
  const over = e.searched.map((x) => x - b);
  console.log(`${name}: go lines ${JSON.stringify(Object.fromEntries(e.goTexts))}; searched ${e.searched.length}, book ${e.book}; ` +
    `think median ${med(e.searched)} p99 ${q(e.searched, 99)} max ${e.searched.length ? Math.max(...e.searched) : null} ms; ` +
    `overshoot over ${b} ms: median ${med(over)} p99 ${q(over, 99)} MAX ${over.length ? Math.max(...over) : null} ms; ` +
    [0, 5, 10, 12, 25, 50].map((k) => `>${k}: ${over.filter((x) => x > k).length}`).join(", "));
}
if (pending.size) console.log(`unanswered go at end: ${[...pending.keys()].join(",")}`);
// 2. results
const fin = [...outText.matchAll(/^Finished game (\d+) \((.+) vs (.+)\): (\S+) \{(.*)\}$/gm)];
const terms = {};
for (const f of fin) terms[f[5]] = (terms[f[5]] ?? 0) + 1;
const timeLoss = fin.filter((f) => /on time|timeout/i.test(f[5]));
const faults = fin.filter((f) => /illegal|disconnect|stall|No result|Result error|crash/i.test(f[5]));
console.log(`== results ==\nfinished ${fin.length}; time losses ${timeLoss.length}${timeLoss.length ? " " + timeLoss.map((f) => `g${f[1]}{${f[5]}}`).join(" ") : ""}; faults ${faults.length}`);
console.log(`terminations: ${JSON.stringify(terms)}`);
const score = [...outText.matchAll(/^Score of (.+) vs (.+): (\d+) - (\d+) - (\d+)\s+\[(\S+)\] (\d+)$/gm)].at(-1);
const elo = [...outText.matchAll(/^Elo difference: (\S+) \+\/- (\S+), LOS: (\S+) %, DrawRatio: (\S+) %$/gm)].at(-1);
if (score) { const [w, l, d] = [3, 4, 5].map((i) => Number(score[i])); console.log(`Score of ${score[1]} vs ${score[2]}: W/L/D ${w}/${l}/${d}; points ${w + d / 2} of ${w + l + d} [${score[6]}]`); }
if (elo) console.log(`Elo difference ${elo[1]} +/- ${elo[2]}; LOS ${elo[3]} %; draw ratio ${elo[4]} %`);
// 3. PGN: games, plies, games/hour, stockfish depth
const games = pgn.split(/\n(?=\[Event )/).filter((g) => g.trim());
const plies = games.map((g) => Number(/\[PlyCount "(\d+)"\]/.exec(g)?.[1] ?? 0));
const starts = games.map((g) => Date.parse(`${/\[GameStartTime "([^ ]+) UTC"\]/.exec(g)?.[1]}Z`));
const ends = games.map((g) => Date.parse(`${/\[GameEndTime "([^ ]+) UTC"\]/.exec(g)?.[1]}Z`));
const span = (Math.max(...ends) - Math.min(...starts)) / 1000;
console.log(`== pgn ==\ngames ${games.length}; plies mean ${(plies.reduce((a, b) => a + b, 0) / Math.max(1, games.length)).toFixed(1)} [${Math.min(...plies)}-${Math.max(...plies)}]; ` +
  `first start -> last end ${span.toFixed(0)} s; games/hour ${(3600 * games.length / span).toFixed(1)}`);
if (existsSync(join(out, "host.log"))) {
  const hl = readFileSync(join(out, "host.log"), "utf8").split("\n");
  const ts = (lab) => Date.parse(hl.find((l) => l.includes(` ${lab} `))?.split(" ")[0] ?? "");
  const s = ts("start"), e = ts("end"), b = ts("before");
  console.log(`host.log: before -> end ${((e - b) / 1000).toFixed(0)} s (incl. builds); cutechess start -> end ${((e - s) / 1000).toFixed(0)} s; games/hour (cutechess wall) ${(3600 * games.length / ((e - s) / 1000)).toFixed(1)}`);
}
if (mode === "r") {
  const depths = [];
  const skyT = [];
  for (const g of games) {
    const white = /\[White "(.*)"\]/.exec(g)[1];
    let side = /\[FEN "\S+ ([wb]) /.exec(g)?.[1] ?? "w";
    const body = g.replace(/^\[.*\]$/gm, "");
    const toks = body.match(/\{[^}]*\}|[^\s{}]+/g) ?? [];
    let mover = "";
    for (const tok of toks) {
      if (/^\d+\.+$/.test(tok) || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(tok)) continue;
      if (tok.startsWith("{")) {
        const m = /^\{[+-]?M?[\d.]+\/(\d+) ([\d.]+)s/.exec(tok);
        if (m && mover === "stockfish") depths.push(Number(m[1]));
        if (m && mover === "skytalix") skyT.push(Number(m[2]));
        continue;
      }
      mover = (side === "w") === (white === "skytalix") ? "skytalix" : "stockfish";
      side = side === "w" ? "b" : "w";
    }
  }
  const hist = {};
  for (const d of depths) hist[d] = (hist[d] ?? 0) + 1;
  console.log(`stockfish depth per move (PGN): n ${depths.length}; median ${med(depths)}; min ${Math.min(...depths)}; max ${Math.max(...depths)}; histogram ${JSON.stringify(hist)}`);
  console.log(`skytalix PGN clock per searched move: max ${Math.max(...skyT)} s; n ${skyT.length}`);
}
if (existsSync(join(out, "summary.txt"))) console.log(`== harness summary.txt ==\n${readFileSync(join(out, "summary.txt"), "utf8").trim()}`);
if (existsSync(join(out, "machine.txt"))) console.log(`== machine.txt control line == ${readFileSync(join(out, "machine.txt"), "utf8").split("\n").filter((l) => /control|harness|concurrency/.test(l)).join(" | ")}`);
if (blockDir && existsSync(join(blockDir, "samples.log"))) {
  const sl = readFileSync(join(blockDir, "samples.log"), "utf8").trim().split("\n");
  const t = sl.map((l) => Number(/tctl=([\d.]+)/.exec(l)?.[1]));
  const v = sl.filter((l) => !/vitest=0 /.test(l)).length;
  const c = sl.filter((l) => !/cutechess_foreign=0 /.test(l)).length;
  const busy = sl.filter((l) => !/foreign_busy=-$/.test(l)).length;
  const load = sl.map((l) => Number(/load1=([\d.]+)/.exec(l)?.[1]));
  console.log(`== host (block samples, 10 s) ==\nsamples ${sl.length}; with real foreign vitest ${v} (${(100 * v / sl.length).toFixed(1)} %); with foreign cutechess ${c}; with a foreign process >= 20 % CPU ${busy}; ` +
    `load1 median ${med(load)} max ${Math.max(...load)}; Tctl median ${med(t)} max ${Math.max(...t)}`);
  console.log(readFileSync(join(blockDir, "block.log"), "utf8").trim());
}
