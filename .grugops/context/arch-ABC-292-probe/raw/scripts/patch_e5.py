# SCRATCH PROBE (arch-ABC-292-probe): patches a `git archive` copy of main with ADR-0076 d3's table, d4's seam and d5's
# switch and doors. Form after arch-ABC-291-probe's patch_e4b.py. Usage: python3 patch_e5.py <copy root> [cut]
# Exact-string edits; each must match the stated count or the script stops.
# The probe-only ON / OFF switch is the probe script's form argument, which picks d5's real exports: ON calls
# `chooseMove`, `search`, `evaluate`; OFF calls `chooseMoveWithoutPieceTerms`, `searchWithoutPieceTerms`,
# `evaluateAtPhaseWithoutPieceTerms`. No module state is added, so the timed path is the one the build would carry.
# With `cut` as the second argument it also applies d6's named cut: `kingExposure` reads own and enemy from the memo's
# file word, the 6-rank scan goes, and king safety is computed after `pawnStructureCached`.
import re, sys, pathlib

root = pathlib.Path(sys.argv[1])
CUT = len(sys.argv) > 2 and sys.argv[2] == "cut"
ev = root / "src/evaluate.ts"
pp = root / "src/evaluate-params.ts"
se = root / "src/search.ts"
en = root / "src/engine.ts"
qu = root / "src/quiescence.ts"
tu = root / "tools/tune/tune.ts"

def sub(text, old, new, count=1):
    n = text.count(old)
    if n != count:
        raise SystemExit(f"match count {n} (want {count}) for: {old[:80]!r}")
    return text.replace(old, new)

# ---- d3: the parameter table ----
p = pp.read_text()
p += '''
/**
 * E5 (`ABC-292`, `ADR-0076` decisions 2 and 3): the bishop pair and rooks on open and semi-open
 * files. Hand values by one rule, fixed before any row. Halves equal: the rule's output.
 * BISHOP_PAIR[h] = 2 x (MATERIAL[h][BISHOP] - 3 x MATERIAL[h][PAWN]): a pair earns a minor's
 * premium once more on each bishop. Once per side with two or more bishops.
 * ROOK_OPEN_FILE[h] = KING_FILE_OPEN[h]; ROOK_SEMI_OPEN_FILE[h] = KING_FILE_HALF_OPEN[h]: a file
 * gives a rook what it costs a king. Once per file holding a rook of the side.
 */
export const BISHOP_PAIR: MgEg<number> = { mg: 50, eg: 50 };
export const ROOK_OPEN_FILE: MgEg<number> = { mg: 20, eg: 20 };
export const ROOK_SEMI_OPEN_FILE: MgEg<number> = { mg: 10, eg: 10 };
'''
pp.write_text(p)

t = ev.read_text()

# ---- d3/d4: the packed terms and a bit-count table ----
t = sub(t, "const PACKED_TERMS = new Int32Array(8);\n", "const PACKED_TERMS = new Int32Array(11);\n")
t = sub(t, "const OPEN_QUEEN_AT = 7;\n",
        "const OPEN_QUEEN_AT = 7;\n"
        "/** E5 (`ABC-292`, `ADR-0076` decision 3). */\n"
        "const BISHOP_PAIR_AT = 8;\nconst ROOK_OPEN_AT = 9;\nconst ROOK_SEMI_OPEN_AT = 10;\n"
        "/** Set bits per 8-bit file mask (`ADR-0076` decision 4): 256 bytes at load. */\n"
        "const FILE_COUNT = new Uint8Array(256);\n"
        "for (let mask = 1; mask < 256; mask++) FILE_COUNT[mask] = (FILE_COUNT[mask >> 1] as number) + (mask & 1);\n")
