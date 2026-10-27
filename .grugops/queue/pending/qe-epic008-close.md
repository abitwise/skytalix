---
subtask: qe-epic008-close
role: qe-e2e
epic: plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
ref: .grugops/context/qe-epic008-close/
branch: new grugops/qe-epic008-close from main, worktree ../wt-qe-epic008-close
width: 1 — ALONE (R reading ~4.4 h + M3 gate reads). Records-only hops may run beside it (no npm/vitest/build).
---

# EPIC-008 close, step 3: the closing M1 R reading + M3 gate reads

> **One run (`…4c3f7639`):** the R reading runs once and its written result is final. UNRESOLVED is reported; a re-run is the owner's word.
> **Power:** log the power source; never stop a reading because of it.

## Do
- Read Orchestrator `orch-2026-10-27n/…8132b7a9`, `orch-2026-10-27m/…64925a53`, and the EPIC-008 page's close path step 3 (BA/PM `bapm-s1-ABC-210/…ff16a93d`).
- Own `npm ci --ignore-scripts`. **Confirm before game 1** that your sha's `src/` and `data/` equal `b5c67ab7`'s. Any difference → STOP to me.
- **R by ABC-204 A4's protocol, every pin frozen** (ABC-204 § Reading, "Frozen for EPIC-008"): E = **1 910**, no E step; 200 games; `openings.epd` sequential, both colours; skytalix at `st=3`; Stockfish and cutechess-cli at the § Dependencies sha256 values. Verify the hashes. PREREG before game 1.
- **Before the reading:** load1 ≤ 8, no foreign vitest (wait up to ~60 min). Sample every ~10 s and map overlaps to games. Report all-games and overlap-free; grade by the page.
- **Report R** as E + X ± Y and the M1 inputs: R − 2 061.3 and the half-width √(50.3² + Y²). Don't grade M1; BA/PM does (step 4).
- **M3 on the same sha, each by its own instrument:** G1 (PUZZLE_DEEP ≥ 54/58), G5, G6, G8, G9. G6 "≥ base" reads main at close against the M1 baseline sha `3497aad2`: 5 interleaved runs per board per build, median, floor 6 (rule A, `…2ae5fc12`).
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips (`--skip-count 0`).

## Fences
- Work only in your worktree and `<scratchpad>/qeclose/`. Raw outputs under your context folder per ABC-204 A7, redacted. Make driver scripts executable before the first start.
- No `src/` or `tools/` edits. Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-epic008-close`) with `at` taken from `date -u`, including a `kind: decision`. Commit on your branch.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
