---
id: 20261010T141133Z-qe-e2e-artifact-ref-abc135-qe-rows-gates-5b93e7c5
kind: artifact-ref
by: qe-e2e
at: 2026-10-10T14:11:33Z
verified_by:
confidence: high
refs:
  - ABC-135
  - branch:grugops/ABC-135-a8-comment-specifiers
  - commit:ce6d8746
  - src/render-seam.test.ts
  - .grugops/context/qe-ABC-135/notes/raw-out-qe-gates-tip.txt
supersedes:
---

# `ABC-135` QE artifact: one test-only commit `ce6d8746`, and the gates at the QE tip

Hand-authored, no seal. Branch `grugops/ABC-135-a8-comment-specifiers`, worktree
`.claude/worktrees/qe-ABC-135`. Not merged, not pushed.

- **`ce6d8746` `test(ABC-135): grug QE pin that A8's comment strip eats no code`.** It touches one
  path, `src/render-seam.test.ts` (+15). It adds the sibling `it` "A8's instrument — the comment strip
  eats no code: a consumer beside a comment still counts", with three `true` rows: `// c` above the
  import, `// c` trailing it, and `/* see http://x */` above it. 0 production lines. The engineer's six
  rows and the eight `ADR-0030` rows are untouched (that `it` block's sha256 prefix is
  `619e5f5dd5833d9b` at base, `b09d880c` and `ce6d8746`).
- **Gates at the QE tip** (QE's own worktree, `raw-out-qe-gates-tip.txt`):
  - `npm run lint`: exit 0, 98 files.
  - `npm run typecheck`: exit 0. `npm run build`: exit 0.
  - `npm test`: exit 0, **51 files / 1586 passed**.
  - Counts via the JSON reporter in `git archive` copies: base `5c17d1ed` 1584, engineer `b09d880c` 1585, QE `ce6d8746` 1586. Pending 0 and todo 0 at all three.
  - `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
  - `lane-inventory.js`: `The lane collects 51 test files; git tracks 51.` `No findings.`, exit 0.
- **The `src/` fence:** `git diff --numstat 5c17d1ed..ce6d8746 -- src/` = `46 6 src/render-seam.test.ts`
  only. The UAT-waiver probe (`git diff --name-only <c>~1 <c> | grep -v '\.test\.ts$' | grep '^src/'`)
  is empty for both `b09d880c` and `ce6d8746`.
