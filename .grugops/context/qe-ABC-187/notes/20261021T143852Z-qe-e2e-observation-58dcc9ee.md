---
id: 20261021T143852Z-qe-e2e-observation-58dcc9ee
kind: observation
by: qe-e2e
at: 2026-10-21T14:38:52Z
verified_by: 
confidence: high (git merge-tree simulation; ABC-168 is unmerged)
refs:
  - ABC-187
  - grugops/ABC-187
  - grugops/qe-ABC-187
  - 9578481f
  - 494f7862
  - 65ee533d
  - 4890782a
  - 8918b07a
  - ABC-168
  - grugops/ABC-168
  - b71f8902
  - QE-164-h
  - src/cli.test.ts:2242
supersedes: 
seal: sha256:df15d67d2cbf1ea447ce1b43575d5b827974ebb5dbb863ab808dca33f4fdfcad
---

# ABC-187 regression risk: the 8-closer comment goes stale again when ABC-168 merges

- `grugops/ABC-168` (Scribe tip `b71f8902`, not in `main`) carries `AGENTS.md` at 16,090 B, with **9** closers after the `- Dev / run:` slot's own (`main` has 8).
- `git merge-tree --write-tree 4890782a grugops/ABC-168` merges cleanly. In the result, `AGENTS.md` is 16,090 B (≤ 18,432, so the guard stays green), `:7` reads `≤ 18,432 B`, and the closer count is 9. But `src/cli.test.ts` (`:2244` in the merged tree) still says "carries 8 further closers". That is the QE-164-h defect again.
- Not ABC-187's defect: A5 holds at head as defined (head = branch + latest `main`). It happens in either merge order, because no assertion reads the comment. Whichever of ABC-187 and ABC-168 merges second should re-run A5's script and fix the number, or drop the number.
- Every other branch whose `AGENTS.md` differs from `main` is already merged into `main`. ABC-168 is the only one in flight.
