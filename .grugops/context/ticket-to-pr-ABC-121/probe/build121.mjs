// ABC-121 N8-LANE arms, built outside the repository (ABC-081's build harness, re-pointed).
// A = 9823c27 (ABC-121 tip, both commits); N = byte-identical copy of A (null control);
// B = 15c6eb0 (the base, pre-ABC-121). node_modules symlinked from the main checkout.
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, symlinkSync } from "node:fs";

const S = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/cc8144c4-cb23-42b5-90b8-44bcbd8a2345/scratchpad/lane121";
const W = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/ABC-121-pvs-lmr";
const NM = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules";
const git = (...a) => execFileSync("git", ["-C", W, ...a], { maxBuffer: 256 * 1024 * 1024 });

rmSync(S, { recursive: true, force: true });
for (const [arm, rev] of [["A", "9823c27"], ["N", "9823c27"], ["B", "15c6eb0"]]) {
  mkdirSync(`${S}/${arm}`, { recursive: true });
  execFileSync("tar", ["-x", "-C", `${S}/${arm}`], { input: git("archive", rev) });
  symlinkSync(NM, `${S}/${arm}/node_modules`);
}
console.log("built");
