import { readFileSync } from "node:fs";
const R = process.argv[2]; // <worktree>/src/
const { evaluateAtPhase, passerTermsForTest, withParametersForTest } = await import(R + "evaluate.ts");
const PARAMS = await import(R + "evaluate-params.ts");
const { parseFen } = await import(R + "fen.ts");
const F = JSON.parse(readFileSync(R + "evaluate.passer-fixtures.json", "utf8"));
const byRank = (v: number[]) => [...v, 0];
const PROBED = { ...PARAMS,
  PASSED_KING_ENEMY: { mg: PARAMS.PASSED_KING_ENEMY.mg, eg: byRank(F.values.PASSED_KING_ENEMY) },
  PASSED_KING_OWN: { mg: PARAMS.PASSED_KING_OWN.mg, eg: byRank(F.values.PASSED_KING_OWN) },
  PASSED_FREE: { mg: PARAMS.PASSED_FREE.mg, eg: byRank(F.values.PASSED_FREE) },
  PASSED_UNSTOPPABLE: { mg: 0, eg: F.values.PASSED_UNSTOPPABLE } };
const pov = (p: any) => { const s = evaluateAtPhase(p, 0); return p.blackToMove ? 0 - s : s; };
let ok = 0; const miss: string[] = [];
for (const r of F.k1c) {
  const p = parseFen(r.fen);
  const base = pov(p);
  const [live, seam] = withParametersForTest(PROBED, () => [pov(p), passerTermsForTest(p)]);
  const net = seam.white.kd + seam.white.free + seam.white.un - seam.black.kd - seam.black.free - seam.black.un;
  if (live - base === net) ok++; else miss.push(`${r.id} phase ${r.phase} stm ${r.fen.split(" ")[1]}: hot ${live - base} seam ${net} diff ${live - base - net}`);
}
console.log(ok, "/", F.k1c.length); console.log(miss.join("\n"));
