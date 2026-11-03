// Seal arch-ABC-234 notes (arch-ABC-233's seal.mjs, logic unchanged) with the sanctioned writer (context-io admitAndAppend). Copied from arch-adr0056-owner-fold, logic unchanged. The plugin dir is resolved at
// run time (installPath of grugops@grugops); no host path is written here. Each `at` is taken at seal time (UTC).
// Usage: node seal.mjs <contextRoot = <worktree>/.grugops/context> <task> <spec.json>
// spec.json: { refs: [...], notes: [{ kind, confidence, bodyFile, refs? }] }  (bodyFile relative to spec.json)
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

const [contextRoot, task, specPath] = process.argv.slice(2);
if (specPath === undefined) throw new Error("usage: node seal.mjs <contextRoot> <task> <spec.json>");
const plugin = JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins[
  "grugops@grugops"
][0].installPath;
const cio = await import(join(plugin, "scripts/context-io.js"));
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const at = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
for (const n of spec.notes) {
  const note = {
    kind: n.kind,
    by: "architect-design",
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
