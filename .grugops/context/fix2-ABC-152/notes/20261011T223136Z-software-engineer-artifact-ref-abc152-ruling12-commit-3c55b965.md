---
id: 20261011T223136Z-software-engineer-artifact-ref-abc152-ruling12-commit-3c55b965
kind: artifact-ref
by: software-engineer
at: 2026-10-11T22:31:36Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - QE-152-i
  - src/cli.test.ts
  - 20261011T222932Z-architect-design-decision-abc152-qe152i-rulings-840a7403
supersedes:
---

# SE `ABC-152` ruling 12: one comment-only commit, tip `3c55b965`

Hand-authored and unsealed (no §14 gate verdict on this install). A pointer, not an admitted artifact.

- **Branch:** `grugops/ABC-152-vitest-4-1-runner-off`, parent `5eafe95c`, commit
  `3c55b9657a81268ebe9f6ffd45e0b4acb7284598`. Not merged.
- **Worktree:** a throwaway under the session scratchpad with its own `npm ci` (vitest 4.1.11); removed after
  the commit. The main checkout's `node_modules` and branch were not touched.
- **`git diff -U0 HEAD~1`:**

```
@@ -6 +6 @@
- * it is not an `*.nfr.test.ts`: nothing here re-routes the module graph.
+ * it is not an `*.nfr.test.ts`: it re-routes `glyph-mode.ts` for every test here, but calls through.
```
