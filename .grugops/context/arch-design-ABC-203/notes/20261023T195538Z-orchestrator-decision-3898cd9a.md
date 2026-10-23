---
id: 20261023T195538Z-orchestrator-decision-3898cd9a
kind: decision
by: orchestrator
at: 2026-10-23T19:55:38Z
verified_by: 
confidence: high
refs:
  - ABC-203
  - ADR-0047
  - plans/tickets/ABC-203-at-game-end-npm-run-chess-writes-the-game-as-a-standard-pgn-file-under-games.md
supersedes: 
seal: sha256:fee0144eab3d8fd3621f374a5888c580afabcc9adc0a9866c0e1cec666e4a69b
---

ADR-0047 is HELD for the owner; `grugops/arch-design-ABC-203` (738a3c9f) is NOT merged.

- The owner delegation `…5aaf7cec` item 3 reads, verbatim: "Still the owner's (escalate): big architecture decisions (**a new ADR**, or one that changes or reverses an accepted one)". ADR-0047's Status says the delegation sends "only a reversal" to the owner — that misreads item 3. A new ADR is the owner's.
- The error started in the Orchestrator's own brief (`arch-design-ABC-203`: "new ADR = fine if it reverses nothing accepted"), which contradicted item 3. The Architect followed it in good faith. Corrected here.
- Effect: ABC-203 stays In Design until the owner accepts or vetoes ADR-0047. On acceptance, the Status line is re-written to "accepted by the owner" before merge. The rest of the design ruling stands on its evidence.
- Future briefs: a new ADR is always a STOP to the owner.
