---
id: 20261021T141847Z-ba-pm-observation-20cc2ffe
kind: observation
by: ba-pm
at: 2026-10-21T14:18:47Z
verified_by: 
confidence: high
refs:
  - ABC-168
  - A6
  - EPIC-007
  - EPIC-007 M3
  - RISK-EPIC007-05
  - EPIC-007 M9
  - ADR-0008
  - ABC-173 C2
  - 6d840c0d
  - 20261021T141226Z-software-engineer-observation-a4721906
  - plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
supersedes: 
seal: sha256:2c0c2048c23b499c9d9e840cbe8e20cc5bfbbe55ba842ea0405fad2ca3c885b8
---

# Owed by the owner: confirm EPIC-007 M3's "how it is read" rewording (and RISK-EPIC007-05's). The fallback is route (1)

EPIC-007 M3's targets do not change. Its "how it is read" cell says "The opt-in real-child lane in ABC-168 ... The book-load cost on this host is UNKNOWN - verify until that lane reads it". RISK-EPIC007-05 says "M3's 1 000 ms stays a proposal until ABC-168's lane reads it". This hop did not edit EPIC-007 (brief fence).
Proposed wording:
- M3 cell: "One QE hand reading in ABC-168, by an async probe outside vitest (ABC-168 test note 6), recording host and load1. Security/NFR places it as ADR-0044 candidate row (i) and may change the numbers. The book-load cost on this host is UNKNOWN - verify until that probe reads it."
- RISK-EPIC007-05: "... until ABC-168's QE probe reads it."
Until the owner confirms, QE still reads A6, but the reading is not cited as M3's proof. This gates neither development, QE nor the merge.
If he declines and wants the reading inside the lane, the fallback is route (1): the Architect amends the ADR-0008 addendum for one serial async child in the UCI_DEEP lane, and BA/PM widens A11 and A12 for the C2 edit in src/cli.test.ts.
The M9 confirmation from bapm-amend-ABC-168 (…7667bcc5) is still open too. Both can be asked in one question.
Files touched by this hop, uncommitted on main: plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md, plus the queue records .grugops/queue/done/bapm-rule-ABC-168-A6.md and .claim.md. Not touched: EPIC-007, ADR-0008, ADR-0044, src/, AGENTS.md, plans/board.md, plans/traceability.md.
