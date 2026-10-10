---
id: 20261010T144820Z-software-engineer-observation-abc136-gates-ledger-a1-a5-cost-881e15e2
kind: observation
by: software-engineer
at: 2026-10-10T14:48:20Z
verified_by:
confidence: high
refs:
  - ABC-136
  - ADR-0011
  - R5b
  - QE-057-a
  - ADR-0035
  - N8-LANE
  - src/history-pane.nfr.test.ts
  - 20261010T144820Z-software-engineer-decision-abc136-two-framed-operand-pins-and-a-reach-comment-5b359211
supersedes:
---

# `ABC-136` readings: gate green; `QSCAN-NARROW` / `QLHS-INTERSECT` (+FMT, +WPERFT-STATIC) GREEN 12/12 -> RED on the tripwire; rest of ledger unchanged; cost inadmissible under load

Hand-authored and unsealed. Branch `grugops/ABC-136-licence-operands` from `c715b3c2`; code commit `b50b0e2b`
(`src/history-pane.nfr.test.ts` +16/-2). Not merged, not pushed. Apple M3, Node v26.11.0. Raw files: `../probe/` (`RUN.txt`).

**Premise re-verified at `c715b3c2` before editing** (file byte-identical to `71418879`): both operand mutants
exit 0 12/12, with and without `WPERFT-STATIC`; `M15`/`M15SUB` red; witnesses 3/1/1 (load1 7.87).

| build | base `c715b3c2` | delivered `b50b0e2b` |
|---|---|---|
| CONTROL | exit 0, 12/12 | exit 0, 12/12 |
| QSCAN-NARROW+FMT | exit 0, 12/12 | **exit 1**, tripwire |
| QSCAN-NARROW+FMT+WPERFT-STATIC | exit 0, 12/12 | **exit 1**, tripwire |
| QLHS-INTERSECT+FMT | exit 0, 12/12 | **exit 1**, tripwire |
| QLHS-INTERSECT+FMT+WPERFT-STATIC | exit 0, 12/12 | **exit 1**, tripwire |
| QSCAN-NARROW / QLHS-INTERSECT (no FMT) | — | exit 1, tripwire (scan pin / importer pin) |
| M15+FMT, M15SUB+FMT | exit 1, tripwire | exit 1, tripwire |
| WLAUNDER | 3 failed (A6.3, A6.4, licence) | same 3 by name |
| WSTALELICENCE, WPERFT-STATIC | 1 failed (licence) | same 1 by name |
| QMOVE-COMMENTED-M15 (residual, out of scope) | exit 0 | exit 0 |

No PLANT-FAILED. Every planter anchor and framed form counts 1 in the raw file.

- **A1, A2 MET** (table). **A3 MET** (table; count 12 = base).
- **A4 MET:** collapsed text "a hop that widens the guard reds this test" 1 -> **0**; comment names `R5b` (2 in
  collapsed text), `productionModulesIn`, `runtimeImporters`, "not tamper-proof", "has to show in the diff".
- **A5 MET:** name-only = `src/history-pane.nfr.test.ts` alone; guard's three framed statements count 1 at base
  and head; licence `it` byte-identical; `spansqe.py` before = after (all seven rows).
- **Gate** (worktree, `b50b0e2b`): lint exit 0 (100 files, no warnings), typecheck 0, build 0, `npm test` exit 0
  52 files / 1608 passed (14.1 s, load1 7.51 -> 12.67), skip count 0, integrity `No findings.`,
  `lane-inventory.js` "52 test files; git tracks 52. No findings."
- **Cost (ADR-0035 proposed, narrow set `src/history-pane.nfr.test.ts`, base/head/twin, 9 rounds, round 0
  dropped):** set 1 load1 median 15.05: twin median -0.042 s (-2.02 %), R 0.148 s; head - base median -0.020 s,
  interval -0.080..0.075. Set 2 load1 median 16.87: twin +0.039 s (+2.20 %), R 0.196 s; head - base +0.061 s,
  interval -0.009..0.099. **Both sets INADMISSIBLE** (twin median > 1.5 %) under the parallel QE puzzle lanes.
  No figure is claimed against the 0.058 s floor. Reported only: every head - base reading is far under
  `N8-LANE`'s 650 ms; the change adds two `toContain` calls on a string already read, no new `it`, file or spawn.
