// qe-ABC-274 A6 grade (qe-ABC-269 grade-g6.mjs): every head run depth >= 6 (FAIL below), depth <= 7 WARN, each board median head >= base GRADED.
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").map((l) => JSON.parse(l));
const med = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const out = { runs: rows.length };
for (const pos of ["kiwipete", "position-6"]) {
  const b = rows.filter((r) => r.pos === pos && r.tree === "base"), h = rows.filter((r) => r.pos === pos && r.tree === "head");
  out[pos] = { B: b.map((r) => r.depth), H: h.map((r) => r.depth), medB: med(b.map((r) => r.depth)), medH: med(h.map((r) => r.depth)),
    minH: Math.min(...h.map((r) => r.depth)), minB: Math.min(...b.map((r) => r.depth)), warnH: h.filter((r) => r.depth <= 7).length, failH: h.filter((r) => r.depth < 6).length,
    nodesMedB: med(b.map((r) => r.nodes)), nodesMedH: med(h.map((r) => r.nodes)), msMax: Math.max(...rows.filter((r) => r.pos === pos).map((r) => r.ms)),
    movesH: [...new Set(h.map((r) => r.san))], movesB: [...new Set(b.map((r) => r.san))], load1: rows.filter((r) => r.pos === pos).map((r) => r.load1_before) };
}
out.verdict = (out.kiwipete.failH + out["position-6"].failH === 0 && out.kiwipete.medH >= out.kiwipete.medB && out["position-6"].medH >= out["position-6"].medB) ? "MET" : "FAIL";
console.log(JSON.stringify(out, null, 1));
