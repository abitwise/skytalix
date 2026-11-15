// qe-ABC-325: is a src/ change comment-only? Scan two versions of a file with the TypeScript scanner,
// drop trivia (whitespace and comments), and compare the token streams. Read-only.
// Usage: node src_tokens.mjs <worktree> <old file> <new file>
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const [wt, a, b] = process.argv.slice(2);
const ts = createRequire(`${wt}/package.json`)("typescript");
const tokens = (path) => {
  const sc = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.Standard, readFileSync(path, "utf8"));
  const out = [];
  for (let k = sc.scan(); k !== ts.SyntaxKind.EndOfFileToken; k = sc.scan()) out.push(`${k}:${sc.getTokenText()}`);
  return out;
};
const ta = tokens(a), tb = tokens(b);
const same = ta.length === tb.length && ta.every((t, i) => t === tb[i]);
console.log(JSON.stringify({ tokens_old: ta.length, tokens_new: tb.length, code_tokens_identical: same }));
