---
id: 20261010T094320Z-qe-e2e-decision-abc128-verdict-pass-with-gaps-f578d69a
kind: decision
by: qe-e2e
at: 2026-10-10T09:43:20Z
verified_by:
confidence: high
refs:
  - ABC-128
  - ABC-120
  - ABC-021
  - QE-051-b
  - M9
  - N8-LANE
  - src/turn-loop.test.ts
  - 20261010T094320Z-qe-e2e-observation-abc128-twelve-mutants-m9-red-exactly-a3-a5-1c4b0c68
  - 20261010T094320Z-qe-e2e-observation-abc128-gap-register-c3761a5e
  - 20261010T093049Z-software-engineer-decision-abc128-placement-and-a8-title-f2b00452
  - 20261010T093741Z-software-engineer-observation-abc128-m9-red-gates-n8lane-2189d95b
  - .grugops/context/qe-ABC-128/probe/out-gates-tip.txt
supersedes:
---

# `ABC-128` QE verdict: **PASS_WITH_GAPS** at `61a785f`. No gap blocks it

Hand-authored, no seal. This is a `decision`, not a `finding`, because no `§14-gate` verdict exists on
this install. Diff under review: `fcbf06b...61a785f` on `grugops/ABC-128-take-back-guard`. QE re-ran
each criterion itself, in the Engineer's worktree for the gates and in `git archive` scratch copies
for the mutants.

| | reading | result |
|---|---|---|
| `A1` | `M9`, planted by QE's own runner: base `fcbf06b` 67/67 green, and 1540/1540 on the whole lane, so it survives. At the tip, exactly `ABC-120` `A3`, `A4`, `A5` are red, each `expected "keyHistory" to be called +0 times, but got 1 times`. The two files read 64 passed / 3 failed, and the whole lane reads 1537 / 3, with no other row failing. Reverted: 67/67 green. `M9b` (planted before `takeBack`) reads the same 3 rows | **MET** |
| `A2` | `grep -c 'nowhere else' src/turn-loop.test.ts` = **0**. `:1813` still starts `A8 —` and names the REFUSED claim. Every edge the title names has a mutant some row kills: refused `M13`, advancing `M11`/`M12`, allowed `M10`, take-back `M9`/`M9b`/`M9c` | **MET** |
| `A3` | `git diff --numstat fcbf06b...61a785f -- src` = `6 1 src/turn-loop.test.ts`, nothing else. The 0-production-files filter prints nothing. `it(` count in the file is 48 at both base and tip. Suite 50 files / 1540 tests, the same as the base. `npm run lint` exit 0 (97 files), `typecheck` exit 0, `build` exit 0, `npm test` exit 0 (50 / 1540), skip count 0, `test-skip-integrity.js … --skip-count 0` printed `No findings.` and exit 0 | **MET** |

**Why `_WITH_GAPS`:** two mutants survive the whole suite, on edges the ticket fenced out and the
narrowed title no longer claims. They are `M14` (`rejected`/`ambiguous`/`command`, QE-128-a, LOW)
and `M17` (seam `game-over`, QE-128-b, INFO). The guard on `quit`/`eof` is incidental (QE-128-c,
INFO). The register is in note `…c3761a5e`. None is a criterion miss, and none blocks leaving
`In Review`.

UAT: the delivered `src/` diff has zero production lines, so the 2026-08-17 waiver applies if the
merge keeps it so. That is measured at merge, not here. Security/NFR is not triggered (test
assertions only). `N8-LANE` is 0 new files. QE did not re-run the full-lane timing. The board move
is the Orchestrator's. Not merged, not pushed.
