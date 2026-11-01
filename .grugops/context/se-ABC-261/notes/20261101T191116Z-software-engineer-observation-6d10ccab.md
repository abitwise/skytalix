---
id: 20261101T191116Z-software-engineer-observation-6d10ccab
kind: observation
by: software-engineer
at: 2026-11-01T19:11:16Z
verified_by: 
confidence: high on the plant results as run; QE re-read owed
refs:
  - se-ABC-261
  - ABC-261
  - ABC-254
  - EPIC-010
  - ADR-0003
  - NFR-008
  - NFR-001
  - QE-254-b
  - QE-254-c
  - grugops/ABC-261
  - dd8b17ea
  - ceb28780
  - src/legal.test.ts
  - src/gameend.nfr.test.ts
  - qe-ABC-254/20261101T172756Z-qe-e2e-observation-dede949b
supersedes: 
seal: sha256:64d7132cc7b43d99be6ae2e3190a7459d209619e755f51ae9ec28fe6ab2050be
---

# ABC-261 plants (A3, A4, A5, A6): PL3a is red on the early-exit row (production 2 calls, PL3a 6); PQ2 is red on the promotion row at P1; PL1 keeps the default lane red

- **Method.** Every plant ran in a scratch copy of the tip: an rsync of the worktree's tracked and untracked files minus `.grugops/`, `memory-bank/` and `plans/`, with `node_modules` symlinked. QE's own `plant.py` from `qe-ABC-254/raw/qe-scripts/` applied each plant. No plant touched the worktree, and no plant is in any commit. Every run was under the host flock. Raw output is in `raw/plants/`.
- **A3, PL3a** (`return legalMoves(position).length > 0;` as the first line of `hasLegalMove`):
  - `src/gameend.nfr.test.ts`: **1 failed / 10 passed**. The failing row is the new early-exit row: `expected 6 to be less than or equal to 2`.
  - **Counts on the chosen board:** production **2** (probe in a scratch copy with the bar replaced: `expected 2 to be -1`), PL3a **6**. The gap is **4** (A3 needs >= 2). The bar (<= 2) sits between them.
  - `src/legal.test.ts` under PL3a: 43/43 passed, as expected.
- **A4, PQ2** (`(inCheck || pinStamp[from] === epoch)` becomes `(!inCheck && pinStamp[from] === epoch)`):
  - `src/legal.test.ts`: **1 failed / 42 passed**. The failing row is the new promotion row, on P1: `expected [ { from: 96, to: 112, … } ] to deeply equal []`. That is the untested a7-a8=Q.
  - `src/gameend.nfr.test.ts` under PQ2: 11/11 passed.
- **A5, PL1** (`hasLegalMove` → `fullHasLegalMove`, `legalCaptures` → `fullLegalCaptures`), full `npm test`: **red**. These rows failed:
  - "hasLegalMove on the start position plays NO move";
  - "legalCaptures on kiwipete plays none of the pseudo-legal captures".
  - This is the same red as at `qe-ABC-254`.
  - **Scratch-copy artifact, disclosed:** `tools/grugops/qe-hop-integrity.test.ts` also failed (11 rows). It reads `.grugops/context/`, which the scratch copy leaves out; at the tip it passes. The first PL1 run also lacked `plans/uat/EPIC-006-game-1.pgn` (pgn.test.ts failed on load). That file was copied in for the second run, which is the one reported.
- **A6:** the plants were read out of tree. QE's re-read of A3–A5 is owed.
