import { load, unitOf } from "./units.mjs";
const [a, b] = process.argv.slice(2);
const A = load(a), B = load(b);
console.log(`${b}: control exit=${B.ctrl.exit} ran=${B.ctrl.ran}; mutants ${B.rows.length}; odd ${B.odd.map((o) => o.id + ":" + o.ran + ":" + o.note).join(" | ") || "none"}`);
const ids = new Set(A.rows.map((r) => r.id)); const idsB = new Set(B.rows.map((r) => r.id));
console.log("same id set:", ids.size === idsB.size && [...ids].every((i) => idsB.has(i)));
const names = [...new Set([...Object.keys(A.byRow), ...Object.keys(B.byRow), ...A.rows[0] ? [] : []])];
const allRows = new Set([...A.ctrl ? [] : []]);
const unitRes = {};
for (const r of [...A.rows, ...B.rows]) for (const n of r.failed) allRows.add(n);
for (const n of [...allRows].sort()) {
  const x = (A.byRow[n] ?? []).join(" "), y = (B.byRow[n] ?? []).join(" ");
  const u = unitOf(n); unitRes[u] = (unitRes[u] ?? true) && x === y;
  console.log(`${u} ${x === y ? "SAME" : "DIFF"} ${n.replace(/^ABC-\d+ A\d+ — [^>]*?(?= (go|A\d|two))/, "")} | ${a}: ${x}${x === y ? "" : ` | ${b}: ${y}`}`);
}
console.log("per-unit parity:", JSON.stringify(unitRes));
