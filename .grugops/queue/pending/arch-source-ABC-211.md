---
subtask: arch-source-ABC-211
role: architect-design
ticket: plans/tickets/ABC-211-the-opening-book-goes-deeper-in-the-english-lines.md
ref: .grugops/context/arch-source-ABC-211/
branch: new grugops/arch-source-ABC-211 from main, worktree ../wt-arch-source-ABC-211
width: 2 of 2 (beside bapm-ready-ABC-208; records only — no npm, vitest or timing)
---

# ABC-211: opening-book source ruling (ADR-0023)

## Do
- Make the page's source ruling: can the deeper English lines come from the current ADR-0023 source (`lichess-org/chess-openings` at the pinned commit, CC0) or by its documented rule? If yes, rule it inside ADR-0023 (no ADR change) and state what the compile would take.
- If a new or changed source is needed, do NOT decide it. Write the ADR-0023 change as PROPOSED, with options and licences, for the owner (ABC-092 rule: the licence is decided before a byte is copied). Copy no third-party bytes.
- Give the page's Ready trigger status and the board card line in your Result; don't edit the board.

## Fences
- Only your worktree and `<scratchpad>/arch211/`. No `src/` or `data/` edits. Network reads only for licence/source facts (no downloads into the repo). Do NOT run npm/vitest/timing. Never push, force, amend or rebase; never merge into main. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task arch-source-ABC-211). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
