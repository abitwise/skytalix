// node mutate.mjs <tree> <mutant> <pristineAgents> <pristinePkg> <sp>
import { readFileSync, writeFileSync } from "node:fs";
const [tree, m, pa, pp, sp] = process.argv.slice(2);
const A = readFileSync(pa, "utf8"), P = readFileSync(pp, "utf8");
const Q13 = "There is also no CLI entry point yet, which is why `Dev / run` above is\n`UNKNOWN - verify` and stays that way.";
const once = (s, a) => { if (s.split(a).length !== 2) throw new Error(`anchor not unique: ${a}`); return a; };
const POST = "## Deployment posture\n\n";
const atPosture = (x) => A.replace(once(A, POST), `${POST}${x}\n\n`);
const SLOT_COMMENT_START = "- Dev / run: `npm run chess` <!--";
let agents = A, pkg = P;
const M = {
  control: () => {},
  // engineer's six
  "q13-head": () => { agents = `${Q13}\n\n${A}`; },
  "q13-tail": () => { agents = `${A}\n${Q13}\n`; },
  "q13-posture": () => { agents = atPosture(Q13); },
  "q13-oneline": () => { agents = `${A}\n${Q13.replace("\n", " ")}\n`; },
  "prose-wrong-cmd": () => { agents = A.replace(once(A, "(`Dev / run` =\n`npm run chess`)"), "(`Dev / run` =\n`npm run perft`)"); },
  // QE additions: A2 'anywhere'
  "q13-crlf": () => { agents = atPosture(Q13.replace("\n", "\r\n")); },
  "q13-in-list": () => { agents = A.replace(once(A, "- Perft harness ("), `- ${Q13}\n- Perft harness (`); },
  "q13-in-comment": () => { agents = A.replace(once(A, "<!-- no runnable game until EPIC-006;"), `<!-- ${Q13} no runnable game until EPIC-006;`); },
  "q13-midsentence": () => { agents = A.replace(once(A, "This project deploys nowhere;"), `This project ${Q13} deploys nowhere;`); },
  "q13-the-list-form": () => { agents = A.replace(once(A, SLOT_COMMENT_START), "- Dev / run: `UNKNOWN - verify` <!--"); },
  // span-rule edges
  "edge-bang-wrong": () => { agents = atPosture("Run it: `Dev / run` is `npm run perft`! Really."); },
  "edge-question-wrong": () => { agents = atPosture("Is `Dev / run` `npm run perft`? Yes."); },
  "edge-two-npm-wrong": () => { agents = atPosture("`Dev / run` is `npm run chess` or `npm run perft`."); },
  "edge-two-npm-correct": () => { agents = atPosture("`Dev / run` is `npm run chess`, not `npm run perft`."); },
  "edge-abbrev-unknown": () => { agents = atPosture("`Dev / run` is, e.g. on a fresh clone, `UNKNOWN - verify`."); },
  "edge-question-unknown": () => { agents = atPosture("What is `Dev / run`? `UNKNOWN - verify`, for now."); },
  "edge-next-sentence": () => { agents = atPosture("See `Dev / run` above. It is `UNKNOWN - verify` and stays that way."); },
  "edge-token-nospace": () => { agents = atPosture("`Dev/run` above is `UNKNOWN - verify` and stays that way."); },
  "edge-token-case": () => { agents = atPosture("`dev / run` above is `UNKNOWN - verify` and stays that way."); },
  "edge-unknown-lower": () => { agents = atPosture("`Dev / run` above is unknown - verify it and stays that way."); },
  "edge-unknown-endash": () => { agents = atPosture("`Dev / run` above is `UNKNOWN – verify` and stays that way."); },
  "edge-node-direct-wrong": () => { agents = atPosture("`Dev / run` = `node src/perft-bench.ts`."); },
  "edge-run-script-wrong": () => { agents = atPosture("`Dev / run` = `npm run-script perft`."); },
  "edge-npm-start": () => { agents = atPosture("`Dev / run` = `npm start`."); },
  "edge-slot-comment-short": () => { agents = A.replace(/- Dev \/ run: `npm run chess` <!--[\s\S]*?-->/, "- Dev / run: `npm run chess` <!-- the game -->"); },
  // A4: package.json is read
  "pkg-rename-runner": () => { pkg = P.replace(once(P, '"chess": "node src/cli.ts"'), '"play": "node src/cli.ts"'); },
  "pkg-rename-both": () => { pkg = P.replace(once(P, '"chess": "node src/cli.ts"'), '"play": "node src/cli.ts"'); agents = A.replaceAll("npm run chess", "npm run play"); },
  "pkg-second-runner": () => { pkg = P.replace(once(P, '"chess": "node src/cli.ts",'), '"chess": "node src/cli.ts",\n    "chess:watch": "node --watch src/cli.ts",'); },
  // real files
  "file-prerepair": () => { agents = readFileSync(`${sp}/agents.prerepair.md`, "utf8"); },
  "file-abc087": () => { agents = readFileSync(`${sp}/agents.abc087.md`, "utf8"); },
};
if (!M[m]) throw new Error(`no mutant ${m}`);
M[m]();
writeFileSync(`${tree}/AGENTS.md`, agents);
writeFileSync(`${tree}/package.json`, pkg);
console.error(`${m}: AGENTS.md ${Buffer.byteLength(agents)} B`);
