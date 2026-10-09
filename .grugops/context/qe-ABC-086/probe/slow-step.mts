// QE probe (qe-ABC-086, focus 2 follow-up): an accepted small step — slow or non-terminating?
// One search of kiwipete at budget 2 per step, each in its own process, bounded at argv[2] ms.
// The arithmetic: readings to the deadline = budget / step; nodes ~= 1 024 x that.
import { spawnSync } from "node:child_process";

const BOUND = Number(process.argv[2] ?? 240_000);
if (process.argv[3] !== undefined) {
  const { chooseMove } = await import("../../../../src/engine.ts");
  const { parseFen } = await import("../../../../src/fen.ts");
  const { virtualClock } = await import("../../../../src/virtual-clock.ts");
  const step = Number(process.argv[3]);
  const fen = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
  const t0 = performance.now();
  const c = chooseMove(parseFen(fen), { budgetMs: 2, now: virtualClock(step) });
  console.log(JSON.stringify({ step, depth: c?.depth, nodes: c?.nodes, readingsToDeadline: 2 / step, wallMs: Math.round(performance.now() - t0) }));
} else {
  for (const step of ["1", "0.1", "0.03", "0.01", "0.003", "0.001"]) {
    const r = spawnSync(process.execPath, [new URL(import.meta.url).pathname, String(BOUND), step], { timeout: BOUND, killSignal: "SIGTERM", encoding: "utf8" });
    console.log(r.signal ? `step ${step} | NOT TERMINATED within ${BOUND} ms (killed ${r.signal}); readings to deadline ${2 / Number(step)}` : `step ${step} | ${r.stdout.trim()}`);
  }
}
