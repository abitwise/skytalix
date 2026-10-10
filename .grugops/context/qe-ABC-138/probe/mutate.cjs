// Usage: node mutate.cjs <file> <anchor> <replacement> [<file> <anchor> <replacement> ...]
// Every anchor must occur EXACTLY once in its file, else exit 3 and nothing is written.
const fs = require("fs");
const a = process.argv.slice(2);
const plan = [];
for (let i = 0; i < a.length; i += 3) {
  const [f, anchor, repl] = a.slice(i, i + 3);
  const s = plan.find((p) => p.f === f)?.s ?? fs.readFileSync(f, "utf8");
  const n = s.split(anchor).length - 1;
  if (n !== 1) { console.error(`anchor occurs ${n} times in ${f}: ${JSON.stringify(anchor)}`); process.exit(3); }
  const next = s.replace(anchor, () => repl);
  const p = plan.find((q) => q.f === f); if (p) p.s = next; else plan.push({ f, s: next });
}
for (const p of plan) fs.writeFileSync(p.f, p.s);
