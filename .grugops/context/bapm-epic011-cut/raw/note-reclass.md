# bapm-epic011-cut re-classification of the evaluation-lever probe (records only): 22 of the 145 positions are duplicates; on the 123 unique, 25 of 38 errors persist through two doublings (65.8 %, the headline holds); E1's chosen form fixes 1 of the 25; 22 of the 25 sit at phase ≥ 7, 14 with queens on, 8 with a passer, 3 at phase ≤ 6

BA/PM, task `bapm-epic011-cut`. No engine run: `raw/classify.py` reads `arch-next-pull/raw/probe/` (`positions.jsonl`, `out/sf16.jsonl`, `out/play{47000,94000,188000}.jsonl`) and `arch-E1/raw/probe/out/` (`play-L.jsonl`, `play-BASE.jsonl`, `sf16-LP.jsonl`), run once under `flock <host-test.lock> python3 -I`. Output: `raw/classify.out`. Error = Stockfish 19 depth-16 loss ≥ 50 cp for the move played; phase = N 1, B 1, R 2, Q 4, clamped to 24; passer = no enemy pawn ahead on the same or adjacent files.

## Duplicates
- 145 positions, **123 unique** (board, side, castling, en passant). 22 duplicate groups of two: games n and n + 200 of the 400-game C3″ PGN replay the same opening (both builds deterministic), e.g. g49/g249, g153/g353, g193/g393, g17/g217, g177/g377.
- The full-set figures (48 → 31) re-read on unique positions: **38 errors at 47 000 nodes, 25 persist at 188 000 (65.8 %)**. The pre-registered reading (≥ 50 % → evaluation is the bigger lever) is unchanged.
- By ply, unique: 20 plies 7 of 13 persist; 40 plies 10 of 15; 60 plies **8 of 10** (the full set read 11 of 13).

## Where the 25 persistent errors sit (unique positions)
| class | positions | errors 1× | persist 4× |
|---|---|---|---|
| phase 0–6 | 17 | 4 | 3 |
| phase 7–15 | 54 | 14 | 11 |
| phase 16–24 | 52 | 20 | 11 |
| queens on | 64 | 24 | 14 |
| no queens | 59 | 14 | 11 |
| passer on rank 5–7 | 8 | 2 | 2 |
| any passer (of the 25) | — | — | 8 |
| queens on and phase ≥ 7 (of the 25) | — | — | 14 |

## E1 (ADR-0064 form L) against the persistent errors
- E1-L at 47 000 nodes: 39 errors on the unique set against base's 38 (the ADR's "level with `main`").
- **Of the 25 persistent errors, 24 are still errors under E1-L.** E1 does not act where the persistent errors sit on this corpus.

## Limits
- A small corpus from one control; an error class is a correlation, not a cause; a residual can be a horizon miss.
- Duplicates affect only counts, not any bar: every PREREG fixed this instrument as information only.
