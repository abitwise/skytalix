// Security/NFR ABC-133: the promotion-trigger check for AR-133-LOADER, and a dry run of QE's cheap
// widening for QE-133-a. Over the TypeScript parser's view of <file>, it lists:
//   (a) every call whose FIRST ARGUMENT is a string naming (node:)child_process, whatever the callee;
//   (b) every call node whose callee text contains `createRequire` (one site = two nested call nodes);
//   (c) every IDENTIFIER named `spawnSync` that is not inside a type node, with its parent's kind —
//       a dry run of a reference count, which would see a wrapped callee (QE-133-b), a variable
//       alias (Q14) and Reflect.apply (QE-133-c) without data flow.
// A clean delivered tree reads (a) [], (b) the pin's own `typescript` load at one site, and (c) the
// import binding plus the call in `childOf`.
// Usage: node loader-scan.mjs <path/to/cli.test.ts>
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const ts = createRequire(import.meta.url)("typescript");
const file = process.argv[2];
const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
const line = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
const a = []; const b = []; const c = [];
const visit = (n) => {
  if (ts.isCallExpression(n)) {
    const arg = n.arguments[0];
    if (arg && ts.isStringLiteralLike(arg) && /^(node:)?child_process$/.test(arg.text)) a.push(`${n.expression.getText(sf)}@${line(n)}`);
    if (n.expression.getText(sf).includes("createRequire")) b.push(`${n.getText(sf).slice(0, 60)}@${line(n)}`);
  }
  if (ts.isIdentifier(n) && n.text === "spawnSync" && !ts.findAncestor(n, ts.isTypeNode)) c.push(`${ts.SyntaxKind[n.parent.kind]}@${line(n)}`);
  ts.forEachChild(n, visit);
};
visit(sf);
console.log(JSON.stringify({ file, childProcessArgCalls: a, createRequireSites: b, spawnSyncValueRefs: c }));
