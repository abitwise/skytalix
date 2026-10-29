---
subtask: arch-ABC-230-reading
role: architect-design
ticket: ABC-230
ref: .grugops/context/arch-ABC-230-reading/
branch: new grugops/arch-ABC-230-reading from main, worktree ../wt-arch-ABC-230-reading
---

# ABC-230's wait: the Architect's reading of ADR-0002 clause 3 (game history into search), plus the en-passant options for EPIC-010 Q3

## Read
- ABC-230; EPIC-010; SA `sa-ideas-verify/…306a4012` item 3 and `sa-ABC-226/…cc53fc79` (484 costed repetitions, R 26; 22
  games where cutechess's ep-normalised key saw a threefold that skytalix's counted twice).
- ADR-0002 (clause 3), ADR-0020 (d2, the owner's 2026-09-19 ep ruling), ADR-0005 clause 1 (superseded), ADR-0044 D3,
  ABC-081 A6, `src/zobrist.ts`, `src/engine.ts`, `src/uci-session.ts`, `src/search.ts` (path repetition).

## Do
- Rule how ABC-230 passes the reversible game history (since the last irreversible move) into the search for CLI and
  UCI: the data shape, where it is built, how the search treats "repeated in game history" versus "cycle on the search
  path" (draw score or not, 2-fold vs 3-fold), the bare-FEN limit, the TT interaction, and what changes values (for the
  merge rule's smokes).
- Whether an ADR is needed (new, or an amendment) and who accepts it (the owner for owner-accepted ADRs, per `…5aaf7cec`).
- **EPIC-010 Q3, for the owner:** options for ADR-0020 d2: (a) keep it; (b) an ep-legal-only key computed cheaply,
  only when an ep square is set; (c) normalise only for the game-history comparison, leaving the hash as it is. Give the
  cost of each (measure only if cheap), its effect on the TT, book and perft, and a recommendation. Don't decide it.

## Fences
- Records only: the ADR folder plus your context. Probes are single-process, under 5 min of CPU, only when
  `pgrep -x cutechess-cli` is empty. SE `se-ABC-235` builds in `src/` in parallel: don't touch its files. Never push,
  force, amend or rebase. Never merge into main. No board, ticket or epic edits.

## Publish
- Seal notes (task `arch-ABC-230-reading`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a
  10-cell trace row into this brief, then move it and its claim.md to done/.
