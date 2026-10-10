---
id: 20261010T102840Z-security-nfr-observation-abc127-a7-quiet-20-24s-n8lane-225ms-net-budget-edge-4pct-red-6a3b6274
kind: observation
by: security-nfr
at: 2026-10-10T10:28:40Z
verified_by:
confidence: high
refs:
  - ABC-127
  - ABC-083
  - ABC-087
  - RISK-003
  - N8-LANE
  - NFR-008
  - ADR-0019
  - ADR-0027
  - ADR-0028
  - src/puzzle-suite.test.ts
  - src/puzzle-corpus.ts
  - src/puzzle-suite.baseline.json
  - src/engine.ts
  - plans/nfr-catalog.md
  - plans/tickets/ABC-127-harder-puzzles-catch-the-surviving-weakenings-and-leave-headroom.md
  - .grugops/context/ticket-to-pr-ABC-127/notes/20261010T091643Z-software-engineer-observation-abc127-gates-a1-a8-readings-eee7be49.md
  - .grugops/context/qe-ABC-127/notes/20261010T094235Z-qe-e2e-decision-abc127-verdict-pass-with-gaps-affa3970.md
  - .grugops/context/qe-ABC-127/notes/20261010T094235Z-qe-e2e-observation-abc127-readings-a3-17of17-identical-oracle-38of38-f5e127b9.md
  - .grugops/context/secnfr-ABC-084/notes/20261009T223620Z-security-nfr-observation-abc084-n8lane-met-85-210ms-net-a6-oracle-195ms-a5-false-red-under-load-7f3b2d61.md
supersedes:
---

# `ABC-127` readings: `A7` gating **20.4–24.3 s**, whole lane **32.9–36.2 s** at load1 3.8–5.4. `N8-LANE` **+225 ms net** (contended, admissible; the file alone +45 ms). The suite's budget edge: **4 % fewer readings turns the gate red**, and **4 of 5 benign evaluation terms planted out of tree turn it red**

Hand-authored and unsealed (no sanctioned writer on this install; `human_admission` is `off`).
Reviewed at tip `1087a42` on `grugops/ABC-127-harder-puzzles`; its `src/` is byte-identical to
`47433c5`. Machine: Apple M3 (8 cores), Darwin 25.5.0, **Node v26.11.0**. The catalog's reference is
Node v24.12.0, so every absolute figure is `UNKNOWN - verify` against it. Paired deltas are the
quantity the bars read.

**Load.** Another project's vitest loops (`~/Projects/public/grugops`) ran throughout, and `ABC-119`
was being built in a sibling worktree. **No load was induced by this gate**: `ABC-119`'s lane spawns
the real engine on wall-clock budgets, and a stress run here could have reddened it. Each reading
carries load1 and the count of foreign vitest processes. Raw files: `../probe/`.

## Gate re-check at `1087a42` (`probe/raw-gates.txt`), 09:57 UTC, load1 12.4 → 13.0

- `npm run lint`: 97 files, no fixes, exit 0.
- `npm run typecheck`: exit 0.
- `npm test`: exit 0, **50 files / 1543 passed**, 6.23 s.
- Skip count: 0.

## `A7`: `PUZZLE_DEEP=1` in the worktree (`probe/a7-deep.mjs`, `probe/a7-*.tsv`, `probe/a7-*-run*.txt`)

Each run is one fresh process. Before each run, the harness waited until load1 < 4, or 120 s at most.

| UTC | load1 start → end | foreign vitest | gating (vitest) | ORACLE m3 / wm | whole lane (process real) | conforming (load1 ≤ 8) |
|---|---|---|---|---|---|---|
| 09:50:35 | 3.96 → 5.42 | 5 | **24.26 s** | 6.65 / 4.44 s | **36.22 s** | yes |
| 10:08:55 | 3.77 → 4.40 | 4 | **21.42 s** | 7.23 / 4.83 s | **34.45 s** | yes |
| 10:10:09 | 3.98 → 4.54 | 4 | **20.40 s** | 6.84 / 4.63 s | **32.85 s** | yes |
| 09:53:12 | 16.58 → 24.54 | 7 | 31.37 s | 9.93 / 7.13 s | 50.21 s | no (waited 120 s) |
| 09:56:02 | 16.18 → 15.02 | 7 | 34.54 s | 10.25 / 7.50 s | 53.28 s | no (waited 120 s) |
| 09:57:42 (gate row only) | 11.61 → 10.84 | 8 | 26.86 s | — | 27.68 s | no |

- All runs exit 0, 17 passed, 58/62, with no `NEWLY-*` line. The 62 per-row lines of the three
  conforming runs are identical (md5 `8f0ca34a…`), so `A6` holds here as well.
- **Conforming readings: gating 20.4–24.3 s against ≤ 45 s, and whole lane 32.9–36.2 s against
  ≤ 90 s.** That is 1.9x and 2.5x of margin. They agree with the build's 20.3–20.8 / 32.1–33.5 s.
- **Loaded readings:** at load1 11–25 the gating run reads 26.9–34.5 s and the lane 50.2–53.3 s.
  QE's worst was 43.7 s at load1 9–19. None of these is a breach, because the caps are defined at
  load1 ≤ 8.
