---
id: 20261013T115600Z-software-engineer-artifact-ref-merge-a11-commit-files-gates-a3a7a6f2
kind: artifact-ref
by: software-engineer
task: glyph-ABC-101
at: 2026-10-13T11:56:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-014
  - src/render.ts
  - src/render.test.ts
  - src/__snapshots__/render.test.ts.snap
  - 20261013T115000Z-ba-pm-decision-a11-folded-a9-widened-dor-10-of-10-se-qe-steps-493e3ec3
  - 20261013T112345Z-frontend-ui-artifact-ref-abc101-piece-polarity-contract-1c687529
  - 20261013T114409Z-orchestrator-decision-owner-word-abc101-swap-permanent-no-flag-cd4edd0e
supersedes:
---

# Merge, `A11` commit, files and gates for `glyph-ABC-101`

This note is hand-authored and unsealed.

- **Branch:** `grugops/ABC-101-difficulty-selection`, worktree `../wt-ticket-to-pr-ABC-101`. Not merged to
  `main`, not pushed.
- **Merge:** `main` `4a7bf64c` (carries `b5d4f47d`) merged into `98ea0a84` with `--no-ff` at **`081c3715`**.
  No rebase. There were exactly the two pre-ruled conflicts: the ticket page's end hunk and `plans/traceability.md`.
  Both were resolved by keeping both sides (see the decision note). 0 markers before `git commit --no-edit`. The merge brings
  0 `src/` lines (`git diff --stat 98ea0a84 081c3715 -- src` is empty), so `src/cli.ts` is untouched and
  `CLI_DEEP` is not re-run.
- **`A11` commit:** **`d22a709f`** (parent `081c3715`). It contains exactly three files:
  - `src/render.ts` (16 lines: `:74-75` comment, `:77-82` six pairs);
  - `src/render.test.ts` (+72 for new `A11a`–`A11c` `it`s at the end; 8 re-pins in `:316-323`'s
    Unicode literal and `:411-422` `UNICODE_BY_FEN_LETTER`);
  - `src/__snapshots__/render.test.ts.snap` (12 `unicode` bodies).
- **Records commit:** this note, its siblings, the ABC-101 § Delivery addendum and one trace row.

## Gates on `d22a709f` (the code tip; the records commit adds no code)

| gate | reading |
|---|---|
| `npm run lint` (biome) | exit 0, 113 files, no fixes |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0. 58 files, **1792 passed / 0 failed / 0 skipped** (1789 + 3 new `A11` `it`s) |
| `.test-results/last-run.json` | `success: true`, 1792 total, 1792 passed, 0 failed, 0 pending, 0 todo |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| `CLI_DEEP` | not run: the merge did not touch `src/cli.ts` |

No timing was read.
