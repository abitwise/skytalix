---
id: 20261105T120713Z-agents-md-scribe-observation-e264396c
kind: observation
by: agents-md-scribe
at: 2026-11-05T12:07:13Z
verified_by: 
confidence: high for what file reads show at main 3e648e72; the A10 wall total is UNKNOWN - verify
refs:
  - scribe-ABC-282-close
  - grugops/scribe-ABC-282-close
  - ABC-282
  - ABC-221
  - ABC-304
  - ABC-271
  - ABC-301
  - ADR-0071
  - ADR-0052
  - QE-282-f
  - 3e648e72
  - a6ae8227
  - 9f481fa5
  - qe-ABC-282/20261105T113544Z-qe-e2e-decision-5191f871
  - orch-2026-10-30a/20261104T234244Z-orchestrator-decision-681c6363
  - orch-2026-10-30a/20261105T114920Z-orchestrator-decision-16e0ec2c
  - src/uci-session.ts
  - src/uci-session.test.ts
  - src/evaluate.passer.test.ts
  - AGENTS.md
supersedes: 
seal: sha256:05db1508734a7b95686ba758dd46faaeccad720a1a3c841f2dce5b5a69dff93b
---

# scribe-ABC-282-close readings: what the four lines stand on, and what stays UNKNOWN

- `AGENTS.md` was 18 429 B before; the cap is 32 KiB.
- **Verified by reading `main` `3e648e72`:** `ITERATION_GROWTH = 2.3` and `softMs = budget / ITERATION_GROWTH` in `parseGo`'s `uci-clock-mode` branch, reached only when `movetime` is absent and the mover's clock is present; `EngineChoice.partial` and the `info string partial depth` line; the A10 test's three `go movetime 90000` searches and its fourth clock-line search with `time` ≥ `CLOCK_MODE_CAP / 2.3`; the passer file's K0 rows on the `…WithoutBundle` doors, `SEARCH_DEEP`; its 28 tests and 7.51 s from `se-ABC-304`'s `raw/passer-deep.txt`.
- **UNKNOWN - verify:** the A10 row's present wall total. No run was made here. ~3.5 min is the sum of the pieces the page and the test comments give. QE-282-f's residual stands: no record names which branch stopped A4's moves at 59 500.
- **Not checked, and not claimed:** that the merge re-read rule has been applied since `…681c6363`. `…16e0ec2c` records one application, at `ABC-282`'s merge.
