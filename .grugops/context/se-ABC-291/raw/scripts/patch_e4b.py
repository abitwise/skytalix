# SCRATCH PROBE (arch-ABC-291-probe): patches a `git archive` copy of main with ADR-0075 d2, d3 and d4.
# Usage: python3 patch_e4b.py <copy root>. Exact-string edits; each must match the stated count or the script stops.
# The probe-only ON / OFF switch is the probe script's form argument, which picks d4's real exports: ON calls
# `chooseMove`, `search`, `evaluate`; OFF calls `chooseMoveWithoutPawnShape`, `searchWithoutPawnShape`,
# `evaluateAtPhaseWithoutPawnShape`. No module state is added, so the timed path is the one the build would carry.
import re, sys, pathlib

root = pathlib.Path(sys.argv[1])
ev = root / "src/evaluate.ts"
pp = root / "src/evaluate-params.ts"
se = root / "src/search.ts"
en = root / "src/engine.ts"
qu = root / "src/quiescence.ts"

def sub(text, old, new, count=1):
    n = text.count(old)
    if n != count:
        raise SystemExit(f"match count {n} (want {count}) for: {old[:80]!r}")
    return text.replace(old, new)

# ---- d2: the parameter table ----
p = pp.read_text()
p += '''
/**
 * E4b (`ABC-291`, `ADR-0075` decisions 1 and 2): connected, phalanx and backward pawns. Hand values by
 * one rule, fixed before any row. By the pawn's OWN rank R (1 = its start rank, 6 = one step from
 * promotion); every other index is 0.
 * PAWN_CONNECTED[h][R] = PASSED[h][R] x ISOLATED[h] / PASSED[h][4], floored, R = 2 ... 6.
 * PAWN_PHALANX[h][R] = PAWN_CONNECTED[h][R] / 2, floored, R = 2 ... 6.
 * PAWN_BACKWARD[h] = ISOLATED[h], a penalty held as a positive value.
 */
export const PAWN_CONNECTED: MgEg<readonly number[]> = {
  mg: [0, 0, 2, 5, 10, 17, 28, 0],
  eg: [0, 0, 2, 5, 10, 17, 28, 0],
};
export const PAWN_PHALANX: MgEg<readonly number[]> = {
  mg: [0, 0, 1, 2, 5, 8, 14, 0],
  eg: [0, 0, 1, 2, 5, 8, 14, 0],
};
export const PAWN_BACKWARD: MgEg<number> = { mg: 10, eg: 10 };
'''
pp.write_text(p)

t = ev.read_text()

# ---- packed arrays ----
t = sub(t, "const PACKED_TERMS = new Int32Array(8);\n", "const PACKED_TERMS = new Int32Array(9);\n")
t = sub(t, "const OPEN_QUEEN_AT = 7;\n",
        "const OPEN_QUEEN_AT = 7;\nconst BACKWARD_AT = 8;\n"
        "/** E4b (`ADR-0075`): connected and phalanx pawns by own rank, packed. */\n"
        "const PACKED_CONNECTED = new Int32Array(8);\nconst PACKED_PHALANX = new Int32Array(8);\n")
t = sub(t, "  PACKED_TERMS[OPEN_QUEEN_AT] = pair(parameters.KING_FILE_OPEN_QUEEN);\n",
        "  PACKED_TERMS[OPEN_QUEEN_AT] = pair(parameters.KING_FILE_OPEN_QUEEN);\n"
        "  PACKED_TERMS[BACKWARD_AT] = pair(parameters.PAWN_BACKWARD);\n"
        "  for (let rank = 0; rank < 8; rank++) {\n"
        "    PACKED_CONNECTED[rank] = pack(\n"
        "      parameters.PAWN_CONNECTED.mg[rank] as number,\n"
        "      parameters.PAWN_CONNECTED.eg[rank] as number,\n"
        "    );\n"
        "    PACKED_PHALANX[rank] = pack(\n"
        "      parameters.PAWN_PHALANX.mg[rank] as number,\n"
        "      parameters.PAWN_PHALANX.eg[rank] as number,\n"
        "    );\n"
        "  }\n")

