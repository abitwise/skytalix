---
id: 20261012T153500Z-security-nfr-artifact-ref-branch-files-gates-d6f2b944
kind: artifact-ref
by: security-nfr
task: secnfr-ABC-095-s3
at: 2026-10-12T15:35:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ADR-0036
  - ADR-0037
  - 20261012T151900Z-security-nfr-observation-s3-readings-clause-b-items-2-8-cwd-children-c24fec8e
  - 20261012T153000Z-security-nfr-decision-s3-result-pass-with-risks-qe095a-qe095e-ruled-b65b11b7
supersedes:
---

# Branch, files and gates

This note is hand-authored and unsealed.

- **Branch.** `grugops/secnfr-ABC-095-s3`, in worktree `../wt-secnfr-ABC-095-s3`, off the QE tip `e1444f23`.
  It is not merged and not pushed. `node_modules` is symlinked at the worktree root only.
- **Ruling commit `aa6ae39c`:**
  - `ADR-0036`: `#### S3 reading — 2026-10-12`, appended at the end of § S1;
  - `ADR-0037`: a dated pointer in § Status;
  - the `ABC-095` page: `## Security/NFR`, appended at the end;
  - `plans/traceability.md`: one row, at the end;
  - notes `…c24fec8e` (the readings) and `…b65b11b7` (the decision);
  - `probe/`: `clause-b.out.txt`, `ruling2-by-hand.out.txt`, `s3-items-2-6.out.txt`,
    `s3-items-7-8.out.txt`, `qe095a-cwd-children.out.txt`, and `cwd-children.mjs` (the child script,
    copied from the scratchpad; it takes the scratch root as its argument).
- **This note** is in the next commit, which holds notes only.
- **What is not touched:**
  - `src/`, `tools/`, tests, `plans/board.md` and `AGENTS.md`;
  - `plans/nfr-catalog.md`: no security row moves;
  - the SE's and QE's worktrees.
- **Gates on the tree of `aa6ae39c`,** run before the commit (load1 2.81):
  - `npm run -s lint`: exit 0. Biome checked 112 files and applied no fixes.
  - `npm run -s typecheck`: exit 0.
  - `npm run -s build`: exit 0.
  - `npm test`: exit 0. 58 files; 1780 passed, 0 failed. `.test-results/last-run.json` has
    `success: true`, with `numPendingTests` 0 and `numTodoTests` 0.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
- **Plants.** P6b ran in a scratch `git archive 2307fc11` outside the repository, in the session
  scratchpad. That directory held 0 entries before and 4 during the probe. It was removed by its exact path
  and holds 0 after. No clock was read.
- **Queue.** The claim was taken by a bare `mkdir` of `.grugops/queue/claimed/secnfr-ABC-095-s3` in the main
  checkout. The flat `done` records are written there, uncommitted, and the claim directory is removed.
