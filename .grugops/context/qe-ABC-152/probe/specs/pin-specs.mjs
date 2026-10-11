// QE ABC-152 V3 / V6 pin plants. Each runs `vitest run src/cli.test.ts -t "ABC-144 A7|ABC-152 V3"` on the work copy.
const C = "vitest.config.ts";
const T = { tests: ["src/cli.test.ts"], t: "ABC-144 A7|ABC-152 V3" };
const cfg = (id, find, replace, expect, why) => ({ id, ...T, edits: [{ file: C, find, replace }], expect, why });
const env = (id, value, expect, why) => ({ id, ...T, env: { VITEST_MAX_WORKERS: value }, expect, why });

export default [
  { id: "pin-control", ...T, expect: "green", why: "no plant" },
  // the ticket's 11 reds
  cfg("pin-r1-del-maxWorkers", "    maxWorkers: 2,\n", "", "red", "r1"),
  cfg("pin-r2-isolate-false", "    maxWorkers: 2,\n", "    maxWorkers: 2,\n    isolate: false,\n", "red", "r2"),
  env("pin-r3-env-8", "8", "red", "r3"),
  env("pin-r3b-env-3", "3", "red", "r3b"),
  cfg("pin-r4-projects", "    maxWorkers: 2,\n", "    maxWorkers: 2,\n    projects: [{ test: { name: \"qe\", maxWorkers: 6 } }],\n", "red", "r4"),
  cfg("pin-maxWorkers-3", "    maxWorkers: 2,\n", "    maxWorkers: 3,\n", "red", "raise"),
  cfg("pin-fileParallelism-false", "    maxWorkers: 2,\n", "    maxWorkers: 2,\n    fileParallelism: false,\n", "red", "fp"),
  cfg("pin-poolOptions", "    maxWorkers: 2,\n", "    maxWorkers: 2,\n    poolOptions: { forks: { singleFork: true } },\n", "red", "poolOptions entry (QE's own entry: forks.singleFork)"),
  env("pin-env-0x3", "0x3", "red", "QE-151-a fold"),
  env("pin-env-0", "0", "red", "0 falls back to cpus-1"),
  env("pin-env-abc", "abc", "red", "NaN falls back to cpus-1"),
  // V3's 2
  cfg("v3-key-deleted", "    experimental: { viteModuleRunner: false },\n", "", "red", "V3 delete"),
  cfg("v3-key-true", "    experimental: { viteModuleRunner: false },\n", "    experimental: { viteModuleRunner: true },\n", "red", "V3 true"),
  // the 3 greens
  env("pin-env-empty", "", "green", "QE-151-b fold"),
  env("pin-env-1", "1", "green", "lowering"),
  env("pin-env-2", "2", "green", "equal"),
  // QE extras
  cfg("qx-v3-key-zero", "    experimental: { viteModuleRunner: false },\n", "    experimental: { viteModuleRunner: 0 as unknown as false },\n", "red", "falsy non-false"),
  cfg("qx-v3-experimental-empty", "    experimental: { viteModuleRunner: false },\n", "    experimental: {},\n", "red", "experimental present, key absent"),
  cfg("qx-maxWorkers-string-2", "    maxWorkers: 2,\n", "    maxWorkers: \"2\" as unknown as number,\n", "red", "string 2"),
  cfg("qx-maxWorkers-50pct", "    maxWorkers: 2,\n", "    maxWorkers: \"50%\",\n", "red", "percentage"),
  cfg("qx-projects-empty", "    maxWorkers: 2,\n", "    maxWorkers: 2,\n    projects: [],\n", "red", "empty projects array"),
  cfg("qx-poolOptions-undefined", "    maxWorkers: 2,\n", "    maxWorkers: 2,\n    poolOptions: undefined,\n", "red", "own key, value undefined"),
  cfg("qx-isolate-true-explicit", "    maxWorkers: 2,\n", "    maxWorkers: 2,\n    isolate: true,\n", "green", "explicit isolate true is the same ruling"),
  env("qx-env-space3", " 3", "red", "leading space"),
  env("qx-env-3abc", "3abc", "red", "trailing junk"),
  env("qx-env-0x2", "0x2", "green", "hex 2 is 2 to both parsers"),
  env("qx-env-2.9", "2.9", "green", "parseInt 2 to both parsers"),
  env("qx-env-1e9", "1e9", "green", "parseInt 1 to both parsers"),
  env("qx-env-neg1", "-1", "red", "RISK-ABC152-NEGWORKERS: the pin cannot see it if nothing runs"),
  { id: "qx-env-threads-8", ...T, env: { VITEST_MAX_THREADS: "8", VITEST_MAX_FORKS: "8" }, expect: "green", why: "3.x names are read by nothing on 4.1 (check eff with the resolver)" },
];