# ---- d3: pawnStructure's parts ----
t = sub(t, "let blackPassersPart = 0;\n\n/**\n * The three pawn terms from WHITE's point of view",
        "let blackPassersPart = 0;\n"
        "/**\n * E4b (`ADR-0075` decision 3): the packed sum of the three shape terms, white minus black, set by\n"
        " * each `pawnStructure` call and by a memo hit, and kept out of `pawnStructure`'s return value. The\n"
        " * six per-side parts feed `pawnShapeForTest` only, and only a fresh call sets them.\n */\n"
        "let shapePart = 0;\n"
        "let whiteConnectedPart = 0;\nlet whitePhalanxPart = 0;\nlet whiteBackwardPart = 0;\n"
        "let blackConnectedPart = 0;\nlet blackPhalanxPart = 0;\nlet blackBackwardPart = 0;\n"
        "\n/**\n * The three pawn terms from WHITE's point of view")
t = sub(t, "  let whitePassers = 0;\n  let blackPassers = 0;\n\n  for (let rank = 1; rank <= 6; rank++) {\n    for (let file = 0; file < 8; file++) {\n      const piece = board[rank * 16 + file];\n      const bit = 1 << file;",
        "  let whitePassers = 0;\n  let blackPassers = 0;\n"
        "  const backwardPenalty = PACKED_TERMS[BACKWARD_AT] as number;\n"
        "  // The rearmost pawn per file, 3 bits a file, its board rank (0 for none): words, not arrays.\n"
        "  let whiteRear = 0;\n  let blackRear = 0;\n"
        "  let whiteConnected = 0;\n  let whitePhalanx = 0;\n  let whiteBackward = 0;\n"
        "  let blackConnected = 0;\n  let blackPhalanx = 0;\n  let blackBackward = 0;\n"
        "\n  for (let rank = 1; rank <= 6; rank++) {\n    for (let file = 0; file < 8; file++) {\n      const piece = board[rank * 16 + file];\n      const bit = 1 << file;")
t = sub(t, "        if ((whiteFiles & bit) !== 0) doubled -= doubledPenalty;\n        whiteFiles |= bit;\n",
        "        if ((whiteFiles & bit) !== 0) doubled -= doubledPenalty;\n"
        "        else whiteRear |= rank << (3 * file); // ranks run upward: the first found is the rearmost\n"
        "        whiteFiles |= bit;\n")
t = sub(t, "        if ((blackFiles & bit) !== 0) doubled += doubledPenalty;\n        blackFiles |= bit;\n",
        "        if ((blackFiles & bit) !== 0) doubled += doubledPenalty;\n"
        "        // Black moves down the ranks: the last found on the file is the rearmost, so overwrite.\n"
        "        blackRear = (blackRear & ~(7 << (3 * file))) | (rank << (3 * file));\n"
        "        blackFiles |= bit;\n")
t = sub(t, "        if ((whiteFiles & adjacentFiles(file)) === 0) isolated -= isolatedPenalty;\n",
        "        if ((whiteFiles & adjacentFiles(file)) === 0) isolated -= isolatedPenalty;\n"
        "        if ((file > 0 && board[square - 17] === PAWN) || (file < 7 && board[square - 15] === PAWN)) {\n"
        "          whiteConnected += PACKED_CONNECTED[rank] as number;\n"
        "        }\n"
        "        if ((file > 0 && board[square - 1] === PAWN) || (file < 7 && board[square + 1] === PAWN)) {\n"
        "          whitePhalanx += PACKED_PHALANX[rank] as number;\n"
        "        }\n"
        "        const left = file > 0 ? (whiteRear >> (3 * (file - 1))) & 7 : 0;\n"
        "        const right = file < 7 ? (whiteRear >> (3 * (file + 1))) & 7 : 0;\n"
        "        if (\n"
        "          (left | right) !== 0 &&\n"
        "          (left === 0 || left > rank) &&\n"
        "          (right === 0 || right > rank) &&\n"
        "          (board[square + 16] === BLACK_PAWN ||\n"
        "            (rank <= 4 &&\n"
        "              ((file > 0 && board[square + 31] === BLACK_PAWN) ||\n"
        "                (file < 7 && board[square + 33] === BLACK_PAWN))))\n"
        "        ) {\n"
        "          whiteBackward += backwardPenalty;\n"
        "        }\n")
