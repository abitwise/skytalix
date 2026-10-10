// For each changed (added) line at tip, list enclosing call expressions (describe/it/test...). Usage: node qe141-enclosing.mjs <repo> <base> <tip> <file...>
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
const [repo, base, tip, ...files] = process.argv.slice(2);
const ts = createRequire(`${repo}/package.json`)("typescript");
for (const f of files) {
  const src = execFileSync("git", ["-C", repo, "show", `${tip}:${f}`], { encoding: "utf8" });
  const diff = execFileSync("git", ["-C", repo, "diff", "-U0", base, tip, "--", f], { encoding: "utf8" });
  const lines = [];
  for (const m of diff.matchAll(/^@@ .* \+(\d+)(?:,(\d+))? @@/gm)) for (let i = 0; i < (m[2] === undefined ? 1 : +m[2]); i++) lines.push(+m[1] + i);
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true);
  for (const ln of lines) {
    const pos = sf.getPositionOfLineAndCharacter(ln - 1, 0); const chain = [];
    const walk = (n) => { if (n.pos <= pos && pos < n.end) { if (ts.isCallExpression(n)) chain.push(n.expression.getText(sf)); n.forEachChild(walk); } };
    walk(sf);
    console.log(`${f}:${ln} enclosing-calls=[${chain.join(" > ")}] inIt=${chain.some((c) => /^(it|test)(\.|$)/.test(c))}`);
  }
}
