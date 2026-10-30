---
id: 20261030T143112Z-qe-e2e-observation-5d70bb7c
kind: observation
by: qe-e2e
at: 2026-10-30T14:31:12Z
verified_by: 
confidence: high: both smokes ALONE at width 1, wait-clear at start, harness summaries and PGNs as played; foreign-vitest overlap recorded, no thermal stop, frequency fall <= 0.10 %
refs:
  - qe-ABC-241
  - ABC-241
  - EPIC-010
  - ADR-0020
  - d1a2d5cd
  - 33540592
  - e42b637b
  - 20261030T124213Z-qe-e2e-decision-09a71388
  - A10
  - S-1
  - S-2
  - S-3
  - S-4
  - qe-ABC-228-ii/20261030T115900Z-qe-e2e-observation-2123617d
  - QE-241-e
  - QE-241-f
supersedes: 
seal: sha256:0a325706b95479e9db89a08b3278866ea73fb9cd9c0f23b6013886803516a8b5
---

# qe-ABC-241 A10 smoke pair, ALONE at width 1: D 4/2/4 (6.0 / 10), R at 4 000 ms 6/3/1 (6.5 / 10); 0 faults, 0 time losses; S-1..S-4 MET; repetition endings D 1 (by the candidate) / R 1 (by Stockfish), neither touched by ABC-241's rule

QE/E2E, task `qe-ABC-241`, under the sealed PREREG (`…09a71388` § 6). The smokes ran after the QE rows, mutants, gates, G8 and the cost read (`…checks`, `…timing` notes of this task).
- **Candidate:** `d1a2d5cd` (code `33540592`). **Base:** `e42b637b`.
- **Before each smoke:** `main` was `f22e31b3`, and `git diff e42b637b main -- src data tools package.json package-lock.json` was empty. So the candidate is the build as it will merge (A10's "rebased on `main`").
- **The tool:** `tools/rating/rating.ts` ran from QE's worktree. The harness records QE's branch at `8d78cbe9`, whose `src/`, `tools/` and `data/` equal `d1a2d5cd`'s and `e42b637b`'s.
- **Pins:** `machine.txt` reads cutechess-cli 1.5.1 `dc776901…` "= pin", Stockfish 19 `c78c22a9…` "= pin", and `openings.epd` `0d7f7a72…`. Tool paths came from an env file outside the repo (mode 600) and are not recorded.

## The two smokes (`raw/a10/d/`, `raw/a10/r/`)
| smoke | command | `cmd.txt` reads | candidate W/L/D | score | faults | time losses | repetition endings | wall |
|---|---|---|---|---|---|---|---|---|
| **D** | `d d1a2d5cd e42b637b <out> --budget-ms 1500 --rounds 5 --concurrency 1` | both `st=1.5`, `timemargin=3500` | **4 / 2 / 4** | **6.0 / 10** | 0 | 0 | 1 (round 2, game 1; the repeating move by **the candidate**) | 13:13:02–13:55:20Z |
| **R** | `r d1a2d5cd <out> --elo 1910 --rounds 5 --concurrency 1` | skytalix **`st=4`**, `timemargin=1000`; Stockfish `st=0.5`, `timemargin=2000`, `UCI_Elo=1910` | **6 / 3 / 1** | **6.5 / 10** | 0 | 0 | 1 (round 3, game 1; the repeating move by **Stockfish**) | 13:55:52–14:28:29Z |

- **D:** endings were 3 by White mates, 3 by Black mates, 2 by the fifty-move rule, 1 by insufficient material and 1 by threefold repetition.
  - The harness reads 0 faults, 0 unclassified and 0 move-cap draws, and both stderr files are 0 bytes.
  - State NEUTRAL (Elo +70.4 ± 185.5, INFO on 10 games).
- **R:** endings were 5 by White mates, 4 by Black mates and 1 by threefold repetition.
  - The harness reads 0 faults, 0 unclassified and 0 move-cap draws, and both stderr files are 0 bytes.
  - The Stockfish depth guard reads 0 of 439 moves below depth 4.
  - State 1 910 + 107.5 ± 268.4 (INFO on 10 games).

## The merge rule (`EPIC-010`)
- **S-1 MET:** 0 candidate faults in the 20 games.
- **S-2 MET:** 0 candidate losses on time. Every decisive game ended in mate.
- **S-3 MET:** D 6.0 ≥ 3.0 of 10.
- **S-4 MET:** R 6.5 ≥ 3.0 of 10.
- No confirmation games were needed.

## Repetition endings, candidate against base
| | this smoke (candidate `d1a2d5cd`) | base's reference (`qe-ABC-228-ii` at `5e84d0d7`, src/data/tools = `e42b637b`) |
|---|---|---|
| D | 1 of 10 (the repeating move by the candidate, at plies 81 / 85 / 89) | 1 of 10 (round 4, plies 168 / 190 / 194) |
| R | 1 of 10 (the repeating move by Stockfish, at plies 38 / 42 / 46) | 0 of 10 |
- **Was ABC-241's rule involved? No** (`raw/qe-scripts/repcheck.mjs`, `raw/a10/repcheck.txt`). QE replayed all 40 games (these 20 and base's 20) on head's modules:
  - In each repetition ending, the final board's occurrences are at the same plies on the repetition-key list and on the hash list.
  - In no game does an ep-normalised position (an uncapturable double push) recur later.
  - So the rule changed no game-end count in these 40 games. The repetition counts differ by noise, not by the change. At about 0.5 % of D games (SA `A6`), 20 games would be expected to show none.

## The smoke ledger row (for `EPIC-010` § The smoke ledger; BA/PM folds it)
| ticket | candidate sha | base sha | D W/L/D (score) | R W/L/D (score) | faults | time losses | pooled R since last batch | flag | Tctl median / max |
|---|---|---|---|---|---|---|---|---|---|
| `ABC-241` | `d1a2d5cd` | `e42b637b` | 4/2/4 (6.0) | 6/3/1 (6.5) **at 4 000 ms; recorded, not pooled** | 0 | 0 | none computed: there is no 4 000 ms reference until milestone 1's batch (the 3 000 ms pool closed at `ABC-228`'s merge). Rows waiting at 4 000 ms: `ABC-228` 7.0 / 10 and `ABC-241` 6.5 / 10 (13.5 / 20, INFO only, never judged) | not evaluable (no reference) | D 74.38 / 83.6 °C; R 74.63 / 85.5 °C (width 1) |

## Host: thermal, frequency, foreign load
- **D:** 253 samples. Tctl **median 74.38 °C, max 83.6 °C**. The running median peaked at 74.50 °C, so the stop never fired. Busiest-core MHz median 5 029 against 5 026.5 over the first 6 samples: a fall of −0.05 %.
- **R:** 195 samples. Tctl **median 74.63 °C, max 85.5 °C**. The running median peaked at 75.31 °C, so the stop never fired. MHz 5 024 against 5 029: a fall of 0.10 %.
- **Foreign load (recorded, per PREREG § 6):** both smokes started at a clear host (wait-clear at poll 1), and a foreign vitest from another project then appeared mid-run.
  - D: 31 of 253 samples, 13:31–13:42Z.
  - R: 13 of 195 samples, 14:03–14:08Z.
  - The thermal stop never fired, so no run is VOID and both readings stand. The frequency fall stayed ≤ 0.10 %.
  - Effect (INFO, not measured): in D the overlap hits both sides alike at width 1. In R, Stockfish plays at a fixed `st=0.5`, and a slowed candidate could only lower its own score, which passed.
