---
id: 20260818T090000Z-architect-design-decision-book-is-a-decorator-of-engineseam-7c41b9d2
kind: decision
by: architect-design
at: 2026-08-18T09:00:00Z
verified_by: 
confidence: high
refs:
  - ADR-0012
  - EPIC-004
  - EPIC-005
  - EPIC-006
  - ABC-043
  - ABC-077
  - ABC-078
  - ABC-086
  - ABC-094
  - ABC-095
  - ABC-096
  - ABC-103
  - ADR-0002
  - ADR-0009
  - ADR-0011
  - RISK-002
  - NFR-004
supersedes: 
---

# The ruling: the book is a DECORATOR of `EngineSeam`, and "behind or in front of the seam" was a false dichotomy

## Scope

Answers `G3` on `.grugops/context/epic-to-tickets-EPIC-005/notes/` — *where the book short-circuit
physically lives* — routed here with no owner. Written in full as
`memory-bank/50-decisions/ADR-0012-book-engine-composition-point.md`, status **`proposed`**.
**Not self-ratified**: this project's standing rule (recorded on `ABC-092`) is that an agent
researches and a human ratifies, and `context.human_admission` is `off`.

## The shape chosen

`EngineSeam` is a **function type** (`src/turn-loop.ts:138`), not an object with one implementation.
A `withBook(probe, inner: EngineSeam): EngineSeam` decorator is **simultaneously behind the seam**
(the loop sees one function) **and in front of the search** (on a hit the search is never entered).
The two shapes BA/PM offered differ only in which EXISTING function composes; the answer is a THIRD
module owned by neither epic's core:

- `EPIC-004` / `ABC-078` — a factory returning an `EngineSeam`, knowing nothing about any book.
- `EPIC-005` / `ABC-095` — a separate decorator module, `EngineSeam -> EngineSeam`.
- `EPIC-006` / `ABC-043` — composes them at the one composition root that already builds every seam.
- `src/turn-loop.ts`, `EngineSeam` and `EPIC-004`'s search modules are **not modified**.

`src/render-seam.ts` is the merged precedent: a module whose only job is to BE the published seam,
built by a factory that binds its configuration once as values, with the type imported from
`turn-loop.ts` rather than re-spelled.

## The two structural reasons, which are not restatements of the choice

1. **The book move is validated by machinery that already exists, at zero cost.** A decorated seam's
   return value passes through transition 13's `wasGenerated` guard before `playMove`. `ABC-094`
   `A6`'s named hostile case — a book entry illegal in its keyed position — reaches `playMove` by no
   path; the loop returns `engine-failure` and the board is untouched. Any shape that places the
   book beside the engine must duplicate that guard or go without it.
2. **The seeded RNG is threaded, not ambient, by construction** — a parameter of the decorator's
   factory bound at the composition root, which is `ABC-086` `A6`'s shape without anyone arranging
   it. **Determinism therefore argues FOR this placement**, and against putting the book in the loop
   (which would need a seed in `TurnLoopOptions`) or in the seam's parameters.

## The two shapes rejected, with the reason each fails

- **Book in front of the seam, inside `runTurnLoop`.** (a) Requires editing `src/turn-loop.ts`,
  colliding with `ABC-078` `A6`. (b) Independent of `A6`: it re-opens a merged eight-state machine
  and forces a second copy of transition 13's guard and transition 12's `takeBack` repair, or the
  loss of both. (c) It couples `EPIC-002`'s loop to `EPIC-005` — the coupling `ADR-0009` clause 9b
  already refused on the frame path.
- **Grow the seam (skip-the-book flag / composition parameter).** (a) A contract change on a merged
  type. (b) It inverts the dependency: `runTurnLoop` would hold book policy, and the loop holds no
  policy. (c) **No cut ticket has a caller for it** — coding rules 5 and 7. `ABC-096` needs to READ
  what the book did, not suppress it.

A third alternative was considered and dropped in the ADR: the wrap placed INSIDE `EPIC-004`'s
module (`makeEngineSeam({ book })`). It is the literal reading of "book wraps engine" and it fails
`ABC-095` `A6` by definition, and makes a `P0` depend on an unbuilt `P1` epic.

## Risks

- The ADR is `proposed`. **Until ratified it is not binding**, though `ABC-078` is pullable as cut
  either way because this ruling asks nothing of it.
- **`G4` (two epics, one seeded-randomness seam) is NOT closed by this ruling** and must not be read
  as closed. `G3` asks where composition sits; `G4` asks who owns the RNG. Still Architect/Design's,
  owed before `ABC-094` or `EPIC-004`'s search ticket enters `In Development`, and it needs its own
  hop.
- `ABC-096` cannot learn the opening name through the seam and **must not be allowed to widen
  `EngineSeam` to fix that**. Recorded as ADR clause 7; it is `ABC-096`'s design and it is `P3`.
