// qe-EPIC-010-m1-batch-2: QE's own copy of cutechess-cli 1.5.1's Elo formula (elo.cpp) and the score
// half-width, from skytalix's W/L/D counted in the PGNs of each build's blocks.
// usage: node elo.mjs <out-dir>     (reads <out>/{base,candidate}/b*/r.pgn)
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
const out = process.argv[2];
function erfInv(x) { // Winitzki's approximation as in cutechess-cli 1.5.1 elo.cpp, with its truncated pi
  const pi = 3.1415926535897, a = (8 * (pi - 3)) / (3 * pi * (4 - pi));
  const y = Math.log(1 - x * x), z = 2 / (pi * a) + y / 2;
  const r = Math.sqrt(Math.sqrt(z * z - y / a) - z);
  return x < 0 ? -r : r;
}
const phiInv = (p) => Math.SQRT2 * erfInv(2 * p - 1);
const diff = (p) => -400 * Math.log10(1 / p - 1);
function elo(W, L, D) {
  const n = W + L + D, w = W / n, l = L / n, d = D / n, mu = w + d / 2;
  const sd = Math.sqrt(w * (1 - mu) ** 2 + l * mu ** 2 + d * (0.5 - mu) ** 2) / Math.sqrt(n);
  const margin = (diff(mu + phiInv(0.975) * sd) - diff(mu + phiInv(0.025) * sd)) / 2;
  const varPop = w * (1 - mu) ** 2 + l * mu ** 2 + d * (0.5 - mu) ** 2;
  return { n, mu, x: diff(mu), y: margin, half: 1.96 * Math.sqrt(varPop / n) };
}
const res = {};
for (const build of ["base", "candidate"]) {
  let W = 0, L = 0, D = 0, blocks = 0;
  const dir = join(out, build);
  for (const b of readdirSync(dir).filter((n) => /^b\d\d$/.test(n)).sort()) {
    const pgn = join(dir, b, "r.pgn");
    if (!existsSync(pgn)) continue;
    blocks++;
    for (const g of readFileSync(pgn, "utf8").split(/\n(?=\[Event )/).filter((x) => x.includes("[Event "))) {
      const white = /^\[White "(.*)"\]$/m.exec(g)[1], r = /^\[Result "(.*)"\]$/m.exec(g)[1];
      const sky = white === "skytalix" ? "w" : "b";
      if (r === "1/2-1/2") D++;
      else if ((r === "1-0") === (sky === "w") && r !== "*") W++;
      else if (r === "1-0" || r === "0-1") L++;
      else throw new Error(`${pgn}: result ${r}`);
    }
  }
  const e = elo(W, L, D);
  res[build] = e;
  console.log(`${build}: blocks ${blocks}; W/L/D ${W}/${L}/${D} (N ${e.n}); score ${(100 * e.mu).toFixed(2)} % ± ${(100 * e.half).toFixed(2)} points (95 %); Elo ${e.x.toFixed(2)} ± ${e.y.toFixed(2)} (one decimal: ${e.x.toFixed(1)} ± ${e.y.toFixed(1)})`);
}
const bx = Number(res.base.x.toFixed(1)), by = Number(res.base.y.toFixed(1));
const cx = Number(res.candidate.x.toFixed(1)), cy = Number(res.candidate.y.toFixed(1));
const X = cx - bx, Y = Math.sqrt(by ** 2 + cy ** 2);
console.log(`pair (one-decimal inputs): X = ${cx} − ${bx} = ${X.toFixed(1)}; Y = √(${by}² + ${cy}²) = ${Y.toFixed(1)}; X + Y = ${(Number(X.toFixed(1)) + Number(Y.toFixed(1))).toFixed(1)} → ${Number(X.toFixed(1)) + Number(Y.toFixed(1)) < 0 ? "LOSS" : "not LOSS"}`);
