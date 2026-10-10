// Security/NFR ABC-058: how often does QE-058-a's accidental shape exist? With the repo's own
// TypeScript scanner (string- and comment-aware), list every string / template / regex literal
// in src/**/*.test.ts whose TEXT contains `//` or `/*`, and count `spawnSync` identifier tokens
// followed by `(` in src/cli.test.ts. Usage: node scan-literals.mjs <tree-root>
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
const root = process.argv[2];
const ts = createRequire(`${root}/package.json`)("typescript");
const K = ts.SyntaxKind;
const literalKinds = new Set([K.StringLiteral, K.NoSubstitutionTemplateLiteral, K.TemplateHead,
  K.TemplateMiddle, K.TemplateTail, K.RegularExpressionLiteral]);
const files = readdirSync(`${root}/src`).filter((f) => f.endsWith(".test.ts")).sort();
let total = 0;
for (const f of files) {
  const text = readFileSync(`${root}/src/${f}`, "utf8");
  // A full parse, not a raw scan: the parser re-scans `/` as a regex and `}` as a template tail.
  const sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true);
  const hits = [];
  const visit = (node) => {
    if (literalKinds.has(node.kind)) {
      const raw = node.getText(sf);
      if (raw.includes("//") || raw.includes("/*")) {
        const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
        hits.push(`${line}:${ts.SyntaxKind[node.kind]}:${raw.length > 60 ? `${raw.slice(0, 57)}...` : raw}`);
      }
    }
    if (f === "cli.test.ts" && node.kind === K.CallExpression) {
      const callee = node.expression.getText(sf);
      if (/(^|\.)(spawnSync|spawn|exec|execSync|execFile|execFileSync|fork)$/.test(callee))
        console.log(`cli.test.ts call: ${callee}( at line ${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  total += hits.length;
  if (hits.length) console.log(`${f}: ${hits.length}\n  ${hits.join("\n  ")}`);
}
console.log(`files scanned ${files.length}, literals carrying // or /* : ${total}`);
