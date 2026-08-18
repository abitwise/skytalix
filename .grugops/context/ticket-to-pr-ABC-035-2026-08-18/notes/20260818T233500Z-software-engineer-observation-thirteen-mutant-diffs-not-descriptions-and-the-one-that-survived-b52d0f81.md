---
id: 20260818T233500Z-software-engineer-observation-thirteen-mutant-diffs-not-descriptions-and-the-one-that-survived-b52d0f81
kind: observation
by: software-engineer
at: 2026-08-18T23:35:00Z
verified_by:
confidence: high
refs:
  - ABC-035
  - ABC-033
  - src/command-input.ts
  - src/command-input.test.ts
  - 20260818T194500Z-qe-e2e-observation-thirteen-mutants-and-the-three-that-survived-5e93d8a4
supersedes:
---

# Thirteen mutants against `src/command-input.test.ts` — **twelve died on the first pass, one survived, and the survivor is now dead too**

`quality-gate-ABC-033-qe-2026-08-18` recorded the lesson this note is written to obey: *"a mutation
result is only reproducible if the mutant diff is recorded, not just described."* Every mutant below
is given as its **unified diff against the delivered `src/command-input.ts`**, so any hop can rebuild
it byte-for-byte instead of re-interpreting a sentence.

## Method

Each mutant was written to `src/command-input.ts`, run as
`npx vitest run src/command-input.test.ts --reporter=json`, and the pristine text restored from an
in-memory copy taken before the first mutation. The harness (`mutants.py`) was scratch and is **not
committed**. **Baseline before any mutation: 0 failed of 79.** After the last revert,
`git status --porcelain -- src/command-input.ts` was **empty — RESTORE VERIFIED**, so the gate below
ran on the delivered tree.

## The battery

| id | mutant | red | verdict |
|---|---|---|---|
| M1 | prefix match instead of exact | **3** | killed |
| M2 | no trim | **8** | killed |
| M3 | case-sensitive lookup | **14** | killed |
| M4 | `claim` returns the `command` arm | **3** | killed |
| M5 | `help` hand-written, `claim` missing | **2** | killed |
| M6 | `help` hand-written, names a foreign token | **2** | killed |
| M7 | ask the resolvers FIRST, fall back to the table | **13** | killed |
| M8 | hand the NORMALISED line downstream | **1** | killed (thinly — see below) |
| M9 | one extra `gameStatusOf` in the classifier | **14** | killed |
| M10 | availability-aware `claim` (the pre-2026-08-13 wrong build) | **9** | killed |
| M11 | `board` draws a board into the message region | **3** | killed |
| M12 | a token dropped from the table | **7** (of 78) | killed |
| M13 | `board` writes STRAIGHT to `process.stdout` | **0** | **SURVIVED — repaired, now 1** |

## The diffs

