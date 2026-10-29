---
subtask: qe-epic008-q4c
role: qe-e2e
epic: plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
ref: .grugops/context/qe-epic008-q4c/
branch: new grugops/qe-epic008-q4c from main, worktree ../wt-qe-epic008-q4c
width: 1 — ALONE (one D reading, ~6 h, + ~1 h). Records-only hops may run beside it.
held: DO NOT SPAWN until the owner's explicit go (orch-2026-10-29c/…d9513dc1). He sets "counts or information only" and the concurrency.
---

# EPIC-008 Q4 (c): one D reading, main against 3497aad2, on this host

> **One run (`…4c3f7639`):** the reading runs once and its written result is final. UNRESOLVED is reported; a re-run is the owner's word.
> **Counts or information only:** set by the owner's go (orch note). If the note says nothing, it is information only and M1 is not re-graded.

## Do
- Read Orchestrator `orch-2026-10-29c/…d9513dc1` and the owner's go note after it, BA/PM `bapm-close-EPIC-008/…e53131ba` (Q4), QE `qe-epic008-close` (the R readings and their host log), and the EPIC-008 page § D (frozen pins, RISK-EPIC008-03).
- Own `npm ci --ignore-scripts`. Run linters only via `npm run …` after `npm ci`, never a bare `npx <name>` (`orch-2026-10-29e/…647be941`). Tool paths come from the environment; the values are in the env file named in your spawn prompt. Keep them out of every record.
- **Candidate:** main at your cut. **Confirm before game 1** that its `src/` and `data/` equal `b5c67ab7`'s. Any difference → STOP to me. **Base:** `3497aad2`.
- **PREREG first:** both shas, B = 1 500 ms, 400 games (`--rounds 200`), the concurrency in force, and the grading by the page's D states (GAIN / NEUTRAL / LOSS).
- `d <main-sha> 3497aad2 <out> --budget-ms 1500 --rounds 200 --concurrency <C>`, where C is the owner's width from his go note (no width in the note → omit the flag, default 3). Check that `machine.txt` shows the width. Both tool hashes must print `= pin`.
- **Thermal sampler (folds in Q4 (d)):** every ~10 s, log load1, CPU temperature (Tctl), the current frequency of every core, and the governor. Report median and max temperature and frequency per quarter of the reading. Say whether the frequency fell under load (throttling). Logging only: never stop the reading on heat.
- **Report** D as X ± Y with its state, the W/L/D count, the depth guard, wall time, and the thermal summary. Also report how this D compares with the R result (−82.9 ± 73.8): same sign or not. Don't grade M1; BA/PM does.

## Fences
- Work only in your worktree and `<scratchpad>/qeq4c/`. Raw outputs go under your context folder, redacted (no host paths or usernames).
- No `src/` or `tools/` edits. Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-epic008-q4c`) with `at` from `date -u`: PREREG, the reading, thermal, and a `kind: decision`. Commit on your branch.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
