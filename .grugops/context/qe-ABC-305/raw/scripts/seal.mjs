// Seal qe-ABC-305's notes with the sanctioned writer. Usage: node seal.mjs <contextRoot> <task> <kind> <confidence> <refs.json> <body> <at>
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
const [contextRoot, task, kind, confidence, refsPath, bodyPath, at] = process.argv.slice(2);
if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(at ?? "")) throw new Error("at must come from date -u");
const plugin = JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins["grugops@grugops"][0].installPath;
const cio = await import(join(plugin, "scripts/context-io.js"));
const note = { kind, by: "qe-e2e", at, verified_by: "", confidence, refs: JSON.parse(readFileSync(refsPath, "utf8")), supersedes: null };
const r = cio.admitAndAppend(task, note, readFileSync(bodyPath, "utf8"), resolve(contextRoot));
console.log(kind, JSON.stringify(r));
if (!r.id) process.exit(1);
if (cio.render) cio.render(task, resolve(contextRoot));
