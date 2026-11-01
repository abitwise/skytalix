// qe-ABC-248 parity read (QE's own). usage: node parity.mjs <kill-B.jsonl> <kill-H.jsonl> <uci|nm>
import { readFileSync } from "node:fs";

const [bp, hp, kind] = process.argv.slice(2);
const load = (p) => readFileSync(p, "utf8").trim().split("\n").map((l) => JSON.parse(l));
const B = load(bp), H = load(hp);
const strip = (f) => f.replace(/^src\/\S+ :: /, "");
const ctl = (x) => x.find((r) => r.id === "CONTROL");
console.log(`CONTROL B ran ${ctl(B).ran} failed ${ctl(B).failed.length} pending ${ctl(B).pending} | H ran ${ctl(H).ran} failed ${ctl(H).failed.length} pending ${ctl(H).pending}`);
const mut = (x) => x.filter((r) => r.id !== "CONTROL");
console.log(`same ids in same order: ${mut(B).map((r) => r.id).join() === mut(H).map((r) => r.id).join()} (${mut(B).length})`);
const kset = (x) => new Set(mut(x).filter((r) => r.failed.length > 0).map((r) => r.id));
const kb = kset(B), kh = kset(H);
const lost = [...kb].filter((i) => !kh.has(i)), gained = [...kh].filter((i) => !kb.has(i));
console.log(`killed B ${kb.size} H ${kh.size}; LOST {${lost.join(",") || "-"}}; gained {${gained.join(",") || "-"}}`);
console.log(`survivors B {${mut(B).filter((r) => !kb.has(r.id)).map((r) => r.id).join(",")}}`);
console.log(`survivors H {${mut(H).filter((r) => !kh.has(r.id)).map((r) => r.id).join(",")}}`);
console.log(`suite errors B ${mut(B).filter((r) => r.suiteErrors > 0).map((r) => r.id).join(",") || "-"} H ${mut(H).filter((r) => r.suiteErrors > 0).map((r) => r.id).join(",") || "-"}`);
const rowKills = (x, s) => mut(x).filter((r) => r.failed.some((f) => strip(f).includes(s))).map((r) => r.id).sort().join(",");
const pairs = kind === "uci"
  ? [
      ["ABC-167 A4 — bad input holds no position > A4-a2", null],
      ["> white reads wtime", null], ["> black reads btime", null], ["> a short clock", null],
      ["> A5-b1", null], ["> A5-b2", null], ["> A5-b4", null], ["> A5-b5", null], ["> A5-c1", null],
      ["read from the info line's time > movetime 100", "MOVED"], ["read from the info line's time > G = 3 500", "MOVED"],
      ["read from the info line's time > a bare go", "MOVED"], ["read from the info line's time > A5-b3", "MOVED"],
    ]
  : [
      ["QE-208-a", null],
      ["QE-208-b — the null child's key is written: every table probe reads the key of the position it probes > search()", null],
      ["QE-208-b — the null child's key is written: every table probe reads the key of the position it probes > chooseMove", null],
    ];
for (const [s, moved] of pairs) {
  const b = rowKills(B, s), h = rowKills(H, s);
  console.log(`${moved ? "MOVED" : b === h ? "SAME " : "DIFF "} "${s}": B {${b || "-"}} H {${h || "-"}}`);
}
// ruling 3, re-derived from B's per-row sets: for each moved row, every id it kills at B is killed at H by some row.
if (kind === "uci") {
  for (const s of ["movetime 100", "G = 3 500", "a bare go", "A5-b3"]) {
    const ids = rowKills(B, `read from the info line's time > ${s}`).split(",").filter(Boolean);
    const unc = ids.filter((i) => !kh.has(i));
    console.log(`moved "${s}": B kills ${ids.length}; killed at H by the default lane: ${ids.length - unc.length}; uncovered {${unc.join(",") || "-"}}`);
  }
  for (const id of ["WRONGSIDE", "WS-WHITE", "WS-BLACK"]) {
    const r = mut(H).find((x) => x.id === id);
    console.log(`${id} at H killed by: ${r.failed.map(strip).join(" | ") || "NONE"}`);
  }
}
console.log(lost.length === 0 ? "PARITY HOLDS (file level)" : "PARITY FAILS (file level)");
