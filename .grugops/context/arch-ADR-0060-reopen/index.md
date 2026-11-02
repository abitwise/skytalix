<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ADR-0060-reopen

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T15:24:16Z | decision | architect-design | high (a pre-registration: the set, bars and rule are fixed before any candidate result; the bars are quoted from ADR-0060 d8/d9 unchanged) |  | # ADR-0060 re-open: the candidate set, the bars and the selection rule, fixed BEFORE any candidate is run on main |
| 2026-11-02T15:31:14Z | decision | architect-design | high on 'no form eligible' and the bars unchanged (measured, pre-registered rule); the P3-restores-the-margin expectation is a judgement (UNKNOWN - verify) |  | # ADR-0060 re-open ruling: no form meets every bar on main, so none is written in; the bars stay; the owner question on the 27 cp cap is put with a "keep it" recommendation, because re-deriving it (to 94 cp) alone admits no form |
| 2026-11-02T15:31:14Z | observation | architect-design | high (deterministic fixed-depth and maxNodes runs on a scratch copy of main's src; the door and decision 1 reproduce arch-phase2-rebase's counts to the node) |  | # ADR-0060 re-open probe on main: none of the nine pre-registered forms meets every bar. Capping PV reductions at one ply clears A3 and A4 (a) but loses A4 (b) reach (+0.17 to +0.19 ply) and zugzwang.004; decision 1 keeps reach and zugzwang but misses the 27 cp cap and A4 (a) |
