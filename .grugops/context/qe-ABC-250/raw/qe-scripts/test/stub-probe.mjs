// qe-ABC-250 pre-run logic test ONLY: a stub for probe-perft.mjs / probe.mjs (no perft, no search). Same CLI, both output shapes.
// Dirty (cpuS -1000 → huge foreign cores → discarded) if the board is in STUB_DIRTY_BOARDS or the global run number (counter
// file in STUB_DIR) is in STUB_DIRTY_RUNS. nps: 1e6 × (H ? STUB_RATIO : 1) × (1 + STUB_JIT × (run mod 3)).
// STUB_BADCOUNT=1 makes head's perft count wrong (tests the (v1) STOP).
import { readFileSync, writeFileSync } from "node:fs";
const [, build, board] = process.argv.slice(2);
const f = `${process.env.STUB_DIR}/counter`; let n = 0; try { n = Number(readFileSync(f, "utf8")); } catch {}
n++; writeFileSync(f, String(n));
const dirty = (process.env.STUB_DIRTY_BOARDS ?? "").split(",").includes(board) || (process.env.STUB_DIRTY_RUNS ?? "").split(",").includes(String(n));
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
const nps = Math.round(1e6 * (build === "H" ? Number(process.env.STUB_RATIO ?? 1) : 1) * (1 + Number(process.env.STUB_JIT ?? 0.01) * (n % 3)));
const countOk = !(process.env.STUB_BADCOUNT === "1" && build === "H");
console.log(JSON.stringify({ build, board, depth: 9, reps: 1, nodes: countOk ? 1000 : 999, countOk, firstMs: 1, firstNps: nps, steadyMs: 1000,
  elapsedMs: 4000, wallMs: 4000.5, move: "a-b-0", score: 10, nps, cpuS: dirty ? -1000 : 1000, pure: true }));