- **What a gating run costs.** It counts **1 201 283 nodes** (the sum of the 62 rows' `n`). At
  20.4 s that is **about 17 µs of wall per counted node**.

## The 300 s hang guards: what the wall is made of (`src/engine.ts` `NODES_PER_CLOCK_CHECK = 1024`)

- **Deterministic mode reads the virtual clock every 1 024 nodes**, so the budget (25 readings at
  step 1) is a **node count**, about 25 600 nodes per move. The wall is then that node count times
  the **cost of a node**.
- **So the deep lane's wall scales with the cost per node, and not with the budget.** An engine
  change that makes a node dearer raises every gating wall in proportion, at the same budget.
- **Measured with a mobility-shaped probe:** two `legalMoves` calls per evaluation, planted out of
  tree (below, E3–E5). Gating read **51.8–52.6 s at load1 3.9–6.5**, which is 2.2–2.5x the shipped
  20.4–24.3 s.
  - That is over `A7`'s 45 s **at a conforming load**.
  - Times the worst inflation measured in this repository (6.3x, `ABC-084`, load1 49–54) it gives
    **about 330 s**, past the 300 s guard.
- **The 4x readings run (QE-127-g, 299.0 s at load1 19 → 44) is a probe and not a lane row.** No
  lane row runs at step 0.25: the gating row reads its step from the baseline file, which says 1.
  Its 299 s is 4x the nodes at about 2.5x load inflation (the build read it at 119.6 s, load1
  6.9 → 11.8).

## `QE-127-a`: the budget edge, measured (`probe/sweep.tsv`, `probe/sweep-run*.txt`)

The tree's `src/` was copied out of tree (arm S), with only the baseline file's `stepMs` changed.
`-t "the gate"` ran the gating row alone. The solved count is deterministic, so no load gate was
needed (load1 6.6–11.6).

| step | readings (about) | solved | gate | rows lost (all `depth≥5` mate-in-3, each at a shallower depth than recorded: 1008/1424/1982 d5 → d4, 1075 d6 → d5) |
|---|---|---|---|---|
| 1 | 25 (recorded) | 58 | green | — |
| **1.05** | **24 (−4 %)** | **57** | **red** | seed 1982 |
| 1.1 | 23 (−8 %) | 55 | red | + 1008, 1424 |
| 1.15 | 22 (−12 %) | 54 | red | + 1075 |
| 1.2 / 1.25 | 21 / 20 | 54 | red | the same four (QE's 0.8x reading reproduced) |

**One virtual reading of 25, that is 1 024 nodes, separates the shipped engine from a red.** Seed
1982 completes depth 5 at the recorded budget with the least slack of any row. These four rows are
the ones `W13` and `W14` rest on: `W14` = 1008 + 1075, and `W13` includes 1982.

## The direct test: plausible, non-weakening evaluation terms, planted out of tree (`probe/plant-eval.mjs`, `probe/plant-*`)

- **Setup.** One term at a time was planted in arm S's `src/evaluate.ts`, at the recorded config,
  with the gate row only. The worktree was never touched, and arm S's `src/` was `diff`-identical
  to the tip after the restore.
- **Purpose.** These terms are **probes of the shape `ABC-083` (king safety, mobility) will
  have.** They are not proposals, and they are not weakenings in the sense of `A3`.

| plant | solved | gate | NEWLY-MISSED (depth) | gating wall (load1) |
|---|---|---|---|---|
| E1: +10 cp tempo for the side to move | **57** | **red** | seed 1008 (d4) | 20.9 s (9.1) |
| E2: +3 cp × own legal moves | **54** | **red** | 1008, 1424, 1982, plus 2 win-material rows; **and 1 NEWLY-SOLVED** (seed 24) | 33.7 s (8.1) |
| E3: +1 cp × (own − opponent legal moves) | 58 | green | — | 52.5 s (6.5) |
| E4: +3 cp × (own − opponent) | **57** | **red** | seed 1982 (d4) | 52.6 s (4.7) |
| E5: +5 cp × (own − opponent) | **55** | **red** | 1982, plus 2 win-material rows | 51.8 s (3.9) |

**Re-run with more readings:**
- **E4** reads **58, green**, at step 0.95 (+5 %) and at step 0.9. Its red is budget-edge drift
  alone.
- **E1** still misses seed 1008, at **d4**, at +5 % and +11 %. The tempo term enlarges that row's
  tree to depth 5 by more than 11 %. It is still a depth that was not reached, not a wrong mate
  evaluation.

**Compare QE's matrix (`qe-ABC-127/probe/a3/`).** The evaluation weakenings `W6`, `W7`, `W8` and `W10`
(N↔R, Q = 300, P = 300, PST off) leave all four edge rows solved. Only `W9` (eval ignores side) and
the search weakenings reach them. **So the edge rows are not sensitive to "the evaluation is
wrong". They are sensitive to "the tree to depth 5 got bigger"**, and an added term can do that
without being wrong.

**There are two kinds of miss, and the per-row depth tells them apart.**
- **The mate-in-3 misses fall a ply short.** The row reads d4 where d5 was recorded. That is
  budget-edge drift.
- **The win-material misses under E2 and E5 sit at the recorded d5.** There the engine prefers
  mobility to a material gain of 2 pawns or more. That is a real evaluation preference against a
  label whose margin is evaluator-shaped: the rows were curated with "every other move ≥ 2 pawns
  behind" on material alone. This is exactly `ADR-0028` decision 2's case (a row whose label
  depends on an evaluator margin is a fixture).

**The masking case is real.** E2 lost 5 rows and gained 1 (QE-127-d).

## `ADR-0028` decision 3, read onto this count

If the ÷1.5 headroom were applied to the baseline, it would read 58 / 1.5 → **39**. QE's 17
weakenings then read: **13 of the 15 reds turn green** (`W1` 47, `W1b` 41, `W4` 44, `W5` 48, … ≥ 39).
Only `W3` and `W15` (35) stay red. That undoes `A3`, and 39 is below `ABC-084`'s own 40 floor.

## `A8` / `N8-LANE` (`probe/n8-lane.mjs`, `probe/n8-lane.tsv`, `probe/n8-lane-summary.txt`)

**The instrument is the standing protocol.**
- **Arms**, out of tree via `git archive`, each with `node_modules` linked:
  - **A** = `1087a42`, 50 files / 1543 tests;
  - **N** = a copy of A, `diff -rq` clean;
  - **B** = base `4a64dd9`, 50 / 1540.
- **Runs:** `npx vitest run --dir src`, one fresh process per run, CPU = user + sys from
  `/usr/bin/time -p`.
- **Rounds:** 9 rounds rotated, round 0 discarded (n = 8). Counts asserted on every run. Median of
  paired per-round deltas, with the sign test beside it.
- **Load gate:** load1 < 8, or 90 s at most per round.
- **Net = gross.** `ABC-127` adds **0 test files** (`A8`: 50 → 50), so there is no floor to
  subtract, and **`N8-SPAWN` is 0** (no child process).

| quantity | reading |
|---|---|
| **null N − A** | **−475 ms = −1.35 %**, sign 3/8: **admissible** (≤ 1.5 %, sign at chance), only just |
| **charge A − B** | **+225 ms**, sign 5/8 (per round: +340 +800 +110 +890 −100 −2 340 +1 120 −1 490) |
| medians, CPU | A 35.2 s, N 34.9 s, B 35.3 s (contended). Rounds 0–1 at load1 4.6–8.6: A 26.2 / 26.5, B 26.7 / 26.2 s |
| load1 before runs | min 4.61 / **median 21.15** / max 36.03. Foreign vitest on **27 of 27** runs. 0 harness errors |

**Reading.** **+225 ms against 650 ms.** At a load1 median of 21 the lane instrument **cannot
separate it from zero**: sign 5/8, and rounds swing ±2 s. That matches the build's +435 ms (sign
6/8, load1 median 15).

