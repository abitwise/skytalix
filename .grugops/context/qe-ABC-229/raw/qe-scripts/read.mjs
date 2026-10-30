// readContext for a task (sanctioned reader). usage: node read.mjs <contextRoot> <task>
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
const [root, task] = process.argv.slice(2);
const plugin = JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins["grugops@grugops"][0].installPath;
const cio = await import(join(plugin, "scripts/context-io.js"));
const back = cio.readContext(task, resolve(root));
console.log(`${task}: ${back.length} notes`, back.map((b) => `${b.id} ${b.kind}${b.refused ? " REFUSED " + b.refused : ""}`).join(" | "));
