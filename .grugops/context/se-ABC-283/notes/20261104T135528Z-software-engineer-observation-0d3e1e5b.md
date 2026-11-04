---
id: 20261104T135528Z-software-engineer-observation-0d3e1e5b
kind: observation
by: software-engineer
at: 2026-11-04T13:55:28Z
verified_by: 
confidence: high on every deterministic count (fixed depth or frozen clock, under the host lock); medium on lane wall times (shared host; interleaved base/head)
refs:
  - se-ABC-283
  - grugops/ABC-283
  - ABC-283
  - ABC-233
  - ABC-234
  - ABC-236
  - EPIC-011
  - O1h
  - O3s
  - S1
  - ADR-0063
  - ADR-0065
  - ADR-0066
  - ADR-0064
  - ADR-0069
  - ADR-0026
  - ADR-0050
  - ABC-279
  - ABC-122
  - ABC-084
  - P0
  - G1
  - F2
  - NFR-008
  - NFR-009
  - orch-2026-10-30a
  - 4c4cb03d
  - 09694a4e
  - 0d573303
  - d15752cc
  - 2b192331
  - src/search.ts
  - src/engine.ts
  - src/see.ts
  - src/search.bundle.test.ts
  - src/see.test.ts
  - src/engine.capacity.test.ts
  - src/search.futility.test.ts
  - src/evaluate.taper.test.ts
  - src/quiescence.test.ts
  - src/search.null-move.test.ts
  - src/search.test.ts
  - src/engine.test.ts
supersedes: 
seal: sha256:1f609edb9056332bf4c5205e8e4e92fcdf722459b05f7e25e33ae0d017b51791
---

# se-ABC-283 acceptance, the brief's bars on `grugops/ABC-283` (tests at `2b192331`):

- **MET:** P0, zugzwang 7/7, G1, typecheck, lint, build, and the default lane ≤ 10 s.
- **NOT MET: the ADR-0064 d7 mate floor.** The shipped `search()` loses 1 of 190 same-depth d5 mates and `chooseMove` 2 of 188, all KRK. The history part alone causes it.

Each count below is deterministic: a fixed depth, or `chooseMove` on a frozen clock with `maxDepth`. Every run was under the host lock. Raw output is in `raw/out/` and the drivers in `raw/scripts/`.

## P0: all three off equals main exactly. MET.

- `main` `09694a4e` `search()` / `chooseMove(maxDepth)` against the branch's `searchWithoutBundle` / `chooseMoveWithoutBundle`, at depths 6, 7 and 8 on kiwipete and position-6. **Byte-identical JSON**: nodes, score and move (`p0-main.jsonl` = `p0-branch-alloff.jsonl`).
- At d8: `search()` 605 117 / 406 787 and `chooseMove` 766 275 / 87 475.
- Pinned as deep rows: `src/search.bundle.test.ts` P0, and ABC-279 A4 (a), re-pointed with unchanged figures. Both green.

## ADR-0064 d7 safety rows, on the shipped path

