---
subtask: qe-ABC-228-ii
role: qe-e2e
ticket: ABC-228
ref: .grugops/context/qe-ABC-228-ii/
branch: grugops/ABC-228 @ 5e84d0d7 (code 8c82399f on d9c5bcde; base main 61d5d629, src-identical to current main); QE commits on a new grugops/qe-ABC-228-ii from 5e84d0d7 (new worktree .claude/worktrees/qe-ABC-228-ii)
width: ALONE (timing + games)
---

# QE ABC-228 under (ii): new PREREG, G5/G6/G11 at 4 s, G8, then A6 smokes

## Why
qe-ABC-228 STOPPED at G6 (position-6 9 vs 10). se-ABC-228-ii built Scope 5 (LEVELS[5] + DEFAULT_BUDGET_MS → 4 000;
rating.ts R literal → 4000) and read A9 met (65.9 % / 97.4 % ≤ 133 %). Orchestrator code review PASS.

## Read
- Ticket: A5 "Under (ii)", A6 "Under (ii)", A9, § Test notes 4. ADR-0053 d10. EPIC-010 § The merge rule.
- se-ABC-228-ii notes (`…5a99ee51`, `…c8c1e541`, `…ce56f9a5`, `…0f553b17`) on grugops/ABC-228.
- Your predecessor's notes and scripts (task `qe-ABC-228`, branch grugops/qe-ABC-228; `raw/qe-scripts/g6.mjs`) — reuse, budget changed only.

## Do
- PREREG first, sealed and committed before any timed run or game.
- Re-verify the Q-SET now lives in src/quiescence.test.ts (QE-C1..C4, QE-M1..M3) with the checkpoint's values.
- Gates via `npm run …`; npm test + skip integrity; deep lanes one file at a time.
- G5 (level 5 ≤ 4 s, 5 s ceiling), G6 under (ii) per A5 (5 interleaved runs per build, head at 4 000 ms vs base at its
  3 000 ms, median, "≥ base", floor 6), G11 at 4 s, G8 base vs head in this session.
  **On a G6 miss: STOP before the smokes and report** (goes to the owner — no further route exists).
- Rule SE-228ii-a (LOW proposed: GO_G3500 rows no longer distinguish levels 5–7).
- **A6 smokes ALONE at `--concurrency 1`**, R from the candidate head's rating.ts (reads 4000):
  `d 5e84d0d7 61d5d629 <out> --budget-ms 1500 --rounds 5 --concurrency 1` and `r 5e84d0d7 <out> --elo 1910 --rounds 5 --concurrency 1`.
  S-1..S-4 under (ii) bars. Host wait-clear (no cutechess, no foreign vitest at start). Thermal stop: median > 85 °C → STOP.

## Fences
No src/, tools/ or data/ edits. Never push, force, amend or rebase. Never merge into main. No board edits. Linters only
via `npm run …`; never a bare `npx` or `npm exec`. No host paths in any commit. Scratch in scratchpad `qe-228-ii/`.

## Publish
Sealed notes (task `qe-ABC-228-ii`, `at` from `date -u`). Commit on your branch. `## Result` + 10-cell trace row here,
then move this brief and claim to done/ (tracked copy on your branch if the guard refuses).
