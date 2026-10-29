---
id: 20261029T081410Z-orchestrator-decision-b1b4bb62
kind: decision
by: orchestrator
at: 2026-10-29T08:14:10Z
verified_by: 
confidence: high
refs:
  - qe-epic008-q4c
  - EPIC-008 Q4
  - orch-2026-10-29e/…647be941
  - orch-2026-10-29c/…d9513dc1
supersedes: 
seal: sha256:a22c852d707b4c3ca40877f84612b6f74614da861fd9fc0d34207962ab9acef6
---

# Paused for a host reboot (owner: new kernel). Resume point

**State at pause:**
- No games, vitest or harness processes are running.
- Queue: `pending/` holds only `qe-epic008-q4c`, which is HELD. `claimed/` is empty.
- main is clean apart from the owner's own install files, which stay uncommitted on purpose.
- main's src/data equal b5c67ab7.

**Resume (next session, Orchestrator):**
1. Read this note, `orch-2026-10-29e/…647be941` and `orch-2026-10-29c/…d9513dc1`.
2. The owner still owes his go for `qe-epic008-q4c`, with two answers:
   - (1) the width (`--concurrency` 3 about 6 h, 2 about 9 h, 1 about 18 h; each +1 h QE);
   - (2) "counts" toward M1, or "info only" (the default).
   Record the go as an owner-word note before spawning.
3. **The tool-path env file lived in the session scratchpad and does not survive the reboot.** Re-create it outside the repo from the owner's tool paths. Its variables are `CUTECHESS_CLI` and `STOCKFISH`; Stockfish is on PATH. Never write the paths into a record (ADR-0049 d4).
4. After the reboot, check the host before the reading: `npm test` 63/2 128, both tool pins `= pin` (the binaries are unchanged by a kernel update, but this is UNKNOWN - verify), idle temperature logged.

**Owner-side leftovers:** empty `~/.biome` and one npx cache dir (`…647be941`); his installer files.
