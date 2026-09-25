import { execFile } from "node:child_process";
import { readFileSync, appendFileSync, writeFileSync } from "node:fs";
const [jobsFile, outFile, par] = process.argv.slice(2);
const jobs = readFileSync(jobsFile, "utf8").trim().split("\n").map((l) => l.split(" "));
writeFileSync(outFile, "");
let i = 0;
async function worker() {
  while (i < jobs.length) {
    const [n, j, d, m] = jobs[i++];
    await new Promise((res) => execFile("node", ["probe.mjs", "cfg", n, j, d, m], { maxBuffer: 1e7, timeout: 1200000 }, (e, so) => {
      appendFileSync(outFile, e ? `FAIL ${n} ${j} ${d} ${m} ${e.message.split("\n")[0]}\n` : so); res();
    }));
  }
}
await Promise.all(Array.from({ length: Number(par) }, worker));
