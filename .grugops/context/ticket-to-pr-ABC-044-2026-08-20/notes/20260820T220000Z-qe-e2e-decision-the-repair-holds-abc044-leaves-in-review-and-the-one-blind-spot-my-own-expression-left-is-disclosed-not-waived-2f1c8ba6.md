---
id: 20260820T220000Z-qe-e2e-decision-the-repair-holds-abc044-leaves-in-review-and-the-one-blind-spot-my-own-expression-left-is-disclosed-not-waived-2f1c8ba6
kind: decision
by: qe-e2e
role: qe-e2e
task: qe-ABC-044-recheck-2026-08-20
at: 2026-08-20T22:00:00Z
verified_by:
confidence: high
refs:
  - ABC-044
  - ABC-044/A1
  - ABC-044/A7
  - ABC-043/A1
supersedes:
---

# The repair HOLDS on my own re-measurement, `ABC-044` leaves `In Review` — and the blind spot MY OWN expression left is written down rather than waived

## The blocker: discharged, and discharged by the decoy going red under my hands

I did not read the engineer's transcript and agree with it. I re-planted the decoy at the branch tip
myself:

```
$ npx tsc --noEmit                        -> 0
$ npx vitest run --dir src                -> 1 failed | 1206 passed (1207)
   FAIL src/cli.test.ts > ABC-043 A1
```

**Exactly one row, and it is the row.** Not a cascade, not a neighbour. Decoy reverted: `tsc` **0**,
**40 files / 1207 tests / 0 skipped / 2.73 s**, `npx biome check src/` **0**, `git status --porcelain`
**empty**. `git diff --numstat 30482cd HEAD -- src/` is four files (`cli.test.ts 127/1`, `cli.ts 15/1`,
`result-screen.test.ts 281/0`, `result-screen.ts 172/0`); the four frozen files return an **empty**
diff. `src/cli.ts` is byte-identical to the delivery hop. **The repair's whole footprint is one test
file.**

## Does the row as written actually restore key<->value adjacency? YES, and I checked the mechanism

`windowOf(entry, "runTurnLoop(", "sink,")` returns the call's own argument list, so `/\bhistory,/`
can now only be satisfied by a token INSIDE the options object. I checked the two ways a window can
lie and both fail safe: `windowOf` **throws** rather than returning `""` (its own guards at
`:696-710`, including the INVERTED case a hoisted options bag produces), and an option order that put
`sink,` before `history,` truncates the window and goes **red**, not green. The engineer's reasoning
for adopting my expression rather than authoring a third — `windowOf` is this file's established,
self-tested derivation, already read by `A1`'s cast/adapter rows and `G6` — is **their** reasoning
and I tested it rather than accepting it: a fourth one-off regex beside three uses of a watched
instrument would indeed have been the weaker choice.

## The stranger test the Orchestrator asked for. I ran it and IT FOUND SOMETHING

I designed that expression against ONE decoy, so I attacked it with builds it was not designed
against. **One of them is green.**

```ts
const history = newGame(START_FEN);
const play = async (history: Parameters<typeof runTurnLoop>[0]["history"]) =>
  await runTurnLoop({ history, humanColour: colour, ..., sink });
const outcome = await play({ ...history });
```

`tsc --noEmit` **0**, `npx vitest run --dir src` **1207/1207 GREEN**. The window sees a shorthand
`history,` that belongs to a **shadowing parameter**, not to the hoisted binding, and a regex over
source text cannot do scope analysis. **The pre-`ABC-044` row would have refused this build.** That
is the same shape of statement I used to refuse the first time and I am not hiding it.

## Why this is a DISCLOSURE and not a second refusal — the argument, with the measurement under it

**The two instruments are INCOMPARABLE, and I measured it in both directions rather than asserting
an ordering.** The old single row `/history:\s*newGame\(START_FEN\)/` was **blind to `M10`** (a
second `newGame(START_FEN)` construction in the entry point) — the new once-only pin kills that. The
new triple is blind to a name-shadowing rebinding. Neither dominates. "Strictly stronger" was false
when the engineer claimed it and it is still false now; **"strictly weaker" is also false**, which is
the fact that changed at this hop.

Three more measurements carried the call:
- **The class that motivated the refusal is now RED.** The flat copy needs no new function and no new
  scope — a sibling variable in the same block. That is reachable by an ordinary edit. The survivor
  needs a new function boundary whose parameter is deliberately named `history`, which is the
  adapter-shaped indirection `A1`'s own prose already disfavours.
- **The exposure is behaviourally inert.** A shallow copy shares the arrays the loop mutates, which
  is exactly why the suite stays green. The moment a copy DIVERGES, `ABC-044` `A6` catches it — I
  measured that at the first hop (`{ ...history, moves: [] }`).
- **The production code is correct and unchanged.** This is an instrument residual inside a test
  file, not a defect in the delivered entry point.

**And the close is cheap, measured, and belongs to whoever owns `ABC-043`'s test file next:**

```ts
expect(entry.match(/\bhistory\s*[:=]/g)).toHaveLength(1);
```

Probed against the real `executableCodeOf("cli.ts")` view: **delivered build -> `["history ="]`,
length 1 (green); shadow decoy -> length 2 (red); flat-copy decoy (`history: decoy,`) -> length 2
(red).** One row, no new mechanism, catches both. **I did not commit it** — same conflict I declined
last time: I do not author and adjudicate the same instrument, and a merged ticket's test file is not
mine to widen at an `In Review` exit I own.

## The decision

**`ABC-044` PASSES its `In Review` exit and moves to `Ready for UAT`.** `A1`-`A7` all pass on
measurement (first hop, `observation` `9e1d40b6`), the returned instrument is repaired and the repair
is witnessed red on the build that motivated it, and the diff's footprint is unchanged apart from
`+11/-1` in one test file.

**`ABC-043` is NOT moved.** Its own exit is a separate decision and was not in scope.

**No `finding` and no `§14-gate#<id>` stamp.** This install has no `scripts/context-io.ts`, no
`mcp__grugops__propose_note` and no stamp issuer, so this is a hand-authored `decision` in the
folder's convention; the transcripts are in the sibling `observation`. **Nothing here is a green I
did not watch.**
