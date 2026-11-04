// se-ABC-239b scratch: read the relation part of rows that fail first on a pin, on the file in place.
// usage (repo root as cwd): node <this> <repo>
const R = process.argv[2];
const { evaluate, evaluateWithoutMobility } = await import(`${R}/src/evaluate.ts`);
const { parseFen } = await import(`${R}/src/fen.ts`);
const { TAPER_KP_ENDINGS } = await import(`${R}/src/evaluate.taper-corpus.ts`);
const fromSide = (s: number, p: { blackToMove: boolean }, side: string) =>
  (p.blackToMove ? -s : s) * (side === "white" ? 1 : -1);
for (const r of TAPER_KP_ENDINGS) {
  const c = parseFen(r.centreFen), k = parseFen(r.cornerFen);
  console.log("B1(d)", r.id, "tapered centre-corner", fromSide(evaluate(c), c, r.walkingKing) - fromSide(evaluate(k), k, r.walkingKing), "bar >= 20");
}
const MW = "6kr/6pp/8/8/3R4/8/6PP/6K1 w - - 0 1";
const w = parseFen(MW), b = parseFen(MW.replace(" w ", " b "));
console.log("A4 evaluate(w)", evaluate(w), "> 0; evaluate(b)", evaluate(b), "< 0; premise evaluateWithoutMobility(w)", evaluateWithoutMobility(w), "== 0");
