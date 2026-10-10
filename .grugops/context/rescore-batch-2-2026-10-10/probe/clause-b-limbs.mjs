// ABC-072/073: the three clause-(b) limbs over production files (non-.test.ts under src/), at a given tree.
// Usage: node clause-b-limbs.mjs <tree>. Counts call sites over executable code (block and line comments stripped) and raw word hits.
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const tree = process.argv[2];
const files = execFileSync("git", ["-C", tree, "ls-files", "src/*.ts"], { encoding: "utf8" }).split("\n").filter((f) => f && !f.endsWith(".test.ts"));
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
const out = { production: files.length, limb1_node_import: [], limb2_process_raw: [], limb2_process_code: [], limb3_calls_code: [] };
for (const f of files) {
  const raw = readFileSync(`${tree}/${f}`, "utf8"); const code = strip(raw);
  if (/from "node:/.test(raw)) out.limb1_node_import.push(f);
  if (/process\./.test(raw)) out.limb2_process_raw.push(f);
  if (/\bprocess\./.test(code)) out.limb2_process_code.push(f);
  const m = code.match(/\b(spawn|spawnSync|exec|execSync|execFile|fork|fetch|eval)\s*\(|new\s+Function\s*\(/g);
  if (m) out.limb3_calls_code.push(`${f}: ${m.join(",")}`);
}
console.log(JSON.stringify(out, null, 1));