t = sub(t, "  PACKED_TERMS[OPEN_QUEEN_AT] = pair(parameters.KING_FILE_OPEN_QUEEN);\n",
        "  PACKED_TERMS[OPEN_QUEEN_AT] = pair(parameters.KING_FILE_OPEN_QUEEN);\n"
        "  PACKED_TERMS[BISHOP_PAIR_AT] = pair(parameters.BISHOP_PAIR);\n"
        "  PACKED_TERMS[ROOK_OPEN_AT] = pair(parameters.ROOK_OPEN_FILE);\n"
        "  PACKED_TERMS[ROOK_SEMI_OPEN_AT] = pair(parameters.ROOK_SEMI_OPEN_FILE);\n")

# ---- d4: pawnStructure's parts: doubled and isolated in one word, the file word beside them ----
t = sub(t, "let doubledPart = 0;\nlet isolatedPart = 0;\n",
        "let doubledIsolatedPart = 0;\n"
        "/** E5 (`ADR-0076` decision 4): both sides' pawn files, white bits 0-7, black bits 8-15. */\n"
        "let filesPart = 0;\n")
t = sub(t, "  doubledPart = doubled;\n  isolatedPart = isolated;\n",
        "  doubledIsolatedPart = doubled + isolated;\n  filesPart = whiteFiles | (blackFiles << 8);\n")

# ---- d4: the memo, still seven words a slot ----
t = sub(t, "const pawnCacheDoubled = new Int32Array(PAWN_CACHE_SLOTS);\nconst pawnCacheIsolated = new Int32Array(PAWN_CACHE_SLOTS);\n",
        "const pawnCacheDoubledIsolated = new Int32Array(PAWN_CACHE_SLOTS);\nconst pawnCacheFiles = new Int32Array(PAWN_CACHE_SLOTS);\n")
t = sub(t, "    blackPassersPart = pawnCacheBlackPassers[slot] as number;\n    return (\n"
           "      (pawnCacheDoubled[slot] as number) +\n      (pawnCacheIsolated[slot] as number) +\n"
           "      (pawnCachePassed[slot] as number)\n    );\n",
        "    blackPassersPart = pawnCacheBlackPassers[slot] as number;\n"
        "    filesPart = pawnCacheFiles[slot] as number;\n"
        "    return (pawnCacheDoubledIsolated[slot] as number) + (pawnCachePassed[slot] as number);\n")
t = sub(t, "  pawnCacheDoubled[slot] = doubledPart;\n  pawnCacheIsolated[slot] = isolatedPart;\n",
        "  pawnCacheDoubledIsolated[slot] = doubledIsolatedPart;\n  pawnCacheFiles[slot] = filesPart;\n")
t = sub(t, "    pawnCacheDoubled.byteLength +\n    pawnCacheIsolated.byteLength +\n",
        "    pawnCacheDoubledIsolated.byteLength +\n    pawnCacheFiles.byteLength +\n")

# ---- d4: one side's piece terms, after the memo; its three parts kept for the seam ----
t = sub(t, "/**\n * The game phase of `position`:",
        "/** `pieceTermsOfSide`'s three parts for the side it last scored, packed (`ADR-0076` decision 5's seam reads them). */\n"
        "let bishopPairPart = 0;\nlet openFilePart = 0;\nlet semiOpenFilePart = 0;\n\n"
        "/**\n * E5 (`ABC-292`, `ADR-0076` decisions 2 and 4) for ONE side, packed: `BISHOP_PAIR` once with two or\n"
        " * more bishops; per file holding one of the side's rooks (`rooks`, bit 0 = a), `ROOK_OPEN_FILE` when\n"
        " * the file holds no pawn of either colour, `ROOK_SEMI_OPEN_FILE` when it holds none of the side's and\n"
        " * an enemy one. `ownFiles` / `enemyFiles` are the memo's file sets (ranks 2-7).\n */\n"
        "function pieceTermsOfSide(\n  rooks: number,\n  ownFiles: number,\n  enemyFiles: number,\n  bishops: number,\n): number {\n"
        "  bishopPairPart = bishops >= 2 ? (PACKED_TERMS[BISHOP_PAIR_AT] as number) : 0;\n"
        "  if (rooks === 0) {\n    openFilePart = 0;\n    semiOpenFilePart = 0;\n    return bishopPairPart;\n  }\n"
        "  openFilePart =\n    (FILE_COUNT[rooks & ~(ownFiles | enemyFiles)] as number) * (PACKED_TERMS[ROOK_OPEN_AT] as number);\n"
        "  semiOpenFilePart =\n    (FILE_COUNT[rooks & ~ownFiles & enemyFiles] as number) *\n    (PACKED_TERMS[ROOK_SEMI_OPEN_AT] as number);\n"
        "  return bishopPairPart + openFilePart + semiOpenFilePart;\n}\n\n"
        "/**\n * The game phase of `position`:")

