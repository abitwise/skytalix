---
id: 20260812T154000Z-software-engineer-observation-lane-cost-measured-a20f5c73
kind: observation
by: software-engineer
at: 2026-08-12T15:40:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-017-fixtures
  - ABC-017
  - NFR-008
  - plans/nfr-catalog.md
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - 20260812T145000Z-ba-pm-decision-size-priority-lane-and-board-9b5c31a7
supersedes:
---

# `N8-LANE` measured: **+164 to +182 ms warm, +167 ms cold** — BA/PM's *"tens of milliseconds"* is LOW BY ~5x, and the bar still holds

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp. BA/PM was explicit that its table was *"a prediction to CHECK, not a figure to
> inherit"*. This is the check.

## Method — `N8-LANE`'s own, not one of my invention

`N8-LANE` specifies **the median of paired per-round deltas over n ≥ 7 interleaved rounds with an
identity null control**, in **CPU (user + sys)**. Arms: **A** = this hop's two edited files,
**B** = the same two files at `HEAD`. Nothing else differs, so the delta is this hop's tests and
nothing else. CPU captured with bash `TIMEFORMAT='%U %S'`, which includes reaped children — necessary
here, because vitest forks workers and the `RF-1` probe spawns a process of its own.

## Warm — whole lane, n=8, identity null control

| round | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | median |
|---|---|---|---|---|---|---|---|---|---|
| A − B (ms) | 185 | 179 | 160 | 281 | 72 | 179 | 186 | 273 | **182** |
| null (B′ − B) | 50 | 54 | 147 | 77 | 20 | −36 | 0 | −56 | **35** |

**The null control is 35 ms, which is not nothing**, and the raw totals drift upward across rounds
(8.7 s → 9.4 s), so slot order biases the result. A ran first in every round, so this figure if
anything **understates**. I did not smooth that; I re-measured with the order alternated instead.

## Warm — per file, order ALTERNATED each round, n=7

| file | deltas (ms) | median |
|---|---|---|
| `src/history-pane.nfr.test.ts` | 156, 81, 69, 109, 88, 102, 121 | **+102** |
| `src/history-pane.test.ts` | 122, 59, 98, 56, 38, 79, 62 | **+62** |
| **total** | | **+164** |

The two methods agree inside the null control's own noise (164 vs 182). **The per-file figure is the
one to quote**, because alternating the order removes the drift bias.

## Cold — whole lane, both files re-transformed, order alternated, n=7

Cold defined as the first run after the files change, so vite must re-transform them — the path a
developer or CI hits after an edit. Deltas: 92, 241, 140, 315, 167, 228, 152 → **median +167 ms**.

**Cold and warm are within noise of each other**, and the reason is structural rather than lucky:
every `vitest run` is already a fresh process with a cold JIT, so the only thing "warm" buys is a
transform cache for two files. **This is a different shape from the warm/cold gap the previous
Engineer hop found (8.2 ms warm vs 58–68 ms cold), because that figure was a fixture build inside one
process and this one is dominated by a process spawn.**

## Against the bar

| quantity | value |
|---|---|
| test files added | **0** — both edits land in files already declared |
| `N8-LANE` declared file count | **TWO, unchanged**; floor allowance ~320 ms **untouched** |
| content allowance | **650 ms** (5% of the lane's TOTAL budget) |
| this hop's content cost | **~165–180 ms, ≈ 26%** |
| **verdict** | **`N8-LANE` HOLDS.** No bar re-derived, no clause changed. |

## Where the cost actually is, and the one thing I am flagging

**~102 ms of it — well over half — is the `RF-1` child process.** BA/PM predicted that edit would be
*"small: replaces a `readFileSync` scan of 14 production files with a load probe over a 7-module
closure"*; the prediction missed that a genuine **load** closure cannot be measured in-process here,
because vitest's module runner is not node's ESM loader and the test file is itself an importer of
`history.ts`. The remaining ~62 ms is `A6`'s fixture, `A9`'s extra `buildAllCases()` rebuild and its
28 renders, and `A14`.

> **The flag, stated plainly for the re-gate and the Orchestrator: the ticket records ~410 ms already
> measured against this allowance. Adding ~165–180 ms puts the running total near ~575 ms of 650 ms —
> INSIDE the bar, but no longer roomy.** I am not re-deriving the bar (the ticket forbids it and I did
> not) and I am not proposing a change. If it is ever breached, **the `RF-1` probe is the first item to
> revisit**, and the honest cheaper alternative is a static transitive-import walk — which costs
> ~1 ms and counts syntax, the thing this project's record has already been wrong about twice.

## One component measured directly, for whoever revisits it

`A11`'s full eight-fixture rebuild: **9.3 ms warm, 6.0 ms of it `shuffleGame(2000)`**. That is the
number behind the `A11` per-test-fixture decline and is recorded here so the judgment can be re-checked
without re-running anything.
