---
id: 20260810T124327Z-software-engineer-observation-01636e09
kind: observation
by: software-engineer
at: 2026-08-10T12:43:27Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - NFR-002
  - NFR-003
  - ADR-0003
  - ADR-0004
  - src/san.ts
  - plans/nfr-catalog.md
supersedes: 
---

# The gate, and `N1`–`N4` re-measured against the DELIVERED build: all four bars hold

## The gate (Workflow 05), on the branch tip `grugops/ticket-to-pr-ABC-013`

```
npm run lint       exit 0   (biome; safe autofix applied once per quality.lint.autofix=true,
                             then re-checked clean. The 2 residual infos are the pre-existing
                             biome-config migration notices already on the main baseline.)
npm run typecheck  exit 0   (tsc --noEmit)
npm test           652 passed / 652 on 20 files
skip count         0        (AGENTS.md § Test integrity command)
npm run build      exit 0   (tsc --noEmit — a typecheck wearing the build slot's name)
```

`A22` holds on all three of its clauses. **The suite is green, the skip count is 0, and no existing
test was modified** — `git diff --name-only -- 'src/*.test.ts'` is empty and `git status --short
src/` shows three untracked files and nothing else. The count moved 625 → 652 because 27 tests were
**added** (22 + 5); the 625 pre-existing tests on 18 files are all still green and untouched. The
"625/625" in the subtask brief is the baseline, not a ceiling.

Nothing was made green by moving the thing being measured: `src/legal.ts`, `src/moves.ts`,
`src/apply.ts` and `src/position.ts` are byte-unchanged.

## `N1`–`N4`, measured on the delivered build by the bars' own stated method

Read-only harness outside the repository, importing `src/` by absolute path. Warm-up then 7 timed
repetitions per figure, median reported. Two full runs in **separate OS processes**.
**Apple M3, Node v24.12.0, darwin/arm64** — the machine class the bars name. `UNKNOWN - verify` on
any other hardware.

```
P60 = 1rb4r/3k4/p1ppNn2/1p1np1Q1/1q1P1B1P/PRP2p2/3KP1BR/6N1 w - - 2 31
      42 legal moves, 3 of which give check   ← re-derived here, matches the ticket exactly
```

| id | bar | run 1 | run 2 | verdict |
|---|---|---:|---:|---|
| `N1` | mean supplied ≤ 1/5 of mean unassisted | **8.76x** | **8.73x** | **PASS** (1.75x of headroom) |
| `N2` | mean `toSan(…, legal)` over all 42 ≤ 0.75 µs | **0.483** | **0.483** | **PASS** |
| `N3` | mean `toSan(…)` over all 42 ≤ 6.5 µs | **4.228** | **4.220** | **PASS** |
| `N4` | no single move over 14 µs in either form | **10.24 / 5.82** | **10.37 / 5.70** | **PASS** |

Null floor (empty loop body) **0.001 µs** — 0.2% of the smallest figure below, so the instrument is
not measuring itself. The two runs agree to within 0.4%.

Supporting figures, for the same reason BA/PM published theirs — the aggregate is meaningless
without the population:

```
legalMoves(P60)                     4.498 / 4.495 µs
pawn moves, unassisted    (8)       0.147 / 0.146 µs
piece moves, unassisted   (34)      5.336 / 5.147 µs
checking moves, unassisted (3)      9.551 / 9.600 µs
non-checking, list supplied (39)    0.188 / 0.189 µs
checking, list supplied     (3)     4.498 / 4.637 µs
```

## Three honest comparisons with BA/PM's reference figures

1. **`N1` reproduces**: 8.76/8.73 here against 8.62/8.65 for the reference build. Different code,
   same ratio — which is the property the bar was chosen for.
2. **`N4`'s unassisted worst is HIGHER than the reference's**: 10.24/10.37 µs against 9.34/9.25.
   **This is an instrument difference, not a slower build.** I time one move in a tight loop; BA/PM
   timed the worst member of a 42-move sweep, where the surrounding moves keep caches and branch
   predictors warm. Same order of magnitude, still 1.35x under the 14 µs bar. **I am not claiming my
   build is slower, and nobody should read it as such** — the two numbers were produced by
   different aggregations and are not comparable.
3. **`legalMoves` measures 4.50 µs here against BA/PM's 4.58** and `ADR-0003`'s published
   1.8–5.4 µs range. **No regression from `ABC-009` or `ABC-022` is claimed or refuted** — that
   comparison is still unavailable for the reason BA/PM recorded (wave 1 named a method, not a
   position), and 0.08 µs is inside run-to-run noise anyway.

## What is NOT verified here

- **Any figure on other hardware.** `N2`/`N3`/`N4` are `UNKNOWN - verify` off Apple M3 / Node
  v24.12.0 / darwin-arm64. `N1` is a ratio and should survive a hardware change; that is a property
  of the bar, not something this hop measured on a second machine.
- **`NFR-002`'s frame budget and `NFR-003`'s ~41-move budget.** Not re-measured — no renderer and no
  `moves` command exists to measure. BA/PM's figures stand and `plans/nfr-catalog.md` was not
  edited; no catalog target moved.
- **`npm run perft` was not run.** Nothing in this diff touches the generator, and `src/moves.ts`
  and `src/legal.ts` are byte-unchanged, so the perft counts cannot have moved — but I did not run
  the lane and am not reporting a result for it.
- **No `finding` note is written on this task.** There is no `§14-gate` verdict record to issue a
  `§14-gate#<id>` stamp (`emitVerdict` lives in the absent `scripts/context-io.ts`) and
  `context.human_admission` is `off`, so no `human:<name>` stamp exists. Per Workflow 16 step 4 the
  gate results above are recorded as an `observation`, which is the honest kind — not a `finding`
  with a self-stamp.
