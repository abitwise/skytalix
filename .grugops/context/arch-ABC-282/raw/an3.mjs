import { readFileSync } from "node:fs";
const L = readFileSync(process.argv[2], "utf8").trim().split("\n").map((l) => JSON.parse(l));
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); const i = (s.length - 1) * p; const lo = Math.floor(i), hi = Math.ceil(i); return s[lo] + (s[hi] - s[lo]) * (i - lo); };
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const th = (r) => (r.nodes - r.nodesAtComplete) / r.nodes;
const f = (x) => x.toFixed(4);
console.log("rows", L.length, "I0 equal", L.filter((r) => r.i0).length);
const bt = L.map((r) => th(r.base)), ht = L.map((r) => th(r.head));
console.log("thrown share: base median", f(q(bt, .5)), "mean", f(mean(bt)), "p25", f(q(bt,.25)), "p75", f(q(bt,.75)), "| head median", f(q(ht, .5)), "mean", f(mean(ht)), "p75", f(q(ht,.75)), "p90", f(q(ht,.9)));
console.log("rows aborted: base", L.filter((r) => r.base.aborted).length, "head", L.filter((r) => r.head.aborted).length);
const dd = {}; for (const r of L) { const k = r.head.depth - r.base.depth; dd[k] = (dd[k] ?? 0) + 1; } console.log("head depth - base depth:", JSON.stringify(dd));
console.log("head partial kept", L.filter((r) => r.head.partial).length, "of", L.filter((r) => r.head.aborted).length, "aborted head rows");
console.log("moves differ", L.filter((r) => r.head.move !== r.base.move).length, "| of which partial", L.filter((r) => r.head.move !== r.base.move && r.head.partial).length);
const used = L.map((r) => r.head.elapsedMs / r.H), usedB = L.map((r) => r.base.elapsedMs / r.H);
console.log("head used: min", f(Math.min(...used)), "p10", f(q(used,.1)), "p25", f(q(used,.25)), "median", f(q(used, .5)), "mean", f(mean(used)), "p75", f(q(used,.75)), "max", f(Math.max(...used)), "| base used median", f(q(usedB,.5)), "max", f(Math.max(...usedB)));
console.log("firstNotIncumbent sum base", L.reduce((a, r) => a + r.base.firstNotIncumbent, 0), "head", L.reduce((a, r) => a + r.head.firstNotIncumbent, 0));
for (const H of [25, 50, 100, 200, 400]) { const s = L.filter((r) => r.H === H); console.log("H", H, "base thrown med", f(q(s.map((r) => th(r.base)), .5)), "head", f(q(s.map((r) => th(r.head)), .5)), "base depth med", q(s.map(r=>r.base.depth),.5), "head", q(s.map(r=>r.head.depth),.5), "head used med", f(q(s.map((r) => r.head.elapsedMs / H), .5)), "partial", s.filter(r=>r.head.partial).length, "aborted b/h", s.filter(r=>r.base.aborted).length, s.filter(r=>r.head.aborted).length); }
const mb = L.map((r) => r.base.depth), mh = L.map((r) => r.head.depth); console.log("mean depth base", f(mean(mb)), "head", f(mean(mh)));
