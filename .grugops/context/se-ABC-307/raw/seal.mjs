// Seal se-ABC-307's notes with the sanctioned writer. Usage: node seal.mjs <contextRoot> <task> <kind> <confidence> <refs.json> <body> <at>
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
const [contextRoot, task, kind, confidence, refsPath, bodyPath, at] = process.argv.slice(2);
const plugin = JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins["grugops@grugops"][0].installPath;
const cio = await import(join(plugin, "scripts/context-io.js"));
const note = { kind, by: "software-engineer", at, verified_by: "", confidence, refs: JSON.parse(readFileSync(refsPath, "utf8")), supersedes: null };
const r = cio.admitAndAppend(task, note, readFileSync(bodyPath, "utf8"), resolve(contextRoot));
console.log(kind, JSON.stringify(r));
if (!r.id) process.exit(1);
