---
id: 20261021T105301Z-software-engineer-observation-f93d22f3
kind: observation
by: software-engineer
at: 2026-10-21T10:53:01Z
verified_by: 
confidence: high
refs:
  - ABC-161
  - QE-101-a
  - QE-101-b
  - SEC-101-a
  - grugops/ABC-161
  - 35788fd4
  - ee1818bb
  - src/cli.test.ts
  - plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md
  - 20261021T104240Z-ba-pm-decision-b0020834
  - 20261021T103740Z-ba-pm-observation-8425f6db
supersedes: 
seal: sha256:30a4b2ec54c9dc009c839172e3f466e4834bc6ff259abeda4ec7d27d18bd10d5
---

# ABC-161 artifact: branch grugops/ABC-161, code commit ee1818bb, src/cli.test.ts (+23/-5), zero production lines, zero new tests

Recorded as an `observation`: the writer refused `artifact-ref` without a §14-gate `gate_run` id, and this hop has none.

- Branch: `grugops/ABC-161` (local only, never pushed), worktree `../wt-ABC-161`, rebased onto `main` `35788fd4`.
- Commits: `dc1fbc93` (first hop's notes, rebased from `1f623d18`), `ee1818bb` (the three edits), then this hop's notes commit.
- File: `src/cli.test.ts` only. Rows edited: `ABC-065` `A3` value check, `ABC-101` `A3` refused values, `ABC-101` `A8′` equivalence. Tests added: 0 (count 1987 at base and head).
- Trace row: `| ABC-161 | grugops/ABC-161 @ ee1818bb | src/cli.test.ts (3 rows sharpened) | A1-A4 met; 11 plants re-read base vs head; gates green 59/1987 | UAT waiver measured empty; QE owed |`
- Remaining: QE hop (QE re-plants P11-L1..L3, S2c, P9a-e to close `QE-101-a`, `QE-101-b`, `SEC-101-a`). The node_modules symlink in the worktree is git-ignored via `.git/info/exclude`.
