---
id: 20261104T151148Z-software-engineer-observation-6fdd5bf3
kind: observation
by: software-engineer
at: 2026-11-04T15:11:48Z
verified_by: 
confidence: high (git log and diff read back); sealed as an observation: an artifact-ref needs a §14-gate run id this install cannot issue
refs:
  - se-ABC-283-k3
  - grugops/ABC-283
  - ABC-283
  - ADR-0063
  - ADR-0066
  - ADR-0064
  - K3
  - F2
  - P0
  - G1
  - R-283-LMR
  - R-281-a
  - NFR-008
  - R-N8H-1
  - arch-ABC-283-mate
  - 05ef9fc9
  - c8e90c3c
  - orch-2026-10-30a
  - 6c6fb0be
  - 3922394e
  - 9e81db85
  - ab0a37b6
  - 09694a4e
  - src/search.ts
  - src/search.bundle.test.ts
supersedes: 
seal: sha256:8a67d20b19308b8c30a4f115d800378c6edcd41fd5c91ef5d705ff976908a6b5
---

# se-ABC-283-k3 artifacts: branch `grugops/ABC-283` (worktree `.claude/worktrees/se-ABC-283`). Nothing pushed, nothing merged into main, no history rewrite, nothing left running.

## Commits
- `5f35a832` claim the brief;
- `3922394e` merge `grugops/arch-ABC-283-mate` (no-ff);
- `9e81db85` feat: K3, `src/search.ts`, 1 production line plus comments;
- `ab0a37b6` test: `src/search.bundle.test.ts`, the three re-pins;
- then the records commit: these notes, `raw/`, the Result, the trace row, and the brief and claim moved to done/.

## Changes
- **Files:** `src/search.ts`, `src/search.bundle.test.ts`.
- **Tests:** none added or removed (2 665 default). The order row gained one negative-equals-zero assertion block.
- **Production lines:** the UAT waiver does **not** apply, so QE's verdict signs UAT.

## Records
- **Raw:** `raw/scripts/` holds floor.ts, rest.ts, lifetime.ts, iter.ts, lanes.sh, time-pairs.sh and seal.mjs; `raw/out/` holds the readings.
- **Base tree for timing:** a detached scratch worktree at `09694a4e`, removed afterwards.

## Next (Orchestrator ruling `…6c6fb0be`)
- ABC-283 → In Review → `qe-ABC-283`: the PREREG, then the single 100-game read at 100 ms, GAIN ≥ 50.0, plus `…3851bf43`.
- The PR lists the order-row re-pin old → new, and re-pins 2 and 3 (decision note).
- R-283-LMR is carried.
