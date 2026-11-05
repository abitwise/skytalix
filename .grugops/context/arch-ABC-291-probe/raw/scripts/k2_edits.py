# SCRATCH (arch-ABC-291-probe): K2's list as edits, on a copy of `cand`, to show the list is whole. Not a d10 row; it decides
# nothing and no test file on any branch changes. Usage: python3 k2_edits.py <copy root>.
import re, sys, pathlib
src = pathlib.Path(sys.argv[1]) / "src"
def rd(n): return (src / n).read_text()
def wr(n, t): (src / n).write_text(t)
def sub(t, old, new, count=1):
    if t.count(old) != count: raise SystemExit(f"count {t.count(old)} (want {count}): {old[:80]!r}")
    return t.replace(old, new)
OFF_IMPORT = 'import { evaluateAtPhaseWithoutPawnShape as offAt, phaseOf as offPhase } from "./evaluate.ts";\nconst offE = (p: Parameters<typeof offPhase>[0]): number => offAt(p, offPhase(p));\n'
def add_off(t):
    i = t.index("\nimport ") + 1
    return t[:i] + 'import { evaluateAtPhaseWithoutPawnShape as offAt, phaseOf as offPhase } from "./evaluate.ts";\n' + t[i:]
def add_off_fn(t):
    # after the last import statement of the header
    last = [m for m in re.finditer(r'^(import [^;]*;|\} from "[^"]+";)\n', t, flags=re.M)][-1]
    return t[:last.end()] + 'const offE = (p: Parameters<typeof offPhase>[0]): number => offAt(p, offPhase(p));\n' + t[last.end():]

# engine.test.ts: the export list; three value rows
t = rd("engine.test.ts")
t = sub(t, '      "chooseMoveWithoutNullMove",\n      "chooseMoveWithoutPvsOrReductions",\n', '      "chooseMoveWithoutNullMove",\n      "chooseMoveWithoutPawnShape",\n      "chooseMoveWithoutPvsOrReductions",\n')
t = sub(t, '      move: "f1e1",\n      score: 441,\n', '      move: "f1e1",\n      score: 443,\n')
t = sub(t, '      move: "f1g1",\n      score: 520,\n', '      move: "f1g1",\n      score: 522,\n')
t = sub(t, 'incumbent: ["a3b4", 531],', 'incumbent: ["a3b4", 521],')  # row (b): the pin moves, and the row then reads a lost fixture property: it stays red here
t = sub(t, 'incumbent: ["e4d3", 1_070],', 'incumbent: ["e4d3", 1_075],')
wr("engine.test.ts", t)

# search.test.ts: the export list
t = rd("search.test.ts")
t = sub(t, '      "searchWithoutOrdering",\n      "searchWithoutPruning",\n', '      "searchWithoutOrdering",\n      "searchWithoutPawnShape",\n      "searchWithoutPruning",\n')
wr("search.test.ts", t)

# K1 (b) rows of ABC-271 and ABC-270: re-point to the off evaluation
for name, head in (("evaluate.passer.test.ts", 'describe("ABC-271 K1 (b)'), ("evaluate.queen-on.test.ts", 'describe("ABC-270 K1 (b)')):
    t = add_off_fn(add_off(rd(name)))
    i = t.index(head); j = t.index("\ndescribe(", i + 10) if "\ndescribe(" in t[i + 10:] else len(t)
    block = t[i:j]
    block = block.replace("evaluate(position)", "offE(position)").replace("evaluate(parseFen(fen))", "offE(parseFen(fen))")
    t = t[:i] + block + t[j:]
    wr(name, t)

# byte rows
t = rd("evaluate.pawns.test.ts"); t = sub(t, "toBe(2 ** 14 * (8 + 8 + 4 + 4 + 4 + 4 + 4));", "toBe(2 ** 14 * (8 + 8 + 4 + 4 + 4 + 4 + 4 + 4));"); t = sub(t, "expect(pawnCacheByteLength()).toBe(576 * 1024);", "expect(pawnCacheByteLength()).toBe(640 * 1024);"); wr("evaluate.pawns.test.ts", t)
t = rd("transposition.test.ts"); t = sub(t, "expect(pawnCacheByteLength()).toBe(576 * 1024);", "expect(pawnCacheByteLength()).toBe(640 * 1024);"); wr("transposition.test.ts", t)

# evaluate.taper.test.ts
t = add_off_fn(add_off(rd("evaluate.taper.test.ts")))
t = sub(t, '      expect(Object.is(evaluate(position), 0), id).toBe(true);\n      expect(Object.is(evaluate(mirrorPosition(position)), 0), id).toBe(true);\n',
        '      expect(Object.is(offE(position), 0), id).toBe(true);\n      expect(Object.is(offE(mirrorPosition(position)), 0), id).toBe(true);\n')
i = t.index('describe("ABC-269 B1 (b)'); j = t.index("\ndescribe(", i + 10)
t = t[:i] + t[i:j].replace("Object.is(evaluate(position), evaluateWithoutTaper(position))", "Object.is(offE(position), evaluateWithoutTaper(position))") + t[j:]
t = sub(t, '      ["searchWithoutHistory", "searchWithoutSeeOrdering", "searchWithoutBundle"],\n', '      ["searchWithoutPawnShape", "searchWithoutHistory", "searchWithoutSeeOrdering", "searchWithoutBundle"],\n')
t = sub(t, '      [\n        "chooseMoveWithoutHistory",\n        "chooseMoveWithoutSeeOrdering",\n        "chooseMoveWithoutAspiration",\n        "chooseMoveWithoutBundle",\n      ],\n',
        '      [\n        "chooseMoveWithoutPawnShape",\n        "chooseMoveWithoutHistory",\n        "chooseMoveWithoutSeeOrdering",\n        "chooseMoveWithoutAspiration",\n        "chooseMoveWithoutBundle",\n      ],\n')
