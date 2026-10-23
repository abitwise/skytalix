---
id: 20261023T211559Z-orchestrator-decision-e44d2903
kind: decision
by: orchestrator
at: 2026-10-23T21:15:59Z
verified_by: 
confidence: high
refs:
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - src/levels.ts
  - src/engine.ts
  - NFR-004
  - ADR-0045
supersedes: 
seal: sha256:6d92572838551f75b60f3ff467bbbe179f9a80a1c0b83315d96773262caaf08e
---

# The owner's in-session word. A transcription, not a stamp

Verbatim: *"1. +100 target ok ; 2. run whenever idle ; I think we can add 2 more difficulty settings: 6 - allow to think 5 seconds and 7 - allow to think up to 30 seconds, to squeeze maximum out."*

1. **EPIC-008 Q1:** M1 target = point estimate ≥ +100 Elo on the harness scale (R at close − R at baseline), with the 95 % interval above 0. Owner-set.
2. **EPIC-008 Q2:** long harness readings run whenever the board is idle, one at a time, AC required, alone among agent hops (as ABC-202). No owner window needed.
3. **New difficulty levels 6 (5 s) and 7 (up to 30 s)** — owner's requirement/scope word. It moves bounds the owner owns, and he is told so plainly:
   - `NFR-004` "hard ceiling 5 s at any difficulty" (`HARD_CEILING_MS = 5_000`, `src/engine.ts:129`) cannot hold for level 7, and level 6's 5 s budget sits on the ceiling. The owner's word sets the new ceilings for levels 6–7; the exact NFR-004 text goes back to him.
   - ADR-0045 (level table; `HARDEST_LEVEL = 5`, UCI `Skill Level` range) needs an amendment → drafted PROPOSED, owner accepts.
   - EPIC-008 gate G9 ("level table byte-identical") must be re-read as "levels 1–5 unchanged".
   - Routed to BA/PM (`bapm-cut-levels-6-7`) when a width slot frees (3/3 now).
