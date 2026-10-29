---
id: 20261029T135200Z-orchestrator-decision-21444ff1
kind: decision
by: orchestrator
at: 2026-10-29T13:52:00Z
verified_by: 
confidence: high
refs:
  - qe-epic008-q4c
  - EPIC-008 Q4
  - orch-2026-10-29c/…d9513dc1
  - orch-2026-10-29g/…62981616
  - qe-epic008-close/…f361ab33
supersedes: 
seal: sha256:39007a9d6bb73179c79af57b5a20ad55064bbcd6baaad4f8af3018740b60b826
---

# Owner word: Q4 (c) width = 1

**Owner (Olger Oeselg), 2026-10-29, in session:** "set width 1"

**Context he had:**
- The R readings on this host ran at width 2, with peaks of 87 and 84 °C (QE `…f361ab33`).
- D defaults to width 3 (6 engine processes).
- Width 1 takes about 18 h for 400 games, plus about 1 h for QE.

**Recorded:** for `qe-epic008-q4c`, C = **1**, so the run takes `--concurrency 1`. QE confirms that `machine.txt` shows width 1.

**Still owed (HELD until all are given):**
1. "counts" or "info only" (default: info only, M1 not re-graded);
2. the explicit go;
3. the cutechess-cli path for the env file, which stays outside the repo and out of every record.

This note is not a go.
