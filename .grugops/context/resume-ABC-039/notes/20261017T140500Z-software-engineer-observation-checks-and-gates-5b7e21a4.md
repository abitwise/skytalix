---
id: 20261017T140500Z-software-engineer-observation-checks-and-gates-5b7e21a4
kind: observation
by: software-engineer
task: resume-ABC-039
at: 2026-10-17T14:05:00Z
verified_by:
confidence: high
refs:
  - ABC-039
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - 20261017T110000Z-software-engineer-observation-chronology-cdf60868
supersedes:
---

# Criteria checks and gates at `3062071c`

- **A3, re-derived independently.** A script walked every `plans/board.md` commit in `git rev-list --reverse --topo-order 3215004c`
  and parsed each ticket's column section. It found 16 backward hits, the same commits as `…cdf60868`. Excluding `47b5b935`
  leaves **15**. All 15 commits pass `git merge-base --is-ancestor <c> 3215004c`. One wrinkle: at `b44b679c` the board puts
  `ABC-011` in `Ready for Dev`, not `In Design`, because the design was ruled in the same commit. The archived record says
  `In Design`, and the register keeps that and records the difference. The move is backward either way.
- **A4 (c).** Re-read `plans/metrics.md:28` at the tip: it says *"13 backward moves in total"*. Per-ticket counts against
  the source: `ABC-017` 1 vs 2 and `ABC-019` 2 vs 3; all others are equal.
- **A2 / A7.** All 9 labels are found by `grep -F` in their cited files. #2 is found by `grep -nF "FIRST BACKWARD MOVE IN THIS"`
  at `:814`, and `:815` matches `^ *PROJECT'S HISTORY`. `grep -rlF "<label>" plans/` lists the register for all 9 labels.
  Each corrected ordinal equals its chronology position (9 of 9).
- **A6.** `wc -l` is 59.
- **A5** against `e7d9d657`, under `plans src memory-bank AGENTS.md`: the ABC-039 page +55/0, the ABC-156 page +94/0 (0 lines
  changed after `e1a62a6b`), the register +59/0, `plans/traceability.md` +3/0. `src/`, `plans/metrics.md` and the archive are
  all 0. The 1 line in `plans/board.md` is still owed (A1).
- **Gates** (the worktree had no `node_modules`; I symlinked the main checkout's, and the lockfiles are identical): `npm run lint`
  0 (113 files); `npm run typecheck` 0; `npm run build` 0; `npm test` 0, 58 files, 1792/1792, pending 0, todo 0;
  `test-skip-integrity.js --skip-count 0`: `No findings.`, exit 0.
