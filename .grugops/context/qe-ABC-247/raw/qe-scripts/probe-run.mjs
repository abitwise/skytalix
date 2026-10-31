// qe-ABC-247 A2: run one cutechess-cli argv (argv.json) with stdout+stderr -> log.txt; sample Tctl every 10 s to
// thermal.log; THERMAL STOP (median of the last 30 samples > 85 C) sends SIGTERM to cutechess-cli. Writes exit.txt.
// usage: node probe-run.mjs <runDir>
import { spawn } from "node:child_process";
import { appendFileSync, openSync, readFileSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";
import { tctl } from "./host.mjs";
const runDir = process.argv[2];
const argv = JSON.parse(readFileSync(join(runDir, "argv.json"), "utf8"));
const fd = openSync(join(runDir, "log.txt"), "w");
const t0 = Date.now();
const child = spawn(argv[0], argv.slice(1), { stdio: ["ignore", fd, fd] });
writeFileSync(join(runDir, "pid.txt"), `${child.pid}\n`);
const samples = [];
let stopped = false;
const tick = setInterval(() => {
  const t = tctl(); samples.push(t);
  const last = samples.slice(-30).sort((a, b) => a - b); const med = last[Math.floor(last.length / 2)];
  appendFileSync(join(runDir, "thermal.log"), `${new Date().toISOString()} tctl=${t.toFixed(1)} med30=${med.toFixed(1)} load1=${loadavg()[0].toFixed(2)}\n`);
  if (samples.length >= 3 && med > 85 && !stopped) { stopped = true; appendFileSync(join(runDir, "thermal.log"), "THERMAL STOP\n"); child.kill("SIGTERM"); }
}, 10_000);
child.on("exit", (code, sig) => {
  clearInterval(tick);
  const s = [...samples].sort((a, b) => a - b);
  writeFileSync(join(runDir, "exit.txt"), `exit=${code} signal=${sig} wall_s=${((Date.now() - t0) / 1000).toFixed(0)} thermal_stop=${stopped} tctl_samples=${s.length} median=${(s[Math.floor(s.length / 2)] ?? NaN).toFixed(1)} max=${(s.at(-1) ?? NaN).toFixed(1)}\n`);
});
