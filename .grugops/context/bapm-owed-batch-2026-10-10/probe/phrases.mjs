// Count phrases in a file after stripping leading " * " / "// " comment prefixes and collapsing whitespace.
import { readFileSync } from "node:fs";
const t = readFileSync(process.argv[2], "utf8").replace(/^\s*(\*|\/\/)\s?/gm, "").replace(/\s+/g, " ");
for (const p of process.argv.slice(3)) console.log(t.split(p).length - 1, "|", p);
