// QE ABC-134 — count ABC-136's four self-pins in raw text, the literals EVALUATED (not re-typed). Usage: pins.mjs <file>
import { readFileSync } from "node:fs";
const src = readFileSync(process.argv[2], "utf8");
const m = src.match(/const WITNESSED_EXPRESSION =\s*(\/.*\/m);/);
const WITNESSED_EXPRESSION = eval(m[1]);
const a = src.indexOf('expect(instrument, "the guard above runs');
const block = src.slice(a, src.indexOf("\n  });\n", a));
// every argument literal following a toContain( inside the pin block, evaluated as JS
const lits = [...block.matchAll(/\.toContain\(\n(?:\s*\/\/.*\n)?\s*((?:`[^`]*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')),\n\s*\);/g)].map((x) => eval(x[1]));
console.log("pins found:", lits.length);
for (const [i, l] of lits.entries()) console.log(`pin ${i}: raw count ${src.split(l).length - 1}  len ${l.length}`);
