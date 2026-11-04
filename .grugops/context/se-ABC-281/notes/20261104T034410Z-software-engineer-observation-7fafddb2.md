---
id: 20261104T034410Z-software-engineer-observation-7fafddb2
kind: observation
by: software-engineer
at: 2026-11-04T03:44:10Z
verified_by: 
confidence: high: every count and kill is from a run under the host lock at the tip; the wall median is an early ungraded reading (n 5, no base arm, no twin)
refs:
  - se-ABC-281
  - ABC-281
  - EPIC-011
  - ADR-0046
  - ADR-0050
  - NFR-008
  - R-N8H-1
  - R-281-a
  - Q-N8H-1
  - QE-208-a
  - QE-087-d
  - ABC-230
  - src/search.null-move.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
  - arch-ABC-281/20261104T032140Z-architect-design-decision-d7b2b02b
  - arch-ABC-281/20261104T032140Z-architect-design-observation-e969c2f0
  - grugops/ABC-281
  - 748d4fa3
  - e526480d
  - 9a8d7493
supersedes: 
seal: sha256:606911ba7da1a193d48e77be92ee8e4fc02440ee9e1fb0ba18711a96ef88c4d2
---

# se-ABC-281 observation: gates, counts, the remnants' mutant kills, and an early wall reading

Software Engineer, task `se-ABC-281`. Branch `grugops/ABC-281` from `main` `748d4fa3`. Test commit `e526480d`, `AGENTS.md` commit `9a8d7493`. Every run below was under the host lock. The mutants ran only in a `git archive` scratch copy of the tip.

## Gates (at the tip)
- `npm run lint` clean (146 files); `npm run typecheck` clean; `npm run build` exit 0.
- `npm test` exit 0: **69 files, 2 650 passed of 2 650**, 0 skipped, 0 failed. Base read 69 / 2 650 / 0 skipped.
- `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: No findings. `lane-inventory.js`: 69 collected, 69 tracked, No findings.
- `src/cli.test.ts` re-run after the `AGENTS.md` edit: 109 passed. `AGENTS.md` is 18 429 B.

## A3 (default lane, base vs tip JSON)
- Each file's count is unchanged: `search.null-move` 38, `engine` 69, `levels` 49.
- Sorted full names are equal to base's except one retitle per file (the moved row's name out, its remnant's name in):
  - `… byte-identical position-6, readings 8 and 10 on chooseMoveWithoutTaper: 0 mutated roots, aborts landing inside a null subtree`
  - `ABC-230 A3 and A4 — … take none A4 (slice): an empty list is node-equal to an absent one on kr-corner, startpos and position-6`
  - `QE-087-d (slice) — one draw per move: seed 1 over the first 10 of the thirty move k is a non-engine move iff the k-th draw of a fresh seededRandom(1) is below the rate`

## A4 (deep lanes, at the tip)
- Each of the three `-t` lines from the page, as spelled with the brackets escaped, run through `node_modules/.bin/vitest`, prints **1 passed** (44, 82 and 57 skipped respectively).
- Full lanes, spelled as in `AGENTS.md`, each exit 0 with 0 failed:
  - null-move: **45 passed**, 27 s;
  - engine: **83 passed**, 190 s;
  - levels: **58 passed**, 586 s.
- Base deep counts, read with `vitest list` and the flag set: 44 / 82 / 57. So each lane is base + 1.

## A2 (bodies)
- Scripted check (`raw/a2check.py`): each moved row's body, from the line after its `it(` header to its `});`, equals base's line for line once the nesting indent is removed. That is +4 spaces for R1, +2 for R2 and +2 for R3; 6, 14 and 15 lines; 3 of 3.
- `sweep` and `READINGS` are unchanged, one copy. The R2 sibling and "A7 — seeded" are unchanged.

## Mutants (ADR-0046's recommended A6 list), whole default lane at the tip
Raw output is in `raw/mut-matrix.tsv`; the mutant edits are `arch-ABC-281`'s `raw/mut.py`, unchanged.

| mutant | default-lane killers at the tip |
|---|---|
| control (no mutant) | 0 failed of 2 650 |
| M1 (`ADR-0050`'s plant, `finally` removed) | 1: the R1 remnant |
| M2 (`[]` leaves the table uncleared) | 1: the R2 remnant |
| M2c (`[]` turns null move off) | 2: the R2 remnant, and `QE-208-c` (a source-literal row) |
| M3c (an extra draw after a blunder decision, `M5b` shape) | 1: the R3 remnant |

The default lane kills 4 of 4, and each kill includes the mutant's own remnant. Deep-lane kills of these mutants were not run here; they are QE's A6.

## Early wall reading (not graded; A8 is QE's)
- Method: `npm test` at the tip, 6 runs back to back inside one lock session, round 0 discarded. Load1 was 2.35–3.53 before each run.
- Runs: 9.50 (discarded), then 9.38, 9.52, 9.38, 9.51, 9.64 s. **Median of the 5 scored runs: 9.51 s.** All 6 passed 2 650.
- The only other vitest-named process on the host was an idle daemon (0.0 % CPU, 70 s of CPU over 2 d 15 h), so the runs were ALONE inside the lock.
- There is no base arm and no twin, so this is not an `NFR-008` grade. 9.51 s is under the 9.6 s `Q-N8H-1` trigger, but only by 0.09 s.
