// QE ABC-133 A2: every string-like literal whose text is (node:)child_process, by line, and whether its parent is a module specifier.
const ts = require("typescript"); const fs = require("fs");
const f = process.argv[2]; const sf = ts.createSourceFile(f, fs.readFileSync(f, "utf8"), ts.ScriptTarget.Latest, true);
const out = [];
const visit = (n) => { if (ts.isStringLiteralLike(n) && /^(node:)?child_process$/.test(n.text)) {
  const p = n.parent; const spec = (ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) && p.moduleSpecifier === n;
  out.push(`${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1}:${spec ? "specifier" : ts.SyntaxKind[p.kind]}`); }
  ts.forEachChild(n, visit); };
visit(sf); console.log(`literals ${out.length}: ${out.join(" ")}`);