# ---- d5: the switch on the walk ----
t = sub(t, "  pawnCache: boolean,\n  taper: boolean,\n  phase: number,\n): number {\n  const board = position.board;\n  let score = 0;",
        "  pawnCache: boolean,\n  taper: boolean,\n  pieceTerms: boolean,\n  phase: number,\n): number {\n  const board = position.board;\n  let score = 0;")
t = sub(t, "  let pawnSlotWord = 0;\n\n  for (let rank = 7; rank >= 0; rank--) {",
        "  let pawnSlotWord = 0;\n  let whiteRooks = 0;\n  let blackRooks = 0;\n  let whiteBishops = 0;\n  let blackBishops = 0;\n\n"
        "  for (let rank = 7; rank >= 0; rank--) {")
t = sub(t, "        } else if (black) blackQueen = true;\n        else whiteQueen = true;\n      }\n    }\n  }\n",
        "        } else if (black) blackQueen = true;\n        else whiteQueen = true;\n"
        "      } else if (type === ROOK) {\n        // E5 (`ADR-0076` decision 4): the rook's file, in the side's rook mask.\n"
        "        if (black) blackRooks |= 1 << file;\n        else whiteRooks |= 1 << file;\n"
        "      } else if (type === BISHOP) {\n        if (black) blackBishops++;\n        else whiteBishops++;\n"
        "      }\n    }\n  }\n")
if not CUT:
    t = sub(t, "    : pawnStructure(board);\n  // Split the packed sum (`ABC-274`)",
            "    : pawnStructure(board);\n"
            "  // E5 (`ADR-0076` decision 4): after the memo, one packed add, read only when the switch is on.\n"
            "  const pieces = pieceTerms\n"
            "    ? pieceTermsOfSide(whiteRooks, filesPart & 0xff, filesPart >> 8, whiteBishops) -\n"
            "      pieceTermsOfSide(blackRooks, filesPart >> 8, filesPart & 0xff, blackBishops)\n"
            "    : 0;\n"
            "  // Split the packed sum (`ABC-274`)")
t = sub(t, "  const packed = score + structure + kingSafety;\n", "  const packed = score + structure + kingSafety + pieces;\n")
t = sub(t, "  const score = whiteMinusBlack(position, true, true, true, phase);\n  // `0 - score`, not `-score`",
        "  const score = whiteMinusBlack(position, true, true, true, true, phase);\n  // `0 - score`, not `-score`")
t = sub(t, "/**\n * TEST-ONLY. `evaluate` with the mobility weight at 0",
        "/**\n * TEST-ONLY (`ADR-0076` decision 5): `evaluateAtPhase` without the piece terms, the evaluation\n"
        " * `searchWithoutPieceTerms` and `chooseMoveWithoutPieceTerms` call. The walk gathers either way.\n */\n"
        "export function evaluateAtPhaseWithoutPieceTerms(position: Position, phase: number): number {\n"
        "  const score = whiteMinusBlack(position, true, true, true, false, phase);\n"
        "  return position.blackToMove ? 0 - score : score;\n}\n\n"
        "/**\n * TEST-ONLY. `evaluate` with the mobility weight at 0")
