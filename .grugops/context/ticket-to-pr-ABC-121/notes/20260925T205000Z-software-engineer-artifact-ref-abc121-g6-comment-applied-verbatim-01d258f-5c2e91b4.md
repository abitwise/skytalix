---
id: 20260925T205000Z-software-engineer-artifact-ref-abc121-g6-comment-applied-verbatim-01d258f-5c2e91b4
kind: artifact-ref
by: software-engineer
at: 2026-09-25T20:50:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ADR-0026
  - src/transposition.test.ts
  - .grugops/context/ruling-abc121-g6/notes/20260926T034200Z-architect-design-decision-g6-pair-is-a-decision-4-row-repoint-stands-no-new-row-ea306e58.md
sha: 01d258f
gate_run:
content_hash:
supersedes:
---

# G6 ruling applied: one comment in `src/transposition.test.ts`, verbatim

Hand-authored. There is no gate verdict id to cite (`AGENTS.md`: no sanctioned writer on this
install), so `gate_run` is empty.

- **Branch:** `grugops/ABC-121-pvs-lmr`, worktree `.claude/worktrees/ABC-121-pvs-lmr`. Code commit
  **`01d258f`** (claim `551dd1b`). **Not merged, not pushed.**
- **Numstat:** `4	2	src/transposition.test.ts`. Comment only: no assertion, identifier or
  literal changed. "Measured, not argued: …probe/g6.ts" kept.
- **Before:** "The pair then reads 830 twice on `search()`, which is exactly the equality G6 exists
  to forbid, so the falsifier has no bite on the shipped path."
- **After (`…ea306e58` §4, verbatim):** "The pair then reads 830 twice on `search()`, so it
  re-points under decision 4 (ruling `ruling-abc121-g6`, which strikes it from decision 7). G6's
  bite was never this score pair, because the table lives one search. It is the key row below and
  `zobrist.test.ts`'s castling-rights rows, which no search switch reaches."
- **Not touched (flagged by the ruling, coding rule 9):** the `ABC-081` docstring on
  `KNIGHT_G1_PAIR` ("…`G6`'s FAIL"). It waits for the owner's `ADR-0006` erratum.
- **Gates at `01d258f`, each run once in the worktree:**
  - `npm test`: 48 files, 1 466 passed, 0 skipped.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`
  - `npm run lint`: clean, 85 files. `npm run typecheck`: clean.
  - Deep lanes not run: a comment-only diff cannot change them.
