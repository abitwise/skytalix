<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-254-a4

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-01T17:33:08Z | decision | qe-e2e | high: written and sealed before any timed run of this hop |  | # qe-ABC-254-a4 pre-registration: the ALONE A4 re-read for ABC-254 (QE-254-a), using the method and rule of qe-ABC-254's PREREG `…6b25d0a8`, unchanged except for two items: the foreign-CPU start check and the busy-host detector the brief asks for |
| 2026-11-01T18:08:21Z | decision | qe-e2e | high on what was run; verdict UNRESOLVED because A4 is ungraded by the D3 spread rule, not because anything failed |  | # QE on ABC-254 after the ALONE A4 re-read: verdict UNRESOLVED, not PASS and not FAIL. A1, A2, A3 and A5 MET (qe-ABC-254, carried); A4 UNRESOLVED again (position-6 and the position-4 guard VOID under the D3 spread rule); QE-254-a stays BLOCKING. UAT NOT signed; merge not recommended |
| 2026-11-01T18:08:21Z | observation | qe-e2e | high: gaps named from this hop's and qe-ABC-254's readings; routes listed, not chosen |  | # ABC-254 gaps after the A4 re-read: QE-254-a stays BLOCKING (A4 UNRESOLVED twice, both reads started ALONE); QE-254-b and QE-254-c LOW carry; QE-254-d INFO (the load-attribution instrument cannot name short-lived processes) |
| 2026-11-01T18:08:21Z | observation | qe-e2e | high for the numbers as measured; A4 UNRESOLVED by the pre-registered rule (grade.mjs); post-hoc paired ratios are INFO only |  | # ABC-254 A4 re-read: UNRESOLVED by the pre-registered D3 spread rule, again. kiwipete 1.120 and start 1.105 valid (both ≥ 1.10); position-6 (10.5 % / 15.4 %) and the in-check guard position-4 (5.9 % / 6.7 %) VOID after the one re-run |
| 2026-11-01T18:08:21Z | observation | qe-e2e | high for the lock, precondition and per-run foreign-cores readings; the identity of the short-lived foreign processes is UNKNOWN - verify |  | # ABC-254 A4 re-read: admissibility and load evidence. Lock held for the whole read; started ALONE twice; within 1 min the host turned busy with short-lived foreign work (foreign cores up to 5.15) and four foreign-vitest pauses, which voided position-6 and position-4 under the 5 % rule |
| 2026-11-01T18:08:21Z | observation | qe-e2e | high: paths, commits and hashes as recorded |  | # qe-ABC-254-a4 artifacts: commits, raw logs, scripts (sha256), trees |
