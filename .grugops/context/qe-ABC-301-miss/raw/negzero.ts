// qe-ABC-301-miss: which line of B1 (a)'s "-0 traps" row is red, and do the mirrors hold. usage: node negzero.ts <tree>
const root = process.argv[2]!;
const E = await import(`${root}/src/evaluate.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { mirrorPosition } = await import(`${root}/src/evaluate.mirror-corpus.ts`);
const { TAPER_MIRROR_POSITIONS } = await import(`${root}/src/evaluate.taper-corpus.ts`);
for (const id of ["M-negzero-a", "M-negzero-b"]) {
  const row = TAPER_MIRROR_POSITIONS.find((r: { id: string }) => r.id === id);
  const p = parseFen(row.fen);
  console.log(id, "door", E.evaluateWithoutTaper(p), "evaluate", E.evaluate(p), "mirror", E.evaluate(mirrorPosition(p)), "mirror equal", Object.is(E.evaluate(p), E.evaluate(mirrorPosition(p))));
}
