// Re-derives the pin's two counts over a given cli.test.ts, on BOTH views (raw and comments stripped),
// with the exact regexes the row uses. Usage: node pin-count.mjs <path/to/cli.test.ts>
import { readFileSync } from "node:fs";
const raw = readFileSync(process.argv[2], "utf8");
const stripped = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
for (const [name, s] of [["raw", raw], ["stripped", stripped]]) {
  const imported = [...s.matchAll(/import\s*\{([^}]*)\}\s*from\s*"node:child_process"/g)].map((m) => m[1].trim());
  const calls = [...s.matchAll(/\bspawnSync\s*\(/g)].map((m) => s.slice(0, m.index).split("\n").length);
  console.log(`${name}: imported ${JSON.stringify(imported)}, spawnSync( count ${calls.length}`);
}
const lines = stripped.split("\n");
console.log("stripped call-site line text:", lines.find((l) => /\bspawnSync\s*\(/.test(l))?.trim());
const m = raw.match(/const CHILDREN = \{([\s\S]*?)\n\};/);
const keys = m[1].replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").match(/^\s{2}[A-Za-z0-9_]+:/gm);
console.log("CHILDREN top-level keys (static):", keys.length);
const n8 = raw.match(/const N8_SPAWN = ([^;]+);/)[1];
console.log("N8_SPAWN =", n8, "=", n8.split("+").reduce((a, b) => a + Number(b), 0));
