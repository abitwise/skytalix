---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-18T07:30:30Z
sealed: false
refs: [EPIC-004, ADR-0044]
---

# Owner word, 2026-10-18 — research and plan converting the software to a chess engine; NO development

The owner asked, verbatim: *"What I want more from the software is: Investigate and research how to convert the software to chess
engine. What are the standards of chess engines? I'm thinking to use this chess engine behind a chess UI (possibly we will create our
own chess UI - web based, separate project). Don't start development, we need to confirm the chess engine conversion product side,
architecture and plan. Make ii based on KISS principle."*

- Scope: research (engine standards), product framing, architecture, plan. **No code, no ticket enters Ready, nothing is pulled** until
  the owner confirms. The ADR stays PROPOSED; the epic and tickets stay in Backlog as proposals.
- Route: Architect/Design first (`arch-engine-research`: standards + ADR-0044 PROPOSED), then BA/PM (`bapm-engine-plan`: epic, MVP cut,
  ticket plan, owner questions), each citing the other's notes, never relayed.
- KISS is the owner's explicit constraint.
