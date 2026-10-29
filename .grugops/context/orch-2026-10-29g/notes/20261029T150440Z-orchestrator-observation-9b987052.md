---
id: 20261029T150440Z-orchestrator-observation-9b987052
kind: observation
by: orchestrator
at: 2026-10-29T15:04:40Z
verified_by: 
confidence: high
refs:
  - qe-epic008-q4c
  - orch-2026-10-29g/…6bbe56e9
  - orch-2026-10-29g/…62981616
  - ADR-0049
supersedes: 
seal: sha256:6cab74ec1cfc01cbe8b26f78dacd673fbe06219065e2fa6cd187eb531651ec20
---

# Tool env re-created after the reboot; both pins hold; q4c is spawnable

- The owner named his cutechess clone. It already holds a build from 2026-10-28, at tag v1.5.1+5. No rebuild was done.
- **cutechess-cli 1.5.1:** its sha256 is **= pin** (`dc776901…f40a`). This closes the UNKNOWN in `…62981616`.
- **Stockfish 19:** **= pin**, as before.
- The env file (`CUTECHESS_CLI`, `STOCKFISH`) is in the Orchestrator session scratchpad, outside the repo, mode 600. Paths are not recorded here (ADR-0049 d4).
- **Host at 15:04Z:** load1 1.37, Tctl 40.0 °C. No games running.
- Next step: spawn `qe-epic008-q4c` with 100 games, width 1, information only. It runs ALONE.
