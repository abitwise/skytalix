// ABC-121 lane re-hop: measurement arms, built OUTSIDE the repository (no git in them).
//   B = 15c6eb0 (base, pre-ABC-121)      A = 66afd16 (src/ byte-identical to the measured 9823c27)
//   N = copy of A (null control)         S = A, search.pvs-lmr.test.ts bodies skipped (the SHELL:
//   imports, vi.mock, module-level work, collect — no test body runs)
//   M = S without the vi.mock block      T = A, search.pvs-lmr.test.ts replaced by a trivial file
//                                            importing nothing from src/ (the per-file floor)
//   X = <rev given as argv[2]> — the placement build, when it exists
// node_modules symlinked from the main checkout.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";

const S = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/cc8144c4-cb23-42b5-90b8-44bcbd8a2345/scratchpad/sw121lane";
const W = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/ABC-121-lane";
const NM = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules";
const F = "src/search.pvs-lmr.test.ts";
const git = (...a) => execFileSync("git", ["-C", W, ...a], { maxBuffer: 256 * 1024 * 1024 });

const arm = (name, rev) => {
  rmSync(`${S}/${name}`, { recursive: true, force: true });
  mkdirSync(`${S}/${name}`, { recursive: true });
  execFileSync("tar", ["-x", "-C", `${S}/${name}`], { input: git("archive", rev) });
  symlinkSync(NM, `${S}/${name}/node_modules`);
};

const x = process.argv[2];
if (x) {
  arm(process.argv[3] ?? "X", x); // e.g. `6c1e895 X`, then `6c1e895 NX` for X's null control
} else {
  for (const [name, rev] of [["B", "15c6eb0"], ["A", "66afd16"], ["N", "66afd16"], ["S", "66afd16"], ["M", "66afd16"], ["T", "66afd16"]]) arm(name, rev);
  const src = readFileSync(`${S}/A/${F}`, "utf8");
  const shell = src.replace(/(^|\n)(\s*)it\(/g, "$1$2it.skip(");
  if (shell === src) throw new Error("no it( found");
  writeFileSync(`${S}/S/${F}`, shell);
  const start = shell.indexOf('vi.mock("./transposition.ts"');
  const end = shell.indexOf("\n});\n", start) + 5;
  if (start < 0 || end < 5) throw new Error("vi.mock block not found");
  writeFileSync(`${S}/M/${F}`, shell.slice(0, start) + shell.slice(end));
  writeFileSync(`${S}/T/${F}`, 'import { expect, it } from "vitest";\n\nit("trivial", () => {\n  expect(1).toBe(1);\n});\n');
}
console.log("built", x ?? "B A N S M T");
