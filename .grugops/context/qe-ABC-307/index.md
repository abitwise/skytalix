<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-307

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-05T14:24:45Z | decision | qe-e2e | high: a pre-registration; anchors dry-applied, plants loaded, nothing run |  | # qe-ABC-307 PREREG: A7's list, the order-independent MC1, F3's three random-half plants, and A9's method, sealed and committed before any run |
| 2026-11-05T15:03:24Z | observation | qe-e2e | high for every kill and count, as run under the PREREG; no timing read here |  | # qe-ABC-307 A7: every leg holds. The new MC1 is killed at base and tip at both parities, the twenty mutants match the Architect's matrix, F2 and F3 hold, and A5's sentinel repeats. No STOP |
| 2026-11-05T15:03:24Z | observation | qe-e2e | high for every count, as run; no timing read here |  | # qe-ABC-307 A1 to A5 and A8: the diff is the four test files, the counts are the page's, the 22 lines read as ruled, and the gates are green |
| 2026-11-05T15:21:40Z | observation | qe-e2e | high for the flags, as run; the read is void and carries no figure |  | # qe-ABC-307 A9, read 1: VOID on foreign load. Three of the 8 scored rounds are flagged, so no figure from it stands. One re-read follows, in a new output directory |
| 2026-11-05T15:27:35Z | observation | qe-e2e | high for the flags and the state table, as run; A9 is void and carries no figure |  | # qe-ABC-307: the hop STOPS at A9. Read 2 is VOID too, on one flagged round, so `NFR-008` has no graded figure here and there is no verdict. A1 to A5, A7 and A8 all hold. A void is not a miss |
| 2026-11-05T19:21:23Z | decision | qe-e2e | high: a pre-registration; arms rebuilt and compared, nothing run |  | # qe-ABC-307-a9 PREREG: A9 read again on `…b9038a14`'s void rule, after two voids. Sealed and committed before any slot poll or run |
