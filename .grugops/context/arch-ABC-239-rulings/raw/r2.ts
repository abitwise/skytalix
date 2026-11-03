// R2: ABC-269 B1 (d) — the tapered centre − corner on QE's D1–D6, candidate and base tables (report).
const [WT, BASE] = process.argv.slice(2);
const { parseFen } = await import(`${WT}/src/fen.ts`);
const { TAPER_KP_ENDINGS } = await import(`${WT}/src/evaluate.taper-corpus.ts`);
const cand = await import(`${WT}/src/evaluate.ts`);
const base = await import(`${BASE}/evaluate.ts`);
const fromSide = (s: number, p: { blackToMove: boolean }, side: string) => (p.blackToMove === (side === "black") ? s : 0 - s);
for (const r of TAPER_KP_ENDINGS) {
  const c = parseFen(r.centreFen); const k = parseFen(r.cornerFen);
  const m = (ev: (p: unknown) => number) => fromSide(ev(c), c, r.walkingKing) - fromSide(ev(k), k, r.walkingKing);
  console.log(`${r.id}: tapered centre−corner cand ${m(cand.evaluate)} base ${m(base.evaluate)}; door cand ${m(cand.evaluateWithoutTaper)} (pin ${r.mainCentreMinusCorner})`);
}
