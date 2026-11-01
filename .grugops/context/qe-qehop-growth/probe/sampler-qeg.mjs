// qe-qehop-growth: the 5 s sampler of window-qe5.sh, ported to Linux. Columns: utc, load1, Tctl, foreign_runner (vitest
// processes whose cwd is not under the arms root), platform (oeselg-labs/platform processes), cutechess, foreign_cmds.
// Stops when <outDir>/STOP exists. usage: node sampler-qeg.mjs <armsRoot> <outDir>
import { appendFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cutechessCount, foreignVitest, load1, platformCount, sleepSync, tctl, ts } from "./host-qeg.mjs";

const [ARMS, D] = process.argv.slice(2);
const O = join(D, "sampler.tsv");
writeFileSync(O, "utc\tload1\ttctl\tforeign_runner\tplatform\tcutechess\tforeign_cmds\n");
while (!existsSync(join(D, "STOP"))) {
  const fv = foreignVitest(ARMS);
  const fc = fv.map((p) => `${p.pid}:${p.cwd}:${p.cmd.slice(0, 120)}`).join(" | ");
  appendFileSync(O, `${ts()}\t${load1().toFixed(2)}\t${tctl().toFixed(1)}\t${fv.length}\t${platformCount()}\t${cutechessCount()}\t${fc}\n`);
  sleepSync(5_000);
}
