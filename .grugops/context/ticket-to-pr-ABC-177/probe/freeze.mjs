// ABC-177 A6: freeze the mutant list against the BASE tree only, before any head run.
import { readFileSync, writeFileSync } from "node:fs";
const R = process.argv[2], base = process.argv[3];
function load(p) {
  const t = readFileSync(p, "utf8");
  const body = t.slice(t.indexOf("const muts = ["), t.indexOf("];\nconst results") + 2);
  const imp = 'import { makeMove } from "./apply.ts";';
  const OPT = "  const { write, now, random, book } = options;";
  return new Function("imp", "OPT", body + "\nreturn muts;")(imp, OPT);
}
const U = "src/uci-session.ts";
const a = load(`${R}/.grugops/context/qe-ABC-167/probe/mutants.mjs`);
const b = load(`${R}/.grugops/context/qe-ABC-171/probe/mutants3.mjs`);
const byId = new Map();
for (const m of a) byId.set(m[0], { id: `167-${m[0]}`, crit: m[1], file: U, from: m[2], to: m[3], source: "qe-ABC-167/probe/mutants.mjs" });
for (const m of b) byId.set(m[0], { id: `${m[0].startsWith("M") ? "167" : "171"}-${m[0]}`, crit: m[1], file: U, from: m[2], to: m[3], source: "qe-ABC-171/probe/mutants3.mjs (current anchors)" });
const s31b = byId.get("S31b"); byId.delete("S31b");
const list = [...byId.values()];
list.find((m) => m.id === "171-S31").companion = { from: s31b.from, to: s31b.to };
// successors written before any run, for patterns the base source no longer carries once
const pv = "pv ${move}`,";
list.push({ id: "167-M45a", crit: "A3 extra pv token (level line)", file: U, from: "time ${choice.elapsedMs} pv ${move}`,", to: "time ${choice.elapsedMs} pv ${move} ${move}`,", source: "ABC-177 successor of 167-M45 (2 matches at base)", nth: 0 });
list.push({ id: "167-M45b", crit: "A3 extra pv token (engine line)", file: U, from: "nps ${nps} pv ${move}`,", to: "nps ${nps} pv ${move} ${move}`,", source: "ABC-177 successor of 167-M45" });
list.push({ id: "171-S42b", crit: "A1 option order (default ${DEFAULT_LEVEL})", file: U, from: null, to: null, source: "ABC-177 successor of 171-S42; filled below" });
// ABC-174 table (sed s/a/b/, applied as one literal replacement)
for (const line of readFileSync(`${R}/.grugops/context/qe-ABC-174/probe/mutants.tsv`, "utf8").trim().split("\n")) {
  const [id, file, sed, note] = line.split("\t");
  const [, from, to] = sed.split("/");
  list.push({ id: `174-${id}`, crit: note, file, from, to, source: "qe-ABC-174/probe/mutants.tsv" });
}
// A6's two hold/release mutants, by their own text
list.push({ id: "H1", crit: "A6 hold: a bestmove written on go infinite", file: U, from: "if (request.hold) held = answer;", to: "if (false) held = answer;", source: "ABC-177 A6 (same text as 167-M16)" });
list.push({ id: "H2", crit: "A6 release: a second release writes", file: U, from: "    held = null;\n    write(line);", to: "    write(line);", source: "ABC-177 A6 (same text as 167-M13)" });
const usrc = readFileSync(`${base}/${U}`, "utf8");
const s42 = list.find((m) => m.id === "171-S42b");
const ownLine = usrc.match(/ {10}write\("option name OwnBook[^\n]*\n {10}write\("option name Skill Level[^\n]*;/)?.[0];
if (ownLine) { const [x, y] = ownLine.split("\n"); s42.from = ownLine; s42.to = `${y.trimStart().padStart(y.length)}\n${x}`; }
for (const m of list) {
  const src = readFileSync(`${base}/${m.file}`, "utf8");
  const n = m.from ? src.split(m.from).length - 1 : 0;
  let ok = n === 1;
  if (ok && m.companion) ok = src.replace(m.from, m.to).split(m.companion.from).length - 1 === 1;
  m.baseMatch = ok ? "OK" : `BAD-PATTERN count=${n}`;
}
writeFileSync("frozen-mutants.json", JSON.stringify(list, null, 1));
const okN = list.filter((m) => m.baseMatch === "OK").length;
console.log(list.length, "listed;", okN, "apply at base; not applicable:", list.filter((m) => m.baseMatch !== "OK").map((m) => `${m.id}(${m.baseMatch})`).join(" "));
