by: security-nfr (claude-opus-5-5)
at: 2026-10-11T16:52:00Z
task: secnfr-ABC-151-window

completed_at: 2026-10-11T19:18:01Z
result: ABC-151 window run in ADR-0040 addendum 2's fixed step order (135 harness runs + 9 lanes, width 1 for this factory, 0 harness errors), after a 22 min 27 s settle wait. PASS_WITH_RISKS, no required fixes. A3 MET (warm 9.265 s; owed cooled 9.375 s; cooled binds, f 1.023). A4 MET (-9.07 %, interval -11.25..-7.81 %). A5 to the owner: k = 2 first level >= 1 at run 5 vs k = 3 at run 6, 45 vs 43 of 54 reads, both reached level 2 (28 reads each); k = 2 did not heat later or less. Lanes 8/8 exit 0 at head, counts = QE's base. Another project's test runner (a separate session) was present for parts of A5, cooled and lanes (RISK-ABC151-FOREIGN). Notes …fcf66342 (grades), …78a8c8ea (readings), …363fc14c (heat), …2983f397 (method). Branch grugops/ABC-151-two-test-workers. Not merged, not pushed, no board move.
commit: 1980d71a
