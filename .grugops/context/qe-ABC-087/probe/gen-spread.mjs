// QE probe: is the count of draws < p among the first n draws of seededRandom(seed) Binomial(n, p)?
// Imports src/levels.ts from the copy root given as argv[2]; no engine call is made by this probe.
const root = process.argv[2];
const { seededRandom } = await import(`${root}/src/levels.ts`);
const p = 0.4;
for (const [n, label] of [[204, "ENDGAMES"], [246, "perft+puzzles"], [150, "A9 5x30"]]) {
  for (const [lo, hi] of [[1, 20], [1, 1000], [1_000_000, 1_001_000]]) {
    let out = 0, sum = 0, sumsq = 0, N = 0;
    for (let seed = lo; seed <= hi; seed++) {
      const g = seededRandom(seed);
      let k = 0;
      for (let i = 0; i < n; i++) if (g() < p) k++;
      const f = k / n;
      if (Math.abs(f - p) > 0.05 + 1e-12) out++;
      sum += f; sumsq += f * f; N++;
    }
    const mean = sum / N, sd = Math.sqrt(sumsq / N - mean * mean);
    console.log(`${label} n=${n} seeds ${lo}..${hi}: outside ±5pp ${out}/${N} (${(100*out/N).toFixed(1)}%), mean ${(100*mean).toFixed(2)}%, sd ${(100*sd).toFixed(2)}pp; binomial sd ${(100*Math.sqrt(p*(1-p)/n)).toFixed(2)}pp`);
  }
}
// Exact binomial tail for reference
function tail(n) { const lgam = (x)=>{let s=0; for(let i=2;i<=x;i++) s+=Math.log(i); return s;};
  let pr = 0; for (let k = 0; k <= n; k++) { if (Math.abs(k/n - p) > 0.05 + 1e-12) pr += Math.exp(lgam(n)-lgam(k)-lgam(n-k)+k*Math.log(p)+(n-k)*Math.log(1-p)); } return pr; }
for (const n of [204, 246, 150]) console.log(`exact P(outside ±5pp | Binomial(${n}, 0.4)) = ${(100*tail(n)).toFixed(1)}%`);
