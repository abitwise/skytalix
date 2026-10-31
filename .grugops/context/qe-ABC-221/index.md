<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-221

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-31T06:09:35Z | decision | qe-e2e | high: A1-A12, plants, oracle, census, deep lanes, probe and G8 run in this hop as pre-registered (PREREG 6d7f2c24); post-PREREG deviations marked |  | # qe-ABC-221 verdict: PASS_WITH_GAPS at `c48a6f83` (base `d58f2d77`). A1–A12 MET. 21/21 plants as pre-registered. Oracle 78 717 / 0 FAIL. `G8` H 9.84 s ≤ 10 (tranche 2 fires on the raw median, on a slowed host). One LOW and two INFO; none blocks. This verdict signs UAT |
| 2026-10-31T06:09:35Z | observation | qe-e2e | high: files listed are committed on grugops/qe-ABC-221 (an observation, not an artifact-ref: no §14-gate run to bind) |  | # `qe-ABC-221` artifacts (committed on `grugops/qe-ABC-221` under `.grugops/context/qe-ABC-221/`) |
| 2026-10-31T06:09:35Z | observation | qe-e2e | high on what was run; severities per PREREG section 10; none blocking |  | # `ABC-221` QE findings and handoffs: QE-221-a LOW (two survivors in the mode, test-only), QE-221-b INFO (a stale `levels.ts` comment D8 fences), QE-221-c INFO (host: a foreign orphan process during the ALONE window); SE-221-a confirmed; none blocks |
| 2026-10-31T06:09:35Z | observation | qe-e2e | high for gates, deep lanes and the probe (all run once); G8 measured as stated but confounded by a foreign orphan process (QE-221-c), so the absolute median is high by about 0.4 s, UNKNOWN - verify on a clean host |  | # `ABC-221` gates, deep lanes, A14b probe and `G8` at head `c48a6f83` (base `d58f2d77`): A7, A10 and A11 MET; `G8` H 9.84 s (B 9.82 s, +0.02 s), A9 MET (≤ 10 s); tranche 2 FIRES on the raw median (> 9.6 s), on a host QE-221-c slowed |
| 2026-10-31T06:09:35Z | observation | qe-e2e | high: 21 plants, whole default lane each, on a scratch tree; all as pre-registered |  | # `ABC-221` QE plants: 21 of 21 as pre-registered; every REQUIRED red held; 2 survivors (HSCM, CLOCKWINSCM), both predicted, both caught by QE's oracle |
| 2026-10-31T06:09:35Z | observation | qe-e2e | high: plain-node oracle against the real base and head trees, 78 717 checks 0 FAIL; census and SE-221-a by replay and arithmetic |  | # `ABC-221` QE oracle, A8 fence, R1 census and SE-221-a at head `c48a6f83` (base `d58f2d77`): oracle 78 717 checks, 0 FAIL; fence MET; census confirmed; SE-221-a confirmed |
