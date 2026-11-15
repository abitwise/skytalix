# qe-ABC-323 stage C, L5 night 4 and the full 200-game reading at E 2 280, read against PREREG `…1d9e9a62`. Every validity line is MET. Night 4: 3 clean chunks, 30 games, openings 86–100, next start 101; 24 / 3 / 3, 25.5 / 30 = 85.00 %, X = 2 581.3 ± 197.7. The full reading (20 chunks, openings 1–100): 133 / 60 / 7, 136.5 / 200 = 68.25 %, X = 2 412.9 ± 51.1. skytalix latency max 4 004 ms over 200 games, 0 time losses. Night 4 not SHARED (1 foreign vitest sample of 1 176). Night 4 ran 3 h 18 min against the 3 h 22 min estimate

QE/E2E, task `qe-ABC-323`, stage C, branch `grugops/qe-ABC-323` from `main` `44f27463`, 2026-11-15 from 01:48Z. QE played no game and started no engine. Under `flock <scratch>/host-test.lock`, QE re-ran `rsum` over night 4's three chunk dirs and qe-ABC-320's sealed `raw/scripts/read.mjs 5 2280 4000` over them. Both outputs are byte-equal to the session's `rsum.txt` and `read.txt`. QE then ran `rsum` and `read.mjs` over the 20 chunk dirs of nights 1–4, over scratch and over the owner's durable copy. Paths are placeholders (`ADR-0049` d4).
- Records (redacted with qe-ABC-320's `raw/redact.sh`, unchanged): `raw/out/l5-e2280-n4/` (`cSSS/` per chunk, `night/`), `raw/out/l5-full/` (the 200-game pool), `raw/out/README.txt`.
- The raw chunk out-dirs, with the full `r.out`, stay in `<scratch>/l5-e2280-n4`. Nothing was deleted.
- Sources: the brief `qe-ABC-323`, the cut note `orch-2026-10-30a/…481f29ee`, the PREREG `…1d9e9a62`, ABC-317's PREREG `…e6cf1088` (the band rule at 200, which `…1d9e9a62` adopts), and night 3's stage C (`…3809c084`, `…a42953f6`).

## The session
- `night.sh 2280 86 <out-root> <repo>`, launched under the host lock on W (`…481f29ee`, the owner's word, conditional on a quiet host) by an orchestrator waiter on its first quiet check.
  - The waiter's check at 22:28:46Z: load1 0.85, foreign vitest / cutechess-cli / stockfish / node 0 / 0 / 0 / 0, lock free. The orchestrator's own check 30 s earlier (22:28:16Z, in the cut note) saw foreign vitest 2 and load1 0.83.
  - Start 2026-11-14T22:28:47Z. Exit 0 at 2026-11-15T01:46:52Z, el 11 885 s.
- Gates 1–3 passed: three chunks launched, and a gate miss exits 3 or 4 before any chunk.
  - The pins: every chunk's `machine.txt` reads `= pin` for `cutechess-cli` 1.5.1 and Stockfish 19; the openings sha256 is `0d7f7a72…`.
  - The trees: `<repo>` was qe-ABC-320's worktree at `7469531f`, `tools/` `2ae53ab1`, `src/` `b668b153`, clean today.
  - The sealed scripts check OK against `raw/scripts/SHA256SUMS` in that worktree.
  - W-check at 22:28:47Z: load1 0.85, Tctl 36.2, foreign 0 / 0 / 0 / 0.
- All three chunks record `harness: <repo> at 7469531f` and the `dist/` tree `2fa9933e…`, as nights 1–3 did (20 of 20).

| chunk | openings | W/L/D | depth guard (below 6) | plies | wall |
|---|---|---|---|---|---|
| c086 | 86–90 | 8/1/1 | 0 of 408 | 820 | 3 153 s |
| c091 | 91–95 | 8/1/1 | 0 of 543 | 1 089 | 4 244 s |
| c096 | 96–100 | 8/1/1 | 0 of 573 | 1 150 | 4 487 s |

- Launches came at el 0, 3 153 and 7 397 s, all at or under 20 400.
- The session ended on `openings 1-100 done`, not on the guard. `next-start` reads `next start: 101`.
- RUNAWAY and THERMAL did not fire. Each chunk's build clone was deleted, and none is left.
- The three chunks each read 8 / 1 / 1. QE checked that they are not one chunk thrice: their `r.pgn` sha256 differ (`0841ba6c…`, `e1e70d56…`, `03381737…`), their plies differ (820, 1 089, 1 150), and `read.mjs` finds 15 distinct openings 86–100 with 0 FEN mismatches.

## Validity of night 4, line by line against the PREREG
1. **Every launched chunk clean, no VOID: MET.** 3 launched, 3 `clean`.
   - Each chunk had tool exit 0, `games: 10 of 10`, `faults: 0  unclassified: 0  move-cap draws: 0`, and both stderr files at 0 bytes.
   - Each chunk's harness `SHA256SUMS` checks OK on the raw dir.
2. **skytalix 0 time losses: MET.** PGN result text 0, `loses on time` lines in `r.out` 0. No `illegal`, `disconnect`, `stall` or `crash` line appears in any `r.out`.
   - Terminations: 27 mates (skytalix won 24: 14 `White mates`, 10 `Black mates`; lost 3: 2 and 1), 1 `Draw by 3-fold repetition`, 1 `Draw by fifty moves rule`, 1 `Draw by insufficient mating material`.
3. **Options and `go` reached every engine process: MET.**
   - `Skill Level 5`: 30 of 30 processes with a `go`, 0 missing or other.
   - `UCI_Elo 2280`: 30 of 30, 0 missing or other.
   - `go movetime 4000`: skytalix 1 535, Stockfish 1 524, any other `go` 0.
4. **The chunk check in every pooled chunk: MET.**
   - Depth guard 0 of 1 524 Stockfish moves below depth 6 (`pickDepth(2280)` = 6).
   - `state: rating` in all three.
   - The control line is byte-equal to `control: skytalix Skill Level=5 st=4 timemargin=50, stockfish st=4 timemargin=2000`.
   - The `start: S (openings S–S+4)` lines are right.
   - `cmd.txt` has `'option.Skill Level=5'`, `option.UCI_Elo=2280` and `order=sequential start=S -repeat -games 2 -rounds 5 -concurrency 1 -maxmoves 200`. All 20 `cmd.txt` of nights 1–4 are byte-equal once ` start=S ` is masked.
   - All three read `± nan` on their own line (8 / 1 / 1: the 95 % upper score bound passes 1). Their state is still `rating`; the pooled figures are unaffected.
5. **`rsum` pools without a refusal: MET.** 3 segments, state `rating`, openings 86–100 contiguous (= next start − 1).
- **No skytalix fault and no product finding on `cddd4df9`.**

## Night 4's own figure (15 % of the 200; not L5's figure)
- W / L / D (skytalix): **24 / 3 / 3**. Points **25.5 / 30 = 85.00 %**. Draw ratio 10.0 %.
- `cutechess-cli` 1.5.1's formula: **Δ = +301.3 ± 197.7** against E, **X = 2 581.3 ± 197.7** (2 383.6–2 779.0). QE's own recomputation gives + 301.3 ± 198.2.
- Colour split: as White 14.0 / 15 = 93.3 %; as Black 11.5 / 15 = 76.7 %.
- Intervals: iid SE(score) 0.0595, ± 158.8 Elo; opening-cluster (15 clusters of 2) SE 0.0535, ± 142.7, deff 0.808.
- Opening pairs: 9 swept 2–0, 3 at 1.5, 3 split 1–1, 0 lost 0–2.
- Night 4's 95 % iid score interval: 0.850 ± 1.96 × 0.0595 = 73.3–96.7 %, not wholly above 75 %.
- **Against nights 1–3 (65.29 %):** 19.7 points higher, about 2.8 SE of the difference (post hoc, one of four nights). Over the four nights (65.8, 59.0, 70.0, 85.0 %; 60, 50, 60, 30 games) a heterogeneity χ² is 6.1 on 3 df, p ≈ 0.11. No evidence the nights disagree; the last 30 games did move the figure +23.1.

## The full reading over nights 1–4 (200 games, L5's figure if every PREREG line holds)
`rsum` over the 20 chunk dirs: 20 segments, state `rating`, `openings covered: 1–100 (100 of 100)`, no refusal.
- W / L / D (skytalix): **133 / 60 / 7**. Points **136.5 / 200 = 68.25 %**. Draw ratio 3.5 %.
- `cutechess-cli` 1.5.1's formula: **Δ = +132.9 ± 51.1** against E. **X = 2 280 + 132.9 ± 51.1 = 2 412.9 ± 51.1** (2 361.8–2 464.0).
  - QE's own recomputation from 133 / 7 / 60 gives + 132.9 ± 51.2 (0.1 off the tool, as on every night).
  - The orchestrator's figure, 133 / 60 / 7, 68.2 %, 2 412.9 ± 51.1, is re-derived and confirmed.
- **Colour split:** as White 67.0 / 100 = 67.0 %; as Black 69.5 / 100 = 69.5 %. The difference is about 0.4 SE.
- **Intervals:**
  - iid (trinomial, `read.mjs`): SE(score) 0.0323, ± 50.8 Elo.
  - Opening-cluster interval (100 clusters of 2): SE 0.0316, **± 49.6 Elo**, deff 0.953.
- **Opening pairs:** 42 swept 2–0, 7 at 1.5, 42 split 1–1, 9 lost 0–2.
- **Validity over all 20 chunks:** 20 / 20 clean (6, 5, 6, 3 by night), no VOID; depth guard 0 of 10 429 below 6; `state: rating` and `faults: 0  unclassified: 0  move-cap draws: 0` in all 20; `Skill Level 5` and `UCI_Elo 2280` 200 / 200; `go movetime 4000` skytalix 10 466, Stockfish 10 429, other 0.
- Terminations over 200: 193 mates (won 133: 66 `White mates`, 67 `Black mates`; lost 60: 28 and 32) and 7 draws (1 threefold, 3 fifty-move, 3 insufficient material); time losses 0.
- All 20 chunks share the `dist/` tree `2fa9933e…`. Their two harness commits (`740008a6` for night 1, `7469531f` for nights 2–4) carry the same trees, `tools/` `2ae53ab1` and `src/` `b668b153` (QE re-checked with `git rev-parse`).
- **The durable copy:** `diff -rq` scratch against `<durable>/skytalix-ratings/` is equal for all four nights (77, 65, 77 and 41 files), and the night-4 console is byte-equal. `rsum` over the durable copy's 20 chunk dirs gives the same lines but for the segment path prefix; `read.mjs` over it is byte-equal.

## The band rule at 200, as sealed
- **ABC-317's form, adopted by `…1d9e9a62`:** 50.0 ≤ P ≤ 150.0 confirms E, and X is the level's figure. **P = 136.5: MET. No step.**
- **The PREREG's interval form:** 0.6825 ± 1.96 × 0.0323 = **61.9–74.6 %**, not wholly above 75 % nor wholly below 25 %. **Not triggered.**
- Night 3's stage C called this in advance: at 200 games the pool could only land in 55.5–70.5 %. It landed at 68.25 %.

## Latency (reported, not graded)
- **Night 4, skytalix:** 1 535 moves; median 4 001, p95 4 002, p99 4 003, max **4 003 ms**. 0 over 4 010 ms; 0 at or over the 4 050 ms margin.
- **Night 4, Stockfish:** 1 524 moves; median 4 000, p95 4 001, p99 4 001, max 4 002 ms. 0 over 4 010; 0 at or over 4 050.
- **All 200 games:** skytalix 10 466 moves, median 4 001, p95 4 002, p99 4 002, max **4 004 ms**; Stockfish 10 429 moves, max 4 003 ms. 0 over 4 010 and 0 at or over 4 050 on either side.

## FL (class and count only; changes no line of the read)
- `sampler.log` holds 1 176 samples, every 10 s.
  - foreign `vitest`: **1 sample**, count 1, at el 10 884 s (01:30:11Z), in c096 after game 7, 275 s from the nearest game boundary, load1 1.23;
  - foreign `cutechess-cli`: 0;
  - foreign `stockfish`: 0;
  - foreign `node`: 0.
- The owner said another session was running just before launch. At 22:28:16Z an orchestrator check saw foreign vitest 2; 30 s later the waiter and gate 3 saw 0. In the window itself there is the one vitest sample above and nothing else. Whose it was is **UNKNOWN - verify**; count-only data cannot settle it.
- The harness's own `host.log` (232 lines over the three chunks) reads `foreign_vitest_procs=0` in every line (its cadence is about 51 s, so it can miss a single 10 s sample).
- **Not SHARED:** foreign vitest plus cutechess-cli in 1 of 1 176 samples (0.09 %), against the 20 % bar.
- Tctl was min 40.6, mean 71.1, max 74.9 °C; the worst median of 30 samples was 72.9 (THERMAL needs above 85). load1 mean 1.15, max 3.17. Free space was at least 6 517 MB, against the 1 536 MB gate.
  - The load1 peak (3.17, then 2.83, 2.55, decaying to 1.22 over 2.5 min) fell at el 7 791 s (00:38:38Z), in c096's second game, with every foreign class at 0 in those samples. Its source is **UNKNOWN - verify**; skytalix's latency held (night max 4 003 ms).
- QE's own host check at 01:48:39Z, before the re-runs: load1 0.31, Tctl 35.8, foreign 0 / 0 / 0 / 0.

## The walls against the estimate
| | estimate | night 1 | night 2 | night 3 | night 4 |
|---|---|---|---|---|---|
| plies a game | 85–180, central 120 (PREREG) | mean 98.6, median 87, max 214 | mean 113.7, median 96, max 302 | mean 104.0, median 91, max 294 | mean 102.0, median 89, max 250 |
| seconds a ply | 3.907 (smoke) | 3.855 | 3.837 | 3.842 | 3.871 (chunks 3.828–3.888) |
| overhead a chunk | about 10 s | 11–14 s | 13–18 s | 11–19 s | 10–19 s |
| chunk wall | 56–117 min, central 78 | 54.7–71.2 min, mean 63.5 | 55.9–86.7 min, mean 73.0 | 51.2–76.5 min, mean 66.8 | 52.6–74.8 min, mean 66.0 |
| night | night 4: 3 chunks, about 3 h 22 min (2 h 34 min–4 h 20 min) | 60 games; 6 h 21 min | 50 games; 6 h 05 min | 60 games; 6 h 41 min | **30 games; 3 h 18 min** (11 885 s) |
| worst chunk vs guard | 2 000 plies / 8 400 s | 1 109 / 4 274 s | 1 349 / 5 204 s | 1 189 / 4 588 s | 1 150 / 4 487 s |

- Night 4 ran 4 min under night 3's 3 h 22 min estimate, inside its range, and ended on `next start: 101` as projected.
- **The full reading:** 200 games in 4 nights, 80 711 s of session time (22 h 25 min), the PREREG's "about 4 nights at the central rate". Plies a game: mean 104.5, median 92, max 302 (opening 53); 3.849 s a ply; 402.1 s a game. The 20 chunk walls average 4 035 s (3 072–5 204). The worst 10-game sliding window is 1 446 plies (night 2); night 4's is 1 160. All are under the guard's 2 000-ply basis.