t = sub(t, '"futilityNode(position, depth, ply, alphaIn, beta, switches.taper, phase)"', '"futilityNode(position, depth, ply, alphaIn, beta, switches.taper, switches.pawnShape, phase)"')
t = sub(t, '"futilityNode(position, remaining, ply, alphaIn, beta, budget.taper, phase)"', '"futilityNode(position, remaining, ply, alphaIn, beta, budget.taper, budget.pawnShape, phase)"')
t = sub(t, '"const staticScore = taper ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);"', '"const staticScore = taper ? pawnShape ? evaluateAtPhase(position, phase) : evaluateAtPhaseWithoutPawnShape(position, phase) : evaluateWithoutTaper(position);"')
t = sub(t, '"return switches.taper ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);"', '"return switches.taper ? switches.pawnShape ? evaluateAtPhase(position, phase) : evaluateAtPhaseWithoutPawnShape(position, phase) : evaluateWithoutTaper(position);"')
t = sub(t, '"const standPat = rules.taper === true ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);"', '"const standPat = rules.taper === true ? rules.pawnShape === true ? evaluateAtPhase(position, phase) : evaluateAtPhaseWithoutPawnShape(position, phase) : evaluateWithoutTaper(position);"')
i = t.index("  for (const family of FAMILIES) {\n    it(`${family.name}: the score is mg + trunc"); j = t.index('  it("the seam leaves E1', i)
b = t[i:j].replace("evaluateAtPhase(position, 0)", "offAt(position, 0)").replace("Object.is(evaluate(position), whitePov(position, expected))", "Object.is(offE(position), whitePov(position, expected))")
t = t[:i] + b + t[j:]
wr("evaluate.taper.test.ts", t)

# quiescence.test.ts
t = rd("quiescence.test.ts")
t = sub(t, r"\1\.seePruning \? RULES_SEE_PRUNING : RULES_TAPERED", r"\1\.seePruning \? \1\.pawnShape \? RULES_PAWN_SHAPE : RULES_SEE_PRUNING : RULES_TAPERED")
t = sub(t, '    bundle: ["searchWithoutHistory", "searchWithoutSeeOrdering", "searchWithoutBundle"],\n', '    bundle: ["searchWithoutPawnShape", "searchWithoutHistory", "searchWithoutSeeOrdering", "searchWithoutBundle"],\n')
t = sub(t, '    bundle: [\n      "chooseMoveWithoutHistory",\n', '    bundle: [\n      "chooseMoveWithoutPawnShape",\n      "chooseMoveWithoutHistory",\n')
wr("quiescence.test.ts", t)

# search.bundle.test.ts: the shipped side re-points to the new door
t = rd("search.bundle.test.ts")
i = t.index("\nimport ") + 1
t = t[:i] + 'import { chooseMoveWithoutPawnShape } from "./engine.ts";\n' + t[i:]
t = sub(t, "const head = deepenTo(chooseMove, fen, 4);", "const head = deepenTo(chooseMoveWithoutPawnShape, fen, 4);")
t = sub(t, "const head = deepenTo(chooseMove, fen, 6);", "const head = deepenTo(chooseMoveWithoutPawnShape, fen, 6);")
wr("search.bundle.test.ts", t)

# search.futility.test.ts: the new argument, every call; arity; the source rows; the door lists
t = rd("search.futility.test.ts")
t = re.sub(r", true, phaseOf\(", ", true, true, phaseOf(", t)
t = t.replace(", false, phaseOf(parseFen(NODE))", ", false, false, phaseOf(parseFen(NODE))")
t = re.sub(r"(\n\s+)true,\n(\s+)phaseOf\(parseFen\(QUIET\)\),", r"\1true,\1true,\n\2phaseOf(parseFen(QUIET)),", t)
t = sub(t, "expect(futilityNode.length).toBe(7);", "expect(futilityNode.length).toBe(8);")
t = sub(t, "beta, ${on}.taper, phase);`", "beta, ${on}.taper, ${on}.pawnShape, phase);`")
t = sub(t, '      bundle: ["searchWithoutHistory", "searchWithoutSeeOrdering", "searchWithoutBundle"],\n', '      bundle: ["searchWithoutPawnShape", "searchWithoutHistory", "searchWithoutSeeOrdering", "searchWithoutBundle"],\n')
t = sub(t, '      bundle: [\n        "chooseMoveWithoutHistory",\n', '      bundle: [\n        "chooseMoveWithoutPawnShape",\n        "chooseMoveWithoutHistory",\n')
wr("search.futility.test.ts", t)

# search.null-move.test.ts
t = rd("search.null-move.test.ts")
t = sub(t, '        search: "true",\n', '        search: "true",\n        searchWithoutPawnShape: "true",\n')
t = sub(t, '        chooseMove: "true",\n', '        chooseMove: "true",\n        chooseMoveWithoutPawnShape: "true",\n')
wr("search.null-move.test.ts", t)

# see.test.ts
t = add_off(rd("see.test.ts"))
t = sub(t, "expect(stood).toBe(evaluateAtPhase(position, phase));", "expect(stood).toBe(offAt(position, phase));")
t = sub(t, "/^(search|chooseMove)Without(History|SeeOrdering|Aspiration|Bundle)$/", "/^(search|chooseMove)Without(PawnShape|History|SeeOrdering|Aspiration|Bundle)$/")
wr("see.test.ts", t)
print("edited")
