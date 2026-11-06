// Seal qe-ABC-291's notes with the sanctioned writer (context-io admitAndAppend). The plugin dir is resolved at run time. No host path is written here.
// Usage: node seal.mjs <contextRoot> <task> <kind> <confidence> <bodyFile> <at from date -u> [ref ...]
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
const [contextRoot, task, kind, confidence, bodyFile, at, ...refs] = process.argv.slice(2);
const plugin = JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins["grugops@grugops"][0].installPath;
const cio = await import(join(plugin, "scripts/context-io.js"));
const note = { kind, by: "qe-e2e", at, verified_by: "", confidence, refs, supersedes: null };
const r = cio.admitAndAppend(task, note, readFileSync(bodyFile, "utf8"), resolve(contextRoot));
console.log(kind, JSON.stringify(r));
if (!r.id) process.exit(1);
cio.render(task, resolve(contextRoot));
console.log("read back", cio.readContext(task, resolve(contextRoot)).map((b) => `${b.id}`).join(" | "));
