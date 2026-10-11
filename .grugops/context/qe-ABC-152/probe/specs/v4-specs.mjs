// QE ABC-152 V4: QE's OWN production plants, one or more per file in the set. Run on a scratch copy of the tip.
// Every plant differs from the SE's (`…99dca079`) in site or function, except where the ticket names the plant
// (A20 x2, R2 (a)/(b), the A2 salt shape) and the SE's PRODUCTION_DEPS pair, which QE re-runs to grade it.
const p = (id, tests, edits, expect, why) => ({ id, tests, edits, expect, why });
const e = (file, find, replace, count) => ({ file, find, replace, count });

export default [
  // controls: each test file in the set, unplanted
  p("ctl-set", [
    "src/cli.test.ts", "src/render-seam.test.ts", "src/command-input.test.ts", "src/san.test.ts",
    "tools/opening-book/book.test.ts", "src/gameend.nfr.test.ts", "src/glyph-mode.nfr.test.ts",
    "src/history-pane.nfr.test.ts", "src/san.nfr.test.ts", "src/status-panel.nfr.test.ts",
    "src/turn-loop.nfr.test.ts", "src/turn-loop.test.ts", "src/zobrist.nfr.test.ts", "src/book.test.ts",
    "src/levels.test.ts", "src/search.ordering.test.ts", "src/engine.capacity.test.ts",
    "src/search.capacity.test.ts", "src/search.pvs-lmr.test.ts", "src/transposition.test.ts",
  ], [], "green", "the 20 files, unplanted"),

  // cli (R1): selectGlyphMode reached from the refusal helper `reject` (SE planted resolveOptions' body)
  p("cli-reject-calls-selectGlyphMode", ["src/cli.test.ts"], [
    e("src/cli-options.ts", 'import type { GlyphFlags } from "./glyph-mode.ts";', 'import { type GlyphFlags, selectGlyphMode } from "./glyph-mode.ts";'),
    e("src/cli-options.ts", "const reject = (problem: string, ...offending: readonly string[]): Resolution => ({\n", "const reject = (problem: string, ...offending: readonly string[]): Resolution => (selectGlyphMode({ ascii: false, unicode: false, isTTY: false, env: {} }), {\n"),
  ], "red", "expected-0 guard (A5); plant adds the call"),

  // render-seam (R1): gameStatusOf in the seam (A2 expects 0); renderHistory twice (expects 1)
  p("rs-seam-calls-gameStatusOf", ["src/render-seam.test.ts"], [
    e("src/render-seam.ts", 'import { renderHistory } from "./history-pane.ts";', 'import { renderHistory } from "./history-pane.ts";\nimport { gameStatusOf } from "./history.ts";'),
    e("src/render-seam.ts", "        history: renderHistory(history),\n", "        history: (gameStatusOf(history), renderHistory(history)),\n"),
  ], "red", "expected-0 statusOf guard; plant adds the call"),
  p("rs-renderHistory-twice", ["src/render-seam.test.ts"], [
    e("src/render-seam.ts", "        history: renderHistory(history),\n", "        history: (renderHistory(history), renderHistory(history)),\n"),
  ], "red", "renderHistory expected 1"),

  // command-input (R3): `moves` resolved twice in resolvePromptLine (SE planted inside movesMessages)
  p("ci-r3-movesMessages-twice", ["src/command-input.test.ts"], [
    e("src/command-input.ts", "    return { kind: \"command\", messages: movesMessages(history.position, deps) };\n", "    return { kind: \"command\", messages: (movesMessages(history.position, deps), movesMessages(history.position, deps)) };\n"),
  ], "red", "R3 derive site: called 1 times, but got 2"),
  // command-input (R3, clause-6 site): the quit arm derives through deps (expects 0)
  p("ci-r3-quit-derives", ["src/command-input.test.ts"], [
    e("src/command-input.ts", '  if (spec.token === "quit") return { kind: "command", messages: QUIT_CONFIRMATION_MESSAGES };\n', '  if (spec.token === "quit") {\n    deps?.legalMoves(history.position);\n    return { kind: "command", messages: QUIT_CONFIRMATION_MESSAGES };\n  }\n'),
  ], "red", "R3 clause-6 site: expected 0"),
  // command-input (R5, history.ts { spy: true }): repetitionCounts called directly on the help arm (A6 expects 0)
  p("ci-r5-history-repetitionCounts", ["src/command-input.test.ts"], [
    e("src/command-input.ts", 'import type { GameHistory } from "./history.ts";', 'import { type GameHistory, repetitionCounts } from "./history.ts";'),
    e("src/command-input.ts", '  return { kind: "command", messages: spec.token === "help" ? helpMessages() : [] };\n', '  if (spec.token === "help") repetitionCounts(history);\n  return { kind: "command", messages: spec.token === "help" ? helpMessages() : [] };\n'),
  ], "red", "R5 history spy: A6 repetitionDerives expects 0"),
  // command-input (R5, legal.ts { spy: true }): resign derives (A2/A3 expect 0 after the outcome)
  p("ci-r5-legal-resign", ["src/command-input.test.ts"], [
    e("src/command-input.ts", '  if (spec.outcome === "game-over") {\n', '  if (spec.outcome === "game-over") {\n    legalMoves(history.position);\n'),
  ], "red", "R5 legal spy: 0 legalMoves after the outcome"),
  // command-input (R5, PRODUCTION_DEPS path, src/move-input.ts:108): the SE's two plants, re-run by QE
  p("ci-pd-add-SE", ["src/command-input.test.ts"], [
    e("src/move-input.ts", "const PRODUCTION_DEPS: MoveInputDeps = { legalMoves, parseCoordinateMove, parseSan, toSan };", "const PRODUCTION_DEPS: MoveInputDeps = {\n  legalMoves: (position) => (legalMoves(position), legalMoves(position)), // PLANT\n  parseCoordinateMove,\n  parseSan,\n  toSan,\n};"),
  ], "green", "SE's add-plant: >= 1 guard cannot see an extra call (graded)"),
  p("ci-pd-remove-SE", ["src/command-input.test.ts"], [
    e("src/move-input.ts", "const PRODUCTION_DEPS: MoveInputDeps = { legalMoves, parseCoordinateMove, parseSan, toSan };", "const PRODUCTION_DEPS: MoveInputDeps = {\n  legalMoves: () => [], // PLANT\n  parseCoordinateMove,\n  parseSan,\n  toSan,\n};"),
  ], "red", "SE's removal plant"),
  // command-input (R5, PRODUCTION_DEPS path): QE's own removal, routed around the mock by a query-string import
  p("ci-pd-route-around-QE", ["src/command-input.test.ts"], [
    e("src/move-input.ts", "const PRODUCTION_DEPS: MoveInputDeps = { legalMoves, parseCoordinateMove, parseSan, toSan };", "import { legalMoves as qeUnmockedLegal } from \"./legal.ts?qe152\";\nconst PRODUCTION_DEPS: MoveInputDeps = { legalMoves: qeUnmockedLegal, parseCoordinateMove, parseSan, toSan };"),
  ], "red", "the deps path imports legal.ts by another URL: does the mock still count it?"),

  // san (ruling 2): the ticket's two plants, plus QE's: a default export, and a type-only export (must stay green)
  p("san-a20-export-const-PLANT", ["src/san.test.ts"], [e("src/san.ts", "export function toSan(", "export const PLANT = 1;\nexport function toSan(")], "red", "ticket plant 1"),
  p("san-a20-alias-toSanX", ["src/san.test.ts"], [e("src/san.ts", "export function toSan(", "export { toSan as toSanX };\nexport function toSan(")], "red", "ticket plant 2"),
  p("san-a20-default-export-QE", ["src/san.test.ts"], [e("src/san.ts", "export function toSan(", "export default 0;\nexport function toSan(")], "red", "QE: a default export grows the surface"),
  p("san-a20-type-export-QE", ["src/san.test.ts"], [e("src/san.ts", "export function toSan(", "export type QePlant = number;\nexport function toSan(")], "green", "QE: a type-only export is erased, not run-time surface"),

  // tools/opening-book/book (R2): the ticket's (a) and (b), test side; QE's own production routing plant
  p("book-r2a-no-mockImplementation", ["tools/opening-book/book.test.ts"], [e("tools/opening-book/book.test.ts", "    vi.mocked(zobristKey).mockImplementation(() => 0n);\n", "")], "red", "R2 (a)"),
  p("book-r2b-no-finally-reset", ["tools/opening-book/book.test.ts"], [e("tools/opening-book/book.test.ts", "      vi.mocked(zobristKey).mockReset(); // an automock spy: back to the original implementation\n", "")], "red", "R2 (b): a later test reads the real zobristKey?"),
  p("book-r2-compile-routes-around-mock-QE", ["tools/opening-book/book.test.ts"], [e("tools/opening-book/compile.ts", 'import { zobristKey } from "../../src/zobrist.ts";', 'import { zobristKey } from "../../src/zobrist.ts?qe152";')], "red", "QE: compile.ts reaches zobristKey by another URL"),

  // gameend.nfr (R4, NFR-001): zobristKey read twice where the counts map is consulted (SE: read first, everywhere)
  p("ge-zobristKey-twice-on-counts", ["src/gameend.nfr.test.ts"], [e("src/gameend.ts", "positionCounts.get(zobristKey(position))", "positionCounts.get((zobristKey(position), zobristKey(position)))")], "red", "exactly ONCE"),
  // zobrist.nfr (R4, NFR-005): hasLegalEnPassant asked only when an ep square is set (ADR-0005's superseded rule)
  p("zb-ep-branch-asks-legal", ["src/zobrist.nfr.test.ts"], [
    e("src/zobrist.ts", 'import type { UndoRecord } from "./apply.ts";', 'import type { UndoRecord } from "./apply.ts";\nimport { hasLegalEnPassant } from "./legal.ts";'),
    e("src/zobrist.ts", "    if ((position.castling & (CASTLE_FLAGS[i] as number)) !== 0) key ^= CASTLE_KEYS[i] as bigint;\n  }\n\n  if (position.epSquare !== NO_SQUARE) key ^=", "    if ((position.castling & (CASTLE_FLAGS[i] as number)) !== 0) key ^= CASTLE_KEYS[i] as bigint;\n  }\n\n  if (position.epSquare !== NO_SQUARE && hasLegalEnPassant(position)) key ^="),
  ], "red", "expected 0 on ep inputs"),
  // san.nfr (R4, ABC-025 N1): the mate test generates twice on a checking move
  p("sn-mate-test-twice", ["src/san.nfr.test.ts"], [e("src/san.ts", "  const mate = check && legalMoves(position).length === 0;", "  const mate = check && (legalMoves(position), legalMoves(position)).length === 0;")], "red", "checking move: 1 -> 2"),

  // turn-loop.nfr (R4): keyHistory once before the first frame (expects 0)
  p("tl-keyHistory-before-first-frame", ["src/turn-loop.nfr.test.ts", "src/turn-loop.test.ts"], [e("src/turn-loop.ts", "  let status = gameStatusOf(history);\n", "  keyHistory(history);\n  let status = gameStatusOf(history);\n")], "red", "keyHistory expected 0"),
  // turn-loop (R4): a second frame session opened (beginFrameSession expects 1)
  p("tl-second-frame-session", ["src/turn-loop.test.ts"], [e("src/turn-loop.ts", "    writer ??= beginFrameSession(sink, frame.length);\n", "    if (writer === undefined) beginFrameSession(sink, frame.length);\n    writer ??= beginFrameSession(sink, frame.length);\n")], "red", "beginFrameSession expected 1"),
  // history-pane.nfr (R4): parseFen twice per render (<= 1)
  p("hp-parseFen-twice", ["src/history-pane.nfr.test.ts"], [e("src/history-pane.ts", "  const position = parseFen(history.initialFen);\n", "  const position = (parseFen(history.initialFen), parseFen(history.initialFen));\n")], "red", "parseFen <= 1"),
  // status-panel.nfr (R5 + R4): the last-move line's toSan twice (expects 1); keyHistory called (expects 0)
  p("sp-toSan-twice", ["src/status-panel.nfr.test.ts"], [e("src/status-panel.ts", "  return `last: ${toSan(position, moves[moves.length - 1] as Move)}`;", "  return `last: ${(toSan(position, moves[moves.length - 1] as Move), toSan(position, moves[moves.length - 1] as Move))}`;")], "red", "toSan 1 -> 2"),
  p("sp-keyHistory-called", ["src/status-panel.nfr.test.ts"], [
    e("src/status-panel.ts", 'import type { GameHistory } from "./history.ts";', 'import { type GameHistory, keyHistory } from "./history.ts";'),
    e("src/status-panel.ts", "  return `last: ${toSan(position, moves[moves.length - 1] as Move)}`;", "  keyHistory(history);\n  return `last: ${toSan(position, moves[moves.length - 1] as Move)}`;"),
  ], "red", "keyHistory expected 0"),
  // glyph-mode.nfr (R4, NFR-007): one plant per spied module, in the SESSION (SE planted the rule)
  p("gm-fs-readFileSync", ["src/glyph-mode.nfr.test.ts"], [
    e("src/glyph-mode.ts", 'import type { GlyphMode } from "./render.ts";', 'import { readFileSync } from "node:fs";\nimport type { GlyphMode } from "./render.ts";'),
    e("src/glyph-mode.ts", "  return () => mode;\n", "  readFileSync(\"/dev/null\");\n  return () => mode;\n"),
  ], "red", "node:fs"),
  p("gm-fsp-readdir", ["src/glyph-mode.nfr.test.ts"], [
    e("src/glyph-mode.ts", 'import type { GlyphMode } from "./render.ts";', 'import { readdir } from "node:fs/promises";\nimport type { GlyphMode } from "./render.ts";'),
    e("src/glyph-mode.ts", "  return () => mode;\n", "  readdir(\"/\").catch(() => undefined);\n  return () => mode;\n"),
  ], "red", "node:fs/promises"),
  p("gm-cp-execFileSync", ["src/glyph-mode.nfr.test.ts"], [
    e("src/glyph-mode.ts", 'import type { GlyphMode } from "./render.ts";', 'import { execFileSync } from "node:child_process";\nimport type { GlyphMode } from "./render.ts";'),
    e("src/glyph-mode.ts", "  return () => mode;\n", "  execFileSync(\"/usr/bin/true\");\n  return () => mode;\n"),
  ], "red", "node:child_process"),

  // src/book.test.ts A2 (ruling 3): QE's load-time salt, a per-evaluation ordinal (deterministic, not Math.random)
  p("a2-ordinal-salt-head", ["src/book.test.ts"], [
    e("src/book.ts", "const KEY = /^[0-9a-f]{16}$/;\n", "const QE_LOADS = globalThis as unknown as { qe152Loads?: number };\nconst QE_ORDINAL = (QE_LOADS.qe152Loads = (QE_LOADS.qe152Loads ?? 0) + 1);\nconst KEY = /^[0-9a-f]{16}$/;\n"),
    e("src/book.ts", "      const moves = bookMoves(position);\n      const total", "      const unrotated = bookMoves(position);\n      const turn = QE_ORDINAL % Math.max(unrotated.length, 1);\n      const moves = [...unrotated.slice(turn), ...unrotated.slice(0, turn)];\n      const total"),
  ], "red", "two evaluations of book.ts differ"),

  // levels (C4): the blunder path skips the engine for its first child (one call removed)
  p("lv-blunder-first-child-skips-engine", ["src/levels.test.ts"], [e("src/levels.ts", "      const child = chooseMove(position, { budgetMs: deadline - now(), now });\n", "      const child = i === 0 ? null : chooseMove(position, { budgetMs: deadline - now(), now });\n")], "red", "one call per root move"),
  // search.ordering (C4): the root's make/unmake reach apply.ts by another URL (the mock loses one pair)
  p("so-root-make-routes-around-mock", ["src/search.ordering.test.ts"], [
    e("src/search.ts", 'import { makeMove, unmakeMove } from "./apply.ts";', 'import { makeMove, unmakeMove } from "./apply.ts";\nimport { makeMove as qeMake, unmakeMove as qeUnmake } from "./apply.ts?qe152";'),
    e("src/search.ts", "    const undo = makeMove(position, move);\n    keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);\n", "    const undo = qeMake(position, move);\n    keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);\n"),
    e("src/search.ts", "      keys,\n    );\n    unmakeMove(position, move, undo);\n    index++;\n\n    if (score > best) {\n      best = score;\n      bestMove = move;\n    }\n    if (prune && best > alpha", "      keys,\n    );\n    qeUnmake(position, move, undo);\n    index++;\n\n    if (score > best) {\n      best = score;\n      bestMove = move;\n    }\n    if (prune && best > alpha"),
  ], "red", "ply instrument off by one"),
  p("so-killer-recorded-one-ply-deep-QE", ["src/search.ordering.test.ts"], [e("src/search.ts", "      killers.record(ply, move);\n", "      killers.record(ply + 1, move);\n")], "red", "argument plant (extra): mis-ply record"),
  // engine.capacity (C4): the ROOT key write leaves the mocked zobristKeyAfterMove (one call removed)
  p("ec-root-key-not-via-mock", ["src/engine.capacity.test.ts"], [e("src/engine.ts", "      budget.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);\n", "      budget.keys[1] = zobristKey(position);\n")], "red", "writes per iteration 128 -> 127"),
  // search.capacity (C4): the same, in search.ts's root
  p("sc-root-key-not-via-mock", ["src/search.capacity.test.ts"], [e("src/search.ts", "    keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);\n", "    keys[1] = zobristKey(position);\n")], "red", "keyWrites 128 -> 127"),
  // search.pvs-lmr (C4): the engine's node store removed (SE removed search.ts's)
  p("pl-engine-node-store-removed", ["src/search.pvs-lmr.test.ts"], [e("src/engine.ts", "  storeEntry(key, remaining, boundOf(best, alphaIn, beta), best, ply, bestMove);\n", "")], "red", "the engine's stores vanish from the trace"),
  // transposition (C4): the engine's node probe removed (SE removed search.ts's)
  p("tt-engine-node-probe-removed", ["src/transposition.test.ts"], [e("src/engine.ts", "  const slot = probeTable(key);\n", "  const slot = -1;\n")], "red", "engine hit rate"),
];
