---
id: 20260819T002500Z-qe-e2e-claim-the-A2-and-A6-controls-attacked-and-both-hold-a1d55f3c
kind: claim
by: qe-e2e
at: 2026-08-19T00:25:00Z
verified_by:
confidence: high
refs:
  - ABC-035
  - ABC-033
  - src/command-input.ts
  - src/command-input.test.ts
  - 20260818T234000Z-software-engineer-claim-every-criterion-a1-a8-and-the-evidence-that-answers-it-6d2b91c4
supersedes:
---

# `A2` and `A6` — the two zeros I was sent to break, attacked at the mechanism, and **both hold**

The subtask names `A2` as the claim it most wants attacked: *"both resolvers 0 and `legalMoves` 0
with a control reading 1/1/1 … verify the control is real and the zero is not an artifact of a spy
installed on the wrong object; that is exactly `ABC-033`'s `G3` failure one layer out."* Same
question for `A6`'s hoisted `vi.mock`.

**A control that lives in the same file as the claim can only prove so much.** The `A2` control
(`e1d1`) and the `A6` control (two direct calls from the test body) each prove the spy *can* count —
but neither proves the spy sits on the object **production code actually reaches**, because both
controls make their call from the *test file*, not from `src/command-input.ts`. `ABC-033` `G3` failed
in exactly that gap. So I attacked each with a mutant that makes the **production module** perform
the forbidden call, which is the only construction that closes it.

## `A2` — attacked with `C2`, and the zeros are LIVE

```diff
### C2 `help` alone falls through to the resolvers — 10 RED of 79
   const spec = classifyCommand(line);
-  if (spec === undefined) {
+  if (spec === undefined || spec.token === "help") {
```

**10 red**, and the failing rows include, by name:

```
ABC-035 A2 — a command never reaches a resolver calls neither resolver for "help"
ABC-035 A2 — a command never reaches a resolver calls neither resolver for "HELP"
```

This is a **stronger control than the one in the file**. The in-file control proves the spies see a
call for `"e1d1"` — a *different line*, taking a *different path*. `C2` proves the spies see a call
for **`"help"` itself**, driven through **the same 13 spellings the criterion asserts zero on**, made
by the production module rather than by the test. The zero in `A2` is therefore the zero of a seam
that is genuinely reached and genuinely silent — **not** the zero of a seam nothing routes through.

**`A2`'s spy is on the right object. VERIFIED.** `ABC-033` `G3`'s failure shape does not recur here,
and the reason it does not is structural: `resolveMoveInput` takes `deps` as a parameter and
`resolvePromptLine` passes it straight through, so there is no direct-import path for the call to
escape down. The engineer's `M7` (ask the resolvers first — 13 red) is the same evidence from the
other side.

## `A6` — attacked with `R9`, and the hoisted mock DOES see a production-side direct import

This is the sharper of the two, because `A6`'s in-file control is genuinely weak on its own: it calls
`gameStatusOf(history)` **from the test file**, which proves only that *the test file's* import is
mocked. It does not prove the mock reaches `src/command-input.ts`'s module graph. If it did not, the
thirteen zeros would mean nothing.

```diff
### R9 one extra derive inside the production module — 14 RED of 79
 import type { GameHistory } from "./history.ts";
+import { gameStatusOf } from "./history.ts";
+  gameStatusOf(history);
   const spec = classifyCommand(line);
```

**14 red**, and the failing rows are `A6`'s own, by name:

```
ABC-035 A6 — the parser adds ZERO derives: it does not ask derives nothing for "help"
… "HELP" … "  help  " … "Help" … "board" … "BOARD" … (14 in total)
```

That is a **direct import added inside `src/command-input.ts`** lighting the counter up. Nothing but
a mock that has replaced the module in the graph *for that importer* could observe it. **`A6`'s mock
is not blind to a direct import. VERIFIED — and by the exact construction whose absence was `ABC-033`
`G3`.** The engineer's choice of `vi.mock` over `vi.spyOn` here was correct and is now proven, not
argued.

The stated limit of the technique stands and is worth carrying forward: `gameStatusOf` calls
`repetitionCounts` **inside** `history.ts`, and a module-boundary mock cannot see an intra-module
call, so the `repetitionCounts` count is the count of **direct external calls**. That is exactly what
`A6` bars, and the engineer said so rather than papering over it.

## `A6`'s in-file control is the weaker one, and should be strengthened when the file is next opened

Not a defect and not blocking — `R9` demonstrates the property the control was reaching for. But the
control **as written** would still read `1 / 1` on a day the mock had stopped reaching the production
module, because it only ever exercises the test file's own import. A control that called a barred
function *through* a production entry point would be self-sufficient. Recorded as hygiene for the
next hop in this file; I do not fix.

## The stream guard's stderr control is MISSING, and the spy is nonetheless live

The fence test `"writes to no stream of its own"` asserts `written === 0`, `errored === 0` **and**
`control === 1`. The control writes `process.stdout.write("probe")` — so it proves the **stdout** spy
is live and proves nothing at all about the **stderr** spy. By this file's own stated standard
(every zero gets a control) that is an inconsistency.

**Measured rather than assumed: `Q6` (a `process.stderr`-only write) reds 1.** The stderr spy IS
live. So this is a **latent** weakness, not a live hole — an uncontrolled zero that happens to be
true today and would silently stop being checked if the spy were ever broken by a refactor. **LOW.**

## Verdict on the two criteria

| criterion | engineer's verdict | QE verdict | how attacked |
|---|---|---|---|
| `A2` — a command line never reaches a resolver | met | **MET** | `C2` (10 red, `A2`'s own help rows among them) + `M7` reproduction |
| `A6` — the parser adds zero derives | met | **MET** | `R9` (14 red, `A6`'s own rows), production-side direct import |

Both zeros are real. Neither is the artifact the subtask suspected.
