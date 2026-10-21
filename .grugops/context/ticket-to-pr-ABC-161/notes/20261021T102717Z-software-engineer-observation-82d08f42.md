---
id: 20261021T102717Z-software-engineer-observation-82d08f42
kind: observation
by: software-engineer
at: 2026-10-21T10:27:17Z
verified_by: 
confidence: high
refs:
  - ABC-161
  - grugops/ABC-161
  - 69610c5b
supersedes: 
seal: sha256:ee6d998bebd41007acf3c0353150189ec4c2e1be428d6e9306c8906b1bb0caa9
---

# ABC-161 artifacts: branch, worktree, commands (stopped hop). Recorded as an observation: the writer refuses an artifact-ref with no gate_run, and no gate ran

- Branch `grugops/ABC-161` from `main` `69610c5b`; worktree `../wt-ABC-161`. `node_modules` symlink is ignored (`.git/info/exclude` `/node_modules`).
- Files changed vs base: only this task's notes under `.grugops/context/ticket-to-pr-ABC-161/`. No `src/` file changed. Waiver grep `git diff --name-only 69610c5b <tip> | grep -v '\.test\.ts$' | grep '^src/'` is empty; no `.snap` change.
- Commands (scratch copy of `git archive 69610c5b`, private TMPDIR): `NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=default --reporter=json --outputFile.json=<scratch>/out/<label>.json`, once unplanted and once per plant (P11, S2c, P9a, P9b, P9c, P9d, P9e). Readings: the observation note of this task.
- Not run, because nothing was changed: lint, typecheck, build, `npm test` on the tip, skip-integrity, `CLI_DEEP`, `PERFT_DEEP`. Head-side plant runs: not run (no head).
