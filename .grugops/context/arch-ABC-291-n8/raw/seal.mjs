// Seal one arch-ABC-291-n8 note with the sanctioned writer (context-io admitAndAppend). The plugin dir is resolved at run time;
// no host path is written here. Usage: node seal.mjs <contextRoot> <task> <spec.json> <index> <at from date -u>
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

const [contextRoot, task, specPath, index, at] = process.argv.slice(2);
if (at === undefined) throw new Error("usage: node seal.mjs <contextRoot> <task> <spec.json> <index> <at>");
const plugin = JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins[
  "grugops@grugops"
][0].installPath;
const cio = await import(join(plugin, "scripts/context-io.js"));
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const n = spec.notes[Number(index)];
const note = { kind: n.kind, by: "architect-design", at, verified_by: "", confidence: n.confidence, refs: spec.refs, supersedes: null };
const body = readFileSync(resolve(dirname(specPath), n.bodyFile), "utf8");
const r = cio.admitAndAppend(task, note, body, resolve(contextRoot));
console.log(n.kind, JSON.stringify(r));
if (!r.id) process.exit(1);
if (cio.render) cio.render(task, resolve(contextRoot));
const back = cio.readContext(task, resolve(contextRoot));
console.log(`read back ${back.length}:`, back.map((b) => `${b.id} ${b.kind}`).join(" | "));
