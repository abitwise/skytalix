---
id: 20261012T205300Z-software-engineer-artifact-ref-merge-code-commit-gates-4822a352
kind: artifact-ref
by: software-engineer
task: resume2-ABC-101
at: 2026-10-12T20:53:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-086
  - ABC-065
  - src/cli-options.ts
  - src/cli.ts
  - src/level-seam.ts
  - src/cli.test.ts
  - src/cli.real-engine.test.ts
  - src/engine.test.ts
  - 20261012T204500Z-ba-pm-decision-six-rulings-a5i-repinned-a9-widened-dor-10-of-10-f4a8b6ee
  - 20261012T220000Z-software-engineer-observation-stop-merge-conflict-ticket-page-5c1e0a77
supersedes:
---

# Merge, code commit, files and gates for `resume2-ABC-101`

This note is hand-authored and unsealed. Timestamps are the host's `date -u` at writing; the earlier
`resume-ABC-101` note carries 22:00Z, which is later than this hop's clock. The order of events is the
commit order, not the stamps.

- **Branch:** `grugops/ABC-101-difficulty-selection`, worktree `../wt-ticket-to-pr-ABC-101`. Not merged to
  `main`, not pushed. No rebase, reset, amend, force or `update-ref`.
- **Merge (step 1):** `git merge --no-ff main` at branch `18dcc87c`, `main` `3ea3e352` (merge-base `f0bd27f7`).
  Exactly the two named conflicts, one hunk each:
  - `plans/traceability.md`: both ABC-101 rows kept, branch's "build, STOPPED" first, then main's BA/PM
    "amendment" row. Checked: resolved file = stage 2 + stage 3's last line, `cmp` 0.
  - `plans/tickets/ABC-101-difficulty-selection.md`, end-of-page hunk: the branch's `## Delivery` (20:35Z)
    whole, then main's `## Amendment — 2026-10-12` (20:45Z) whole. The only addition beyond the two
    sections is one blank separator line between them. Checked against stage 3 with `/usr/bin/diff`: 30
    added lines (29 `## Delivery` lines + 1 blank), 0 removed.
  - 0 conflict markers in both files. Merge commit **`e88a7832`** (`--no-edit`, git's default message, so it
    carries no `Co-Authored-By:` trailer; not amended, per the fence).
- **Probe diff (step 2):** sha256 `7ee587c7…aecc74` as recorded; `git apply --check` clean; `git apply` clean.
- **Code commit (steps 3-4): `ac8deab1`**, one commit, code and tests. `git diff --numstat e88a7832 ac8deab1`:
  `src/cli-options.ts` +31 −1, `src/cli.real-engine.test.ts` +45, `src/cli.test.ts` +217 −14,
  `src/cli.ts` +13 −7, `src/engine.test.ts` +22 −2, `src/level-seam.ts` +21 (new). Nothing else.
  - Beyond the probe diff: the four (i′) assertions in `src/engine.test.ts` (and two import lines), and one
    comment line in `src/cli.test.ts`'s `ABC-042` `A8` row, now two lines, naming `32` as the seed's
    exponent and the reused base `2` (the old "NONE of the six" line was left untouched; the added line
    says seven).
- **Gates at `ac8deab1`'s tree** (run before committing, tree unchanged after):
  - `npm run -s lint`: exit 0, 113 files, no fixes. `npm run -s typecheck`: exit 0. `npm run -s build`: exit 0.
  - `npm test`: **exit 1**. 58 files (57 passed, 1 failed); **1789 tests, 1788 passed, 1 failed**, 0 pending,
    0 todo. `.test-results/last-run.json` `success: false`. **The one red is the expected one:** `src/cli.test.ts`
    › `ABC-065` › "A3 — the documented option list EQUALS the accepted set…", `documented options
    ["--colour","--ascii","--unicode"]: expected 3 to be greater than or equal to 4`. It waits on the
    Scribe's `AGENTS.md` slot line (`ticket-to-pr-ABC-101/probe/agents-md-dev-run-slot.txt`).
  - `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: exit 0, **10 passed / 10**.
  - `abc095-book-absent-*` in `os.tmpdir()`: **0 before, 0 after**.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
- **No timing reading was taken.**
