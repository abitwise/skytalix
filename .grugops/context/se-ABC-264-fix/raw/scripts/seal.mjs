// se-ABC-264-fix (from qe-ABC-264/raw/qe-scripts): seal notes with the sanctioned writer (context-io admitAndAppend), qe-ABC-229/248's seal.mjs with `at`
// taken from the AT env var (set from `date -u +%FT%TZ` by the caller). Plugin dir resolved at run time.
// usage: AT=... node seal.mjs <contextRoot> <task> <spec.json>
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
const [contextRoot, task, specPath] = process.argv.slice(2);
const at = process.env.AT;
if (!at || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(at)) throw new Error("AT must be date -u +%FT%TZ");
const plugin = JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins["grugops@grugops"][0].installPath;
const cio = await import(join(plugin, "scripts/context-io.js"));
const spec = JSON.parse(readFileSync(specPath, "utf8"));
for (const n of spec.notes) {
  const note = { kind: n.kind, by: "software-engineer", at, verified_by: "", confidence: n.confidence, refs: n.refs ?? spec.refs, supersedes: null };
  const body = readFileSync(resolve(dirname(specPath), n.bodyFile), "utf8");
  const r = cio.admitAndAppend(task, note, body, resolve(contextRoot));
  console.log(n.kind, JSON.stringify(r));
  if (!r.id) process.exit(1);
}
if (cio.render) cio.render(task, resolve(contextRoot));
const back = cio.readContext(task, resolve(contextRoot));
console.log(`read back ${back.length}:`, back.map((b) => `${b.id} ${b.kind} ${b.seal ?? b.status ?? ""}`).join(" | "));
