---
id: 20260816T064800Z-ba-pm-observation-b904
kind: observation
by: ba-pm
at: 2026-08-16T06:48:00Z
verified_by:
confidence: high
refs:
  - EPIC-006
  - NFR-007
  - ADR-0007
  - plans/nfr-catalog.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
supersedes:
---

# The epic asserts `npx` in FOUR places while `ADR-0007` records the channel as undecided — an open item that named THIS hop

`plans/nfr-catalog.md`'s `NFR-007` row has carried this since **2026-08-06**, unresolved:

> *"the TWO-DOCUMENTS-DISAGREE item recorded here on 2026-08-06 — `EPIC-006` states `npx` in four
> places while `ADR-0007` clause 5 records the distribution mechanism as UNDECIDED. **Neither was
> touched by this gate**; owners BA/PM and Architect/Design at `EPIC-006`'s decomposition"*

**This is `EPIC-006`'s decomposition and BA/PM is one of the two named owners, so the item is read,
located and reported — and deliberately not resolved.**

The four places, located at this hop:

| where | text |
|---|---|
| `## Scope`, last bullet | *"Packaging: runs via `npx` with no install step and no global dependency."* |
| `## Acceptance (epic level)`, criterion 1 | *"**Given** `npx <package>` on a machine with Node installed…"* |
| `## NFR triggers` | *"`NFR-007` Cold-start time — `npx` invocation to first rendered board in **< 2 s**"* |
| `## Test notes` | *"End-to-end test that drives a scripted game from `npx` invocation to a checkmate result screen"* |

**Each presupposes the channel `ABC-100` exists to decide.** `npx` is not a neutral word here: it
names a registry-published package, which is one of the four open options and not the chosen one.

## Why it was not repaired at this hop

1. **The epic page was out of BA/PM's write scope at this hop**, by the subtask's hard limits.
2. **More importantly, the correct repair is not available yet.** Deleting `npx` would replace an
   over-specified claim with a hole; writing the real channel requires the owner. The honest repair
   is *"say what the owner chose"*, and that is `ABC-100` `A7`, which closes this item either by
   naming the channel **or** by re-dating it as still open.

**Consequence, stated so it is not read as a defect in the earlier decomposition:** `EPIC-006`
acceptance criterion 1 is currently **unmeetable by any ticket**, exactly as the 2026-08-13 pass
recorded — *"Epic acceptance criterion #1 (`npx <package>`) is therefore NOT met by this
decomposition and cannot be met by any ticket until that decision lands."* That statement is still
true after this hop, and this hop did not make it truer by writing a packaging ticket that pretends
otherwise.
