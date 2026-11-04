// se-ABC-270: QE_ROWS in src/evaluate.queen-on.test.ts deep-equals pairs.json's rows (the copy is unchanged).
import { readFileSync } from "node:fs"; import { isDeepStrictEqual } from "node:util"; import { createHash } from "node:crypto";
const [testFile, pairsFile] = process.argv.slice(2);
const src = readFileSync(testFile, "utf8"); const start = src.indexOf("const QE_ROWS: readonly QueenRow[] = ") + "const QE_ROWS: readonly QueenRow[] = ".length;
const end = src.indexOf("\n];\n", start) + 2; const rows = Function(`return ${src.slice(start, end)};`)();
const pairsText = readFileSync(pairsFile); const pairs = JSON.parse(pairsText);
console.log(JSON.stringify({ pairsSha256: createHash("sha256").update(pairsText).digest("hex"), rows: rows.length, deepEqual: isDeepStrictEqual(rows, pairs.rows) }));
