// Copy the worktree's src/ into variants/<id>/src with one QE weakening applied (exact edits from
// qe-ABC-084/probe/weakenings.mjs, extracted by evaluating its M table as text).
import { cpSync, readFileSync, writeFileSync, rmSync } from "node:fs";
const [WT, OUTDIR] = process.argv.slice(2);
const text = readFileSync(`${WT}/.grugops/context/qe-ABC-084/probe/weakenings.mjs`, "utf8");
const table = text.slice(text.indexOf("const M = ["), text.indexOf("];", text.indexOf("const M = [")) + 2);
const M = new Function(`${table}; return M;`)();
rmSync(OUTDIR, { recursive: true, force: true });
cpSync(`${WT}/src`, `${OUTDIR}/shipped/src`, { recursive: true });
for (const [id, file, from, to, count] of M) {
  const short = id.split("-")[0];
  cpSync(`${WT}/src`, `${OUTDIR}/${short}/src`, { recursive: true });
  const p = `${OUTDIR}/${short}/${file}`;
  const orig = readFileSync(p, "utf8");
  const hits = orig.split(from).length - 1;
  if (hits !== count) throw new Error(`${id}: ${hits} hits`);
  writeFileSync(p, orig.split(from).join(to));
  console.log(short, id, file);
}
