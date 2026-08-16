---
id: 20260816T063000Z-ba-pm-decision-five-tickets-and-the-seams-i-cut-them-on-4f2a91c7
kind: decision
by: ba-pm
at: 2026-08-16T06:30:00Z
verified_by: 
confidence: high
refs:
  - EPIC-005
  - ABC-092
  - ABC-093
  - ABC-094
  - ABC-095
  - ABC-096
  - RISK-004
  - NFR-006
supersedes: 
---

# Five tickets, `ABC-092`…`ABC-096` — the seams I cut on, and the ones I refused

My range was `ABC-092`…`ABC-099`, stated as **a ceiling, never a quota**, with the instruction that
three good tickets beat eight thin ones. I used **five** and left `ABC-097`…`ABC-099` unused.

## The seams, and why each one is a real seam and not a slice of prose

| # | ticket | the seam | pullable before `EPIC-004`? |
|---|---|---|---|
| 1 | `ABC-092` | **legal / illegal.** Before it, copying data is forbidden by `RISK-004`; after it, permitted | **YES — and before everything else too** |
| 2 | `ABC-093` | **build time / run time.** A compiler and an artifact; nothing here executes during a game | **YES** |
| 3 | `ABC-094` | **read side / wire side.** Position in → book move or nothing out. No engine in the room | **YES** |
| 4 | `ABC-095` | **`EPIC-005` / `EPIC-004`.** The only place the two epics touch | **NO — hard blocked** |
| 5 | `ABC-096` | **data / display.** The only place book bytes reach a terminal | **YES** |

Every boundary above is a boundary in the **code**, not in the narrative: a different file, a
different lifecycle, a different test instrument, and — for four of the five — a different blocking
dependency.

## The four merges I considered and rejected, with the reason each

1. **`ABC-092` into `ABC-093`.** Rejected outright. The entire content of `RISK-004` is *"resolve
   this BEFORE copying any data, not after"*, and a folded ticket makes the copy and the permission
   the same hop — which is the failure mode by construction. This is the merge that would have been
   most tempting on a count-minimising instinct and it is the one that must not happen.
2. **`ABC-093` into `ABC-094` (compiler + probe).** Rejected. Build-time and run-time code, two test
   shapes (a full-book walk vs a hostile-input matrix), and the combined size reads `L` — the
   largest thing in an epic recorded `S`. Splitting also bought the single most useful property in
   this cut: the read side is provable with **no artifact-format decision settled**, because `A5`
   and `A6` are about the *absence* of a good book.
3. **`ABC-096` into `ABC-093` (carry the name / show the name).** Rejected. `ABC-093` *carries* the
   name field; `ABC-096` *renders* it. Rendering crosses into the frame path, where `NFR-002`,
   `ADR-0009`'s row identity, a snapshot suite and a measured escape-byte security bar all live.
   Folding would put four frame fences inside a data ticket and would make the epic's most droppable
   bullet undroppable.
4. **`ABC-095` into `ABC-094` (probe + wiring).** Rejected, and this is the one that decides whether
   this epic is startable at all. Folded, **the whole read side inherits `EPIC-004`'s block** and
   `EPIC-005` becomes 100% unstartable. Split, 4 of 5 tickets are startable today. See the
   pullability note.

## The splits I considered and refused

- **Splitting the legality proof out of `ABC-093`.** A compiler that emits an unvalidated artifact
  is not shippable, and `EPIC-005` § Test notes makes the proof part of the deliverable. A separate
  validation ticket would be a ticket whose only value is that another ticket was incomplete.
- **Splitting the seeded-randomness seam out of `ABC-094`.** It would be a single-use abstraction
  today (`AGENTS.md` coding rule 6) — **but `EPIC-004` wants the same seam** for its blunder-rate
  difficulty levels and its reproducible-under-seed acceptance. **That is a gap for Architect/Design
  at `In Design`, not a ticket of mine**, and cutting it would have been `EPIC-005` deciding
  `EPIC-004`'s shape, which my subject boundary forbids.
- **A separate "book NFR" ticket for `NFR-006`.** Refused. An NFR with its own ticket is an NFR
  nobody's ticket carries; `NFR-006` is `ABC-093` `A5`, on an instrument that runs today.

## Why not fewer than five, in one line

Three tickets would require folding either the licence gate into the copy (illegal), or the wiring
into the probe (which would block the entire epic on `EPIC-004`). **Both merges cost more than the
two ticket pages they save.**

## Stop conditions — which fired

- **`XL` → `SPLIT_REQUIRED`: did NOT fire.** Largest is `M` (`ABC-093`, `ABC-094`); no `L`, no `XL`.
- **Source/licence undecided → owner/Architect question: FIRED, and I obeyed it.** `ABC-092` exists
  to *shape* the decision; **no candidate source is named anywhere in it**, deliberately, so nothing
  on the page can be read as a pick.
- **A decision belonging to `EPIC-004`'s engine design → name the owner and stop: FIRED twice.**
  (a) Where the short-circuit lives — inside the engine's move-choice function or in the caller
  above it. (b) Who owns the seeded-randomness seam. **Both recorded, neither resolved.**
