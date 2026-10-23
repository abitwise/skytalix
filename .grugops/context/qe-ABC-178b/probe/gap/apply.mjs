// apply one gp entry (by id) to a copy of <tree>/src at <dir>/src
import { readFileSync, writeFileSync, cpSync, rmSync } from "node:fs";
const [gp, tree, dir, id] = process.argv.slice(2);
const text = readFileSync(gp, "utf8"); const E = "src/engine.ts", U = "src/uci-session.ts";
const P = eval(text.slice(text.indexOf("const P = [") + "const P = ".length, text.indexOf("];\nconst out") + 1));
const p = P.find((x) => x.id === id);
rmSync(dir, { recursive: true, force: true }); cpSync(`${tree}/src`, `${dir}/src`, { recursive: true });
let m = readFileSync(`${dir}/${p.file}`, "utf8");
for (const [a, b] of p.edits ?? []) { if (m.split(a).length !== 2) throw new Error(`${id} anchor`); m = m.replace(a, () => b); }
writeFileSync(`${dir}/${p.file}`, m);
