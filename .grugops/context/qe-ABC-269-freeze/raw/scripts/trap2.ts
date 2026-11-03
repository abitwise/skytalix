import { analyse, parseFen, toFen, W } from "./lib.ts";
const { mirrorPosition } = await import(W + "evaluate.mirror-corpus.ts");
const c = ["4qb1r/r1p1kp2/1Bnpb2p/P3pQ2/P1P1P1P1/3P2PP/N5K1/R4BnR b - - 0 22", "4q3/pBp2k1r/n2pb2n/1p1Pp1p1/4Q1p1/2P1b2N/4PP1P/RN1K2R1 w - - 0 22"];
for (const f of c) {
  let ok = true; try { parseFen(f); } catch (e) { ok = false; console.log("illegal", f, String(e)); continue; }
  const a = analyse(f); const m = analyse(toFen(mirrorPosition(parseFen(f))));
  console.log(f, "w", a.w, "delta", a.delta, "full", Object.is(a.forecastFullForm, -0) ? "-0" : a.forecastFullForm, "mirrorFull", Object.is(m.forecastFullForm, -0) ? "-0" : m.forecastFullForm, "deltaForm", Object.is(a.forecast, -0) ? "-0" : a.forecast, Object.is(m.forecast, -0) ? "-0" : m.forecast);
}
