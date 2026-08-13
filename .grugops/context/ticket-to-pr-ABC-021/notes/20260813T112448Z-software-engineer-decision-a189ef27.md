---
id: 20260813T112448Z-software-engineer-decision-a189ef27
kind: decision
by: software-engineer
at: 2026-08-13T11:24:48Z
verified_by:
confidence: high
refs:
  - ABC-021
  - ABC-019
  - ABC-020
  - ABC-035
  - src/turn-loop.ts
  - NFR-002
supersedes:
---

# `claim` is a REQUEST the loop adjudicates, not a verdict the seam delivers

> **Hand-authored.** `scripts/context-io.ts` exists in neither this repo nor the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing published here is a
> `finding`** — there is no §14 gate to issue a `§14-gate#<id>` stamp and `context.human_admission`
> is `off`, so nothing is self-stamped.

## The decision

`PromptOutcome` gains a seventh arm and it carries **no payload**:

```ts
| { readonly kind: "claim" }
```

The loop answers it against `status` — the `GameStatus` it already evaluated for this ply.
`status.claimable` present → `{ result: "draw", reason: draws[0], exitCode: 0 }` (transition 16).
Absent → `rejected`'s existing path with a message, `continue`, no ply, no re-evaluation.

## Why not the obvious alternative

The arm the ticket's `## Scope` was originally written against — *"a fifth prompt outcome"* — is
already present as `game-over`, and a seam CAN reach a claimed draw through it today:
`{ kind: "game-over", result: "draw", reason: "threefold-repetition" }` typechecks on merged
`main`, and `A8b`'s first pair already drives exactly that shape with `fifty-move`.

**It was rejected, and the reason is measurable rather than aesthetic.** For a seam to decide
whether a claim is available it must derive the status itself — `gameStatusOf(history)` — which is
**the second derive per ply** `NFR-002` prices at 46-50 µs against a 100 µs bar (`ABC-021`
`## Security / NFR triggers`, and `turn-loop.ts:308-311`'s own note that a two-derives-per-ply build
READS 93.58 µs and MEETS the timing bar). The loop is the only actor holding the ply's status, so
the loop is the only actor that can adjudicate for free.

It also puts the ruling in the wrong ticket. `ABC-020` decides WHAT is claimable; `EPIC-003` decides
what the player typed. A seam returning `game-over` decides both.

## What this makes true

- The claim path adds **ZERO** derives on any advancing ply. Spied: `gameStatus` at `plies + 1` and
  `repetitionCounts` at 0, unchanged from `ABC-019`'s bar (`turn-loop.nfr.test.ts` untouched and
  still green at 40/120/300 plies).
- `A5`'s *"not re-evaluated"* holds on this edge for the same STRUCTURAL reason it holds on the
  other three non-advancing outcomes, not merely because a spy says so.
- `claimable.by` is never tested. It is the side to move by construction (`gameend.ts:51-52`) and
  the branch runs only when the side to move is the human, so a check would be a guard on a state
  the machine cannot reach (AGENTS.md rule 8).

## The boundary this keeps

`ABC-019` owns that the transition EXISTS. This owns transition 16 — the claim, its reason, its
refusal, and the availability value. **`ABC-035` owns the token's grammar and tolerance at the real
prompt, and it has no build-time dependency in either direction with this**: the stub input seam
matches a literal `claim` and is two lines long, exactly as `## Test notes` says.
