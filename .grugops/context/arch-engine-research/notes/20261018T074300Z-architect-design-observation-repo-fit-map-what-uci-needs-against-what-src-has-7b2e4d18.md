---
id: 20261018T074300Z-architect-design-observation-repo-fit-map-what-uci-needs-against-what-src-has-7b2e4d18
kind: observation
by: architect-design
at: 2026-10-18T07:43:00Z
verified_by:
confidence: high
refs:
  - ADR-0044
  - ADR-0002
  - ADR-0011
  - ADR-0016
  - ADR-0024
  - ADR-0027
  - ADR-0036
  - ABC-078
  - EPIC-004
  - NFR-004
  - NFR-008
  - NFR-009
  - src/engine.ts
  - src/fen.ts
  - src/coordinate-move.ts
  - src/line-input.ts
supersedes:
---

# REPO-FIT MAP: WHAT UCI NEEDS, AGAINST WHAT `src/` HAS, READ AT `main` `fedb80d4`

**Read from the source, not run.** No test, vitest, build or timing was run. Line numbers are at `fedb80d4`.

## HAVE: reusable as is, with no edit

| UCI needs | module, export | the fact that makes it fit |
|---|---|---|
| FEN in | `src/fen.ts` `parseFen` (`:236`), `FenError` (`:36`) | it throws `FenError` on a bad FEN, which the session catches by type. Chess960 is a non-goal (`:161`) |
| `moves e2e4 e7e8q e1g1` | `src/coordinate-move.ts` `parseCoordinateMove` (`:84`) | the regex `^([a-h][1-8])-?([a-h][1-8])([qrbn])?$` is a superset of UCI long algebraic. It selects from `legalMoves`, so no move is built from text. Castling is king-to-square (`FLAG_CASTLE`, `moves.ts:349`). It is total over `text` |
| apply the moves | `src/apply.ts` `makeMove` (`:122`) | needs no history |
| choose a move | `src/engine.ts` `chooseMove(position, { budgetMs, now })` (`:422`) | returns `{ move, score, depth, nodes, elapsedMs }`, which is everything one final `info` line needs. `null` means no legal move, which gives `bestmove 0000` |
| an injectable clock | `Clock` (`:115`), consulted every `NODES_PER_CLOCK_CHECK` = 1024 nodes (`:139`, `:207-213`) | the seam a future worker's stop flag would ride, with no engine edit |
| ceiling | `HARD_CEILING_MS` = 5 000 (`:129`), clamped with `Math.min` (`:464`) | `NFR-004` clause B holds for any GUI-sent budget |
| default budget | `DEFAULT_BUDGET_MS` = 3 000 (`:122`) | for a bare `go` |
| score units | `src/evaluate.ts` is centipawns, positive for the side to move. `MATE_SCORE` = 30 000 (`search.ts:87`). `MATE_FLOOR` = 20 000 (`transposition.ts:63`) | maps straight onto `score cp` and `score mate` |
| move text out | `squareName` (`position.ts:60`). `src/book.ts:77` already has a private `uciOf` | the formatter is three lines |
| a deterministic test clock | `src/virtual-clock.ts` `virtualClock` | session tests run on virtual time (`ADR-0027`) |
| correctness | `src/perft.test.ts:23,29` | pinned to the CPW startpos and Kiwipete counts |
| strength tooling | levels (`levels.ts`), the ladder (`ADR-0038`) and the puzzle gate | present. None is needed for UCI v1 |

## MISSING: what a UCI v1 must add (all inside the two new files, `ADR-0044` D2)

1. **The protocol loop.** Line in, command dispatch, line out. There is none today.
2. **Time management.** A GUI clock (`wtime`/`btime`/`winc`/`binc`/`movestogo`/`movetime`) has to become
   a `budgetMs`. Nothing maps a clock to a budget today. Levels map a *difficulty* to a budget.
3. **The `info` line and `bestmove` formatting**, including the mate conversion.
4. **Holding `bestmove` for `go infinite` until `stop`.**

## MISSING, and deliberately NOT added in v1 (each needs a ruling or a core edit)

- **`stop` and `isready` during a search.** `chooseMove` is synchronous (`deepen`, `:452-504`), so stdin
  is not read until it returns. Fixing this needs a worker (`ADR-0044` D5) or a yielding search, which is
  rejected.
- **`go depth`, `nodes`, `mate`.** The engine has no depth argument by design (`:5-12`, `ABC-078` `A4`),
  and `ADR-0027` d3 adds no `EngineOptions` field.
- **A per-iteration `info`, or a pv longer than one move.** There is no iteration hook. `EngineChoice`
  holds only the root move.
- **Repetition against the game before the root.** The search seeds `keys[0]` with the root only
  (`:473`). The game history is not read (`ADR-0002` clause 3, header `:54-59`).
- **Pondering, MultiPV, a resizable Hash.** None exists. The table is fixed (`ADR-0025`, `NFR-009`
  16 MiB).
- **Chess960.** A non-goal in `fen.ts`.

## Reusable on paper, refused on reading

- **`src/line-input.ts`.** It writes `PROMPT = "> "` (`:67`) to its output, which would corrupt the
  protocol. It routes lines to the human command table. `MAX_LINE_LENGTH` = 1024 (`:94`) is shorter than a
  `position startpos moves …` line after about 200 plies (5 bytes per ply).
- **`EngineSeam`, `turn-loop.ts`, `history.ts`.** They need a `GameHistory`. Importing `history.ts` adds an
  importer to `ADR-0011` clause 3's licence set `{ turn-loop.ts, cli.ts }`, which is an amendment plus a
  guard edit.
- **`withBook` / `createLevelSeam`.** Both are `EngineSeam` decorators. The book can be reached directly
  (`BookProbe.bookMove(position)`), but only if the owner wants a book under UCI (`ADR-0044` Q4).
  `book-file.ts` is an `fs` capability holder (`ADR-0036`), and the session must not import it.

## Gaps against the binding rulings

| ruling | what a UCI entry point meets |
|---|---|
| `EPIC-004` § Out of scope | *"UCI protocol support … permanent non-goal"*. **Needs the owner's word.** This is the gap that blocks everything else |
| `ADR-0011` cl. 1 | `src/uci.ts` and `src/uci-session.ts` are production modules. Keep them flat, or `R3` fires (a recursive enumeration plus a depth-aware specifier) |
| `ADR-0011` cl. 3 | met as long as neither file imports `history.ts` |
| `ADR-0011` cl. 4 | `src/uci.ts` exports nothing. It is the third entry point and is never on the frame path |
| `ADR-0016` | `src/uci.ts` acquires stdout, so it owns the `EPIPE` arm. Exit codes stay 0/1/70 |
| `ADR-0036` (b1) | fires on `src/uci.ts` (`process.`, `node:readline`), so the build ticket goes through `In Security/NFR` |
| `ADR-0024` d7, rule 7 | no UCI `option` lines in v1 |
| `NFR-004` | the ceiling holds through the engine's clamp. A GUI asking for 10 s gets about 5 s (`AR-NFR004-A`, abort granularity up to about 31 ms) |
| `NFR-008` | a session test file adds one file to the per-file floor. A real child spawn costs `N8-SPAWN`, whose balance is 0 ms, so it goes in an opt-in lane (`ABC-119` precedent) |
| `ADR-0007`, `ADR-0018` | met: it runs locally from a clone, as a GUI's child process |
