---
id: 20261009T193917Z-software-engineer-observation-abc086-gates-deep-lane-n8lane-over-542d743a
kind: observation
by: software-engineer
at: 2026-10-09T19:39:17Z
verified_by: 
confidence: high
refs:
  - ABC-086
  - ADR-0027
  - N8-LANE
  - NFR-008
  - NFR-004
  - ABC-078
  - src/virtual-clock.ts
  - src/engine.ts
  - src/engine.test.ts
supersedes: 
---

# `ABC-086` — gate green, `ENGINE_DEEP` green, criteria met; `N8-LANE` OVER (+1 070 ms vs 650)

Hand-authored, no seal. Branch `grugops/ABC-086-virtual-clock` from `1d74693`. Code commits:
`1ae5284` (feature) and `f9d58ee` (the `A4` row title only). The gate ran on the `f9d58ee` tree.
Machine: Apple M3 (Mac15,13), macOS 26.5.2, Node v26.11.0. The host was loaded throughout
(load1 2.6–15). Raw files are beside this note (`raw-*`).

## Gate (Workflow 05 order, `AGENTS.md` commands)

| step | result |
|---|---|
| host protection | exit 2, `UNKNOWN - verify`: no git remote, so `gh` returned no readable status. Never read as a pass |
| `npm run lint` | exit 0. Biome's safe autofix ran once, on formatting and import order only in the new rows |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 (`tsc --noEmit`) |
| `npm test` | exit 0: **48 files, 1494 passed** (base 48 / 1485, +9 rows), 5.86 s |
| skip count | `0` (`numPendingTests + numTodoTests`) |
| skip integrity | `No findings.`, exit 0 |
| e2e / UAT spec integrity | not applicable: no UI, no `*.uat.spec.ts` |

## `ENGINE_DEEP=1 npx vitest run src/engine.test.ts`

**Exit 0, 45 passed (33 default), 269.0 s** (`real` 4 m 30 s, `user` 4 m 27 s). That is up from
`AGENTS.md`'s 23 / 17 / 98.7 s line, which was already stale at the base: the base was 33 / 24. This ticket adds 12 rows: 9 default and 3 deep.

- **`ABC-086` `A1`:**
  - The depth-floor row is green (≥ 15/30 at depth ≥ 4; the probe read 27/30), 10.7 s.
  - **300/300 identical, green, 106.5 s.**
- **`ABC-086` `A2`:** kiwipete × 10 on the wall clock, `DEFAULT_BUDGET_MS`. Every move is legal;
  all ten read `e2a6@d5`, at 3 006–3 032 ms. This is REPORTED and deliberately not asserted.
- **`ABC-078`** `A1` worst case: `startpos/g1h3`, 3 023 ms at depth 7, 0/30 over 5 s.
  `NFR-005`: kiwipete d5 and position-6 d5 at 3 s, under load. That is not an `NFR-005` reading
  for this ticket, which is not triggered.

## Criteria

| # | verdict | reading |
|---|---|---|
| `A1` | MET | 300/300 on the deep lane at budget 24, with the depth-4 floor asserted. 60/60 on the default slice. The rows import `src/virtual-clock.ts` |
| `A2` | MET | 10/10 legal, depth reported, identity not asserted, and the reason is in the file |
| `A3` | — | moved to `ABC-087` `A9` |
| `A4` | MET | `git diff 1d74693 f9d58ee -- src/ \| grep '^+' \| grep -E 'Math\.random\|Date\.now\|performance\.now'` gives **0 lines**. At `1ae5284` it gave 1, the `A4` row's own title string, which was renamed in `f9d58ee`. The only `Date.now` in production `src/` is `src/engine.ts:457`, `options.now ?? Date.now` (the old `:452`). The module row is green |
| `A5` | MET | (i) The `cli.ts` construction is pinned by a row. (ii) The import walk reaches `engine.ts` and not `virtual-clock.ts`. (iii) Of `src/engine.ts`'s diff, 0 changed lines are non-comment (`-U0`, comment filter), and `src/search.ts` has 0 lines of diff. The `ABC-078` `A4` export pin is green, unamended |
| `A6` | MET | 10/10 per engine, interleaved against alone. The engines differ on 3/10 positions. The clock's per-instance state is checked directly |
| `A7` | MET | 5/5 throws (`RangeError`); readings exactly `[0, 0.5, 1]` and `[0, 1, 2]` |

## `N8-LANE` — OVER THE BAR

The standing instrument (`plans/nfr-catalog.md`): CPU = user + sys of `npx vitest run --dir src`,
one fresh process per run, conditions rotated each round, 9 rounds with round 0 discarded, test
counts asserted per run. The harness is `ABC-121`'s, re-pointed.

- **Arms:** A = `1ae5284`, N = a `cmp`-verified copy of A (3 566 files, 0 mismatches), and
  B = the base `1d74693`. Counts: A and N 48 / 1494, B 48 / 1485. 0 harness errors in 27 runs.
- **Null control N − A:** median **−0.010 s (−0.04 %)**, sign 4/8. Admissible (≤ 1.5 %, sign at
  chance).
- **Charge A − B:** per round +0.81 +0.77 +1.05 +1.09 +1.48 +1.53 +0.77 +2.75 s. **Median
  +1.070 s CPU**, sign **8/8**.
- **Net:** 0 test files added (`src/virtual-clock.ts` is not a test file), so there is no floor
  subtraction, and no spawns. **Net +1 070 ms against the 650 ms bar: over by 420 ms (1.65×).**
  The wall median is −0.05 s (wall is not the instrument).
- **Load:** load1 median 11.3 (2.6–15.0), so confidence is medium. The sign of 8/8 says the
  effect is real, and the 1.65× margin is larger than any load swing in the rounds.

**Attribution** (in-vitest `process.cpuUsage`, one process, two readings, load about 8–12):

| row | cost |
|---|---|
| `A1` default slice, 30 × 2 at budget 2 | **713 / 903 ms** |
| `A6` | **303 / 403 ms** |
| every other new row | ≤ 3 ms wall |

- **The ticket's figure under-predicted the slice by 3–4×.** It came from `rescore-abc086` (246–256
  ms), read in plain `node` and not in the lane. The same 30 × 2 slice reads about 190 ms in plain
  `node` here, warm, and 713–903 ms inside vitest.
- **The ticket's stated fallback does not reach the bar.** Moving `A6` to the deep lane leaves
  `A1`'s slice alone at about 0.7–0.9 s.
- **A measured alternative, not adopted:** a 30 × 2 slice at budget 1 costs 256–258 ms in vitest.
  But budget 1 completes only depth 1 everywhere, which weakens what the slice guards.

Per the brief's stop condition, **no test was trimmed or moved.** The hand-up is claim `…3bb7069b`.
