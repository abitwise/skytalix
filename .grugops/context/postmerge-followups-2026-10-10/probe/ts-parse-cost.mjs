// F-058-1 cost: CPU of loading `typescript` and of one parse of src/cli.test.ts, plus a
// parser-view count of node:child_process imports and child_process-member calls.
// Usage: node ts-parse-cost.mjs <tree-root>   (one fresh process per reading)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const root = process.argv[2];
const t0 = process.cpuUsage();
const ts = createRequire(`${root}/package.json`)("typescript");
const t1 = process.cpuUsage(t0);
const text = readFileSync(`${root}/src/cli.test.ts`, "utf8");
const t2s = process.cpuUsage();
const sf = ts.createSourceFile("cli.test.ts", text, ts.ScriptTarget.Latest, true);
const local = new Map(); const imports = [];
for (const st of sf.statements) {
  if (ts.isImportDeclaration(st) && st.moduleSpecifier.text === "node:child_process") {
    const b = st.importClause?.namedBindings;
    if (st.importClause?.name) { imports.push(`default:${st.importClause.name.text}`); local.set(st.importClause.name.text, "*"); }
    if (b && ts.isNamespaceImport(b)) { imports.push(`* as ${b.name.text}`); local.set(b.name.text, "*"); }
    if (b && ts.isNamedImports(b)) for (const e of b.elements) { imports.push((e.propertyName ?? e.name).text); local.set(e.name.text, (e.propertyName ?? e.name).text); }
  }
}
const calls = [];
const visit = (n) => {
  if (ts.isCallExpression(n)) {
    const c = n.expression;
    const hit = ts.isIdentifier(c) ? local.has(c.text) && local.get(c.text) !== "*" :
      ts.isPropertyAccessExpression(c) && ts.isIdentifier(c.expression) && local.get(c.expression.text) === "*";
    if (hit) calls.push(`${c.getText(sf)}@${sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1}`);
  }
  ts.forEachChild(n, visit);
};
visit(sf);
const t2 = process.cpuUsage(t2s);
const ms = (u) => ((u.user + u.system) / 1000).toFixed(1);
console.log(`ts ${ts.version} load ${ms(t1)} ms, parse+walk ${ms(t2)} ms, chars ${text.length}, imports ${JSON.stringify(imports)}, calls ${JSON.stringify(calls)}`);
