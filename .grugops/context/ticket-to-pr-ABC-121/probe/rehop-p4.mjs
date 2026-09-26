// ABC-121 lane re-hop: the build's PROPOSED placement in full (all four rows deep), as a scratch
// tree OUTSIDE the repository, so the default-lane ledger can show what it would lose. Starts from
// the re-hop's placement (seed guard deep, PVS identity guard narrowed to kp-vs-k) and ALSO gates
// A4's chooseMove row and the engine-doors bite behind RUN_DEEP (`it` -> a RUN_DEEP-gated `it`).
// Usage: node rehop-p4.mjs <placement-tree>
import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const S = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/cc8144c4-cb23-42b5-90b8-44bcbd8a2345/scratchpad/sw121lane/P4";
const F = "src/search.pvs-lmr.test.ts";
const tree = process.argv[2];
rmSync(S, { recursive: true, force: true });
const SKIP = new Set([".git", ".claude", ".grugops", "node_modules"]); // whole tree: cli.test.ts reads AGENTS.md
cpSync(tree, S, { recursive: true, filter: (p) => !SKIP.has(p.slice(tree.length + 1).split("/")[0]) });
let src = readFileSync(`${S}/${F}`, "utf8");
for (const title of [
  'it("chooseMove(): the same, deepened to depth 4 in the engine\'s own recursion"',
  'it("the engine doors bite: chooseMoveWithoutReductions is the unreduced engine, not chooseMove"',
]) {
  if (src.split(title).length !== 2) throw new Error(`not found once: ${title}`);
  src = src.replace(title, `(RUN_DEEP ? it : () => {})(${title.slice(3)}`);
}
writeFileSync(`${S}/${F}`, src);
console.log("built P4");
