---
id: 20260804T140000Z-software-engineer-decision-2c425d84
kind: decision
by: software-engineer
at: 2026-08-04T14:00:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-012
  - ABC-012
  - ABC-020
  - ADR-0002
  - EPIC-002
  - src/history.ts
  - src/history.test.ts
  - src/gameend.ts
  - memory-bank/30-architecture.md
  - 20260730T143500Z-architect-design-decision-d7a42f7a
  - 20260730T143800Z-architect-design-decision-38b772b6
  - 20260804T120000Z-orchestrator-decision-f066a9d0
supersedes: 
---

# ABC-012 built exactly to its two seams, and the one acceptance criterion that cannot be satisfied as worded

## What was decided, and what was merely executed

Almost nothing here was a decision. The API was closed by SEAM 1
(`20260730T143500Z-architect-design-decision-d7a42f7a`) and the absence of a cache by SEAM 2
(`…-decision-38b772b6`); both were read at source before any code was written, and this ticket says
in its own `## Source` that it implements them and does not re-open them. Six functions with those
exact signatures, three fields, no memo, no version counter, no invalidation. Nothing was traded
away and no seventh function was added.

Three things WERE decisions, and each is recorded with its alternative.

## Decision 1 — `moves` is `readonly Move[]` to callers, and the module reaches through it once, by name

SEAM 1 publishes `readonly moves: readonly Move[]` and `playMove` / `takeBack` returning `void`.
Those two facts cannot both hold in TypeScript without something bending: appending to a
`readonly Move[]` is not expressible, and TypeScript has no "writable inside this module" modifier.

The bend is **one named helper**, `moveListOf`, used by exactly the two mutators, rather than an
inline cast at each site or a quietly-mutable field that would misstate the contract to every
caller. The alternative — publishing `moves: Move[]` — was rejected because it hands every consumer
a legal `history.moves.push(...)`, which is precisely the second write path `ADR-0002` clause 2
exists to forbid.

## Decision 2 — `takeBack` rebuilds the borrowed `Position` IN PLACE rather than replacing it

SEAM 1 says `position` is a borrow. `takeBack` could have assigned a fresh `Position` onto the
field; instead `resetTo` copies the parsed anchor's 128 board bytes and five scalars into the object
the caller already has. It costs the same, and it means a caller holding `h.position` across a
take-back holds a live, correct object rather than a silently stale one. This is the weaker of the
two failure modes to leave a caller in, and it is the one the rest of `src/` already behaves like —
`makeMove` mutates a `Position` in place and never returns a new one.

## Decision 3 — the clamp is `splice(Math.max(0, length - plies))`, and negative `plies` is left alone

The ticket and SEAM 1 both name one clamp: taking back more plies than were played must land on the
initial position rather than truncating to a negative length, because `slice(0, negative)` produces
a *different game* silently. That is a silent-corruption path and is guarded.

A **negative** `plies` is not guarded, deliberately (`AGENTS.md` rule 8). With `splice` the
computed start index simply exceeds the array length, so the call is a no-op — no corruption, no
throw, no invented error branch for a case no caller has. Had `length = …` been used instead, the
same input would have padded the array with holes and crashed on the next replay; the primitive was
chosen for that reason and not by habit.

## The one acceptance criterion that CANNOT be satisfied as worded

**Criterion 2's first half asks `gameStatusOf` to return `result: "draw"`, `reason:
"threefold-repetition"`. `src/gameend.ts` cannot return that, and its TYPE cannot express it.**

`threefold-repetition` is a `ClaimableDraw` (`src/gameend.ts:48`), not an `EndReason`
(`src/gameend.ts:40-45`), so `{ result: "draw", reason: "threefold-repetition" }` is not an
inhabitant of `GameStatus`. This is not an oversight in `gameend.ts` — it is `ABC-020`'s ruling on
FIDE 9.2.1, that the third occurrence is a draw **the player having the move may claim and may just
as well decline**, made unrepresentable rather than merely tested for. `src/gameend.test.ts:68-92`
pins the actual shape at three, four and five occurrences.

Three consequences, stated so nobody over-reads this:

1. **The only change that would satisfy the literal wording is forbidden by this ticket.** It would
   mean altering merged, `Done`, 100%-covered `gameend.ts`, and `## Out of scope` rules that out;
   SEAM 1 additionally fixes `gameStatusOf` as the one-line delegate
   `gameStatus(history.position, repetitionCounts(history))`.
2. **The criterion's INTENT is fully tested and green** — threefold is reported before the take-back
   and gone after it, and the counts rewind with the list. The test asserts the shape the merged
   code actually produces, and says in its own comment why.
3. **The wording is BA/PM's to correct.** It was not edited here (ticket prose is not this role's),
   and it was not silently satisfied by bending the module either. This is the **second** stale line
   on this ticket, of the same class as the trap-1 rationale the Orchestrator corrected at the pull
   — and unlike that one, this one changes what an assertion must say.

The criterion's **second half** — after `takeBack(history, 2)`, `result: "in-progress"`,
`reason: null`, and `repetitionCounts` deep-equal to a freshly replayed history built from the
truncated move list — is satisfied exactly as written.

## What this pass did NOT do

- **No `redo`, no material balance, no `toPgn`, no SAN, no memoization, no shared `STARTPOS`
  constant**, and **`gameStatus`'s `positionCounts` is still optional.** Every item on the ticket's
  `## Out of scope` list survives untouched.
- **No existing file under `src/` was modified** — verified at byte level, not by inspection.
- **`plans/nfr-catalog.md` was not edited.** Its own format comment gives its rows to
  Architect/Design and Security/NFR, and Security/NFR re-gates these bars; the figures are recorded
  in the notes, the ticket, the board and the trace instead. Same division the `ABC-011` Engineer
  kept.
- **`ABC-009`, `ABC-010` and `ABC-022` are carried, not fixed.**
- **Nothing was merged and nothing was deployed.** `autonomy=pr` holds, and **no PR exists because
  this repo has no git remote** — there is nowhere to push, and none was invented.
