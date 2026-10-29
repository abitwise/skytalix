---
id: 20261029T202608Z-system-analyst-observation-cc53fc79
kind: observation
by: system-analyst
at: 2026-10-29T20:26:08Z
verified_by: 
confidence: high on the counts (deterministic replay with the repository key, 0 of 4199 games dropped, 3 games hand-read); the A2 inside-the-search class is empty by construction; play cost of the 20 R draws Stockfish called 0.00 is UNKNOWN - verify
refs:
  - sa-ABC-226
  - ABC-226
  - ABC-230
  - EPIC-010
  - ADR-0002
  - ADR-0020
  - bapm-epic010-improvements/20261029T201508Z-ba-pm-decision-12cb550d
  - sa-ideas-verify/20261029T200022Z-system-analyst-observation-306a4012
  - sa-ABC-226/raw/scan.mts
  - sa-ABC-226/raw/scan.txt
  - sa-ABC-226/raw/scan.json
  - qe-ABC-204
  - qe-ABC-207
  - qe-ABC-208
  - qe-ABC-209
  - qe-ABC-210
  - qe-ABC-215
  - qe-epic008-close
  - qe-epic008-q4c
supersedes: 
seal: sha256:630086af6a2b9c136dba6a586464ceaea6069be7ffa4e0bd13cb57f8e9c5afd5
---

# SA observation, sa-ABC-226: records scan. The search's blindness to game history drew 461 games from a won score (26 in R); ruling: ABC-230 stays in milestone 1

