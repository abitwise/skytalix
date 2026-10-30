// usage: node queue.mjs <queueRoot> claim|done <task>
import { readFileSync, renameSync, rmdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const ip = JSON.parse(readFileSync(join(homedir(), ".claude/plugins/installed_plugins.json"), "utf8"));
const plugin = process.env.GRUGOPS_PLUGIN || ip.plugins["grugops@grugops"][0].installPath;
const m = await import(join(plugin, "scripts/claim.js"));
const [q, op, task] = process.argv.slice(2);
if (op === "claim") {
  const ok = m.claimTask(q, task, `qe-e2e (claude-opus-5-5, ${task})`);
  console.log("claim", ok);
  if (ok) m.transition(q, task, "pending", "claimed");
} else if (op === "done") {
  m.transition(q, task, "claimed", "done");
  renameSync(join(q, "claimed", task, "claim.md"), join(q, "done", `${task}.claim.md`));
  rmdirSync(join(q, "claimed", task));
  console.log("done");
}
