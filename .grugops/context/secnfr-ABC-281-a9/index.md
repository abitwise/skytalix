<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: secnfr-ABC-281-a9

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04T04:20:47Z | decision | security-nfr | high: ruled on the observation above; no level, bar, test or config moved; R-281-a run frequency stays UNKNOWN - verify |  | # Security/NFR decision, secnfr-ABC-281-a9 (`ABC-281` A9): **PASS_WITH_RISKS.** `R-N8H-1` is **carried and downgraded, MEDIUM → LOW**: its condition is discharged on the graded median but has only a 0.08–0.28 s margin. `R-N8H-2` and `R-N8H-3` are unchanged. `R-281-a` is carried at LOW; Architect/Design owns the deep-lane run-frequency rule it lacks. `Q-N8H-1` stays held |
| 2026-11-04T04:20:47Z | observation | security-nfr | high: every timing is QE's graded A8 or an earlier sealed Security/NFR reading; the lane-input diff and note count were read here with git and find; nothing run |  | # Security/NFR observation, secnfr-ABC-281-a9: the risk states on QE's graded A8. Headroom on `NFR-008` is now 0.58 s on H's median (0.49 s at the interval top), against a 0.3–0.5 s window spread. The reading holds for `main` as merged, because no lane input changed after `ea08d7b6` |
