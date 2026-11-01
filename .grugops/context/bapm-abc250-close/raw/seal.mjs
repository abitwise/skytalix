// Seal bapm-abc250-close notes with the sanctioned writer (context-io admitAndAppend). The plugin dir is resolved at
// run time (installPath of grugops@grugops); no host path is written here. `at` is argv[4], taken from `date -u` by the caller.
// Usage: node seal.mjs <contextRoot = <worktree>/.grugops/context> <task> <spec.json> <at = date -u +%Y-%m-%dT%H:%M:%SZ>
// spec.json: { refs: [...], notes: [{ kind, confidence, bodyFile, refs? }] }  (bodyFile relative to spec.json)
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

const [contextRoot, task, specPath, at] = process.argv.slice(2);
if (at === undefined || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(at)) throw new Error("usage: node seal.mjs <contextRoot> <task> <spec.json> <at>");
const plugin = JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins[
  "grugops@grugops"
][0].installPath;
const cio = await import(join(plugin, "scripts/context-io.js"));
const spec = JSON.parse(readFileSync(specPath, "utf8"));
for (const n of spec.notes) {
  const note = {
    kind: n.kind,
    by: "ba-pm",
    at,
    verified_by: "",
    confidence: n.confidence,
    refs: n.refs ?? spec.refs,
    supersedes: null,
  };
  const body = readFileSync(resolve(dirname(specPath), n.bodyFile), "utf8");
  const r = cio.admitAndAppend(task, note, body, resolve(contextRoot));
  console.log(n.kind, JSON.stringify(r));
  if (!r.id) process.exit(1);
}
if (cio.render) cio.render(task, resolve(contextRoot));
const back = cio.readContext(task, resolve(contextRoot));
console.log(`read back ${back.length}:`, back.map((b) => `${b.id} ${b.kind}`).join(" | "));