```diff
### M1 prefix match instead of exact — 3 RED of 79
@@ export function classifyCommand(line: string): CommandSpec | undefined {
   const token = line.trim().toLowerCase();
-  return COMMAND_TABLE.find((spec) => spec.token === token);
+  return COMMAND_TABLE.find((spec) => token !== "" && spec.token.startsWith(token));
 }

### M2 no trim — 8 RED of 79
 export function classifyCommand(line: string): CommandSpec | undefined {
-  const token = line.trim().toLowerCase();
+  const token = line.toLowerCase();
   return COMMAND_TABLE.find((spec) => spec.token === token);

### M3 case-sensitive lookup — 14 RED of 79
 export function classifyCommand(line: string): CommandSpec | undefined {
-  const token = line.trim().toLowerCase();
+  const token = line.trim();
   return COMMAND_TABLE.find((spec) => spec.token === token);

### M4 claim returns the `command` arm — 3 RED of 79
 export const COMMAND_TABLE: readonly CommandSpec[] = [
   { token: "quit", outcome: "command" },
-  { token: "claim", outcome: "claim" },
+  { token: "claim", outcome: "command" },
 ];

### M5 help hand-written, `claim` missing — 2 RED of 79
 export function helpMessages(): readonly string[] {
-  return [HELP_HEADING, ...COMMAND_TABLE.map((spec) => spec.token)];
+  return [HELP_HEADING, "help", "board", "quit"];
 }

### M6 help hand-written, names a foreign token — 2 RED of 79
 export function helpMessages(): readonly string[] {
-  return [HELP_HEADING, ...COMMAND_TABLE.map((spec) => spec.token)];
+  return [HELP_HEADING, "help", "board", "quit", "claim", "moves"];
 }

### M7 ask the resolvers FIRST, fall back to the table — 13 RED of 79
 ): PromptLineOutcome {
+  const resolved = resolveMoveInput(history, line, deps);
+  if (resolved.kind !== "rejected") return resolved;
   const spec = classifyCommand(line);

### M8 hand the NORMALISED line downstream — 1 RED of 79
     // resolvers under it own every question of case and whitespace from here on.
-    return resolveMoveInput(history, line, deps);
+    return resolveMoveInput(history, line.trim().toLowerCase(), deps);
   }

### M9 one extra derive in the classifier — 14 RED of 79
 import type { GameHistory } from "./history.ts";
+import { gameStatusOf } from "./history.ts";
 ): PromptLineOutcome {
+  gameStatusOf(history);
   const spec = classifyCommand(line);

### M10 availability-aware claim — 9 RED of 79
 import type { GameHistory } from "./history.ts";
+import { gameStatusOf } from "./history.ts";
-  if (spec.outcome === "claim") return { kind: "claim" };
+  if (spec.outcome === "claim") {
+    const status = gameStatusOf(history);
+    if (status.claimable === undefined) return { kind: "command", messages: ["no claim"] };
+    return { kind: "claim" };
+  }

### M11 `board` draws a board into the message region — 3 RED of 79
 import type { GameHistory } from "./history.ts";
+import { renderBoard } from "./render.ts";
   if (spec.outcome === "claim") return { kind: "claim" };
+  if (spec.token === "board")
+    return { kind: "command", messages: renderBoard(history.position, "unicode", "white-bottom") };
   return { kind: "command", messages: spec.token === "help" ? helpMessages() : [] };

### M12 a token dropped from the table — 7 RED of 78
 export const COMMAND_TABLE: readonly CommandSpec[] = [
   { token: "board", outcome: "command" },
-  { token: "quit", outcome: "command" },
   { token: "claim", outcome: "claim" },

### M13 `board` writes STRAIGHT to stdout — 0 RED of 78 (before the repair), 1 RED of 79 (after)
 import type { GameHistory } from "./history.ts";
+import { renderBoard } from "./render.ts";
   }
+  if (spec.token === "board") process.stdout.write(renderBoard(history.position, "unicode", "white-bottom").join("|"));
   if (spec.outcome === "claim") return { kind: "claim" };
```

## `M13` — the guard gap I went looking for, found, and closed

`A3` says *"no second render is triggered by this ticket, asserted by counting render-seam calls"*.
Two guards answer it: the loop-driven render count (`1 + one frame per non-advancing outcome`) and
the assertion that `board`'s outcome carries **zero** message items. **M11 — a `board` arm that draws
a board into the message region — reds 3.** But both guards watch channels that go THROUGH the loop,
and a module that writes to the stream itself uses neither.

I wrote M13 to find out, expecting it to survive, and **it did: 0 red of 78.** That is the same
failure shape as `ABC-033`'s M11 (a guard blind to a direct import) one layer out, and it is
precisely the ticket's own named security firing threshold — *"any direct stream write"*. It is
repaired rather than recorded: `src/command-input.test.ts` now spies `process.stdout.write` and
`process.stderr.write` across every token spelling and asserts **0**, with a **control** write inside
the same window asserting the spy reports **1** when something really does write. M13 now reds **1**.

## Thin kills, named rather than left to be discovered

- **M8 reds 1.** The whole "the line goes downstream unmodified" property rests on one row. It is a
  real property (`ABC-033` decided case is meaning) and one guard is genuinely all it takes to
  observe it, but a future edit to that row silently removes the only witness.
- **M1 reds 3** — `"hel"`, `"h"`, `"cl"`. `"boards"` and `"b4"` do **not** red under a prefix matcher
  (neither is a prefix of a token), so the load-bearing `b4` row in `A1`'s negative half is a guard
  against a *different* wrong build (a `startsWith` in the other direction, or an alias table) than
  the one M1 builds. Both wrong builds are worth guarding; only one is measured here.
- **M5/M6 red 2 each.** `A4` is guarded in both directions — a missing token and a foreign token —
  and each direction is one row wide.

## What I did NOT do

I did not re-run `ABC-033`'s thirteen mutants. `src/move-input.ts` is byte-untouched on this branch
(`git diff main..HEAD -- src/` shows only the two `command-input` files), so their results stand as
QE recorded them and re-running them would measure that branch, not this one.
