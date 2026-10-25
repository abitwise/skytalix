---
id: 20261025T031013Z-software-engineer-decision-b4f96904
kind: decision
by: software-engineer
at: 2026-10-25T03:10:13Z
verified_by: 
confidence: high (plants run alone on scratch copies by the SE; deterministic)
refs:
  - ABC-217
  - EPIC-008
  - QE-206-a
  - QE-206-b
  - QE-206-e
  - SEC-206-a
  - QE-212L-a
  - NFR-001
  - NFR-008
  - plans/tickets/ABC-217-the-abc-206-and-abc-212-guards-see-discovered-checks-in-module-rebuilds-and-the-session-clock.md
  - qe-ABC-206/…809cd42a
  - qe-lane-ABC-212/…db746b16
  - security-nfr-note-ABC-206/…322a594a
  - grugops/ABC-217
  - 476c9f63
  - a98bfc32
  - bapm-cut-readme
supersedes: 
seal: sha256:056f9908a98d66ada6aedd9f0e704e4f3540abebe4a55d9581fb228aa23dd5c3
---

# ABC-217 built: four test strengthenings and one comment; every new assertion reds under its plant

Software Engineer, task `ticket-to-pr-ABC-217`, branch `grugops/ABC-217` in `../wt-ABC-217` (own `npm ci --ignore-scripts`), from `main` `476c9f63`. Code commit `a98bfc32`. Not pushed, not merged.

## Rows per criterion
- **A1 (QE-206-a):** `src/legal.test.ts` gains `DISCOVERED_CHECKS` beside `FLAGGED_CHECKS`: `8/8/8/8/R2K3k/8/8/8 w - - 0 1` (Kd4-d5) and `8/7k/8/8/8/8/2P5/1B4K1 w - - 0 1` (c2-c3). Inside the existing `givesCheck` row (depth 1, and the ENGINE_DEEP depth-3 row reuses it), per fixture: the named move is legal, `flags === FLAG_NONE`, make/`isInCheck` is true, `givesCheck` is true; then every legal move of the fixture goes through the existing make/isInCheck/unmake + unchanged-position check. 0 new `it` rows.
- **A2 (QE-206-b):** `src/gameend.nfr.test.ts`, `ABC-206` describe, 2 new `it` rows through the existing `apply.ts` spy: `hasLegalMove` on the start position calls `makeMove` exactly 1 time; `legalCaptures` on kiwipete calls it exactly N times, N = `generateMoves(p)` entries with `captured !== EMPTY`, computed in the test, with N > 0 and N < `generateMoves(p).length` asserted. Mocks cleared after the fixture work.
- **A3 (QE-212L-a):** `src/uci-session.test.ts`: `rig` also returns `now: options.now`; `budgetAt`'s stub records `options.now` and the helper asserts `toBe(now)`. All 6 budget-read rows carry it. 0 new rows.
- **A4 (QE-206-e, SEC-206-a):** `src/gameend.ts:17-19` reworded (the search leaf calls `leafEndReason`, ABC-206; one generation and one shared key read kept). The NFR-001 describe title drops "at a search leaf"; its `it` count is 3 at base and tip, bodies unchanged. `grep -c 'cheap at a search leaf'` prints 0 for both files.

## Plants (each alone, scratch copies under `<scratchpad>/se217/`, never in `src/`)
- **P-a** (unflagged path counts only the moved piece's attacks from `move.to`; every other mover piece swapped for an enemy pawn as a blocker): tip, `legal.test.ts`, 1 red of 34: the `givesCheck` depth-1 row, at "Kd4-d5 uncovers the a4 rook: givesCheck". **At base `476c9f63`, the full default lane: 62 files, 2073/2073 green.** The gap was open; the fixtures close it.
- **P-b1** (`hasLegalMove` = `legalMoves(p).length > 0`): tip, gameend.nfr + legal, 1 red of 42: "hasLegalMove on the start position plays EXACTLY one move".
- **P-b2** (`legalCaptures` = `legalMoves(p).filter(capture)`): 1 red of 42: "legalCaptures on kiwipete plays only the pseudo-legal captures".
- **Q1** (`now` passed only when the `go` has no `movetime`): `uci-session.test.ts -t "ABC-212 A9"`, 2 red of 9 run (128 filtered): `go movetime 60000 at 7` and `go movetime 1000 at 7`, as the page expects. The filter keeps the plant off the ABC-167 real-clock `movetime` searches; no real-clock search was run.
- At tip with no plant, the same files are green.
