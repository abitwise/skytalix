// qe-ABC-247 A2: block 01's argv from an rpair dry-run print, placeholders put back, changed ONLY in -rounds (10 -> 1)
// and the three output paths (2 x stderr=, -pgnout) to <runDir>. --no-token drops the `option.Skill Level=6` element.
// Writes <runDir>/argv.json (real paths) and prints the redacted diff against the printed argv.
// usage: node probe-argv.mjs <print> <base|candidate> <runDir> <repo> [--no-token]   (env: CUTECHESS_CLI, STOCKFISH)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [print, build, runDir, repo, flag] = process.argv.slice(2);
const header = `block 01 ${build} cutechess-cli argv:`;
const lines = readFileSync(print, "utf8").split("\n");
const at = lines.indexOf(header);
if (at < 0) throw new Error(`no '${header}'`);
const printed = [];
for (let i = at + 1; i < lines.length && lines[i].startsWith("  "); i++) printed.push(lines[i].slice(2));
const map = [["<cutechess-cli>", process.env.CUTECHESS_CLI], ["<stockfish>", process.env.STOCKFISH], ["<node>", process.execPath], ["<repo>", repo]];
const real = printed.map((a) => map.reduce((s, [k, v]) => s.split(k).join(v), a));
const argv = [...real];
const r = argv.indexOf("-rounds"); if (argv[r + 1] !== "10") throw new Error("rounds"); argv[r + 1] = "1";
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith("stderr=")) argv[i] = `stderr=${join(runDir, argv[i].split("/").at(-1))}`;
  if (argv[i - 1] === "-pgnout") argv[i] = join(runDir, "r.pgn");
}
if (flag === "--no-token") { const t = argv.indexOf("option.Skill Level=6"); if (t < 0) throw new Error("no token"); argv.splice(t, 1); }
mkdirSync(runDir, { recursive: true });
writeFileSync(join(runDir, "argv.json"), JSON.stringify(argv, null, 1));
// redacted diff vs the print (positional where lengths match; else report the removed element)
const red = (s) => map.reduce((t, [k, v]) => t.split(v).join(k), s).split(runDir).join("<run>");
const shown = argv.map(red);
const p = flag === "--no-token" ? printed.filter((a) => a !== "option.Skill Level=6") : printed;
if (flag === "--no-token") console.log("removed: option.Skill Level=6 (1 element)");
let n = 0;
p.forEach((a, i) => { if (a !== shown[i]) { n++; console.log(`[${i}] printed '${a}' -> run '${shown[i]}'`); } });
console.log(`argv ${argv.length} elements; ${n} changed vs the print${p.length === shown.length ? "" : " LENGTH MISMATCH"}`);
