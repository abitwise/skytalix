// qe-ABC-174 quiet-window check (copy of qe-ABC-173/probe/window.mjs; two changes: its own-line exclusion names this file, and the summary lists every distinct foreign line seen), foreground: 1 s polls for `secs` seconds (copy of qe2-ABC-167/probe/window.mjs,
// widened: "foreign" also counts any process of another grugops hop of this project (uat-harness, a wt-* tree,
// a probe under .grugops/context), this script's own line excluded).
import { execSync } from "node:child_process";
import os from "node:os";
const secs = Number(process.argv[2] ?? 180);
const t0 = Date.now(); let polls = 0; const foreign = []; const loads = []; const kinds = {}; const distinct = new Set();
const RX = /vitest|oeselg-labs\/platform|uat-harness|grugops-examples\/wt-|\.grugops\/context\/[^ ]*\/probe\//;
const check = () => {
  const out = execSync("ps -axo pid,command", { encoding: "utf8" }).trim().split("\n").slice(1);
  const lines = out.filter((l) => RX.test(l) && !l.includes("qe-ABC-177/probe/window.mjs") && !l.includes(" ps -axo"));
  polls++; loads.push(os.loadavg()[0]);
  for (const l of lines) { distinct.add(l.replace(/^ *[0-9]+ /, "").replace(/^.*shell-snapshots[^ ]* [^&]*&& /, "").slice(-400)); const k = l.includes("oeselg-labs/platform") ? "platform" : /vitest/.test(l) ? "vitest" : "hop"; kinds[k] = (kinds[k] ?? 0) + 1; }
  if (lines.length) foreign.push({ at: ((Date.now() - t0) / 1000).toFixed(0), lines: lines.map((x) => x.slice(0, 160)) });
};
check();
const iv = setInterval(() => {
  check();
  if (Date.now() - t0 >= secs * 1000) {
    clearInterval(iv);
    console.log(JSON.stringify({ host: os.hostname(), start: new Date(t0).toISOString(), secs, polls, foreignPolls: foreign.length, kinds, firstForeign: foreign.slice(0, 1), lastForeign: foreign.at(-1), distinct: [...distinct], load1: { first: loads[0].toFixed(2), min: Math.min(...loads).toFixed(2), max: Math.max(...loads).toFixed(2), last: loads.at(-1).toFixed(2) } }, null, 1));
    process.exit(foreign.length ? 1 : 0);
  }
}, 1000);
