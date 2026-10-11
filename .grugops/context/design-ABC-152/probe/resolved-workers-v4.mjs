// design-ABC-152 (D2 a): the worker count vitest 4.1.x RESOLVES. Times nothing and runs no test.
// Run from a tree's root: node <path>/resolved-workers-v4.mjs
//
// Precedence, read from vitest 4.1.11's installed source:
//   resolveConfig (chunks/coverage.*.js): config/CLI maxWorkers -> if fileParallelism === false: 1
//     -> then, LAST, `if (process.env.VITEST_MAX_WORKERS) maxWorkers = parseInt(VITEST_MAX_WORKERS)`
//     (so the env var outranks the config AND fileParallelism: false). VITEST_MAX_THREADS / _FORKS are
//     read nowhere in 4.1.11. `poolOptions` only logs a deprecation and is ignored.
//   resolveMaxWorkers (chunks/cli-api.*.js): project.config.maxWorkers -> root config maxWorkers
//     -> watch ? floor(cpus/2) : cpus - 1.
import os from "node:os";
import { resolveConfig } from "vitest/node";

const { vitestConfig: c } = await resolveConfig({ run: true, watch: false });
const cpus = os.availableParallelism?.() ?? os.cpus().length;
const effective = c.maxWorkers || Math.max(cpus - 1, 1);
console.log(
  JSON.stringify({
    env: {
      VITEST_MAX_WORKERS: process.env.VITEST_MAX_WORKERS ?? null,
      VITEST_MAX_THREADS: process.env.VITEST_MAX_THREADS ?? null,
      VITEST_MAX_FORKS: process.env.VITEST_MAX_FORKS ?? null,
    },
    pool: c.pool,
    maxWorkers: c.maxWorkers ?? null,
    isolate: c.isolate ?? null,
    fileParallelism: c.fileParallelism ?? null,
    projects: c.projects ?? null,
    viteModuleRunner: c.experimental?.viteModuleRunner ?? null,
    nodeLoader: c.experimental?.nodeLoader ?? null,
    poolOptionsPresent: "poolOptions" in c,
    effectiveWorkers: effective,
  }),
);