Ticket `ABC-226` (EPIC-010 § B item 3; SA `sa-ideas-verify` `…306a4012` row 3f's named probe). Records only: no game, no engine, no `src/`, `data/` or `tools/` edit. Read at `main` `b5df6cde` (`src`/`data`/`tools` unchanged since `3ad6bc10`). Script `raw/scan.mts` replays every game with the repository's own `parseFen` / `parseSan` / `makeMove` / `legalMoves` / `zobristKey` (imported read-only). Output: `raw/scan.txt` (summary plus game lists) and `raw/scan.json` (per-game detail). One process, 3.7 s of CPU, deterministic (two runs byte-identical).

## Definitions used (ticket wording, made exact)
- **Repetition draw (A2):** cutechess's own termination `Draw by 3-fold repetition` in the last move comment.
- **Eval:** the cutechess move comment `{±p.pp/depth time}`, read as the mover's own view (UCI cp); `±M` is a mate (none occurred in A3).
- **"The skytalix search that completed the repetition":** root = the ply before the final move when skytalix made it, or skytalix's previous search (2 plies before the end) when the opponent did.
- **skytalix in D:** the ticket's strict reading counts the engine named `skytalix` (the candidate). `base` is also a skytalix build. No D candidate (`ABC-204` a5, `207`, `208`, `209`, `210`, `215`, `q4c`) touched repetition handling, so `base` is equally blind. A "family" count that includes `base` is given beside the strict count, for information. **The graded numbers are the strict ones.**
- **A4:** a move by skytalix where its own eval is ≤ −100 cp, at least one legal move would have made the third occurrence of a position in the game (repository key), and the move played does not. Count the games that skytalix then lost or drew.

## A1 coverage: 14 PGNs, 4199 games read, 4199 parsed, 0 unparsed, 0 silently dropped
Each game was replayed in full. The replayed ply count equals the `PlyCount` tag in every game.

| PGN | kind | read | parsed | 3-fold (A2) | before root | inside | A3 | A3 family | A4 (lost/drawn) | A4 family | A6 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `qe-ABC-204/raw/a4-e1910-baseline/r.pgn` | R | 200 | 200 | 15 | 15 | 0 | 12 | 12 | 0 | 0 | 0 |
| `qe-ABC-204/raw/a4-e1650/r.pgn` | R | 200 | 200 | 6 | 6 | 0 | 5 | 5 | 0 | 0 | 0 |
| `qe-epic008-close/raw/r1/r.pgn` | R | 200 | 200 | 7 | 7 | 0 | 4 | 4 | 0 | 0 | 0 |
| `qe-epic008-close/raw/r2/r.pgn` | R | 200 | 200 | 7 | 7 | 0 | 5 | 5 | 0 | 0 | 0 |
| `qe-ABC-204/raw/a5/d.pgn` | D | 99 | 99 | 51 | 51 | 0 | 17 | 28 | 0 | 1 | 0 |
| `qe-ABC-207/raw/d1/d.pgn` | D | 400 | 400 | 218 | 218 | 0 | 38 | 108 | 0 | 1 | 3 |
| `qe-ABC-207/raw/d2/d.pgn` | D | 400 | 400 | 200 | 200 | 0 | 41 | 93 | 1 (0/1) | 2 | 5 |
| `qe-ABC-208/raw/d1/d.pgn` | D | 400 | 400 | 208 | 208 | 0 | 66 | 123 | 0 | 1 | 3 |
| `qe-ABC-209/raw/d1/d.pgn` | D | 400 | 400 | 171 | 171 | 0 | 37 | 73 | 5 (2/3) | 14 | 1 |
| `qe-ABC-209/raw/d2/d.pgn` | D | 400 | 400 | 156 | 156 | 0 | 36 | 73 | 10 (2/8) | 16 | 3 |
| `qe-ABC-210/raw/d1/d.pgn` | D | 400 | 400 | 213 | 213 | 0 | 57 | 104 | 1 (0/1) | 2 | 3 |
| `qe-ABC-210/raw/d2/d.pgn` | D | 400 | 400 | 212 | 212 | 0 | 58 | 110 | 1 (0/1) | 1 | 2 |
| `qe-ABC-215/raw/d1/d.pgn` | D | 400 | 400 | 201 | 201 | 0 | 65 | 117 | 4 (1/3) | 8 | 2 |
| `qe-epic008-q4c/raw/d/d.pgn` | D | 100 | 100 | 53 | 53 | 0 | 20 | 34 | 1 (0/1) | 2 | 0 |
| **total** | | **4199** | **4199** | **1718** | **1718** | **0** | **461** | **889** | **23 (5/18)** | **48** | **22** |

`a5` holds 99 games because its own `summary.txt` records "99 finished, 99 in the PGN, 100 pinned". The PGN never held the hundredth game, so the scan dropped nothing.

## A2 draws by repetition: 1718 (R 35, D 1683). The first occurrence lies before the root in all 1718 and inside the search in 0
- The repetition was completed by skytalix in 885 games, by `base` in 822 and by Stockfish in 11.
- **Why "inside" is 0 by construction, and not a sampling result.** The third occurrence stands at the final ply N. Two occurrences of one position with the same side to move are at least 4 plies apart. So the earlier occurrences are at ≤ N−4 and ≤ N−8. The root of the skytalix search that completed the repetition is N−1 or N−2. `repeatsInPath` scans only `keys[0..ply]` of its own search (`src/search.ts:129-136`; `keys[0]` = root, `src/engine.ts:549`). No earlier occurrence of a game-ending threefold can ever be on that path. Measured: the smallest gap from the root back to the previous occurrence is 2 plies, and every first occurrence lies before the root.
- 311 of the 1718 completing searches (6 of 35 in R) reported exactly 0.00. That fits an in-path cycle back to the search's own root being scored a draw. It is `UNKNOWN - verify` which line the search saw; the records do not show it.

## A3 from a won score: 461 (R 26, D 435). Family view: 889
- **R games: skytalix's last eval was ≥ +100 cp in 26 of the 35 R repetition draws.** Stockfish's eval at the same move, turned to skytalix's view, was:
  - ≥ +100 in **4**: `a4-e1910-baseline` #10 (+766 / SF +418), #60 (+215 / +125), #85 (+629 / +232); `epic008-close/r2` #53 (+312 / +222);
  - 1–99 in 2;
  - exactly 0.00 in **20**. In those 20, Stockfish judged the position a draw, so skytalix's advantage was probably not real (a perpetual or a forced cycle). Whether the 4 SF-agreed games had a winning non-repeating move is `UNKNOWN - verify`. The probe is a single-position search at each root, with the repeating move excluded.
- Who completed it, among the 461: skytalix 246, the opponent 215 (R: 17 and 9).
- skytalix's eval among the 461: median +234 cp, 163 at ≥ +300, minimum +100, no mate score.
- R games: `a4-e1910-baseline` #10, #27, #30, #60, #83, #84, #85, #104, #105, #125, #168, #193; `a4-e1650` #8, #31, #36, #115, #130; `epic008-close/r1` #63, #64, #74, #76; `epic008-close/r2` #1, #18, #53, #175, #183. R repetition draws not in A3: `e1910` #72, #92, #182; `e1650` #93; `r1` #101, #108, #179; `r2` #67, #127. The D list (435 games) is in `raw/scan.txt` § "A3 strict games".

## A4 after avoiding one: 23 strict (5 lost, 18 drawn), R 0. Family view: 48
- **Lost (5):** `ABC-209/d1` #108 (ply 136, −276, played Kg7 where Kh7 repeats) and #376 (ply 150, −230, Rf6 where Re6 repeats); `ABC-209/d2` #32 (plies 100–106, −215 to −221) and #62 (ply 87, −435, h5 where Kg7 repeats); `ABC-215/d1` #138 (ply 91, −318, h6 where Kg7 repeats).
- **Drawn (18):** `207/d2` #44; `209/d1` #312, #326, #339; `209/d2` #74, #95, #182, #203, #246, #279, #366, #398; `210/d1` #133; `210/d2` #295; `215/d1` #162, #326, #362; `q4c` #83. 16 of the 18 still ended by threefold and 2 by the fifty-move rule. skytalix drew anyway in each, so none of the 18 cost a result.
- 15 of the 23 are in the `ABC-209` readings (TT kept across the game). That is a pattern, not a cause: `UNKNOWN - verify`.

## A5 the ruling it feeds: total ≥ 1, so ABC-230 stays in milestone 1
- **All games: A3 461 + A4 23 = 484** (484 distinct games; A3 and A4 do not overlap).
- **R games alone: A3 26 + A4 0 = 26.**
- The ticket's rule: a total ≥ 1 keeps `ABC-230` in milestone 1. The ruling holds under every narrower reading:
  - Stockfish-agreed R games only: 4;
  - A4 lost games only: 5;
  - the family view (base counted too): 889 + 48 = 937.
- BA/PM makes no milestone-2 move.

## A6 ep: 22 of the 1718 A2 repetitions, all in D. Graded nothing
In 22 games, an ep-normalised key (ep square kept only when a legal ep capture exists) counts the repeated position's third occurrence one occurrence earlier than the repository key (`ADR-0020` d2). These are exactly the 22 games where cutechess declared a threefold while the repository's key counts only two occurrences. So **cutechess counts with an ep-normalised key; the repository's own game-end count (`src/history.ts` `repetitionCounts`) would reach the threefold one occurrence later in those 22**:
- `207/d1` #98, #298, #367;
- `207/d2` #2, #16, #98, #216, #367;
- `208/d1` #130, #298, #387;
- `209/d1` #340;
- `209/d2` #74, #364, #372;
- `210/d1` #73, #340, #358;
- `210/d2` #158, #358;
- `215/d1` #126, #349.

Two of the 22 are also in A3. Outside A2, there are 0 games where the ep-normalised key reaches a third occurrence before the repository key. Information for Q3 only.

## Test notes (hand-read)
1. **D, ends by repetition:** `qe-ABC-215/raw/d1/d.pgn` #164 (base–skytalix, 15 plies). After 3...Kxf7 every move is reversible. 4.Ne5+ (ply 7), 6.Ne5+ (11) and 8.Ne5+ (15) all reach the same position: Ne5, Kf7, Black to move. The script gives `[7, 11, 15]`, completer `base`, skytalix root 13, skytalix's last eval −5 cp, so the game is not A3. **Agrees.**
2. **R, no repetition:** `qe-ABC-204/raw/a4-e1910-baseline/r.pgn` #1 (skytalix–stockfish, 1-0, `PlyCount` 63). It ends 32.R1e7# "White mates", and the last irreversible move is 29...a5 (ply 58). Only 5 plies follow, so no position can recur. The script gives 63 plies and a highest occurrence count of 1. **Agrees.**
3. **Extra, A4 lost:** `qe-ABC-209/raw/d1/d.pgn` #108. 64.g5 (ply 127) is the last irreversible move. Ra6 + Kh7 stands at plies 128 and 132, so 68...Kh7 at ply 136 would have been the third occurrence. skytalix (−2.76) played 68...Kg7 and was mated later. **Agrees.**

## Unknowns (named, not papered)
- Whether skytalix's +eval in the 20 R A3 games where Stockfish said 0.00 was a misjudgment of a forced draw (the most likely reading) or a real lost win. Probe: a single-position search at each root with the repeating move excluded, under 5 min of CPU.
- What the 0.00 reports at 311 completions mean (an in-path cycle to the root) and the `ABC-209` concentration in A4: `UNKNOWN - verify`.
