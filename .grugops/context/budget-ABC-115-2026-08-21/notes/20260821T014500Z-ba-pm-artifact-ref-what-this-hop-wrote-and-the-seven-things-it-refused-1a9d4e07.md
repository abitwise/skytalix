---
id: 20260821T014500Z-ba-pm-artifact-ref-what-this-hop-wrote-and-the-seven-things-it-refused-1a9d4e07
kind: artifact-ref
by: ba-pm
at: 2026-08-21T01:45:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - N8-SPAWN
  - plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md
  - plans/board.md
  - plans/traceability.md
  - .grugops/context/budget-ABC-115-2026-08-21/notes/
supersedes:
---

# WHAT THIS HOP WROTE, AND THE SEVEN THINGS IT REFUSED

**Branch `grugops/abc115-spawn-clause`, off `grugops/abc115-piped-session-exits-clean` @ `aac410c` —
NOT `main`. Six branches are now stacked unmerged; merging is the human's.** Worked in a dedicated
`git worktree`; all measurement happened in a scratch copy of the base tree **outside the
repository**.

## Written

| file | change |
|---|---|
| `plans/tickets/ABC-115-…md` | `## Budget ruling — 2026-08-21` added; the superseded `<= 0.5 s CPU` line **flagged in place, not deleted** |
| `plans/board.md` | one `_Updated:_` header; `ABC-115`'s line **appended to**. NO column move |
| `plans/traceability.md` | one `_Updated:_` header; `ABC-115`'s row, `NFRs` and `Status` cells appended to |
| `.grugops/context/budget-ABC-115-2026-08-21/notes/` | six notes, this one included |
| `.grugops/queue/…` | `budget-abc115-spawn-clause` pending -> claimed -> done |

**The old clause is struck through in place rather than edited away**, because the phrase that broke
it (*"~2x in CPU"*) is the evidence of HOW it broke, and a page that quietly deletes its own wrong
sentence teaches nobody.

## The ruling, in one line each

1. **Re-measured the arithmetic myself; the engineer is RIGHT.** Six of the cheapest children that
   exist cost **+0.91 s CPU** against a 0.5 s bar, with their harness absent.
2. **Re-derived honestly:** `<= 0.30 s CPU (user+sys) per added child`, coefficient measured on a tree
   containing none of this ticket's code, **before** the delivered number was consulted. The error —
   a WALL figure applied to a CPU clause — is written out on the page.
3. **No criterion dropped.** The under-ceiling option saves 0.30 s and still misses by 1.8x.
4. **`ABC-115` may proceed to `In Review`**, on the basis that the breach measured a defect in my
   criterion and not in the delivery.
5. **`ABC-108`'s report confirmed landed** (note `refs` + trace row); the missing contributions ledger
   on `ABC-108`'s page is **named, not closed**. `NFR-008` NOT graded.

## Refused — seven, each one a thing I could have done and did not

1. **Did NOT touch `src/`.** `git diff --numstat -- src/` against `aac410c` is **empty**.
2. **Did NOT move `ABC-115`.** It stays `In Development`, 1/3. The `In Review` exit is the
   Orchestrator's and QE's `qe-e2e` hop is owed first.
3. **Did NOT drop, weaken or re-word a criterion** to make a number fit.
4. **Did NOT re-open the exit code**, and did not touch `ADR-0016` or `AGENTS.md` — `ABC-109`'s byte
   cap is undisturbed.
5. **Did NOT grade `NFR-008`**, claim an `N8-LANE` line, or touch `ABC-108` / `ABC-110` / `ABC-111`.
   `plans/nfr-catalog.md` was not opened for writing and no NFR row was seeded.
6. **Did NOT re-score or re-cut.** `S` / `P1` stand; `SPLIT_REQUIRED` not raised.
7. **Did NOT merge, deploy, self-sign, conduct a UAT or claim the zero-production-lines waiver** —
   the diff carries 13 production lines, so that waiver does not apply.

**And one more, worth its own line: I did NOT rule the engineer wrong on the strength of the first
instrument I reached for.** A serial shell loop said 0.48 s for six children on `user` alone — under
the ceiling — and taking that answer would have sent a correct build back to the bench in defence of
a broken sentence of mine. It is recorded as a `failed-attempt` so the next reader does not repeat it.

## Fidelity

All six notes are **hand-authored and UNSTAMPED**. `context.human_admission` is `off`,
`scripts/context-io.ts` and `mcp__grugops__propose_note` are absent from this install, so **no
`finding` is admissible and nothing here is verified** — these are `observation`, `decision`,
`failed-attempt` and `artifact-ref` only. Every number in them was measured at this hop, on this
machine, and the runs are printed rather than summarised so a later hop can disagree with the
evidence rather than with me.
