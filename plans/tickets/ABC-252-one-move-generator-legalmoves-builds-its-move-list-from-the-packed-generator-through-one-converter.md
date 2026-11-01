---
id: ABC-252
title: "One move generator: legalMoves and the shell's other move calls build their Move lists from the packed path through one converter, and the object generator is removed (ADR-0055 O1-b part 3, the shell adapter; value-identical)"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-010
---

# ABC-252: one move generator, and the shell reaches it through one converter

> **Cut 2026-11-01 by BA/PM** (task `bapm-goal3000-o1-cut`, records only, at `main` `bae25131`; nothing run, built or
> timed). Source: `ADR-0055` option **O1-b**, its third part (§ D6, "the shell adapter"; § D1 O1-b, "tests through an
> adapter"). `EPIC-010` milestone 1b, order 3. Value-identical: S2, **no smoke**. **Exists only if `ABC-250` reads GO
> and `ABC-251` merges in its full form**; otherwise it is dropped (§ Dependencies).

## Problem

- **User:** whoever maintains the engine next (agents and the owner), and every later `EPIC-010` ticket.
- **Pain:** after `ABC-250` and `ABC-251`, the rules core holds **two move paths**: the packed one the search and
  perft use, and the object one (`generateMoves`, `generateCaptures`, `legalMoves`, `legalCaptures`, `makeMove` with
  `UndoRecord`) that about 25 non-test modules (SAN, PGN, history, input, UCI, CLI, levels, book) and most of the 56
  hot-core-importing test files still call (`ADR-0055` § Shell coupling). Two generators can drift; `ADR-0055` names
  that as O2's risk, and it applies here too. A rules fix would have to be made twice.
- **Value:** one generator and one legality filter in `src/`, so a rules change is made once, and the list-equality
  oracle that guards the two paths can retire into an ordinary regression test.

## Scope

1. The object-building generator and filter bodies are removed. The public object functions the shell calls keep
   their **signatures and outputs**, and are produced from the packed path by **one** named converter (packed move →
   `Move`, and its inverse where the shell hands a `Move` back to the core, for example `makeMove` on a user's move).
2. Tests that built `Move` objects for core calls go through one test-side adapter or are rewritten, so no test file
   reaches a removed function.
3. No shell module changes behaviour. Where a shell module imports an internal core function that is removed, it is
   re-pointed to the public object API, not rewritten.

## Out of scope

- Any change to a shell module's behaviour or output (SAN, PGN, UCI, CLI, book, levels).
- Changing `Move`'s public shape or `chooseMove`'s signature.
- The blunder path's cost at levels 1–4 (it calls `legalMoves` per child; read under `G5`, not optimised here).

## Acceptance criteria

- **A1 (one generator).** **Given** `src/` at the tip, **then** exactly one function generates pseudo-legal moves
  and exactly one applies the legality filter (named in the design note), and no exported function builds a `Move`
  except the converter. QE checks it by reading the module exports and call sites; the check is written in the PR.
- **A2 (public lists unchanged).** **Given** every node of the 285 074-position walk (`ENGINE_DEEP=1`) and the six
  perft roots at depth 1 (lane), **then** `legalMoves`, `legalCaptures`, `legalCapturesAndQueenPromotions` and
  `generateMoves` (if still exported) return lists deep-equal to base's, **in order**, at every node; and after
  `makeMove` / `unmakeMove` through the public API the position is identical (by `toFen` and Zobrist key) to base's.
- **A3 (perft and identity).** `src/perft.test.ts` (with `PERFT_DEEP=1`) exact; `G4` (`ABC-078` `A3` corpus and
  `ABC-121`'s 190, fixed depth 5, every door, `chooseMove` at budgets 3 and 5 on `tickingClock(1)`): move, score, depth,
  nodes and clock reads byte-equal to base, out of tree. No golden file is committed.
- **A4 (the shell's behaviour).** The whole default lane green with **no expectation edited** in any shell test file
  (`src/san*.test.ts`, `src/pgn*.test.ts`, `src/uci*.test.ts`, `src/cli*.test.ts`, `src/book*.test.ts`,
  `src/levels*.test.ts`, `src/history*.test.ts`, input tests); only imports and fixtures that built core `Move`s may
  change. `G1` 54/58 with rows equal to base. Snapshots unchanged.
- **A5 (speed guards).** **Given** `kiwipete`, `position-6` and the start position, 5 interleaved runs per board per
  build at 4 000 ms, **then** head's median search nps is **≥ 0.98×** base's on every board. `G5` (`NFR-004`) is read
  at levels 1–5, so the blunder path's converter cost is inside its ceilings.
- **A6 (gates).** `npm run lint`, `typecheck`, `test`, `build` green at every commit. `G4`, `G5`, `G6` "≥ base"
  (floor 6), `G7` growth 0, `G8` ≤ 10 s (`N8-LANE` reported; the retired dual-path oracle may give lane time back),
  `G9`. `G2`/`G3` not owed (`evaluate` untouched).
- **A7 (the grade).** **S2**: A1–A6, **no smoke**.

## What happens on a miss

- **A2, A3 or A4 red:** a defect. Back to the Software Engineer.
- **A5 missed:** a defect in the converter or the public path. Back to the Software Engineer; there is no speed
  "gain" to trade it against, because this ticket buys maintainability, not nps.

## NFR triggers

- **`NFR-004`:** `G5` at levels 1–5 (the blunder path calls `legalMoves` per child). **`NFR-005`:** `G6` "≥ base".
- **`NFR-008`:** the dual-path oracle (`ABC-250` A2) retires to a single-path regression row; lane time reported.
- **`NFR-009`:** `G7` growth 0. **Security:** none; no input path changes (UCI and CLI parse exactly as before).

## Test notes

1. A1 is a reading of the code, recorded in the PR and QE's note, not a test.
2. A2's reference is base's public output; it is read cross-build, out of tree, as the `G4` sweep is.
3. The count of test files touched is reported; `ADR-0055` bounds it by 56.
4. UAT is owed (production lines). The QE verdict signs it.

## Size and priority

- **Size: M.** One converter, deletions, and import churn across the core's test files; no new behaviour.
- **Priority: P3.** It buys maintainability and closes a drift risk, not nps. It still goes before milestone 2's
  ordering and evaluation tickets, so they are written against one generator.

## Dependencies

- **`ABC-250` GO and merged, and `ABC-251` merged in its full form.** If `ABC-250` reads HOLD or NO-GO, this ticket
  is **dropped** (there is one generator already). If `ABC-251`'s full form misses, this ticket waits on BA/PM's
  decision there (narrow it, or revert `ABC-250`'s packed path).
- **Files:** `src/moves.ts`, `src/legal.ts`, `src/apply.ts`, `src/zobrist.ts` (the object form of
  `zobristKeyAfterMove`, if still used by the shell), and test files across the core. **`ABC-254`** edits
  `src/legal.ts`; if it has not gone first, it follows this ticket.
- No ADR (value-identical). Architect/Design names the converter and confirms the one-generator check at design.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ two move paths after `ABC-250`/`ABC-251`; `ADR-0055` D6 |
| 2 | scope and out-of-scope | ✅ one converter; shell behaviour out |
| 3 | INVEST | ✅ M; value is a single generator, testable by A1–A4 |
| 4 | testable, measurable acceptance | ✅ A1–A7 |
| 5 | dependencies known | ✅ `ABC-250` GO, `ABC-251` full form; `ABC-254` |
| 6 | NFR triggers with targets | ✅ nps ≥ 0.98×; `G5` levels 1–5; `G7` growth 0 |
| 7 | test notes | ✅ 4 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ exists only on `ABC-250` GO and `ABC-251`'s full-form merge |

**DoR 9/10. Backlog** until `ABC-251` merges in its full form; then 10/10. Dropped if `ABC-250` is dropped.
