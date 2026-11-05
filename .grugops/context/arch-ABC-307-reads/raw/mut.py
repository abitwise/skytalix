# mut.py <tree> <orig> <id> : restore every production file a mutant may touch, then apply mutant <id>.
# ids: the PREREG's src and data list, or "restore". Each anchor must occur exactly once; an anchor that does not is a hard stop.
import sys, json, shutil, os
P, O, m = sys.argv[1], sys.argv[2], sys.argv[3]
HERE = os.path.dirname(os.path.abspath(__file__))
FILES = ["src/engine.ts", "src/levels.ts", "src/level-seam.ts", "src/gameend.ts", "src/history.ts", "src/zobrist.ts", "src/apply.ts",
         "src/uci-session.ts", "data/opening-book/book.json", "tools/grugops/qe-hop-integrity.js"]
for f in FILES:
    shutil.copy(f"{O}/{f.replace('/', '__')}", f"{P}/{f}")
FROZEN = {x["id"]: x["edits"] for x in json.load(open(f"{HERE}/frozen-mutants.json"))["mutants"]}
# QPRIOROFF: the same plant, `priorKeys: false` in chooseMove, re-anchored on today's literal (arch-ABC-302 did the same).
CM = "export function chooseMove(position: Position, options: EngineOptions): EngineChoice | null {\n  return deepen(position, options, {\n    pvs: true,\n    reductions: true,\n    nullMove: true,\n    priorKeys: "
FROZEN["QPRIOROFF"] = [{"file": "src/engine.ts", "from": CM + "true,", "to": CM + "false,"}]
E, L, SEAM, Z, A, U = "src/engine.ts", "src/levels.ts", "src/level-seam.ts", "src/zobrist.ts", "src/apply.ts", "src/uci-session.ts"
BOOK = "data/opening-book/book.json"
SEAM_LINE = ": trimPriorKeys(keyHistory(history), history.position.halfmoveClock);"
GLOBAL = "(globalThis as unknown as { __mc1?: number })"
MINE = {
  # arch-ABC-302's plants, verbatim from its raw/mut.py
  "M2s": [(SEAM, SEAM_LINE, ": trimPriorKeys(keyHistory(history), history.position.halfmoveClock).slice(1);")],
  "M4": [(A, "    isPawn && Math.abs(move.to - move.from) === DOUBLE_PUSH ? (move.from + move.to) / 2 : NO_SQUARE;",
             "    isPawn && Math.abs(move.to - move.from) === DOUBLE_PUSH && [move.to - 1, move.to + 1].some((s) => (position.board[s] ?? EMPTY) !== EMPTY && pieceType(position.board[s] as number) === PAWN && isBlack(position.board[s] as number) !== isBlack(move.piece)) ? (move.from + move.to) / 2 : NO_SQUARE;")],
  "M4z": [(Z, "  if (position.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(position.epSquare)] as bigint;\n\n  return key;\n}\n\n/**\n * The en-passant component",
              "  if (position.epSquare !== NO_SQUARE && position.epSquare >> 4 !== 2) key ^= EP_FILE[fileOf(position.epSquare)] as bigint;\n\n  return key;\n}\n\n/**\n * The en-passant component"),
          (Z, "  if (undo.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(undo.epSquare)] as bigint;\n  if (position.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(position.epSquare)] as bigint;",
              "  if (undo.epSquare !== NO_SQUARE && undo.epSquare >> 4 !== 2) key ^= EP_FILE[fileOf(undo.epSquare)] as bigint;\n  if (position.epSquare !== NO_SQUARE && position.epSquare >> 4 !== 2) key ^= EP_FILE[fileOf(position.epSquare)] as bigint;"),
          (Z, "  let key = keyBefore ^ BLACK_TO_MOVE;\n  if (undo.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(undo.epSquare)] as bigint;",
              "  let key = keyBefore ^ BLACK_TO_MOVE;\n  if (undo.epSquare !== NO_SQUARE && undo.epSquare >> 4 !== 2) key ^= EP_FILE[fileOf(undo.epSquare)] as bigint;")],
  "M6": [(L, "  const random = seededRandom(options.seed);", "  const random = seededRandom(options.seed + (globalThis.__m6 = ((globalThis as any).__m6 ?? 0) + 1) - 1);")],
  "M7": [(L, "    if (random() >= level.blunderRate) {", "    if (random() >= Math.max(level.blunderRate, 0.05)) {")],
  # ADR-0046 § Dated 2026-11-05 (arch-ABC-307)'s own list
  "ML1": [(SEAM, "    const choice = choose(history.position, priorKeys);",
                 "    const choice = createLevel(LEVELS[level as keyof typeof LEVELS], options)(history.position, priorKeys);")],
  "MC1": [(U, "  const { write, now, random, book } = options;",
              f"  const {{ write, now, random, book }} = options;\n  const mc1Salt = ({GLOBAL}.__mc1 = ({GLOBAL}.__mc1 ?? 0) + 1);"),
          (U, "      const seed = Math.floor(random() * 2 ** 32);", "      const seed = Math.floor(random() * 2 ** 32) + mc1Salt;")],
  "MC2h": [(U, "    const budgetMs = leveled ? Math.min(request.budgetMs, level.budgetMs) : request.budgetMs;",
               "    const budgetMs = leveled ? Math.min(request.budgetMs, level.budgetMs, 5_000) : request.budgetMs;")],
  "P2a": [(E, "export const HARD_CEILING_MS = 60_000;", "export const HARD_CEILING_MS = 5_000;")],
  "P2b": [(E, "    deadline: start + Math.min(options.budgetMs, HARD_CEILING_MS),", "    deadline: start + Math.min(options.budgetMs, 5_000),")],
  "MB1": [(BOOK, "@MB1_FROM@", "@MB1_TO@")],
}
def sub(path, old, new):
    full = f"{P}/{path}"
    s = open(full).read()
    assert s.count(old) == 1, (m, path, old[:70], s.count(old))
    open(full, "w").write(s.replace(old, new))
if m == "restore":
    pass
elif m in MINE:
    for path, old, new in MINE[m]:
        if old == "@MB1_FROM@":
            entry = json.load(open(f"{HERE}/mb1.json"))
            old, new = entry["from"], entry["to"]
        sub(path, old, new)
elif m in FROZEN:
    for e in FROZEN[m]: sub(e["file"], e["from"], e["to"])
else:
    raise SystemExit(f"unknown mutant {m}")
print("applied", m)
