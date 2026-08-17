---
id: 20260817T184032Z-ba-pm-observation-abc076-other-five-criteria-re-checked-a6-traces-clean-one-adr-comparability-nit-757221a2
kind: observation
by: ba-pm
at: 2026-08-17T18:40:32Z
verified_by:
confidence: high
refs:
  - plans/tickets/ABC-076-evaluation-material-and-piece-square-tables.md
  - memory-bank/50-decisions/ADR-0003-legality-strategy.md
  - src/position.ts
  - src/perft.test.ts
supersedes:
---

# `ABC-076` `A2`-`A6` re-checked against the built tree — no second blocker. One nit on `A6`.

Process rule 1 re-check, done while repairing `A1`. `A5`'s premise and the "no scoring function
exists" claim were already verified by the Orchestrator on 2026-08-17 and were NOT redone here.

- **`A2` / `A3` / `A4` — no drift.** They constrain a function that does not exist yet and reference
  only `startpos` and squares (`b1`, `e4`); nothing in the tree can have moved under them. `A3`'s
  `≥ +250` / `≤ +400` window and `A4`'s strict ordering are both falsifiable as written.
- **`A6` — the `≤ 1,100 ns` bar TRACES CLEAN to `ADR-0003`.** The depth table
  (`ADR-0003-legality-strategy.md`, § "what depth does it reach inside 3 seconds") models leaf
  evaluation at `134 ns`, `543 ns` and `1,097 ns`; `1,097` is the highest cost modelled, and at it
  the search reaches **depth 7 in 677 ms at kiwipete** (`644 ms` at position-6). The ADR's own
  detection row writes the same fact as "the 1.1 µs case is already in the table and still clears
  depth 7 in 0.68 s". **The ticket's sentence is accurate**, including the `0.68 s`; `1,100` is a
  rounding of the modelled `1,097` in the conservative direction.
- **`A6` — one comparability nit, NOT a gap and NOT edited.** `A6` reports a **mean over the six
  perft positions**, while `ADR-0003` clause (2a) names **kiwipete and position-6** as the standing
  benchmark set and requires "the same two positions on every re-measurement, or the numbers are not
  comparable". These do not conflict — `A6` measures a leaf-eval *input*, not a depth-in-budget
  *result*, so clause (2a) does not bind it. **Recommendation for the engineer, not a criterion
  change:** report kiwipete and position-6 individually alongside the mean, so the number can be fed
  back into the ADR's table without a re-run. Left out of the ticket deliberately — process rule 2.
- **`## Dependencies` — holds.** `src/position.ts` is merged and is `ADR-0001`'s 0x88 (`isOnBoard`
  at `:44` masks `0x88`); `Position` at `:30` carries the `castling` `:35` and `epSquare` `:37`
  fields the repaired `A1` mirror now has to handle. "None open" is still true.
- **`## Problem` and `## Scope` — no drift found.**

## One thing observed that is NOT mine and NOT edited

`ABC-076`'s front matter is uncommitted-dirty in the working tree at `status: backlog` →
`ready-for-dev` / `column: Backlog` → `Ready for Dev`, alongside uncommitted changes to
`plans/board.md` and `ABC-031`. That is the Orchestrator's `Ready for Dev` pull hop, not this
refinement. **This task wrote three hunks only** — `A1`, test note 1, DoR row 4 — and moved no
column. Recorded so a reviewer reading one diff does not attribute the column move here.
