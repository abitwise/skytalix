// Seal one note through the grugops plugin's propose_note handler (handleProposeNote ->
// context-io admitAndAppend). The plugin dir is resolved at run time: $GRUGOPS_PLUGIN_DIR, else
// installPath of grugops@grugops in ~/.claude/plugins/installed_plugins.json. No path is hard-coded.
// usage: node propose.mjs <repo-root> <args.json> <body.md>
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const [repo, argsPath, bodyPath] = process.argv.slice(2);
process.env.CLAUDE_PROJECT_DIR = repo;
const plugin =
  process.env.GRUGOPS_PLUGIN_DIR ||
  JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8")).plugins[
    "grugops@grugops"
  ][0].installPath;
const { handleProposeNote } = await import(join(plugin, "scripts/admission-server.js"));
const args = JSON.parse(readFileSync(argsPath, "utf8"));
args.body = readFileSync(bodyPath, "utf8");
const r = handleProposeNote(args);
console.log(r.content.map((c) => c.text).join("\n"));
process.exit(r.isError ? 1 : 0);
