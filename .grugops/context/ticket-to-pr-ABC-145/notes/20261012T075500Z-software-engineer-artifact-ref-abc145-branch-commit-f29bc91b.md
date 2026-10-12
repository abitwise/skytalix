---
id: 20261012T075500Z-software-engineer-artifact-ref-abc145-branch-commit-f29bc91b
kind: artifact-ref
by: software-engineer
at: 2026-10-12T07:55:00Z
verified_by:
confidence: high
refs:
  - ABC-145
  - ADR-0037
  - QE-093-b
  - NFR-008
  - plans/tickets/ABC-145-the-book-compiler-stamps-its-source-commit-and-never-checks-the-source-bytes.md
supersedes:
---

# SE `ABC-145`: branch and commits

This note is hand-authored and unsealed. No §14 gate verdict exists on this install, so it carries no `sha` / `gate_run` / `content_hash` triple. It is a pointer.

- **Branch:** `grugops/ABC-145-book-source-sha256` from `main` `3537fe48` (the subtask's `base` line reads
  `61aef6e6`; `3537fe48` is its child, a board/queue-only docs commit, and the dispatch named it).
  Worktree `/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ticket-to-pr-ABC-145`, `node_modules`
  symlinked from the main checkout.
- **Code commit `7be28bf9`:** `tools/opening-book/compile.ts` (+37/−1), `tools/opening-book/book.test.ts`
  (+56/−1, the `./compile.ts` import line only), `data/opening-book/ATTRIBUTION.md` (+3/−2).
- A docs commit on top carries these notes, the ticket's § Delivery and one trace row. It changes no code.
- Not pushed, not merged.
