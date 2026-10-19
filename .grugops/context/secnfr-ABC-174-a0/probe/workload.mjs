// ABC-174 A0 re-take workload (Security/NFR, subtask secnfr-ABC-174-a0), copied from secnfr-ABC-146-a0's
// workload.mjs. Pre-registered; do not edit after the pre-registration commit. The workload of the 4.35x
// reading (ticket-to-pr-ABC-085 note ...70684a78, RUN.txt item 4): chooseMove(start position, budget
// 4 000 ms, virtualClock(120)). Imported from src/ by BOTH runners, so both run the same production code.
// One call per process, no warm-up call. The graded wall is performance.now() around that one call and
// nothing else. The one addition over ABC-146's copy: heapLimitMiB (v8 heap_size_limit), read AFTER the
// graded call, so each record shows which heap ceiling its arm ran under (ABC-173's cap on the vitest arm).
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { getHeapStatistics } from "node:v8";
import { chooseMove } from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
import { virtualClock } from "../../../../src/virtual-clock.ts";

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
export const BUDGET_MS = 4000;
export const STEP_MS = 120;

export function runWorkload() {
  const position = parseFen(START_FEN);
  const now = virtualClock(STEP_MS);
  const t0 = performance.now();
  const choice = chooseMove(position, { budgetMs: BUDGET_MS, now });
  const t1 = performance.now();
  if (choice === null) throw new Error("A0 workload: chooseMove returned null on the start position");
  const facts = {
    from: choice.move.from,
    to: choice.move.to,
    promotion: choice.move.promotion ?? null,
    score: choice.score,
    depth: choice.depth,
    nodes: choice.nodes,
    elapsedVirtualMs: choice.elapsedMs,
  };
  const digest = createHash("sha256").update(JSON.stringify(facts)).digest("hex").slice(0, 16);
  const heapLimitMiB = getHeapStatistics().heap_size_limit / (1024 * 1024);
  return { ...facts, digest, callWallMs: t1 - t0, heapLimitMiB };
}
