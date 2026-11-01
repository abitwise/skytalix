// qe-ABC-254-a4v2 pre-run logic test ONLY: a stub for probe.mjs (no search). Same CLI and output shape.
// A run is "dirty" (reported cpuS -1000 → huge foreign cores → discarded) if its board is in STUB_DIRTY_BOARDS or its
// global run number (counter file in STUB_DIR) is in STUB_DIRTY_RUNS. Otherwise cpuS 1000 (→ admitted).
// nps: 1e6 × (H ? STUB_RATIO : 1) × (1 + STUB_JIT × (run mod 3)), STUB_JIT default 0.01.
import { readFileSync, writeFileSync } from "node:fs";
const [, build, board] = process.argv.slice(2);
const f = `${process.env.STUB_DIR}/counter`; let n = 0; try { n = Number(readFileSync(f, "utf8")); } catch {}
n++; writeFileSync(f, String(n));
const dirty = (process.env.STUB_DIRTY_BOARDS ?? "").split(",").includes(board) || (process.env.STUB_DIRTY_RUNS ?? "").split(",").includes(String(n));
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150);
const nps = Math.round(1e6 * (build === "H" ? Number(process.env.STUB_RATIO ?? 1) : 1) * (1 + Number(process.env.STUB_JIT ?? 0.01) * (n % 3)));
console.log(JSON.stringify({ build, board, depth: 9, nodes: nps * 4, elapsedMs: 4000, wallMs: 4000.5, move: "a-b-0", score: 10, nps, cpuS: dirty ? -1000 : 1000, pure: true }));
