// fa-recount.mjs — QE's independent recount for ABC-278 A4 (qe-ABC-278). Unlike the SE's
// fa-measure.mjs it copies no regex: "before" is the ABC-277 check loaded from <old-check.js> (a copy
// of `git show <rev>:tools/grugops/records-path-check.js`), "after" is <new-check.js>. It reads every
// blob under the three record paths at <rev> with `git cat-file --batch` (no `git grep`, no line
// filter), skips a blob holding a NUL byte or named .gz/.xz (the "text record files" of A4), and
// classifies every line with each version's full foreign-argv class. Prints counts and, per newly
// hit line, the path redacted by the classes, the line number and whether another class also hits.
// Never a line's text. Usage (repo root): node fa-recount.mjs <rev> <old-check.js> <new-check.js>
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const [rev, oldPath, newPath] = process.argv.slice(2);
const load = async (p) => (await import(pathToFileURL(p).href)).classes();
const oldList = await load(oldPath);
const newList = await load(newPath);
const fa = (l) => l.find((c) => c.name === "foreign-argv").re;
const t = (re, s) => { re.lastIndex = 0; return re.test(s); };
const others = newList.filter((c) => c.name !== "foreign-argv");
const redact = (p) => newList.reduce((o, c) => o.replace(new RegExp(c.re.source, "g"), `<${c.name}>`), p);

const ls = spawnSync("git", ["ls-tree", "-r", "-z", rev, "--", ".grugops", "plans", "memory-bank"], { maxBuffer: 1 << 30 });
const entries = ls.stdout.toString("utf8").split("\0").filter(Boolean).map((e) => {
  const [meta, path] = e.split("\t");
  const [mode, type, oid] = meta.split(" ");
  return { mode, type, oid, path };
}).filter((e) => e.type === "blob" && e.mode !== "120000");
const batch = spawnSync("git", ["cat-file", "--batch"], { input: entries.map((e) => e.oid).join("\n") + "\n", maxBuffer: 2 ** 31 });
const buf = batch.stdout;
let off = 0;
let text = 0, skippedBin = 0, skippedComp = 0, before = 0, after = 0, lost = 0;
const newly = [];
for (const e of entries) {
  const nl = buf.indexOf(10, off);
  const size = Number(buf.subarray(off, nl).toString("latin1").split(" ")[2]);
  const body = buf.subarray(nl + 1, nl + 1 + size);
  off = nl + 1 + size + 1;
  if (/\.(?:gz|xz)$/i.test(e.path)) { skippedComp++; continue; }
  if (body.includes(0)) { skippedBin++; continue; }
  text++;
  const lines = body.toString("utf8").split("\n");
  for (const [k, line] of lines.entries()) {
    const o = t(fa(oldList), line);
    const a = t(fa(newList), line);
    if (o) before++;
    if (a) after++;
    if (o && !a) lost++;
    if (a && !o) newly.push(`${redact(e.path)}:${k + 1} ${others.some((c) => t(c.re, line)) ? "also-other" : "only-argv"}`);
  }
}
console.log(`rev ${rev}: ${entries.length} blobs; text ${text}; skipped NUL ${skippedBin}; skipped .gz/.xz ${skippedComp}; foreign-argv lines before ${before}, after ${after}; newly hit ${newly.length}; no longer hit ${lost}`);
for (const l of newly) console.log(`new ${l}`);
