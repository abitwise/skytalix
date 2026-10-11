---
id: 20261011T223313Z-qe-e2e-observation-abc152-ruling12-confirmed-qe152i-closed-f297dedc
kind: observation
by: qe-e2e
at: 2026-10-11T22:33:13Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - QE-152-i
  - src/cli.test.ts
  - 20261011T222932Z-architect-design-decision-abc152-qe152i-rulings-840a7403
  - 20261011T223136Z-software-engineer-artifact-ref-abc152-ruling12-commit-3c55b965
  - 20261011T223136Z-software-engineer-observation-abc152-ruling12-bounds-gates-1b0bdaa6
  - 20261011T222155Z-qe-e2e-observation-abc152-delta-gap-register-e0c0d051
supersedes:
---

# QE `ABC-152` ruling 12: `3c55b965` CONFIRMED against `…840a7403`. `QE-152-i` closed

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). The hop was read-only:
`git show` / `git diff` and `/usr/bin/diff` on blobs extracted to the session scratchpad. No worktree was used, no
checkout was switched, and **no tests were run** (ruling 12 owes no full re-check). The SE's gate numbers (56 / 1741,
lint exit 0) are the SE's (`…1b0bdaa6`), and QE did not re-measure them.

| check (ruling 12 / ruling 10 bounds) | evidence | result |
|---|---|---|
| Branch tip is the commit | `git rev-parse grugops/ABC-152-vitest-4-1-runner-off` = `3c55b9657a81…`; parent `5eafe95c` | yes |
| No other file | `git diff --name-only 3c55b965^ 3c55b965`: `src/cli.test.ts` only. `--numstat`: `1 1` | yes |
| Exactly line 6 replaced | `git diff -U0`: one hunk `@@ -6 +6 @@`. `/usr/bin/diff` of the full blobs: `6c6` only | yes |
| Old line 6 is the ruled "replace" text | `sed -n 6p` of the `5eafe95c` blob vs the note's first fence: `/usr/bin/diff` empty | byte-equal |
| New line 6 is the ruled text | `sed -n 6p` of the `3c55b965` blob vs the note's second fence: `/usr/bin/diff` empty; 101 bytes | byte-equal |
| Line 5 unchanged | `/usr/bin/diff` line 5 old vs new: empty; 102 bytes | yes |
| No line added or removed | 3431 lines before and after | yes |
| `expect(` count | `grep -o 'expect('`: 324 before, 324 after | 324 |
| Comment-only | line 6 is inside the leading `/** … */` block (lines 1–30) | yes |
| The new text is true | `:53` `vi.mock("./glyph-mode.ts", { spy: true })` is the file's only `vi.mock` call (the `:5` and `:1854` hits are comment text) | yes |
| UAT-waiver measurement | `git diff --name-only 91024242 3c55b965 -- src` minus `*.test.ts`: empty | unchanged |

## Gap register delta (updates `…e0c0d051`)

- **`QE-152-i`: closed.** The stale `src/cli.test.ts:6` comment now states the `glyph-mode.ts` re-route, byte-equal to ruling 12.
- `QE-152-j` (ruling 13, an ADR/risk wording change) and `QE-152-k` (the Orchestrator at merge) are not touched by this commit. They are not this hop's to close.
- No new gaps. Ruling 7: **0 cases.**

## Next

Per `…840a7403` § Next, the ticket may move `In Security/NFR`. That is the Orchestrator's board move. The branch is not merged; humans hold the merge.
