---
subtask: qe-ABC-201
role: qe-e2e
ticket: plans/tickets/ABC-201-on-a-fresh-git-clone-npm-install-then-npm-run-chess-starts-a-playable-game-and-the-first-board-in-under-2-s.md
ref: .grugops/context/qe-ABC-201/
inputs: Security/NFR …9da46c78, …636a410f (task security-nfr-timing-2026-10-23; raw files under probe/p2)
width: 2 (beside arch-floor-reread, records only)
---

# QE hop for ABC-201: re-read the fresh-clone reading

## Do
- Re-read A1–A4 from the raw evidence in `.grugops/context/security-nfr-timing-2026-10-23/probe/p2/` **before** opening Security/NFR's notes.
- Then take your own short re-reading on a fresh `git clone` of `main` (`c0585331`) in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe201/`, with an empty npm cache and empty user config:
  - A1: install.
  - A2: the piped smoke run.
  - A3: at least 10 launches with the same instrument copy. Precondition before the A3 runs: AC, load1 ≤ 8, no foreign vitest. If the host does not qualify, mark A3 re-read UNRESOLVED and rely on the recorded reading.
- `main` now includes ABC-200. On a pipe, the first board must be unchanged (A6 of ABC-200). Say whether the 23-newline pin still holds.
- Verdict: PASS, PASS_WITH_GAPS or FAIL, with a gap register (`QE-201-x`). UAT is waived (0 production lines).

## Fences
- Scratch clones only. Commit notes plus a `## QE` section on the ABC-201 page on `grugops/qe-ABC-201` (worktree `../wt-qe-ABC-201` from `main`). No `src/`, `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `qe-ABC-201`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
