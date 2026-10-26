---
id: 20261026T011145Z-architect-design-observation-a1ddd6fb
kind: observation
by: architect-design
at: 2026-10-26T01:11:45Z
verified_by: 
confidence: high (each figure read at this hop; licence pages read 2026-10-26; the merged sizes are scratch compiles under compileBook's rules, not the delivery compile)
refs:
  - ABC-211
  - EPIC-008
  - ADR-0023
  - ADR-0037
  - ADR-0048
  - ADR-0012
  - ABC-092
  - ABC-093
  - NFR-006
  - NFR-007
  - QE-207-f
  - A1
  - A3
  - R1
  - R4
  - R6
  - plans/tickets/ABC-211-the-opening-book-goes-deeper-in-the-english-lines.md
  - memory-bank/50-decisions/ADR-0023-opening-book-source-is-lichess-chess-openings-under-cc0.md
  - bapm-cut-engine-strength/20261023T203657Z-ba-pm-observation-81e021ac
  - bapm-cut-engine-strength/20261023T203717Z-ba-pm-decision-8c3b2f47
  - bapm-s1-ABC-207/20261026T005931Z-ba-pm-decision-f249ca34
  - qe-ABC-207/20261026T005119Z-qe-e2e-decision-cc744e8c
  - qe-ABC-207/20261026T005119Z-qe-e2e-observation-dc779c4a
  - grugops/arch-source-ABC-211
  - 1df54ba6
  - a6189a30
  - a804a97e
supersedes: 
seal: sha256:62a9802f707cbbdbe5276e033ddb410c5cb17fce340186a118e75e9242989225
---

# Architect/Design read-backs for ABC-211's source ruling: the pinned source and upstream master, compile(pin), one CC0 candidate with the line, its merged size, and the root-weight shift

Task `arch-source-ABC-211`, at `main` `1df54ba6`. Every input was fetched into `<scratchpad>/arch211/`, outside the
repo, and then probed with the worktree's `src/` (`fen`, `san`, `apply`, `moves`, `zobrist`) and
`tools/opening-book/compile.ts` `compileBook`, all read-only. No npm, vitest or timing. Nothing was written to the repo.

1. **Pinned source, `lichess-org/chess-openings` `a6189a30`.**
   - The five sha256 values equal `compile.ts` `SOURCE_SHA256`.
   - 3,865 rows, longest 36 plies.
   - The game-1 position after 3...b6 (`rnbqkb1r/p2ppppp/1p3n2/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq -`): **0 rows
     reach it at any ply**, untruncated and with transpositions.
   - 8 rows pass the position after 3.Nf3, with Black playing Nc6 6, d5 1 and e5 1. That matches BA/PM's probe
     (`…81e021ac` item 9).
   - 9 rows hold all six moves in another order, and none of them reaches the position.
2. **Upstream `master`** HEAD is `a6189a30` (2026-10-06). Its five files are byte-equal to the pin.
3. **`compileBook(pinned)`** is byte-identical to `data/opening-book/book.json`, 356,526 B.
4. **`official-stockfish/books` at `a804a97e`** (HEAD 2026-10-16). The licence API reads `CC0-1.0`. `LICENSE` is
   7,048 B, titled "CC0 1.0 Universal".
   - `8moves_v3.pgn` (file commit `2ec69181`, 2019-12-16): 34,700 lines of 16 plies, Stockfish self-play headers.
     30 lines pass the position, with White playing e4 17, e3 5, d4 5 and g3 3. 4,192 lines start 1.c4, and 16 of
     those pass the position (e4 11, e3 3, d4 1, g3 1).
   - `bjbraams_chessdb_198350_lines.pgn`: 198,350 lines, 54 through the position. Its commit message reads "biased
     (dbcn) and known from human master play".
   - `2moves_v2.pgn`: 0 lines through the position.
   - `noob_3moves.epd` holds the position and none of its children.
   - `popularpos_lichess_v3.epd` holds the position and 4 children (e3, g3, d3, b3), as positions only.
5. **Merged compiles** (the `compileBook` rules re-implemented in scratch; ≤ 12 plies; names from the TSVs only):
   - **base plus the 1.c4 lines, naive line-count:** 716,014 B and 14,504 entries. The game-1 position gets d2d4 1,
     e2e3 3, e2e4 11 and g2g3 1.
   - **the same lines with the graft rule** (an existing edge keeps its count, a new edge gets 1): **715,259 B**,
     with the same entries. Against `NFR-007` the growth is 2.006x.
   - **base plus all 34,700 lines:** 2,527,629 B and 60,458 entries. Fails `NFR-006`.
   - **Positions in book from 1.c4, plies 1–12:** base `1,9,22,32,41,50,49,52,50,40,31,0`; merged
     `1,12,56,144,275,480,716,998,1357,1741,2150,39`.
6. **Root weights.**
   - Base: e4 2,032 (52.6 %), d4 1,333 (34.5 %), c4 202 (5.2 %), Nf3 109 (2.8 %).
   - Naive merge: c4 4,394 (54.5 %), e4 25.2 %, d4 16.5 %.
   - Graft rule: equal to base.
7. **Readers of `source`.** `src/book.ts:96` checks only `format === 1` and `positions`. `source` and `source.commit`
   are read only in `tools/opening-book/book.test.ts` (`:238`, `:257`).
8. **Licence pages read 2026-10-26.**
   - <https://database.lichess.org/>: "Database exports are released under the Creative Commons CC0 license."
   - The GNU GPL FAQ, entry "In what cases is the output of a GPL program covered by the GPL too?": "The output of a
     program is not, in general, covered by the copyright on the code of the program."
9. **`QE-207-f`** (`qe-ABC-207` `…cc744e8c`; table in `…dc779c4a`): at the game-1 position base plays d3 (depth 8,
   +56), not 4.Qa4.
