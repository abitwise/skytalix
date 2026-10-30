---
id: 20261030T044205Z-architect-design-observation-54dd698c
kind: observation
by: architect-design
at: 2026-10-30T04:42:05Z
verified_by: 
confidence: high: code read at main c0698ddd with file:line; nothing run or timed
refs:
  - arch-q3c-oq228ii
  - ADR-0020
  - ADR-0053
  - ADR-0045
  - ADR-0044
  - ADR-0011
  - ADR-0002
  - ADR-0038
  - OQ-228-1
  - EPIC-010
  - EPIC-008
  - ABC-228
  - ABC-230
  - G6
  - G9
  - orch-2026-10-29g/20261030T044400Z-orchestrator-decision-c4ab73de
supersedes: 
seal: sha256:e46d82c3543d5e44cd5f859e00083234b9759c4351dc5cdbecd9fd1855dc8629
---

## Scope

These are code-read facts at `main` `c0698ddd`, before `ABC-230`. Both rulings in the sibling decision note rest on them. Nothing was run or timed.

## Observations

**Q3 (c), the surfaces:**
- `src/history.ts:116` `keyHistory` returns raw `zobristKey` per replayed position. Its callers on `main` are `repetitionCounts` (`:136`) and `src/turn-loop.ts:256` `claimShortfall`, which counts the occurrences of the current key for the "repetition n of 3" line. **That is a third counting site, besides `repetitionCounts` and the prior keys.** No `book*.ts` calls `keyHistory`: `book.ts` imports `zobrist.ts` directly.
- `src/gameend.ts:155` looks up `positionCounts.get(zobristKey(position))` for the live position. `gameend.ts` imports `legal.ts` (`:22`) and `zobrist.ts` (`:35`). `src/engine.ts:84` imports `gameend.ts` (`leafEndReason`).
- `src/zobrist.ts:63` `EP_FILE` is module-private. `zobristKey` XORs it at `:85` when `epSquare` is set.
- `src/legal.ts:182` exports `hasLegalEnPassant`. It has no production caller since `ADR-0020`.
- `src/uci-session.ts:22-30` imports `apply`, `book` (type only), `coordinate-move`, `engine`, `fen`, `levels`, `position`, `search` and `transposition`. It imports no `legal.ts`, `zobrist.ts` or `gameend.ts`. `src/uci-session.test.ts:1282` `A11-g1` is a deny list (`history`, `turn-loop`, `book-engine`, `level-seam`, `book-file`, `line-input`), not an allow list.
- `src/history-pane.nfr.test.ts:274` holds `LICENSED_DRIVERS = ["turn-loop.ts", "cli.ts"]`, with the equality at `:390`.

**OQ-228-1 (ii), the surfaces:**
- `src/levels.ts` `LEVELS[5]` = `{ budgetMs: 3_000, blunderRate: 0 }` and `LEVELS[6]` = 5 000. The header comment says each level's ceiling is held "at least 2 s under it".
- `src/engine.ts:132` `DEFAULT_BUDGET_MS = 3_000`. The pins:
  - the `3_000` literals in `src/levels.test.ts` at `:250`, `:313`, `:346` and `:373`;
  - the rows that read the constant: `src/levels.test.ts:264`, `src/engine.test.ts:914` and `src/cli.test.ts:4505`;
  - the real-clock users of the constant: `src/search.pvs-lmr.test.ts:738` and `src/transposition.test.ts:674`.
- `tools/rating/rating.ts:405` passes skytalix a literal `3000` in R mode as `st=3`, with `timemargin = CEILING_MS − ms`, where `CEILING_MS` is 5 000 (`:62`). D uses `--budget-ms` (frozen at 1 500 by `EPIC-010`).
- `ADR-0038` decision 6: a ladder verdict is STALE after any merge that touches `src/levels.ts`.
- `EPIC-008` `G6` reads `chooseMove` at 3 000 ms on the real clock. `G9` requires `LEVELS[1..5]` and `DEFAULT_LEVEL` to be byte-identical to base.
