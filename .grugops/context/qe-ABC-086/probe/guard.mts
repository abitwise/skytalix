// QE probe (qe-ABC-086, focus 2), parent: every input of guard-child.mts in its own process,
// bounded at TIMEOUT_MS (SIGTERM). A child that is killed by the bound is a search that did not
// terminate inside it — reported as HANG(>bound), never as a pass.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { INPUTS } from "./guard-child.mts";

const TIMEOUT_MS = Number(process.argv[2] ?? 20_000);
const child = fileURLToPath(new URL("./guard-child.mts", import.meta.url));
for (let i = 0; i < INPUTS.length; i++) {
  const r = spawnSync(process.execPath, [child, String(i)], {
    timeout: TIMEOUT_MS,
    killSignal: "SIGTERM",
    encoding: "utf8",
  });
  const out = r.stdout.trim().split("\n").filter(Boolean);
  const tail = r.signal ? `HANG(>${TIMEOUT_MS} ms, killed ${r.signal})` : `exit ${r.status}`;
  console.log(`${(INPUTS[i] as [string])[0]} | ${tail}`);
  for (const line of out) console.log(`    ${line}`);
  if (r.stderr.trim()) console.log(`    stderr: ${r.stderr.trim().split("\n")[0]}`);
}
