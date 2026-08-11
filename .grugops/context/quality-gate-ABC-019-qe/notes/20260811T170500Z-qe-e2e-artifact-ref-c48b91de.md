---
id: 20260811T170500Z-qe-e2e-artifact-ref-c48b91de
kind: artifact-ref
by: qe-e2e
at: 2026-08-11T17:05:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - NFR-002
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - src/turn-loop.nfr.test.ts
supersedes:
---

# The evidence: baseline, thirteen mutants, six probes, and `A17`'s out-of-tree timing half re-run

> **Hand-authored** — see this hop's `observation` note for why. **Nothing here is a `finding`**, and
> no gate verdict is self-attested: `05-pr-quality-gate.md`'s §14 machinery does not exist in this repo.

## Baseline, verified before any mutant so red is attributable to me

Re-run by me in `../cli-chess-ABC-019`, not taken from the brief:

| gate | command | result |
|---|---|---|
| unit | `npm test` | **717/717 on 24 files**, 1.44 s |
| lint | `npm run lint` | exit **0** (2 pre-existing `biome migrate` infos) |
| typecheck | `npm run typecheck` | exit **0** |
| skip count | `AGENTS.md` § Test integrity (`vitest --reporter=json` \| `jq`) | **0** |
| sync | `git rev-list --count HEAD..main` | **0 behind**, 4 ahead |
| tree | `git status --porcelain` | clean at start |

## Method, and its one honest limit

Each mutant was written into `src/turn-loop.ts` by an out-of-tree harness
(`<scratch>/mutate.mjs`, exact-string, anchor-uniqueness-checked), then `npx tsc --noEmit` and
`npx vitest run src/turn-loop.test.ts src/turn-loop.nfr.test.ts` were run, then the file was restored
from a pristine copy and **md5-asserted `c92a1776e34b94cb3d9087dc3510e507` after every single restore**.
Five survivors were additionally run against the **full 24-file lane**.

**The limit, stated rather than assumed away:** `grep -rl turn-loop src/` returns exactly
`src/turn-loop.ts`, `src/turn-loop.test.ts` and `src/turn-loop.nfr.test.ts`, so the two-file runs are
complete for every other file in the lane — and the five full-lane runs confirm it empirically.

**No test file was created, edited, weakened, skipped or deleted.** `src/turn-loop.test.ts` md5
`946df658…` and `src/turn-loop.nfr.test.ts` md5 `d48a0eb3…`, unchanged from start to finish.
`src/status-panel.*` does not exist in this worktree and was not created; `src/frame.test.ts` was not
opened for edit; `plans/board.md` was not opened for edit.

## The thirteen mutants

| # | Wrong build | tsc | suites | full lane | verdict |
|---|---|---|---|---|---|
| `Q1` | **render BEFORE evaluate**, structural rewrite, derive+frame counts preserved | 0 | 2 failed | — | **KILLED** — `A4`, `A13` |
| `Q2` | `thinking` loses its `in-progress` guard (`:198`) | 0 | 41/41 | **717/717** | **SURVIVOR** → G-7 |
| `Q3` | `messages = []` deleted (`:205`) | 0 | 41/41 | **717/717** | **SURVIVOR** → G-1 |
| `Q4` | input throw: render the MID-MUTATION position, then repair, then rethrow | 0 | 41/41 | **717/717** | **SURVIVOR** → G-3 |
| `Q4b` | input throw: repair, write `A8`'s `input ended` notice, then rethrow | 0 | 41/41 | — | **SURVIVOR** → G-3 |
| `Q5` | prompt `game-over`: reason replaced by the constant `"resignation"` | 0 | 41/41 | — | **SURVIVOR** → G-2 |
| `Q5b` | prompt `game-over`: reported as end-of-input (`{null,null,0}` + notice) | 0 | 41/41 | **717/717** | **SURVIVOR** → G-2 |
| `Q6` | engine-side termination emits the terminal frame transition 15 names | 0 | 1 failed | — | **KILLED** — row 12 |
| `Q7` | `A10`'s legality check applied to the INPUT seam too (an ADDITION) | 0 | 41/41 | — | **SURVIVOR** → G-4 |
| `Q8` | the `command` outcome's message items dropped | 0 | 41/41 | — | **SURVIVOR** → G-8 |
| `Q10` | end-of-input reports a claimable draw as its terminal reason | 0 | 4 failed | — | **KILLED** — rows 6, 7, `A4`, `A13` |
| `Q11` | the exit test does not run on the first pass (`+ 1` derive untouched) | 0 | 41/41 | **717/717** | **SURVIVOR** → G-5 |
| `Q12` | derive `H` from frame 1, then normalise every frame to it | 0 | 41/41 | — | **SURVIVOR** → G-9 (declared) |

