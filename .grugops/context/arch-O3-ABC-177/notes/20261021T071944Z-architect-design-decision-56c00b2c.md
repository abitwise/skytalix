---
id: 20261021T071944Z-architect-design-decision-56c00b2c
kind: decision
by: architect-design
at: 2026-10-21T07:19:44Z
verified_by: 
confidence: high (A11 as written); the close itself rests on Security/NFR and the owner
refs:
  - ABC-177
  - NFR-008
  - R-174-1
  - ADR-0046
  - A10
  - A11
  - O3
  - 20261021T071304Z-qe-e2e-observation-bc49c2fe
  - 20261021T071305Z-qe-e2e-observation-84059cad
  - 20261021T071306Z-qe-e2e-decision-e808274d
  - 20261021T065500Z-orchestrator-decision-31ab7d2d
  - .grugops/queue/pending/arch-O3-ABC-177.md
  - 20261021T071940Z-architect-design-observation-e8b4d26d
  - 20261021T071942Z-architect-design-decision-ee7527cc
  - 20261021T071943Z-architect-design-decision-74d39535
  - security-nfr-ABC-177
  - ADR-0035
  - plans/tickets/ABC-177-npm-test-back-under-nfr-008s-10-s-adr-0046.md
supersedes: 
seal: sha256:428f48930eda6f4f0ac48bc7914c519fd8d62c79b8af0acd614345dd54fee418
---

# O3 decision 3 for `ABC-177`: **nothing in O3 blocks the close.** The close rests on Security/NFR's `NFR-008` and `R-174-1` ruling and the owner's merge, not on O3

Records only.

## Decision
- **A11 routes this band away from `ABC-177`.** For 9.2 s < H ≤ 10 s, `NFR-008` is MET and `ABC-177` may close on its
  other criteria. Tranche 2 goes under a new ticket, and `ABC-177` is not widened.
- **Decision 1 (`20261021T071942Z-architect-design-decision-ee7527cc`) does not even open tranche 2.** It holds O3 unopened until one clean re-read. That re-read is
  not a criterion of `ABC-177`.
- **Decision 2 (`20261021T071943Z-architect-design-decision-74d39535`) touches only `ABC-178`.**
- **No `ADR-0046` addendum, and no `F` move.** No lever changed. The B/T twin is over `ADR-0035` d1's 1.5 % (1.54 %),
  so this stage's twin R is not used to move `F`. `F` stays as it is.

## What the close does rest on (not O3's)
- **Security/NFR (`security-nfr-ABC-177`):** the `NFR-008` line on a warm-flagged reading whose strict view is VOID,
  and `R-174-1`'s discharge.
  - If Security/NFR rules the reading inadmissible, A10 is not met and A11 has no reading. That would hold `ABC-177`.
    It is a Security/NFR outcome, not an O3 one.
  - The Architect's input to that ruling: the remedy's effect does not hang on the warm flag. H−B wall is −1.620 s,
    sign 0/8, interval [−1.710, −1.540], in a stage whose base read 10.93 s. The margin to 10 s is 0.605 s, about
    2.4 × the H/H2 wall R.
- **UAT:** the standing waiver, measured at delivery.
- **The owner:** the merge. Humans hold merge.

## Board
No board move from this hop. `ABC-177` is in `In Security/NFR`, and column moves are the Orchestrator's.
