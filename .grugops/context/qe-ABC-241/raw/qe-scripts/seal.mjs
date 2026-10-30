// Seal qe-ABC-241 notes with the sanctioned writer (context-io admitAndAppend). The plugin dir is resolved at run
// time (installPath of grugops@grugops); no path is written here. Usage: node seal.mjs <contextRoot> <task> <spec.json>
// spec.json: { at, refs: [...], notes: [{ kind, confidence, bodyFile, refs? }] }
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const [contextRoot, task, specPath] = process.argv.slice(2);
const plugin = JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins[
  "grugops@grugops"
][0].installPath;
const cio = await import(join(plugin, "scripts/context-io.js"));
const spec = JSON.parse(readFileSync(specPath, "utf8"));
for (const n of spec.notes) {
  const note = {
    kind: n.kind,
    by: "qe-e2e",
    at: spec.at,
    verified_by: "",
    confidence: n.confidence,
    refs: n.refs ?? spec.refs,
    supersedes: null,
  };
  const r = cio.admitAndAppend(task, note, readFileSync(n.bodyFile, "utf8"), contextRoot);
  console.log(n.kind, JSON.stringify(r));
  if (!r.id) process.exit(1);
}
if (cio.render) cio.render(task, contextRoot);
const back = cio.readContext(task, contextRoot);
console.log(`read back ${back.length}:`, back.map((b) => `${b.id} ${b.kind}`).join(" | "));
