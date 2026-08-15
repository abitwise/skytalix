---
id: 20260816T103000Z-ba-pm-observation-what-i-measured-myself-before-sizing-anything-1160e15e
kind: observation
by: ba-pm
at: 2026-08-16T10:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-057
  - ABC-058
  - ABC-059
  - ABC-060
  - B2
  - Q12
  - S6
  - src/cli.test.ts
  - src/history-pane.nfr.test.ts
  - plans/traceability.md
supersedes: 
---

# What I measured myself this hop, rather than inheriting — with the numbers

Every size and every criterion below rests on one of these. Read on `main` and on the four evidence
branches via `git show <branch>:<path>` — **no branch was merged, and none was checked out.**

| # | measurement | result |
|---|---|---|
| 1 | `ABC-042`'s page length, both trees | **328 lines** on `main` and on `grugops/security-nfr-ABC-042-recheck2` — identical. **28 over rule 2's 300 (`B2`)** |
| 2 | does `src/cli.test.ts` exist on `main`? | **No.** `git show main:src/cli.test.ts` fails. It is delivered by `ABC-042`, so `ABC-058` and `ABC-059` are blocked on that merge — stated in both tickets rather than assumed |
| 3 | does `src/history-pane.nfr.test.ts` exist on `main`? | **Yes**, 614 lines; 620 on the merging tree |
| 4 | the four line citations in that file, **on both trees** | merging tree: docblock `:196-200`, `LICENSED_DRIVERS` `:219`, comparator `:335`, tripwire block `:435-443`. **`main` today: `:196-200`, `:213`, `:329`, `:429-437`** — the licence edit shifts three of them by six. Recorded in `ABC-057`'s test notes so the builder does not trust either set blind |
| 5 | the struck sentence's exact span | the clause-3 docblock opens at `:196`; **the struck sentence occupies `:199-200`.** Architect cited the block as `:196-199`; QE verified that citation. Both are right about the block — I cite `:196-200` because the sentence's last line is `:200` |
| 6 | `A12`'s clause copied into siblings | **four live sites, none naming a diff**: `ABC-043` `A8` (`:132`), `ABC-044` `A7` (`:131`), `ABC-045` `A6` (`:87`), `ABC-046` `A8` (`:123`). This is what makes `ABC-060` a repair with sites rather than a lesson |
| 7 | does any sibling copy `A8`'s "ends with exactly one `\n`"? | **No.** The only newline clause in the four is `ABC-043`'s stdin one, which is unrelated. **This is why `Q8` was not cut** |
| 8 | `Dev / run` occurrences in `AGENTS.md` | **2 on both trees.** On `main` (pre-repair) **1 of 2 disagrees** with the delivered command; on `grugops/agents-md-ABC-042-dev-run` **2 of 2 agree**. These are `ABC-059` `A1`'s numbers |
| 9 | `UNKNOWN - verify` occurrences in `AGENTS.md` | **8** on the repaired tree (agreeing with the Scribe), **10** on `main`. `ABC-059` `A3` uses the 8 to fence a guard that must not bar the phrase |
| 10 | the `A1` guard's site and reach | `src/cli.test.ts:193-204`; it is the **only** automated reader of `AGENTS.md` in the tree, and its negative assertion is a literal substring test for the list-item spelling |
| 11 | the three `ABC-058` sites, read in the delivered file | probe token `:158`, bar-3 row `:750-775`, spawn pin `:775-793` with `sourceOf` at `:787`; `executableCodeOf` defined at `:45-48` and already called at **seven** sites |
| 12 | highest existing ticket id | **`ABC-056`**, scanned across `plans/tickets/`, `plans/traceability.md` and **all refs** (`git rev-list --all --objects`). New ids `ABC-057`–`ABC-060` collide with nothing on any branch |

## One thing found while writing the trace rows, flagged and NOT fixed

**Four rows in `plans/traceability.md` are already malformed** and were before this hop — verified by
re-splitting `git show main:plans/traceability.md`, so they are not mine:

| line (this branch) | fields | row |
|---|---|---|
| 204 | **14** (expected 12) | `ABC-009` |
| 206 | **13** | `ABC-011` |
| 212 | **13** | `ABC-015` |
| 216 | **13** | `ABC-019` |

A 12-field split is a 10-column row; 13 and 14 mean **one and two raw `|` characters inside cells**.
**Flagged, not deleted and not repaired** (coding rule 12, and the subtask's "touch no existing
row"). `ABC-052` already exists for trace-row currency and `ABC-040` for duplicate rows; whether this
belongs to one of them or to a fifth ticket is the Orchestrator's sequencing call, not something I
will pre-empt by cutting over it. **My four appended rows were re-split from disk after the write and
are 12 fields each.**
