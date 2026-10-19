// heap-guard.js — refuses a vitest run whose V8 heap limit is above the row for the run's shape.
//
// `ABC-173`, ruled by `memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md`
// § ADDENDUM 2026-10-19 (accepted by the owner, Olger Oeselg, 2026-10-19). The owner's word:
// "vitest needs to be capped to max 2 cpu cores and 2GB of memory". 2 GB is read as
// Σ `heap_size_limit` <= 2048 MiB over every Node isolate a lane has live at once.
//
// THE LIMIT IS NOT SET HERE. It is set on the lane command, `NODE_OPTIONS=--max-old-space-size=<flag>`
// (`package.json` `test` / `test:watch`, and every vitest line in `AGENTS.md`). vitest 4.1.11 gives a
// worker no `resourceLimits`, and Node refuses a heap flag in a Worker's `execArgv`, so the main
// process and its workers always share the one process-wide value (addendum V1). This file only
// CHECKS it, in the vitest main process, where `globalSetup` runs (addendum V4):
//   - it reads `heap_size_limit` in the main process (`ABC-173` `A5`);
//   - it picks the row by the run's file count: exactly 1 file is ONE-FILE, 2 or more is SUITE;
//   - above the row it throws: vitest exits 1 and no test runs. A command typed without its prefix
//     (Node's own default here is 4192 MiB) is refused loudly. It never runs uncapped;
//   - it hands the row to the workers as `inject("heapRowMiB")`, so the worker (`A4`) and child
//     (`A6`) probes compare against the row this run was admitted under, never a re-derived one.
//
// THE TWO ROWS (addendum Ruling 2; MiB of `heap_size_limit`, the value read, not the flag; on node
// v26.11.1 the limit is flag + 96):
//   SUITE     flag 128 -> 224 MiB x 9 live (wrapper, main, 2 running workers, 2 terminating
//             workers, 3 Node children) = 2016 MiB
//   ONE-FILE  flag 400 -> 496 MiB x 4 live (main, 1 worker, 2 Node children) = 1984 MiB
// Change a row and its flag TOGETHER, here. `src/cli.test.ts`'s `ABC-173` `A3` row reads `FLAGS_MIB`
// from this file and checks every `AGENTS.md` vitest line against it.
//
// NOTHING ELSE. No re-exec, no environment write, no side effect at import: `vitest.config.ts` names
// this file as a path string, so the `ABC-144` `A7` / `ABC-152` `V3` import of the config loads nothing.
// `RISK-ABC173-STATE`: `project.vitest.state.getPaths()` is a public getter, not documented as stable.
// When it is missing or reads 0 files this throws, because a guard must never pass by being unable to
// look.

import v8 from "node:v8";
import { isMainThread } from "node:worker_threads";

export const ROWS_MIB = Object.freeze({ suite: 224, oneFile: 496 });
export const FLAGS_MIB = Object.freeze({ suite: 128, oneFile: 400 });

const MIB = 1024 * 1024;

// `admit` is the whole decision (shape, row, comparison, provide), with the heap statistics passed
// in, so `src/cli.test.ts`'s `ABC-173` `A5` rows can call it in a worker with fake file counts and
// fake limits (`QE-173-a`). `setup` adds only the main-thread check and the real reading.
export function admit(project, heapStatistics) {
  const getPaths = project?.vitest?.state?.getPaths;
  if (typeof getPaths !== "function") throw new Error("heap-guard: project.vitest.state.getPaths() is gone; re-read RISK-ABC173-STATE");
  const files = getPaths.call(project.vitest.state).length;
  if (!Number.isInteger(files) || files < 1) throw new Error(`heap-guard: the run resolved ${files} test files; the shape cannot be read`);

  const shape = files === 1 ? "oneFile" : "suite";
  const row = ROWS_MIB[shape];
  const flag = FLAGS_MIB[shape];
  const limitMiB = heapStatistics.heap_size_limit / MIB;
  if (limitMiB > row) {
    throw new Error(
      `heap-guard: refused. This run's V8 heap_size_limit is ${limitMiB} MiB, above the ${shape === "suite" ? "SUITE" : "ONE-FILE"} row of ${row} MiB ` +
        `(${files} test file${files === 1 ? "" : "s"}; ABC-173, ADR-0008 addendum 2026-10-19). ` +
        `Prefix the command with NODE_OPTIONS=--max-old-space-size=${flag}, as AGENTS.md spells it.`,
    );
  }
  project.provide("heapRowMiB", row);
}

export default function setup(project) {
  if (!isMainThread) throw new Error("heap-guard: globalSetup ran off the main thread; it cannot read the main process's limit there");
  admit(project, v8.getHeapStatistics());
}
