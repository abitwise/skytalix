// qe-qehop-growth: the pre-window settle, a Linux port of secnfr-ABC-152-window/probe/gate.sh (sha256 5335905a...352b6f) as
// qe-ABC-154 ran it (`settle "" 1 45`): pass on STREAK consecutive 15 s samples that are each ok; every sample logged.
// ok = Tctl <= 60.0 C (stands in for macOS thermalpressurelevel 0; 60 C is the practised wait-clear figure of qe-ABC-229)
//      AND no vitest process (NOFOREIGN 1) AND no cutechess-cli (added: the heavy foreign load on this host).
// load1 is LOGGED, NOT gated (MAXLOAD "" as qe-ABC-154). A foreign vitest is never signalled: it is logged by pid, cwd and
// command, and the gate simply does not pass while it lives. Exit 0 = pass, 3 = timeout after GMAX minutes.
// usage: node gate-qeg.mjs <outDir> <label> [streak=4] [gmaxMin=45]
import { appendFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cutechessCount, foreignVitest, load1, sleepSync, tctl, ts } from "./host-qeg.mjs";

const [D, L, ST, GM] = process.argv.slice(2);
const STREAK = Number(ST ?? 4), GMAX = Number(GM ?? 45), O = join(D, "gate.tsv");
if (!existsSync(O)) writeFileSync(O, "label\tutc\tload1\ttctl\tvitest\tcutechess\tok\tstreak\tforeign_cmds\n");
const end = Date.now() + GMAX * 60_000;
let streak = 0;
for (;;) {
  const l = load1(), t = tctl(), fv = foreignVitest(""), c = cutechessCount();
  const ok = t <= 60.0 && fv.length === 0 && c === 0;
  streak = ok ? streak + 1 : 0;
  const fc = fv.map((p) => `${p.pid}:${p.cwd}:${p.cmd.slice(0, 120)}`).join(" | ");
  appendFileSync(O, `${L}\t${ts()}\t${l.toFixed(2)}\t${t.toFixed(1)}\t${fv.length}\t${c}\t${ok ? 1 : 0}\t${streak}\t${fc}\n`);
  if (streak >= STREAK) process.exit(0);
  if (Date.now() >= end) process.exit(3);
  sleepSync(15_000);
}