**13 run · 3 killed · 10 survivors.** The kill rate is low **by construction and I am not dressing it
up**: the sixteen obvious mutants were already killed by two previous hops, so this hop deliberately
aimed only at places nothing had looked. `Q1`, `Q6` and `Q10` are the three where the suite is strong
and were run to prove the net is real, not to pad the count.

## Six probes — the delivered build driven where the suite does not go

Out of tree (`<scratch>/probe*.ts`), importing the worktree's `src/` directly. **Outside the repo and
not named `*.test.ts`, so nothing entered the lane** — the 24-file count is unchanged.

| probe | what the DELIVERED build does |
|---|---|
| already-checkmated start | 1 frame, 0 plies, `events ["frame"]`, `{black-wins, checkmate, 0}` — **correct, and unasserted** |
| already-dead-by-material start (K+N vs K) | 1 frame, 0 plies — **correct, and unasserted** |
| stale message region over 4 frames | cleared correctly: `— / not a move: zzzz / — / —` |
| thinking flag on the mated final frame | `[false, false]` — **correct, and unasserted for the terminal frame** |
| **input seam returns a foreign move** | **PLAYED.** `moves.length` 1, FEN `Rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/1NBQKBNR b Kk - 0 1` |
| prompt-driven `game-over` (resignation) | `{black-wins, resignation, 0}`, 1 frame, and that frame reads `status in-progress` |
| engine-side termination (foreign move, human black) | 1 frame, `thinking [true]`, frame reads `status in-progress`, **0 sink notices** |

## `A17` / `NFR-002` — the OUT-OF-TREE TIMING HALF, RE-RUN. This is the lead nobody had closed

The engineer stated plainly that it was not re-run at the `A9b` hop. It is re-run here.

**Instrument, with every deviation from the one `A17` names spelled out rather than implied:** own
process outside `vitest`, warm-up round discarded, cell order rotated every round, medians of per-round
means, render/input-wait/engine-call excluded exactly as the bar's own exclusion permits (a constant
one-row frame, a no-op sink, seams indexing a precomputed line), game built by
`history.test.ts:81-89`'s LCG so a ply count means here what it means in the lane. **DEVIATIONS: 7
recorded rounds where `A17`'s harness used 8, and iterations 200 / 80 / 25 at 40 / 120 / 300 where
`A17`'s used 400 / 200 / 60.** Marginal reading is `(T(n) − T(n−10)) / 10`.

**darwin-arm64 / Node v24.12.0. `UNKNOWN - verify` on any other hardware.**

| plies | marginal at depth | averaged over the game | bar | marginal ratio |
|---|---|---|---|---|
| 40 | **21.12 µs** | 16.10 µs | ≤ 45 µs | 0.47x |
| 120 | **51.14 µs** | 31.03 µs | ≤ 100 µs | 0.51x |
| 300 | **86.25 µs** | 58.45 µs | ≤ 200 µs | 0.43x |

**Per-round spread, given so the medians are not read as tight:** 40 plies 20.84–27.86, 120 plies
40.92–53.55, **300 plies 74.23–116.44 µs**. The 300-ply cell has the fewest iterations and the widest
spread, and even its worst round is inside its bar.

**Two honest readings of the comparison, because only one of them is flattering:**

1. The averaged column reproduces the engineer's first-hop figures **exactly** (16.09 / 30.99 / 58.49
   there, 16.10 / 31.03 / 58.45 here) — agreement inside 0.1%, which is what makes the instrument
   credible at all.
2. My **marginal** numbers are **LOWER** than the engineer's (27.23 / 58.79 / 112.86), not higher. I
   ran fewer iterations at every cell and the marginal reading is a difference of two noisy
   quantities, so **the engineer's figures are the more conservative and should stay the ones of
   record.** No bar is threatened on either set.

**`MET`/`MISS` against `≤ 45 @ 40`, `≤ 100 @ 120`, `≤ 200 @ 300` is Security/NFR's at the gate. This is
a measurement and it is NOT a verdict** — the same rule `A17` states and `src/gameend.nfr.test.ts:16-17`
states for its own bars. **No number produced here went into the lane, and no bar is proposed to move.**

## Coverage — and the uncovered lines name G-2 on their own, mechanically

`npx vitest run --coverage.provider=v8 --coverage.include='src/turn-loop.ts'` over both delivered
suites:

| file | % stmts | % branch | % funcs | % lines | uncovered |
|---|---|---|---|---|---|
| `src/turn-loop.ts` | **96.96** | **96.77** | **100** | **96.96** | **240–241** |

