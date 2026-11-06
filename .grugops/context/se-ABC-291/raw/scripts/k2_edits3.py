# SCRATCH (arch-ABC-291-probe): K2's list as edits, on a copy of `cand`, to show the list is whole. Not a d10 row; it decides
# nothing and no test file on any branch changes. Usage: python3 k2_edits.py <copy root>.
import re, sys, pathlib
src = pathlib.Path(sys.argv[1]) / "src"
def rd(n): return (src / n).read_text()
def wr(n, t): (src / n).write_text(t)
def sub(t, old, new, count=1):
    if t.count(old) != count: raise SystemExit(f"count {t.count(old)} (want {count}): {old[:80]!r}")
    return t.replace(old, new)
OFF_IMPORT = 'import { evaluateAtPhaseWithoutPawnShape as offAt, phaseOf as offPhase } from "./evaluate.ts";\nconst offE = (p: Parameters<typeof offPhase>[0]): number => evaluateAtPhaseWithoutPawnShape(p, offPhase(p));\n'
def add_off(t):
    return sub(t, '  evaluateAtPhase,\n', '  evaluateAtPhase,\n  evaluateAtPhaseWithoutPawnShape,\n') if '  evaluateAtPhase,\n' in t else sub(t, 'import { evaluateAtPhase, phaseOf } from "./evaluate.ts";', 'import { evaluateAtPhase, evaluateAtPhaseWithoutPawnShape, phaseOf } from "./evaluate.ts";')
def add_off_fn(t):
    # after the last import statement of the header
    last = [m for m in re.finditer(r'^(import [^;]*;|\} from "[^"]+";)\n', t, flags=re.M)][-1]
    return t[:last.end()] + '\n/** `evaluate` without E4b\'s shape part (`ABC-291`, `ADR-0075` decision 4): these rows read older terms. */\nconst offEvaluate = (position: Position): number =>\n  evaluateAtPhaseWithoutPawnShape(position, phaseOf(position));\n' + t[last.end():]

# evaluate.taper.test.ts
t = add_off_fn(add_off(rd("evaluate.taper.test.ts")))
t = sub(t, '      expect(Object.is(evaluate(position), 0), id).toBe(true);\n      expect(Object.is(evaluate(mirrorPosition(position)), 0), id).toBe(true);\n',
        '      expect(Object.is(offEvaluate(position), 0), id).toBe(true);\n      expect(Object.is(offEvaluate(mirrorPosition(position)), 0), id).toBe(true);\n')
i = t.index('describe("ABC-269 B1 (b)'); j = t.index("\ndescribe(", i + 10)
t = t[:i] + t[i:j].replace("Object.is(evaluate(position), evaluateWithoutTaper(position))", "Object.is(offEvaluate(position), evaluateWithoutTaper(position))") + t[j:]
t = sub(t, '        "searchWithoutQuietBundle",\n        "searchWithoutHistory",\n', '        "searchWithoutQuietBundle",\n        "searchWithoutPawnShape",\n        "searchWithoutHistory",\n')
t = sub(t, '        "chooseMoveWithoutQuietBundle",\n        "chooseMoveWithoutHistory",\n', '        "chooseMoveWithoutQuietBundle",\n        "chooseMoveWithoutPawnShape",\n        "chooseMoveWithoutHistory",\n')
t = sub(t, '"futilityNode(position, depth, ply, alphaIn, beta, switches.taper, phase)"', '"futilityNode(position, depth, ply, alphaIn, beta, switches.taper, switches.pawnShape, phase)"')
t = sub(t, '"futilityNode(position, remaining, ply, alphaIn, beta, budget.taper, phase)"', '"futilityNode(position, remaining, ply, alphaIn, beta, budget.taper, budget.pawnShape, phase)"')
t = sub(t, '"const staticScore = taper ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);"', '"const staticScore = taper ? pawnShape ? evaluateAtPhase(position, phase) : evaluateAtPhaseWithoutPawnShape(position, phase) : evaluateWithoutTaper(position);"')
t = sub(t, '"return switches.taper ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);"', '"return switches.taper ? switches.pawnShape ? evaluateAtPhase(position, phase) : evaluateAtPhaseWithoutPawnShape(position, phase) : evaluateWithoutTaper(position);"')
t = sub(t, '"const standPat = rules.taper === true ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);"', '"const standPat = rules.taper === true ? rules.pawnShape === true ? evaluateAtPhase(position, phase) : evaluateAtPhaseWithoutPawnShape(position, phase) : evaluateWithoutTaper(position);"')
i = t.index("  for (const family of FAMILIES) {\n    it(`${family.name}: the score is mg + trunc"); j = t.index('  it("the seam leaves E1', i)
b = t[i:j].replace("evaluateAtPhase(position, 0)", "evaluateAtPhaseWithoutPawnShape(position, 0)").replace("Object.is(evaluate(position), whitePov(position, expected))", "Object.is(offEvaluate(position), whitePov(position, expected))")
t = t[:i] + b + t[j:]
wr("evaluate.taper.test.ts", t)

