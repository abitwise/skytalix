---
id: 20261109T161430Z-ba-pm-observation-abaaf21d
kind: observation
by: ba-pm
at: 2026-11-09T16:14:30Z
verified_by: 
confidence: high for 2-4 (read from git and the checkouts); 1 UNKNOWN - verify (the route is the Orchestrator's)
refs:
  - bapm-close-1109b
  - grugops/bapm-close-1109b
  - ABC-309
  - EPIC-011
  - ABC-306
  - ABC-295
  - orch-2026-10-30a/20261109T152701Z-orchestrator-decision-810191ff
  - 638ac8a5
supersedes: 
seal: sha256:c5928e19ebfd597f2161d9db9419e883344c16910c6d8d833daec60bd25a9923
---

# bapm-close-1109b: what is still owed, for the Orchestrator

BA/PM, task `bapm-close-1109b`, records only, at `main` `638ac8a5`; nothing run. These are observations, not rulings.

1. **How the art file reaches the build (`UNKNOWN - verify`).** `ABC-309` A1 and A2 read `assets/readme-art.txt` as present at the base sha: `cmp` runs at the build tip, and A1 forbids the branch from adding the file. The file is untracked on `main`, so a worktree cut from `main` will not have it. Either the owner commits it to `main` before the cut, or the Orchestrator rules another route and the page's A1 and A2 change with it.
2. **The owner's note `…810191ff` is not on `main` at `638ac8a5`.** `git grep 810191ff 638ac8a5` finds it only inside `qe-ABC-295`'s notes. This hop read the note file under `orch-2026-10-30a/notes/` in the main checkout's working tree, where it is not committed. `ABC-295`, `EPIC-011`, `ABC-306` and `ABC-309` now cite it, so it should be committed with the Orchestrator's next records commit.
3. **The board moves are the Orchestrator's:** `EPIC-011` to its closed place, `ABC-306` to Done (dropped), and `ABC-309` stays in Backlog. `ABC-295` is already in Done at `397b892c`.
4. **Queue:** the brief is in `.grugops/queue/pending/` on `main`. This worktree has no `claimed/bapm-close-1109b`, and `tools/grugops/claim.js` is not in the checkout, so this hop did not run `claim.js done`. The queue transition is the Orchestrator's.
