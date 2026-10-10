// ABC-133 A4: CPU (user + sys, process.cpuUsage) of the delivered instrument's own work, in process:
// loading `typescript`, plus one parse and walk of src/cli.test.ts. The walk is the delivered pin's
// (src/cli.test.ts, `ABC-042 — the shape of what was delivered` > N8-LANE row) transcribed to JS;
// it prints its two counts so the transcription is checked against the delivered expectations.
// Usage: node a4-cost.mjs <tree-root>   (one fresh process per reading)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const root = process.argv[2];
const t0 = process.cpuUsage();
const ts = createRequire(`${root}/package.json`)("typescript");
const load = process.cpuUsage(t0);
const t1 = process.cpuUsage();
const view = ts.createSourceFile("cli.test.ts", readFileSync(`${root}/src/cli.test.ts`, "utf8"), ts.ScriptTarget.Latest, true);
const namesChildProcess = (node) => node !== undefined && ts.isStringLiteralLike(node) && /^(node:)?child_process$/.test(node.text);
const specifiers = []; const bound = new Set(); const callees = [];
const visit = (node) => {
  if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && namesChildProcess(node.moduleSpecifier)) {
    const clause = ts.isImportDeclaration(node) ? node.importClause : undefined;
    const named = clause?.namedBindings; const binds = [];
    if (clause?.name !== undefined) binds.push([`default ${clause.name.text}`, clause.name.text]);
    if (named !== undefined && ts.isNamespaceImport(named)) binds.push([`* as ${named.name.text}`, named.name.text]);
    if (named !== undefined && ts.isNamedImports(named)) for (const { propertyName, name } of named.elements)
      binds.push([propertyName === undefined ? name.text : `${propertyName.text} as ${name.text}`, name.text]);
    for (const [, local] of binds) bound.add(local);
    specifiers.push(binds.map(([shown]) => shown));
  }
  if (ts.isCallExpression(node)) {
    const callee = node.expression;
    if ((callee.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(callee) && callee.text === "require")) && namesChildProcess(node.arguments[0])) specifiers.push([]);
    const inChildOf = ts.findAncestor(node, (a) => ts.isVariableDeclaration(a) && a.name.getText(view) === "childOf");
    callees.push([callee, inChildOf !== undefined]);
  }
  ts.forEachChild(node, visit);
};
visit(view);
const resolved = callees.filter(([c]) => (ts.isIdentifier(c) && bound.has(c.text)) ||
  ((ts.isPropertyAccessExpression(c) || ts.isElementAccessExpression(c)) && ts.isIdentifier(c.expression) && bound.has(c.expression.text)))
  .map(([c, inChildOf]) => `${c.getText(view)}${inChildOf ? " in childOf" : ""}`);
const walk = process.cpuUsage(t1);
const ms = (u) => (u.user + u.system) / 1000;
console.log(`ts ${ts.version} load ${ms(load).toFixed(1)} ms, parse+walk ${ms(walk).toFixed(1)} ms, total ${(ms(load) + ms(walk)).toFixed(1)} ms; specifiers ${JSON.stringify(specifiers)}, resolved ${JSON.stringify(resolved)}`);
