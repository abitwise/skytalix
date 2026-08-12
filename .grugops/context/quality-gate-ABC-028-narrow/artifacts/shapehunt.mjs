// HUNTING THE SHAPE, MECHANICALLY. BA/PM found two live instances in `src/` by hand; the
// Orchestrator asked whether there are more.
//
// The defect shape is "a sentence claiming more than what was measured" — which, in a comment, is
// almost always one of THREE mechanically checkable things:
//
//   (1) A SOURCE CITATION (`path.ts:NN`) that no longer points where it says.
//   (2) A TREE COUNT (`42 modules`, `26 files`) that the tree no longer has.
//   (3) A SUITE/LANE FIGURE (`752`, `26/26`, `fails exactly 2`) the suite no longer reports.
//
// This checks (1) and (2) exhaustively over EVERY comment in EVERY `src/*.ts`, and lists (3)'s
// candidates for a run. Unlike a string blacklist, its false-positive count does NOT grow when the
// rule is discussed — the property BA/PM's `grep` failed on. It is reported, never repaired.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SRC = join(
  "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-abc028-qe3",
  "src",
);
const files = readdirSync(SRC).filter((f) => f.endsWith(".ts")).sort();

/** Comment spans only: `//` to end of line, and `/* ... *\/` blocks. Strings are not comments. */
function commentLines(text) {
  const out = [];
  const lines = text.split("\n");
  let inBlock = false;
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (inBlock) {
      out.push([index + 1, line]);
      if (trimmed.includes("*/")) inBlock = false;
      return;
    }
    if (trimmed.startsWith("/*")) {
      out.push([index + 1, line]);
      if (!trimmed.includes("*/")) inBlock = true;
      return;
    }
    if (trimmed.startsWith("//")) out.push([index + 1, line]);
    else if (line.includes("//")) out.push([index + 1, line.slice(line.indexOf("//"))]);
  });
  return out;
}

const lineCount = new Map();
for (const file of files) {
  lineCount.set(file, readFileSync(join(SRC, file), "utf8").split("\n").length);
}

console.log("=== (1) SOURCE CITATIONS in src/ comments — every one resolved ===\n");
const CITE = /(?:src\/)?([A-Za-z0-9._-]+\.ts):(\d+)(?:\s*[-–]\s*(\d+))?/g;
let cites = 0;
let broken = 0;
const resolved = [];
for (const file of files) {
  const text = readFileSync(join(SRC, file), "utf8");
  for (const [line, content] of commentLines(text)) {
    for (const match of content.matchAll(CITE)) {
      const [, target, from, to] = match;
      cites += 1;
      const total = lineCount.get(target);
      const status =
        total === undefined
          ? "NO SUCH FILE"
          : Number(from) > total || (to !== undefined && Number(to) > total)
            ? `OUT OF RANGE (file has ${total} lines)`
            : "resolves";
      if (status !== "resolves") broken += 1;
      resolved.push({ file, line, target, from: Number(from), to: to && Number(to), status });
    }
  }
}
console.log(`${cites} citations found in src/ comments; ${broken} do not resolve at all.\n`);
for (const c of resolved) {
  const target = c.target;
  const body = lineCount.has(target) ? readFileSync(join(SRC, target), "utf8").split("\n") : null;
  const cited = body ? (body[c.from - 1] ?? "").trim().slice(0, 92) : "";
  console.log(
    `  ${c.file}:${c.line}  ->  ${target}:${c.from}${c.to ? `-${c.to}` : ""}  [${c.status}]`,
  );
  if (body) console.log(`        cited line reads: ${cited}`);
}

console.log("\n=== (2) TREE COUNTS asserted in src/ comments ===\n");
const production = files.filter((f) => !f.endsWith(".test.ts"));
const tests = files.filter((f) => f.endsWith(".test.ts"));
console.log(`  measured now: ${files.length} src/*.ts = ${production.length} production + ${tests.length} test files\n`);
const COUNTNOUN =
  /\b(\d{1,4})\s+(modules?|production modules?|files?|test files?|importers?|plies|rows?|tests?)\b/gi;
for (const file of files) {
  const text = readFileSync(join(SRC, file), "utf8");
  for (const [line, content] of commentLines(text)) {
    for (const match of content.matchAll(COUNTNOUN)) {
      console.log(`  ${file}:${line}  "${match[0]}"   ...${content.trim().slice(0, 100)}`);
    }
  }
}

console.log("\n=== (3) SUITE / LANE FIGURES asserted in src/ comments — candidates for a run ===\n");
const FIGURE =
  /(\bfails? (?:exactly )?\d+\b|\b\d+\s*\/\s*\d+\b|\b\d{2,4}\s*(?:passed|of \d+|GREEN)\b|\bexactly \d+\b)/gi;
for (const file of files) {
  const text = readFileSync(join(SRC, file), "utf8");
  for (const [line, content] of commentLines(text)) {
    const hits = [...content.matchAll(FIGURE)].map((m) => m[0]);
    if (hits.length > 0) {
      console.log(`  ${file}:${line}  ${JSON.stringify(hits)}`);
      console.log(`        ${content.trim().slice(0, 130)}`);
    }
  }
}
