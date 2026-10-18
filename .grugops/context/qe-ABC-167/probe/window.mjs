import { execSync } from "node:child_process";
import os from "node:os";
const secs = Number(process.argv[2] ?? 180);
const t0 = Date.now(); let polls = 0; const foreign = []; const loads = [];
const check = () => {
  const out = execSync('ps -axo command | grep -E "vitest|oeselg-labs/platform" | grep -v grep || true', { encoding: "utf8" }).trim();
  const lines = out ? out.split("\n").filter((l) => !l.includes("qe167-")) : [];
  polls++; loads.push(os.loadavg()[0]);
  if (lines.length) foreign.push({ at: ((Date.now() - t0) / 1000).toFixed(0), lines });
};
check();
const iv = setInterval(() => {
  check();
  if (Date.now() - t0 >= secs * 1000) {
    clearInterval(iv);
    console.log(JSON.stringify({ host: os.hostname(), start: new Date(t0).toISOString(), secs, polls, foreignCount: foreign.length, firstForeign: foreign.slice(0, 3), load1: { first: loads[0].toFixed(2), min: Math.min(...loads).toFixed(2), max: Math.max(...loads).toFixed(2), last: loads.at(-1).toFixed(2) } }, null, 1));
    process.exit(foreign.length ? 1 : 0);
  }
}, 1000);