| row | reading | bar |
|---|---|---|
| zugzwang (ADR-0050 d9 seven rows, recorded depths, shipped `chooseMove`) | **7 / 7** (e1f1 d9, b6c6, c6d6, d6e6, e6f6 d8, h3h4 d11, f4d5 d12) | MET |
| G1 (`ABC-084` 58 puzzles, the baseline's budget and virtual clock) | **54 / 58**, newly missed [], newly solved []. The all-off door reads the same 54. | MET |
| mate floor, `search()` d5 → d5 on the 287, against `searchWithoutBundle` (and the older doors' rows: ABC-268 A3 (b), ABC-279 A3 (b), ABC-269 B2) | **1 of 190 violated**: `6k1/R7/5K2/8/8/8/8/8 w - - 2 2`, 29995 → 652 | **NOT MET** |
| mate floor, `chooseMove` d5 → d5, against `chooseMoveWithoutBundle` | **2 of 188**: `8/7k/5K2/8/8/8/8/5R2 w - - 2 2` and `8/k7/2K5/8/8/8/8/1R6 w - - 2 2`, each 29995 → 652 | **NOT MET** |
| mate floor, `chooseMove` d6 → d6 (a report) | 4 of 209, all KRK, −29994 → −652 | report |
| mate floor, `search()` d4 → d5 (the older form, a report) | 0 of 163 | report |

**Attribution, part by part** (`bars-mate.jsonl`, `bars-mate-parts.txt`):

- `searchWithoutHistory` d5: 0 of 190. `searchWithoutSeeOrdering` d5 reads the same violation.
- All 6 `chooseMove` misses come back as the door's exact mate score with history off. Aspiration-off and SEE-off keep the miss.
- **So the miss is the history table's (ADR-0063), alone.**
- The KRK row: `search` d5 plays f6e5 at 652. `searchWithoutHistory` d5 plays a7b7 at 29995. Both read 29995 at d6 and d7. `chooseMove` d5 finds a7a8 at 29995 on that row.
- The build matches the probe's H1 rule by rule:
  - the same index, gravity, d² bonus and malus;
  - malus only on searched quiet moves before the cutter;
  - cleared per search;
  - the same root ordering.
- ADR-0063 measured 0 / 189 on `e72487e1`, before the taper (ABC-269) and Q1 (ABC-279). The mechanism is ADR-0063 d11: reordering moves which quiet moves LMR reduces and futility skips. **Not tuned** (ADR-0063 § Status: no form is tuned after the read).

## Other gates

- **Typecheck, lint, build:** 0, 0, 0.
- **Skip count:** 0.
- **`npm test`:** 2 665 / 2 665 green (base 2 650; +15, all `src/search.bundle.test.ts`).
- **Default-lane time (NFR-008 ≤ 10 s), MET:** 6 interleaved base/head pairs at `2b192331`. Base `main` median **9.39 s** [9.33, 9.59]; head median **9.65 s** [9.54, 9.88]; +0.26 s.
  - The first build of the test file (`d15752cc`) read a head median of 10.06 s against base 9.56 s, interleaved 5/5. Its two heavy rows (195 ms and 228 ms) were slimmed at `2b192331`: the file went from 583 to 155 ms of test time, with the same assertions on cheaper positions.
- **Deep lanes:**
  - Green: search, null-move 45, pvs-lmr, quiescence, tt (both lanes), engine 83, ordering (both lanes), levels 58, puzzle 18, zobrist 33, tune 17, cli 11, uci 13, uci-session 241, and bundle 19 of 21.
  - The only red rows are the mate floors above: futility 52/53, see 51/52, taper 168/169, bundle 19/21.
  - Not run: the self-play ladder lane, because it plays games (the brief says no games).

## Node ratios, bundle / main, d8 (information, not a bar)

| root | `search()` | `chooseMove` |
|---|---|---|
| kiwipete | **0.8503** (605 117 → 514 521) | **0.9184** (766 275 → 703 710) |
| position-6 | **0.5464** (406 787 → 222 273) | **1.1100** (87 475 → 97 096) |
| startpos | 0.4352 | 0.5178 (move b1c3 → g1f3) |
| position-3 | 0.8650 | 1.0020 |
| position-4 | 0.9433 | 0.9831 |
| position-5 | 0.8242 | 0.9691 |

- The root move and score are the door's at d8 on kiwipete and position-6, in both recursions. That is pinned as a deep row.
- Per part, with one part off (`r-nohist`, `r-nosee`, `r-noasp`.jsonl): SEE ordering drives the position-6 `chooseMove` rise. It reads 1.0898 with history off and 0.9643 with SEE ordering off. Aspiration takes kiwipete `chooseMove` from 0.9515 (aspiration off) to 0.9184.

## Aspiration scan (information)

- `chooseMove` against `chooseMoveWithoutAspiration` at maxDepth 6 over the 190 and the 287.
- 40 rows fail high at the root (most of them mates first found at iteration 5 or 6). Every one ends on the door's move and score.
- 3 rows end on a different value without any fail high, through narrower-window table bounds. These are a report against ADR-0066 d10's 25 cp: e7e6 28 vs 33, g8f6 −41 vs b8c6 −43, and a KRK −609 vs −613.
