---
subtask: qe-ABC-225
role: qe-e2e
ticket: ABC-225
ref: .grugops/context/qe-ABC-225/
branch: grugops/ABC-225 @ 9988a778 (worktree ../wt-ABC-225 exists; add QE commits there or on a qe branch from it)
held: DO NOT SPAWN until se-ABC-235 and arch-ABC-228-adr are done and the host is idle (orch …561f1ef1)
width: ALONE (~1 h + QE)
---

# QE ABC-225: verify A1–A4 independently, then run A5 (a 40-game real smoke) ALONE and report A6

## Read
- The ticket; SE notes `se-ABC-225/…e58c4d25`, `…868049fb`, `…14fdbedc`; Orchestrator review `…561f1ef1`;
  EPIC-010 § The merge rule; the Architect's R/D method (`arch-epic008-rd/…0c5d62f4`).

## Do
- Re-run `pair-check` and the gates yourself. Spot-check A1's argv equality and A3's arithmetic against the r1/r2 records.
- PREREG first (sealed before game 1): the shas (base = main's merge-base, candidate = main, so expect NEUTRAL), the
  `--rounds 10`, the width, and what passes A5/A6.
- **A5:** `rpair <base> <cand> <out> --rounds 10`, ALONE, with tool paths from the env file named in your spawn prompt.
  Check the four unverified points the SE named: cutechess honours `start=`; every `nps.log` line has a value;
  `thermal.log` reads Tctl; a real block's Elo line equals the pooling formula. Host-path scan clean (excluding `clone-*`).
- **A6:** wall time; projection for the 400-game pair (target ≤ 10 h).
- Rule on `artifacts.txt`'s engine `id author` line.

## Fences
- Work in the ABC-225 worktree or a QE branch from it, plus your scratchpad. No `src/` or `data/` edits. `tools/` edits
  only if you find a defect: then STOP and report, don't fix it yourself. Never push, force, amend or rebase. Never
  merge into main. No board edits. No host paths in records. Linters only via `npm run …`.

## Publish
- Seal notes (task `qe-ABC-225`) with `at` from `date -u`: PREREG, the reading, the verdict (PASS / PASS_WITH_GAPS / FAIL).
  Commit on the branch. Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/.
