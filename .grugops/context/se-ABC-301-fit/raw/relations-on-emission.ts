import { BOUNDS } from "<repo>/tools/tune/bounds.ts";
import * as T from "<repo>/tools/tune/tune.ts";
import { SHIPPED } from "<repo>/tools/tune/tracer.ts";
import { evaluate, evaluateWithoutMobility, withParametersForTest } from "<repo>/src/evaluate.ts";
import * as P from "<repo>/src/evaluate-params.ts";
import { parseFen } from "<repo>/src/fen.ts";
let red = 0;
BOUNDS.forEach((r, k) => {
  const fams = new Set(r.terms.flatMap((t) => t.without ?? []));
  const plain = (x: string) => evaluate(parseFen(x));
  let read: number;
  if (fams.size === 0) read = r.terms.reduce((s, t) => s + t.coef * plain(t.fen), 0);
  else if (fams.has("MOBILITY_WEIGHT")) { const p = parseFen(r.terms[0]!.fen); read = -(evaluate(p) - evaluateWithoutMobility(p)); }
  else { const z: Record<string, unknown> = { ...P }; for (const n of fams) z[n] = { mg: 0, eg: 0 }; read = withParametersForTest(z as never, () => r.terms.reduce((s, t) => s + t.coef * plain(t.fen), 0)); }
  const ok = r.strict ? read < r.rhs : read <= r.rhs;
  if (!ok) red++;
  console.log(k + 1, ok ? "green" : "RED", "engine", read, "tool", T.readBound(r, SHIPPED), "rhs", r.rhs, r.strict ? "strict" : "", (r.part ?? "") );
});
console.log("red", red, "of", BOUNDS.length);
