// Extra controls for blind spots of the A4 filter and of measure (i). Usage: node blind.mjs <repo>
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
const repo = process.argv[2];
process.argv.splice(2, 9, repo, "HEAD", "HEAD"); // no files -> exit132 runs no REAL rows
const { measure } = await import("./exit132.mjs");
const tmp = mkdtempSync(join(tmpdir(), "qe132-"));
const diff = (a, b) => { writeFileSync(join(tmp, "a.ts"), a); writeFileSync(join(tmp, "b.ts"), b);
  return spawnSync("git", ["diff", "--no-index", "-U0", join(tmp, "a.ts"), join(tmp, "b.ts")], { encoding: "utf8" }).stdout; };
const ticketA4 = (d) => d.split("\n").filter((l) => /^[+-][^+-]/.test(l)).filter((l) => !/^[+-]\s*(\*|\/\*\*|\*\/)/.test(l));
const base = "/** doc */\nlet i = 3;\nexport const s = `a\nb`;\nexport const f = (n: number) => {\n  n = n;\n  return n;\n};\n";
const cases = {
  "blank line inside template literal": base.replace("`a\nb`", "`a\n\nb`"),
  "code line starting with `--`": base.replace("  n = n;\n", "  n = n;\n  --i;\n").replace("  n = n;\n  --i;", "--i;\n  n = n;"),
  "code line starting with `++`": base.replace("let i = 3;\n", "let i = 3;\n++i;\n"),
};
for (const [k, t] of Object.entries(cases)) {
  const d = diff(base, t); const r = measure("x.ts", base, t, d);
  console.log(`${k}: ticket A4 filter prints ${ticketA4(d).length} line(s) [${ticketA4(d).length ? "RED" : "BLIND"}]; (i) ${r.i ? "HOLDS(blind)" : "FAILS(red)"} [${r.sca}/${r.changed}]; (ii) ${r.ii ? "HOLDS(blind)" : "FAILS(red)"}; Q4 conjunction ${r.waiver ? "HOLDS (BLIND)" : "FAILS (red)"}`);
}
