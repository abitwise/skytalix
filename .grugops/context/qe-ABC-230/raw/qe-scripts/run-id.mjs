// qe-ABC-230: node port of se-ABC-230/raw/run-id.sh (same parts, same order, base and head in parallel per part).
// usage: node run-id.mjs <dir holding id.mjs, base/, head/>
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { openSync, readFileSync, closeSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
const runOne = (tree, part) =>
  new Promise((ok, fail) => {
    const file = join(dir, `out-${tree}-${part}.jsonl`);
    const fd = openSync(file, "w");
    const c = spawn(process.execPath, [join(dir, "id.mjs"), join(dir, tree), part], { stdio: ["ignore", fd, "inherit"] });
    c.on("exit", (code) => {
      closeSync(fd);
      code === 0 ? ok(file) : fail(new Error(`${tree} ${part} exit ${code}`));
    });
  });
for (const part of ["corpus", "choose", "choose-empty", "clock0", "doors-prior", "level", "level-empty", "nonvac"]) {
  const [b, h] = await Promise.all([runOne("base", part), runOne("head", part)]);
  const hb = createHash("sha256").update(readFileSync(b)).digest("hex").slice(0, 16);
  const hh = createHash("sha256").update(readFileSync(h)).digest("hex").slice(0, 16);
  const text = readFileSync(h, "utf8");
  const n = text.split("\n").length - 1;
  const impure = (text.match(/"pure":false/g) ?? []).length;
  let diff = 0;
  if (hb !== hh) {
    const lb = readFileSync(b, "utf8").split("\n");
    const lh = text.split("\n");
    for (let i = 0; i < lh.length; i++) if (lb[i] !== lh[i]) diff++;
  }
  console.log(`${part} rows=${n} base=${hb} head=${hh} ${hb === hh ? "EQUAL" : `DIFFER (${diff} rows)`} impure_head=${impure}`);
}
