// qe2-ABC-167 quiet-window check, run in the foreground: 1 s polls for `secs` seconds.
// Foreign = any process line matching vitest or oeselg-labs/platform (this script's own line excluded).
import { execSync } from "node:child_process";
import os from "node:os";
const secs = Number(process.argv[2] ?? 180);
const t0 = Date.now(); let polls = 0; const foreign = []; const loads = []; const kinds = {};
const check = () => {
  const out = execSync('ps -axo pid,command | grep -E "vitest|oeselg-labs/platform" | grep -v grep || true', { encoding: "utf8" }).trim();
  const lines = out ? out.split("\n").filter((l) => !l.includes("probe2/window.mjs")) : [];
  polls++; loads.push(os.loadavg()[0]);
  for (const l of lines) { const k = l.includes("oeselg-labs/platform") ? "platform" : "vitest"; kinds[k] = (kinds[k] ?? 0) + 1; }
  if (lines.length) foreign.push({ at: ((Date.now() - t0) / 1000).toFixed(0), lines: lines.map((x) => x.slice(0, 160)) });
};
check();
const iv = setInterval(() => {
  check();
  if (Date.now() - t0 >= secs * 1000) {
    clearInterval(iv);
    console.log(JSON.stringify({ host: os.hostname(), start: new Date(t0).toISOString(), secs, polls, foreignPolls: foreign.length, kinds, firstForeign: foreign.slice(0, 2), lastForeign: foreign.at(-1), load1: { first: loads[0].toFixed(2), min: Math.min(...loads).toFixed(2), max: Math.max(...loads).toFixed(2), last: loads.at(-1).toFixed(2) } }, null, 1));
    process.exit(foreign.length ? 1 : 0);
  }
}, 1000);
