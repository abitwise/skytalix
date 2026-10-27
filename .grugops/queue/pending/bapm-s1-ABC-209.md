---
subtask: bapm-s1-ABC-209
role: ba-pm
ticket: plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
ref: .grugops/context/bapm-s1-ABC-209/
branch: new grugops/bapm-s1-ABC-209 from main, worktree ../wt-bapm-s1-ABC-209
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# ABC-209: the S1 call after a NEUTRAL D (close or re-tune)

## Do
- Read Orchestrator `orch-2026-10-27a/…00f47145` and QE `qe-ABC-209/…e32e0ee4`, `…0932c037`, `…b3f525d2`. Use `bapm-s1-ABC-207` (`…f249ca34`) as the model.
- Make EPIC-008 S1's call for ABC-209. The delivery default is **close unmerged under S1**: a re-tune needs a second real-clock reading, beyond `…4c3f7639`. If you judge a re-tune worth it, write it as a **question for the owner** (what would change, why it could reach GAIN, ~6–12 h), not as a decision.
- **ABC-209 page:**
  - A dated close line (or a held-for-owner line), with front-matter per the ABC-205/207 convention.
  - The QE-209-c line: A6 says "one process across games", but the harness runs one per game. D still exercised the change, at ~98 %.
  - Sync the LOW carried in orch-2026-10-26x: A5's G6 sub-line and the DoR row-10 cells still read QE-205-c as open.
- **EPIC-008:** dated lines for proposal (ABC-209) not shipped, the M2/M3 effect, and whether **ABC-210** is pullable now. It was chained behind 209; say what its Ready trigger needs.
- Put the board card lines in your Result. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-s1-ABC-209`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
