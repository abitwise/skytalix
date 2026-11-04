<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-283-mate

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04T14:02:37Z | decision | architect-design | high (written and sealed before any measured run; the rule and the bars are fixed here) |  | # PREREG arch-ABC-283-mate: why history loses the KRK mates on `grugops/ABC-283`, the structural candidates, the bars, and the rule that decides ADR-0063 F2. Sealed and committed before any measured run. |
| 2026-11-04T14:23:32Z | observation | architect-design | high on every deterministic count (fixed depth or frozen clock, under the host lock; instrument check exact against the branch and se-ABC-283's floors) |  | # arch-ABC-283-mate measurement, under PREREG `…07f1eb6d` (commit `6ad10900`): the miss is LMR on a malus-demoted mating move. Of the pre-registered candidates only K3 meets every bar. |
| 2026-11-04T14:24:15Z | decision | architect-design | high on the floor, P0, zugzwang and G1 readings for K3 on the scratch copy; medium on robustness beyond the 287 (H-pre: the floor is order-sensitive under LMR; the d6 report reads 2 / 209) |  | # arch-ABC-283-mate ruling on ADR-0063 F2: (i), a structural fix. **K3: history may promote a quiet move, never demote one.** Its ordering key is max(0, h). It holds the mate floor with all three parts on, and P0 is exact. ADR-0063 stays PROPOSED. |
