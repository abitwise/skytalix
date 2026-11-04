<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: secnfr-ABC-302-a9

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04T20:37:37Z | decision | security-nfr | high on R-N8H-1's level (a pre-set one-sided mark) and on the Q-N8H-1 record; medium on the budget advice, which rests on the 0.45 rate and the 76 % forecast from one ticket; no level, bar, test or config moved |  | # Security/NFR decision, secnfr-ABC-302-a9 (`ABC-302` A9): **PASS_WITH_RISKS.** `R-N8H-1` **stays MEDIUM**: 9.505 s is not below 9.5 s. `Q-N8H-1` is recorded as (a). **Advice: hold ABC-282 and ABC-301 at ≤ +0.10 s, do not tighten the wall number, and expect one further row move of at least −0.11 s. Bundle 1 needs a budget: ≤ +0.10 s for the bundle as a whole** |
| 2026-11-04T20:37:37Z | observation | security-nfr | high on every timing (QE's graded A8 or an earlier sealed reading) and on the git and find reads made here; the row leads are UNKNOWN - verify: no census of main after ABC-302 exists; nothing run |  | # Security/NFR observation, secnfr-ABC-302-a9: QE's graded A8 against `R-N8H-1`'s marks. H's median **9.505 s** is on the upper side of 9.5 s by 0.005 s; headroom is 0.495 s on the median and 0.45 s at the interval top, both inside the 0.3–0.5 s spread. The reading holds for `main` as merged. Below it, the arithmetic for the lane budgets |
