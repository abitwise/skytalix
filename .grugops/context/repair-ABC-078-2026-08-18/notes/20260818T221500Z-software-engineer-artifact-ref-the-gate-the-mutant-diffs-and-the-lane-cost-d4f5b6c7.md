---
id: 20260818T221500Z-software-engineer-artifact-ref-the-gate-the-mutant-diffs-and-the-lane-cost-d4f5b6c7
kind: artifact-ref
by: software-engineer
at: 2026-08-18T22:15:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - RF-1
  - N8-LANE
  - AR-N8LANE-078
  - src/engine.ts
  - src/engine.test.ts
supersedes:
---

# The branch, the gate, the mutant DIFFS, and what the repair costs the lane

## Branch and commits

Branch `grugops/abc078-repair`, off `grugops/security-nfr-ABC-078` @ `bda909d`. **Not merged, not
deployed, no board column moved.**

| commit | what |
|---|---|
| `12f98f7` | `chore(queue)` — the claim, taken by hand per `AGENTS.md` |
| `c8e4061` | `fix(engine)` — `RF-1`, and the three guards |
| `005f1a1` | `test(engine)` — the fuse in `RF-1`'s clock (see the `RF-1` decision note) |
| `6aa6333` | `test(engine)` — deep-sweep denominator corrected to the 92 actually counted |
| `d4dc5f6` | `docs(engine)` — the test header's lane numbers made true |
| `07bfcae` | `docs(trace)` — the `ABC-078` row, four cells |

**Files changed against the base: two.** `src/engine.ts` **+42/−9** (all of it `RF-1` and the
comments it required) and `src/engine.test.ts` **+318/−13**. **`git diff bda909d HEAD -- src/turn-loop.ts
src/search.ts src/search.test.ts` is EMPTY** — `A6` holds and `ABC-077`'s merged `A6` is not
touched by a byte. `plans/nfr-catalog.md` not opened; no bar moved.

## The blocking gate at the repair tip, in a contained agent worktree

| check | command | result |
|---|---|---|
| tests | `npx vitest run` | **36 files, 1 023 passed, 0 failed** (baseline 1 016) |
| skips | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| lint | `npm run lint` | 64 files, no fixes applied |
| typecheck | `npm run typecheck` | exit 0 |
| engine deep | `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` | **33 passed** (was 23), 120.1 s |
| search deep | `SEARCH_DEEP=1 npx vitest run src/search.test.ts` | **41 passed**, 23.2 s |
| perft deep | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32 passed**, 36.9 s |

**`A1` re-measured at the repair tip** (`ENGINE_DEEP`, real clock, Apple M3 Mac15,13 / Darwin
25.5.0 arm64 / Node v24.12.0, and true of that machine and nothing else):

```
A1 worst case: position-4/f3d4 3025 ms at completed depth 4; over 3 s: 28/30
NFR-005 kiwipete: completed depth 4, 90160 nodes, 3025 ms
NFR-005 position-6: completed depth 3, 112686 nodes, 3009 ms
A2 real clock: 72 ms at completed depth 2
```

**0/30 over the 5 s ceiling.** The 3 s picture is unchanged in kind — 28/30 here against 29/30
(engineer), 29/30 (QE) and 27/30 (Security/NFR), all inside `AR-NFR004-A`'s ≤ 31 ms. **The clamp
changes nothing below 5 s by construction**, and the numbers say so.

## The mutant campaign, with the DIFFS

