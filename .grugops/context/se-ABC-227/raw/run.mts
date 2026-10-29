// ABC-227: one fresh-process run of chooseMove at 3 000 ms on one fixed board.
// Usage: node [--cpu-prof ...] run.mts <board> <cpu|heap> <outDir> <runIndex>
// Measurement only: imports the repository's src read-only, changes nothing.
import { writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { Session } from "node:inspector";
import { getHeapStatistics } from "node:v8";
import { chooseMove } from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
import { toFen } from "../../../../src/fen.ts";

const BOARDS: Record<string, string> = {
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const BUDGET_MS = 3_000; // level 5 (src/levels.ts), DEFAULT_BUDGET_MS

const [board, mode, outDir, runIndex] = process.argv.slice(2);
const fen = BOARDS[board];
if (!fen || (mode !== "cpu" && mode !== "heap") || !outDir || !runIndex) {
  console.error("usage: run.mts <start|kiwipete|position-6> <cpu|heap> <outDir> <runIndex>");
  process.exit(2);
}

function post<T>(session: Session, method: string, params?: object): T {
  let out: T | undefined;
  let err: Error | null = null;
  session.post(method, params ?? {}, (e, r) => {
    err = e;
    out = r as T;
  });
  if (err) throw err;
  return out as T;
}

const position = parseFen(fen);
const load1 = loadavg()[0];
let session: Session | null = null;
if (mode === "heap") {
  session = new Session();
  session.connect();
  // Every allocation is sampled, not only the survivors: the allocation reading needs the garbage too.
  post(session, "HeapProfiler.startSampling", {
    samplingInterval: 8192,
    includeObjectsCollectedByMajorGC: true,
    includeObjectsCollectedByMinorGC: true,
  });
}
const allocBefore = getHeapStatistics().total_allocated_bytes;
const t0 = process.hrtime.bigint();
const choice = chooseMove(position, { budgetMs: BUDGET_MS });
const t1 = process.hrtime.bigint();
const allocAfter = getHeapStatistics().total_allocated_bytes;
if (session) {
  const { profile } = post<{ profile: unknown }>(session, "HeapProfiler.stopSampling");
  writeFileSync(`${outDir}/${board}-heap-${runIndex}.heapprofile`, JSON.stringify(profile));
  session.disconnect();
}
if (!choice) throw new Error("no legal move");
if (toFen(position) !== fen) throw new Error("position changed");

const result = {
  board,
  mode,
  run: Number(runIndex),
  fen,
  budgetMs: BUDGET_MS,
  node: process.version,
  load1,
  move: { from: choice.move.from, to: choice.move.to },
  score: choice.score,
  depth: choice.depth,
  nodes: choice.nodes,
  elapsedMs: choice.elapsedMs,
  nps: Math.round((choice.nodes / choice.elapsedMs) * 1000),
  allocatedBytes: allocAfter - allocBefore,
  bytesPerNode: (allocAfter - allocBefore) / choice.nodes,
  // CLOCK_MONOTONIC microseconds: the same base as the .cpuprofile timestamps, for windowing.
  t0us: Number(t0 / 1000n),
  t1us: Number(t1 / 1000n),
};
writeFileSync(`${outDir}/${board}-${mode}-${runIndex}.json`, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ board, mode, run: result.run, depth: result.depth, nodes: result.nodes, nps: result.nps, bytesPerNode: Math.round(result.bytesPerNode), load1 }));
