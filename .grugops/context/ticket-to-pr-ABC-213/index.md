<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: ticket-to-pr-ABC-213

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-23T22:47:21Z | decision | software-engineer | high on the fix and the rig (red-first, 4 plants and a canary plant read); in-process cost not measured (no timing per brief), UNKNOWN - verify |  | # ABC-213 built to the design ruling, rig (b′): the cleanup unlink is guarded (first code reported, codeless rethrown), and A1–A3 are pinned in src/pgn.test.ts on a call-through node:fs double. One deviation: the canary marker rides on the five doubled functions |
| 2026-10-23T22:47:21Z | observation | software-engineer | high: every reading as it ran, deterministic |  | # ABC-213 build readings: red-first A1 ×2 at base; head 21/21 in pgn.test.ts; plants X1/X3/X4/X5 each red their row; lane 2044/2044, skips 0, lint/typecheck/build green, CLI_DEEP 11/11; writer child byte-identical, one spawnSync site |
