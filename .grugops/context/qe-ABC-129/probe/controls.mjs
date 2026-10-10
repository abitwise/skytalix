// QE ABC-129 negative/positive controls. Usage: node controls.mjs <repo> <tip>. In memory; writes only a tmpdir.
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const [repo, tip] = process.argv.slice(2);
process.argv.splice(3); // exit-probe sees <repo> only: resolves typescript, runs no files
const { measure } = await import("./exit-probe.mjs");
const git = (...a) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 1 << 28 });
const dir = mkdtempSync(join(tmpdir(), "qe129-ctl-"));
const diff = (a, b) => { writeFileSync(join(dir, "a.ts"), a); writeFileSync(join(dir, "b.ts"), b);
  try { return execFileSync("git", ["diff", "--no-index", "-U0", join(dir, "a.ts"), join(dir, "b.ts")], { encoding: "utf8" }); }
  catch (e) { return e.stdout; } };
const pair = (label, f, before, after) => {
  const src = git("show", `${tip}:${f}`); const a = before(src), b = after(src);
  if (a === b) throw new Error(`${label}: mutation did not apply`);
  const r = measure(f, a, b, diff(a, b));
  console.log(`${label}\t${f}\t(i) changed ${r.changed} / regex ${r.rx} / AST ${r.ast}\t(ii) ${r.emitSame ? "IDENTICAL" : "DIFFERENT"}\t(iii) ${r.printSame ? "IDENTICAL" : "DIFFERENT"}`);
};
const id = (s) => s;
pair("N1 code: moves outcome command->claim", "src/command-input.ts", id, (s) => s.replace('{ token: "moves", outcome: "command" }', '{ token: "moves", outcome: "claim" }'));
pair("N2 code: budget expression", "src/cli.ts", id, (s) => s.replace("budgetMs: DEFAULT_BUDGET_MS }", "budgetMs: DEFAULT_BUDGET_MS + 1 }"));
pair("P1 comment only: eight->nine", "src/command-input.ts", id, (s) => s.replace("the eight tokens", "the nine tokens"));
pair("P2 comment only: #10 InputSeam->PromptOutcome", "src/line-input.ts", id, (s) => s.replace("(`src/turn-loop.ts` `InputSeam`)", "(`src/turn-loop.ts` `PromptOutcome`)"));
pair("N3 type-only: text: string -> String", "src/move-input.ts", id, (s) => s.replace("    text: string,", "    text: String,"));
pair("N4 '// ' line inside a template literal", "src/move-input.ts", (s) => `${s}export const __qe = \`\n// a\n\`;\n`, (s) => `${s}export const __qe = \`\n// b\n\`;\n`);
