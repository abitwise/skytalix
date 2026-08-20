---
id: 20260820T203000Z-qe-e2e-decision-abc043-a1s-replaced-instrument-is-not-strictly-stronger-and-goes-back-for-one-row-4c2ba917
kind: decision
by: qe-e2e
role: qe-e2e
task: qe-ABC-044-2026-08-20
at: 2026-08-20T20:30:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-043/A1
  - ABC-044
  - ABC-044/A7
supersedes:
---

# `ABC-043` `A1`'s moved instrument is NOT strictly stronger. It is stronger on one axis and WEAKER on another, the weakening is witnessed, and it goes back for ONE test row

## The decision that was routed to me, taken on a measurement rather than on a reading

The Orchestrator routed this as a decision and told me not to defer to his reading. **I did not.** I
built the decoy the replacement cannot see, and it is green.

**What was replaced.** One row:

```
expect(entry).toMatch(/history:\s*newGame\(START_FEN\)/);
```

**What replaced it.** Three rows: `/const history = newGame\(START_FEN\);/`, `/\bhistory,/`, and
`expect(entry.match(/\bnewGame\s*\(/g)).toHaveLength(1)`.

## Stronger on one axis — CONFIRMED, and confirmed by watching it go red

The once-only pin is real and it is new. **Mutant `M10`** — a second `void newGame(START_FEN);` in
the entry point — turns `ABC-043` `A1` **RED**, and the replaced single row could not have seen it.
The engineer's claim on that axis holds and I re-measured it rather than reading it.

## WEAKER on another axis — the key↔value adjacency, and here is the build that proves it

The replaced row was **one regex binding the option KEY to its VALUE in one place**. The
replacement splits that into an initializer row and an unanchored `/\bhistory,/` that matches
**anywhere in the file**. Nothing then requires the token next to the `history` option to be the
binding the first row pinned.

**The witness, built and run** (`src/cli.ts`, on top of the delivered branch):

```ts
const history = newGame(START_FEN);
const decoy = { ...history };
const both = [history, decoy];
void both;
...
await runTurnLoop({ history: decoy, ... });
```

The `history` option is now **NOT the merged factory's own return value** — it is a shallow copy,
a different object — which is precisely what `ABC-043` `A1`'s stated intent forbids.

| measured | result |
|---|---|
| `npx tsc --noEmit` | **0** |
| `npx vitest run --dir src` | **0** — `Test Files 40 passed (40)` / `Tests 1207 passed (1207)` |
| `ABC-043` `A1` | **GREEN** |
| the row it replaced, on the same build | would be **RED** (`history: newGame(START_FEN)` is not in the options object) |

**A whole-suite green on a build the replaced row would have refused is the definition of weaker.**
The spread is contrived; the property is not. `A1`'s intent — *"every option is the merged factory's
own return value"* — is the one thing the other five option rows still pin by adjacency
(`humanColour:\s*colour`, `render:\s*makeRenderSeam(...)` and so on) and the `history` option is now
the **only one of the six** whose key and value are pinned in two unrelated places.

**I record what the weakening did NOT survive, in fairness to the diff:** a decoy that actually
DIVERGES (`{ ...history, moves: [] }`) is caught — by `ABC-044`'s own `A6`, because the screen's move
list is then drawn from a game the loop never played. So the exposure is narrow. **It is still a
merged criterion that stopped being able to fail its own wrong build, inside a diff that says it did
not weaken it.**

## Verdict

**`ABC-043` `A1`'s instrument change is NOT strictly stronger and does not stand as delivered. It
goes back.** The criterion's stated intent no longer holds under its own instrument.

**The repair is ONE row and I measured it rather than proposing it.** Anchor the shorthand pin inside
the window the same test already builds for the cast/adapter check:

```ts
expect(windowOf(entry, "runTurnLoop(", "sink,")).toMatch(/\bhistory,/);
```

| build | with the repair |
|---|---|
| the delivered branch tip | `src/cli.test.ts` **exit 0** |
| the `{ ...history }` decoy | `ABC-043 A1` **RED** |

Both runs done, both reverted, `git status` clean afterwards. **I did not commit the repair** — a
production-adjacent instrument I both author and adjudicate is a conflict I decline, and the
Orchestrator's routing was explicit that a weaker verdict returns the work.

## What this does to `ABC-044`'s column

**`ABC-044`'s own `A1`–`A7` all pass** (separate `observation` note). **The ticket still does not
leave `In Review`**, because the diff carries a regression in a MERGED ticket's criterion instrument
and I own that ticket's `In Review` exit too. One test row, then a re-run of the same measurements.

**No `finding` is authored and no `§14-gate#<id>` stamp is claimed.** This install has no
`scripts/context-io.ts` and no `mcp__grugops__propose_note`, so there is no stamp issuer; this is a
hand-authored `decision` in the folder's convention and its evidence is the commands above.
