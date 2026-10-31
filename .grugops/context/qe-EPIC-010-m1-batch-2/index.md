<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-EPIC-010-m1-batch-2

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-31T07:41:09Z | decision | qe-e2e | high (written and sealed before any game or engine search in this hop; base re-derived in git; levels 5/6 read at both SHAs; pair-check and the exact command's dry run re-run by QE) |  | # qe-EPIC-010-m1-batch-2 pre-registration: one 400-game interleaved R pair (200 + 200) at `Skill Level` 6 (4 000 ms both sides), `--concurrency 1`, ALONE. Base `ca6e675c`, head `51902be5` (main at spawn). Verdict LOSS iff X + Y < 0 |
| 2026-10-31T08:32:12Z | observation | qe-e2e | high: read from the watcher log, the tool's out-dir and ps; the runner's tear-down is inferred from exit 147 = 128 + SIGSTOP and the tree vanishing within 17 s of the SIGSTOP |  | # qe-EPIC-010-m1-batch-2 run 1 is VOID at 48 min (14 games of block 01 base). The watcher's thermal pause (SIGSTOP) was seen by the background-task runner that had launched the harness, and the runner tore the harness's process tree down. Per the PREREG (VOID, ≤ 2 h) the pair is re-run once, fresh out-dir, same command, with the harness launched detached (QE-M1B2-b) |
