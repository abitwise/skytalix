// ruling-puzzle-edge probe: arithmetic only, no engine is run.
// Reads the per-row lines QE and Security/NFR committed on grugops/ABC-127-harder-puzzles
// and computes, for each planted weakening (W*) and evaluation term (E*):
//   - each NEWLY-MISSED row's depth signature against the base run (shallower / same / deeper);
//   - the solved count if the four budget-edge rows (seeds 1008, 1075, 1424, 1982) are dropped,
//     against the re-cut baseline 54 (option (b), ADR-0034 decision 5).
// Rows are independent (fresh virtual clock per move, table cleared per search), so dropping a
// row removes exactly that row's line. Usage: node classify.mjs [commit]   (default f063ebce)
import { execFileSync } from "node:child_process";
const commit = process.argv[2] ?? "f063ebce";
const show = (p) => execFileSync("git", ["show", `${commit}:${p}`], { encoding: "utf8", maxBuffer: 1 << 26 });
const QE = ".grugops/context/qe-ABC-127/probe";
const SN = ".grugops/context/secnfr-ABC-127/probe";
const parse = (text) => {
  const m = new Map();
  for (const l of text.split("\n")) {
    const p = l.split("\t");
    if ((p[0] === "SOLVED" || p[0] === "MISSED") && p.length >= 6)
      m.set(p[5], { st: p[0], kind: p[1], mv: p[2], d: Number(p[3].slice(1)), n: Number(p[4].slice(1)) });
  }
  return m;
};
const EDGE = [1008, 1075, 1424, 1982].map((s) => `seed ${s}:`);
const isEdge = (name) => EDGE.some((e) => name.includes(e));
const base = parse(show(`${QE}/raw-deep-process1.rows.txt`));
const baseSolved = [...base.values()].filter((r) => r.st === "SOLVED").length;
console.log(`commit ${commit}; base rows ${base.size}, solved ${baseSolved}; after drop ${baseSolved - 4}/${base.size - 4}`);
const runs = [
  ...["W1", "W1b", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12", "W13", "W14", "W15", "W16"].map((w) => [w, `${QE}/a3/${w}.rows.txt`]),
  ...["E1_tempo10", "E2_mob3_own", "E3_mob1_sym", "E4_mob3_sym", "E5_mob5_sym"].map((e) => [e, `${SN}/plant-${e}-run1.txt`]),
];
console.log(["run", "solved", "missed: shallower/same/deeper", "missed rows (kind depth base->run)", "edge-solved", "after drop vs 54"].join("\t"));
let redNow = 0, redAfter = 0, wCount = 0;
for (const [id, path] of runs) {
  const r = parse(show(path));
  if (r.size !== base.size) throw new Error(`${id}: ${r.size} rows, base ${base.size}`);
  let sh = 0, sa = 0, de = 0, gained = 0; const rows = [];
  for (const [name, b] of base) {
    const x = r.get(name);
    if (b.st === "SOLVED" && x.st === "MISSED") {
      if (x.d < b.d) sh++; else if (x.d === b.d) sa++; else de++;
      rows.push(`${name.replace(/^.*?(seed \d+|[^:]+).*$/, "$1")} ${b.kind} d${b.d}->d${x.d}${isEdge(name) ? " EDGE" : ""}`);
    }
    if (b.st === "MISSED" && x.st === "SOLVED") gained++;
  }
  const solved = [...r.values()].filter((v) => v.st === "SOLVED").length;
  const edgeSolved = [...r].filter(([n, v]) => isEdge(n) && v.st === "SOLVED").length;
  const after = solved - edgeSolved;
  if (id.startsWith("W")) { wCount++; if (solved < baseSolved) redNow++; if (after < baseSolved - 4) redAfter++; }
  console.log([id, `${solved}${gained ? ` (+${gained} newly solved)` : ""}`, `${sh}/${sa}/${de}`, rows.join("; ") || "-", edgeSolved, `${after} ${after < baseSolved - 4 ? "RED" : "green"}`].join("\t"));
}
console.log(`W matrix: ${redNow}/${wCount} red at 58/62; ${redAfter}/${wCount} red at 54/58 after the drop`);
