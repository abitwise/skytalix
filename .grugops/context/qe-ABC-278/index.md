<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-278

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-03T15:48:32Z | decision | qe-e2e | high (every row re-run by QE under the host lock with QE's own run-time fixtures, CLI spawned with no seam, red baseline on main's check; verdict and severities are QE's judgement) |  | # QE verdict on ABC-278 (records path check hardened): PASS_WITH_GAPS. A1–A10 MET on an independent re-run; gaps LOW/INFO only, none an AC miss. QE's verdict signs acceptance (Test note 4: no UAT) |
| 2026-11-03T15:48:32Z | observation | qe-e2e | high on the facts (run and counted); severities and owners are QE's judgement |  | # QE gaps for ABC-278: QE-278-a LOW (shape d false-positive surface wider than named), QE-278-b LOW (residual foreign-argv misses, one not named), QE-278-c INFO (non-UTF-8 / compressed-under-another-name records). None blocks the merge |
| 2026-11-03T15:48:32Z | observation | qe-e2e | high (commands as run 2026-11-03 under the host lock) |  | # QE runs for ABC-278: commands, fixtures and outputs as run 2026-11-03 under the host lock |
