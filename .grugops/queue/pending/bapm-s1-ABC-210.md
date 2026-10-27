---
subtask: bapm-s1-ABC-210
role: ba-pm
ticket: plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
ref: .grugops/context/bapm-s1-ABC-210/
branch: new grugops/bapm-s1-ABC-210 from main, worktree ../wt-bapm-s1-ABC-210
width: 1 of 2 — records only (no npm, vitest, build or timing)
---

# ABC-210: the S1 call after a NEUTRAL D (close or re-tune), and EPIC-008's close path

## Do
- Read Orchestrator `orch-2026-10-27k/…85e9c9b2` and QE `qe-ABC-210/…b953e670`, `…86b45c13`, `…e7597a78`. Use `bapm-s1-ABC-209` as the model.
- Make EPIC-008 S1's call for ABC-210. The delivery default is **close unmerged under S1**: a re-tune needs a second real-clock reading, beyond `…4c3f7639`. If you judge a re-tune worth it, write it as a **question for the owner** (what would change, why it could reach GAIN, ~6–12 h), not as a decision.
- **ABC-210 page:** a dated close line (or held-for-owner line), front-matter per the ABC-205/207/209 convention (this also clears the stale ready/Ready LOW). Note QE-210-b (LOW, closed as blind spot) for any re-cut.
- **EPIC-008:** dated lines for proposal (ABC-210) not shipped and the M2/M3 effect. ABC-210 was the last engine change: state the epic's **close path** — the closing M1 R reading (`ABC-204` A4 protocol, E 1 910 frozen, 200 games, ALONE), the M1 rule (≥ +100 and interval above 0, owner Q1), and the close item already on the card (full 30-architecture re-pass). Say which role owns each step and in what order. Don't run anything.
- Put the board card lines in your Result. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-s1-ABC-210`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