t = sub(t, "whiteMinusBlack(position, false, true, true, phaseOf(position))", "whiteMinusBlack(position, false, true, true, true, phaseOf(position))")
t = sub(t, "whiteMinusBlack(position, true, false, true, phaseOf(position))", "whiteMinusBlack(position, true, false, true, true, phaseOf(position))")
t = sub(t, "whiteMinusBlack(position, true, true, false, 0)", "whiteMinusBlack(position, true, true, false, false, 0)")

# ---- d5: the seam, and pawnStructureForTest's one field ----
t = sub(t, "/**\n * TEST-ONLY (`ABC-271` K1 (e)): `pawnStructure`'s packed sum",
        "/**\n * TEST-ONLY (`ADR-0076` decision 5): each side's three parts, mg and eg, per side and never netted,\n"
        " * from the same `pieceTermsOfSide` the hot path runs, on a fresh `pawnStructure`'s file word.\n */\n"
        "export function pieceTermsForTest(position: Position): {\n"
        "  white: Record<\"BISHOP_PAIR\" | \"ROOK_OPEN_FILE\" | \"ROOK_SEMI_OPEN_FILE\", { mg: number; eg: number }>;\n"
        "  black: Record<\"BISHOP_PAIR\" | \"ROOK_OPEN_FILE\" | \"ROOK_SEMI_OPEN_FILE\", { mg: number; eg: number }>;\n"
        "} {\n"
        "  const board = position.board;\n"
        "  let whiteRooks = 0;\n  let blackRooks = 0;\n  let whiteBishops = 0;\n  let blackBishops = 0;\n"
        "  for (let square = 0; square < 128; square++) {\n"
        "    if ((square & 0x88) !== 0) continue;\n"
        "    const piece = board[square] as number;\n"
        "    if (piece === EMPTY) continue;\n"
        "    const type = pieceType(piece);\n"
        "    if (type === ROOK) {\n      if (isBlack(piece)) blackRooks |= 1 << fileOf(square);\n      else whiteRooks |= 1 << fileOf(square);\n"
        "    } else if (type === BISHOP) {\n      if (isBlack(piece)) blackBishops++;\n      else whiteBishops++;\n    }\n"
        "  }\n"
        "  pawnStructure(board);\n"
        "  const whiteFiles = filesPart & 0xff;\n  const blackFiles = filesPart >> 8;\n"
        "  const halves = (packed: number): { mg: number; eg: number } => {\n"
        "    const mg = (packed << 16) >> 16;\n"
        "    return { mg, eg: (packed - mg) / PACK };\n"
        "  };\n"
        "  const parts = () => ({\n    BISHOP_PAIR: halves(bishopPairPart),\n    ROOK_OPEN_FILE: halves(openFilePart),\n"
        "    ROOK_SEMI_OPEN_FILE: halves(semiOpenFilePart),\n  });\n"
        "  pieceTermsOfSide(whiteRooks, whiteFiles, blackFiles, whiteBishops);\n"
        "  const white = parts();\n"
        "  pieceTermsOfSide(blackRooks, blackFiles, whiteFiles, blackBishops);\n"
        "  return { white, black: parts() };\n"
        "}\n\n"
        "/**\n * TEST-ONLY (`ABC-271` K1 (e)): `pawnStructure`'s packed sum")
t = sub(t, "): { structure: number; whitePassers: number; blackPassers: number } {",
        "): { structure: number; whitePassers: number; blackPassers: number; files: number } {")
t = sub(t, "  return { structure, whitePassers: whitePassersPart, blackPassers: blackPassersPart };\n",
        "  return {\n    structure,\n    whitePassers: whitePassersPart,\n    blackPassers: blackPassersPart,\n    files: filesPart,\n  };\n")

