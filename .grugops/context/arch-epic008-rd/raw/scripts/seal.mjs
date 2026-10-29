import { readFileSync } from "node:fs";
const [io, contextRoot, task, specPath] = process.argv.slice(2);
const cio = await import(io);
const spec = JSON.parse(readFileSync(specPath, "utf8"));
for (const n of spec.notes) {
  const note = { kind: n.kind, by: "architect-design", at: spec.at, verified_by: "", confidence: n.confidence, refs: spec.refs, supersedes: null };
  const r = cio.admitAndAppend(task, note, readFileSync(n.bodyFile, "utf8"), contextRoot);
  console.log(n.kind, JSON.stringify(r));
  if (!r.id) process.exit(1);
}
cio.render(task, contextRoot);
const back = cio.readContext(task, contextRoot);
console.log(`read back ${back.length}:`, back.map((b) => `${b.id} ${b.kind}`).join(" | "));
