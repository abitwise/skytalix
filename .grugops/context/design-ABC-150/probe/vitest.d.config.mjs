// ABC-150 D1/D2: a probe-only vitest config. The lane's vitest.config.ts is not touched. The base is
// ABC-147's probe config (pool "threads", isolate default true). CAND varies ONE thing on the vitest side:
//   base  ABC-147's probe config, unchanged
//   C1    source maps off:         test.server.sourcemap = false (no inline map is attached to any module)
//   C2    no worker thread:        test.pool = "forks" (same runner, flags and env, in a child process's
//                                  main isolate instead of a worker thread)
//   C3    no cross-module interop: the same workload imported as ONE esbuild bundle (bundle/), so src/
//                                  modules call each other by plain bindings; the bundle still goes
//                                  through the module runner, its transform and its source map
//   C4    module runner off for production code: test.server.deps.external = [repo src/*.ts, not
//                                  *.test.ts], so src/ is imported natively by Node (type stripping)
//                                  inside the same vitest worker thread
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../../../..");
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const CAND = process.env.CAND ?? "base";
const test = { pool: "threads", include: ["d.probe.test.mjs"], testTimeout: 600000 };
if (CAND === "C1") test.server = { sourcemap: false };
else if (CAND === "C2") test.pool = "forks";
else if (CAND === "C4") test.server = { deps: { external: [new RegExp(`${esc(repo)}/src/(?![^/]*\\.test\\.ts$)[^/]+\\.ts$`)] } };
else if (CAND !== "base" && CAND !== "C3") throw new Error(`unknown CAND ${CAND}`);
export default defineConfig({ root: here, test });
