---
id: 20261101T152325Z-software-engineer-observation-d672f92e
kind: observation
by: software-engineer
at: 2026-11-01T15:23:25Z
verified_by: 
confidence: high: branch, commit and commands as run
refs:
  - se-ABC-254
  - ABC-254
  - EPIC-010
  - ADR-0003
  - ADR-0055
  - ADR-0020
  - NFR-005
  - NFR-009
  - NFR-008
  - NFR-001
  - grugops/ABC-254
  - 600d8de3
  - 09d1f675
  - src/legal.ts
  - src/legal.test.ts
  - src/gameend.nfr.test.ts
supersedes: 
seal: sha256:90e71861f48c187c78667bc34a145f877ee95b2a035c50e80d920a1d8648d98a
---

# ABC-254 artifacts

*Published as an `observation`: the admission server refuses an `artifact-ref` without `sha` / `gate_run` / `content_hash`, and no §14 gate run exists for this hop yet (se-ABC-248 precedent: no artifact-ref).*

- **Branch:** `grugops/ABC-254` (worktree `.claude/worktrees/se-ABC-254`), from `main` 09d1f675. Nothing was pushed or merged.
- **Code commit:** 600d8de3, "feat(ABC-254): lazy legality …".
- **Files:**
  - `src/legal.ts`: the lazy filters, plus the full filters renamed `full*` as oracle and fallback.
  - `src/legal.test.ts`: A1 lane and deep rows, A2 rows.
  - `src/gameend.nfr.test.ts`: two call-count bars tightened 1→0 and 8→0 (see the deviation note).
- **Commands run, all under `flock …/host-test.lock`:**
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`;
  - `NODE_OPTIONS=--max-old-space-size=400 vitest run src/legal.test.ts` (also with `ENGINE_DEEP=1 -t ABC-254`);
  - `PERFT_DEEP=1 vitest run src/perft.test.ts`;
  - `node tools/grugops/lane-inventory.js`; `test-skip-integrity.js --skip-count 0`;
  - the nps read in `raw/nps.sh`.
- **Docs:** the header and comment blocks in `src/legal.ts`. No ADR, NFR or board edits.
- **Remaining, not SE work:**
  - QE's A4 graded speed reading, alone, with a sealed pre-registration;
  - G1 (PUZZLE_DEEP), G4 out-of-tree identity, G5, G6, the formal G8 and G9;
  - UAT, signed by the QE verdict.
