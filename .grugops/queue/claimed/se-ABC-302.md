---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T18:15:10Z
subtask: se-ABC-302
role: software-engineer
ref: .grugops/context/se-ABC-302/
branch: new grugops/ABC-302 from main — worktree .claude/worktrees/se-ABC-302
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. No games. Host paths only as placeholders.
---
# Build ABC-302: move the nine rows (test-only)
Build exactly the Architect's lines from arch-ABC-302 …bcadd41d (SE build lines 1–10; working sketch .grugops/context/arch-ABC-302/raw/tip.py) and the ABC-302 page. BA/PM is writing the DoR line in parallel; the Architect's note governs.
- Six rows take S, with remnants titled exactly as given; R3, R6 and R7 take W.
- R8 goes to uci-session's ENGINE_DEEP. R9 takes option (ii), gated in its own file under ENGINE_DEEP.
- AGENTS.md count edits: null-move 45 → 46 and futility 47 → 53, 0 B net. Check the size stays ≤ 18 432 B.
- No src production line, no new test file, no new env var, no new lane line.
Bars before handoff:
- the lane total 2 684 / 2 684 in 71 files;
- every -t line prints "1 passed" (A4);
- the A6 kill parity spot-check on the R2, R8 and R9 mutants (scratch only);
- typecheck, lint and build clean; skip count 0;
- npm test green.
Report the default-lane median over a few interleaved base/head pairs; QE grades it.
Fences: test files, AGENTS.md (the two counts only), the command log line if the page names it, your records. No ticket, EPIC, ADR or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-302, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
