# qe-ABC-322 stage C, L5 night 3 at E 2 280, read against PREREG `…1d9e9a62`. Every validity line is MET. 6 clean chunks, 60 games, openings 56–85; night 3 alone 41 / 17 / 2, 42.0 / 60 = 70.00 %, X = 2 427.2 ± 97.5. Pooled over nights 1–3 (170 games, openings 1–85): 109 / 57 / 4, 111.0 / 170 = 65.29 %, X = 2 389.8 ± 54.6, interim, 170 games, not L5's figure. Band probe not triggered. skytalix latency max 4 004 ms, 0 time losses. Not SHARED (0 foreign vitest or cutechess-cli samples of 2 380). 60 games in 6 h 41 min, the PREREG's 100-ply row

QE/E2E, task `qe-ABC-322`, stage C, branch `grugops/qe-ABC-322` from `main` `24d65ad1`, 2026-11-14 from 04:42Z. QE played no game and started no engine. Under `flock <scratch>/host-test.lock`, QE re-ran `rsum` over night 3's six chunk dirs and qe-ABC-320's sealed `raw/scripts/read.mjs 5 2280 4000` over them. Both outputs are byte-equal to the session's `rsum.txt` and `read.txt`. QE then ran `rsum` and `read.mjs` over the 17 chunk dirs of nights 1–3. Paths are placeholders (`ADR-0049` d4).
- Records (redacted with qe-ABC-320's `raw/redact.sh`, unchanged): `raw/out/l5-e2280-n3/` (`cSSS/` per chunk, `night/`, `pool-n1-n3/`, `README.txt`).
- The raw chunk out-dirs, with the full `r.out`, stay in `<scratch>/l5-e2280-n3`. Nothing was deleted.
- Sources: the brief `qe-ABC-322`, the cut note `orch-2026-10-30a/…dbb1a3ae`, the PREREG `…1d9e9a62`, and night 2's stage C (`…95c77b95`, `…0a088790`).

## The session
- `night.sh 2280 56 <out-root> <repo>`, launched by the orchestrator under the host lock on W (`…dbb1a3ae`, the owner's word for one 8 h window).
  - Start 2026-11-13T21:59:44Z. Exit 0 at 2026-11-14T04:40:38Z, el 24 054 s.
- Gates 1–3 passed. A gate miss exits 3 or 4 before any chunk, and six chunks launched.
  - The pins: every chunk's `machine.txt` reads `= pin` for `cutechess-cli` 1.5.1 and Stockfish 19; the openings sha256 is `0d7f7a72…`.
  - The trees: `<repo>` was qe-ABC-320's worktree at `7469531f`, whose `tools/` is `2ae53ab1` and `src/` `b668b153`, clean today.
  - The sealed scripts check OK against `raw/scripts/SHA256SUMS` in that worktree.
  - W-check: load1 0.21, Tctl 33.0, foreign vitest / cutechess-cli / stockfish / node 0 / 0 / 0 / 0.
- All six chunks record `harness: <repo> at 7469531f` and the `dist/` tree `2fa9933e…`, the same as nights 1 and 2 (17 of 17).

| chunk | openings | W/L/D | depth guard (below 6) | plies | wall |
|---|---|---|---|---|---|
| c056 | 56–60 | 8/1/1 | 0 of 476 | 955 | 3 708 s |
| c061 | 61–65 | 6/4/0 | 0 of 494 | 989 | 3 820 s |
| c066 | 66–70 | 4/6/0 | 0 of 595 | 1 189 | 4 588 s |
| c071 | 71–75 | 6/3/1 | 0 of 571 | 1 144 | 4 457 s |
| c076 | 76–80 | 9/1/0 | 0 of 399 | 802 | 3 072 s |
| c081 | 81–85 | 8/2/0 | 0 of 578 | 1 159 | 4 406 s |

- Launches came at el 1, 3 710, 7 530, 12 118, 16 575 and 19 647 s, all at or under 20 400.
- The guard refused chunk 86 at el 24 053 (24 053 + 8 400 > 28 800). `next-start` reads `next start: 86`.
- RUNAWAY and THERMAL did not fire. Each chunk's build clone was deleted, and none is left.

## Validity of night 3, line by line against the PREREG
1. **Every launched chunk clean, no VOID: MET.** 6 launched, 6 `clean`.
   - Each chunk had tool exit 0, `games: 10 of 10`, `faults: 0  unclassified: 0  move-cap draws: 0`, and both stderr files at 0 bytes.
   - Each chunk's harness `SHA256SUMS` checks OK on the raw dir.
2. **skytalix 0 time losses: MET.** PGN result text 0, `loses on time` lines in `r.out` 0. No `illegal`, `disconnect`, `stall` or `crash` line appears in any `r.out`.
   - Terminations: 58 mates (skytalix won 41: 20 `Black mates`, 21 `White mates`; lost 17: 8 and 9), 1 `Draw by fifty moves rule` and 1 `Draw by insufficient mating material`.
3. **Options and `go` reached every engine process: MET.**
   - `Skill Level 5`: 60 of 60 processes with a `go`, 0 missing or other.
   - `UCI_Elo 2280`: 60 of 60, 0 missing or other.
   - `go movetime 4000`: skytalix 3 125, Stockfish 3 113, any other `go` 0.
4. **The chunk check in every pooled chunk: MET.**
   - Depth guard 0 of 3 113 Stockfish moves below depth 6 (`pickDepth(2280)` = 6).
   - `state: rating` in all six.
   - The control line is byte-equal to `control: skytalix Skill Level=5 st=4 timemargin=50, stockfish st=4 timemargin=2000`.
   - The `start: S (openings S–S+4)` lines are right.
   - `cmd.txt` has `'option.Skill Level=5'`, `option.UCI_Elo=2280` and `order=sequential start=S -repeat -games 2 -rounds 5 -concurrency 1 -maxmoves 200`. All 17 `cmd.txt` of nights 1–3 are equal except for `start=`.
   - c056 (8 / 1 / 1), c076 (9 / 1 / 0) and c081 (8 / 2 / 0) read `± nan` on their own line: the 95 % upper score bound passes 1. Their state is still `rating`, and the pooled figure is unaffected.
5. **`rsum` pools without a refusal: MET.** 6 segments, state `rating`, openings 56–85 contiguous (= next start − 1).
- **No skytalix fault and no product finding on `cddd4df9`.**

## Night 3's own figure (30 % of the 200; not L5's figure)
- W / L / D (skytalix): **41 / 17 / 2**. Points **42.0 / 60 = 70.00 %**. Draw ratio 3.3 %.
- `cutechess-cli` 1.5.1's formula: **Δ = +147.2 ± 97.5** against E, **X = 2 427.2 ± 97.5** (2 329.7–2 524.7). QE's own recomputation gives + 147.2 ± 97.7.
- Colour split: as White 21.5 / 30 = 71.7 %; as Black 20.5 / 30 = 68.3 %.
- Intervals: iid SE(score) 0.0585, ± 94.8 Elo; opening-cluster (30 clusters of 2) SE 0.0650, ± 105.4, deff 1.236.
- Opening pairs: 15 swept 2–0, 2 at 1.5, 9 split 1–1, 4 lost 0–2.
- Night 3's 95 % iid score interval: 0.700 ± 1.96 × 0.0585 = 58.5–81.5 %, not wholly above 75 %.
- Against nights 1–2 (62.73 %): 7.3 points higher, about 1.0 SE of the difference. The nights read 65.8, 59.0 and 70.0 %; they agree.

## The pooled interim over nights 1–3 (labelled interim, 170 games, not L5's figure)
`rsum` over the 17 chunk dirs: 17 segments, state `rating`, openings 1–85 contiguous, no refusal.
- W / L / D (skytalix): **109 / 57 / 4**. Points **111.0 / 170 = 65.29 %**. Draw ratio 2.4 %.
- `cutechess-cli` 1.5.1's formula: **Δ = +109.8 ± 54.6** against E. **X = 2 280 + 109.8 ± 54.6 = 2 389.8 ± 54.6** (2 335.2–2 444.4).
  - QE's own recomputation from 109 / 4 / 57 gives + 109.8 ± 54.7 (0.1 off the tool, as on nights 1 and 2).
  - The orchestrator's figure, 109 / 57 / 4, 65.3 %, 2 389.8 ± 54.6, is re-derived and confirmed.
- **Colour split:** as White 53.0 / 85 = 62.4 %; as Black 58.0 / 85 = 68.2 %.
- **Intervals:**
  - iid (trinomial): SE(score) 0.0361, ± 54.3 Elo.
  - Opening-cluster interval (85 clusters of 2): SE 0.0350, ± 52.6 Elo, deff 0.940.
- **Opening pairs:** 33 swept 2–0, 4 at 1.5, 39 split 1–1, 9 lost 0–2.
- Over all 170: terminations 166 mates and 4 draws (two fifty-move, two insufficient material); time losses 0.
- `rsum` over the owner's durable copy of the same 17 dirs gives the same pooled lines (only the segment paths differ).
- The durable copy of all three nights is byte-equal to scratch (`diff -rq`: 77, 65 and 77 files), and so is the night-3 console.

## The band probe, as sealed
- Pooled: 95 % iid interval of the score 0.6529 ± 1.96 × 0.0361 = **58.2–72.4 %**.
  - It is not wholly above 75 % nor wholly below 25 %. The point estimate 65.3 % lies inside 25–75 %.
  - **Not clearly outside the band. The probe is not triggered and no step is due.** By the PREREG, night 4 continues from opening 86 at E 2 280, on a new W.
- Night 3 alone, 58.5–81.5 %, is not triggered either.

## Latency (reported, not graded)
- **Night 3, skytalix:** 3 125 moves; median 4 001, p95 4 002, p99 4 002, max **4 004 ms**. 0 moves over 4 010 ms; 0 at or over the 4 050 ms margin.
- **Night 3, Stockfish:** 3 113 moves; median 4 000, p95 4 001, p99 4 001, max 4 002 ms. 0 over 4 010; 0 at or over 4 050.
- **Pooled, 170 games:** skytalix 8 931 moves, max 4 004 ms; Stockfish 8 905 moves, max 4 003 ms. 0 over 4 010 and 0 at or over 4 050 on either side.

## FL (class and count only; changes no line of the read)
- `sampler.log` holds 2 380 samples, every 10 s.
  - foreign `vitest`: 0;
  - foreign `cutechess-cli`: 0;
  - foreign `stockfish`: 0;
  - foreign `node`: 6 samples, count 1 each, in chunks 61 (twice), 71, 76 and 81 (twice), each 42–393 s from the nearest game boundary. What they were is **UNKNOWN - verify**; count-only data cannot settle it.
- The harness's own `host.log` (469 lines over the six chunks) reads `foreign_vitest_procs=0` in every line.
- **Not SHARED:** foreign vitest plus cutechess-cli in 0 of 2 380 samples (0 %), against the 20 % bar.
- Tctl was min 40.5, mean 71.3, max 75.5 °C; THERMAL needs a median above 85. load1 mean 1.18, max 2.54. Free space was at least 6 261 MB, against the 1 536 MB gate.
  - The load1 peak (2.54, then 2.30 and 2.10) fell at el 19 910–19 930 s, in c081's first game, with every foreign class at 0 in those samples. Its source is **UNKNOWN - verify**; skytalix's latency held.
- QE's own host check at 04:42:15Z, before the re-runs: load1 0.50, Tctl 36.2, foreign 0 / 0 / 0 / 0.

## The walls against the estimate
| | PREREG estimate | night 1 | night 2 | night 3 |
|---|---|---|---|---|
| plies a game | 85–180, central 120 | mean 98.6, median 87, max 214 | mean 113.7, median 96, max 302 | mean 104.0, median 91, max 294 |
| seconds a ply | 3.907 (smoke) | 3.855 | 3.837 | 3.842 (chunks 3.792–3.879) |
| overhead a chunk | about 10 s | 11–14 s | 13–18 s | 11–19 s |
| chunk wall | 56–117 min, central 78 | 54.7–71.2 min, mean 63.5 | 55.9–86.7 min, mean 73.0 | 51.2–76.5 min, mean 66.8 |
| night | 30–70 games, central 50; end 6–7.5 h | 60 games; 6 h 21 min | 50 games; 6 h 05 min | **60 games; 6 h 41 min** (24 054 s) |
| worst chunk vs guard | 2 000 plies / 8 400 s | 1 109 plies / 4 274 s | 1 349 plies / 5 204 s | 1 189 plies / 4 588 s |

- Night 3 matched the PREREG's 100-ply row: 6 chunks, 60 games, about 6.5 h.
- Night 2's QE projection for night 3 (5 or 6 chunks, openings 56–80 or 56–85) was right: 6 chunks.
- The cut note expected an end near 6–6.5 h; the night ended at 6.68 h, about 10 min past that, inside the owner's 8 h window, with 4 746 s of the 8 h cap unused.
- The longest game of night 3 is 294 plies (c081, opening 84); the longest L5 game is still 302 (c051, opening 53). Night 3's worst 10-game sliding window is 1 238 plies; the worst over all 170 games is still 1 446 (night 2). Both are under the guard's 2 000-ply basis.

## Night 4 (an estimate, not a reading; UNKNOWN - verify)
- Openings 86–100 are left: 15 openings, 30 games, 3 chunks (c086, c091, c096).
- Night 4 runs `night.sh 2280 86 <new out-root> <repo>`. It ends when openings 1–100 are done (`next start: 101`), not on the guard.
  - All three chunks launch even at the guard's worst case: the third would launch by el 16 800 ≤ 20 400.
- The 17 chunks so far average 4 048 s (range 3 072–5 204 s).
- **Expected wall about 3 h 22 min** (3 × 4 048 s), within 2 h 34 min–4 h 20 min on the observed range. The worst case by the guard's basis is 7 h, inside the 8 h cap.
- **One more night.** It completes the 200 unless a chunk is VOID or not clean.
