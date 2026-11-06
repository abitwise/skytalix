// qe-ABC-229 (from qe-ABC-228-ii g6.mjs; wait-clear moved to host.mjs) timing session, ALONE: G6 (5 interleaved rounds;
// each a kiwipete pair then a position-6 pair; base first in odd rounds, head first in even), then G11 (five game-1
// positions, base then head, one run each). Both builds at 4 000 ms (timed.mjs refuses otherwise). One fresh plain node
// process per search. Wait-clear before EVERY timed read. THERMAL STOP: median of the session's Tctl samples > 85.0
// from the 6th sample on -> stop. usage: node g6.mjs <scratch> <outDir> [g6|g11|both]
import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tctl, waitClear } from "./host.mjs";

const [scr, out, which = "both"] = process.argv.slice(2);
const timed = join(scr, "scripts/timed.mjs");
const ts = () => new Date().toISOString().replace(/\.\d+Z$/, "Z");
const log = (s) => appendFileSync(join(out, "wait.log"), `${ts()} ${s}\n`);
const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
const temps = [];
function run(label, file, args) {
  const pre = waitClear(label, log);
  const line = execFileSync(process.execPath, [timed, ...args], { encoding: "utf8" }).trim();
  const t = tctl();
  temps.push(pre.t, t);
  const rec = { ...JSON.parse(line), label, load1_before: Number(pre.l.toFixed(2)), tctl_before: pre.t, tctl_after: t };
  appendFileSync(join(out, file), `${JSON.stringify(rec)}\n`);
  console.log(JSON.stringify(rec));
  const med = median(temps);
  if (temps.length >= 6 && med > 85.0) {
    log(`THERMAL-STOP median=${med.toFixed(2)}`);
    process.exit(9);
  }
}
const B = join(scr, "base");
const H = join(scr, "head");
if (which === "g6" || which === "both") {
  log("G6 session start");
  for (let r = 1; r <= 5; r++) {
    const order = r % 2 ? [B, H] : [H, B];
    for (const pos of ["kiwipete", "position-6"]) for (const tree of order) run(`g6 r${r} ${pos}`, "g6.jsonl", [tree, "g6", pos]);
  }
  log("G6 session end");
}
if (which === "g11" || which === "both") {
  log("G11 session start");
  const fens = readFileSync(join(scr, "g11-fens.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
  for (const { before, fen } of fens) for (const tree of [B, H]) run(`g11 ${before}`, "g11.jsonl", [tree, "g11", before, fen]);
  log("G11 session end");
}
log(`tctl over reads: median ${median(temps).toFixed(1)} max ${Math.max(...temps).toFixed(1)}`);
