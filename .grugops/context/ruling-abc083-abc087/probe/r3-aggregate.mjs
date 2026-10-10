// Aggregates r3-scores-*.out.jsonl: what each blunder rule would play.
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").map((l) => JSON.parse(l)).filter((r) => r.moves >= 2);
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[s.length >> 1] : null; };
for (const set of ["corpus184", "puzzles40"]) {
  const R = rows.filter((r) => r.set === set);
  const withC = R.filter((r) => r.secondLoss !== null);
  const sec = withC.map((r) => r.secondLoss);
  const out = {
    set, positions: R.length,
    rank2TiesBest: R.filter((r) => r.tieTop).length,
    noCandidate: R.length - withC.length,
    allEqual: R.filter((r) => r.distinct === 1).length,
    second_medianLoss: med(sec),
    second_P300: +(sec.filter((x) => x >= 300).length / sec.length).toFixed(3),
    uniformMiddle_meanP300: +(withC.reduce((a, r) => a + r.uniP300, 0) / withC.length).toFixed(3),
    uniformMiddle_medianOfMeanLoss: med(withC.map((r) => r.uniMeanLoss)),
    uniformNonWorst_meanP300: +(R.filter((r) => r.nonWorstP300 !== null).reduce((a, r) => a + r.nonWorstP300, 0) / R.filter((r) => r.nonWorstP300 !== null).length).toFixed(3),
  };
  console.log(JSON.stringify(out));
}