# ---- d6's named cut (the `cut` copy only): kingExposure reads the memo's file word ----
if CUT:
    t = sub(t, "  ownPawn: number,\n  enemyPawn: number,\n  step: number,\n  enemyQueen: boolean,\n): number {",
            "  ownPawn: number,\n  ownFiles: number,\n  enemyFiles: number,\n  step: number,\n  enemyQueen: boolean,\n): number {")
    t = sub(t, "    let own = false;\n    let enemy = false;\n    for (let rank = 1; rank <= 6; rank++) {\n"
               "      const piece = board[rank * 16 + file];\n      if (piece === ownPawn) own = true;\n"
               "      else if (piece === enemyPawn) enemy = true;\n    }\n    if (!own) penalty += enemy ? fileHalfOpen : fileOpen;\n",
            "    // `ADR-0076` d6's cut: the memo's file word (ranks 2-7), not a 6-rank scan.\n"
            "    if (((ownFiles >> file) & 1) === 0) penalty += ((enemyFiles >> file) & 1) !== 0 ? fileHalfOpen : fileOpen;\n")
    t = sub(t, "  const kingSafety =\n    kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1, whiteQueen) -\n"
               "    kingExposure(board, whiteKing, PAWN, BLACK_PAWN, 1, blackQueen);\n\n"
               "  const structure = pawnCache\n    ? pawnStructureCached(board, whitePawns, blackPawns, pawnSlotWord)\n    : pawnStructure(board);\n",
            "  const structure = pawnCache\n    ? pawnStructureCached(board, whitePawns, blackPawns, pawnSlotWord)\n    : pawnStructure(board);\n"
            "  const whiteFileSet = filesPart & 0xff;\n  const blackFileSet = filesPart >> 8;\n"
            "  const kingSafety =\n    kingExposure(board, blackKing, BLACK_PAWN, blackFileSet, whiteFileSet, -1, whiteQueen) -\n"
            "    kingExposure(board, whiteKing, PAWN, whiteFileSet, blackFileSet, 1, blackQueen);\n"
            "  // E5 (`ADR-0076` decision 4): after the memo, one packed add, read only when the switch is on.\n"
            "  const pieces = pieceTerms\n"
            "    ? pieceTermsOfSide(whiteRooks, whiteFileSet, blackFileSet, whiteBishops) -\n"
            "      pieceTermsOfSide(blackRooks, blackFileSet, whiteFileSet, blackBishops)\n"
            "    : 0;\n")
    t = sub(t, "    white: halves(kingExposure(board, whiteKing, PAWN, BLACK_PAWN, 1, blackQueen)),\n"
               "    black: halves(kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1, whiteQueen)),\n",
            "    white: halves(kingExposure(board, whiteKing, PAWN, wf, bf, 1, blackQueen)),\n"
            "    black: halves(kingExposure(board, blackKing, BLACK_PAWN, bf, wf, -1, whiteQueen)),\n")
    t = sub(t, "  const halves = (packed: number): { mg: number; eg: number } => {\n    const mg = (packed << 16) >> 16;\n"
               "    return { mg, eg: (packed - mg) / PACK };\n  };\n  return {\n    white: halves(kingExposure(",
            "  pawnStructure(board);\n  const wf = filesPart & 0xff;\n  const bf = filesPart >> 8;\n"
            "  const halves = (packed: number): { mg: number; eg: number } => {\n    const mg = (packed << 16) >> 16;\n"
            "    return { mg, eg: (packed - mg) / PACK };\n  };\n  return {\n    white: halves(kingExposure(")
ev.write_text(t)

# ---- d5: quiescence's rules record ----
q = qu.read_text()
q = sub(q, 'import { evaluateAtPhase, evaluateWithoutTaper, phaseAfterMove } from "./evaluate.ts";\n',
        'import {\n  evaluateAtPhase,\n  evaluateAtPhaseWithoutPieceTerms,\n  evaluateWithoutTaper,\n  phaseAfterMove,\n} from "./evaluate.ts";\n')
