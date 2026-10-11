// design-ABC-144 (ADR-0040): print the worker count the runner RESOLVES, not a process count.
// `ABC-144` test note 4: A2's cap is read from the resolved configuration.
//
// Run from a tree's root (its node_modules may be a symlink):
//   node <path>/resolved-workers.mjs
// Prints one JSON line. Times nothing and runs no test.
//
// The precedence is vitest 3.2.7's `createThreadsPool`, read from the installed source
// (node_modules/vitest/dist/chunks/coverage.DfSpMS-b.js:2745-2765, :3586-3591, :3719-3727):
//   fileParallelism === false               -> 1
//   else poolOptions.threads.maxThreads     (the env VITEST_MAX_THREADS lands here)
//   else maxWorkers
//   else availableParallelism() - 1         (7 on the reference M3)
// If vitest is upgraded, re-read that source before trusting this line.
import os from "node:os";
import { resolveConfig } from "vitest/node";

const { vitestConfig: c } = await resolveConfig({ run: true, watch: false });
const threads = c.poolOptions?.threads ?? {};
const fallback = Math.max((os.availableParallelism?.() ?? os.cpus().length) - 1, 1);
const effective =
  c.fileParallelism === false ? 1 : (threads.maxThreads ?? c.maxWorkers ?? fallback);
console.log(
  JSON.stringify({
    cwd: process.cwd(),
    pool: c.pool,
    maxWorkers: c.maxWorkers ?? null,
    minWorkers: c.minWorkers ?? null,
    threadsMaxThreads: threads.maxThreads ?? null,
    isolate: c.isolate ?? null,
    threadsIsolate: threads.isolate ?? null,
    fileParallelism: c.fileParallelism,
    envMaxThreads: process.env.VITEST_MAX_THREADS ?? null,
    effectiveWorkers: effective,
  }),
);
