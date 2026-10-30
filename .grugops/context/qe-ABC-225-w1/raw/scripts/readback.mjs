// usage: node readback.mjs <repo-root> <task> — readContext through the plugin (path resolved at run time).
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
const [repo, task] = process.argv.slice(2);
const plugin =
  process.env.GRUGOPS_PLUGIN_DIR ||
  JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins[
    "grugops@grugops"
  ][0].installPath;
const { readContext } = await import(join(plugin, "scripts/context-io.js"));
for (const n of readContext(task, join(repo, ".grugops/context"))) console.log(n.id, n.kind, n.at, n.seal ? "sealed" : JSON.stringify(Object.keys(n)));
