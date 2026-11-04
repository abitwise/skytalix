---
id: 20261104T170008Z-software-engineer-observation-18f84443
kind: observation
by: software-engineer
at: 2026-11-04T17:00:08Z
verified_by: 
confidence: high (git log and diff read back); sealed as an observation: an artifact-ref needs a gate run id this install cannot issue
refs:
  - se-ABC-283-merge
  - grugops/ABC-283-merge
  - grugops/qe-ABC-283
  - ABC-283
  - ABC-271
  - QE-283-i
  - QE-283-a
  - QE-283-b
  - QE-283-d
  - ADR-0063
  - ADR-0065
  - ADR-0066
  - ADR-0070
  - K0
  - K2
  - P0
  - G1
  - NFR-008
  - R-N8H-1
  - Q-N8H-1
  - R-281-a
  - R-283-LMR
  - 62151993
  - 6a93d3e9
  - 715beb1c
  - 872e5ffc
  - bc287789
  - af2b77dc
  - orch-2026-10-30a/20261104T164704Z-orchestrator-decision-2409cec9
  - orch-2026-10-30a/20261104T151305Z-orchestrator-decision-c7609f51
  - qe-ABC-283/20261104T164437Z-qe-e2e-decision-de1dc511
  - qe-ABC-283/20261104T164437Z-qe-e2e-observation-f8f8c2cc
  - qe-ABC-283/20261104T164437Z-qe-e2e-observation-3f370426
  - qe-ABC-271/20261104T162300Z-qe-e2e-decision-74da20bf
  - plans/traceability.md
  - src/evaluate.taper.test.ts
  - src/transposition.test.ts
  - src/evaluate.pawns.test.ts
  - src/evaluate.passer.test.ts
supersedes: 
seal: sha256:291a9b1f65ec6663b442d6c33661f008cedb6a0a392a1fc1b13822865d1789c1
---

# se-ABC-283-merge artifacts: branch `grugops/ABC-283-merge` (worktree `.claude/worktrees/se-ABC-283-merge`, from `grugops/qe-ABC-283` `bc287789`). Nothing pushed, nothing merged into `main`, no history rewrite, no game played, nothing left running

## Commits
- `6a93d3e9` claim the brief;
- `62151993` merge `main` `715beb1c` (no-ff), `src/` `af2b77dc`;
- then the records commit: these notes, `raw/`, the Result, the trace row, and the brief and claim moved to done/.

## Changes
- **Files by hand:** `plans/traceability.md` (the conflict, both sides kept), then the records. No `src/` file was edited by hand; every `src/` change in the merge is git's, from the two parents.
- **Tests:** none added or removed by this hop. The default lane reads 2 687 = the bundle's 2 665 + `ABC-271`'s 22 (`main` 2 672 − its base 2 650), in 71 files (70 + `src/evaluate.passer.test.ts`).
- **Production lines:** the merge carries the bundle's (`src/search.ts`, `src/engine.ts`, `src/see.ts`) on top of `main`. No UAT waiver applies; UAT is signed by QE's verdict `…de1dc511` (ruling `…2409cec9`).

## Records
- **Raw:** `raw/scripts/` holds `drv.ts` and `grade-offline.py` (copies of qe-ABC-283's v2 driver and readout, plus a K0 part), `offline.sh`, `lanes.sh`, `pairs.sh` and `seal.mjs`. `raw/out/` holds `offline/`, `lanes/`, `npm-test-pairs.txt` and `npm-test-pairs-2.txt`.
- **Arms:** out of tree, `git archive` of `main` `715beb1c` (B) and of the merge `62151993` (H), in `<scratch>`, removed afterwards. Every run under `flock <scratch>/host-test.lock`.
- **Host paths:** the lane logs had the worktree path replaced by `<worktree>`; `records-path-check.js --base main` exits 0 before the records commit.

## Next
- Orchestrator: merge `grugops/ABC-283-merge` into `main` on green (the standing ruling), run the gates on `main` after; then `arch-ABC-283-accept`, and the Security/NFR hop for R-N8H-1 (QE-283-a, `…c7609f51` 3).
