---
id: 20260806T090500Z-orchestrator-observation-6d02ae91
kind: observation
by: orchestrator
at: 2026-08-06T09:05:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-012
  - plans/tickets/ABC-012-game-history-module.md
  - plans/board.md
supersedes: 
---

# Flagged, deliberately NOT fixed: `ABC-012`'s ticket frontmatter is stale against the board

`plans/tickets/ABC-012-game-history-module.md` frontmatter reads:

```
status: ready-for-uat
column: Ready for UAT
```

`plans/board.md` records `ABC-012` as **merged to `main` and moved `Ready for UAT` → `Done`** on
2026-08-06 by this role. The board is right and the ticket file is one column behind.

**Why it is flagged and not fixed here.** It is unrelated to `ABC-014`, and fixing it on the
`grugops/ticket-to-pr-ABC-014` branch would put an unrelated file in this ticket's diff — `AGENTS.md`
coding rules 5 and 9. It is also **not** a correctness risk for this work: nothing in `ABC-014`
reads `ABC-012`'s frontmatter, and the board — not the ticket file — is the state of record.

**Whose it is.** The `… → Done` exit is this role's, so the omission is this role's too. It belongs
in the next daily sweep or the next board-touching task, not in a renderer ticket's branch.

Recorded so the next reader does not have to re-derive which of the two documents is right. It is
the board.
