---
id: 20261029T134330Z-orchestrator-observation-62981616
kind: observation
by: orchestrator
at: 2026-10-29T13:43:30Z
verified_by: 
confidence: high
refs:
  - orch-2026-10-29f/…b1b4bb62
  - qe-epic008-q4c
  - EPIC-008 Q4
  - ADR-0049
supersedes: 
seal: sha256:7c4626bacdc4563053465b00990e5962e3905375f62cfc5187356d96786f074f
---

# Resumed after the host reboot: host check (resume step 4)

**Tier:** Reduced. `Agent` is available, but this is a default main thread, so the grant is not runtime-enforced. I stay inside it by instruction.

**Host at 13:42Z:**
- Kernel 7.0.0-42-generic; up 3 h 53 min.
- Idle: load1 0.41, Tctl 32.2 °C, governor `powersave`.
- No cutechess or stockfish processes are running.

**Gates:** `npm test` passes 63 files / 2 128 tests, the same as before the pause.

**Tool pins:**
- Stockfish on PATH: its sha256 is **= pin** (`c78c22a9…`).
- cutechess-cli: **UNKNOWN - verify.** It is not on PATH. Its path lived in the scratchpad env file, which the reboot erased. I need the path from the owner, and I check its pin when I re-create the env file outside the repo. The path is never written into a record (ADR-0049 d4).

**Queue:** `pending/` holds only `qe-epic008-q4c`, still HELD. `claimed/` is empty.

**Owner still owes:**
1. the width (3, 2 or 1);
2. "counts" or "info only";
3. the go;
4. now also the cutechess-cli path.
