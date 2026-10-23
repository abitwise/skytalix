// qe-ABC-178: apply each own QP1 variant to a scratch copy and replay the dialogues that define it.
import { readFileSync, writeFileSync, cpSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
const [gp, tree, work] = process.argv.slice(2);
const text = readFileSync(gp, "utf8");
const E = "src/engine.ts", U = "src/uci-session.ts";
const P = eval(text.slice(text.indexOf("const P = [") + "const P = ".length, text.indexOf("];\nconst out") + 1));
for (const id of ["QP1", "QP1a", "QP1b", "QP1c"]) {
  const p = P.find((x) => x.id === id);
  const dir = `${work}/${id}`; rmSync(dir, { recursive: true, force: true }); cpSync(`${tree}/src`, `${dir}/src`, { recursive: true });
  let m = readFileSync(`${dir}/${p.file}`, "utf8");
  for (const [a, b] of p.edits) { if (m.split(a).length !== 2) throw new Error(`${id} anchor`); m = m.replace(a, () => b); }
  writeFileSync(`${dir}/${p.file}`, m);
  const out = execFileSync(process.execPath, [`${work}/../scripts/replay.ts`, dir], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  console.log(`== ${id}\n${out}`);
}
