---
subtask: arch-design-ABC-203
role: architect-design
ticket: plans/tickets/ABC-203-at-game-end-npm-run-chess-writes-the-game-as-a-standard-pgn-file-under-games.md
ref: .grugops/context/arch-design-ABC-203/
width: 1 of 3 alongside arch-analyse-game-1 (disjoint files)
---

# Design ruling for ABC-203 (PGN file at game end) before the build

## Do
- Answer the page's four Architect questions: (1) module shape — pure formatter / writer holding `node:fs` / wiring; how the headline reaches the comment; ADR-0002 clause 4 (`history.ts` type-only). (2) Keeping the tree clean under `npm test` when spawned children reach an outcome with the tree root as cwd — with no argv/env reaching the production path. (3) The clock seam for the file name and `Date` tag. (4) Whether an ADR is needed (new ADR = fine if it reverses nothing accepted; reversing an accepted ADR = STOP, owner).
- Read ADR-0036 (b1)/(b2) and name what Security/NFR must check (first file write, the `games` symlink case).
- Write the ruling as a dated `## Design ruling` section on the ABC-203 page (and an ADR file if you rule one is needed). Recommend the next move (Ready for Dev / In Development with the SE).

## Fences
- Work on `grugops/arch-design-ABC-203` (worktree `../wt-arch-design-ABC-203` from `main`). Only the ABC-203 page, a new ADR if ruled, and your notes. No `src/`, tests, `package*.json`, `.gitignore`, board/trace. Not the game-1 analysis files (parallel hop). Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/design203/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-design-ABC-203`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
