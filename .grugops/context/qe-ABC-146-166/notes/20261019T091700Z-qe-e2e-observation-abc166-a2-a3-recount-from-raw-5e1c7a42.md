---
id: 20261019T091700Z-qe-e2e-observation-abc166-a2-a3-recount-from-raw-5e1c7a42
kind: observation
by: qe-e2e
task: qe-ABC-146-166
at: 2026-10-19T09:17:00Z
verified_by:
confidence: high
refs:
  - ABC-166
  - ABC-146
  - ABC-085
  - .grugops/context/abc146-verdict/raw/verdict-run2.out.txt
  - .grugops/context/abc146-verdict/raw/verdict-run2.meta.txt
  - .grugops/context/abc146-verdict/notes/20261019T084500Z-orchestrator-observation-abc146-verdict-run2-reading-a5-4c1d8e27.md
  - .grugops/context/qe-ABC-146-166/probe/recount.mjs
  - .grugops/context/qe-ABC-146-166/probe/recount-run2.out.txt
supersedes:
---

# ABC-166 A2 and A3: recounted from run 2's raw lines. Every figure in `…4c1d8e27` and on ABC-146 § "A5 reading" matches

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). The raw files were
read from git at `d93e247b`. Nothing was re-run and no timing was taken. The probe is `probe/recount.mjs`. Its output
is `probe/recount-run2.out.txt`. The probe parses every `LADDER GAME {` and `LADDER PAIR {` line and recounts each
pair from its GAME lines. It does not use the PAIR line's own totals.

## A2, clause by clause: MET
| clause | raw evidence | result |
|---|---|---|
| exit 0 | meta `end 2026-10-19T08:40:36Z exit 0` | MET |
| 17 passed | out `      Tests  17 passed (17)` (12 default rows + 5 verdict rows, each `✓`) | MET |
| 5 PAIR, 180 GAME | `grep -c 'LADDER PAIR {'` 5, `grep -c 'LADDER GAME {'` 180 | MET |
| per-pair GAME counts | 3v4 20, 4v5 20, 2v3 20, 1v2 20, 1v5 100. The order is G3v4×20 P3v4, G4v5×20 P4v5, G2v3×20 P2v3, G1v2×20 P1v2, G1v5×100 P1v5 | MET |
| PAIR order | 3v4, 4v5, 2v3, 1v2, 1v5 | MET |
| mode string | one distinct value over all 185 lines: `verdict mode, step 4` | MET |
| commit | one distinct value: `d73c4d6cfa0af0504d0585abd95e5abf1562b2f4`, equal to meta `commit`, no `+dirty-src` | MET |
| meta fields | commit, start, end, exit, load1 at start, `node --version`, `npx vitest --version`, power and lid at start and at end. All 10 lines are present | MET |

- The colour schedule was checked as well: each pair's GAME lines run seed 1..n/2 in order, stronger white first, then
  the same seed with colours reversed. That is `colourSchedule`'s order, and all 5 pairs match. The stronger side is
  white in exactly half the games.
- 0 GAME lines end `error`.

## A3: every figure recomputed. 0 mismatches against the note and against the page
| pair | W-D-L (recounted) | score | % | bar | verdict (recomputed) | claimed | reasons (recounted) | PAIR line |
|---|---|---|---|---|---|---|---|---|
| 3v4 | 1-11-8 | 6.5/20 | 32.5 | > 50 % | RED | 10 | threefold (claimed) 10, checkmate 9, stalemate 1 | equal |
| 4v5 | 4-12-4 | 10/20 | 50 | > 50 % | RED | 12 | threefold (claimed) 12, checkmate 8 | equal |
| 2v3 | 20-0-0 | 20/20 | 100 | > 50 % | MET | 0 | checkmate 20 | equal |
| 1v2 | 18-0-2 | 18/20 | 90 | > 50 % | MET | 0 | checkmate 20 | equal |
| 1v5 | 100-0-0 | 100/100 | 100 | ≥ 90 % | MET | 0 | checkmate 100 | equal |

- **Seeds:** 1..10 for each A2 pair and 1..50 for 1v5, matching each line's `seeds`. Every PAIR line has `step` 4.
- **Total wall:** meta end − start = 2026-10-19T08:40:36Z − 2026-10-18T21:20:13Z = **40 823 s** (11 h 20 min 23 s).
  vitest `Duration 40822.27s`. Both match the note and the page. The per-pair `wallS` values (7856, 9832.6, 3451.6,
  532.7, 19144) and `load1` pairs match the note's table. Summed GAME `wallS` is 40 816.6 s and summed PAIR `wallS`
  is 40 816.9 s. These are internal consistency only and were not graded.
- **Note arithmetic:** 3v4 1 + 11/2 = 6.5; 4v5 4 + 12/2 = 10; 22 claimed threefolds across the two RED pairs. All
  correct.
- **Line citations in ABC-166 against `d73c4d6c:src/ladder.test.ts`:** `commitOf` `:298`, `console.log` `:571` and
  `:597`, and the assertions at `:568` (count), `:588` (no error) and `:590` (replay). All match.

## Digests: cross-checked, NOT recomputed (observation, not a gap in the reading)
- `digest()` (`src/ladder.test.ts:292`) is a sha256 over each game's MOVE LIST. GAME lines do not print move lists,
  so no raw line contains enough to recompute a digest.
- **What I checked:** the five digests in the note and on the page equal the PAIR lines byte for byte. They are 16
  hex characters each and all distinct: 1v5 `c984a0c9a380b064`, 3v4 `9667ad6328f603ab`, 4v5 `57d6676d5d9090e4`,
  2v3 `bcbbdf2b129dd4e0`, 1v2 `324e957853bfa9f3`.
- Recomputing them would mean replaying the verdict. The brief forbids that.

## A4: not triggered
A2 holds, so A4's no-score branch does not apply. Nothing is quoted from run 1, which printed no `LADDER` line
(`raw/verdict-run1.out.txt`, 9 lines).
