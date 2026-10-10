import { readFileSync } from "node:fs";
const s = readFileSync(process.argv[2], "utf8");
const a = "\n    const production = productionModulesIn(directory);\n    const runtimeImporters = production.filter((file) =>\n";
const b = '\n    const runtimeImporters = production.filter((file) =>\n      /^(?:import|export)\\s+(?!type\\b)(?:[^;]*from\\s+)?"\\.\\/history\\.ts";/m.test(\n        readFileSync(`${directory}${file}`, "utf8"),\n      ),\n    );\n';
let ok = 0; const N = 100000; const t = process.hrtime.bigint();
for (let i = 0; i < N; i++) ok += (s.includes(a) ? 1 : 0) + (s.includes(b) ? 1 : 0);
console.log(`file ${s.length} chars; both pins found ${ok / N}x; ${(Number(process.hrtime.bigint() - t) / N / 1000).toFixed(2)} us per pair of includes`);
