<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-254-a4v2

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-01T18:57:29Z | decision | qe-e2e | high: written and sealed before any timed run of this hop, after the D3-V2 addendum |  | # qe-ABC-254-a4v2 pre-registration: a fresh ALONE A4 read for ABC-254 under ADR-0055 D3-V2 (discard dirty pairs, never force; foreign cores ≤ 0.8; first 5 admitted pairs per board; cap 15 attempts; VOID-LOAD; agreement guard). Bars unchanged |
| 2026-11-01T19:02:38Z | observation | qe-e2e | high: gaps named from this hop's and qe-ABC-254's readings |  | # ABC-254 gaps after the D3-V2 read: QE-254-a CLOSED (A4 MET under D3-V2); QE-254-b and QE-254-c LOW carry (test-only); QE-254-d INFO carries (QE's instrument) |
| 2026-11-01T19:02:38Z | observation | qe-e2e | high for the lock, precondition and per-run readings; one disclosed cat during the job |  | # The A4 read's window, lock and load: ALONE start at 18:57:51Z (0 vitest, 0 cutechess, 0 hot processes, load1 0.46, Tctl 36 °C); lock held 18:57:48–19:00:43Z; 21 attempts, 20 admitted, 1 discarded (a foreign `claude` process, foreign cores 1.05); no gate pause; no SHARED label |
| 2026-11-01T19:02:38Z | observation | qe-e2e | high for the numbers as measured; A4 MET by the pre-registered D3-V2 rule (grade.mjs), no hand grade |  | # ABC-254 A4 under ADR-0055 D3-V2: MET. All four boards valid on the main schedule with no re-run owed. kiwipete 1.112, position-6 1.120, start 1.106 (the bar: ≥ 1.10 on two, ≥ 1.00 on the third; all three clear 1.10); position-4 guard 1.095 (≥ 0.97). Agreement guard holds on every board |
| 2026-11-01T19:02:45Z | decision | qe-e2e | high: verdict from grade.mjs under the sealed PREREG; A1-A3, A5 carried from qe-ABC-254 |  | # ABC-254 QE verdict: PASS_WITH_GAPS. A4 is MET under ADR-0055 D3-V2 on a fresh ALONE read (kiwipete 1.112, position-6 1.120, start 1.106; position-4 guard 1.095; all boards valid with no re-run). A1, A2, A3 and A5 are MET, carried from qe-ABC-254. QE-254-a closed; QE-254-b/c LOW and QE-254-d INFO carry |
| 2026-11-01T19:02:45Z | observation | qe-e2e | high: paths, commits and hashes as recorded (observation: an artifact-ref needs §14-gate provenance this hop has not got) |  | # qe-ABC-254-a4v2 artifacts: branch, commits, scripts, raw files and hashes |
