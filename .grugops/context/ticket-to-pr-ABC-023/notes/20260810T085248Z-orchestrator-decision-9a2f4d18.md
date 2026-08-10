---
id: 20260810T085248Z-orchestrator-decision-9a2f4d18
kind: decision
by: orchestrator
at: 2026-08-10T08:52:48Z
verified_by: 
confidence: high
refs:
  - ABC-023
  - ABC-024
  - EPIC-001
  - EPIC-006
  - RISK-ABC023-01
  - src/moves.ts
  - src/moves.castling.hardening.test.ts
  - plans/board.md
supersedes: 
---

# `ABC-023` CLOSED — merged by fast-forward, gated on both sides. **UAT DEFERRED → `EPIC-006`, explicitly NOT passed.**

## UAT — deferred, and the word "deferred" is doing real work

**`ABC-023` is NOT UAT-passed and this note must not be read as saying it is.** It is deferred to
`EPIC-006`, on the same ground every ticket on this board since `ABC-004` has been deferred: **there
is no CLI entry point, so no human can exercise anything.** `AGENTS.md` records `Dev / run` as
`UNKNOWN - verify` for exactly this reason.

This ticket is the clearest case yet. It delivers **zero production lines** and its entire diff is a
test file, which has **no runtime importer by construction**. There is nothing a business reviewer
could sit in front of. **A UAT pass here would be a fabrication**, and the honest record is an
explicit deferral with the trigger named.

## The merge, and the authority behind it

The owner's standing merge directive (2026-08-06, `memory-bank/60-progress.md`) plus this session's
explicit instruction to merge and delete the branch. **It is approval to merge work that PASSED, and
that is what was merged** — `quality.gate_enforcement` is `blocking` and no gate was skipped or
softened. Deploy is **not** included and **nothing was deployed**; a human holds deploy.

Checked **BEFORE** the merge, not asserted:

```
git rev-list --count HEAD..main       0        (fast-forward possible)
git log --merges main..HEAD           empty    (no merge commit on the branch)
```

**Merged `b2d3554` → `f739a30` by fast-forward, 13 commits, NO merge commit** (`git log --merges`
empty afterwards).

## Gates run on the branch tip AND again on `main` — both recorded, neither inherited

| | branch tip `f739a30` | `main` `f739a30` |
|---|---|---|
| `npm run lint` | exit 0 | exit 0 |
| `npm run typecheck` | exit 0 | exit 0 |
| `npm run build` | exit 0 | exit 0 |
| `npm test` | **625 / 625 on 18 files** | **625 / 625 on 18 files** |
| skip count | **0** | **0** |
| `PERFT_DEEP=1` | **32 / 32 exact** (36.24 s) | **32 / 32 exact** (37.97 s) |
| `md5 src/moves.ts` | `6335b452fc21ffe2d0f902ecab930840` | `6335b452fc21ffe2d0f902ecab930840` |

## The record that makes the verdicts worth something

**`src/moves.ts` is byte-identical to its pre-ticket state on `main` through all five hops** — BA/PM,
the engineer, QE, Security/NFR and this close. **No gate repaired the module to make its own verdict
green.** The whole delivered diff is `src/moves.castling.hardening.test.ts`, **+749 / −0**, additions
only, no other file under `src/` touched and no existing test row modified or deleted.

`A4` — the criterion that says exactly this — was **live and satisfiable at every hop**, which it was
not when the ticket arrived: it pinned a hash that `ABC-022` had already invalidated, and as written
it could not have been met by any correct implementation.

## What each hop actually found, since none of it was a formality

- **BA/PM (promotion)** — six acceptance defects, **three named by no pre-check**, two of them
  unsatisfiable by construction. All 16 inherited mutant verdicts re-measured against the 559-test
  suite they had never been scored against; 34 mutants, 0 mismatches.
- **Engineer** — 17 rows / 19 tests, the exact estimate. Every row run **red on its own mutant**,
  which for a test-only ticket is what red-before-green means. It reported one row as already dead
  pre-rows rather than claiming nine of nine.
- **QE** — **67 mutants over three tree states**, and **14 builds that passed every criterion, the
  whole 578-test suite AND deep perft 32/32**. Closed with **44 added rows and NO criterion amended**.
  All fifteen behaviour-equivalent controls still survive under its own independent harness, killed
  count **zero** — which is what actually asserts `A5`, since until that hop `A5` was asserted only by
  the instrument of the role that wrote the rows.
- **Security/NFR** — `PASS_WITH_RISKS`, no required fix, nothing high or medium. It **accepted the NFR
  no-fire ruling but re-derived its load-bearing premise**, checking all seven catalog rows for a
  suite-runtime bar that would have broken the byte-identity argument. There is none. One accepted
  risk, `RISK-ABC023-01` (LOW, owner **QE/E2E**), with a named trigger.

## Two things carried forward rather than closed

1. **`ABC-024` was cut** for the leftovers, and BA/PM found **seven** default-lane blind spots where
   QE had measured two. It sits in `Backlog` with its **Definition of Ready NOT met — 8 of 10 clean,
   2 recorded ⚠️** — deliberately not promoted. A ticket that fails the DoR belongs in `Backlog`, not
   in "almost ready".
2. **`RISK-ABC023-01`** stays accepted and owned, with the trigger written down.

## The honest limit on all of it

Every hop stated the same one about itself and it is worth stating once at the close: **a risk class
nobody thought to look for does not appear in any of this.** Five roles measured what they knew to
measure. That is the ceiling of the method, not a gap in the execution.

## Board

`ABC-023` `Ready for UAT → Done`. Ready for UAT 1/4 → 0/4. `EPIC-001` gains one more merged hardening
ticket. **Nothing deployed.**
