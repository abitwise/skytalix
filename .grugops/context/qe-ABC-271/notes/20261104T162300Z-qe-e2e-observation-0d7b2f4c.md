---
id: 20261104T162300Z-qe-e2e-observation-0d7b2f4c
kind: observation
by: qe-e2e
at: 2026-11-04T16:23:00Z
verified_by: 
confidence: high: each lane run once on the branch tip under the host lock; counts and exit codes as vitest printed them
refs:
  - qe-ABC-271
  - grugops/qe-ABC-271
  - grugops/ABC-271
  - ABC-271
  - EPIC-011
  - E4a
  - ADR-0070
  - ADR-0067
  - ADR-0046
  - ADR-0035
  - R-281-a
  - K0
  - K1
  - K2
  - K3
  - K4
  - F1
  - F2
  - F3
  - G1
  - G2
  - G6
  - S2
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - QE-271-a
  - QE-271-b
  - QE-271-c
  - QE-271-d
  - QE-271-e
  - QE-271-f
  - QE-271-g
  - QE-271-h
  - QE-271-i
  - QE-271-j
  - QE-271-k
  - QE-271-l
  - UAT
  - main/d2f01e7c
  - src/4fb3da04
  - 10f29a82
  - src/08e56302
  - 9644b44c
  - src/evaluate.ts
  - src/evaluate-params.ts
  - src/evaluate.passer.test.ts
  - src/evaluate.passer-fixtures.json
  - src/evaluate.taper.test.ts
  - src/evaluate.pawns.test.ts
  - src/transposition.test.ts
  - qe-ABC-271/20261104T143423Z-qe-e2e-decision-c55891e0
  - qe-ABC-271-freeze/20261104T133856Z-qe-e2e-decision-67b5eeac
  - qe-ABC-271-freeze/20261104T133902Z-qe-e2e-observation-a8173b00
  - se-ABC-271/20261104T142439Z-software-engineer-decision-2340385e
  - se-ABC-271/20261104T142439Z-software-engineer-observation-d3690ae6
  - se-ABC-271/20261104T142439Z-software-engineer-observation-863fb251
  - se-ABC-271/20261104T142439Z-software-engineer-observation-4e7d2740
  - orch-2026-10-30a/…730399e5
  - orch-2026-10-30a/…6ccd8243
  - sha256:bf3c205bf4106209e3151717d93542180d90d344cecfdfbb6f2a30c9d5db887a
supersedes: 
seal: sha256:f22c24aef2b7770ab2c06fe494865ff7f4dc1bf54a8f06e17465184b0a826954
---

# qe-ABC-271 deep lanes and R-281-a: the four moved-row `-t` lines read **4 / 1 / 1 / 1 passed** (the expected counts); the five cheap, game-free lanes SE left UNKNOWN are green (perft 32, zobrist 33, input 34, UCI real-engine 13, the full UCI session lane 241); SE's lanes, re-run by QE, are green with unchanged expectations (G1 54 / 58 = baseline); the weakened puzzle lane is red by design (16 / 58, as at `qe-ABC-270`)

QE/E2E, task `qe-ABC-271`, on the QE worktree (HEAD `9644b44c` = the build's `src/` `08e56302` + records only). One lane at a time, each under its own `flock <scratch>/host-test.lock` hold. The lock was shared with other agents, so some lanes waited minutes for it (the `secs` figures below include the wait). Each exit code is vitest's own. Raw: `raw/out/deep/exits.txt` and the four `r281-*.txt`. Script: `raw/scripts/deep.sh`.

## R-281-a (`ADR-0046` dated 2026-11-04; brief item 4): the count is the check
| line (`-t`, escaped) | expected | read | exit |
|---|---:|---:|---:|
| `ENGINE_DEEP=1` `src/uci-session.test.ts` "ABC-167 A5 — the D4 time rule … \[deep, ENGINE_DEEP=1\]" | 4 | **4 passed** | 0 |
| `SEARCH_DEEP=1` `src/search.null-move.test.ts` "QE-208-a — an abort inside a null move's subtree … \[deep, SEARCH_DEEP=1\]" | 1 | **1 passed** | 0 |
| `ENGINE_DEEP=1` `src/engine.test.ts` "ABC-230 A3 and A4 — no prior keys is base … \[deep, ENGINE_DEEP=1\]" | 1 | **1 passed** | 0 |
| `ENGINE_DEEP=1` `src/levels.test.ts` "A9 — different seeds actually differ \[deep\]" | 1 | **1 passed** | 0 |
- No short count, so there is no blocking gap. The wall of the four, which `ADR-0046` asked the first hop to record: 2 s, 1 s, 2 s and 1 s, about 6 s with vitest's start-up. The "skipped" counts beside them (237, 44, 82, 57) are the rows `-t` filters out (`QE-271-l`).

## Lanes SE left `UNKNOWN - verify`, cheap and game-free: all green
- `PERFT_DEEP=1` `src/perft.test.ts`: 32 passed.
- `ZOBRIST_DEEP=1` `src/zobrist.test.ts`: 33 passed.
- `INPUT_DEEP=1` `src/line-input.test.ts` (`--expose-gc`): 34 passed.
- `UCI_DEEP=1` `src/uci.real-engine.test.ts`: 13 passed.
- `ENGINE_DEEP=1` `src/uci-session.test.ts`, the full lane (ABC-220 A11's 22 s walls, ABC-221 A10's 3 × 59.5 s): **241 passed**, 292 s.
- **Not run:** `CLI_DEEP` (a CLI game session against the real engine) and `LADDER_DEEP` (games). The brief says no games, so both stay `UNKNOWN - verify` on this build (`QE-271-k`).

## SE's lanes, re-run by QE (K0's "every door", K2's "no other re-pin in any lane")
| lane | passed | note |
|---|---:|---|
| `SEARCH_DEEP` `evaluate.passer` (K0's seven rows) | 28 | |
| `SEARCH_DEEP` taper | 170 | A9 with its E4a row |
| `SEARCH_DEEP` SEE | 52 | |
| `SEARCH_DEEP` null-move | 45 | |
| `SEARCH_DEEP` futility | 53 | |
| `SEARCH_DEEP` search | 57 | |
| `SEARCH_DEEP` quiescence | 116 | |
| `SEARCH_DEEP` transposition | 40 | |
| `SEARCH_DEEP` PVS/LMR | 29 | |
| `SEARCH_DEEP` ordering | 43 | not in SE's list |
| `TUNE_DEEP` tune | 17 | the tracer's identity gate holds at 0 |
| `ENGINE_DEEP` engine | 83 | |
| `ENGINE_DEEP` transposition | 26 | |
| `ENGINE_DEEP` pawns | 44 | |
| `PUZZLE_DEEP=1` puzzle | 18 | G1 **54 / 58** = baseline |
| `PUZZLE_DEEP=weakened` | 13 passed, **1 failed (by design)** | `evaluate = 0` solves 16 / 58 < 54. A3 ("the weakened engine solves FEWER than the baseline, so the gate row above is red") passes. Same reading as `qe-ABC-270` |
| `ENGINE_DEEP` levels | 58 | including A9 (also read alone above) |
- Every lane passes with the expectations `main` holds, apart from K2's two size rows, which are default-lane rows. **No other re-pin was needed in any lane** (K2), and every door's count reads its pre-ticket value (K0).
