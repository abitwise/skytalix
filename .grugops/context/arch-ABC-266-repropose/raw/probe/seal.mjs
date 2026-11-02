// Seal arch-ABC-266-repropose notes via context-io admitAndAppend (plugin resolved at run time). `at` from AT (date -u).
// usage: AT=$(date -u +%Y-%m-%dT%H:%M:%SZ) node seal.mjs <contextRoot> <task> <spec.json>
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
const [contextRoot, task, specPath] = process.argv.slice(2);
if (specPath === undefined || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(process.env.AT ?? "")) throw new Error("usage");
if (!resolve(contextRoot).endsWith("/arch-ABC-266-repropose/.grugops/context")) throw new Error(`contextRoot ${contextRoot}`);
const plugin = JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins["grugops@grugops"][0].installPath;
const cio = await import(join(plugin, "scripts/context-io.js"));
const spec = JSON.parse(readFileSync(specPath, "utf8"));
for (const n of spec.notes) {
  const note = { kind: n.kind, by: "architect-design", at: process.env.AT, verified_by: "", confidence: n.confidence, refs: n.refs ?? spec.refs, supersedes: null };
  const body = readFileSync(resolve(dirname(specPath), n.bodyFile), "utf8");
  const r = cio.admitAndAppend(task, note, body, resolve(contextRoot));
  console.log(n.kind, JSON.stringify(r));
  if (!r.id) process.exit(1);
}
if (cio.render) cio.render(task, resolve(contextRoot));
const back = cio.readContext(task, resolve(contextRoot));
console.log(`read back ${back.length}:`, back.map((b) => `${b.id} ${b.kind}`).join(" | "));
