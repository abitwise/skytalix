---
id: 20260730T144200Z-architect-design-decision-63309fd4
kind: decision
by: architect-design
at: 2026-07-30T14:42:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - EPIC-003
  - EPIC-005
  - EPIC-006
  - ADR-0004
  - ADR-0002
  - ADR-0003
  - NFR-002
  - NFR-003
  - src/san.ts
  - src/history.ts
  - src/legal.ts
  - memory-bank/50-decisions/ADR-0004-san-ownership.md
  - plans/nfr-catalog.md
  - 20260730T143000Z-architect-design-observation-57f6f356
  - 20260730T143500Z-architect-design-decision-d7a42f7a
supersedes: 
---

# SEAM 3 CLOSED — SAN lives in `src/san.ts`, both directions, derived per frame — and it earned an ADR

Subtask `architect-epic002-seams`. Third of the three seams `ADR-0002` deferred here, and the one the
brief asked to be decided **for `EPIC-003`'s parsing as well as `EPIC-002`'s rendering**, not for 002
alone. Numbers cited from `…-architect-design-observation-57f6f356`.

## The decision, in three clauses

1. **SAN lives in one new module, `src/san.ts`**, above `src/legal.ts` and beside `src/gameend.ts`.
   It imports `position.ts`, `moves.ts`, `apply.ts`, `legal.ts` — and not `gameend.ts`, not
   `history.ts`. The DAG stays acyclic with no upward edge; no new runtime dependency.
2. **Both directions live in it, over one grammar**: `toSan(position, move, legal?)` and
   `parseSan(position, text)`. One table of letters and suffixes, one disambiguation rule, used by
   both.
3. **SAN strings are not stored in the history.** They are derived per frame, exactly as the key list
   and the repetition counts are. `history.ts` does not import `san.ts`; the renderer composes the
   two.

**This is written up as `memory-bank/50-decisions/ADR-0004-san-ownership.md`, status `proposed`** —
context, alternatives, consequences and rollback in full. This note is the seam; the ADR is the
*why*, for the maintainer who arrives after all of us.

## Why this one got an ADR when the other two did not

Seams 1 and 2 are consequences of a ratified clause — an API that follows from `ADR-0002` clause 2,
and a "no, and here is the pre-authorized trigger". An ADR for either would restate ratified ground.

Seam 3 is different by `ADR-0002`'s own test, which is why that ADR named it and then explicitly
declined it ("a separate seam the audit named, and it is not this ADR's business"): **three epics
need the same thing, the first one to arrive will invent it ad hoc, and the failure mode is
silent.** If `EPIC-002` formats SAN inside its renderer because that is where it needs a string, then
`EPIC-003` either imports the renderer to name a candidate move — an upward edge from input into
presentation — or writes a second grammar. Two grammars that disagree do not throw: the move a player
reads on screen and the move their typed string resolves to simply stop being the same move.

## What forced the placement — structure, not taste

Three facts, read off the merged code and the notation's rules:

- **Disambiguation needs the legal move list.** `Nbd2` vs `N1d2` vs `Nb1d2` is decided by the other
  legal moves of the same piece type reaching the same square. So `toSan` calls `legalMoves`.
- **The `+` / `#` suffix needs the move played** — `isInCheck` after it, plus
  `legalMoves(after).length === 0` for mate.
- **Parsing takes the same two inputs and has the same dependencies.** Render and parse are inverse
  functions over one grammar.

The first fact alone rules out the rules core: SAN cannot sit below `legal.ts`. The first two mean
*any* module that formats SAN carries a rules dependency — including a renderer, if that is where it
lands. So the choice is not "should SAN be near the rules or near the screen"; it is "where does the
rules dependency that SAN unavoidably has get to live".

## What the measurement added, and it changed one thing

| What | Measured (two runs, M3 / Node v24.12.0 / darwin/arm64) |
|---|---:|
| `toSan(position, move)` — computes its own `legalMoves` | 4.31 / 4.45 µs |
| `toSan(position, move, legal)` — caller supplies the list | **0.10 / 0.11 µs** |
| Full move-history render, 40 / 120 / 300 plies | 171-176 / 517-533 / 1,272-1,318 µs |

**SAN is ~97% `legalMoves` and ~3% string work.** Two consequences:

