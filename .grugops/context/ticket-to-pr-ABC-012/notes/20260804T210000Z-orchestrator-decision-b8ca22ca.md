---
id: 20260804T210000Z-orchestrator-decision-b8ca22ca
kind: decision
by: orchestrator
at: 2026-08-04T21:00:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-012
  - ABC-012
  - ABC-019
  - EPIC-002
  - EPIC-006
  - src/history.ts
  - src/history.test.ts
  - plans/board.md
supersedes: 
---

# ABC-012 is through all three gates and STOPS at `Ready for UAT` — the next move is a human's

## The chain, and that each stage was checked rather than accepted

`In Development → In Review → In Security/NFR → Ready for UAT`, three roles, three PASS verdicts,
each publishing five notes. **The coordinator re-ran the full gate independently after every stage
rather than reading the role's report** — 221/221 after the Engineer, 226/226 after QE, 226/226
after Security/NFR, skip count 0 every time (captured with the `AGENTS.md` command), lint +
typecheck + build exit 0 every time. `git diff --numstat 39e260d -- src/` was checked at each hop:
the Engineer added two files, **QE changed no production code** (test file only, confirmed by md5 at
the Security/NFR gate as well), Security/NFR changed none.

Final production delta against merged `main`: **`src/history.ts`, 154 lines / 51 executable, zero
new dependencies, `package.json` and lockfile byte-identical.**

**The two later gates each found something the earlier one had not, and both times it was the SUITE
rather than the module.** QE killed 21 mutants and **three survived all 221 delivered tests** — all
three `resetTo` silently not copying a field (`castling`, `blackToMove`, `epSquare`), all three
hidden by the same root cause: every acceptance test anchored at the start position and took back
only at **even** ply counts. `src/history.ts` was correct on all three. That is the third time on
this project a review has landed there, which is a pattern worth naming rather than a coincidence.

## Why it stops here

`autonomy=pr`. **Nothing was merged from this branch and nothing was deployed — a human holds
both.** The one merge performed today was BA/PM's `grugops/refinement-2026-08-04` → `main`, on
explicit human instruction, and **that instruction is spent: it is not standing authorization** and
does not reach this branch. This repo has no git remote, so there is no PR and none was invented.

**UAT is recorded as DEFERRED to `EPIC-006`, not passed** — the standing practice on this project,
and it is honest here for the same reason as every time before: there is no runnable game, so there
is no surface a human can exercise. `Ready for UAT` holds it; `In UAT` stays 0/4.

## What came OUT of this ticket that nobody owns yet

Six items were named by the three gates and **not one was absorbed into this ticket** — correctly,
since none is in its scope. They are listed here in one place because they are currently spread
across eleven notes and three board comments, and an unowned item is how `ABC-009`, `ABC-010` and
`ABC-022` each got caught late.

1. **`ABC-012`'s acceptance criterion 2 is unsatisfiable as worded** — `gameStatusOf` cannot return
   `reason: "threefold-repetition"` because `ABC-020` ruled that a third occurrence is *claimable*,
   so the type is `ClaimableDraw` and not `EndReason`. QE verified this **with the compiler**
   (TS2820, with a null control that compiles clean), not by reading. The criterion's INTENT is
   tested and green. QE also found it is re-wordable in **either** direction, which nobody had:
   `gameStatusOf` genuinely can return `result: "draw"` for repetition at **fivefold** (FIDE 9.6.1).
   → **BA/PM.** The ticket prose is deliberately unamended; no agent edited it.
2. **`takeBack(history, NaN)` silently discards the entire game.** QE found it; Security/NFR
   extended it past QE's table to `undefined`, the raw string `"abc"` and `{}`. Ruled **MEDIUM, does
   not block** — and the reasoning is the part to carry: it is not an ASVS V2.2.1 L1 failure *today*
   because the input surface does not exist (zero production importers), so it is **not yet
   engaged** rather than passed. **The counterfactual is on the record: the moment `ABC-019` wires
   user input to it, V2.2.1 engages, severity is HIGH, and it blocks.** → **BA/PM / `ABC-019`.**
3. **`playMove` validates nothing**, by SEAM 1's priced decision — and a foreign move yields a
   *confident wrong verdict*, not an error. → **Architect/Design (SEAM 1) / `ABC-019`.**
4. **`src/fen.ts` accepts out-of-range counters** (`999999999999999999999` → `1e+21`, breaking FEN
   round-trip and reporting a 75-move draw before the game starts) — LOW. → **BA/PM / `EPIC-001`.**
5. **`coverage/` is tracked, unignored and stale**, and running coverage rewrites tracked files.
   **Three roles have now flagged this and NO TICKET EXISTS.** Security/NFR verified the mitigation
   (`--coverage.reportsDirectory` outside the repo leaves it byte-identical). → **BA/PM to cut a
   ticket; the `.gitignore` decision is a human's.**
6. **`tools/grugops/test-skip-integrity.js` returns exit 2** ("cannot read the registry file").
   Recorded by two roles as an **error, never as a pass**; no role created the registry, which is
   human-owned. The skip count is 0 by the `AGENTS.md` command, so nothing needs justifying — but a
   checker that cannot run is not a checker that passed.

**None of these is being routed by this note.** Routing them means enqueuing work, and the next pull
is a decision that comes after the human decides what happens to this branch. They are recorded so
that decision is made with them visible rather than rediscovered.

## Substrate

Still no `scripts/claim.js` and no `scripts/context-io.ts`. All four queue subtasks moved
`pending/` → `claimed/` → `done/` by hand with registry records; all sixteen notes hand-written in
the schema's shape. **No `finding` was written by any role and nothing was self-stamped** — correct,
since no §14 gate exists here to issue a stamp. Every result that could not be gate-verified is a
`claim` or an `observation`.

## Next action

**A human decides whether `grugops/ticket-to-pr-ABC-012` merges to `main`.** The branch is eight
commits, gates green on its tip, and `main` is unchanged since `39e260d`. If it merges, `ABC-019`
(the turn loop) unblocks on `ABC-012` and BA/PM's pull order puts `ABC-014` next.
