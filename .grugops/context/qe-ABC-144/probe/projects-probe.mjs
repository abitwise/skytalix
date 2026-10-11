// QE ABC-144: what isolation does each resolved project actually run with? Times nothing, runs no test.
import { createVitest } from "vitest/node";
const v = await createVitest("test", { run: true, watch: false });
for (const p of v.projects) {
  const c = p.config;
  console.log(JSON.stringify({ project: p.name || "(root)", pool: c.pool, isolate: c.isolate, threadsIsolate: c.poolOptions?.threads?.isolate ?? null, maxWorkers: c.maxWorkers ?? null }));
}
const files = await v.globTestSpecifications();
console.log("specs", files.length, "projects-in-specs", [...new Set(files.map((s) => s.project.name || "(root)"))].join(","));
await v.close();
