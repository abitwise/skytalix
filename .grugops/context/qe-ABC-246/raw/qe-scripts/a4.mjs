// qe-ABC-246 A4 (a) (PREREG section 4): is the src/engine.test.ts diff comment-only?
// 1. every changed line (unified diff, -U0) after trim starts with "/**", "*" or "*/";
// 2. the file with every /* */ block and // line comment removed, whitespace collapsed, is equal at base and head.
// usage: node a4.mjs <repo> <base> <head>
import { execFileSync } from "node:child_process";
const [repo, base, head] = process.argv.slice(2);
const F = "src/engine.test.ts";
const diff = execFileSync("git", ["-C", repo, "diff", "-U0", base, head, "--", F], { encoding: "utf8" });
const changed = diff.split("\n").filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---) /.test(l));
const bad = changed.filter((l) => !/^(\/\*\*|\*\/|\*)/.test(l.slice(1).trim()));
console.log(`changed lines: ${changed.length} (removed ${changed.filter((l) => l[0] === "-").length}, added ${changed.filter((l) => l[0] === "+").length})`);
for (const l of changed) console.log(`  ${l}`);
console.log(`non-comment changed lines: ${bad.length}`);
// Strip comments with a small scanner that respects string and template literals.
const strip = (s) => {
  let o = "", i = 0;
  while (i < s.length) {
    const c = s[i], n = s[i + 1];
    if (c === "/" && n === "*") { const e = s.indexOf("*/", i + 2); i = e + 2; continue; }
    if (c === "/" && n === "/") { while (i < s.length && s[i] !== "\n") i++; continue; }
    if (c === '"' || c === "'" || c === "`") { const q = c; o += c; i++; while (i < s.length && s[i] !== q) { if (s[i] === "\\") { o += s[i++]; } o += s[i++]; } o += s[i++] ?? ""; continue; }
    o += c; i++;
  }
  return o.replace(/\s+/g, " ").trim();
};
const show = (rev) => execFileSync("git", ["-C", repo, "show", `${rev}:${F}`], { encoding: "utf8" });
const eq = strip(show(base)) === strip(show(head));
console.log(`code tokens (comments stripped, whitespace collapsed) equal at base and head: ${eq}`);
console.log(`A4(a) ${bad.length === 0 && eq ? "MET" : "NOT MET"}`);
