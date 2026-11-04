# qe-ABC-283 B4, the one read: C2′ is **59 / 27 / 14 = 66.0 / 100 ≥ 50.0, MET** (GAIN; Elo +115.2 ± 67.0, 100 / 100 games, 0 faults, 0 time losses). S′ against E 1 810 (information) is 6 / 4 / 0 = 6.0 / 10. The Levels deep lane (a bar) is exit 0, 58 / 58, MET. Each was read once, exactly as PREREG `…f774e6d9` wrote it

QE/E2E, task `qe-ABC-283`. The PREREG was sealed and committed at `840a343d` before any game or QE run. Records: `raw/out/c2/`, `raw/out/s1/`, `raw/out/levels/`. Analysis: `raw/scripts/analyze.py`, run on the cutechess debug logs before they were deleted.

## C2′: the bar (ticket B4)
- **Command, as sealed:** `node tools/rating/rating.ts d ab0a37b6 09694a4e <out> --budget-ms 100 --rounds 50 --concurrency 1`. The whole match ran in ONE `flock <scratch>/host-test.lock` hold, from 2026-11-04T15:24:09Z to 15:43:41Z (19 min 32 s).
- **Host:** load1 was 1.27 at start, 1.98 at end and 2.10 at most (the harness's `host.log`). There were 0 foreign vitest processes at every sample.
- **Pins:** cutechess-cli 1.5.1 and Stockfish 19 equal their pins, and the openings sha256 is `0d7f7a72…`. Both sides played `st=0.1` with `timemargin=50`.
- **Artifacts:** the candidate `dist/` differs from the base `dist/` in exactly `engine.js`, `search.js` and `see.js` (24 files each). The `SHA256SUMS` lines verify the committed bytes; `d.out` (7.6 MB) is listed there and not committed, as in the `qe-ABC-279` precedent.
- **Result:** 100 of 100 complete. **W/L/D 59 / 27 / 14, score 66.0 / 100 (0.660). MET at ≥ 50.0.**
  - Elo difference +115.2 ± 67.0, LOS 100.0 %, draw ratio 14.0 %. The harness labels it `state: GAIN`, which is not the verdict. The interval does not span 0.
  - Faults 0, time forfeits 0, move-cap draws 0. Both stderr files are 0 bytes.
  - go → bestmove latency: the candidate's median is 101 ms (max 105), the base's 101 ms (max 105). No move took over 150 ms.
  - By colour: 33.0 / 50 as White and 33.0 / 50 as Black. Opening-pair scores (0, 0.5, 1, 1.5, 2) are 3, 3, 18, 11, 15.
  - Terminations: 86 by mate, 12 by threefold repetition, 2 by the fifty-move rule.

## S′: information only (`…3851bf43` 1)
- **Command, as sealed:** `node tools/rating/rating.ts r ab0a37b6 <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`, in ONE `flock` hold, from 15:43:47Z to 15:51:33Z (7 min 46 s). load1 was 1.98 at start, 2.78 at end and 3.13 at most. There were 0 foreign vitest processes.
- **Result:** 10 of 10 complete. W/L/D 6 / 4 / 0, **6.0 / 10**. Faults 0, time forfeits 0, all 10 games ended in mate.
  - Rating: 1 810 + 70.4 ± 268.9 = **1 880.4 ± 268.9**.
  - Stockfish's depth guard: 0 of 478 moves below depth 4. Latency: the candidate's median is 501 ms (max 504).
- No second ten was played, because this is information and the PREREG fixed that.

## Levels deep lane: a bar (`…3851bf43` 1)
- `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose` ran on the out-of-tree head arm (the `src/` tree of `ab0a37b6`), ALONE in one hold, from 15:51:37Z to 16:01:14Z.
- **Exit 0. Test Files 1 passed; Tests 58 passed (58). MET.**

## Game time
- 27 min 18 s in all, against the PREREG's 32 min forecast. That is within the brief's 1 h.
