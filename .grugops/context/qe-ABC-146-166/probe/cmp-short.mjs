import { readFileSync } from "node:fs";
const read = (f) => {
  const g = [], p = [], a = [];
  for (const l of readFileSync(f, "utf8").split("\n")) {
    for (const [tag, arr] of [["LADDER GAME {", g], ["LADDER PAIR {", p], ["LADDER A5 {", a]]) {
      const i = l.indexOf(tag); if (i >= 0) { const o = JSON.parse(l.slice(i + tag.length - 1)); delete o.wallS; delete o.load1; delete o.commit; arr.push(JSON.stringify(o)); }
    }
  }
  return { g, p, a };
};
const [x, y] = [read(process.argv[2]), read(process.argv[3])];
for (const k of ["g", "p", "a"]) {
  const diff = x[k].map((v, i) => v === y[k][i] ? null : i).filter((i) => i !== null);
  console.log(k, x[k].length, y[k].length, diff.length === 0 && x[k].length === y[k].length ? "IDENTICAL" : `DIFFER at ${diff}`);
}
console.log("digests", x.p.map((s) => JSON.parse(s).pair + ":" + JSON.parse(s).digest).join(" "), "A5:", JSON.parse(x.a[0]).digest);
console.log("digests", y.p.map((s) => JSON.parse(s).pair + ":" + JSON.parse(s).digest).join(" "), "A5:", JSON.parse(y.a[0]).digest);
