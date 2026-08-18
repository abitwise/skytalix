---
id: 20260818T233000Z-software-engineer-observation-the-gate-on-the-repair2-tip-and-m12-now-reds-without-a-stub-7a41d6c3
kind: observation
by: software-engineer
at: 2026-08-18T23:30:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-050
  - src/move-input.ts
  - src/move-input.test.ts
  - repair2-ABC-033-2026-08-18
  - 20260818T223500Z-qe-e2e-observation-the-gate-on-the-delta-tip-a7-and-the-m11-spot-check-3f0c5d82
supersedes:
---

# The gate on the repair-2 tip, `A7` from git, and `M12` re-run — it now reds **without stubs**

## The lane

Contained: the isolated worktree
`/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-aaa818af58bc93bb9`,
on `grugops/abc033-repair2` (branched off `grugops/quality-gate-ABC-033-delta` @ `723c65b`), with
its own `node_modules`. Node `v24.12.0`. **The repo-root `npm test` / `biome check .` were not run**
— they sweep sibling worktrees (`ABC-050`), which is the same call QE made at the delta tip.

| step | command | result |
|---|---|---|
| suite | `npx vitest run --exclude '**/node_modules/**' --exclude '.claude/**'` | **36 files / 1049 tests, 1049 passed, 0 failed**, 3.32 s |
| skip count | same, `--reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| skip integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit **0** |
| lint | `npx biome check src tools spike vitest.config.ts` | **61 files checked, no fixes applied**, exit 0 |
| typecheck | `npx tsc --noEmit` | exit **0**, no output |
| build | `npx tsc --noEmit` (`npm run build` IS `tsc --noEmit` here) | exit **0** |

**Baseline was 1047 / 36 / skip 0; the tip is 1049 / 36 / skip 0.** `+2` and no other movement, as
expected: the `B2b4` precedence case, and one `toFen` round-trip row for the fixture it introduced.
File count, skip count, lint file count and typecheck are unchanged.

`src/move-input.test.ts` alone: **50 passed (50)**, up from 48.

## `A7`, from git

```
git diff --stat 8c84265..HEAD -- src/
 src/move-input.test.ts | 248 ++++++++++++++++++++++++++++++++++++++++++++++---
 src/move-input.ts      |  90 +++++++++++++++---
 2 files changed, 314 insertions(+), 24 deletions(-)
```

Two files, both `move-input`. `src/san.ts`, `src/coordinate-move.ts` and `src/frame.ts` untouched.
**`A7` holds at the repair-2 tip.**

## `M12` re-run — the whole point of the hop

The mutant, applied to `attemptsOn` and nothing else:

```diff
-  return [deps.parseCoordinateMove(position, text, legal), deps.parseSan(position, text, legal)];
+  return [deps.parseSan(position, text, legal), deps.parseCoordinateMove(position, text, legal)];
```

| module | `npx vitest run src/move-input.test.ts` |
|---|---|
| unmutated | 50 passed, 0 failed |
| **M12 applied** | **2 failed \| 48 passed (50)** |

The two that red:

1. `coordinate outranks SAN when both readers claim the same text — the precedence, asserted` (the
   pre-existing stub case, which reded 1 at the previous tip);
2. **`coordinate outranks SAN on a real line both readers claim — `B2b4` is the pawn, not the
   bishop`** — the new case, **no stubs, no spies, production `parseCoordinateMove` / `parseSan` /
   `legalMoves` throughout**.

The new case's failure, which is the evidence that it reds for the right reason rather than by
accident:

```
AssertionError: expected { from: 19, to: 49, piece: 3, …(3) } to deeply equal { from: 17, to: 49, piece: 1, …(3) }
-   "from": 17,   "piece": 1,     (expected: the pawn from b2)
+   "from": 19,   "piece": 3,     (received: the bishop from d2)
```

Under M12 the player who types `B2b4` gets the **bishop**. That is a player-visible behaviour
difference produced by the swap alone, on a string with no test seam anywhere near it — which is the
thing my earlier `G5` note claimed no input could produce.

**Restoration verified:** the module was restored from a byte copy taken before mutation, the
`attemptsOn` return line was re-read at `src/move-input.ts:232`, the suite re-run green (50/50), and
the full gate above ran **after** restoration. No mutated line was committed. `M6` and `M11` were
not re-run — this hop changed no line either can reach, and QE re-confirmed `M11` reds 3 at the base
commit this branch is cut from.

## Probes

One throwaway probe (`probe-b2b4.ts`, reproducing the counterexample through the three real
entry points) was written and run **outside the repo**, in the session scratchpad, so nothing under
`src/` was created or deleted. `git status --porcelain` is clean of anything but the intended two
source files and this task's notes.
