---
id: 20261021T081014Z-software-engineer-artifact-ref-abc159-branch-files-commands-d0c070f1
kind: artifact-ref
by: software-engineer
at: 2026-10-21T08:10:14Z
verified_by:
confidence: high
sealed: false
task: ticket-to-pr-ABC-159
subtask: ticket-to-pr-ABC-159
refs: [ABC-159, grugops/ABC-159, 3c505abe, 4ab5b453]
supersedes:
---

# `ABC-159`: branch `grugops/ABC-159` @ `3c505abe`, one commit on base `main` `4ab5b453`

- **Worktree:** `../wt-ABC-159`, with `node_modules` symlinked to main's.
- **Files:** `git diff --numstat 4ab5b453` lists exactly the four files:
  - `src/history-pane.nfr.test.ts`: 3/3
  - `src/san.nfr.test.ts`: 3/2
  - `src/status-panel.nfr.test.ts`: 3/3
  - `src/turn-loop.nfr.test.ts`: 3/2

  That is 12 insertions and 10 deletions. Hunks: status-panel @4, history-pane @5, turn-loop @8, san @17. Each
  hunk sits inside its file's header `/** */`, which closes at lines 13, 22, 34 and 28. No changed line lacks a
  leading ` *`.
- **Production lines under `src/`, excluding tests: 0** (0 files). The UAT waiver applies.
- **Tests added:** none. The page scopes comment lines only, and A4 forbids moving a test.
- **Probe:** `.grugops/context/ticket-to-pr-ABC-159/probe/`:
  - `a1.sh`: the page's A1 command, verbatim;
  - `counts.sh`: the A4 per-file runner;
  - `base-counts.txt` and `head-counts.txt`.
- **Not touched:** board, traceability, other tickets, other worktrees. Not pushed, not merged.