# quiescence.test.ts
t = rd("quiescence.test.ts")
t = sub(t, r"\1\.seePruning \? RULES_SEE_PRUNING : RULES_TAPERED", r"\1\.seePruning \? \1\.pawnShape \? RULES_PAWN_SHAPE : RULES_SEE_PRUNING : RULES_TAPERED")
t = sub(t, '      "searchWithoutQuietBundle",\n      "searchWithoutHistory",\n', '      "searchWithoutQuietBundle",\n      "searchWithoutPawnShape",\n      "searchWithoutHistory",\n')
t = sub(t, '      "chooseMoveWithoutQuietBundle",\n      "chooseMoveWithoutHistory",\n', '      "chooseMoveWithoutQuietBundle",\n      "chooseMoveWithoutPawnShape",\n      "chooseMoveWithoutHistory",\n')
wr("quiescence.test.ts", t)

# search.bundle.test.ts: the shipped side re-points to the new door; ABC-303's door rows take the new door
t = rd("search.bundle.test.ts")
t = sub(t, "  chooseMoveWithoutBundle,\n", "  chooseMoveWithoutBundle,\n  chooseMoveWithoutPawnShape,\n")
t = sub(t, "const head = deepenTo(chooseMove, fen, 6);", "const head = deepenTo(chooseMoveWithoutPawnShape, fen, 6);")
t = sub(t, 'replace(/ {4}(moveCount|countermove): \\w+,\\n/g, "")', 'replace(/ {4}(moveCount|countermove|pawnShape): \\w+,\\n/g, "")')
t = sub(t, '    ["searchWithoutMoveCountPruning", false, true],\n', '    ["searchWithoutPawnShape", true, true],\n    ["searchWithoutMoveCountPruning", false, true],\n')
t = sub(t, '    ["chooseMoveWithoutMoveCountPruning", false, true],\n', '    ["chooseMoveWithoutPawnShape", true, true],\n    ["chooseMoveWithoutMoveCountPruning", false, true],\n')
t = sub(t, "if (/MoveCountPruning|Countermove/.test(name)) continue;", "if (/MoveCountPruning|Countermove|PawnShape/.test(name)) continue;")
wr("search.bundle.test.ts", t)

# search.futility.test.ts: the new argument, every call; arity; the source rows; the door lists
t = rd("search.futility.test.ts")
t = re.sub(r", true, phaseOf\(", ", true, true, phaseOf(", t)
t = t.replace(", false, phaseOf(parseFen(NODE))", ", false, false, phaseOf(parseFen(NODE))")
t = re.sub(r"(\n\s+)true,\n(\s+)phaseOf\(parseFen\(QUIET\)\),", r"\1true,\1true,\n\2phaseOf(parseFen(QUIET)),", t)
t = sub(t, "expect(futilityNode.length).toBe(7);", "expect(futilityNode.length).toBe(8);")
t = sub(t, "beta, ${on}.taper, phase);`", "beta, ${on}.taper, ${on}.pawnShape, phase);`")
t = sub(t, '        "searchWithoutQuietBundle",\n        "searchWithoutHistory",\n', '        "searchWithoutQuietBundle",\n        "searchWithoutPawnShape",\n        "searchWithoutHistory",\n')
t = sub(t, '        "chooseMoveWithoutQuietBundle",\n        "chooseMoveWithoutHistory",\n', '        "chooseMoveWithoutQuietBundle",\n        "chooseMoveWithoutPawnShape",\n        "chooseMoveWithoutHistory",\n')
wr("search.futility.test.ts", t)

# search.null-move.test.ts
t = rd("search.null-move.test.ts")
t = sub(t, '        search: "true",\n', '        search: "true",\n        searchWithoutPawnShape: "true",\n')
t = sub(t, '        chooseMove: "true",\n', '        chooseMove: "true",\n        chooseMoveWithoutPawnShape: "true",\n')
wr("search.null-move.test.ts", t)

# see.test.ts
t = add_off(rd("see.test.ts"))
t = sub(t, "expect(stood).toBe(evaluateAtPhase(position, phase));", "expect(stood).toBe(evaluateAtPhaseWithoutPawnShape(position, phase));")
t = sub(t, "/^(search|chooseMove)Without(MoveCountPruning|Countermove|QuietBundle|History|SeeOrdering|Aspiration|Bundle)$/", "/^(search|chooseMove)Without(PawnShape|MoveCountPruning|Countermove|QuietBundle|History|SeeOrdering|Aspiration|Bundle)$/")
wr("see.test.ts", t)
print("edited")
