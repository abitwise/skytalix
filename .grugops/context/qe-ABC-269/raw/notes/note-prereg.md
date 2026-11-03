# qe-ABC-269 PREREG for the rest of the verdict, sealed after `G2` MET and before any B8 / S′ / Levels reading: the bars are the ticket's and `ADR-0064`'s as written, copied here, none loosened; a miss is never re-played

QE/E2E, task `qe-ABC-269`. Written at the point where `G2` has read MET (R = 1.0373, the `G2` note) and B5 / B7 are taken (or in flight); B8, S′ and the Levels lane have not been started. This note adds nothing to the bars; it fixes the commands and the order.

## Builds
- **Candidate head:** `grugops/ABC-269` `be87a2f1` (main merged in; src tree `4d6b117b`, equal to the P1–P7 commit `561fc028`).
- **Base / merge-base:** `main` `01a67c5d` (src tree `58fa3eb4`); `git merge-base be87a2f1 main` = `01a67c5d`.

## Bars, as written (ticket `ABC-269` acceptance; `ADR-0064` d8)
- **B5:** `ADR-0061` d8 (d) cut audit on a scratch copy of the build: `search()` d6 over the 190 (endgames included), every 10th firing node, each re-searched three times. **Flips ≤ 0.5 % of sampled nodes, and 0 flips of 200 cp or more.** A miss is F5.
- **B7:** `G6` at `LEVELS[5]` 4 000 ms, plain `node`, reference host, `ABC-205`'s reading rule (≥ 5 interleaved rounds per board per build, width 1, load recorded, medians compared). Under `Q-3K-4` = (b): **every run completes depth ≥ 6 (FAIL below)**; depth 7 a WARN; each board's median against base reported, not graded.
- **B8, C2′:** `node tools/rating/rating.ts d be87a2f1 01a67c5d <out> --budget-ms 100 --rounds 50 --concurrency 1`, host ALONE. **MET on 100 of 100 complete, 0 candidate faults, 0 losses on time at the 50 ms margin, and ≥ 50.0 of 100.** The harness's NEUTRAL label does not apply. Reported: W/L/D, score, Elo ± error, `G11` (cited).
- **S′:** `node tools/rating/rating.ts r be87a2f1 <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`. **MET on 10 of 10 complete, 0 faults, 0 losses on time, and ≥ 3.0 of 10; below that, 10 more games and ≥ 7.0 of 20.** Pooled only if merged.
- **Levels:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose` on the candidate head: **exit 0, every test passed** (QE counts its own run).
- **F6:** B8 below 50.0, an S′ collapse, or a red Levels lane: not merged; `ADR-0064` reads "accepted, not in force".

## Order and discipline
- B8, then S′, then Levels; one at a time, each under `flock host-test.lock`; `uptime` at start and end.
- Any single run forecast over 1 h: stop and return the question (forecast: B8 about 25–30 min by `qe-ABC-268-p2`'s 25 min; S′ about 8 min; Levels about 10 min).
- No re-play of a miss, no extra games beyond S′'s written second ten, no dropped game.

## Cheap independent checks of the Engineer's claims (step 3)
- B0's 11 counts on the cut build (`b0.ts`, under the lock); `npm test` count (claim 2 566 / 2 566); fixture sha256 (claim `05ed9e81…6e96339`); S1–S3 on the cut build against the forecast +13 / +13 / +23 (report, ungraded); untouched files from `git diff --stat`.
