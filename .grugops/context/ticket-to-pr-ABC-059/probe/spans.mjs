// Usage: git show <rev>:AGENTS.md | node spans.mjs  — the block's span rule, verbatim, printed.
import { readFileSync } from "node:fs";
const agents = readFileSync(0, "utf8");
const text = agents.replace(/\s+/g, " ");
const spans = [];
for (let at = text.indexOf("Dev / run"); at >= 0; at = text.indexOf("Dev / run", at + 1)) {
  const end = text.slice(at).search(/[.!?]( |$)/);
  spans.push(end < 0 ? text.slice(at) : text.slice(at, at + end + 1));
}
const command = "npm run chess";
for (const s of spans) console.log(JSON.stringify(s), "| UNKNOWN:", s.includes("UNKNOWN - verify"), "| named:", JSON.stringify(s.match(/npm run [\w:-]*/g) ?? []));
console.log("occurrences", spans.length, "| UNKNOWN spans", spans.filter((s) => s.includes("UNKNOWN - verify")).length, "| command spans", spans.filter((s) => s.includes(command)).length, "| UNKNOWN - verify in file", agents.split("UNKNOWN - verify").length - 1, "| bytes", Buffer.byteLength(agents));
