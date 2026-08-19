---
id: 20260820T103000Z-software-engineer-decision-a3-rebuilt-at-the-seam-its-given-names-b1c2d3e4
kind: decision
by: software-engineer
at: 2026-08-20T10:30:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ADR-0015
  - src/cli.ts
  - src/cli.test.ts
supersedes:
---

# `A3` is rebuilt on a `./line-input.ts` double. The rig I flagged is DELETED, and the rebuild is smaller than the rig it replaces.

## What came out and what went in

**Out:** the `parserBug` child, which substituted `./command-input.ts` with a `resolvePromptLine`
that throws, and the rig-limits comment that called it *"an EXTENSION of BA/PM's ruling rather than
an application of it"*. I raised that flag myself and both rulings landed against it; I did not
argue it back.

**In:** `inputSeamThrows` — `./line-input.ts` substituted by

```js
export function createLineInputSeam() {
  return async () => { throw new Error("the input seam threw"); };
}
```

It is `A5`'s `engineThrows` child with the fault moved one seam up, and it is the same act BA/PM
already granted at `engine:`.

## Why this one passes where the other did not, checked rather than quoted

- **(S).** `createLineInputSeam` is imported by `src/cli.ts:73` and passed at `input:` on
  `src/cli.ts:155`, inside the `runTurnLoop({ … })` bag, one line above `engine:` at `:156`.
  Verified at this hop by reading the composition, not by report. `./command-input.ts` is named
  nowhere in `src/cli.ts` and is reached only by the static import at `src/line-input.ts:56` —
  **measured here: `grep` over `src/*.ts` returns exactly that one production importer.**
- **(C).** The double returns `(history) => Promise<PromptOutcome>`, which is `InputSeam`
  (`src/turn-loop.ts:135`). A rejected promise is a composition the published type already permits.
- **(N1).** `A3`'s Given is *"an `InputSeam` that throws"*. The double stands at the `InputSeam`.
- **(N3).** One criterion, one seam. Nothing else in that child is doubled — no engine, no render,
  no history. The child does not even carry an stdin script any more, because the seam never reads
  one.

**One spawn, exactly as the deleted child was one spawn. `N8-SPAWN`'s pin of 17 does not move.**

## The one thing in `A3`'s row that HAD to change, and it is (N2)

`A3`'s non-vacuity witness was two assertions: one frame rendered, **and** `stdout` contains the
prompt. With the fault constructed at the seam, **the prompt is the DOUBLE's output** — the real
reader is what writes it — so keeping that assertion would have made `A3` assert against its own
instrument, which is precisely `(N2)`'s refusal. It is gone. The frame witness stays and is
sufficient: the loop renders before it ever calls the seam, so a child that died before the game
started still reds.

The double therefore writes **nothing at all**. Every observable `A3` still asserts — the
internal-error line, the absence of the ten `TerminalReason` words and the five result words, the
absence of a result screen, the exit code — is produced by unsubstituted product code, driven
through the real spawned entry point.

## The rebuild is still DISCRIMINATING, and that was watched rather than assumed

`ADR-0015` alternative C rests on `A3`'s discriminating requirement being real. It survives the
rebuild: with the catch arm mutated to `process.exitCode = 0`, **`A3` and `A4` both go RED** on the
new child — the same pair QE measured against the old one. The instrument changed; what it catches
did not.

## What I did NOT do

- I did not add a second double to any criterion.
- I did not widen `ADR-0015`'s fence, and I did not touch clause 2.
- I did not lift BA/PM's name-refusal of `./line-input.ts` anywhere else. `A2` and `A5` are
  byte-unchanged; the rig-limits comment now states (S)/(C)/(N) as the rule and says in as many
  words that there is no module list in either direction.
- I did not touch `src/cli.ts`. It exports **0**, unchanged, and the seven merged modules are
  byte-identical — the delivered diff is one file.

## The cost, which `ADR-0015` recorded and I am not softening

`src/line-input.ts`'s own body — the layer `ABC-019` `[D31]`'s *"a parser bug"* narrative was about
— is now exercised by no criterion on this page. That is the price of a fence that cannot be walked
around, and BA/PM has already named it as a new ticket. **It is not mine and I did not build around
it.**