t = sub(t, "        if ((blackFiles & adjacentFiles(file)) === 0) isolated += isolatedPenalty;\n",
        "        if ((blackFiles & adjacentFiles(file)) === 0) isolated += isolatedPenalty;\n"
        "        if (\n"
        "          (file > 0 && board[square + 15] === BLACK_PAWN) ||\n"
        "          (file < 7 && board[square + 17] === BLACK_PAWN)\n"
        "        ) {\n"
        "          blackConnected += PACKED_CONNECTED[7 - rank] as number;\n"
        "        }\n"
        "        if (\n"
        "          (file > 0 && board[square - 1] === BLACK_PAWN) ||\n"
        "          (file < 7 && board[square + 1] === BLACK_PAWN)\n"
        "        ) {\n"
        "          blackPhalanx += PACKED_PHALANX[7 - rank] as number;\n"
        "        }\n"
        "        const left = file > 0 ? (blackRear >> (3 * (file - 1))) & 7 : 0;\n"
        "        const right = file < 7 ? (blackRear >> (3 * (file + 1))) & 7 : 0;\n"
        "        if (\n"
        "          (left | right) !== 0 &&\n"
        "          (left === 0 || left < rank) &&\n"
        "          (right === 0 || right < rank) &&\n"
        "          (board[square - 16] === PAWN ||\n"
        "            (rank >= 3 &&\n"
        "              ((file > 0 && board[square - 33] === PAWN) ||\n"
        "                (file < 7 && board[square - 31] === PAWN))))\n"
        "        ) {\n"
        "          blackBackward += backwardPenalty;\n"
        "        }\n")
t = sub(t, "  blackPassersPart = blackPassers;\n  return doubled + isolated + passed;\n",
        "  blackPassersPart = blackPassers;\n"
        "  whiteConnectedPart = whiteConnected;\n  whitePhalanxPart = whitePhalanx;\n  whiteBackwardPart = whiteBackward;\n"
        "  blackConnectedPart = blackConnected;\n  blackPhalanxPart = blackPhalanx;\n  blackBackwardPart = blackBackward;\n"
        "  shapePart =\n"
        "    whiteConnected + whitePhalanx - whiteBackward - (blackConnected + blackPhalanx - blackBackward);\n"
        "  return doubled + isolated + passed;\n")

# ---- d3: the memo ----
t = sub(t, "const pawnCacheBlackPassers = new Int32Array(PAWN_CACHE_SLOTS);\n",
        "const pawnCacheBlackPassers = new Int32Array(PAWN_CACHE_SLOTS);\nconst pawnCacheShape = new Int32Array(PAWN_CACHE_SLOTS);\n")
t = sub(t, "    blackPassersPart = pawnCacheBlackPassers[slot] as number;\n    return (\n",
        "    blackPassersPart = pawnCacheBlackPassers[slot] as number;\n    shapePart = pawnCacheShape[slot] as number;\n    return (\n")
t = sub(t, "  pawnCacheBlackPassers[slot] = blackPassersPart;\n  return structure;\n",
        "  pawnCacheBlackPassers[slot] = blackPassersPart;\n  pawnCacheShape[slot] = shapePart;\n  return structure;\n")
