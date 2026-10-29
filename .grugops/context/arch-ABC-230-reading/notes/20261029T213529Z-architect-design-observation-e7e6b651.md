---
id: 20261029T213529Z-architect-design-observation-e7e6b651
kind: observation
by: architect-design
at: 2026-10-29T21:35:29Z
verified_by: 
confidence: high on the code facts and on the probe counts (deterministic, fixed depth or frozen clock); scan time per node on this host UNKNOWN - verify
refs:
  - arch-ABC-230-reading
  - ABC-230
  - EPIC-010
  - ADR-0054
  - ADR-0002
  - ADR-0020
  - ADR-0044
  - ADR-0025
  - ADR-0026
  - ABC-081
  - sa-ABC-226/20261029T202608Z-system-analyst-observation-cc53fc79
  - sa-ideas-verify/20261029T200022Z-system-analyst-observation-306a4012
  - ABC-235
  - NFR-005
  - NFR-009
  - .grugops/context/arch-ABC-230-reading/raw/
  - main 989093f3 (src tree 1bf0138a)
supersedes: 
seal: sha256:37e34d5941cd08c2be2a3806228a860f6588262059cf427245eb804e306443a7
---

# Architect readings for ABC-230 and EPIC-010 Q3: the code, three probes, and what each option touches

Read at `main` `989093f3` (`src/` tree `1bf0138a`). Probes ran on scratch copies of `src/`, never on `src/`. Each was a single process at a fixed depth or on a frozen clock, and deterministic. In total they took about 4 s of CPU. `pgrep -x cutechess-cli` was empty before each run, and load1 was about 10 (a sibling build was live). Scripts, outputs and diffs are in `.grugops/context/arch-ABC-230-reading/raw/` (`README.md` lists them).

## Code facts (read, not probed)
- The search's repetition test is `repeatsInPath(keys, ply, halfmoveClock)` (`src/search.ts:129-138`). It is called first at each full-width node, before the capacity guard and the table probe, in both recursions (`src/engine.ts:291-299`, `src/search.ts:402-411`). It scans `keys[ply−4]`, `keys[ply−6]` and so on, down to `max(0, ply − clock)`. One match is a draw, scored 0. The root, `keys[0]`, counts.
- The key array is seeded with the root key alone: `src/engine.ts:549` and `src/search.ts:604`. `ABC-081` `A6` (`src/transposition.test.ts:575`) forbids a `history.ts` import in the four search modules and pins one `BigUint64Array` per search.
- `makeNullMove` sets the clock to 0 (`src/apply.ts:183`), so no clock-bounded scan crosses a null move. `makeMove` sets an ep square only on a double push, and that move resets the clock (`src/apply.ts:135-140`). **So in any reversible window, only the first position can carry an ep square.**
- `src/history.ts` `keyHistory` returns the game's keys, root last. Its header names it as `ADR-0002` clause 3's seam. Only `turn-loop.ts` and `cli.ts` may runtime-import `history.ts` (the `ADR-0011` clause 3 licence equality, `src/history-pane.nfr.test.ts:274`). A module that can have the data injected is not licensable.
- `createEngine` has no production caller (`virtual-clock.ts` only mentions it in a comment). The CLI plays through `createLevelSeam` (`src/cli.ts:224`). UCI calls `chooseMove` and `createLevel` directly (`src/uci-session.ts:301`, `:313`).
- `ADR-0044` D6 already names the route for game-history repetition under UCI: "an `ADR-0002` clause 3 amendment". D2 keeps `history.ts` out of the session, and its import list has no `zobrist.ts`.
- The book stores `zobristKey` hex as its keys (`src/book.ts:6`, `:141`; `data/opening-book/book.json` `positions`), precomputed.

## Probe H: the pre-root rule on fixtures (`history.mts`, `variant-history.diff`)
This was `chooseMove` at `maxDepth` 4 on a frozen clock. Base means no prior keys. r3 means two earlier matches before the root are needed; r2 means one is enough.

| row | position | main = base | r3 | r2 |
|---|---|---|---|---|
| H1 | KQ v K, Black; Ke8 would be the 3rd occurrence | Kc8 −1006, 524 nodes | **Ke8 0**, 96 nodes | Ke8 0 |
| H2 | the same, Ke8 would be the 2nd occurrence | Kc8 −1006 | **Kc8 −1006** (unchanged) | Ke8 0 (an illusory draw) |
| H3 | knight shuffle, startpos 3rd occurrence available to Black | d5 63, 1 853 nodes | d5 63, 1 850 nodes | d5 63, 1 850 |
| H4 | 9 prior keys handed in untrimmed, root clock 0 (after a3) | Kf8 −1010, 405 nodes | identical | identical |
| H5 | bare FEN `kiwipete`, no prior keys | Bxa6 8, 27 112 nodes | identical | identical |

Base equals unmodified main in every row.

## Probe Q3-1: book keys under option (b) (`bookwalk.mts`)
This walked the book from startpos through its own moves. It reached 3 626 of the 5 390 entries. **693 of them carry an ep square, and 685 of those 693 have no legal ep capture.** Option (b) re-keys those 685 or more entries, so the book misses after almost every double push unless `book.json` is regenerated.

## Probe Q3-2: node counts under option (b) (`nodes.mts`, `variant-b.diff`)
This ran fixed-depth `search()` on the six benchmark positions. Main's key was read against a key that carries the ep file only when a pawn of the side to move stands beside the pushed pawn. Both variants recompute the full key at each call site, so the node counts measure the key's meaning, not its speed.
- **Depth 4:** nodes moved on 4 of 6 positions. `kiwipete` went 18 522 → 18 380, `position-4` 15 114 → 15 076, `position-5` 7 666 → 7 368 and `position-6` 11 688 → 11 673. Scores were identical.
- **Depth 5:** nodes moved on 5 of 6 positions. `startpos` went 4 741 → 4 686, `kiwipete` 74 424 → 74 293, `position-4` 58 282 → 58 234, `position-5` 9 873 → 9 636 and `position-6` 40 139 → 40 124. Scores were identical. `position-3` was unchanged: its double pushes (e2–e4, g2–g4, c7–c5) all land beside an enemy pawn, so both keys agree.
- So option (b) moves every node pin on those positions. The table merges a little more, saving 0.04–2.4 % of nodes at d5. Time per node was not measured: `UNKNOWN - verify`, expected small (two square reads on ep-carrying nodes).

## Not measured
- The scan's time per node on this host, beyond `ADR-0002`'s 29–62 ns at 20–40 entries (M3). It is zero on every benchmark position, because they have no prior keys.
- How many of SA `A6`'s 22 ep-late games would change result under (b) or (c). Two of them are also in SA `A3`.
