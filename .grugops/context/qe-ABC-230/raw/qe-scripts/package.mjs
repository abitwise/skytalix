// qe-ABC-230: copy small records into the context's raw/ through redact.mjs. usage: node package.mjs <worktree> <scratch> <list.json>
// list.json: [[srcRelToScratch, dstRelToRaw], ...]
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const [wt, scr, listPath] = process.argv.slice(2);
const raw = join(wt, ".grugops/context/qe-ABC-230/raw");
let bad = 0;
for (const [src, dst] of JSON.parse(readFileSync(listPath, "utf8"))) {
  mkdirSync(dirname(join(raw, dst)), { recursive: true });
  try {
    execFileSync(process.execPath, [join(scr, "scripts/redact.mjs"), join(scr, src), join(raw, dst), wt, scr], { stdio: "inherit" });
    console.log(`ok ${dst}`);
  } catch {
    bad++;
  }
}
process.exit(bad ? 2 : 0);
