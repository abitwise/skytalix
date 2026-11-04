---
id: 20261103T225737Z-software-engineer-decision-821f0628
kind: decision
by: software-engineer
at: 2026-11-03T22:57:37Z
verified_by: 
confidence: high (diff read back; the build reproduces the faithful probe build's instrument counts exactly on src tree 4cb84035; evaluation files blob-identical to main)
refs:
  - se-ABC-279
  - grugops/ABC-279
  - ABC-279
  - EPIC-011
  - Q1
  - ADR-0069
  - ADR-0024
  - ADR-0065
  - ADR-0053
  - ADR-0026
  - ADR-0050
  - ADR-0058
  - ADR-0059
  - ADR-0061
  - ADR-0064
  - ABC-239
  - ABC-270
  - ABC-077
  - ABC-078
  - ABC-080
  - ABC-122
  - ABC-170
  - ABC-269
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - G1
  - G2
  - G4
  - G6
  - F9
  - NFR-005
  - NFR-008
  - NFR-009
  - N8-LANE
  - UAT
  - 00e99db8
  - 4cb84035
  - cd9ccd10
  - 1feb7560
  - src/see.ts
  - src/see.test.ts
  - src/quiescence.ts
  - src/search.ts
  - src/engine.ts
  - src/engine.test.ts
  - src/search.test.ts
  - src/search.ordering.test.ts
  - src/search.capacity.test.ts
  - src/evaluate.taper.test.ts
  - src/search.null-move.test.ts
  - src/search.futility.test.ts
  - src/quiescence.test.ts
  - src/transposition.test.ts
  - arch-Q1-see-pruning
supersedes: 
seal: sha256:9989380ea0520d8e5203b1845871b72f668a787229d4ef381b485afed30c382c
---

# se-ABC-279 design: Q1 built as ADR-0069 decisions 1-9 order. Quiescence skips a SEE-losing capture out of check, on the stand-pat branch only. A new pure src/see.ts holds the evaluator (288-byte fixed scratch, three exports). One switch, seePruning, reaches quiesce through QuiescenceRules.seePruning?, is on in search()/chooseMove only, and has two test-only doors. Code commit `cd9ccd10`, tests `1feb7560`, on `grugops/ABC-279`

Software Engineer (level per brief), task `se-ABC-279`, worktree `.claude/worktrees/se-ABC-279`, branch `grugops/ABC-279` from `main` `00e99db8`. The `src/` base tree is `4cb84035`, the probe's own tree, so the instrument counts apply as written.

## What was built
- **`src/see.ts` (new, d4).** It exports `see(position, move)`, `isLosingCapture(position, move)` and `seeScratchByteLength()`, and nothing else (pinned).
  - The algorithm is `ADR-0065` d2's, and it is the probe's `see()` attacker for attacker. The order is: pawns (file −1, then +1), knights, the first diagonal bishop (a diagonal queen is remembered, and the last one wins), the first orthogonal rook (an orthogonal queen only if none is held), then rook, queen, king. X-rays come through a removed-square mask, and the king is last at 20 000.
  - **No per-call allocation.** The scratch is `REMOVED` `Uint8Array(128)`, `GAIN` `Int32Array(32)` and `RESTORE` `Uint8Array(32)`, 288 bytes in all. The probe's `used: number[]`, its `[-1, 1]` literal and its `[...DIAG, ...ORTH]` spread were replaced by fixed module scratch, a constant `KING_OFFSETS` and indexed loops.
  - `isLosingCapture` applies d2: it is false for a non-capture, a promotion or a king mover, false when victim ≥ attacker by `ORDER_VALUE`'s numbers, and otherwise returns `see < 0`. The threshold is fixed at 0, with no margin parameter.
- **`src/quiescence.ts` (d1, d3, d6, d9).**
  - `QuiescenceRules.seePruning?: boolean`. Absent or false means off.
  - `skipLosing` is set to `rules.seePruning === true` only in the stand-pat branch, after `best = standPat`. In the loop, after the one `orderCaptures(moves)` over the whole list, `if (skipLosing && isLosingCapture(position, move)) continue;`. So a skipped move is not made, not visited and not counted. In check nothing is skipped.
  - A capture that gives check is skipped like any other. The cap of 8 and fail-soft are unchanged.
  - The header was corrected: SEE is here for pruning only. Delta pruning and quiet checks stay under "Not here".
- **`src/search.ts` / `src/engine.ts` (d6-d8).**
  - `readonly seePruning: boolean` in `Switches` and in `Heuristics`.
  - A new constant `RULES_SEE_PRUNING = { evasions, quietPromotions, taper, seePruning: true }`. The leaf picks it by `taper ? (seePruning ? RULES_SEE_PRUNING : RULES_TAPERED) : …`.
  - `search()` and `chooseMove` pass `seePruning: true`. The doors `searchWithoutSeePruning(position, depth)` and `chooseMoveWithoutSeePruning(position, options)` are the shipped literal with `seePruning: false` (a source row pins this). All 13 + 7 older doors pass `seePruning: false`.
  - It is not module state, not an `EngineOptions` field and not a `search()` parameter (pinned).
- **Untouched:** `src/evaluate.ts` and `src/evaluate-params.ts` (blob-identical to `main`: `0c8eab0f`, `691044fc`), the transposition table, move ordering (MVV-LVA, killers, hash move) and the main search (no SEE in `negamax`).

## Deviations from the brief's fence list, and why
- The brief fences "src/see.ts, src/search.ts (the quiescence/rules-record seam only), their tests". The ticket's Files line and ADR-0069 d6/d7/d9 also require `src/quiescence.ts` (the rule and the header) and `src/engine.ts` (`Heuristics`, the door). Both were edited, at the seam only.
- Test files outside see/search were edited only where a row pins the changed figure, or where a source ladder lists every door (the migration note lists each one).

## A caller's own record does not opt in (d6)
- `ABC-239`'s filter builds its own literal, so it is unchanged. A1 (c) pins this: `{ evasions, quietPromotions, taper }` searches every capture in sorted order.

## Rollback
- Set `seePruning` to false in `search()` and `chooseMove` (two booleans). Then revert the one ticket.
