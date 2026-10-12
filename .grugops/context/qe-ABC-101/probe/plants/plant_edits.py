# qe-ABC-101 plants: each applies exact-string edits to a scratch copy of 98ea0a84 and asserts every old string is present once.
import sys, pathlib
ROOT = pathlib.Path(sys.argv[2])
SEED = "{ seed: Math.floor(Math.random() * 2 ** 32) }"
ENGINE = """      engine: withBook(
        book,
        createLevelSeam(difficulty, { seed: Math.floor(Math.random() * 2 ** 32) }),
      ),"""
P = {
 "P1-seam-ignores-level": [("src/level-seam.ts", "createLevel(LEVELS[level as keyof typeof LEVELS], options)", "createLevel(LEVELS[3], options)")],
 "P2-in-not-hasOwn": [("src/level-seam.ts", "if (!Object.hasOwn(LEVELS, level))", "if (!(level in LEVELS))")],
 "P3-number-range-check": [("src/cli-options.ts", """      const value = DIFFICULTY_VALUES.find((candidate) => candidate === next);
      if (value === undefined) return reject(MISSING_DIFFICULTY, next ?? token);
      difficulty = Number(value) as Difficulty;""", """      const value = Number(next);
      if (next === undefined || !Number.isInteger(value) || value < 1 || value > 5)
        return reject(MISSING_DIFFICULTY, next ?? token);
      difficulty = value as Difficulty;""")],
 "P4-root-fixed-level": [("src/cli.ts", "createLevelSeam(difficulty, {", "createLevelSeam(3, {")],
 "P4b-root-fixed-level-shadowed": [("src/cli.ts", "const { colour, orientation, flags, difficulty } = resolution.options;",
     "const { colour, orientation, flags, difficulty: chosen } = resolution.options;\n  void chosen;\n  const difficulty = 3;")],
 "P5-now-at-root": [("src/cli.ts", SEED, "{ seed: Math.floor(Math.random() * 2 ** 32), now: Date.now }")],
 "P5b-now-at-root-literal-kept-in-comment": [("src/cli.ts", ENGINE,
     "      // was: createLevelSeam(difficulty, { seed: Math.floor(Math.random() * 2 ** 32) })\n" + ENGINE.replace(SEED, "{ seed: Math.floor(Math.random() * 2 ** 32), now: Date.now }"))],
 "P6-default-level-blunders": [("src/levels.ts", "3: Object.freeze({ budgetMs: 3_000, blunderRate: 0 }),", "3: Object.freeze({ budgetMs: 3_000, blunderRate: 0.05 }),")],
 "P6b-default-level-other-budget": [("src/levels.ts", "3: Object.freeze({ budgetMs: 3_000, blunderRate: 0 }),", "3: Object.freeze({ budgetMs: 2_000, blunderRate: 0 }),")],
 "P7-book-inside-level-seam": [
     ("src/cli.ts", ENGINE, "      engine: createLevelSeam(difficulty, { seed: Math.floor(Math.random() * 2 ** 32) }, book),"),
     ("src/level-seam.ts", 'import { createLevel, LEVELS, type LevelOptions } from "./levels.ts";',
      'import type { BookProbe } from "./book.ts";\nimport { createLevel, LEVELS, type LevelOptions } from "./levels.ts";'),
     ("src/level-seam.ts", "export function createLevelSeam(level: number, options: LevelOptions): EngineSeam {",
      "export function createLevelSeam(level: number, options: LevelOptions, book?: BookProbe): EngineSeam {"),
     ("src/level-seam.ts", "    const choice = choose(history.position);",
      "    const booked = book?.bookMove(history.position);\n    if (booked) return booked;\n    const choice = choose(history.position);")],
 "P8-constant-seed-at-root": [("src/cli.ts", SEED, "{ seed: 42 }")],
 "P8b-constant-seed-literal-kept-in-comment": [("src/cli.ts", ENGINE,
     "      // was: createLevelSeam(difficulty, { seed: Math.floor(Math.random() * 2 ** 32) })\n" + ENGINE.replace(SEED, "{ seed: 0x2a }"))],
 "P8c-constant-seed-inside-adapter": [("src/level-seam.ts", "createLevel(LEVELS[level as keyof typeof LEVELS], options)",
     "createLevel(LEVELS[level as keyof typeof LEVELS], { ...options, seed: 0 })")],
 "P10-difficulty-only-first": [("src/cli-options.ts", "    if (token === DIFFICULTY) {", "    if (token === DIFFICULTY && index === 0) {")],
 "P11-fresh-level-per-move": [("src/level-seam.ts", """  const choose = createLevel(LEVELS[level as keyof typeof LEVELS], options);
  return async (history) => {
    const choice = choose(history.position);""", """  return async (history) => {
    const choice = createLevel(LEVELS[level as keyof typeof LEVELS], options)(history.position);""")],
 "P9a-agents-md-1234": [("AGENTS.md", "`--difficulty 1|2|3|4|5`", "`--difficulty 1|2|3|4`")],
 "P9b-agents-md-12349": [("AGENTS.md", "`--difficulty 1|2|3|4|5`", "`--difficulty 1|2|3|4|9`")],
 "P9c-agents-md-1345": [("AGENTS.md", "`--difficulty 1|2|3|4|5`", "`--difficulty 1|3|4|5`")],
 "P9d-agents-md-1235": [("AGENTS.md", "`--difficulty 1|2|3|4|5`", "`--difficulty 1|2|3|5`")],
 "Q1-three-calls-delivered": [("src/cli.test.ts", "for (let call = 0; call < 2; call++) {", "for (let call = 0; call < 3; call++) {")],
 "Q2-three-calls-with-P11": [("src/cli.test.ts", "for (let call = 0; call < 2; call++) {", "for (let call = 0; call < 3; call++) {"),
   ("src/level-seam.ts", """  const choose = createLevel(LEVELS[level as keyof typeof LEVELS], options);
  return async (history) => {
    const choice = choose(history.position);""", """  return async (history) => {
    const choice = createLevel(LEVELS[level as keyof typeof LEVELS], options)(history.position);""")],
}
name = sys.argv[1]
if name == "--list":
    print("\n".join(P)); sys.exit(0)
for rel, old, new in P[name]:
    f = ROOT / rel
    s = f.read_text()
    assert s.count(old) == 1, f"{name}: {rel}: old string occurs {s.count(old)} times"
    f.write_text(s.replace(old, new, 1))
print(f"{name}: applied {len(P[name])} edit(s)")
