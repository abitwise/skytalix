---
id: 20261012T205500Z-software-engineer-decision-merge-resolution-and-a8-comment-d2414062
kind: decision
by: software-engineer
task: resume2-ABC-101
at: 2026-10-12T20:55:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-086
  - ABC-042
  - 20261012T205300Z-software-engineer-artifact-ref-merge-code-commit-gates-4822a352
supersedes:
---

# Three small calls made inside the brief

This note is hand-authored and unsealed.

1. **One blank line between `## Delivery` and `## Amendment`** in the merged ticket page. Neither section is
   edited; without it the heading would sit directly under the Delivery table's last row.
2. **(i′) assertion 2 reads the adapter path from `src/cli.ts`'s import of `createLevelSeam`**, not a
   spelled `./level-seam.ts`. The page says "the module `src/cli.ts` imports `createLevelSeam` from", so the
   row follows the import if the module is ever renamed, and fails (`not.toBeNull`) if the import goes.
3. **`ABC-042` `A8`'s added comment line was rewritten to two lines** naming the reused base `2` and the new
   total (seven), because the probe's line named only `32` and the untouched older line still says "six".
   The older line is not edited (coding rule 9). Lists unchanged.

**Not done, by fence:** `AGENTS.md` (the Scribe's), `plans/board.md`, the ticket front matter (`status:
backlog`, `P2`, the Orchestrator's), other tickets' pages. The `ABC-042` page pointer the first hop called
owed was landed by BA/PM at `a01bf6fb`.
