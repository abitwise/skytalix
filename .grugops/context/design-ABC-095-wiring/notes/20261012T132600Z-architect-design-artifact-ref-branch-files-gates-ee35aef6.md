---
id: 20261012T132600Z-architect-design-artifact-ref-branch-files-gates-ee35aef6
kind: artifact-ref
by: architect-design
task: design-ABC-095-wiring
at: 2026-10-12T13:26:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ADR-0012
  - ADR-0015
  - ADR-0037
  - 20261012T132000Z-architect-design-decision-wiring-rulings-r1-r3-and-amendments-a4fe3027
supersedes:
---

# Branch, files and gates

This note is hand-authored and unsealed.

- **Branch.** `grugops/design-ABC-095-wiring`, in worktree `../wt-design-ABC-095-wiring`, from `main`
  `1c765b04`. It is not merged and not pushed.
- **Design commit `af164409`:**
  - `memory-bank/50-decisions/ADR-0037-…md` gains a § Status amendment line, a dated correction under
    § Consequences' "Not ruled" bullet, and § Addendum — 2026-10-12 at the end;
  - `memory-bank/50-decisions/ADR-0012-…md` gains a dated pointer in § Status;
  - `memory-bank/50-decisions/ADR-0015-…md` gains a dated pointer in § Status;
  - `plans/traceability.md` gains one row, at the end;
  - two notes: `…7f2adbae` (the observation) and `…a4fe3027` (the decision).
- **This note** is in the next commit, which holds notes only.
- **What is not touched:** `src/`, `tools/`, ticket pages, `plans/board.md`, `AGENTS.md`,
  `plans/nfr-catalog.md`, and the SE's worktree.
- **Gates on the tree of `af164409`,** run before the commit:
  - `npm run -s lint`: exit 0. Biome checked 109 files and applied no fixes.
  - `npm run -s typecheck`: exit 0.
  - `npm run -s build`: exit 0.
  - `npm test`: exit 0. 57 files; 1775 passed, 0 failed, 0 pending, 0 todo.
    `.test-results/last-run.json` has `success: true`.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`,
    exit 0.
- **The probe.** `book-odds.ts` ran in a scratch directory outside the repository. Its text and output
  are in `…7f2adbae`. It read no clock.
