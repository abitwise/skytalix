---
id: 20261010T145645Z-qe-e2e-observation-abc131-gap-register-5e358534
kind: observation
by: qe-e2e
at: 2026-10-10T14:56:45Z
verified_by:
confidence: high
refs:
  - ABC-131
  - ABC-087
  - ABC-127
  - QE-127-e
  - RISK-003
  - NFR-004
  - src/puzzle-suite.test.ts
  - src/puzzle-suite.baseline.json
  - src/levels.test.ts
  - AGENTS.md
  - commit:f994c724
  - 20261010T145645Z-qe-e2e-observation-abc131-readings-margin-a4-07d83577
supersedes:
---

# `ABC-131` gap register: 1 LOW closed by QE, 2 LOW open, 4 INFO. None is a criterion miss

| id | sev | gap | evidence | owner / route |
|---|---|---|---|---|
| QE-131-a | LOW, **CLOSED** at `f994c724` | `A6`'s row read `\|unsolved\|` as a list length. A repeated name (seed 288 replaced by a second seed 24, in a copied baseline) kept every name a row and kept 54 + 4 = 58. The whole `PUZZLE_DEEP=1` lane exited **0**, and only an unasserted NEWLY-MISSED line showed the hidden row | `raw-qe-a6-a8-mutants.txt` (`a6-dup` exit 0) | QE added one assertion inside the same row: the names are distinct. RED first (`unsolved names are distinct: expected 3 to be 4`), green on the tree. The deep lane stays 18 rows, the default lane is unchanged |
| QE-131-b | LOW | The baseline's `laneWallSeconds` reads `28.24 / 33.45 / 28.97`. The engineer's raw files give process 1 = **33.45**, process 2 = **28.24**, process 3 = 28.97 (`Duration` lines). The first two are **swapped**. Every other measured field is in process order: process 1's real 34.84 s agrees with 33.45. The field is printed provenance, read by no assertion | `ticket-to-pr-ABC-131/notes/raw-deep-tip-proc{1,2}.txt` line 80 | Whoever next re-records the baseline (its own commit, as the rule says). QE did not edit it: `src/` production file, fenced. Optionally the Engineer in a baseline-only fix commit before merge, at the Orchestrator's call |
| QE-131-c | LOW | **Stale at merge, not in the ticket's Scribe list:** AGENTS.md's levels-lane comment (`:100`–`:101`) says "perft/puzzles **246** moves" and "A3 (35 vs **58 of 62**)". `src/levels.test.ts` (`ENGINE_DEEP`, `ABC-087`) reads `PUZZLES`. At the tip it is 242 moves, and easiest 35/58 against default 54/58. Both substitutions are the same length (0 B) | `raw-qe-levels-tip.txt` (exit 0, 28 passed) | AGENTS.md Scribe, in the same post-merge pass as the `PUZZLE_DEEP` comment (`58/62` → `54/58`, `17 passed` → `18 passed`). Check `memory-bank/90-agents-md-command-log.md` too |
| QE-131-d | INFO | `A6` checks names and arithmetic, not the run. A **solved** row named in `unsolved` (seed 288 → seed 1) stays green. Only NEWLY-SOLVED and NEWLY-MISSED are printed. This is by design: `ABC-127` `A5` says the gate is the count, and asserting the swap lines would turn an improvement red | `a6-solvedrow` exit 0 | none |
| QE-131-e | INFO | `measuredAt` cites `506d80c`, whose committed gate is red (`expected 58 to be 62`, test note 1). The per-row readings there are byte-equal to the tip's (sha1 `11326e1c`), so the provenance holds. A reader re-running `506d80c` should expect exit 1 | `raw-qe-deep-base-tip-x3.txt` | none |
| QE-131-f | INFO | The margin, for `RISK-003`: step 1.25 = 19/24 readings (0.792x). The first loss is at 18 readings (0.75x) on seeds 1, 69 and 1163. On a uniform-growth model, ≥ 26 % tree growth is tolerated and ≤ 33 % reds them. This is a model, not a measurement | readings note `…07d83577` | Security/NFR's `RISK-003` wording (`secnfr-catalog-2026-10-10`) |
| QE-131-g | INFO, not this ticket's | `ABC-087`'s `ENGINE_DEEP` `A5` (real clock) read a maximum of 4,780 ms of the 5,000 ms ceiling, during QE's run at load1 rising to 20.7 | `raw-qe-levels-tip.txt` | `NFR-004` owner. No action on `ABC-131` |

**Not covered (stated, not smoothed).**
- **Base levels lane not re-run.** The 246 and "35 vs 58 of 62" figures come from AGENTS.md's 2026-10-10
  RUN line. QE ran the lane at the tip only (213 s).
- **The four-commit layering.** `A2`'s "gate red only between the drop and the baseline" was read at
  `506d80c` only. `7cf74d43` (tests before the drop) was not run separately. The `A6` row is green on the
  old baseline by the arithmetic (58 + 4 = 62, the same names).
- **No deep lane re-run for engine code.** No engine file changed, so `SEARCH_DEEP` and the base
  `ENGINE_DEEP` lanes are not triggered.
