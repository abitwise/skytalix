---
id: 20261103T125740Z-software-engineer-observation-a11e7540
kind: observation
by: software-engineer
at: 2026-11-03T12:57:40Z
verified_by: 
confidence: high (commit hash and diff stat read from git; commands as run); published as observation: artifact-ref needs a §14 gate_run this hop does not have
refs:
  - se-ABC-274
  - grugops/ABC-274
  - ABC-274
  - EPIC-011
  - E2-pre
  - ADR-0067
  - ADR-0064
  - F8
  - C1
  - P5
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - A8
  - A9
  - B0
  - G2
  - G3
  - G6
  - NFR-009
  - 128e3c6c
  - 54dee3f2
  - c131ecd0
  - src/evaluate.ts
  - src/evaluate.taper.test.ts
  - src/evaluate-params.ts
  - arch-fold-1103b/e16881f5
  - se-ABC-269-cut/20261103T112851Z-software-engineer-decision-8e00e712
supersedes: 
seal: sha256:48acc538b583441aa9bf37fa83ece5a2c9c2cc0a29a6d3291c7a6a4e1fde73a7
---

# se-ABC-274 artifacts: branch `grugops/ABC-274`, code commit `c131ecd0`. Two files: `src/evaluate.ts` (packed blend, loader, test-only seam) and `src/evaluate.taper.test.ts` (A3 and A9 rows). `src/evaluate-params.ts` byte-unchanged. Not pushed or merged; the merge is human and waits on owner acceptance of ADR-0067

- **Branch:** `grugops/ABC-274`, worktree `.claude/worktrees/se-ABC-274`, from `main` `128e3c6c` (src = `54dee3f2`'s).
- **Code commit:** `c131ecd0`, "feat(ABC-274): E2-pre …". Diff stat: `src/evaluate.ts` +192 / −117, `src/evaluate.taper.test.ts` +338 / −1.
- **New exports (test-only):** `withParametersForTest(parameters, run)` and `type EvaluationParameters`. No production caller.
- **Tests added:** `src/evaluate.taper.test.ts`, "ABC-274 A3 — the blend is live for every term family" (17 rows) and "ABC-274 A9 — the packed sums fit in int16" (2 rows).
- **Commands, each under `flock …/host-test.lock`:**
  - `npm test` (before and after);
  - `NODE_OPTIONS=--max-old-space-size=128 npx vitest run <4 evaluate files>`;
  - `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/evaluate.taper.test.ts`;
  - `node raw/scripts/b0.ts <tree>` (×2);
  - `node raw/scripts/xbuild.ts <cand> <base>`;
  - `node raw/scripts/a2.ts <cand> <base>`;
  - `raw/scripts/deep.sh <tree> <out>` (candidate, then a detached head worktree, which was removed afterwards);
  - `npx tsc --noEmit`, `npx biome check .` (clean).
- **Environment note:** the worktree had no `node_modules`. A symlink to the main checkout's `node_modules` was added. It is git-ignored, and without it `src/cli.test.ts`'s vitest-version row fails with ENOENT.
- **Outputs:** `raw/out/`: `b0-cand.out`, `b0-base.out`, `xbuild.out`, `a2.out`, `npm-test.txt`, `deep-cand-exits.txt`, `deep-base-exits.txt`, `deep-report-lines.txt`.
- **Records:** board ABC-274 In Development → In Review. The outgoing line is archived in `plans/tickets/history/ABC-274-board-history.md`. There is a trace row in `plans/traceability.md`, and the queue brief and claim are in `done/`.
