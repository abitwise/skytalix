---
id: 20260813T124000Z-ba-pm-artifact-ref-the-two-short-board-rows-and-everything-this-hop-wrote-6d5c0b19
kind: artifact-ref
by: ba-pm
at: 2026-08-13T12:40:00Z
verified_by:
confidence: high
refs:
  - ABC-039
  - ABC-040
  - plans/tickets/ABC-039-backward-move-ordinal-register.md
  - plans/tickets/ABC-040-traceability-duplicate-row-reconciliation.md
  - plans/traceability.md
  - plans/board.md
supersedes:
---

# The two board rows I want — SHORT, verbatim — and the complete inventory of what this hop wrote

> **Hand-authored, no stamp.** No `context-io.ts`, no `mcp__grugops__propose_note`,
> `human_admission` `off`, no `§14-gate` verdict under this task — **no `finding` on this hop**.
>
> **`plans/board.md` was NOT opened for edit.** It is the Orchestrator's. Everything below is a
> request, and both are `Backlog` placements — **neither is a `Backlog → Ready` move**, so this hop
> exercises none of BA/PM's board exit.

## A. `## Backlog` — TWO rows APPENDED, verbatim

**Written SHORT on purpose** — one line each, detail on the ticket page, per the board's own rule
and yesterday's ruling that trimmed the last hop's long rows. **If these still read long, trim them;
nothing in them is load-bearing except the id, size, priority and the DoR score.**

```
- [ABC-039] Backward-move ordinals are uncitable — a false FIRST live on this board, and a double-booked SECOND  (BA/PM, S, P2, epic: —, since: 2026-08-13, DoR 9/10 ⚠️x1 — the register is citable but not reachable; the one LIVE instance is this board's own ABC-009 row, the other seven are archived headers of Done tickets and may not be edited)
- [ABC-040] Duplicate ABC-028/ABC-029 rows in traceability — 40 rows for 38 tickets  (BA/PM, S, P2, epic: —, since: 2026-08-13, **DoR 10/10**; the ABC-028 pair is a LOSSLESS DELETE and the ABC-029 pair a 2404-byte MERGE — precedence ruled R1–R5 on the page; the Orchestrator still sequences it against trace-appending hops)
```

**Both requested to `Backlog`, not `Ready`, and `ABC-040`'s DoR being 10/10 is not a reason to
promote it.** `Ready` stands at 2/8 with both lanes already pulled from it; stocking it with records
debt makes a thin column look full. `ABC-030`'s reasoning, adopted unchanged.

## B. One row on this board that `ABC-039` exists to correct — the Orchestrator's edit, not mine

`plans/board.md:185`, the `ABC-009` row in the **`Done`** column, contains:

```
**FIRST BACKWARD BOARD MOVE IN THIS PROJECT'S HISTORY** — Ready for UAT -> In Review on 2026-08-09
```

**It is false** (`ABC-011` moved backward 2026-08-03) **and it is the only live instance of the
defect.** I did not touch it — the board is the Orchestrator's and `ABC-039` is the ticket that
carries the edit. **Flagged here so it is not lost if the ticket sits.**

## C. Complete inventory — 8 files, ZERO under `src/`

```
NEW tickets (2)   plans/tickets/ABC-039-backward-move-ordinal-register.md
                  plans/tickets/ABC-040-traceability-duplicate-row-reconciliation.md
TRACE (1)         plans/traceability.md  (+2 rows, +2/-0 lines; 40 -> 42 rows, 38 -> 40 distinct ids;
                                          both rows 10 cells under the escape-aware split, both end
                                          with `|`; NO existing row touched, NO row deleted)
NOTES (5)         .grugops/context/refinement-cut-039-040/notes/   (this file is the fifth)
QUEUE             .grugops/queue/claimed/refinement-cut-039-040/   (claim.md + the subtask file), then -> done/
```

**Verified by `git status --porcelain` and `git diff --numstat` at the end of the hop, not
asserted:** one modified tracked file (`plans/traceability.md`, `+2/-0`) and the untracked new
files above. **`git diff --numstat -- src/` is EMPTY.**

## D. What was NOT touched — the boundary list, re-checked at the end

**`plans/board.md`** (the Orchestrator's — not opened for edit), **`plans/metrics.md`** (read only;
**measured already correct** and that is why `ABC-039` excludes it), **`plans/nfr-catalog.md`**, every
**ADR**, every **`Done` ticket page** including `ABC-028` and `ABC-029`, every file under
**`plans/tickets/history/`** (read only — the eight ordinal statements were quoted, none edited), the
two live lanes' tickets **`ABC-021`** and **`ABC-026`**, and everything under **`src/`**.

**The duplicate trace rows were NOT repaired this hop** — that is `ABC-040`'s work, and repairing
them here would have been the same boundary violation the ticket exists to schedule properly.

## E. Two things deliberately left undone, named rather than silently skipped

1. **No `_Updated:` header line was added to `plans/traceability.md`.** The file has 27 and every
   prior hop added one; my boundary was *"append rows for your two new tickets only"* and a header
   line is not a row. **Boundary over convention, flagged** — the Orchestrator decides whether it
   wants one.
2. **No ID was allocated for the status-currency defect** (10 of 25 `Done` tickets have a trace
   `Status` cell with no occurrence of the word `Done`). This hop held `ABC-039` and `ABC-040`;
   next free is **`ABC-041`**. Recorded in `ABC-040`'s `## Out of scope` with the ten ids and the
   method, and in the observation note.