t = sub(t, "    pawnCacheWhitePassers.byteLength +\n    pawnCacheBlackPassers.byteLength\n",
        "    pawnCacheWhitePassers.byteLength +\n    pawnCacheBlackPassers.byteLength +\n    pawnCacheShape.byteLength\n")

# ---- d4: the switch on the walk ----
t = sub(t, "  pawnCache: boolean,\n  taper: boolean,\n  phase: number,\n): number {\n  const board = position.board;\n  let score = 0;",
        "  pawnCache: boolean,\n  taper: boolean,\n  pawnShape: boolean,\n  phase: number,\n): number {\n  const board = position.board;\n  let score = 0;")
t = sub(t, "  const packed = score + structure + kingSafety;\n",
        "  const packed = score + structure + kingSafety + (pawnShape ? shapePart : 0);\n")
t = sub(t, "  const score = whiteMinusBlack(position, true, true, true, phase);\n  // `0 - score`, not `-score`",
        "  const score = whiteMinusBlack(position, true, true, true, true, phase);\n  // `0 - score`, not `-score`")
t = sub(t, "/**\n * TEST-ONLY. `evaluate` with the mobility weight at 0",
        "/**\n * TEST-ONLY (`ADR-0075` decision 4): `evaluateAtPhase` without the shape part, the evaluation\n"
        " * `searchWithoutPawnShape` and `chooseMoveWithoutPawnShape` call. It reads the same memo, keyed the same way.\n */\n"
        "export function evaluateAtPhaseWithoutPawnShape(position: Position, phase: number): number {\n"
        "  const score = whiteMinusBlack(position, true, true, true, false, phase);\n"
        "  return position.blackToMove ? 0 - score : score;\n}\n\n"
        "/**\n * TEST-ONLY. `evaluate` with the mobility weight at 0")
t = sub(t, "whiteMinusBlack(position, false, true, true, phaseOf(position))", "whiteMinusBlack(position, false, true, true, true, phaseOf(position))")
t = sub(t, "whiteMinusBlack(position, true, false, true, phaseOf(position))", "whiteMinusBlack(position, true, false, true, true, phaseOf(position))")
t = sub(t, "whiteMinusBlack(position, true, true, false, 0)", "whiteMinusBlack(position, true, true, false, false, 0)")

# ---- d4: the seam, and pawnStructureForTest's one field ----
t = sub(t, "/**\n * TEST-ONLY (`ABC-271` K1 (e)): `pawnStructure`'s packed sum",
        "/**\n * TEST-ONLY (`ADR-0075` decision 4): each side's three shape parts, mg and eg, per side and never\n"
        " * netted, from a fresh `pawnStructure` (the `kingExposureForTest` precedent). Backward reads as a\n"
        " * positive penalty.\n */\n"
        "export function pawnShapeForTest(position: Position): {\n"
        "  white: Record<\"connected\" | \"phalanx\" | \"backward\", { mg: number; eg: number }>;\n"
        "  black: Record<\"connected\" | \"phalanx\" | \"backward\", { mg: number; eg: number }>;\n"
        "} {\n"
        "  pawnStructure(position.board);\n"
        "  const halves = (packed: number): { mg: number; eg: number } => {\n"
        "    const mg = (packed << 16) >> 16;\n"
        "    return { mg, eg: (packed - mg) / PACK };\n"
        "  };\n"
        "  return {\n"
        "    white: {\n"
        "      connected: halves(whiteConnectedPart),\n"
        "      phalanx: halves(whitePhalanxPart),\n"
        "      backward: halves(whiteBackwardPart),\n"
        "    },\n"
        "    black: {\n"
        "      connected: halves(blackConnectedPart),\n"
        "      phalanx: halves(blackPhalanxPart),\n"
        "      backward: halves(blackBackwardPart),\n"
        "    },\n"
        "  };\n"
        "}\n\n"
        "/**\n * TEST-ONLY (`ABC-271` K1 (e)): `pawnStructure`'s packed sum")
