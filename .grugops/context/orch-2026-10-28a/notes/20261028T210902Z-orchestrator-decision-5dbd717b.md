---
id: 20261028T210902Z-orchestrator-decision-5dbd717b
kind: decision
by: orchestrator
at: 2026-10-28T21:09:02Z
verified_by: 
confidence: high
refs:
  - EPIC-008
  - ABC-204
  - tools/rating/rating.ts
  - orch-2026-10-27o/…e018297c
  - qe-epic008-close
supersedes: 
seal: sha256:e0f438083c0a3ce3ed277381f594a07fc7028b4350970cc6585db2932b87e867
---

# Owner word: host move done; EPIC-008 M1 by option B

**Owner (Olger Oeselg), 2026-10-28, in session. Recorded close to verbatim; no host paths are recorded here (ADR-0049 d4):**

- The agents have moved to the new Linux host. The previous checkout is retired and nothing more runs there. main = origin/main = 4e1b3d33; all 8 kept branches are pushed.
- **EPIC-008 close: option B** from `orch-2026-10-27o/…e018297c`. Re-measure the M1 baseline sha `3497aad2` AND the close sha on THIS host. Use ABC-204 A4's protocol for both, with **E = 1 910 frozen**, 200 games each, ALONE.
- **M1 = R(close) − R(baseline)**, both read on this host. Half-width = √(Y1² + Y2²).
- The old reading of **2 061.3 ± 50.3** was taken on the previous host. It is **no longer the comparison**.
- The **+100 target** and "interval above 0" (Q1) are **unchanged**.
- Tools on this host: Stockfish 19 and cutechess-cli 1.5.1, built from cutechess commit 5e84232b. The paths were given in session and go into the environment, not the records. grugops v2.2, same plans/ layout, no --migrate. Node 26.
- Never push. Merges into main stay local; the owner pushes.

**Orchestrator plan (in the owner's order):**
1. This note plus a board line.
2. Setup check: `install --check` passes; `npm test` = 63 files / 2 128 tests on main.
3. `se-tools-rating-host` (SE): rating.ts takes the tool paths from the environment (no previous-host defaults) and re-pins the sha256 values to this host's binaries. Recorded as a dated change in ABC-204 § Dependencies. No real-clock reading.
4. `bapm-epic008-hostB` (BA/PM): a dated EPIC-008 M1 line for the host change and option B; close-path step 3 re-worded to match.
5. `qe-epic008-close` rewritten for B: two R readings (3497aad2 first, then the close sha whose src/data equal b5c67ab7). PREREG first, one run each, final. E is frozen and has no E step. A reading outside 25–75 % is reported, not acted on. M3 gates and G6 "≥ base" use 3497aad2 on this host. About 9 h ALONE.
6. After the QE verdict: BA/PM grades M1–M4 and closes EPIC-008. Then the board, the trace, and a report to the owner.

Steps 3 and 4 are independent records/tools hops and may run side by side. Step 5 spawns only after both are merged.
