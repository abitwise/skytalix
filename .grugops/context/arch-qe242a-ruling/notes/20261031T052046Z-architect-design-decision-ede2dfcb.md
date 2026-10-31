---
id: 20261031T052046Z-architect-design-decision-ede2dfcb
kind: decision
by: architect-design
at: 2026-10-31T05:20:46Z
verified_by: 
confidence: high: a records ruling read from the merged ticket pages, the ADR and QE/SE sealed notes; no run (host shared with an SE)
refs:
  - arch-qe242a-ruling
  - ABC-242
  - ABC-244
  - ABC-177
  - EPIC-010
  - ADR-0046
  - ADR-0052
  - ADR-0032
  - NFR-008
  - NFR-004
  - QE-242-a
  - R1
  - R2
  - R4
  - AR-UCI-BUSY
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-b9f3cd67
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-51079df4
  - se-ABC-242/20261031T043705Z-software-engineer-observation-712a6bb4
  - orch-2026-10-30a/20261030T181200Z-orchestrator-decision-f4673b9f
  - bapm-ABC-242-225-owner/20261030T202446Z-ba-pm-observation-2fe3fa79
  - 1b142ea0
  - d58f2d77
supersedes: 
seal: sha256:8aee3c3b63573dc7b7b70b0be556d9da77b9171c83b4a91046c53124ed738bed
---

# `QE-242-a` ruled: `ABC-244` condition 2 reads a blunder per level call, so `ABC-242`'s step 10 is admitted as built. No ticket and no owner word are owed

The ruling is in `ADR-0046` § Ruling 2026-10-31 at the end of the addendum, commit `1b142ea0`. It cites the inputs' `## Scope`
and `## Risks`: QE's census `…51079df4` and findings `…b9f3cd67`, the SE's census `…712a6bb4`, `ABC-244` § BA/PM ruling,
and `ABC-177` § BA/PM ruling. Records only. Nothing was run or timed, because an SE shares the host.

## Decision
- **For a blunder row, condition 2 counts the level call:** its one budget and its one shared deadline (`ADR-0032` d1).
  Level 1's 100 ms at step 10 is 10 intervals, which is ≥ 2. `ABC-242`'s step 10 is admitted. No merged row changes.
- **The limit.** In two cases the condition reads each child search on the budget it is handed:
  - a row asserts a child search's depth;
  - a row's property under test is computed inside a child search and is not compared with a reference run at the
    same step.
- **R1 for a sliced call.** The census line gives reads per level call and says so. A per-child figure is the budget
  each child was actually handed, as read, never the nominal slice.

## Why
- **Precedent.** In the condition's first use, at `ABC-177` U8, BA/PM counted "level 1's 100 ms budget: 10 intervals
  at step 10". U8 is a row whose first go is a blunder (`src/uci-session.test.ts`, the precondition row asserts both
  paths). `ABC-244` carried the condition over unchanged.
- **R4 agrees.** The addendum planned `ABC-242` at +0.05 to +0.15 s and warned against a form costing seconds. Read per
  child, the condition admits only step 1, about +2.5 s, which would breach `NFR-008` (owner-held) on `G8` H 9.41 s.
- **Purpose.** The check under test runs at the blunder root, before any child, and reads no clock (`src/levels.ts`
  `blunder`, read at `d58f2d77`). Child depth is engine behaviour, outside `ABC-242`'s fence.
- **Evidence.** QE's 20 plants kill the same sets at steps 1 and 10. The SE's M1–M8 are identical at 1, 10, 100 and
  1 000.

## Alternatives rejected
- **Per child search.** It is faithful to the letter, but it admits only step 1. That is +2.5 s, a breach of `G8`,
  and an owner escalation, all for no measured gain in kill power.
- **Plain "per call" with no limit.** It would admit a future blunder row whose assertions depend on child depth at a
  step that collapses the children.
- **A step outside {1, 10, 100, 1 000}, or a non-level-1 budget.** Either would reopen BA/PM's step set and
  `ABC-242`'s R2 budget for one row family.

## Accepted, stated plainly
- At step 10 the children are handed 10, −10, −30, −50 and −70 ms. They search depth 1, and the call takes 210 of its
  100 virtual ms.
- The SE's "2 reads per child" is a nominal slice, not a reading.
- No default-lane `ABC-242` row exercises a level-1 blunder's children past depth 1. No criterion asks for depth.

## Owed
- **Ticket:** none.
- **Owner:** none. No owner-accepted decision changes, and no NFR level, bar, cap, pin, row count or lane line moves.
- **BA/PM:** may cite the ADR section at the `ABC-242` close hop (`bapm-ABC-242-close`). That is not a wait.
