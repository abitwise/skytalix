---
id: 20261105T004151Z-architect-design-decision-5941f727
kind: decision
by: architect-design
at: 2026-11-05T00:41:51Z
verified_by: 
confidence: high: every figure is QE's or the engineer's run, read from their notes; nothing run here; why e1e5 stays ahead is UNKNOWN - verify
refs:
  - arch-ABC-301-miss
  - ABC-301
  - EPIC-011
  - ADR-0067
  - ADR-0070
  - F3
  - F4
  - F5
  - F6
  - B-T5
  - zugzwang.001
  - dd88560f
  - b297ab89
  - grugops/ABC-301
  - qe-ABC-301-miss/20261105T003042Z-qe-e2e-decision-d065fee3
  - qe-ABC-301-miss/20261105T003042Z-qe-e2e-observation-77e088f7
  - se-ABC-301-fit/20261105T001224Z-software-engineer-failed-attempt-04dc7cd4
  - se-ABC-301-fit/20261105T001224Z-software-engineer-observation-358b29b1
  - orch-2026-10-30a/20261105T001333Z-orchestrator-decision-aa971f0b
supersedes: 
seal: sha256:864afa124faff0a22aafc3cd005bc75373f898db29a37860129993c3b944ad61
---

# arch-ABC-301-miss item 1: the NOT MET is on record. `ADR-0067` F4 fired on `dd88560f`, `ADR-0070` F5 fired, `ADR-0070` F4 did not, and K0 does not retire. No bar moves

Architect/Design, task `arch-ABC-301-miss`, records only, from `main` `701ef5bd`. Nothing was run. Inputs: QE `…d065fee3`, `…77e088f7`, `…066fadea`; the engineer's `…e33f11bd`, `…04dc7cd4`, `…358b29b1`, `…12103827`; the Orchestrator's `…aa971f0b`.

**Written as dated lines of 2026-11-05:**
- `ADR-0067`: § Status, the decision log, d6's forecast line, a block below the bars table, F4's row and § Consequences item 5.
- `ADR-0070`: § Status, the decision log, F4's and F5's rows, and § Consequences' "For the second pull".

**What the lines say.**
- **NOT MET under `ADR-0067` F4, real, no defect.** `zugzwang.001` plays e1e5 at depth 9 on `dd88560f`, four ways. The base `b297ab89` plays e1f1 on the same harness.
- **The fit itself held.** Feasible, 26 of 26 relation rows green as inequalities, B-T1 0 misses, B-T2 0.9872 ×, B-T3 byte-identical. F3 did not fire, so d6's amendment did its job. It stands for any later pull.
- **`ADR-0070` F5 fires.** The tuned set is not merged and the structure stays on `main`, value-identical, at 0.
- **`ADR-0070` F4 does not fire.** It reads "every E4a eg half at its 0 bound". 17 of 18 moved. One half, `PASSED_KING_OWN` eg at R = 1, sits at 0 and is recorded as dead weight, as `ABC-301` asks. So F4's "a later ticket may remove it" is not opened. Only § Consequences' "if no pull ever fits the terms" could open it, and that is the owner's answer to item 2.
- **Nothing retires.** K0's seven rows stand, re-pointed by `ABC-304`. So do the two "every half 0" rows, the rows that were to retire at the second pull and `FROZEN.k0`. No re-pin was taken.
- **Unread stays unread.** B-T6 to B-T8, `G2`, the endgame `G2` and the futility audit. The record-only rows are not a pass of B-T5.

**Two points the lines state because the records could be misread.**
- **"One ply later than the base" is not evidence that E4a narrowed the gap.** The candidate turns to e1f1 at depth 10, and the first pull's at 12. Between the pulls the data, the tool, the free set and `main`'s search all changed (`ABC-279` and `ABC-283` merged). So the comparison isolates nothing. Depth 10 is the engineer's single read; QE read depth 9 only.
- **B-T8's approval was for this pull.** About 5 h went unspent. It does not carry to a later attempt, as the first pull's did not carry to this one (`ADR-0067` d6's open item 2).

**`UNKNOWN - verify`:** why e1e5 stays ahead on this table. Also the depth-9 margin on today's base, last read at 29 cp on an older `main` (`ADR-0070`'s probe).