t = sub(t, "): { structure: number; whitePassers: number; blackPassers: number } {",
        "): { structure: number; whitePassers: number; blackPassers: number; shape: number } {")
t = sub(t, "  return { structure, whitePassers: whitePassersPart, blackPassers: blackPassersPart };\n",
        "  return {\n    structure,\n    whitePassers: whitePassersPart,\n    blackPassers: blackPassersPart,\n    shape: shapePart,\n  };\n")
ev.write_text(t)

# ---- d4: quiescence's rules record ----
q = qu.read_text()
q = sub(q, 'import { evaluateAtPhase, evaluateWithoutTaper, phaseAfterMove } from "./evaluate.ts";\n',
        'import {\n  evaluateAtPhase,\n  evaluateAtPhaseWithoutPawnShape,\n  evaluateWithoutTaper,\n  phaseAfterMove,\n} from "./evaluate.ts";\n')
q = sub(q, "  readonly seePruning?: boolean;\n}\n",
        "  readonly seePruning?: boolean;\n"
        "  /** The stand pat adds the shape part (`ABC-291`, `ADR-0075` decision 4). True only in the shipped record. */\n"
        "  readonly pawnShape?: boolean;\n}\n")
q = sub(q, "      rules.taper === true ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);\n",
        "      rules.taper === true\n        ? rules.pawnShape === true\n          ? evaluateAtPhase(position, phase)\n"
        "          : evaluateAtPhaseWithoutPawnShape(position, phase)\n        : evaluateWithoutTaper(position);\n")
qu.write_text(q)

# ---- d4: src/search.ts ----
s = se.read_text()
s = sub(s, 'import { evaluateAtPhase, evaluateWithoutTaper, phaseAfterMove, phaseOf } from "./evaluate.ts";\n',
        'import {\n  evaluateAtPhase,\n  evaluateAtPhaseWithoutPawnShape,\n  evaluateWithoutTaper,\n  phaseAfterMove,\n  phaseOf,\n} from "./evaluate.ts";\n')
s = sub(s, "  taper: true,\n  seePruning: true,\n};\n\nexport interface SearchResult {",
        "  taper: true,\n  seePruning: true,\n};\n"
        "/** `search()`'s record (`ABC-291`, `ADR-0075` decision 4): `RULES_SEE_PRUNING` with the shape part. */\n"
        "const RULES_PAWN_SHAPE: QuiescenceRules = {\n  evasions: true,\n  quietPromotions: true,\n  taper: true,\n  seePruning: true,\n  pawnShape: true,\n};\n"
        "\nexport interface SearchResult {")
s = sub(s, "  readonly taper: boolean;\n", "  readonly taper: boolean;\n  /** The shape part (`ABC-291`, `ADR-0075` decision 4): true on `search()` only. */\n  readonly pawnShape: boolean;\n")
s = sub(s, "  taper: boolean,\n  phase: number,\n): boolean {\n", "  taper: boolean,\n  pawnShape: boolean,\n  phase: number,\n): boolean {\n")
s = sub(s, "  const staticScore = taper ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);\n",
        "  const staticScore = taper\n    ? pawnShape\n      ? evaluateAtPhase(position, phase)\n      : evaluateAtPhaseWithoutPawnShape(position, phase)\n    : evaluateWithoutTaper(position);\n")
s = sub(s, "      return switches.taper ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);\n",
        "      return switches.taper\n        ? switches.pawnShape\n          ? evaluateAtPhase(position, phase)\n          : evaluateAtPhaseWithoutPawnShape(position, phase)\n        : evaluateWithoutTaper(position);\n")
s = sub(s, "      ? switches.seePruning\n        ? RULES_SEE_PRUNING\n        : RULES_TAPERED\n",
        "      ? switches.seePruning\n        ? switches.pawnShape\n          ? RULES_PAWN_SHAPE\n          : RULES_SEE_PRUNING\n        : RULES_TAPERED\n")
