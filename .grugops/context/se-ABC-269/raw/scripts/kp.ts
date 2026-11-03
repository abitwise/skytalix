// se-ABC-269: B1 (d) readings (D1-D6 graded) and S1-S3 (report), centre minus corner from the walking king's side.
const W = process.argv[2];
const { evaluate, evaluateWithoutTaper } = await import(`${W}/src/evaluate.ts`);
const { parseFen } = await import(`${W}/src/fen.ts`);
const { TAPER_KP_ENDINGS, TAPER_KP_SHELTER_STRESS } = await import(`${W}/src/evaluate.taper-corpus.ts`);
const side = (s: number, p: any, k: string) => (p.blackToMove === (k === "black") ? s : 0 - s);
for (const r of [...TAPER_KP_ENDINGS, ...TAPER_KP_SHELTER_STRESS]) {
  const c = parseFen(r.centreFen), k = parseFen(r.cornerFen);
  const e = side(evaluate(c), c, r.walkingKing) - side(evaluate(k), k, r.walkingKing);
  const b = side(evaluateWithoutTaper(c), c, r.walkingKing) - side(evaluateWithoutTaper(k), k, r.walkingKing);
  console.log(r.id, r.cornerShelter, "door", b, "frozen", r.mainCentreMinusCorner, "E1", e);
}
