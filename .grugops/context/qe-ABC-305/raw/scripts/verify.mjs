import { readFileSync } from "node:fs"; import { homedir } from "node:os"; import { join, resolve } from "node:path";
const plugin = JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins["grugops@grugops"][0].installPath;
const cio = await import(join(plugin, "scripts/context-io.js"));
for (const b of cio.readContext(process.argv[3], resolve(process.argv[2]))) console.log(b.id.slice(-8), b.kind, Object.keys(b).filter(k=>/seal|status/i.test(k)).map(k=>k+"="+b[k]).join(" ").slice(0,90));
