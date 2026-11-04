# mut.py <tree> <orig> <id> : restore every production file a mutant touches, then apply mutant <id>.
# ids: the PREREG's 28 (arch-ABC-302), or "restore". Each anchor must occur exactly once.
import sys, json, shutil, os
P, O, m = sys.argv[1], sys.argv[2], sys.argv[3]
FILES = ["engine", "levels", "level-seam", "search", "zobrist", "apply", "history", "gameend", "uci-session"]
for f in FILES:
    shutil.copy(f"{O}/{f}.ts.orig", f"{P}/src/{f}.ts")
CARRIED = json.load(open(os.path.join(os.path.dirname(__file__), "abc244-carried.json")))
CARRIED["QPRIOROFF"] = [{"file": "src/engine.ts",
  "from": "export function chooseMove(position: Position, options: EngineOptions): EngineChoice | null {\n  return deepen(position, options, {\n    pvs: true,\n    reductions: true,\n    nullMove: true,\n    priorKeys: true,",
  "to":   "export function chooseMove(position: Position, options: EngineOptions): EngineChoice | null {\n  return deepen(position, options, {\n    pvs: true,\n    reductions: true,\n    nullMove: true,\n    priorKeys: false,"}]
E, L, SEAM, SR, Z, A = "src/engine.ts", "src/levels.ts", "src/level-seam.ts", "src/search.ts", "src/zobrist.ts", "src/apply.ts"
MINE = {
  # R1: null-move guards read at real nodes (nullMoveReduction, both recursions)
  "M1": [(SR, "  if (ply === 0 || afterNull || depth < NULL_MOVE_MIN_DEPTH) return 0;\n  if (isInCheck(position)) return 0;",
              "  if (ply === 0 || afterNull || depth < NULL_MOVE_MIN_DEPTH) return 0;\n  if (depth > 3 && isInCheck(position)) return 0;")],
  "M1p": [(SR, "++pieces === NULL_MOVE_MIN_PIECES", "++pieces === (depth > 3 ? NULL_MOVE_MIN_PIECES : 2)")],
  # R2: the CLI seam's list
  "M2": [(SEAM, ": trimPriorKeys(keyHistory(history), history.position.halfmoveClock);",
                ": trimPriorKeys(keyHistory(history), history.position.halfmoveClock + 1);")],
  "M2s": [(SEAM, ": trimPriorKeys(keyHistory(history), history.position.halfmoveClock);",
                 ": trimPriorKeys(keyHistory(history), history.position.halfmoveClock).slice(1);")],
  # R3: futility fires in the real recursions
  "M3": [(E, "budget.futility && futilityNode(position, remaining, ply, alphaIn, beta, budget.taper, phase)",
             "budget.futility && ply < 0 && futilityNode(position, remaining, ply, alphaIn, beta, budget.taper, phase)")],
  "M3s": [(SR, "switches.futility && futilityNode(position, depth, ply, alphaIn, beta, switches.taper, phase)",
               "switches.futility && ply < 0 && futilityNode(position, depth, ply, alphaIn, beta, switches.taper, phase)")],
  # R4: the ep field and the key's ep component
  "M4": [(A, "    isPawn && Math.abs(move.to - move.from) === DOUBLE_PUSH ? (move.from + move.to) / 2 : NO_SQUARE;",
             "    isPawn && Math.abs(move.to - move.from) === DOUBLE_PUSH && [move.to - 1, move.to + 1].some((s) => (position.board[s] ?? EMPTY) !== EMPTY && pieceType(position.board[s] as number) === PAWN && isBlack(position.board[s] as number) !== isBlack(move.piece)) ? (move.from + move.to) / 2 : NO_SQUARE;")],
  "M4z": [(Z, "  if (position.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(position.epSquare)] as bigint;\n\n  return key;\n}\n\n/**\n * The en-passant component",
              "  if (position.epSquare !== NO_SQUARE && position.epSquare >> 4 !== 2) key ^= EP_FILE[fileOf(position.epSquare)] as bigint;\n\n  return key;\n}\n\n/**\n * The en-passant component"),
          (Z, "  if (undo.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(undo.epSquare)] as bigint;\n  if (position.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(position.epSquare)] as bigint;",
              "  if (undo.epSquare !== NO_SQUARE && undo.epSquare >> 4 !== 2) key ^= EP_FILE[fileOf(undo.epSquare)] as bigint;\n  if (position.epSquare !== NO_SQUARE && position.epSquare >> 4 !== 2) key ^= EP_FILE[fileOf(position.epSquare)] as bigint;"),
          (Z, "  let key = keyBefore ^ BLACK_TO_MOVE;\n  if (undo.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(undo.epSquare)] as bigint;",
              "  let key = keyBefore ^ BLACK_TO_MOVE;\n  if (undo.epSquare !== NO_SQUARE && undo.epSquare >> 4 !== 2) key ^= EP_FILE[fileOf(undo.epSquare)] as bigint;")],
  # R5: the ceiling under maxDepth; the clock read as often
  "M5": [(E, "    deadline: start + Math.min(options.budgetMs, HARD_CEILING_MS),",
             "    deadline: start + (options.maxDepth === undefined ? Math.min(options.budgetMs, HARD_CEILING_MS) : options.budgetMs),")],
  "M5c": [(E, "    iteration <= (options.maxDepth ?? Number.POSITIVE_INFINITY) &&",
              "    iteration <= (options.maxDepth === undefined ? Number.POSITIVE_INFINITY : now() >= 0 ? options.maxDepth : 0) &&")],
  # R6: determinism of a seeded level
  "M6": [(L, "  const random = seededRandom(options.seed);", "  const random = seededRandom(options.seed + (globalThis.__m6 = ((globalThis as any).__m6 ?? 0) + 1) - 1);")],
  "M6t": [(E, "  budget.keys[0] = zobristKey(position);\n  clearTable();", "  budget.keys[0] = zobristKey(position);")],
  # R7: the default level is the engine
  "M7": [(L, "    if (random() >= level.blunderRate) {", "    if (random() >= Math.max(level.blunderRate, 0.05)) {")],
  "M7n": [(L, '      return { move, kind: "engine", scored: null, depth, nodes, elapsedMs };',
              '      return { move, kind: "engine", scored: null, depth, nodes: nodes + 1, elapsedMs };')],
  # R8: the prior keys at deeper iterations
  "M8d": [(E, "    let deeper: Iteration;\n", "    if (iteration >= ASPIRATION_FROM) budget.prior = NO_PRIOR_KEYS;\n    let deeper: Iteration;\n")],
  # R9: the engine's capacity guard
  "M9": [(E, "  if (remaining <= 0 || ply >= KEY_ARRAY_CAPACITY) {", "  if (remaining <= 0 || ply > KEY_ARRAY_CAPACITY) {")],
  "M9r": [(E, "  if (remaining <= 0 || ply >= KEY_ARRAY_CAPACITY) {", "  if (remaining <= 0) {")],
}
def sub(path, old, new):
    full = f"{P}/{path}"
    s = open(full).read()
    assert s.count(old) == 1, (m, path, old[:70], s.count(old))
    open(full, "w").write(s.replace(old, new))
if m == "restore":
    pass
elif m in MINE:
    for path, old, new in MINE[m]: sub(path, old, new)
elif m in CARRIED:
    for e in CARRIED[m]: sub(e["file"], e["from"], e["to"])
else:
    raise SystemExit(f"unknown mutant {m}")
print("applied", m)
