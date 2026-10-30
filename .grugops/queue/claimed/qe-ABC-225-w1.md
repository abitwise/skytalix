---
subtask: qe-ABC-225-w1
role: qe-e2e
ticket: ABC-225
ref: .grugops/context/qe-ABC-225-w1/
branch: grugops/ABC-225 @ 933d9f35 (main 14c8aafa merged in 3dca0e67; tools/rating only); QE commits on new grugops/qe-ABC-225-w1 from 933d9f35 (worktree .claude/worktrees/qe-ABC-225-w1)
width: ALONE (40 games, ~2.2–2.4 h)
---
# QE ABC-225: A5/A6 at --concurrency 1 (owner word …65848126), A1–A4 re-check
## Read
ABC-225 ticket (A1–A6 as re-worded 2026-10-30), the first QE's records on grugops/qe-ABC-225 @ 3da78303 (FAIL on THERMAL STOP at width 2;
A1–A4 met; its scripts), se-ABC-225-main notes (`…0813b232`, `…a9f5834c`, `…2f0a5298` — the A5 command shape and what to confirm).
## Do
- PREREG first, sealed and committed before any game.
- A1–A4 re-check (offline: `node --test tools/rating/pair-check.ts`, dry-run argv vs `r`). Gates via `npm run …`.
- A5 ALONE, `--concurrency 1`, per the ticket (dry-run first; literal shas; base/candidate as the ticket names). Wait-clear by polling
  `kill -0 <pid>` on any foreign vitest/cutechess (never `while pgrep -f`). Thermal stop: Tctl median > 85 °C → STOP (not read).
  If the run dies without a thermal stop, record it VOID and STOP — do not loop.
- A6: wall from schedule.log, games/hour, projected 400-game pair at width 1.
- Confirm what the SE flagged: cutechess honours start=S, nps in every block, Tctl via k10temp, block Elo vs pooled formula.
- Rule the SE's LOW (r literal 4000 vs passed-but-unread budget).
## Fences
No src/, tools/, data/ edits. Never push, force, amend, rebase, merge into main. No board edits. Never bare npx/npm exec. No host paths
in commits. Scratch `qe-225-w1/`. Tool env file outside the repo, mode 600, pins verified.
## Publish
Sealed notes (task `qe-ABC-225-w1`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
