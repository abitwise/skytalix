import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
const [root, task] = process.argv.slice(2);
const plugin = JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins["grugops@grugops"][0].installPath;
const cio = await import(join(plugin, "scripts/context-io.js"));
if (cio.render) cio.render(task, resolve(root));
const back = cio.readContext(task, resolve(root));
console.log(back.length, back.map((b) => `${b.id} ${b.sealStatus ?? b.seal_status ?? ""}`).join(" | "));
