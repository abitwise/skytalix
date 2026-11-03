---
id: 20261103T123540Z-architect-design-observation-ee31f3ee
kind: observation
by: architect-design
at: 2026-11-03T12:35:40Z
verified_by: 
confidence: high: pool membership from merge history (only ABC-269 merged with an S-prime at E 1810) and QE's 7/3/0; arithmetic by ADR-0056's written rule; X matches cutechess-cli's printed 147.2
refs:
  - arch-post-269
  - grugops/arch-post-269
  - ABC-269
  - ABC-273
  - ABC-274
  - ABC-255
  - ABC-204
  - EPIC-011
  - E1
  - R1
  - R2
  - R3
  - G2
  - S-prime
  - C4
  - C1
  - C3-prime
  - ADR-0064
  - ADR-0067
  - ADR-0056
  - ADR-0031
  - ADR-0061
  - NFR-001
  - NFR-005
  - QE-269-f
  - QE-269-g
  - QE-269-h
  - QE-269-i
  - QE-269-j
  - QE-269-k
  - F3
  - F8
  - A5
  - B5
  - B6
  - B7
  - B8
  - 54dee3f2
  - be87a2f1
  - 01a67c5d
  - 128e3c6c
  - 58fa3eb4
  - tools/rating/rating.ts
  - qe-ABC-269/20261103T122410Z-qe-e2e-decision-eff2fe64
  - qe-ABC-269/20261103T122410Z-qe-e2e-observation-9ba289c2
  - qe-ABC-269/20261103T122410Z-qe-e2e-observation-2c51ee30
  - qe-ABC-269/20261103T114143Z-qe-e2e-observation-cebf49fe
  - qe-ABC-269/20261103T122410Z-qe-e2e-observation-48b34063
  - qe-ABC-269/20261103T122410Z-qe-e2e-observation-3fb121de
  - arch-ABC-269-F3/20261103T105957Z-architect-design-decision-e36ee7ca
  - arch-ABC-233/20261102T212011Z-architect-design-decision-f3a4dac0
  - orch-2026-10-30a/20261102T210500Z-orchestrator-decision-8ce2fd23
supersedes: 
seal: sha256:31598bbf97c715bfa65a3d7eb57e76a89603cc5a6cd7c32121ea89f8f5dec87d
---

# arch-post-269: the S′ pool at E 1 810 now holds one merged build, `ABC-269` (`be87a2f1`, merged as `54dee3f2`), at **7/3/0 = 7.0 / 10 = 70.0 %**. **No step fires**: 10 games is below the 30-game trigger, and 70.0 % lies inside 60–85 % in any case. At 30 games, the next 20 pooled games fire an upward step at ≥ 19.0 and the owner's downward question at ≤ 10.5

Architect/Design, task `arch-post-269`, records only. Rule: `ADR-0056` S′, the dated amendment of 2026-11-02 (`arch-ABC-233` `…f3a4dac0`; Orchestrator `…8ce2fd23`): merged builds only, E′ = E + X − 168.4 when 30 or more pooled games leave 60–85 %, upward with no ask up to 2 600, downward the owner's question.

## The pool
| build | QE task | merge | W/L/D | score |
|---|---|---|---|---|
| `be87a2f1` | `qe-ABC-269` (`…2c51ee30`) | `54dee3f2` | 7/3/0 | 7.0 / 10 |
| **pool** | | | **7/3/0** | **7.0 / 10 = 70.0 %** |

- No other S′ was played at E 1 810. `ABC-268`'s 8/2/0 closed the E 1 650 pool (26.0 / 30), and from `git log --merges main`, the only ticket merges after `e72487e1` (2026-11-02T20:48Z) are `ABC-269` and records hops. The E 1 980 pool never opened.
- **X** = −400 · log₁₀(1 / 0.7 − 1) = **+147.2**, which equals cutechess-cli's printed `147.2 +/- 385.0`. The point estimate puts `main` near 1 957 at 0.5 s. It is a 10-game figure, not a rating.

## The step: none
- 10 < 30, so the trigger is not read. If it were, 70.0 % lies inside 60–85 %.
- Thresholds at 30 games: an upward step at 26.0 / 30 (86.7 %), which needs ≥ 19.0 of the next 20. The downward question at ≤ 17.5 / 30 (58.3 %), which needs ≤ 10.5 of the next 20.
- `ABC-274` is value-identical and plays no games, so it adds nothing. R1 (`ABC-273`) plays at 100 ms, a different control, so it never pools, even at the same E.

## Records owed (BA/PM, `bapm-269-done`)
- `EPIC-011` § Close-out, the S′ pool row: "E 1 810 pool: `qe-ABC-269` 7/3/0, merged `54dee3f2`. 7.0 / 10, no step (below 30 games)". C10: unchanged.