Method: apply one mutation to `src/engine.ts` in place, run the **whole default suite**, restore
with `git checkout -- src/engine.ts`, and re-verify the blob hash. **Restored blob hash after every
run: `7d54a77db04d2313bbd85725bbd2cb44e4cc7c1f`** (the repaired file; the delivered file was
`04d8eb114ddfb021fcf21f9b3a196d29d465d3dd`, matching QE's). **No production file leaves this hop
modified.**

### `M3c` — QE's `G2` mutant: an anonymous depth-4 cap in the loop BODY

```diff
@@ -268,6 +268,7 @@ export function chooseMove(position: Position, options: EngineOptions): EngineCh
   budget.nextCheck = budget.nodes + NODES_PER_CLOCK_CHECK;
 
   for (let iteration = 2; now() < budget.deadline; iteration++) {
+    if (iteration > 4) break;
     let deeper: Iteration;
     try {
       deeper = runIteration(position, rootMoves, iteration, budget);
```

**Before: 1 016 passed / 0 failed (QE). After: 1 failed | 1 022 passed.**

```
× A4 — no fixed depth anywhere in the delivered engine > goes DEEPER than any small
  hard-coded ceiling would allow — the behavioural half
```

### `M1` — QE's `G1` mutant: the in-recursion clock check deleted

```diff
@@ -163,10 +163,6 @@ function negamax(
   budget: Budget,
 ): number {
   budget.nodes++;
-  if (budget.nodes >= budget.nextCheck) {
-    budget.nextCheck = budget.nodes + NODES_PER_CLOCK_CHECK;
-    if (budget.now() >= budget.deadline) throw ABORTED;
-  }
 
   if (remaining <= 0) return leafScore(position, ply);
```

**Before: 2 failed, BOTH of them `A3` — `A2` passed. After: 3 failed | 1 020 passed, and `A2` is
one of them.**

```
× A2 — ... > visits only a bounded number of nodes past the deadline — the in-recursion check
× A3 — ... > aborts INSIDE depth 3 — the run really did enter the iteration it discards
× A3 — ... > returns the completed depth-2 move, which is NOT the depth-3 move
```

`A2` now earns its own description. `A3` still reds too, which is correct — it was never wrong to
red, it was wrong for it to be the ONLY thing that did.

### `M4` — stalemate scored as a loss (`ABC-077`'s `A5` bug, in the copy a game uses)

```diff
@@ -171,7 +171,7 @@ function negamax(
   if (remaining <= 0) return leafScore(position, ply);
 
   const moves = legalMoves(position);
-  if (moves.length === 0) return isInCheck(position) ? 0 - (MATE_SCORE - ply) : 0;
+  if (moves.length === 0) return 0 - (MATE_SCORE - ply);
```

**Before: 1 016 passed — SURVIVED, including `ENGINE_DEEP` 23/23. After: 1 failed | 1 022 passed.**

```
× A3 (identity) — ... > agrees with search() on move and score across the mate/stalemate endgames
```

Divergences reported: `kq-corner`, `kr-corner`, `kqk-h8`, each at depth 4, **on move AND score**
(`29999` where `search` says `29997`).

### `M4c` — mate distance lost

```diff
@@ -168,7 +168,7 @@ function negamax(
     if (budget.now() >= budget.deadline) throw ABORTED;
   }
 
-  if (remaining <= 0) return leafScore(position, ply);
+  if (remaining <= 0) return leafScore(position, 0);
```

**Before: 1 016 passed — SURVIVED. After: 1 failed | 1 022 passed.** Same test; three **score-only**
divergences at depth 3 (`30000` vs `29997`) and zero move divergences — which is exactly the shape
QE measured (39 score / 0 move at depth 2) and exactly why the move-only assertion could not see it.

### `RF1OFF` — the clamp itself removed, to check the new criterion has teeth

```diff
@@ -254,7 +254,7 @@ export function chooseMove(position: Position, options: EngineOptions): EngineCh
     // `Math.min` and NOT an `if`: it preserves every degenerate budget already measured safe
     // (`NaN` stays `NaN` — both comparisons false, depth 1; `0` / `-1` / `-1e9` unchanged) and
     // turns `Infinity` into the ceiling, which is the module's only non-terminating budget.
-    deadline: start + Math.min(options.budgetMs, HARD_CEILING_MS),
+    deadline: start + options.budgetMs,
```

**3 failed | 1 020 passed** — the elapsed bound, the equality with the ceiling run, and the
infinite-budget case. **Run once WITHOUT the fuse in the test clock first: the suite did not
complete in ten minutes.** That is what the fuse exists for and it is the reason this diff is worth
recording.

## What the repair costs `N8-LANE`, measured rather than estimated

`src/engine.test.ts` in isolation, three runs each side, same machine, same session:

| | tests | test time |
|---|---|---|
| base `bda909d` | 17 | **49 / 49 / 51 ms** |
| repair tip | 24 | **255 / 256 / 258 ms** |

**Delta ≈ +206 ms of test time on this file.** Whole-repo default lane 2.16 s → 2.23-2.39 s wall.

This is expected and was accepted in advance, and it is **reported rather than netted out**:
`AR-N8LANE-078` records ~840 ms net against `N8-LANE`'s 650 ms, and this delta sits on top of that
number. Where it went: the identity sweep ~200 ms, the behavioural depth guard ~50 ms, `RF-1`'s
four assertions ~11 ms, and `A2`'s repair **0 ms** (a step size, not a test). Everything that could
go behind `ENGINE_DEEP=1` did — the 92-position and 209-position sweeps and the 4/6/7 depth ladder
are all opt-in, and the deep lane grew 98.7 s → 120 s to hold them. **No new test FILE and no new
child process**, so neither `N8-LANE`'s floor account nor `N8-SPAWN` is charged.

## Reproducing the mutants

The mutation harness is a throwaway script outside the repository
(`<scratchpad>/mutate.mjs`), anchored on exact source strings and refusing to run if an anchor is
missing. Nothing in the repository knows about it, and `src/` is byte-identical to this branch's
tip after every run.