q = sub(q, "  readonly seePruning?: boolean;\n}\n",
        "  readonly seePruning?: boolean;\n"
        "  /** The stand pat adds the piece terms (`ABC-292`, `ADR-0076` decision 5). True only in the shipped record. */\n"
        "  readonly pieceTerms?: boolean;\n}\n")
q = sub(q, "      rules.taper === true ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);\n",
        "      rules.taper === true\n        ? rules.pieceTerms === true\n          ? evaluateAtPhase(position, phase)\n"
        "          : evaluateAtPhaseWithoutPieceTerms(position, phase)\n        : evaluateWithoutTaper(position);\n")
qu.write_text(q)

# ---- d5: src/search.ts ----
s = se.read_text()
s = sub(s, 'import { evaluateAtPhase, evaluateWithoutTaper, phaseAfterMove, phaseOf } from "./evaluate.ts";\n',
        'import {\n  evaluateAtPhase,\n  evaluateAtPhaseWithoutPieceTerms,\n  evaluateWithoutTaper,\n  phaseAfterMove,\n  phaseOf,\n} from "./evaluate.ts";\n')
s = sub(s, "  taper: true,\n  seePruning: true,\n};\n\nexport interface SearchResult {",
        "  taper: true,\n  seePruning: true,\n};\n"
        "/** `search()`'s record (`ABC-292`, `ADR-0076` decision 5): `RULES_SEE_PRUNING` with the piece terms. */\n"
        "const RULES_PIECE_TERMS: QuiescenceRules = {\n  evasions: true,\n  quietPromotions: true,\n  taper: true,\n  seePruning: true,\n  pieceTerms: true,\n};\n"
        "\nexport interface SearchResult {")
s = sub(s, "  readonly taper: boolean;\n", "  readonly taper: boolean;\n  /** The piece terms (`ABC-292`, `ADR-0076` decision 5): true on `search()` only. */\n  readonly pieceTerms: boolean;\n")
s = sub(s, "  taper: boolean,\n  phase: number,\n): boolean {\n", "  taper: boolean,\n  pieceTerms: boolean,\n  phase: number,\n): boolean {\n")
s = sub(s, "  const staticScore = taper ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);\n",
        "  const staticScore = taper\n    ? pieceTerms\n      ? evaluateAtPhase(position, phase)\n      : evaluateAtPhaseWithoutPieceTerms(position, phase)\n    : evaluateWithoutTaper(position);\n")
s = sub(s, "      return switches.taper ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);\n",
        "      return switches.taper\n        ? switches.pieceTerms\n          ? evaluateAtPhase(position, phase)\n          : evaluateAtPhaseWithoutPieceTerms(position, phase)\n        : evaluateWithoutTaper(position);\n")
s = sub(s, "      ? switches.seePruning\n        ? RULES_SEE_PRUNING\n        : RULES_TAPERED\n",
        "      ? switches.seePruning\n        ? switches.pieceTerms\n          ? RULES_PIECE_TERMS\n          : RULES_SEE_PRUNING\n        : RULES_TAPERED\n")
s = sub(s, "futilityNode(position, depth, ply, alphaIn, beta, switches.taper, phase)",
        "futilityNode(position, depth, ply, alphaIn, beta, switches.taper, switches.pieceTerms, phase)")
s, n = re.subn(r"^    taper: (true|false),\n", lambda m: m.group(0) + "    pieceTerms: false,\n", s, flags=re.M)
if n != 21: raise SystemExit(f"search.ts door records: {n}")
head = "export function search(position: Position, depth: number): SearchResult {\n  return searchRoot(position, depth, {\n"
i = s.index(head); j = s.index("  });\n}\n", i) + len("  });\n}\n")
body = s[i:j]
on = sub(body, "    pieceTerms: false,\n", "    pieceTerms: true,\n")
door = ("\n/**\n * TEST-ONLY (`ABC-292`, `ADR-0076` decision 5): `search()` without the piece terms, the merge-base's\n"
        " * `search()` node for node. Not an engine option; nothing in production calls it.\n */\n"
        + body.replace("export function search(", "export function searchWithoutPieceTerms("))
