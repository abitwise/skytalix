// Usage: node mutate.mjs <tree> <mutant>  — rewrites <tree>/AGENTS.md in place; aborts unless the anchor is unique.
import { readFileSync, writeFileSync } from "node:fs";
const [tree, mutant] = process.argv.slice(2);
const file = `${tree}/AGENTS.md`;
const src = readFileSync(file, "utf8");
const Q13 = "There is also no CLI entry point yet, which is why `Dev / run` above is\n`UNKNOWN - verify` and stays that way.";
const once = (s, anchor) => { if (s.split(anchor).length !== 2) throw new Error(`anchor not unique: ${anchor}`); return anchor; };
const mutants = {
  control: () => src,
  "q13-head": () => `${Q13}\n\n${src}`,
  "q13-tail": () => `${src}\n${Q13}\n`,
  "q13-posture": () => src.replace(once(src, "## Deployment posture\n\n"), `## Deployment posture\n\n${Q13}\n\n`),
  "q13-oneline": () => `${src}\n${Q13.replace("\n", " ")}\n`,
  "prose-wrong-cmd": () => src.replace(once(src, "(`Dev / run` =\n`npm run chess`)"), "(`Dev / run` =\n`npm run perft`)"),
};
writeFileSync(file, mutants[mutant]());
console.error(`mutant ${mutant}: ${readFileSync(file).length} B`);
