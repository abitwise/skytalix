---
id: 20260816T064000Z-ba-pm-decision-epic-005-size-correction-s-to-m-2c7e40b9
kind: decision
by: ba-pm
at: 2026-08-16T06:40:00Z
verified_by: 
confidence: medium
refs:
  - EPIC-005
  - EPIC-004
  - EPIC-003
  - EPIC-006
supersedes: 
---

# `EPIC-005` size: recorded `S`, corrected to **`M`** — and why I stopped at `M`

**I do not edit `plans/epics/EPIC-005-opening-book.md` (hard limit). This note is the correction;
the Orchestrator applies it.**

## The arithmetic

| ticket | size |
|---|---|
| `ABC-092` licence gate | `S` |
| `ABC-093` compiler + artifact + legality proof | `M` |
| `ABC-094` probe + seeded picker + hostile-input handling | `M` |
| `ABC-095` wiring + fall-through | `S` |
| `ABC-096` opening name in the frame | `S` |

**Two `M`s and three `S`s does not read `S`.** An epic sized `S` should be one or two small tickets;
this is five, two of which each introduce a project first (`ABC-093`: the first non-human-authored
file this repository will parse; `ABC-094`: the first production randomness source).

## Why `M` and not `L`, said plainly against the board's own calibration

The pressure to go higher is real and I want it visible: **`EPIC-003` was corrected `M`→`XL` and
`EPIC-006` `M`→`L` at their decompositions — two for two upward — and my subtask told me to treat
`S` as a hypothesis, not a fact.** I did, and it failed. But *"the last two went up two notches"* is
a pattern, not evidence, and a size inflated to match a pattern is exactly as dishonest as one left
low to look tidy.

Against `EPIC-004`, recorded `L`, which contains negamax, alpha-beta, iterative deepening,
quiescence, a transposition table, MVV-LVA + killers + hash-move ordering, a five-term evaluation,
difficulty levels and time control — **`EPIC-005` is plainly smaller**, and calling it `L` would
say the opening book is the same size as the chess engine. It is not.

`M` is where it lands: **no ticket is `L` or `XL`, `SPLIT_REQUIRED` never fired, the epic's own
scope caps the data at 8–10 plies and explicitly declines depth ("this is a variety-and-speed
feature, not a theory database"), and three of the five tickets are `S`.**

## What could move it, named in advance so a later hop does not have to argue

1. **`ABC-093` reading `L`.** If the chosen source's format needs a real parser (a full PGN reader,
   say) rather than a line walk, that ticket grows and the epic reads `L`. **`ABC-092`'s ADR is
   where that becomes knowable** — the format of the chosen source decides it.
2. **`ABC-095` reading `M` or worse.** If `EPIC-004`'s move-choice seam cannot be wrapped from
   outside, `A6` fires, the change is raised against `EPIC-004`, and the cost lands **there**, not
   here — so this one moves `EPIC-004`, not `EPIC-005`.
3. **An `EPIC-002`/`ADR-0009` row-identity re-opening under `ABC-096`.** Would grow that ticket from
   `S`; would not by itself move the epic.

**Confidence `medium`, deliberately.** Sizing an unbuilt compiler against an unchosen data source is
the least evidenced judgement in this hop, and `ABC-092` is the ticket that turns it into a fact.
