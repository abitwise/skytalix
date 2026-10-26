---
id: 20261026T134928Z-software-engineer-observation-94763b89
kind: observation
by: software-engineer
at: 2026-10-26T13:49:28Z
verified_by: 
confidence: high (every command run at this hop, output read)
refs:
  - ABC-209
  - EPIC-008
  - ADR-0025
  - ADR-0032
  - ADR-0027
  - NFR-009
  - NFR-008
  - A1
  - A2
  - A3
  - A4
  - A5
  - plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
  - owner-word-2026-10-26b/20261026T132424Z-orchestrator-decision-2ae5fc12
  - arch-design-ABC-209/20261026T125648Z-architect-design-decision-2e73dcd9
  - arch-design-ABC-209/20261026T125648Z-architect-design-observation-b7d4b710
  - bapm-amend-ABC-209/20261026T130154Z-ba-pm-decision-3750aaf6
  - grugops/ABC-209
  - 9857bd1c
  - f76fbb62
  - 1da0a17f
  - 954eeb35
supersedes: 
seal: sha256:d6278a9783bfd798748f33e7edfc0743323a5a6b6665e9cf89f2243d48fa8ead
---

# ABC-209 built on grugops/ABC-209: tip 954eeb35, base main 9857bd1c, six files

- Branch `grugops/ABC-209`, worktree `../wt-ABC-209`, cut from `main` `9857bd1c`; own `npm ci --ignore-scripts`. Three commits: `f76fbb62` (the build), `1da0a17f` (one `--expose-gc` child construction, see the decision note), `954eeb35` (A1 and the ADR-0027 row at depth 3, lane cost). Not pushed, not merged.
- `git diff --numstat 9857bd1c 954eeb35`: `src/engine.ts` 15/6, `src/level-seam.ts` 12/1, `src/levels.ts` 11/3, `src/transposition.ts` 50/11, `src/uci-session.ts` 24/6, `src/transposition.test.ts` 310/7. Production code lines, comments and blanks excluded: +57 / −12 (the design's 45–65).
- **As ruled (ADR-0025 § amendment 2026-10-26, accepted by the owner `…2ae5fc12`):**
  - `src/transposition.ts`: a `holder`; `prepareTable(game)` keeps the table only when `game` is the holder, else clears and holds `game`; `createGameTracker()` returns the same token iff the same start and the previous search's moves are a strict prefix. `clearTable` releases the holder, so `search()`'s unchanged clear releases it too. Size, packing and always-replace untouched. Header comments (lifetime, replacement) and `clearTable`'s doc rewritten.
  - `src/engine.ts`: `EngineOptions.game?: object`; `deepen` calls `prepareTable(options.game)` where it called `clearTable()`. No export added (the export-list pin is unchanged). Header comment rewritten.
  - `src/levels.ts`: the chooser is `(position, game?)`; `game` is spread into `chooseMove` only when present, on the engine path only. The blunder path's children carry no token.
  - `src/level-seam.ts`: one tracker per seam, keyed on `history.initialFen` and `history.moves` in coordinates (`squareName` from + to, the promotion's piece type appended when present).
  - `src/uci-session.ts`: one tracker, replaced at `ucinewgame`; the accepted `position` line's start tokens and move tokens are kept as sent; both search paths (`chooseMove` and `createLevel`) pass `track(start, moves)`. A book answer calls no tracker.
- `search()` (`src/search.ts`) and `ADR-0025` were not edited. The ladder and every test pass no token.
