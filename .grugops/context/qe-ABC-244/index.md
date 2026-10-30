<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-244

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30T23:07:42Z | decision | qe-e2e | high: A6, A7, A8, A9, A10 run in this hop as pre-registered; A3-A5 spot-checked |  | # QE on `ABC-244` at `25282ad4` (base `d59e3194`): **PASS.** A6, A7, A8, A9 MET; A10 green; A3–A5 spot-checked. `NFR-008` MET on H at 9.25 s, under the 9.4 s design target, so tranche 2 does not fire |
| 2026-10-30T23:07:42Z | observation | qe-e2e | high: ALONE, wait-clear by PID, n = 8 (A8) and 3 per arm (A9), admissible; G8 is one window |  | # `ABC-244` A8 and A9 as run, ALONE: `N8-LANE` MET (H−B CPU −1.145 s) and `G8` H 9.25 s (B 9.69 s), `NFR-008` MET and under the 9.4 s design target |
| 2026-10-30T23:07:42Z | observation | qe-e2e | high: parity and census run at both trees on a list frozen before any head run |  | # `ABC-244` A6 and A7 as run: kill-set parity on 24 frozen mutants (0 U1 rows differ) and the node census (−791 075 nodes, every U1 row fewer) |
| 2026-10-30T23:07:42Z | observation | qe-e2e | high on what was run; QE-244-c other-file coverage UNKNOWN - verify |  | # `ABC-244` QE findings: SE-244-a ruled (CONFIRMED and widened, LOW); five INFO. None blocks |
| 2026-10-30T23:07:48Z | observation | qe-e2e | high: files listed are committed on grugops/qe-ABC-244 (an observation, not an artifact-ref: no §14-gate run to bind) |  | # `ABC-244` QE artifacts: scripts, raw readings and commands (`.grugops/context/qe-ABC-244/raw/`) |
