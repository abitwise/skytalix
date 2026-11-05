<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: se-ABC-305

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-05T12:34:10Z | decision | software-engineer | high: a pre-registration; sealed before any timing run; nothing measured yet |  | # PREREG, se-ABC-305: `ABC-305` A5, the `N8-LANE` read. Sealed and committed before any timing run |
| 2026-11-05T12:40:15Z | observation | software-engineer | high: read from the harness's files; the read itself is void and grades nothing |  | # se-ABC-305: the `N8-LANE` read is **VOID, not ALONE. All 8 scored rounds are flagged.** Under the PREREG and the brief it grades nothing, gets no re-read here, and the hop STOPS |
| 2026-11-05T12:40:34Z | observation | software-engineer | high: each line read by its command at 158bb992 |  | # se-ABC-305: the branch at the stop. Scope 1 and 2 done; A1, A2 and A3 proven at `158bb992` |
| 2026-11-05T22:05:19Z | decision | software-engineer | high: a pre-registration; sealed before any poll or timed run; nothing measured |  | # PREREG, se-ABC-305-main: `ABC-305` A5, the `N8-LANE` re-read on the new base. Sealed and committed before any poll. No timed run in this hop |
| 2026-11-05T22:06:16Z | observation | software-engineer | high: each line read by its command or from its JSON report at 9f0048de; A5 is not read |  | # se-ABC-305-main readings: `main` is in, A1 to A3 hold again, every gate and deep lane reads green by count. The read is not taken |
