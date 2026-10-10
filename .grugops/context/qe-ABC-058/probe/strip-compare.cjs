// Ground truth for "comments stripped": the TypeScript scanner (repo's own node_modules/typescript).
// Compares it with executableCodeOf's two regexes over the same file, line by line, and reports
// every line whose CODE (not comment) the regex view drops. Usage: node strip-compare.cjs <ts module dir> <file>
const ts = require(process.argv[2]);
const src = require("fs").readFileSync(process.argv[3], "utf8");
const regexView = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
const sc = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, src);
let out = "", t;
// Rescan template continuations so `${…}` bodies are tokenised as code.
const stack = [];
while ((t = sc.scan()) !== ts.SyntaxKind.EndOfFileToken) {
  if (t === ts.SyntaxKind.OpenBraceToken) stack.push("{");
  if (t === ts.SyntaxKind.TemplateHead) stack.push("t");
  if (t === ts.SyntaxKind.CloseBraceToken) { if (stack.pop() === "t") { t = sc.reScanTemplateToken(false); if (t === ts.SyntaxKind.TemplateMiddle) stack.push("t"); } }
  if (t === ts.SyntaxKind.SlashToken || t === ts.SyntaxKind.SlashEqualsToken) {
    const prev = out.trimEnd().slice(-1);
    if (!/[\w)\]]/.test(prev)) t = sc.reScanSlashToken();
  }
  if (t === ts.SyntaxKind.SingleLineCommentTrivia || t === ts.SyntaxKind.MultiLineCommentTrivia) continue;
  out += sc.getTokenText();
}
const norm = (s) => s.replace(/\s+/g, "");
const truth = norm(out), mine = norm(regexView);
console.log(`scanner view ${truth.length} non-ws chars; regex view ${mine.length}; identical: ${truth === mine}`);
const cnt = (s) => (s.match(/\bspawnSync\s*\(/g) ?? []).length;
console.log(`spawnSync( count: scanner ${cnt(out)}, regex ${cnt(regexView)}`);
if (truth !== mine) { let i = 0; while (truth[i] === mine[i]) i++; console.log("first divergence:", JSON.stringify(truth.slice(i - 40, i + 60)), "vs", JSON.stringify(mine.slice(i - 40, i + 60))); }
