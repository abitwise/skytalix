// qe-ABC-241 (from qe-ABC-228): copy small records into the context's raw/ through redact.mjs. usage: node package.mjs <worktree> <scratch> <list.json>
// list.json: [[srcRelToScratch, dstRelToRaw], ...]
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const envArg = process.argv.slice(2).find((a) => a.startsWith("--env="));
const [wt, scr, listPath] = process.argv.slice(2).filter((a) => !a.startsWith("--env="));
const raw = join(wt, ".grugops/context/qe-ABC-241/raw");
let bad = 0;
for (const [src, dst] of JSON.parse(readFileSync(listPath, "utf8"))) {
  mkdirSync(dirname(join(raw, dst)), { recursive: true });
  try {
    execFileSync(process.execPath, [join(scr, "scripts/redact.mjs"), join(scr, src), join(raw, dst), wt, scr, ...(envArg ? [envArg] : [])], { stdio: "inherit" });
    console.log(`ok ${dst}`);
  } catch {
    bad++;
  }
}
process.exit(bad ? 2 : 0);
