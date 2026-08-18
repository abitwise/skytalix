---
id: 20260818T183000Z-software-engineer-decision-the-fold-is-a-retry-and-a-union-never-a-pick-4e21ab9c
kind: decision
by: software-engineer
at: 2026-08-18T18:30:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - EPIC-003
  - src/move-input.ts
  - src/coordinate-move.ts
  - src/san.ts
supersedes:
---

# How `ABC-033`'s ruling is implemented: three case variants, one union, and a fold that only ever runs second

## The shape delivered

`resolveMoveInput(history, line, deps?)` in `src/move-input.ts`, returning `MoveInputOutcome` —
the `move` / `rejected` / `ambiguous` narrowing of `PromptOutcome` (`src/turn-loop.ts:125`). The
other four arms are `ABC-035`'s, `ABC-036`'s and the loop's, and narrowing means a later caller
binding this into the `InputSeam` never handles an arm this function cannot return.

1. `deps.legalMoves(position)` — **once**, and the one array is handed to every attempt and to
   `toSan`.
2. **Exactly as typed**: `parseCoordinateMove`, then `parseSan`. A `move` returns; an `ambiguous`
   returns as `ambiguous`; a `rejected` records its reason code and falls through.
3. **Only then, the fold**: three whole-line case variants — `toLowerCase()`, first character
   uppercased with the rest lowercased, `toUpperCase()` — each asked of both readers, with the
   variant equal to the original line skipped because it was already tried.
4. The moves those attempts name are collected into a `Set` and re-ordered by the one `legal`
   array. **One** is `move`; **two or more** is `ambiguous`; **none** is `rejected`.

## Why a UNION over the variants and not a first-match

A first-match fold would resolve `BXC4` to whichever variant it happened to try first — which is a
guess between two legal moves wearing a deterministic rule's clothing. The union makes the
multi-match structurally visible, which is what `## The ruling this ticket implements` requires:
the fold *may* produce more than one legal move, and when it does the outcome is `ambiguous`.

## Why three variants, and what they do NOT do

Each variant exists for a case the epic names: `bxc4` reads the pawn capture, `Bxc4` the bishop
capture (SAN's piece letter is the first character, so capitalising it is one string operation, not
a token table), and `O-O` is reached from `o-o`, which `parseSan` refuses deliberately.

**A variant is a string handed back to the same two readers.** No grammar, no token table and no
chess logic entered this module: whatever a variant resolves to is the RESOLVERS' answer.

**Known limit, recorded rather than smoothed:** a lowercase promotion in SAN (`e8=q`) is NOT reached
by any of the three variants, because uppercasing the promotion letter alone would require this
module to know that `=` introduces one — which is exactly the token knowledge the fences forbid. The
same move is accepted in coordinate form (`e7e8q`), no acceptance criterion names the SAN spelling,
and widening it belongs to whoever owns the grammar (`ABC-032`), not here.

## Rejection carries a code, never prose

The messages array on `rejected` carries one machine-readable reason — `no-such-move` when any
attempt produced it, `unreadable` otherwise. `ABC-034` owns the wording. The **ambiguity** messages
are this ticket's and they are the candidates in SAN, one item per candidate, because the frame's
message region takes a LIST and places each item whole or not at all.

## The one seam that exists for the tests, named as such

`deps` (`MoveInputDeps`: `legalMoves`, `parseCoordinateMove`, `parseSan`) defaults to the three real
functions. It exists so `A5`'s call count and `A3`'s attempt order can be spied without a hoisted
`vi.mock`, which is what keeps this ticket at ONE test file and no `*.nfr.test.ts` — the ticket's own
`## Lane cost` section designs for it. It is a test seam and it configures nothing at runtime.
