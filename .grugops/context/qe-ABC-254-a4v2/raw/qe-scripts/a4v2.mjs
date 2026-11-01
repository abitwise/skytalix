// qe-ABC-254-a4v2: the A4 driver under ADR-0055 D3-V2. Built from qe-ABC-254-a4's a4.mjs; changes are marked V2.
// usage: node a4v2.mjs <treesDir> <out.jsonl> [boards csv] [tag]
// V2 (D3-V2 items 1-3): rounds go board by board, as before. In a round, a board makes attempts until ONE pair is
// admitted or the board reaches its cap of 15 attempts in this schedule. A board reaching its cap with fewer than 5
// admitted pairs is VOID-LOAD and gets no more attempts. A board stops at its 5th admitted pair.
// Admitted = after the pair: no foreign vitest, no cutechess-cli, both runs' foreign cores <= 0.8 (unrounded), both
// runs' after-run Tctl < 85 °C. Admission reads host counters and the probe's CPU time only, never nodes/nps/depth.
// Order: base first when the board's admitted count is even, head first when it is odd; a retry keeps the order.
import { spawnSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { alive, busyJiffies, cutechessCount, foreignHot, hotProcs, load1, procSnap, sleepSync, tctl, vitestPids } from "./host.mjs";
const S = dirname(fileURLToPath(import.meta.url));
const [trees, outFile, boardsArg, tag = "main"] = process.argv.slice(2);
const BOARDS = (boardsArg ?? "kiwipete,position-6,start,position-4").split(",");
const COUNT = 5; const CAP = 15; const FC_MAX = 0.8; const TCTL_MAX = 85; // V2
// The probe is probe.mjs. A4_PROBE exists ONLY for the pre-run logic test with a stub; the start event logs which
// probe ran, so a timed run that did not use probe.mjs is visible.
const PROBE = process.env.A4_PROBE ?? join(S, "probe.mjs");
const log = (o) => appendFileSync(outFile, `${JSON.stringify({ at: new Date().toISOString(), tag, ...o })}\n`);
const foreignNow = () => ({ vitest: vitestPids(), cutechess: cutechessCount() });
if (!process.env.CLEAR_DEADLINE) throw new Error("CLEAR_DEADLINE required");
const deadlineG = Date.parse(process.env.CLEAR_DEADLINE);
let sharedAfterCap = false;
let waitS = 0; // V2: seconds spent in gate waits (excluded from the run-time budget), reported.
function gate(where) {
  // Unchanged from a4.mjs: before an attempt, wait out a foreign vitest by PID (never past CLEAR_DEADLINE), a
  // cutechess-cli by poll, and Tctl >= 85 until <= 75.
  const g0 = Date.now();
  try {
    for (let i = 0; i < 240; i++) {
      const f = foreignNow(); const t = tctl();
      if (f.vitest.length === 0 && f.cutechess === 0 && t < 85) return;
      log({ ev: "pause", where, vitest: f.vitest, cutechess: f.cutechess, tctl: t });
      for (const pid of f.vitest) while (alive(pid) && Date.now() <= deadlineG) sleepSync(5_000);
      if (f.vitest.length > 0 && Date.now() > deadlineG && f.cutechess === 0 && t < 85) { sharedAfterCap = true; return; }
      if (f.cutechess > 0) sleepSync(15_000);
      if (t >= 85) { while (tctl() > 75) sleepSync(15_000); }
    }
  } finally { waitS += (Date.now() - g0) / 1000; }
}
function run(build, board) {
  const s0 = procSnap();
  const tBefore = tctl(); const lBefore = load1(); const j0 = busyJiffies(); const w0 = Date.now();
  const r = spawnSync(process.execPath, [PROBE, join(trees, build), build, board], { encoding: "utf8" });
  const wall = (Date.now() - w0) / 1000; const j1 = busyJiffies(); const s1 = procSnap();
  const tAfter = tctl(); const lAfter = load1();
  if (r.status !== 0) { log({ ev: "error", build, board, stderr: r.stderr }); process.exit(2); }
  const o = JSON.parse(r.stdout.trim());
  const hostBusyS = (j1 - j0) / 100;
  const fcExact = (hostBusyS - o.cpuS) / wall; // V2: admission reads the unrounded value
  return { ...o, procWallS: wall, tctlBefore: tBefore, tctlAfter: tAfter, load1Before: lBefore, load1After: lAfter,
    foreignCores: Math.round(fcExact * 100) / 100, foreignCoresExact: fcExact,
    busy: hotProcs(s0, s1, wall, 20, [process.pid, r.pid]),
    busyWithChildren: hotProcs(s0, s1, wall, 20, [process.pid, r.pid], true) }; // V2-INFO (QE-254-d)
}
// Start precondition: unchanged from qe-ABC-254-a4 (0 running foreign vitest, 0 cutechess-cli, no foreign process
// > 50 % of one core over a 3 s /proc sample, load1 <= 2.0, Tctl <= 60; poll 15 s; cap at CLEAR_DEADLINE → SHARED).
let shared = false;
for (;;) {
  const f = foreignNow(); const l = load1(); const t = tctl(); const hot = foreignHot();
  if (f.vitest.length === 0 && f.cutechess === 0 && hot.length === 0 && l <= 2.0 && t <= 60) { log({ ev: "clear", load1: l, tctl: t, hot }); break; }
  if (Date.now() > deadlineG) { shared = true; log({ ev: "SHARED-cap", load1: l, tctl: t, hot, ...f }); break; }
  log({ ev: "wait-clear", load1: l, tctl: t, hot, ...f });
  for (const pid of f.vitest) while (alive(pid) && Date.now() <= deadlineG) sleepSync(5_000);
  if (f.vitest.length === 0) sleepSync(15_000);
}
log({ ev: "start", shared, probe: PROBE, boards: BOARDS, count: COUNT, cap: CAP, fcMax: FC_MAX, load1: load1(), tctl: tctl(), ...foreignNow() });
const st = Object.fromEntries(BOARDS.map((b) => [b, { admitted: 0, attempts: 0, status: "open" }]));
const t0 = Date.now();
for (let round = 1; round <= COUNT; round++) {
  for (const board of BOARDS) {
    const s = st[board];
    if (s.status !== "open") continue;
    while (s.attempts < CAP) {
      const order = s.admitted % 2 === 0 ? ["B", "H"] : ["H", "B"]; // V2 item 2
      gate(`${round}/${board}`);
      s.attempts++;
      const pair = order.map((b) => run(b, board));
      const f = foreignNow();
      const why = [];
      if (f.vitest.length) why.push(`vitest:${f.vitest.join("+")}`);
      if (f.cutechess) why.push(`cutechess:${f.cutechess}`);
      for (const x of pair) {
        if (!(x.foreignCoresExact <= FC_MAX)) why.push(`fc-${x.build}:${x.foreignCores}`);
        if (!(x.tctlAfter < TCTL_MAX)) why.push(`tctl-${x.build}:${x.tctlAfter}`);
      }
      const admitted = why.length === 0;
      if (admitted) s.admitted++;
      const [b, h] = order[0] === "B" ? pair : [pair[1], pair[0]];
      log({ ev: "pair", round, board, attempt: s.attempts, order: order.join(""), admitted, admittedIndex: admitted ? s.admitted : null,
        why, sharedAfterCap, B: b, H: h });
      // (v1) values, unchanged: a different move or score at equal completed depth is a defect → STOP, no grade.
      if (b.depth === h.depth && (b.move !== h.move || b.score !== h.score)) { log({ ev: "STOP-identity", round, board, attempt: s.attempts }); process.exit(4); }
      if (admitted) break;
    }
    if (s.admitted >= COUNT) s.status = "done";
    else if (s.attempts >= CAP && s.admitted < round) { s.status = "VOID-LOAD"; log({ ev: "VOID-LOAD", board, admitted: s.admitted, attempts: s.attempts }); }
  }
}
log({ ev: "done", boards: st, scheduleS: (Date.now() - t0) / 1000, waitS, load1: load1(), tctl: tctl(), ...foreignNow() });
