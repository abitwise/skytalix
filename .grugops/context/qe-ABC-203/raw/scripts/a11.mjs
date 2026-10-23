// A11 (+A1 at the CLI): base vs branch on outcome paths. Branch stdout must equal base + one saved line; stderr equal.
import { spawnSync } from "node:child_process";
import { mkdtempSync, existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
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
const cases = {
  resignAfterPlies: { args: ["--colour", "white", "--difficulty", "4"], input: "e4\nresign\n", hook: hook("book-engine.ts", scripted(["e7e5"])) },
  engineMatesHuman: { args: ["--colour", "white", "--difficulty", "5"], input: "f3\ng4\n", hook: hook("book-engine.ts", scripted(["e7e5", "d8h4"])) },
  humanMatesEngine: { args: ["--colour", "black", "--difficulty", "3"], input: "e5\nQh4\n", hook: hook("book-engine.ts", scripted(["f2f3", "g2g4"])) },
  engineThrows: { args: ["--colour", "white", "--difficulty", "1"], input: "e4\n", hook: hook("book-engine.ts", scripted([])) },
};
const runOne = (root, c) => {
  const cwd = mkdtempSync(join(scratch, "a11-"));
  const r = spawnSync(process.execPath, ["--import", c.hook, join(root, "src/cli.ts"), ...c.args], { cwd, input: c.input, encoding: "utf8", env: { PATH: process.env.PATH }, timeout: 30000 });
  if (r.error) throw r.error;
  const files = existsSync(join(cwd, "games")) ? readdirSync(join(cwd, "games")) : null;
  const pgn = files && files.length ? readFileSync(join(cwd, "games", files[0]), "utf8") : "";
  rmSync(cwd, { recursive: true, force: true });
  return { stdout: r.stdout, stderr: r.stderr, status: r.status, files, pgn };
};
const rows = [];
for (const [name, c] of Object.entries(cases)) {
  const a = runOne(base, c), b = runOne(branch, c);
  const lines = b.stdout.split("\n"); const last = lines[lines.length - 2];
  const plusOne = b.stdout === a.stdout + last + "\n" && /^PGN saved: games\/skytalix-\d{8}-\d{6}\.pgn$/.test(last);
  console.log(`== ${name}: ${JSON.stringify(b.files)}\n${b.pgn}`);
  rows.push({ name, exit: `${a.status}/${b.status}`, stdoutIsBasePlusSavedLine: plusOne, stderrEq: a.stderr === b.stderr, stderrEmpty: b.stderr === "", files: b.files?.length ?? 0, savedNamesFile: b.files?.[0] === last?.replace("PGN saved: games/", "") });
}
console.table(rows);
