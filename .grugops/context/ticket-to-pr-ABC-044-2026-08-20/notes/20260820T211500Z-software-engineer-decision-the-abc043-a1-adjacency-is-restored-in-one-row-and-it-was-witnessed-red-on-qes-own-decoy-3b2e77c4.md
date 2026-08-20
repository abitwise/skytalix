---
id: 20260820T211500Z-software-engineer-decision-the-abc043-a1-adjacency-is-restored-in-one-row-and-it-was-witnessed-red-on-qes-own-decoy-3b2e77c4
kind: decision
by: software-engineer
role: software-engineer
task: fix-abc043-a1-adjacency-2026-08-20
at: 2026-08-20T21:15:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-043/A1
  - ABC-044
  - ABC-044/A7
supersedes:
---

# `ABC-043` `A1`'s key<->value adjacency is restored in ONE row, and I watched it go RED on QE's own decoy before I called it fixed

## The verdict is accepted, and it is accepted on a measurement rather than on courtesy

QE's `decision` (`20260820T203000Z-…-4c2ba917`) is correct and my own earlier claim — "MOVED THIS ROW
AND DID NOT WEAKEN IT" — was wrong. An unanchored `/\bhistory,/` over the whole module is satisfiable
by any comma-terminated `history` token anywhere in `src/cli.ts`, so the `history` option was the only
one of the six whose key and value were pinned in two unrelated places. I re-ran QE's decoy myself
before writing anything; it is reproduced below going red on the repair.

## The row

**Replaced** (`src/cli.test.ts`, inside `A1`):

```ts
expect(entry).toMatch(/\bhistory,/);
```

**With:**

```ts
expect(
  windowOf(entry, "runTurnLoop(", "sink,"),
  "the `history` option is not the shorthand for the game the entry point built",
).toMatch(/\bhistory,/);
```

This is QE's measured expression. I adopted it rather than inventing a third instrument, for one
reason that is not deference: `windowOf` is already this file's established, self-tested derivation
(`src/cli.test.ts:144`, its own guards at `:696-710`, including the INVERTED case that a hoisted
options bag produces), and `A1`'s cast/adapter rows and `G6`'s last row both read through the same
window. A new one-off regex next to three uses of a watched instrument would be the weaker choice.

**KEPT, both, exactly as delivered** — QE confirmed both are real gains:
- `expect(entry).toMatch(/const history = newGame\(START_FEN\);/)` — the initializer row.
- `expect(entry.match(/\bnewGame\s*\(/g)).toHaveLength(1)` — the once-only pin, which catches `M10`
  (a second `void newGame(START_FEN);`) and which the single pre-`ABC-044` row could never have seen.

Together the three now say what the criterion says: the game is constructed **once**, from the merged
factory, **and the token in the option slot is that construction's own binding** — the third clause is
the one that had gone missing.

## `src/cli.ts` DID NOT CHANGE, and that was the test of whether the design was wrong

The hoist (`const history = newGame(START_FEN);` above the call, so the entry point still holds the
game when the loop returns) is what `ABC-044`'s result screen needs, and nothing about the repair
argued otherwise. `git diff --numstat 30482cd HEAD -- src/` still shows `src/cli.ts` at `15/1`,
unchanged from my delivery hop. The four frozen files (`src/gameend.ts`, `src/turn-loop.ts`,
`src/history-pane.ts`, `src/frame.ts`) do not appear in the diff at all, and `src/result-screen.ts`
is untouched since delivery. **The whole repair is one test file.**

## Witnessed RED, then GREEN — the transcripts are in the sibling `observation` note

The decoy planted in `src/cli.ts` verbatim as QE and the Orchestrator built it (`const decoy = {
...history }; const both = [history, decoy];`, `history: decoy` at the call): `tsc` **0**, suite
**1 failed | 1206 passed**, and the one failure is `ABC-043 A1` on this row — the window came back
`history: decoy,` and refused it. Decoy reverted (`src/cli.ts` byte-identical, `git status` shows only
`src/cli.test.ts`), suite **1207/1207**. A repair not witnessed red on the build that motivated it is
not a repair; this one was.

**Exactly one row went red on the decoy.** No collateral: the other 1206 rows, `ABC-044` `A1`-`A7`
included, are indifferent to the copy — which is QE's own point that the exposure is narrow, now
measured from the other side.

## What I am NOT doing

**The board is untouched. `ABC-044` stays in `In Review`.** QE owns that exit and has not signed off;
this hop only removes the reason it was held. `plans/traceability.md` is likewise unchanged — the
implementation row it carries is still accurate, and a test-instrument repair inside an already-traced
file adds no new trace edge.

**No `finding` and no `§14-gate#<id>`.** This install has no `scripts/context-io.ts` and no stamp
issuer, so this is a hand-authored `decision` in the folder's convention; its evidence is the commands
in the `observation` note.