s = sub(s, "futilityNode(position, depth, ply, alphaIn, beta, switches.taper, phase)",
        "futilityNode(position, depth, ply, alphaIn, beta, switches.taper, switches.pawnShape, phase)")
s, n = re.subn(r"^    taper: (true|false),\n", lambda m: m.group(0) + "    pawnShape: false,\n", s, flags=re.M)
if n != 21: raise SystemExit(f"search.ts door records: {n}")
head = "export function search(position: Position, depth: number): SearchResult {\n  return searchRoot(position, depth, {\n"
i = s.index(head); j = s.index("  });\n}\n", i) + len("  });\n}\n")
body = s[i:j]
on = sub(body, "    pawnShape: false,\n", "    pawnShape: true,\n")
door = ("\n/**\n * TEST-ONLY (`ABC-291`, `ADR-0075` decision 4): `search()` without the shape part, the merge-base's\n"
        " * `search()` node for node. Not an engine option; nothing in production calls it.\n */\n"
        + body.replace("export function search(", "export function searchWithoutPawnShape("))
s = s[:i] + on + door + s[j:]
se.write_text(s)

# ---- d4: src/engine.ts ----
e = en.read_text()
e = sub(e, "  readonly taper: boolean;\n", "  readonly taper: boolean;\n  /** The shape part (`ABC-291`, `ADR-0075` decision 4): true on `chooseMove` only. */\n  readonly pawnShape: boolean;\n")
e = sub(e, "  taper: true,\n  seePruning: true,\n};\n\n/** The deepening loop's mutable state",
        "  taper: true,\n  seePruning: true,\n};\n"
        "/** `chooseMove`'s record (`ABC-291`, `ADR-0075` decision 4): `RULES_SEE_PRUNING` with the shape part. */\n"
        "const RULES_PAWN_SHAPE: QuiescenceRules = {\n  evasions: true,\n  quietPromotions: true,\n  taper: true,\n  seePruning: true,\n  pawnShape: true,\n};\n"
        "\n/** The deepening loop's mutable state")
e = sub(e, "      ? budget.seePruning\n        ? RULES_SEE_PRUNING\n        : RULES_TAPERED\n",
        "      ? budget.seePruning\n        ? budget.pawnShape\n          ? RULES_PAWN_SHAPE\n          : RULES_SEE_PRUNING\n        : RULES_TAPERED\n")
e = sub(e, "futilityNode(position, remaining, ply, alphaIn, beta, budget.taper, phase)",
        "futilityNode(position, remaining, ply, alphaIn, beta, budget.taper, budget.pawnShape, phase)")
e, n = re.subn(r"^    taper: (true|false),\n", lambda m: m.group(0) + "    pawnShape: false,\n", e, flags=re.M)
if n != 16: raise SystemExit(f"engine.ts door records: {n}")
head = "export function chooseMove(position: Position, options: EngineOptions): EngineChoice | null {\n  return deepen(position, options, {\n"
i = e.index(head); j = e.index("  });\n}\n", i) + len("  });\n}\n")
body = e[i:j]
on = sub(body, "    pawnShape: false,\n", "    pawnShape: true,\n")
door = ("\n/**\n * TEST-ONLY (`ABC-291`, `ADR-0075` decision 4): `chooseMove` without the shape part, the merge-base's\n"
        " * `chooseMove` node for node. Not an engine option; nothing in production calls it.\n */\n"
        + body.replace("export function chooseMove(position: Position, options: EngineOptions): EngineChoice | null {",
                       "export function chooseMoveWithoutPawnShape(\n  position: Position,\n  options: EngineOptions,\n): EngineChoice | null {"))
e = e[:i] + on + door + e[j:]
en.write_text(e)
print("patched", root)
