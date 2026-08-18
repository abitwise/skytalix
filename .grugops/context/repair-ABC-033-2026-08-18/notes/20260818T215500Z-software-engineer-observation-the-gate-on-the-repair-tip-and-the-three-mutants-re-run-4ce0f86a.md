---
id: 20260818T215500Z-software-engineer-observation-the-gate-on-the-repair-tip-and-the-three-mutants-re-run-4ce0f86a
kind: observation
by: software-engineer
at: 2026-08-18T21:55:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-050
  - src/move-input.ts
  - src/move-input.test.ts
  - quality-gate-ABC-033-qe-2026-08-18
supersedes:
---

# The gate on `grugops/abc033-repair` @ `3635927`, and QE's three survivors re-run — every number ran

Written by the FINISHER hop. The repair itself and the five notes above it are the previous hop's
work; it was killed by an API outage before it could gate or publish, and the Orchestrator committed
its notes unchanged at `3635927`. **I did not author those five notes and I re-derived every number
here myself.** The audit of their claims is in the `claim` note alongside this one.

## The lane

The repo root's `npm test` is contaminated by sibling worktrees (`ABC-050`) — every command below ran
in a **contained lane**: the isolated worktree
`/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-ac120c12e649cb52d`,
checked out at `grugops/abc033-repair` @ `3635927`, with its own `npm install` (124 packages, no
`node_modules` shared with the root). Node `v24.12.0`.

## The blocking gate — run, not asserted

| step | command | result |
|---|---|---|
| suite | `npx vitest run --exclude '**/node_modules/**' --exclude '.claude/**'` | **36 files / 1047 tests, 1047 passed, 0 failed**, 2.11 s |
| skip count | `npx vitest run --exclude … --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| skip integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit **0** |
| lint | `npx biome check src tools spike vitest.config.ts` | **61 files checked, no fixes applied**, exit 0 |
| typecheck | `npx tsc --noEmit` | exit **0**, no output |
| build | `npx tsc --noEmit` (`npm run build` IS `tsc --noEmit` on this project — there is no emit step) | exit **0** |
| deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32/32 passed**, 36.17 s |
| deep search | `SEARCH_DEEP=1 npx vitest run src/search.test.ts` | **41/41 passed**, 22.62 s |

Baseline to beat was 1039 tests / 36 files / skip 0. **1047 / 36 / skip 0** — `+8` tests, no new file,
nothing skipped. `src/move-input.test.ts` alone: **40 → 48**.

`npm run lint` is `biome check .` and would sweep the sibling worktrees; the gate ran the scoped form
the brief named (`src tools spike vitest.config.ts`), which is why the file count reads 61 rather than
the whole tree. `vitest.config.ts` is outside `tsconfig.json`'s `include` and outside `biome.json`'s
`files.includes` (the file says so itself), so naming it on the biome argument list is the only way it
is read at all.

## `A7`, measured from git rather than believed

```
git diff --stat 8c84265..HEAD -- src/
 src/move-input.test.ts | 201 +++++++++++++++++++++++++++++++++++++++++++++---
 src/move-input.ts      |  71 ++++++++++++++---
 2 files changed, 250 insertions(+), 22 deletions(-)
```

Two files under `src/`, and they are the two `A7` permits. `src/frame.ts`, `src/san.ts` and
`src/coordinate-move.ts` are untouched — none of the three appears in the diff at all.

## QE's three survivors, re-run on the repair tip. All three now red

Each mutant was applied to `src/move-input.ts`, run as
`npx vitest run src/move-input.test.ts --reporter=json`, then restored from a pristine copy under a
shell `EXIT` trap and confirmed with `diff -q`. **Baseline before any mutation: 48 passed, 0 failed.**
Diffs, as the brief required, not descriptions:

### `M6` — reason code ALWAYS `no-such-move` — was 0 red, now **5 red**

```diff
--- a/src/move-input.ts
+++ b/src/move-input.ts
@@ -187,7 +187,7 @@
 
   return {
     kind: "rejected",
-    messages: [reasons.includes("no-such-move") ? "no-such-move" : "unreadable"],
+    messages: ["no-such-move"],
   };
 }
```

`{ total: 48, passed: 43, failed: 5 }` — the five `unreadable` rows of `A6`'s table. `RESTORE VERIFIED`.

### `M11` — drop the shared `legal` from the candidate render — was 0 red, now **3 red**

```diff
--- a/src/move-input.ts
+++ b/src/move-input.ts
@@ -226,6 +226,6 @@
 ): MoveInputOutcome {
   return {
     kind: "ambiguous",
-    messages: candidates.map((move) => deps.toSan(position, move, legal)),
+    messages: candidates.map((move) => deps.toSan(position, move)),
   };
 }
```

`{ total: 48, passed: 45, failed: 3 }` — the three `RENDERED` rows (two knights, the folded `BXC4`,
six queens). `RESTORE VERIFIED`.

QE's M11 also instrumented `src/legal.ts` to measure the true derive count. I did not repeat that
instrumentation — the guard the repair added does not depend on a count, it asserts the ARGUMENT by
reference, so the mutant is killed by the seam alone. QE's measured counts (1→3 for two knights, 6→12
for six queens) stand as QE recorded them and I did not re-derive them.

### `M12` — swap the attempt order, SAN before coordinate — was 0 red, now **1 red**

```diff
--- a/src/move-input.ts
+++ b/src/move-input.ts
@@ -214,7 +214,7 @@
   legal: readonly Move[],
   deps: MoveInputDeps,
 ): readonly (CoordinateParseResult | SanParseResult)[] {
-  return [deps.parseCoordinateMove(position, text, legal), deps.parseSan(position, text, legal)];
+  return [deps.parseSan(position, text, legal), deps.parseCoordinateMove(position, text, legal)];
 }
```

`{ total: 48, passed: 47, failed: 1 }` — the new precedence test, the only place the rule has an
observable consequence. `RESTORE VERIFIED`. **FINAL RESTORE VERIFIED** after all three, and
`git status` is clean.

### One mutant I ran that nobody asked for: `M7`, the inverse of `M6`

```diff
-    messages: [reasons.includes("no-such-move") ? "no-such-move" : "unreadable"],
+    messages: ["unreadable"],
```

`{ total: 48, passed: 46, failed: 2 }`. QE measured M7 at **1** red against the delivered tests; it is
**2** now. The `G4` note claims the inverse direction "was already covered and still is" — that is
true and it also got stronger. Both directions of the `no-such-move` outranks `unreadable` rule are
now asserted.

## What this note does NOT claim

No `finding` is admissible on this install (`AGENTS.md`, `context.human_admission: off`), so this is
an `observation`: every number above is a command I ran and read, not a verdict anyone stamped. The
QE re-validation of the repair is a separate hop's job and has not happened. **Nothing is merged.**
