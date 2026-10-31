---
id: 20261031T043705Z-software-engineer-observation-76069fd1
kind: observation
by: software-engineer
at: 2026-10-31T04:37:05Z
verified_by: 
confidence: high for gates, counts, deep lanes and values (all run); the npm test wall is informal (n=3 tip, no base), UNKNOWN - verify
refs:
  - se-ABC-242
  - ABC-242
  - EPIC-010
  - ADR-0054
  - ADR-0032
  - ADR-0046
  - NFR-004
  - NFR-008
  - NFR-009
  - QE-230-a
  - QE-244-a
  - ABC-230
  - ABC-241
  - ABC-243
  - ABC-244
  - grugops/ABC-242
  - 6884d61a
  - 4387d4e8
  - src/levels.ts
  - src/levels.test.ts
  - src/cli.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:aa6b45d455b7d3e0a560a0d6a366878c4a6fd3b12560b44e9dbe84aa8da075b8
---

# `ABC-242` readings at code commit `6884d61a` (base `4387d4e8`): gates, test count, informal wall, deep lanes, A1 values

## Gates (each run once, exit codes as read)
- `npm run lint` 0; `npm run typecheck` 0; `npm run build` 0.
- `npm test`: 63 files, **2 333 passed, 0 failed, 0 skipped** (base 2 323 at `ABC-243`; +10 = the 10 rows added).
- `src/engine.ts` and `src/search.ts`: `git diff --quiet 4387d4e8` holds (byte-identical).

## Informal `G8` wall (host alone, `/usr/bin/time` around `npm test`)
- Tip: 9.22, 9.39, 9.18 s (n = 3, median **9.22 s**); load1 1.27–1.44. Base was not re-run in this window. The
  reference is `ABC-243`'s `G8` H 9.28 s. **Under 9.6 s, so tranche 2 does not fire on this reading.** It is informal;
  `G8` is QE's to read (`UNKNOWN - verify` until then).

## Deep lanes (each once, green)
- `ENGINE_DEEP=1` `src/levels.test.ts`: 53/53 passed, wall 577.66 s, exit 0. Level 5 A5 max 4 002 ms over 30 moves;
  A3 easiest 32/58 vs default 54/58; the 8 `ABC-242` rows green in that lane too.
- `LADDER_DEEP=1` (short, step 120) `src/ladder.test.ts`: 18/18 passed, wall 25.63 s, exit 0. Stronger side scores:
  1v2 4/4, 2v3 3.5/4, 3v4 3/4, 4v5 3.5/4, 1v5 10/10; A5 digest `f61f457801fe67af` reproduces. Levels 1–5 are still
  ordered. This is an identity row for this change, because the ladder hands no prior keys (`A8`).

## A1 values (`UNKNOWN - verify` in the ticket: recorded as read, NOT pinned)
- **Lane form (level 1's 100 ms, rate 1, seed 1, step 10), QE's probe:** head `[d8e8 0, d8c8 −990, d8d7 −1012,
  d8e7 −1003, d8c7 −1002]`, plays `d8c8` (blunder), depth 2, nodes 1 165. Base `[−1005, −1000, −1012, −1003,
  −1002]`, plays `d8c7`. Entries 2–4 equal base's. Entry 1 moved: it takes the skipped slice.
- Same at step 1: head `[0, −1010, −1011, −1016, −1016]`, plays `d8c8`; base `[−1016, −1015, −1011, −1016, −1016]`,
  plays `d8c8`.
- **QE's probe set-up (2 000 ms, `virtualClock(1)`), out of tree:** head `[0, −1041, −1030, −1015, −1031]`, plays
  `d8e7`; base `[−1020, −1030, −1030, −1015, −1031]` (see finding SE-242-a: not the −1013 the ADR recorded).
- Pinned exactly: `scored[0]` = `{d8e8, 0}`; 4 child searches for 5 legal moves; on `last` the whole list is base's
  except its last entry, which is 0; the other fixtures' third-occurrence move is 0 where base reads −1010
  (`d1e1`), 545 (`f1g1`) and 545 (`f8g8`) at step 10 (`raw/probe/values.out`).
- A2 and A3: the whole list, depth and nodes equal base's (A2 `d8e8` −1005 at step 10, a second occurrence).

## Artifacts
- `raw/probe/`: `values.mjs` and `values.out` (base vs head at steps 1 and 10, the final fixtures); `values-run1.out`
  (steps 1–1 000, the first fixture draft with the 2-cycle winning fixtures); `qe-probe.out`; `plant.mjs`,
  `mutants.txt`, `plants-run1.out`, `plants.out`; `npmtest-tip-{1,2,3}.summary`; `deep.summary`; `order.mjs`.
