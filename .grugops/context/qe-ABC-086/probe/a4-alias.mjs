// QE probe (qe-ABC-086, focus 4): is the A4 guard robust to aliasing? Each variant plants a REAL
// clock or entropy read into a scratch copy of src/virtual-clock.ts (never the worktree's), then
//   row  = the shipped `ABC-086 A4` row, actually run (vitest -t), pass = the guard MISSED it;
//   grep = the ticket's A4 grep (Math.random | Date.now | performance.now) over the variant's
//          added lines, as the "delivered src/ diff" grep would see them; 0 hits = MISSED.
//   live = the variant module imported and its clock called: did the planted read execute?
// argv: <scratch-root> <src-root>. Report only; the ticket is not widened here.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const [scratch, srcRoot] = process.argv.slice(2);
const VC = "src/virtual-clock.ts";
const TICKET_GREP = /Math\.random|Date\.now|performance\.now/;

const V = [
  ["Date.now() (control)", "", "Date.now()"],
  ["globalThis.Date.now()", "", "globalThis.Date.now()"],
  ["const n = Date.now; n()", "const n = Date.now;\n", "n()"],
  ["const { now } = Date; now()", "const { now } = Date;\n", "now()"],
  ['Date["now"]()', "", 'Date["now"]()'],
  ["new Date().getTime()", "", "new Date().getTime()"],
  ["+new Date()", "", "+new Date()"],
  ["performance.now() (global, control)", "", "performance.now()"],
  ['import { performance as p } from "node:perf_hooks"; p.now()', 'import { performance as p } from "node:perf_hooks";\n', "p.now()"],
  ['import { performance } from "node:perf_hooks"; const { now: pn } = performance', 'import { performance } from "node:perf_hooks";\nconst { now: pn } = performance;\n', "pn.call(performance)"],
  ['performance["now"]()', "", 'performance["now"]()'],
  ["process.hrtime.bigint()", "", "Number(process.hrtime.bigint())"],
  ["process.uptime()", "", "process.uptime()"],
  ["Math.random() (control)", "", "Math.random()"],
  ['Math["random"]()', "", 'Math["random"]()'],
  ["crypto.getRandomValues", "", "crypto.getRandomValues(new Uint32Array(1))[0]"],
  ['import { randomInt } from "node:crypto"', 'import { randomInt } from "node:crypto";\n', "randomInt(2)"],
  ["Temporal.Now (if present)", "", "(globalThis.Temporal ? Number(globalThis.Temporal.Now.instant().epochMilliseconds) : Number.NaN)"],
];

if (existsSync(scratch)) rmSync(scratch, { recursive: true, force: true });
mkdirSync(scratch, { recursive: true });
for (const f of ["src", "package.json", "tsconfig.json", "vitest.config.ts"])
  cpSync(join(srcRoot, f), join(scratch, f), { recursive: true });
symlinkSync(join(srcRoot, "node_modules"), join(scratch, "node_modules"));
const pristine = readFileSync(join(scratch, VC), "utf8");
const anchor = 'import type { Clock } from "./engine.ts";\n';
const ret = "    return current;";
if (!pristine.includes(anchor) || !pristine.includes(ret)) throw new Error("anchors missing");

let n = 0;
for (const [name, header, expr] of V) {
  // `* 0 + 0` keeps the readings unchanged where the read returns a number; the read still runs.
  const added = [header.trimEnd(), `    return current + (${expr}) * 0;`].filter(Boolean);
  const src = pristine.replace(anchor, anchor + header).replace(ret, added.at(-1));
  writeFileSync(join(scratch, VC), src);
  const r = spawnSync("npx", ["vitest", "run", "src/engine.test.ts", "-t", "ABC-086 A4", "--reporter=json"], { cwd: scratch, encoding: "utf8", maxBuffer: 1 << 26 });
  const json = JSON.parse(r.stdout.slice(r.stdout.indexOf("{")));
  const row = json.numFailedTests > 0 ? "CAUGHT (red)" : json.numPassedTests === 1 ? "MISSED (green)" : `?? passed=${json.numPassedTests}`;
  const grepHits = added.filter((l) => TICKET_GREP.test(l)).length;
  let live;
  try {
    const mod = await import(`${pathToFileURL(join(scratch, VC)).href}?v=${n++}`);
    const c = mod.virtualClock(1);
    live = `readings ${[c(), c(), c()].join(",")}`;
  } catch (e) {
    live = `threw ${e.constructor.name}: ${String(e.message).slice(0, 60)}`;
  }
  console.log(JSON.stringify({ variant: name, row, ticketGrep: grepHits > 0 ? `CAUGHT (${grepHits})` : "MISSED (0)", live }));
}
writeFileSync(join(scratch, VC), pristine);
