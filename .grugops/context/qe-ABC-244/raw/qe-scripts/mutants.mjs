// qe-ABC-244 A6 mutant list. Frozen by freeze.mjs BEFORE any head run (PREREG.txt).
// Each entry: id -> [[file, from, to], ...]; every `from` must occur exactly once in its file, at base AND at head.
// Part 1: the SE's nine (se-ABC-244 probe/mutants.mjs), byte-identical texts (freeze.mjs asserts it).
// Part 2: se-ABC-241 …887921ba M2/M4/M5/M8, reconstructed by QE from their one-line descriptions.
// Part 3: QE's own, aimed at the ABC-230 U1 rows (the four that change step), several depth-sensitive.
import { MUTANTS as SE } from "../../../se-ABC-244/raw/probe/mutants.mjs";

const se = Object.fromEntries(Object.entries(SE).map(([id, edit]) => [id, [edit]]));

export const MUTANTS = {
  ...se,
  // se-ABC-241 M2 "legality ignored (drop the file whenever ep is set)".
  S241M2: [["src/gameend.ts",
    "  if (position.epSquare === NO_SQUARE || hasLegalEnPassant(position)) return key;\n  return key ^ epFileKey",
    "  if (position.epSquare === NO_SQUARE) return key;\n  return key ^ epFileKey"]],
  // se-ABC-241 M4 "repetitionCounts on the hash list".
  S241M4: [["src/history.ts",
    "for (const key of repetitionKeyHistory(history)) counts.set(",
    "for (const key of keyHistory(history)) counts.set("]],
  // se-ABC-241 M5 "claimShortfall on keyHistory (import added)".
  S241M5: [
    ["src/turn-loop.ts", "  repetitionKeyHistory,\n  takeBack,\n} from \"./history.ts\";", "  keyHistory,\n  repetitionKeyHistory,\n  takeBack,\n} from \"./history.ts\";"],
    ["src/turn-loop.ts", "  const keys = repetitionKeyHistory(history);\n  const current", "  const keys = keyHistory(history);\n  const current"],
  ],
  // se-ABC-241 M8 "cli.ts importing keyHistory as repetitionKeyHistory".
  S241M8: [["src/cli.ts",
    "import { newGame, repetitionKeyHistory } from \"./history.ts\";",
    "import { newGame, keyHistory as repetitionKeyHistory } from \"./history.ts\";"]],
  // Q1 the CLI seam hands the list untrimmed (the CLI analog of UNTRIM).
  QSEAMRAW: [["src/level-seam.ts",
    ": trimPriorKeys(keyHistory(history), history.position.halfmoveClock);",
    ": keyHistory(history);"]],
  // Q2 the CLI seam reads keyHistory twice per engine move.
  QSEAMTWICE: [["src/level-seam.ts",
    ": trimPriorKeys(keyHistory(history), history.position.halfmoveClock);",
    ": trimPriorKeys((keyHistory(history), keyHistory(history)), history.position.halfmoveClock);"]],
  // Q3 chooseMove does not read options.priorKeys (its heuristic switch off).
  QPRIOROFF: [["src/engine.ts",
    "  return deepen(position, options, {\n    pvs: true,\n    reductions: true,\n    nullMove: true,\n    priorKeys: true,\n    quiescenceEvasions: true,\n    quietPromotions: true,\n  });",
    "  return deepen(position, options, {\n    pvs: true,\n    reductions: true,\n    nullMove: true,\n    priorKeys: false,\n    quiescenceEvasions: true,\n    quietPromotions: true,\n  });"]],
  // Q4 one occurrence before the root is a draw.
  QMATCH1: [["src/engine.ts", "++matches === 2", "++matches === 1"]],
  // Q5 three occurrences before the root are needed.
  QMATCH3: [["src/engine.ts", "++matches === 2", "++matches === 3"]],
  // Q6 the pre-root walk loses its parity (every ply, not every second).
  QPARITY: [["src/engine.ts", "earlier -= 2", "earlier -= 1"]],
  // Q7 the pre-root walk ignores the halfmove clock (only the list bounds it).
  QCLOCK: [["src/engine.ts",
    "const oldest = Math.max(ply - halfmoveClock, -Math.min(prior.length, PRIOR_KEYS_WINDOW));",
    "const oldest = -Math.min(prior.length, PRIOR_KEYS_WINDOW);"]],
  // Q8 trimPriorKeys drops the key just before the root (off by one; both surfaces).
  QTRIM1: [["src/engine.ts",
    "return keys.slice(Math.max(0, root - Math.min(halfmoveClock, PRIOR_KEYS_WINDOW)), root);",
    "return keys.slice(Math.max(0, root - Math.min(halfmoveClock, PRIOR_KEYS_WINDOW)), root - 1);"]],
  // Q9 the UCI session's chooseMove call drops priorKeys.
  QUCINOKEYS: [["src/uci-session.ts",
    "        budgetMs,\n        now,\n        priorKeys,\n        ...(request.maxDepth",
    "        budgetMs,\n        now,\n        ...(request.maxDepth"]],
  // Q10 depth-sensitive: the pre-root scan is off at ply >= 4 (deep nodes only).
  QPLY4: [["src/engine.ts", "  let matches = 0;\n", "  if (ply >= 4) return false;\n  let matches = 0;\n"]],
  // Q11 depth-sensitive: the on-path repetition scan is off (it needs ply >= 4 to fire).
  QPATHOFF: [["src/engine.ts",
    "    repeatsInPath(keys, ply, position.halfmoveClock) ||\n",
    "    false ||\n"]],
};
