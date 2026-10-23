// A3: base vs branch, each case in a fresh cwd; bytes and exit compared; games/ absence checked.
import { spawnSync } from "node:child_process";
import { mkdtempSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
const [base, branch, scratch] = process.argv.slice(2);
const hook = (module, source) => `data:text/javascript,${encodeURIComponent([
  'import { registerHooks } from "node:module";', "registerHooks({", "  load(url, context, nextLoad) {",
  `    if (!url.endsWith(${JSON.stringify(`/src/${module}`)})) return nextLoad(url, context);`,
  `    return { format: "module", shortCircuit: true, source: ${JSON.stringify(source)} };`, "  },", "});"].join("\n"))}`;
const scripted = (moves) => `import { legalMoves } from "./legal.ts";
import { squareName } from "./position.ts";
export function withBook(_p, _i) { const s = ${JSON.stringify(moves)}; let ply = 0;
  return async (h) => { const w = s[ply++]; const m = legalMoves(h.position).find((c) => squareName(c.from) + squareName(c.to) === w);
    if (m === undefined) throw new Error("scripted: no legal move " + w); return m; }; }`;
const eng = hook("book-engine.ts", scripted(["e7e5", "b8c6"]));
const cases = {
  quitAfterPlies: { args: ["--colour", "white", "--difficulty", "2"], input: "e4\nnf3\nquit\nquit\n", hook: eng },
  eofAfterPlies: { args: ["--colour", "white", "--difficulty", "2"], input: "e4\nnf3\n", hook: eng },
  eofAtStartupQuestion: { args: [], input: "" },
  eofAtSecondQuestion: { args: [], input: "2\n" },
  usageError: { args: ["--colour", "purple"], input: "" },
  usageUnknownFlag: { args: ["--pgn"], input: "" },
  internalError: { args: ["--colour", "white"], input: "", hook: hook("line-input.ts",
    'export function createLineInputSeam() { return async () => { throw new Error("the input seam threw"); }; }\n') },
};
const runOne = (root, c) => {
  const cwd = mkdtempSync(join(scratch, "a3-"));
  const argv = c.hook ? ["--import", c.hook, join(root, "src/cli.ts"), ...c.args] : [join(root, "src/cli.ts"), ...c.args];
  const r = spawnSync(process.execPath, argv, { cwd, input: c.input, encoding: "utf8", env: { PATH: process.env.PATH }, timeout: 30000 });
  if (r.error) throw r.error;
  const games = existsSync(join(cwd, "games"));
  rmSync(cwd, { recursive: true, force: true });
  return { stdout: r.stdout, stderr: r.stderr, status: r.status, games };
};
const rows = [];
for (const [name, c] of Object.entries(cases)) {
  const a = runOne(base, c), b = runOne(branch, c);
  rows.push({ name, exit: `${a.status}/${b.status}`, stdoutEq: a.stdout === b.stdout, stderrEq: a.stderr === b.stderr,
    stdoutBytes: b.stdout.length, stderrHead: b.stderr.split("\n")[0].slice(0, 60), gamesCreated: b.games, pgnLine: /PGN (not )?saved/.test(b.stdout + b.stderr) });
}
console.table(rows);
