---
id: 20260812T020000Z-qe-e2e-observation-premises-re-verified-4b1e77a2
kind: observation
by: qe-e2e
at: 2026-08-12T02:00:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-017
  - ABC-029
  - RISK-ABC017-03
  - NFR-008
supersedes:
---

# The two load-bearing premises of `ABC-028` `A4`, re-measured on this tree — both HOLD

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. `human_admission` is `off` and no §14
> gate ran here, so **nothing in this hop is recorded as a `finding`.** Every number below is a
> measurement I took; the script that takes them is
> `.grugops/context/quality-gate-ABC-028-instrument/artifacts/premises.ts`.

**Machine, once, for every figure in this hop:** Apple M3 (`Mac15,13`), 8 cores, macOS 26.5.2,
node `v24.12.0`, vitest `3.2.7`. `UNKNOWN - verify` on any other machine.

**Tree measured:** `../cli-chess-ABC-029` at `2fd164e`, **16 non-test `.ts`, no `src/turn-loop.ts`**,
26 test files. `src/history-pane.ts` md5 `54fd4346dcc1a0060c4e66ae0149265d` — the delivered pane.
Every measurement was taken **out of tree**, on a replica extracted from the object database
(`git archive HEAD`) and `diff -r`-verified identical to the worktree's `src/`. **Nothing under
`src/` was written at any point**; `src/history-pane.nfr.test.ts` is still md5 `e27a8387…` and
`git status` is clean.

## Premise 1 — `Object.freeze` cannot reach `position.board`. CONFIRMED.

```
Uint8Array(0)     -> freeze returns without throwing (an empty view has no indexed elements)
Uint8Array(1)     -> TypeError: Cannot freeze array buffer views with elements
Uint8Array(8)     -> TypeError: Cannot freeze array buffer views with elements
Uint8Array(128)   -> TypeError: Cannot freeze array buffer views with elements
history.position.board is Uint8Array(128)   (0x88, src/position.ts:75)
freeze(history.position.board) -> TypeError: Cannot freeze array buffer views with elements
```

**The ticket says `Uint8Array(8)`; the real board is `Uint8Array(128)`.** The conclusion is unchanged
and slightly stronger — it throws at every non-empty length — but the number in the ticket is not the
number in the code, and this ticket's own `## Test notes` 4 is the rule that says to check.

## Premise 2 — freezing `history.moves` leaves the SLOT writable. CONFIRMED.

```
Object.isFrozen(h.moves)                      true
descriptor of the 'moves' slot on the object  { writable: true, enumerable: true, configurable: true }
h.moves.push(move)                            TypeError            <- A9's freeze DOES bite the contents
h.moves = [...h.moves]                        SUCCEEDS, slot swapped, the new array is NOT frozen
h.moves = savedMoves                          SUCCEEDS, identity restored
h.initialFen = "8/8/8/8/8/8/8/8 w - - 0 1"    SUCCEEDS
```

**This is `WMOVESWAP` mechanically, exactly as the ticket states**, and it is not a strict-mode
artefact: the same module asserts `this === undefined` inside a plain function call, so ESM strict
mode is in force and the assignment really is permitted. `readonly` on `GameHistory.moves` is a
compile-time statement (`src/history.ts:38`) and `src/history.ts:54` (`moveListOf`) already documents
that TypeScript cannot express the runtime contract.

## What follows, and what does not

**Follows:** `A9`'s instrument kind — freeze the caller's array — covers exactly one of the five
slots `A4` names (`moves` CONTENTS) and is *structurally incapable* of covering `position.board`.
The `❌` on the Definition of Ready's item 4 rests on true premises.

**Does NOT follow:** that no instrument exists. See the sibling `observation` note on the candidate.
