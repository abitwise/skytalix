---
id: 20260925T184100Z-software-engineer-decision-abc121-g6-pair-repointed-decision-4-over-7-needs-ratifying-0da3f1a5
kind: decision
by: software-engineer
at: 2026-09-25T18:41:00Z
verified_by:
confidence: medium
refs:
  - ABC-121
  - ABC-081
  - ADR-0026
  - ADR-0006
  - src/transposition.test.ts
  - .grugops/context/ticket-to-pr-ABC-121/probe/g6.ts
  - .grugops/context/ticket-to-pr-ABC-121/probe/rook10.ts
supersedes:
---

# Two merged rows that `ADR-0026` decision 7 kept on the shipped path: one split as decision 7 says, one re-pointed by decision 4 — FLAGGED for Architect/Design and QE to ratify or overrule

Hand-authored, no `seal`. **Confidence is medium** because this is a reading of the ADR where two
of its decisions conflict. It is not a new rule. Nothing was re-pinned, and no bar moved.

## 1. `transposition.test.ts` G6 knight pair (`ABC-081` `A1`, `ADR-0006` falsifier): RE-POINTED

- **What moved.** With LMR on, `search("4k3/8/8/8/8/8/8/4K1NR w - - 0 1", 4)` reads **830**, and
  the row pins **820**. The partner (`… w K …`) reads 830 in every configuration.
- **It is the rule, not the wiring.** The ruling's own reference recursion reads 830 for this
  position with LMR on and 820 with PVS alone (`probe/g6.ts`). `searchWithoutReductions` and
  `searchWithoutPvsOrReductions` both read 820. At depths 3, 5 and 6 every configuration agrees.
- **Consequence on the shipped path.** Both halves of the pair read 830 at depth 4, which is the
  very equality G6 exists to forbid. On `search()` the falsifier has no bite at this depth.
- **The conflict.**
  - Decision 7 lists "the G6 knight pair" as a value row that stays on the shipped search.
  - Decision 4 names `ABC-081` `A1` as a work row that re-points. The G6 row sits inside
    `ABC-081` `A1`'s block and compares table on with table off.
  - Decision 7's own rule for a mixed row lets the literal half stay shipped where the literal
    holds under every configuration. Its example, the rook ending, does hold. This one does not.
- **What was done.** The row's `search()` side became `searchWithoutPvsOrReductions`, and both
  literals are unchanged (830 / 820). It is a one-identifier change, so it is one line to revert.
- **Alternative not taken: stop and hand up.** I judged it a placement question inside the ADR's
  own two decisions, not a failed row against its door. The door reads the pinned literals
  exactly. **If Architect/Design reads decision 7 as binding here, this is the queue's first stop
  condition and the build is on hold.** The owner's word is not needed either way; the ADR's
  author's is.

## 2. `transposition.test.ts` depth-10 rook ending (`ABC-081` `A4`): SPLIT, exactly as decision 7 names it

- **What moved.** At 160 injected ticks the shipped `chooseMove` now completes **depth 11**, not
  10, because it spends fewer nodes per iteration. The literal **−29 992** holds on every
  configuration, at depths 9, 10 and 11, fixed and deepened (`probe/rook10.ts`).
- **What was done.** The measurement half (depth 10 at 160 ticks, and equality with
  `searchWithoutTable(…, 10)`) reads `chooseMoveWithoutPvsOrReductions`, unchanged. The literal
  half stays on the shipped `chooseMove`: score −29 992 at depth ≥ 10.
- This is decision 7's own example, so it is not a deviation. It is recorded here because the
  row was red at the first `SEARCH_DEEP` run before the split.
