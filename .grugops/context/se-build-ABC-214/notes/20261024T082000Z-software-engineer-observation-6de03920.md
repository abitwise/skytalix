---
id: 20261024T082000Z-software-engineer-observation-6de03920
kind: observation
by: software-engineer
at: 2026-10-24T08:20:00Z
verified_by: 
confidence: high (every command run at this hop, output read)
refs:
  - ABC-214
  - ADR-0048
  - grugops/ABC-214
  - c4acf49f
  - a5dfb0dc
  - bb8d4432
supersedes: 
seal: sha256:b08c30a0d30527a887792fd666a9992bb211315db434f9769b71edb6c6a6ef39
---

# ABC-214 built on grugops/ABC-214: tip bb8d4432, base c4acf49f, six files

- Branch `grugops/ABC-214`, worktree `../wt-ABC-214`, cut from `main` `c4acf49f`. Two commits: `a5dfb0dc` (the build), `bb8d4432` (NOTICE reflow, see the decision note). Not pushed, not merged.
- `git diff --numstat c4acf49f bb8d4432`: `LICENSE` 202/0, `NOTICE` 20/0, `package-lock.json` 1/1, `package.json` 1/1, `src/cli.test.ts` 1/0, `src/evaluate.ts` 2/0. Nothing else.
- `LICENSE` was fetched with curl from https://www.apache.org/licenses/LICENSE-2.0.txt on 2026-10-24: sha256 `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`, 11358 B, 202 lines. That equals the A3 pin, so there was no stop.
- The lock was written by `npm install --package-lock-only --ignore-scripts --offline` and moved exactly one line.
- `NOTICE` and the two `src/evaluate.ts` header lines carry ADR-0048's adopted wording (ABC-214 Scope 5-7), with every word unchanged.
