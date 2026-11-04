import { readFileSync } from "node:fs";
import * as P from "<worktree>/src/evaluate-params.ts";
import { passerTermsForTest, withParametersForTest, phaseOf } from "<worktree>/src/evaluate.ts";
import { parseFen } from "<worktree>/src/fen.ts";
const fx = JSON.parse(readFileSync("<worktree>/.grugops/context/qe-ABC-271-freeze/raw/fixtures.json", "utf8"));
const v = fx.values;
const pad = (a: number[]) => [...a, 0];
const probed = { ...P,
  PASSED_KING_ENEMY: { mg: P.PASSED_KING_ENEMY.mg, eg: pad(v.PASSED_KING_ENEMY) },
  PASSED_KING_OWN: { mg: P.PASSED_KING_OWN.mg, eg: pad(v.PASSED_KING_OWN) },
  PASSED_FREE: { mg: P.PASSED_FREE.mg, eg: pad(v.PASSED_FREE) },
  PASSED_UNSTOPPABLE: { mg: 0, eg: v.PASSED_UNSTOPPABLE } };
let bad = 0;
withParametersForTest(probed, () => {
  for (const r of fx.k1c) {
    const p = parseFen(r.fen);
    const got = passerTermsForTest(p);
    const ok = JSON.stringify(got) === JSON.stringify({ white: r.white.seam, black: r.black.seam }) && phaseOf(p) === r.phase;
    if (!ok) { bad++; console.log("FAIL", r.id, JSON.stringify(got), JSON.stringify(r.white.seam), JSON.stringify(r.black.seam)); }
  }
});
console.log("k1c", fx.k1c.length, "bad", bad, "k1a", fx.k1a.length, Object.keys(fx.k1a[0]));
