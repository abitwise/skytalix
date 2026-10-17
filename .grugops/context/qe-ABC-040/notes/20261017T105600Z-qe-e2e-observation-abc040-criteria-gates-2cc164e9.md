---
id: 20261017T105600Z-qe-e2e-observation-abc040-criteria-gates-2cc164e9
kind: observation
by: qe-e2e
task: qe-ABC-040
at: 2026-10-17T10:56:00Z
verified_by:
confidence: high
refs:
  - ABC-040
  - plans/tickets/ABC-040-traceability-duplicate-row-reconciliation.md
  - 20261017T105500Z-qe-e2e-observation-abc040-derived-blind-8c0b32bf
  - 20261017T115100Z-software-engineer-observation-criteria-readings-b7c2d935
supersedes:
---

# `ABC-040`: QE's readings against the SE's, then the gates and the waiver

**QE against the SE (`…b7c2d935`, page § Delivery): every figure agrees.** The pairs are L461/463 and L462/464.
The prefix is True at 2618 of 50168. `d` is 2705. The tail is 2404 characters, 2418 bytes. The formula is True and
the cell has 206 `**`. Both anchors occur once. The `grep -cF` reading is 0. 508 other rows are byte-identical and
in order. The row count is 512 → 510 → 511. The diff has three hunks. QE found no disagreement. Where QE went
further than the SE:

- the raw-cell prefix and padding check;
- the `.strip('|')` cross-check of the split;
- the test that no tail text is already in the live cell;
- the date order of the record headers, and the git corroboration of the 08-11 date;
- the scope of the remaining `NOT repaired` hits.

**Gates on tip `08bbdf2c` (QE ran them in this worktree, beside two other lanes, width 3; no timing read):**

| gate | command | result |
|---|---|---|
| lint | `npm run -s lint` | exit 0; 113 files checked, no fixes applied |
| typecheck | `npm run -s typecheck` | exit 0 |
| build | `npm run -s build` | exit 0 |
| unit | `npm test` | exit 0; 58 files and 1792 tests passed, 0 failed |
| result file | `.test-results/last-run.json` | `success` true; 1792 total, 0 pending, 0 todo, 58 `testResults` |
| skip integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |

The skip count (0) was read from the result file of the same run, not from a second run with `--reporter=json`. No
deep lane fires: no file under `src/` changed, and nothing in the puzzle-suite trigger list changed.

**Fences.** `git diff --numstat b84dc637 08bbdf2c -- src/` is empty. `git show --numstat 8d2e4f8b` names one file,
`plans/traceability.md` (+9/−13). `main` has not touched `plans/traceability.md` since `b84dc637`, and `git
merge-tree --write-tree main 08bbdf2c` exits 0 (no conflict).

**UAT-waiver reading, `b84dc637...08bbdf2c`:** `git diff --name-only b84dc637 08bbdf2c | grep -v '\.test\.ts$' |
grep '^src/'` is **empty** (the grep exits 1). The per-commit reading `<c>~1 <c>` is also 0 for both `8d2e4f8b` and
`08bbdf2c`. **The 2026-08-17 zero-production-lines waiver applies.** It waives UAT only. `Done` would mean merged
and gated, not accepted by a human.
