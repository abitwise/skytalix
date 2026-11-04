import sys
P, O = sys.argv[1], sys.argv[2]
def edit(name, pairs):
    s = open(f"{O}/{name}.test.ts.orig").read()
    for old, new in pairs:
        assert s.count(old) == 1, (name, old[:70])
        s = s.replace(old, new)
    open(f"{P}/src/{name}.test.ts", "w").write(s)
T1 = 'position-6, the even readings 4 to 24: 0 mutated roots, and aborts landing inside a null subtree'
edit("search.null-move", [(
  f'  it("{T1}", () => {{',
  '''  it("position-6, readings 8 and 10 on chooseMoveWithoutTaper: 0 mutated roots, an abort inside a null subtree", () => {
    const { mutated, insideNull } = sweep(fenOf("position-6"), [8, 10], chooseMoveWithoutTaper);
    expect(mutated).toEqual([]);
    expect(insideNull).toBeGreaterThanOrEqual(1);
  });
''' + f'  if (RUN_DEEP) it("{T1} [deep, SEARCH_DEEP=1]", () => {{')])
T2 = 'A4: an empty list is node-equal to an absent one over the endgames and the thirty'
edit("engine", [(
  f'  it("{T2}", () => {{',
  '''  it("A4 (slice): an empty list is node-equal to an absent one on kr-corner, startpos and position-6", () => {
    const corpus = [
      ...ENDGAME_CORPUS.filter(({ name }) => name === "kr-corner").map(({ name, fen }) => ({ name, position: parseFen(fen) })),
      ...thirtyPositions().filter(({ name }) => name === "startpos" || name === "position-6"),
    ];
    expect(corpus).toHaveLength(3);
    for (const { name, position } of corpus) {
      const fen = toFen(position);
      const absent = chooseMove(parseFen(fen), { budgetMs: 5, now: tickingClock(1) });
      const empty = chooseMove(parseFen(fen), { budgetMs: 5, now: tickingClock(1), priorKeys: [] });
      expect(figures(empty), name).toEqual(figures(absent));
    }
  });
''' + f'  if (RUN_DEEP) it("{T2}", () => {{')])
edit("levels", [(
  'describe("A9 — different seeds actually differ", () => {',
  '''describe("QE-087-d (slice) — one draw per move: seed 1 over the first 10 of the thirty", () => {
  it("move k is a non-engine move iff the k-th draw of a fresh seededRandom(1) is below the rate", () => {
    const fens = THIRTY.slice(0, 10);
    const choices = playAll(easiest, 1, fens);
    const draws = seededRandom(1);
    for (const choice of choices) expect(choice.kind !== "engine").toBe(draws() < easiest.blunderRate);
    expect(choices.some((c) => c.kind !== "engine")).toBe(true);
    expect(choices.some((c) => c.kind === "engine")).toBe(true);
  });
});

if (RUN_DEEP) describe("A9 — different seeds actually differ [deep]", () => {''')])
print("tip sketch written")
