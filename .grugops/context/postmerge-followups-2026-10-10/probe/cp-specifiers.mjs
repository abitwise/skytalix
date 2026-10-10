// F-058-1: every MODULE-SPECIFIER position naming child_process in src/cli.test.ts (static import,
// export-from, dynamic import(), require()), versus every string literal with that text.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const root = process.argv[2];
const ts = createRequire(`${root}/package.json`)("typescript");
const sf = ts.createSourceFile("cli.test.ts", readFileSync(`${root}/src/cli.test.ts`, "utf8"), ts.ScriptTarget.Latest, true);
const isCp = (n) => n && ts.isStringLiteralLike(n) && /^(node:)?child_process$/.test(n.text);
const line = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
const spec = [], literal = [];
const visit = (n) => {
  if (isCp(n)) literal.push(line(n));
  if ((ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) && isCp(n.moduleSpecifier)) spec.push(`static@${line(n)}`);
  if (ts.isCallExpression(n) && isCp(n.arguments[0]) &&
      (n.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(n.expression) && n.expression.text === "require")))
    spec.push(`${n.expression.getText(sf)}()@${line(n)}`);
  ts.forEachChild(n, visit);
};
visit(sf);
console.log(`specifier positions ${spec.length} ${JSON.stringify(spec)}; string literals with that text ${literal.length} at ${JSON.stringify(literal)}`);