s = s[:i] + on + door + s[j:]
se.write_text(s)

# ---- d5: src/engine.ts ----
e = en.read_text()
e = sub(e, "  readonly taper: boolean;\n", "  readonly taper: boolean;\n  /** The piece terms (`ABC-292`, `ADR-0076` decision 5): true on `chooseMove` only. */\n  readonly pieceTerms: boolean;\n")
e = sub(e, "  taper: true,\n  seePruning: true,\n};\n\n/** The deepening loop's mutable state",
        "  taper: true,\n  seePruning: true,\n};\n"
        "/** `chooseMove`'s record (`ABC-292`, `ADR-0076` decision 5): `RULES_SEE_PRUNING` with the piece terms. */\n"
        "const RULES_PIECE_TERMS: QuiescenceRules = {\n  evasions: true,\n  quietPromotions: true,\n  taper: true,\n  seePruning: true,\n  pieceTerms: true,\n};\n"
        "\n/** The deepening loop's mutable state")
e = sub(e, "      ? budget.seePruning\n        ? RULES_SEE_PRUNING\n        : RULES_TAPERED\n",
        "      ? budget.seePruning\n        ? budget.pieceTerms\n          ? RULES_PIECE_TERMS\n          : RULES_SEE_PRUNING\n        : RULES_TAPERED\n")
e = sub(e, "futilityNode(position, remaining, ply, alphaIn, beta, budget.taper, phase)",
        "futilityNode(position, remaining, ply, alphaIn, beta, budget.taper, budget.pieceTerms, phase)")
e, n = re.subn(r"^    taper: (true|false),\n", lambda m: m.group(0) + "    pieceTerms: false,\n", e, flags=re.M)
if n != 16: raise SystemExit(f"engine.ts door records: {n}")
head = "export function chooseMove(position: Position, options: EngineOptions): EngineChoice | null {\n  return deepen(position, options, {\n"
i = e.index(head); j = e.index("  });\n}\n", i) + len("  });\n}\n")
body = e[i:j]
on = sub(body, "    pieceTerms: false,\n", "    pieceTerms: true,\n")
door = ("\n/**\n * TEST-ONLY (`ABC-292`, `ADR-0076` decision 5): `chooseMove` without the piece terms, the merge-base's\n"
        " * `chooseMove` node for node. Not an engine option; nothing in production calls it.\n */\n"
        + body.replace("export function chooseMove(position: Position, options: EngineOptions): EngineChoice | null {",
                       "export function chooseMoveWithoutPieceTerms(\n  position: Position,\n  options: EngineOptions,\n): EngineChoice | null {"))
e = e[:i] + on + door + e[j:]
en.write_text(e)

# ---- d5: the tool's QUIET_RULES follows the shipped evaluation ----
if tu.exists():
    u = tu.read_text()
    u = sub(u, "export const QUIET_RULES: QuiescenceRules = { evasions: true, quietPromotions: true, taper: true };\n",
            "export const QUIET_RULES: QuiescenceRules = {\n  evasions: true,\n  quietPromotions: true,\n  taper: true,\n  pieceTerms: true,\n};\n")
    u = sub(u, '"quiesce(full window) with { evasions: true, quietPromotions: true, taper: true }, no seePruning (src/search.ts RULES_TAPERED at main 441c547e; ADR-0069 d6)";\n',
            '"quiesce(full window) with { evasions: true, quietPromotions: true, taper: true, pieceTerms: true }, no seePruning (src/search.ts RULES_TAPERED at main 441c547e; ADR-0069 d6; ADR-0076 d5)";\n')
    tu.write_text(u)
print("patched", root, "cut" if CUT else "")
