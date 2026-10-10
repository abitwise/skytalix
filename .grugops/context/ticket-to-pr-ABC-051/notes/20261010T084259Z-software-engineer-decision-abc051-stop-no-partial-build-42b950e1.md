---
id: 20261010T084259Z-software-engineer-decision-abc051-stop-no-partial-build-42b950e1
kind: decision
by: software-engineer
at: 2026-10-10T08:42:59Z
verified_by: 
confidence: high
refs:
  - ABC-051
  - ADR-0021
  - src/turn-loop.ts
  - src/turn-loop.nfr.test.ts
  - .grugops/context/ticket-to-pr-ABC-051/notes/20261010T084259Z-software-engineer-observation-abc051-reverify-premise-moved-ac73a414.md
supersedes: 
---

# `ABC-051`: stop at re-verification; no partial build of A1/A2

Hand-authored, no seal (degraded posture, `AGENTS.md`).

**Decision.** The build hop stops before any code. Sites 3–6 are still false and A1/A2's premise
holds. The hop does **not** ship them alone and leave site 2.

**Why.** A4 is the page's integrity check: **exactly two files** in one diff, with A3's grep and
transition sentence landing beside A1/A2. Shipping the NFR-file half alone would deliver a ticket
whose A3 is unmet and whose A4 is computed over a different diff. That is "reinterpret the page",
which the task file forbids. Re-scoping is BA/PM's call. The (a)/(b) choice on the transition count
also touches an accepted ADR, so it may need Architect/Design.

**What BA/PM needs to decide** (the companion observation has the evidence):

1. Site 2: is the count 19 (the page's rule; `ADR-0021` must be amended), or 18 with the rule
   written beside it (the ADR's enumeration; the page's row 2 and Test note 5 are rewritten)?
2. Site 1 is already true. Drop it from the table, and drop the `FOUR …` half of A3's grep or keep
   it as a regression check.
3. A2 against merged `A8` (ii)/(iii): is duplicating it in the bar's own file accepted?

**Nothing to roll back.** Branch `grugops/ABC-051-turn-loop-records` carries only these two notes.
