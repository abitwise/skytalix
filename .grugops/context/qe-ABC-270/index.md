<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-270

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04T00:19:24Z | decision | qe-e2e | high: sealed before any QE timing of the build; bars copied from the ticket's K3 / K4 and ADR-0068 d6 / F2 as written, none loosened; instrument is qe-ABC-274's PREREG (P arm removed) and qe-ABC-268's g6 scripts unchanged, Tctl 60.0 kept |  | # qe-ABC-270 PREREG, sealed before any QE timing of `ABC-270`'s build: K3 (`G2`) in two sessions, one process each, in `ABC-274`'s form (`ADR-0067` d8's A5 instrument: two sessions, reverse order, a `main`-copy control); and K4 (`G6`, graded "≥ base", every run at depth ≥ 6). MET iff R ≤ 1.0500 unrounded. No bar moved; a miss is `ADR-0068` F2 and is never re-played |