**Supplement: the file alone resolves the content** (`probe/onefile.mjs`, `probe/onefile.tsv`).
- `npx vitest run src/puzzle-suite.test.ts` was run in arms A, N and B: 13 rounds rotated, round 0
  discarded, load1 15–24.
- **A − B +45 ms, sign 8/12.** The null N − A reads −25 ms, sign 5/12.
- Medians: A 1.54 s (12 tests) against B 1.48 s (9 tests).
- The build read +30 ms (7/12). The content `ABC-127` adds to the default lane is three cheap rows
  and 22 data rows. Its oracle rows are deep-only.

## Security surface (ASVS L1, `block_on: high`, `compliance_regime: []`)

The diff `4a64dd9..1087a42 -- src` holds three files:
- `src/puzzle-corpus.ts` (+50/−1): data rows and one type;
- `src/puzzle-suite.test.ts` (+202/−2): pure search functions over `legalMoves` / `makeMove`, and
  console lines;
- `src/puzzle-suite.baseline.json` (+14/−7): data.

**What the added lines do not contain:** `process.*`, a dynamic `import()`, `fs`, a spawn, `exec`,
`fetch`, `eval` or `Function`. The env gate and the fixed-path baseline read are `ABC-084`'s and are
unchanged.
- No production module imports `src/puzzle-corpus.ts`.
- No change to `package.json`, the lockfile, `vitest.config.ts` or `tools/`.

**L1 items checked:**
- V1.2.5 (OS command injection): no spawn.
- V1.3.2 (dynamic code): none.
- V5.3.2 (internally generated paths): the URL is fixed, `new URL(..., import.meta.url)`.

**No finding.** The page's "Security: not triggered" is confirmed.

## `NFR-008` (read, not ruled; `ADR-0019`)

- The base arm's lane reads **26.2–26.7 s CPU** (rounds 0–1, load1 7.2–8.0), and 35.3 s median under contention, on Node v26.11.0, against a 15 s CPU clause and a 3 s wall
  clause. As at `ABC-082` and `ABC-084`, it sits far above both.
- `ABC-127` adds 0 files.
- This stays with Architect/Design (`ADR-0019`) and with the owner for the level.
