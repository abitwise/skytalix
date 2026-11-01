// qe-ABC-248 A7 table. usage: node census-table.mjs <censusDir>
import { readFileSync } from "node:fs";
import { join } from "node:path";
const [dir] = process.argv.slice(2);
const load = (l) => new Map(readFileSync(join(dir, `census-${l}.tsv`), "utf8").trim().split("\n").map((x) => { const [n, v, s] = x.split("\t"); return [n, { v: +v, s: +s }]; }));
const B = load("B"), H = load("H");
const map = {
  "QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical > position-6, readings 3 to 25: 0 mutated roots, and aborts landing inside a null subtree": ["T2c-a", "QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical > position-6, the even readings 4 to 24: 0 mutated roots, and aborts landing inside a null subtree"],
  "QE-208-b — the null child's key is written: every table probe reads the key of the position it probes > search() on position-6 at depth 6": ["T2c-b", "QE-208-b — the null child's key is written: every table probe reads the key of the position it probes > search() on startpos at depth 6"],
  "QE-208-b — the null child's key is written: every table probe reads the key of the position it probes > chooseMove on position-6 deepened to 6": ["T2c-b", "QE-208-b — the null child's key is written: every table probe reads the key of the position it probes > chooseMove on startpos deepened to 6"],
};
const A4a2 = "ABC-167 A4 — bad input holds no position > A4-a2: an echoed control character in a go value is dropped from the info string";
map[A4a2] = ["T2d", A4a2];
const A5 = "ABC-167 A5 — the D4 time rule, read from the info line's time > ";
let sumB = 0, sumH = 0, bad = 0, other = 0;
for (const [n, x] of B) {
  sumB += x.v;
  if (map[n]) {
    const y = H.get(map[n][1]);
    const ok = y.v < x.v; if (!ok) bad++;
    console.log(`${map[n][0]}\t${x.v}\t${y.v}\t${y.v - x.v}\t${ok ? "fewer" : "NOT FEWER"}\tsearches ${x.s}/${y.s}\t${n.split(" > ").at(-1).slice(0, 60)}`);
  } else if (n.startsWith(A5) && !H.has(n)) {
    console.log(`T2a MOVED\t${x.v}\t(deep)\t${-x.v}\tleaves\tsearches ${x.s}/-\t${n.slice(A5.length, A5.length + 60)}`);
  } else if (n.startsWith(A5) && /white reads wtime|black reads btime/.test(n)) {
    const y = H.get(n); console.log(`T2a STAYED\t${x.v}\t${y.v}\t${y.v - x.v}\t${y.v === x.v ? "same" : "DIFF"}\tsearches ${x.s}/${y.s}\t${n.slice(A5.length, A5.length + 60)}`);
  } else { const y = H.get(n); if (!y) { console.log(`UNMAPPED B-only ${n}`); bad++; } else if (y.v !== x.v) { other++; console.log(`OTHER-DIFF ${x.v} -> ${y.v} ${n}`); } }
}
for (const [n, y] of H) sumH += y.v;
const hOnly = [...H.keys()].filter((n) => !B.has(n) && !Object.values(map).some((m) => m[1] === n));
console.log(`H-only names not mapped: ${hOnly.length}; other rows with a node difference: ${other}`);
console.log(`two-file default-lane nodes: B ${sumB} H ${sumH} delta ${sumH - sumB}; changed rows not strictly fewer: ${bad}`);
