---
id: 20260818T223500Z-qe-e2e-observation-the-gate-on-the-delta-tip-a7-and-the-m11-spot-check-3f0c5d82
kind: observation
by: qe-e2e
at: 2026-08-18T22:35:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-050
  - src/move-input.ts
  - src/move-input.test.ts
  - repair-ABC-033-2026-08-18
supersedes:
---

# The gate on the delta tip, `A7` from git, and one mutant spot-checked

## The lane

Contained: the isolated worktree
`/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-a75be03c6c5c9adbb`,
on `grugops/quality-gate-ABC-033-delta` (branched off `grugops/abc033-repair` @ `ab5e102`), with its
own `npm install`. Node `v24.12.0`. **The repo-root `npm test` / `biome check .` were not run** — they
sweep sibling worktrees (`ABC-050`) and the brief says not to chase that.

| step | command | result |
|---|---|---|
| suite | `npx vitest run --exclude '**/node_modules/**' --exclude '.claude/**'` | **36 files / 1047 tests, 1047 passed, 0 failed**, 2.27 s |
| skip count | same, `--reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| skip integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit **0** |
| lint | `npx biome check src tools spike vitest.config.ts` | **61 files checked, no fixes applied**, exit 0 |
| typecheck | `npx tsc --noEmit` | exit **0**, no output |
| build | `npx tsc --noEmit` (`npm run build` IS `tsc --noEmit` here) | exit **0** |

**Baseline 1047 / 36 / skip 0 confirmed independently.** This hop added no test and changed no
production line, so the numbers are expected to be identical to the finisher's and they are.

## `A7`, from git

```
git diff --stat 8c84265..HEAD -- src/
 src/move-input.test.ts | 201 +++++++++++++++++++++++++++++++++++++++++++++---
 src/move-input.ts      |  71 ++++++++++++++---
 2 files changed, 250 insertions(+), 22 deletions(-)
```

Two files, both `move-input`. `src/frame.ts`, `src/san.ts`, `src/coordinate-move.ts` untouched.
**`A7` holds at the delta tip.**

## `M11` spot-checked — the brief said one of three, and I took the one whose guard is subtlest

`M11` drops the third argument to `toSan` in `ambiguous()` (`src/move-input.ts:229`), the mutant that
reded **0** at the original gate because a spy on `deps.legalMoves` alone cannot see it.

```diff
-    messages: candidates.map((move) => deps.toSan(position, move, legal)),
+    messages: candidates.map((move) => deps.toSan(position, move)),
```

`npx vitest run src/move-input.test.ts` → **3 failed | 45 passed (48)**. Baseline unmutated: 48
passed, 0 failed. **The finisher's "M11 reds 3" reproduces exactly.** Module restored from a pristine
copy and `git status` confirmed clean before the gate above ran. `M6` and `M12` not re-run — the brief
said spot-check one.

## Probes

Three throwaway probes (`probe-delta.ts`, `probe-residue.ts`, `probe-g5.ts`) and a copy of the
`8c84265` module at `src/__baseline-move-input.probe.ts` were created, run, and **deleted before the
gate**; `git status --porcelain` was empty afterwards. Nothing under `src/` was left behind and no
production line was changed by this hop. What they did and how to rebuild them is in the `claim` and
`observation` notes alongside this one.
