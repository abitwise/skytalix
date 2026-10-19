// Copies heapToken's regex + selection from src/cli.real-engine.test.ts @ 9c97dd23 verbatim.
import { readFileSync } from "node:fs";
const src = readFileSync(process.argv[2], "utf8");
const m = /\.match\(\s*(\/\(\?:\^\|\\s\)\(--max-old-space-size=\\d\+\)\(\?=\\s\|\$\)\/g),?\s*\)/.exec(src);
if (!m) throw new Error("regex not found verbatim in source");
const re = eval(m[1]);
const pick = (s) => (s.match(re))?.at(-1)?.trim();
const SAFE = /^--max-old-space-size=[0-9]+$/;
const hand = [
  "--max-old-space-size=128", "--expose-gc --max-old-space-size=400",
  "--max-old-space-size=128;--import=evil.mjs", "--max-old-space-size=128$(touch x)",
  "--max-old-space-size=128 --import=./evil.mjs", "--import=./evil.mjs--max-old-space-size=128",
  "--max-old-space-size=128\n--require=evil", "\t--max-old-space-size=99\u00a0--require=x",
  "--max-old-space-size=١٢٣", "--max-old-space-size=12a", "--max-old-space-size=", "\"--max-old-space-size=4000\"",
  "--max_old_space_size=4000", "--max-old-space-size=128 --max-old-space-size=999999999999",
  "x--max-old-space-size=5", "--max-old-space-size=128\u2028--import=e",
];
let bad = 0, n = 0, got = 0;
const check = (s) => { n++; const t = pick(s); if (t !== undefined) { got++; if (!SAFE.test(t)) { bad++; console.log("UNSAFE", JSON.stringify(s), "->", JSON.stringify(t)); } } };
for (const s of hand) { const t = pick(s); console.log(JSON.stringify(s).padEnd(62), "->", JSON.stringify(t)); check(s); }
// random fuzz: alphabet biased toward separators, quotes, shell metachars, unicode spaces/digits
const A = ["--max-old-space-size=", "1", "2", "0", " ", "\t", "\n", "\u00a0", "\u2028", "\u3000", "\"", "'", ";", "$(", ")", "`", "|", "&", "=", "--import=", "a", "١", "\\", "-"];
let seed = 173; const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
for (let i = 0; i < 200000; i++) { let s = ""; const L = 1 + Math.floor(rnd() * 12); for (let j = 0; j < L; j++) s += A[Math.floor(rnd() * A.length)]; check(s); }
console.log(`checked ${n} strings, ${got} yielded a token, ${bad} unsafe tokens`);
