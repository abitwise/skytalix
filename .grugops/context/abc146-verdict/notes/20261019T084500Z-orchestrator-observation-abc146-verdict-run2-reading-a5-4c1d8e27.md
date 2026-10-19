---
type: observation
role: orchestrator
task: wave-2026-09-25
at: 2026-10-19T08:45:00Z
sealed: false
refs: [ABC-146, ABC-166, ABC-085, ABC-087, ADR-0038]
---

# ABC-146 A5: the verdict, read from run 2 (ABC-166 A3)

Every figure on this page is cited from `raw/verdict-run2.out.txt` or `raw/verdict-run2.meta.txt`. Nothing is taken from run 1.

## ABC-166 A1 (pre-flight, 2026-10-18 ~21:19Z): PASSED
- **The A0 inputs are unchanged.** The staleness diff against `eb216351` printed nothing.
- **Versions and checksums match:**
  - `v26.11.1`;
  - `vitest/4.1.11 darwin-arm64 node-v26.11.1`;
  - md5 `2d2b6379…` / `bba67b75…`.
- **`src` is clean.** No uncommitted changes under `src/`.
- **The `3v4` probe printed its score lines.** It exited 0 with 4 `LADDER GAME` lines and 1 `LADDER PAIR` line, the latter reading `"pair":"3v4"`. These are counts only.
- **Host:** AC Power, lid open (`= No`).
- **Width 1:** `secnfr-ABC-167` was stopped before the start. No hop and no timing reading ran during the run.

## ABC-166 A2: HOLDS
- **Exit and summary:** exit 0, `Tests  17 passed (17)`.
- **Line counts:** 5 `LADDER PAIR` lines and 180 `LADDER GAME` lines.
- **Games per pair:** 3v4 20, 4v5 20, 2v3 20, 1v2 20, 1v5 100.
- **Pair order:** 3v4, 4v5, 2v3, 1v2, 1v5. Every pair line reads `"mode":"verdict mode, step 4"`.
- **Commit:** every pair line has `commit` `d73c4d6cfa0af0504d0585abd95e5abf1562b2f4`, which equals the meta commit. There is no `+dirty-src`.
- **The meta file records:**
  - start `2026-10-18T21:20:13Z`;
  - end `2026-10-19T08:40:36Z`, exit 0;
  - load1 at start `{ 8.25 8.18 9.21 }`;
  - power and lid at start and end: AC Power, lid open (`= No`).

## Reading (ABC-146 A5)
- **Run setup:**
  - commit `d73c4d6c`, step 4;
  - seeds `1..50` for 1v5 and `1..10` for each A2 pair, both colours each;
  - runner vitest 4.1.11 on node v26.11.1.
- **Total wall:** 40 823 s (11 h 20 min 23 s) by meta end − start, and vitest `Duration 40822.27s`.
  - The host was shared: other agent sessions ran during the night. Wall is reported only, not graded.

| pair | criterion | stronger | W-D-L | score | bar | verdict | claimed draws | reasons | digest | wallS | load1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1v5 | ABC-085 A1 | 5 | 100-0-0 | 100/100 (100 %) | ≥ 90 % | **MET** | 0 | checkmate 100 | `c984a0c9a380b064` | 19144 | 5.58→5.27 |
| 3v4 | ABC-085 A2 | 4 | 1-11-8 | 6.5/20 (32.5 %) | > 50 % | **RED** | 10 | threefold (claimed) 10, checkmate 9, stalemate 1 | `9667ad6328f603ab` | 7856 | 8.25→5.25 |
| 4v5 | ABC-085 A2 | 5 | 4-12-4 | 10/20 (50 %) | > 50 % | **RED** | 12 | threefold (claimed) 12, checkmate 8 | `57d6676d5d9090e4` | 9832.6 | 5.25→5.42 |
| 2v3 | ABC-085 A2 | 3 | 20-0-0 | 20/20 (100 %) | > 50 % | **MET** | 0 | checkmate 20 | `bcbbdf2b129dd4e0` | 3451.6 | 5.42→4.72 |
| 1v2 | ABC-085 A2 | 2 | 18-0-2 | 18/20 (90 %) | > 50 % | **MET** | 0 | checkmate 20 | `324e957853bfa9f3` | 532.7 | 4.72→5.58 |

- **Hand cross-checks (`score` = W + D/2):**
  - 1v5: 100 / 100 = 100 %.
  - 3v4: 1 + 5.5 = 6.5, and 6.5 / 20 = 32.5 %.
  - 4v5: 4 + 6 = 10, and 10 / 20 = 50 %. That does not exceed 50 %, so it is RED.
  - 2v3: 20 / 20.
  - 1v2: 18 / 20 = 90 %.
  - Each matches its line's own `verdict`.
- **180 of 180 games terminated and replayed legally.** This is read from the 17/17 pass: each verdict row asserts its game count, no `error` ending, and a legal replay.
- **The five digests above are the verdict's evidence.** Run 1 has none.

## Result
- **ABC-085 A1 is MET:** level 5 beats level 1 100/100.
- **ABC-085 A2 is RED on the two top steps:**
  - 3v4: level 4 scores 32.5 % against level 3.
  - 4v5: level 5 scores exactly 50 % against level 4.
  - Both pairs are draw-heavy, with 22 claimed threefold repetitions between them.
- **ABC-085 A2 is MET on 2v3 and 1v2.**
- Per ABC-166 A3, **a RED score is a real score**. It goes to ABC-087 and is not a delivery defect of ABC-146 or ABC-166.
