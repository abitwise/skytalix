// Calls the grugops plugin's propose_note handler in-process (the same function the MCP tool runs), which admits
// and persists through context-io.ts admitAndAppend. usage: GRUGOPS_PLUGIN_DIR=<plugin dir> CLAUDE_PROJECT_DIR=<repo> node propose.mjs <args.json> <body.md>
import { readFileSync } from "node:fs";
const { handleProposeNote } = await import(`${process.env.GRUGOPS_PLUGIN_DIR}/scripts/admission-server.js`);
const args = JSON.parse(readFileSync(process.argv[2], "utf8"));
args.body = readFileSync(process.argv[3], "utf8");
const r = handleProposeNote(args);
console.log(r.content.map((c) => c.text).join("\n"));
process.exit(r.isError ? 1 : 0);
