---
subtask: qe-epic008-close
role: qe-e2e
epic: plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
ref: .grugops/context/qe-epic008-close/
branch: new grugops/qe-epic008-close from main, worktree ../wt-qe-epic008-close
width: 1 — ALONE (two R readings, ~4.4 h each, + M3 gate reads; ~9 h). Records-only hops may run beside it (no npm/vitest/build/games).
held: spawn only after se-tools-rating-host AND bapm-epic008-hostB are merged into main (orch-2026-10-28a)
---

# EPIC-008 close, step 3 (option B): two M1 R readings on this host + M3 gate reads

> **Option B (owner, `orch-2026-10-28a/…5dbd717b`):** M1 = R(close) − R(baseline), both read on THIS host, half-width √(Y1² + Y2²). The previous-host 2 061.3 ± 50.3 is **not** the comparison.
> **One run each (`…4c3f7639`):** each R reading runs once and its written result is final. UNRESOLVED is reported; a re-run is the owner's word.
> **Power:** log the power source; never stop a reading because of it.

## Do
- Read Orchestrator `orch-2026-10-28a/…5dbd717b`, SE `se-tools-rating-host` (re-pin), BA/PM `bapm-epic008-hostB` (M1 line + close-path step 3), and the EPIC-008 page as merged.
- Own `npm ci --ignore-scripts`. Run the harness from your worktree at main (re-pinned). Tool paths come from the environment (`CUTECHESS_CLI`, `STOCKFISH`); the values are in the env file named in your spawn prompt. Keep them out of every record.
- **Close sha:** main at your cut. **Confirm before any game** that its `src/` and `data/` equal `b5c67ab7`'s. Any difference → STOP to me.
- **PREREG first**, as one sealed note before game 1 of reading 1: both shas, E = 1 910, 200 games each, the pins, the order, and the grading rule from the page.
- **Reading 1: baseline `3497aad2`.** **Reading 2: the close sha.** Both by ABC-204 A4's protocol, every pin frozen (ABC-204 § Reading, "Frozen for EPIC-008"): `r <sha> <out> --elo 1910 --rounds 100` (200 games); `openings.epd` sequential, both colours; skytalix at `st=3`. Verify both tool hashes print `= pin`; `DIFFERS` → STOP before game 1.
- **E is frozen and has no E step.** If a reading's score lands outside 25–75 %, report it and grade it as the page says. Don't move E, and don't re-run.
- **Before each reading:** load1 ≤ 8, and no foreign vitest or cutechess (wait up to ~60 min; other sessions on this host run vitest). Sample every ~10 s and map overlaps to games. Report all-games and overlap-free; grade by the page.
- **Report** each R as E + X ± Y, plus the M1 inputs: R2 − R1 and √(Y1² + Y2²). Don't grade M1; BA/PM does (step 4).
- **M3 on the close sha, each by its own instrument:** G1 (PUZZLE_DEEP ≥ 54/58), G5, G6, G8, G9. G6 "≥ base" reads the close sha against `3497aad2`, **both on this host**: 5 interleaved runs per board per build, median, floor 6 (rule A, `…2ae5fc12`). Run the M3 reads after both R readings, never during one.
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips (`--skip-count 0`).

## Fences
- Work only in your worktree and `<scratchpad>/qeclose/`. Raw outputs go under your context folder per ABC-204 A7, redacted (no host paths or usernames). Make driver scripts executable before the first start.
- No `src/` or `tools/` edits. Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-epic008-close`) with `at` from `date -u`: PREREG, one per reading, M3, and a `kind: decision`. Commit on your branch.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
