// qe-ABC-247 A2 reader. usage: node probe-read.mjs <runDir> <expectToken: yes|no>
// Log (cutechess -debug all): "<ms> >skytalix(N): <cmd>" to the engine, "<ms> <skytalix(N): <line>" from it.
// (reader fix after run B, before H: a final move comment "eval/depth N.Ns, <result>" carries both a clock and the result)
// PGN: skytalix's moves (by the White/Black tag), clock = the "N.Ns" in the move's comment; < 1 s not counted.
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
const [runDir, expect] = process.argv.slice(2);
const out = [];
const say = (s) => out.push(s);
let fail = 0;
const check = (ok, what) => { if (!ok) fail++; say(`${ok ? "OK  " : "FAIL"} ${what}`); };

// ---- log
const log = readFileSync(join(runDir, "log.txt"), "utf8").split("\n");
const inst = new Map(); // N -> { uci, skillBeforeGo, skillLines, goes: [], firstGoSeen }
for (const l of log) {
  const m = l.match(/^\d+ >skytalix\((\d+)\): (.*)$/);
  if (!m) continue;
  const n = m[1], cmd = m[2];
  if (!inst.has(n)) inst.set(n, { uci: 0, skill: [], skillBeforeGo: false, goes: [] });
  const e = inst.get(n);
  if (cmd === "uci") e.uci++;
  if (/^setoption name Skill Level/i.test(cmd)) { e.skill.push(cmd); if (e.goes.length === 0) e.skillBeforeGo = true; }
  if (/^go\b/.test(cmd)) e.goes.push(cmd);
}
const allGo = [...inst.values()].flatMap((e) => e.goes);
const goKinds = {};
for (const g of allGo) goKinds[g] = (goKinds[g] ?? 0) + 1;
const skillLines = [...new Set([...inst.values()].flatMap((e) => e.skill))];
say(`log: skytalix instances ${inst.size} (uci handshakes ${[...inst.values()].map((e) => e.uci).join(",")}); go lines ${allGo.length}: ${JSON.stringify(goKinds)}`);
say(`log: setoption Skill Level lines to skytalix: ${JSON.stringify(skillLines)}; per instance count ${[...inst.values()].map((e) => e.skill.length).join(",")}; before first go ${[...inst.values()].map((e) => e.skillBeforeGo).join(",")}`);
const sfGoKinds = {};
for (const l of log) { const m = l.match(/^\d+ >stockfish\(\d+\): (go\b.*)$/); if (m) sfGoKinds[m[1]] = (sfGoKinds[m[1]] ?? 0) + 1; }
const sfSkill = log.filter((l) => /^\d+ >stockfish\(\d+\): setoption name Skill Level/i.test(l)).length;
say(`log: stockfish go lines ${JSON.stringify(sfGoKinds)}; stockfish Skill Level setoptions ${sfSkill}`);

// ---- pgn
const pgn = readFileSync(join(runDir, "r.pgn"), "utf8");
const games = pgn.split(/\n(?=\[Event )/).filter((g) => g.includes("[Event "));
const hist = {}; let at3 = 0, at4 = 0, below1 = 0, uncommented = 0;
const results = [];
for (const g of games) {
  const tag = (k) => (g.match(new RegExp(`\\[${k} "([^"]*)"\\]`)) ?? [])[1];
  const skyWhite = tag("White") === "skytalix";
  const fen = tag("FEN"); let whiteToMove = fen ? fen.split(" ")[1] === "w" : true;
  const body = g.replace(/^\[.*\]$/gm, "");
  const toks = body.match(/\{[^}]*\}|\d+\.(?:\.\.)?|1-0|0-1|1\/2-1\/2|\*|[^\s{}]+/g) ?? [];
  const resultComment = [];
  let lastWasMove = false, moverSky = false;
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (/^\d+\.(\.\.)?$/.test(t)) continue;
    if (/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)) continue;
    if (t.startsWith("{")) {
      const c = t.slice(1, -1).trim();
      const clock = c.match(/(\d+(?:\.\d+)?)s(?=,|$)/);
      const tail = c.includes(", ") ? c.slice(c.indexOf(", ") + 2) : "";
      if (tail) resultComment.push(tail);
      if (lastWasMove && moverSky && clock) {
        const s = Number(clock[1]);
        if (s < 1) below1++; else { hist[clock[1]] = (hist[clock[1]] ?? 0) + 1; if (clock[1] === "3.0") at3++; if (clock[1] === "4.0") at4++; }
      } else if (!clock) resultComment.push(c);
      lastWasMove = false;
      continue;
    }
    // a SAN move
    if (lastWasMove && moverSky) uncommented++;
    moverSky = whiteToMove === skyWhite;
    whiteToMove = !whiteToMove;
    lastWasMove = true;
  }
  if (lastWasMove && moverSky) uncommented++;
  results.push(`${tag("White")}-${tag("Black")} ${tag("Result")} plies=${tag("PlyCount")} dur=${tag("GameDuration")} term=${tag("Termination") ?? "-"} comment=${JSON.stringify(resultComment)}`);
}
say(`pgn: games ${games.length}`);
for (const r of results) say(`pgn: ${r}`);
say(`pgn: skytalix clocks >= 1 s: ${JSON.stringify(Object.fromEntries(Object.entries(hist).sort((a, b) => Number(a[0]) - Number(b[0]))))}; < 1 s ${below1}; without a clock comment (book) ${uncommented}`);
const faultRe = /time|disconnect|illegal|stall|crash|connection|forfeit/i;
const faults = results.filter((r) => faultRe.test(r.split(" comment=")[1] ?? "") || faultRe.test(r.split(" term=")[1]?.split(" comment=")[0] ?? ""));
const exitTxt = existsSync(join(runDir, "exit.txt")) ? readFileSync(join(runDir, "exit.txt"), "utf8").trim() : "no exit.txt";
const skyErr = existsSync(join(runDir, "skytalix.stderr")) ? statSync(join(runDir, "skytalix.stderr")).size : -1;
say(`run: ${exitTxt}; skytalix.stderr ${skyErr} bytes`);

// ---- criteria
check(/exit=0 /.test(exitTxt) && games.length === 2, "P1 cutechess-cli exit 0 and 2 games in the PGN");
if (expect === "yes") {
  check(inst.size === 2 && [...inst.values()].every((e) => e.skillBeforeGo && e.skill.length === 1) && skillLines.length === 1 && skillLines[0] === "setoption name Skill Level value 6",
    "P2 'setoption name Skill Level value 6' to skytalix before its first go, in every instance (one per game)");
} else {
  check(skillLines.length === 0, "C2 no Skill Level setoption to skytalix");
}
check(allGo.length > 0 && Object.keys(goKinds).length === 1 && goKinds["go movetime 4000"] === allGo.length, "P3 every skytalix go is 'go movetime 4000'");
if (expect === "yes") check(at3 === 0 && at4 >= 20, `P4 skytalix clocks: ${at3} at 3.0s (need 0), ${at4} at 4.0s (need >= 20)`);
else check(at3 >= 20 && at4 === 0, `C4 skytalix clocks: ${at3} at 3.0s (need >= 20), ${at4} at 4.0s (need 0)`);
check(faults.length === 0 && skyErr === 0, `P5 0 faults / time losses (fault-like results ${faults.length}); skytalix.stderr empty`);
say(`RESULT ${fail === 0 ? "PASS" : "FAIL"} (${fail} failed)`);
console.log(out.join("\n"));
