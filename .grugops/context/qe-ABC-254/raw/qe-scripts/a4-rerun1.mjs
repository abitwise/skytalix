// qe-ABC-254 A4 (+ G6, + G5 report) driver, as pre-registered. usage: node a4.mjs <treesDir> <out.jsonl> [boards csv] [tag]
// 5 rounds; each round, per board in order: a pair, base first in odd rounds, head first in even rounds.
import { spawnSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { alive, busyJiffies, busyProcs, cutechessCount, load1, sleepSync, tctl, vitestPids } from "./host.mjs";
const S = dirname(fileURLToPath(import.meta.url));
const [trees, outFile, boardsArg, tag = "main"] = process.argv.slice(2);
const BOARDS = (boardsArg ?? "kiwipete,position-6,start,position-4").split(",");
const log = (o) => appendFileSync(outFile, `${JSON.stringify({ at: new Date().toISOString(), tag, ...o })}\n`);
const foreignNow = () => ({ vitest: vitestPids(), cutechess: cutechessCount() });
function gate(where) {
  // Before a pair: wait out a foreign vitest by PID, a cutechess-cli by poll, and Tctl >= 85 until <= 75.
  for (let i = 0; i < 240; i++) {
    const f = foreignNow(); const t = tctl();
    if (f.vitest.length === 0 && f.cutechess === 0 && t < 85) return;
    log({ ev: "pause", where, vitest: f.vitest, cutechess: f.cutechess, tctl: t });
    for (const pid of f.vitest) while (alive(pid)) sleepSync(5_000);
    if (f.cutechess > 0) sleepSync(15_000);
    if (t >= 85) { while (tctl() > 75) sleepSync(15_000); }
  }
}
function run(build, board) {
  const tBefore = tctl(); const lBefore = load1(); const j0 = busyJiffies(); const w0 = Date.now();
  const r = spawnSync(process.execPath, [join(S, "probe.mjs"), join(trees, build), build, board], { encoding: "utf8" });
  const wall = (Date.now() - w0) / 1000; const j1 = busyJiffies();
  if (r.status !== 0) { log({ ev: "error", build, board, stderr: r.stderr }); process.exit(2); }
  const o = JSON.parse(r.stdout.trim());
  const hostBusyS = (j1 - j0) / 100;
  // foreign cores = (host busy CPU-s − the probe's own CPU-s) / process wall s; the driver's share is in it (small).
  return { ...o, procWallS: wall, tctlBefore: tBefore, tctlAfter: tctl(), load1Before: lBefore, load1After: load1(),
    foreignCores: Math.round(((hostBusyS - o.cpuS) / wall) * 100) / 100, busy: busyProcs() };
}
// Start precondition (moved here from clear.mjs after the detector fix): 0 running foreign vitest, 0 cutechess-cli,
// load1 <= 2.0, Tctl <= 60; poll 15 s; cap at CLEAR_DEADLINE (45 min after the lock was acquired), then SHARED.
const deadline = Date.parse(process.env.CLEAR_DEADLINE ?? "2026-11-01T16:38:37Z" /* lock acquired 15:53:37Z + 45 min */);
let shared = false;
for (;;) {
  const f = foreignNow(); const l = load1(); const t = tctl();
  if (f.vitest.length === 0 && f.cutechess === 0 && l <= 2.0 && t <= 60) { log({ ev: "clear", load1: l, tctl: t }); break; }
  if (Date.now() > deadline) { shared = true; log({ ev: "SHARED-cap", load1: l, tctl: t, ...f }); break; }
  log({ ev: "wait-clear", load1: l, tctl: t, ...f });
  for (const pid of f.vitest) while (alive(pid) && Date.now() <= deadline) sleepSync(5_000);
  if (f.vitest.length === 0) sleepSync(15_000);
}
log({ ev: "start", shared, boards: BOARDS, load1: load1(), tctl: tctl(), ...foreignNow() });
for (let round = 1; round <= 5; round++) {
  for (const board of BOARDS) {
    const order = round % 2 === 1 ? ["B", "H"] : ["H", "B"];
    for (let attempt = 1; attempt <= 2; attempt++) {
      gate(`${round}/${board}`);
      const pair = order.map((b) => run(b, board));
      const f = foreignNow();
      const clear = f.vitest.length === 0 && f.cutechess === 0 && pair.every((x) => x.foreignCores <= 1.0);
      for (const x of pair) log({ ev: "run", round, attempt, clearPair: clear, ...x });
      const [b, h] = order[0] === "B" ? pair : [pair[1], pair[0]];
      if (b.depth === h.depth && (b.move !== h.move || b.score !== h.score)) { log({ ev: "STOP-identity", round, board }); process.exit(4); }
      if (clear || attempt === 2) break;
      log({ ev: "pair-void-rerun", round, board, ...f });
    }
  }
}
log({ ev: "done", load1: load1(), tctl: tctl(), ...foreignNow() });
