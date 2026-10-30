// qe-ABC-228-ii (from qe-ABC-228 g6.mjs; header path change only) timing session, ALONE: G6 (5 interleaved rounds; each a kiwipete pair then a position-6 pair; base first
// in odd rounds, head first in even), then G11 (five game-1 positions, base then head, one run each). One fresh plain
// node process per search (timed.mjs). Wait-clear before EVERY timed read: 0 cutechess-cli, 0 foreign vitest,
// load1 <= 2.0, Tctl <= 60.0 (poll 15 s, up to 60 min). THERMAL STOP: median of the per-run Tctl > 85.0 -> stop.
// usage: node g6.mjs <scratch> <outDir> [g6|g11|both]
import { execFileSync } from "node:child_process";
import { appendFileSync, readdirSync, readFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";

const [scr, out, which = "both"] = process.argv.slice(2);
const timed = join(scr, "scripts/timed.mjs");
const ts = () => new Date().toISOString().replace(/\.\d+Z$/, "Z");
const log = (f, s) => appendFileSync(join(out, f), `${ts()} ${s}\n`);
const count = (args) => {
  try {
    return execFileSync("pgrep", args, { encoding: "utf8" }).trim().split("\n").length;
  } catch {
    return 0;
  }
};
const tctl = () => {
  for (const h of readdirSync("/sys/class/hwmon")) {
    const p = join("/sys/class/hwmon", h);
    if (readFileSync(join(p, "name"), "utf8").trim() === "k10temp") return Number(readFileSync(join(p, "temp1_input"), "utf8")) / 1000;
  }
  return Number.NaN;
};
const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const temps = [];

function waitClear(label) {
  for (let i = 1; i <= 240; i++) {
    const l = loadavg()[0];
    const v = count(["-f", "[/]vitest"]);
    const c = count(["-x", "cutechess-cli"]);
    const t = tctl();
    if (v === 0 && c === 0 && l <= 2.0 && t <= 60.0) {
      if (i > 1) log("wait.log", `${label} clear after poll ${i}`);
      return { l, t };
    }
    log("wait.log", `${label} wait poll=${i} load1=${l.toFixed(2)} vitest=${v} cutechess=${c} tctl=${t.toFixed(1)}`);
    sleepSync(15_000);
  }
  log("wait.log", `${label} PRECONDITION-NOT-MET after 60 min`);
  process.exit(3);
}

function run(label, file, args) {
  const pre = waitClear(label);
  const line = execFileSync(process.execPath, [timed, ...args], { encoding: "utf8" }).trim();
  const t = tctl();
  temps.push(pre.t, t);
  const rec = { ...JSON.parse(line), label, load1_before: Number(pre.l.toFixed(2)), tctl_before: pre.t, tctl_after: t };
  appendFileSync(join(out, file), `${JSON.stringify(rec)}\n`);
  console.log(JSON.stringify(rec));
  const med = median(temps);
  if (temps.length >= 6 && med > 85.0) {
    log("wait.log", `THERMAL-STOP median=${med.toFixed(2)}`);
    process.exit(9);
  }
}

const B = join(scr, "base");
const H = join(scr, "head");
if (which === "g6" || which === "both") {
  log("wait.log", "G6 session start");
  for (let r = 1; r <= 5; r++) {
    const order = r % 2 ? [B, H] : [H, B];
    for (const pos of ["kiwipete", "position-6"]) for (const tree of order) run(`g6 r${r} ${pos}`, "g6.jsonl", [tree, "g6", pos]);
  }
  log("wait.log", "G6 session end");
}
if (which === "g11" || which === "both") {
  log("wait.log", "G11 session start");
  const fens = readFileSync(join(scr, "g11-fens.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
  for (const { before, fen } of fens) for (const tree of [B, H]) run(`g11 ${before}`, "g11.jsonl", [tree, "g11", before, fen]);
  log("wait.log", "G11 session end");
}
log("wait.log", `tctl over reads: median ${median(temps).toFixed(1)} max ${Math.max(...temps).toFixed(1)}`);
