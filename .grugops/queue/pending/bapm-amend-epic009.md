---
subtask: bapm-amend-epic009
role: ba-pm
ref: .grugops/context/bapm-amend-epic009/
branch: new grugops/bapm-amend-epic009 from main, worktree ../wt-bapm-amend-epic009
ids: ABC-223, ABC-224 free if a new ticket is needed (EPIC-010 holds ABC-225..239)
---

# Amend EPIC-009 and ABC-218..222 to the owner's answers (records only)

## Read
- The owner's words, verbatim plus the Orchestrator's reading: `orch-2026-10-29g/…a67f71ac`. They govern.
- Your own EPIC-009 notes (`bapm-epic009-tournament/…371570e0`, `…4d365276`, `…77ab69c0`) and the SA time note
  `sa-ideas-verify/…1ccf0010`.
- Architect `arch-epic009-settings` runs in parallel and rules the input form and the ADR text. Don't pre-empt it:
  write "form per the Architect's ruling" where needed. If its note has landed when you need it, cite it.

## Do
- **ABC-218:** a dated close line: closed by the owner, not run (non-deterministic, not usable for the tournament).
- **The epic:** status, options (owner picked (a) first, then (b) later), Q1–Q8 answered with dates, the measures.
  Smoke readings are 5–10 cutechess games; major validation (≥ 100 games) and any strength reading are later and out
  of this MVP. Levels 1–7 unchanged.
- **Re-cut the tickets to two settings, `simple-tournament` and `uci-clock-mode`:**
  - simple-tournament: fixed T under a 22.5 s hard ceiling. UCI is required (cutechess). Say whether CLI parity is
    worth keeping, and keep it only if cheap and clean; otherwise put it out of scope, with the reason.
  - uci-clock-mode (later milestone): real clock, margin, hard stop, 60 s per-move ceiling.
  - An acceptance smoke reading for each (5–10 games at 40/15, 0 losses on time, closest call ≥ 500 ms, ≥ 75 % clock
    use, where that measure applies).
  - Re-use ABC-219..222 where they fit. Re-scope, merge or retire them with dated lines, and don't renumber.
- **The Q4/Q8 tension:** a 22.5 s ceiling plus ≥ 500 ms at move 40 means T < 22.5 s. Give the arithmetic and propose T.
  The owner is told the number. Don't change the ceiling.
- Re-score the DoR. Tickets that wait only on the Architect's ruling stay Backlog, with that named. List the board lines
  you want in your decision note.

## Fences
- Records only: `plans/epics/EPIC-009-…`, `plans/tickets/ABC-218..224`, your context. No `src/` or `tools/` edits.
  No board edits. No ADR edits (Architect). Never push, force, amend or rebase. Never merge into main.

## Publish
- Seal notes (task `bapm-amend-epic009`) with `at` from `date -u`: the amendment decision and the ticket list. Commit
  on your branch. Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/.