`.grugops/factory.config.json` sets `quality.coverage_threshold` to **0.8** and `mode` to **`lean`**,
in which the role enforces no threshold — **recorded because it is real, not adjudicated.** At 0.97 it
clears 0.80 either way.

**The interesting half is not the number.** `src/turn-loop.ts:240-241` is
`return { result: outcome.result, reason: outcome.reason, exitCode: 0 };` — **the prompt-driven
`game-over` branch, and it is the ONLY uncovered code in the module.** A v8 coverage run reached the
same conclusion as mutants `Q5` and `Q5b` by a completely independent instrument, which is why G-2 is
the survivor I would close first.

**One transient side effect, recorded rather than hidden:** the coverage run rewrote the repository's
tracked `coverage/` directory. It was restored with `git checkout -- coverage/`, `git clean -fdn`
reports nothing to remove, and `git diff HEAD -- coverage/` is **empty**. No coverage artifact of mine
survives in the tree.

## `quality.ui_e2e` — no E2E, and the reason rather than an invention

`.grugops/factory.config.json` sets `ui_e2e` to `ui-or-critical-path`. **There is no runnable UI
surface**: `AGENTS.md` records `Dev / run` and `E2E` as `UNKNOWN - verify` with the reason (*"no
runnable game until `EPIC-006`"*), there is no CLI entry point, and the loop's two seams are stubs by
this ticket's own design. **So no E2E was written, and none was faked.** The nearest thing that exists
is the fourteen scripted rows driving the loop end to end through both stub seams, which is what this
ticket's `## Test notes` calls testable-end-to-end-today, and it is already delivered. `E2E: not
expected at this ticket; `EPIC-006` is where it becomes possible.`

## `N8-LANE` — not moved, and not re-derived

**Zero test files added, zero tests added, zero tests removed.** The lane is 24 files / 717 tests /
1.44 s before and after this hop. The prior hop's chargeable figure (420 ms against a 650 ms allowance,
0.65x) is untouched and is **not re-derived here** — `N8-LANE`'s owner is BA/PM at each cut.

## The branch went 5 BEHIND `main` DURING this hop, and every measurement above still stands

Verified at start: **0 behind, 4 ahead.** Verified at hand-back: **5 behind, 4 ahead.** Checked at
source rather than assumed, because a moving `main` is how a gate result silently expires:

- **`git diff --stat HEAD...main -- src/` is EMPTY** — the five commits add zero `src/` bytes, so the
  baseline, all thirteen mutant runs, the six probes, the coverage figures and the `A17` timings are
  all still measurements of the tree they were measured on.
- **`plans/tickets/ABC-019-turn-loop-skeleton.md` is NOT touched by any of them**, so the twenty-three
  criteria I tested are the twenty-three that exist.
- **`plans/traceability.md` gained one line on `main`.** My edit is an append to a different row plus an
  inserted `_Updated:` header, so the rebase is mechanical — **flagged for the Orchestrator, not
  resolved here**, since sequencing and the rebase are its call and `ADR-0009` cl. 9f's re-gate is
  owed on this branch anyway.

**One fact the brief gave me has changed, and it changes nothing about my scope:** the brief states
`ABC-027` is "not yet cut". `git log` shows it was **cut and pulled during this hop** (`ffdf0a3`,
`ac88213`). **`ADR-0010`'s narrowing criterion is still NOT in `ABC-019`'s ticket** — verified by the
diff above — so my scope boundary is unchanged and I still did not test it.

**Nothing was read from `ABC-027`, `ABC-017` or `ABC-016` and no message passed to any hop.** These
commit subjects surfaced from `git log` while verifying sync, which is the precedent the engineer set
for `ADR-0010` at the previous hop. **No ticket, note or queue item belonging to another live hop was
opened.**

## What was NOT done

- **No byte under `src/` was changed.** Every mutant was reverted and md5-asserted; final tree clean.
- **`plans/board.md` was not opened for edit.** The move is requested in this hop's `decision` note.
- **`memory-bank/` was not edited**, `ADR-0009` and `ADR-0010` were read only.
- **`plans/tickets/ABC-019-turn-loop-skeleton.md` was read only** — amendments are BA/PM's, and eight
  of my nine survivors are amendments.
- **No merge, no push, no deploy, no `git checkout main`, no dependency change, no rebase.**
- **Concurrency held:** `src/status-panel.*` absent and not created, `src/frame.test.ts` not edited, and
  no queue item belonging to the live `ABC-016` QE hop or the `ABC-027`/`ABC-017` BA/PM hop was read or
  written. **No message passed to either; the on-disk substrate was the only channel.**
