---
subtask: ticket-to-pr-ABC-209
role: software-engineer
ticket: plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
ref: .grugops/context/ticket-to-pr-ABC-209/
branch: new grugops/ABC-209 from main, worktree ../wt-ABC-209
width: 1 of 3 (no real-clock timing, no G6, no games)
---

# Build ABC-209: the transposition table is kept for one game (ADR-0025 D4 amendment, ACCEPTED by the owner)

## Do
- Read Orchestrator `owner-word-2026-10-26b/…2ae5fc12`.
- Work in your own worktree, and run your own `npm ci --ignore-scripts`.
- Build exactly to the page's `## Design ruling` and the ADR-0025 § Proposed amendment 2026-10-26 (Architect `arch-design-ABC-209/…2e73dcd9`, `…b7d4b710`), as amended on the page (BA/PM `bapm-amend-ABC-209/…3750aaf6`). Every clear point, the token seam, the continuation rule and the no-token door are named there; build each one.
- **Tests:** the rows the page's criteria name (A1–A4), including the NFR-009 40-search row in the shape A4 names. Write a test red first wherever the page names a plant.
- **Pins:** the ruling says 0 moved pins and 0 re-points. Any value pin, relation, level or bound that moves → STOP to Architect/Design.
- **Frozen-clock d7/d8 counts:** kiwipete and position-6, base and head. They must equal each other (A1). Report them; they are not graded.
- **Gates:**
  - lint, typecheck, build;
  - `npm test` + `last-run.json`, including Duration (NFR-008 headroom matters);
  - skips;
  - SEARCH_DEEP, including the null-move lane;
  - ENGINE_DEEP, deterministic rows only;
  - PUZZLE_DEEP (G1 54/58).
  - No real-clock timing.

## Fences
- Touch only the files the page's Scope names, the tests the ruling names, your worktree and `<scratchpad>/se209/`.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).
- Do not edit ADR-0025; the Architect records its status.

## Publish
- Commit on your branch. Seal notes (task `ticket-to-pr-ABC-209`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Built, gated, committed on `grugops/ABC-209` (not pushed, not merged).** Software Engineer, 2026-10-26, worktree
`../wt-ABC-209`, cut from `main` `9857bd1c`, own `npm ci --ignore-scripts`. Tip `bb6cf451` (notes) over code tip
`954eeb35`: `f76fbb62` build, `1da0a17f` one gc-child construction, `954eeb35` A1/ADR-0027 rows at d3, `bb6cf451` notes.

- **Built exactly to the ruling** (ADR-0025 § amendment 2026-10-26, accepted `…2ae5fc12`): `prepareTable(game)` and
  `createGameTracker()` (strict prefix) in `src/transposition.ts`, `clearTable` releases the holder;
  `EngineOptions.game?` and `prepareTable(options.game)` in `src/engine.ts`; `createLevel`'s chooser `(position, game?)`
  spreads it only when present, engine path only; one tracker in `src/level-seam.ts` (initialFen + coordinate moves)
  and one in `src/uci-session.ts` (accepted `position` line; replaced at `ucinewgame`). `search()` untouched; no new
  engine export; 4 MiB, always-replace, no ageing. Production code +57/−12 (comments excluded) in the five Scope files.
- **Tests** (`src/transposition.test.ts`, +10 default rows, +1 `ENGINE_DEEP`): tracker/holder ×3, A1, A2 ×3 (UCI
  `ucinewgame` with B extending A's line, non-continuing `position`, CLI `new`), A3 (reply = stored hash move; first
  probe hits), A4 4 MiB, A5 ADR-0027, and the A4 40-search row. Red first: 7 rows red on missing symbols, then A3 red
  on behaviour. A2 green at base by construction, armed by mutants (ucinewgame keeps tracker; tracker never clears;
  per-instance token); A1 armed by "new token keeps" and "no token keeps".
- **Pins: 0 moved.** One static inventory row (`src/cli.test.ts` ABC-173 A6: one `spawnSync` site in this file) went
  red when the 40-search row added a site. Not moved: both `--expose-gc` rows now share one helper with A7's exact
  construction (decision `…fb730791`).
- **Frozen-clock d7/d8** (`now: () => 0`, `maxDepth`, fresh process each), base = head = head with a first token,
  8 of 8: kiwipete 590 489 / 1 259 463; position-6 180 941 / 355 565 (equal the design's).
- **Gates at `954eeb35`:** lint 0, typecheck 0, build 0. `npm test` 63 files 2138/2138 (base 2128/2128);
  `last-run.json` success, pending 0, todo 0; Duration head 8.06 s / base 8.09 s (single back-to-back runs, not an
  NFR-008 reading). Skips 0; integrity `No findings.` Deep lanes, real-clock rows filtered by name (the same 12 as the
  design), 0 failed, head = base except `transposition.test.ts`: `SEARCH_DEEP` search 57, ordering 38, quiescence 37,
  transposition 50, pvs-lmr 29, null-move 44; `ENGINE_DEEP` engine 54, levels 37, transposition 36, pvs-lmr 20,
  gameend 47, legal 37; `PUZZLE_DEEP` 18/18, **G1 54/58 = baseline**. **A4 40-search: heapUsed Δ 53 048 B,
  arrayBuffers Δ 0 B, table 4 194 304 B** (≤ 1 MiB: no STOP; game fixed by me, QE may re-fix).
- **Not run:** any real-clock row or timing, G2, G5, G6, D, LADDER/CLI/UCI_DEEP. No board, ADR or remote touched.
- **Owed:** QE hop; UAT (5 production files, waiver does not apply); the ALONE D reading (A6); merge on S1.
- **Notes** (`.grugops/context/ticket-to-pr-ABC-209/notes/`, on the branch): `…94763b89` (build), `…b5537728`
  (gates), `…3e3d0c55` (rows, counts, mutants), `…fb730791` (decisions).

### Trace row (10 cells, header order)

| ABC-209 (ticket-to-pr-ABC-209) | TT kept across one game by a game token; cleared at a new game, ucinewgame, a non-continuing position, new/undo; no token = cleared (the clear door) | EPIC-008 | per-game transposition table (ADR-0025 d4 amended, accepted …2ae5fc12) | NFR-009: 4 MiB unchanged; 40 searches one token heapUsed Δ 53 048 B, arrayBuffers Δ 0 B (≤ 1 MiB); NFR-008 lane 2138 rows, no file added; 0 pins moved | grugops/ABC-209 @ bb6cf451 (code 954eeb35), base 9857bd1c<br>src/transposition.ts, src/engine.ts, src/levels.ts, src/level-seam.ts, src/uci-session.ts, src/transposition.test.ts<br>notes …94763b89, …b5537728, …3e3d0c55, …fb730791 | +10 default rows + 1 ENGINE_DEEP (A1, A2×3, A3, A4×2, A5, tracker/holder×3); npm test 2138/2138 (base 2128); lint/typecheck/build 0; skips 0, No findings; SEARCH/ENGINE_DEEP (deterministic) and PUZZLE_DEEP green, G1 54/58; frozen d7/d8 8/8 equal | owed (production lines; waiver does not apply) | — | built; In Development → In Review proposed; QE hop, A6 ALONE reading and merge owed |
