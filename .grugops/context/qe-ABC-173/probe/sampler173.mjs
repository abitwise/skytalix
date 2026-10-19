// qe-ABC-173 sampler (the columns of qe2-ABC-101/probe/window-n8.sh's sampler, written in node): every 5 s until <dir>/STOP.
// foreign_runner = vitest processes whose cwd is NOT under this hop's arms, plus any process of another grugops hop
// (uat-harness, a grugops-examples/wt-* tree, a .grugops/context/*/probe script). platform = oeselg-labs/platform processes.
import { execSync } from "node:child_process";
import { appendFileSync, existsSync, writeFileSync } from "node:fs";
const D = process.argv[2];
const ARMS = process.argv[3];
const sh = (c) => { try { return execSync(c, { encoding: "utf8" }).trim(); } catch { return ""; } };
writeFileSync(`${D}/sampler.tsv`, "utc\tload1\tthermal\tpower\tforeign_runner\tplatform\tforeign_cmds\n");
const tick = () => {
  const ps = sh("ps -axo pid=,command=").split("\n").map((l) => l.trim()).filter(Boolean);
  const foreign = [];
  let platform = 0;
  for (const l of ps) {
    const pid = l.split(" ")[0];
    const cmd = l.slice(pid.length + 1);
    if (cmd.includes("sampler173.mjs") || cmd.startsWith("ps -axo")) continue;
    if (/oeselg-labs\/platform/.test(cmd)) { platform++; continue; }
    if (/uat-harness|grugops-examples\/wt-|\.grugops\/context\/[^ ]*\/probe\//.test(cmd)) { foreign.push(cmd.slice(0, 80)); continue; }
    if (/vitest/.test(cmd)) {
      const cwd = sh(`lsof -a -p ${pid} -d cwd -Fn | sed -n 's/^n//p'`);
      if (!cwd.startsWith(ARMS)) foreign.push(`${cmd.slice(0, 60)} @${cwd}`);
    }
  }
  const load1 = sh("sysctl -n vm.loadavg").replace(/[{}]/g, "").trim().split(/\s+/)[0];
  const therm = sh("notifyutil -g com.apple.system.thermalpressurelevel").split(/\s+/)[1] ?? "unknown";
  const power = sh("pmset -g batt").match(/'([^']+)'/)?.[1] ?? "unknown";
  appendFileSync(`${D}/sampler.tsv`, `${new Date().toISOString().replace(/\.\d+Z$/, "Z")}\t${load1}\t${therm}\t${power}\t${foreign.length}\t${platform}\t${foreign.join(" | ").replace(/\t/g, " ")}\n`);
};
tick();
const iv = setInterval(() => { if (existsSync(`${D}/STOP`)) { clearInterval(iv); return; } tick(); }, 5000);