- **The optional `legal` parameter is in the contract, not a tuning detail.** `EPIC-003`'s parser
  has just called `legalMoves` to validate, and its `moves` command is formatting that very list —
  ~41 moves at 4.31 µs each (176 µs) or at 0.10 µs each (4 µs). Both clear `NFR-003`'s 100 ms
  budget; the 40x is free and the parameter is one optional argument.
- **The history panel is the most expensive single item in a frame, and all of that cost is inside
  `legal.ts`.** Anyone profiling the renderer will land in the rules core. Worth knowing before it
  looks like a renderer bug — and if `ADR-0003` clause 3's menu is ever spent, (c2) lazy legality
  makes this panel ~3x cheaper for free.

**Clause 3 (no SAN cache) is the one measurement decided rather than confirmed.** A full-history
render is **3.3% of `NFR-002`'s 16 ms frame budget at 120 plies** (1.1% at 40, 8.2% at 300). Storing
the strings would buy that 533 µs and cost a second array that must stay in step with the
authoritative move list — the exact shape clause 2 rejected for the undo stack and the counts. At
3.3% the boring rule wins and the module keeps one rule with no exception. The cost curve is
`O(plies)` against a fixed budget, so the ADR carries a named trigger (~25% of the frame budget, by
extrapolation ~900-1,000 plies on this machine, `UNKNOWN - verify` elsewhere) and two responses in
order: **render only the visible window** (a terminal history panel shows a window of rows anyway —
this makes the frame `O(window)` with no cache at all, and it is a renderer decision inside
`EPIC-002`), then, if that is not enough, compute SAN at append time inside `history.ts`, truncated
by the same function that truncates the list. Safe to add later because the SAN of ply *i* depends
only on the position at ply *i* and the move, so truncation never invalidates a surviving entry.

## The ticket boundary — the thing wave 2 is waiting on

The routing note says where SAN lives decides whether "move history display" is one ticket or two.
It is **two, in two different epics, over one file**:

- **`EPIC-002` creates `src/san.ts` with `toSan` only**, plus its tests, and the move-history panel
  ticket consumes it. **`EPIC-002` does not ship a parser** — it has no use for one, and shipping one
  unused would be AGENTS.md rule 5.
- **`EPIC-003` adds `parseSan` to the same file** and owns the `parse(toSan(move)) === move`
  round-trip property test its Test notes already name. **It does not ship a second formatter.**
- **`EPIC-006`** consumes `toSan` for the game-end move list, and for PGN export if that negotiable
  slice survives. It adds nothing to the module.
- **`EPIC-005`** needs no SAN at runtime — the book is keyed by position. Its *offline* compiler may
  need to parse SAN depending on the source format it picks: `UNKNOWN - verify`, and not a reason to
  shape this module today.

Neither epic waits on the other and neither duplicates the other.

## Status of the ADR, stated so nobody over- or under-reads it

`ADR-0004` is **`proposed`**. **No agent may mark an ADR `accepted`** — `ADR-0002` and `ADR-0003`
were each ratified in session by a named human and this one needs the same ruling.

- **It does not block BA/PM cutting tickets in wave 2.** The seam is closed *here*, in this
  `decision` note, which is what wave 2 reads. Tickets cut against it must name `ADR-0004` as a
  dependency and say it is unratified.
- **It does block merging the first line of `src/san.ts`**, because that is the point at which the
  decision gets expensive to reverse. `autonomy=pr`; the human holds that merge already.
- **No `plans/traceability.md` row was appended**, deliberately. That file's own trailing comment
  records that the `ADR-0002` and `ADR-0003` rows were appended *after* ratification; a row for a
  proposed decision would read as settled. The row is owed on ratification.

## Confidence

**High on the placement**, which rests on a structural fact rather than a preference.
**Medium-high on "both directions in one file"** — a judgment about a parser nobody has written; the
ADR records the split alternative and what would make it right (a grammar that grows a lexer, e.g.
PGN *import*, which is in no epic today). **High on the measurements**, two runs, with `legalMoves`
and `zobristKey` reproducing `ADR-0002`'s and `ADR-0003`'s published figures in the same harness.
One machine, one Node version — `UNKNOWN - verify` on any other hardware.

**The honest limit, the same one `ADR-0002` names about itself:** no existing test covers any of
this, because none of it exists. `EPIC-003`'s round-trip property test and the history module's own
tests are the only safety net either decision will ever have.
