# qe-ABC-320 stage C, L5 night 1 at E 2 280, read against PREREG `…1d9e9a62`. Every validity line is MET. 6 clean chunks, 60 games, openings 1–30. Interim: 39 / 20 / 1, 39.5 / 60 = 65.83 %, X = 2 393.9 ± 94.7, interim, 60 games, not L5's figure. Band probe not triggered. skytalix latency max 4 004 ms, 0 time losses. Host ALONE for the SHARED classes. The night ran 60 games in 6 h 21 min, inside the 30–70 estimate

QE/E2E, task `qe-ABC-320`, stage C, branch `grugops/qe-ABC-320` at `f456e625`, 2026-11-12 from 04:51Z. QE played no game and started no engine. Under `flock <scratch>/host-test.lock`, QE re-ran `rsum` over the six chunk dirs and `raw/scripts/read.mjs 5 2280 4000` over them. Both outputs are byte-equal to the session's `rsum.txt` and `read.txt`. Paths are placeholders (`ADR-0049` d4).
- Records (redacted, `raw/redact.sh` = qe-ABC-317's but its header): `raw/out/l5-e2280-n1/` (`cSSS/` per chunk, `night/`, `README.txt`).
- The raw chunk out-dirs, with the full `r.out`, stay in `<scratch>/l5-e2280-n1`. Nothing was deleted.
- Sources: the brief `qe-ABC-320` (Stage B and Stage C lines), the orchestrator's go `…b35596d8`, the PREREG `…1d9e9a62`, and stage A `…b9e8898d`.

## The session
- `night.sh 2280 1 <out-root> <repo>`, launched by the orchestrator under the host lock on W (2026-11-11).
  - Start 2026-11-11T22:28:53Z. Exit 0 at 2026-11-12T04:50:14Z, el 22 880 s.
- Gates 1–3 passed:
  - the pins;
  - the trees: the read sha's `src/` `b668b153`, the worktree's `tools/` `2ae53ab1` and `src/` `b668b153`, clean;
  - W-check: load1 0.22, Tctl 33.5, foreign vitest / cutechess-cli / stockfish / node 0 / 0 / 0 / 0.
- All six chunks record `harness: <repo> at 740008a6` and the same `dist/` tree `2fa9933e…`.
- The worktree's `tools/` and `src/` at today's tip `f456e625` are still `2ae53ab1` and `b668b153`.

| chunk | openings | W/L/D | depth guard (below 6) | plies | wall |
|---|---|---|---|---|---|
| c001 | 1–5 | 6/4/0 | 0 of 537 | 1 075 | 4 143 s |
| c006 | 6–10 | 6/4/0 | 0 of 554 | 1 109 | 4 274 s |
| c011 | 11–15 | 7/3/0 | 0 of 492 | 986 | 3 820 s |
| c016 | 16–20 | 7/3/0 | 0 of 426 | 854 | 3 284 s |
| c021 | 21–25 | 7/3/0 | 0 of 502 | 1 006 | 3 901 s |
| c026 | 26–30 | 6/3/1 | 0 of 441 | 884 | 3 456 s |

- Launches came at el 0, 4 144, 8 418, 12 239, 15 523 and 19 424 s, all at or under 20 400.
- The guard refused chunk 31 at el 22 880 (22 880 + 8 400 > 28 800). `next-start` reads `next start: 31`.
- RUNAWAY and THERMAL did not fire. Each chunk's build clone was deleted, and none is left.

## Validity, line by line against the PREREG
1. **Every launched chunk clean, no VOID: MET.** 6 launched, 6 `clean`.
   - Each chunk had tool exit 0, `games: 10 of 10`, `faults: 0  unclassified: 0  move-cap draws: 0`, and both stderr files at 0 bytes.
   - Each chunk's harness `SHA256SUMS` checks OK on the raw dir.
2. **skytalix 0 time losses: MET.** PGN result text 0, `loses on time` lines in `r.out` 0. No `illegal`, `disconnect` or `stall` line appears in any `r.out`.
   - Terminations: 34 `Black mates`, 25 `White mates`, and 1 `Draw by fifty moves rule`.
3. **Options and `go` reached every engine process: MET.**
   - `Skill Level 5`: 60 of 60 processes with a `go`, 0 missing or other.
   - `UCI_Elo 2280`: 60 of 60, 0 missing or other.
   - `go movetime 4000`: skytalix 2 962, Stockfish 2 952, any other `go` 0.
4. **The chunk check in every pooled chunk: MET.**
   - Depth guard 0 of 2 952 Stockfish moves below depth 6 (`pickDepth(2280)` = 6).
   - `state: rating` in all six.
   - The control line is byte-equal to `control: skytalix Skill Level=5 st=4 timemargin=50, stockfish st=4 timemargin=2000`.
   - The `start: S (openings S–S+4)` lines are right.
   - `cmd.txt` has `option.UCI_Elo=2280` and `order=sequential start=S -repeat -games 2 -rounds 5 -concurrency 1 -maxmoves 200`. The six `cmd.txt` are equal except for `start=`.
5. **`rsum` pools without a refusal: MET.** 6 segments, state `rating`, openings 1–30 contiguous (= next start − 1).
- **No skytalix fault and no product finding on `cddd4df9`.**

## The interim reading (labelled interim, 60 games, not L5's figure)
- W / L / D (skytalix): **39 / 20 / 1**. Points **39.5 / 60 = 65.83 %**. Draw ratio 1.7 %.
- `cutechess-cli` 1.5.1's formula: **Δ = +113.9 ± 94.7** against E. **X = 2 280 + 113.9 ± 94.7 = 2 393.9 ± 94.7** (2 299.2–2 488.6).
- **Colour split:** as White 17 / 12 / 1, 17.5 / 30 = 58.3 %; as Black 22 / 8 / 0, 22.0 / 30 = 73.3 %.
- **Intervals:**
  - iid (trinomial): SE(score) 0.0612, ± 92.6 Elo.
  - Opening-cluster interval (30 clusters of 2): SE 0.0593, ± 89.8 Elo, deff 0.940.
- **Opening pairs:** 12 swept 2–0, 1 at 1.5, 14 split 1–1, 3 lost 0–2.

## The band probe
- 95 % iid interval of the score: 0.6583 ± 1.96 × 0.0612 = **53.8–77.8 %**.
  - It is not wholly above 75 % nor wholly below 25 %. The point estimate 65.8 % lies inside 25–75 %.
  - **Not clearly outside the band. The probe is not triggered and no step is due.** By the PREREG, night 2 continues from opening 31 at E 2 280, on a new W.

## Latency (reported, not graded)
- **skytalix:** 2 962 moves; median 4 001, p95 4 002, p99 4 002, max **4 004 ms**. 0 moves over 4 010 ms; 0 at or over the 4 050 ms margin.
- **Stockfish:** 2 952 moves; median 4 000, p95 4 001, p99 4 001, max 4 002 ms. 0 over 4 010; 0 at or over 4 050.

## FL (class and count only; changes no line of the read)
- `sampler.log` holds 2 264 samples, every 10 s.
  - foreign `vitest`: 0 samples;
  - foreign `cutechess-cli`: 0;
  - foreign `stockfish`: 1 sample, count 1, in chunk 6. The sample fell at a game boundary: the PGN shows the game ending and the next starting within 0.3 s of it.
  - foreign `node`: 3 samples, count 1 each, in chunks 1 and 16, not at game boundaries.
  - Whether the `stockfish` one is the tool's own restarted engine, caught between `hostcheck.sh`'s `ps` snapshot and its `pgrep`, is **UNKNOWN - verify**. Count-only data cannot settle it.
- **Not SHARED:** foreign vitest plus cutechess-cli in 0 % of samples, against the 20 % bar. **The host was ALONE for the SHARED classes.**
- The harness's own `host.log` has 449 lines, with `foreign_vitest_procs=0` in all of them.
- Tctl was min 41.2, mean 70.2, max 74.8 °C; THERMAL needs a median above 85. load1 mean 1.18, max 2.03. Free space was at least 5 350 MB, against the 1 536 MB gate.

## The estimate against the walls
| | PREREG estimate | measured |
|---|---|---|
| plies a game | 85–180, central 120 | mean 98.6, median 87, max 214 |
| seconds a ply | 3.907 (smoke) | 3.855 (chunks 3.829–3.897) |
| overhead a chunk | about 10 s | 11–14 s |
| chunk wall | 56–117 min, central 78 | 54.7–71.2 min, mean 63.5 |
| night | 30–70 games, central 50; end 6–7.5 h | **60 games; end 6 h 21 min** (22 880 s) |
| worst chunk vs guard | 2 000 plies / 8 400 s | 1 109 plies / 4 274 s |

- c016's 54.7 min is just under the 56-min row: 85.4 plies a game at 3.829 s a ply.
- The night matched the PREREG's 100-ply row: 6 chunks, 60 games, about 6.5 h.
- The worst-case guard left 5 920 s of the 8 h unused, about 1.5 chunks at the measured mean. This is the one-chunk cost the PREREG named.
- **Night 2, an estimate and not a reading:** at the measured 3 813 s a chunk, the guard admits 6 launches, about 60 games over openings 31–90. Openings 91–100 would then need a third night, so 3 nights in all, not the 4 the PREREG estimated. **UNKNOWN - verify**, because game length varies.
