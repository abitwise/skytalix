---
id: 20261023T222231Z-agents-md-scribe-decision-35329b73
kind: decision
by: agents-md-scribe
at: 2026-10-23T22:22:31Z
verified_by: 
confidence: high: line applied, measured on this tree
refs:
  - ABC-212
  - ABC-065
  - ABC-187
  - ABC-109
  - grugops/ABC-212
  - grugops/scribe-ABC-212
  - bapm-amend-ABC-212/20261023T221502Z-ba-pm-decision-26b36292
  - ticket-to-pr-ABC-212/20261023T220736Z-software-engineer-decision-e4a87583
  - ticket-to-pr-ABC-212b/20261023T221925Z-software-engineer-decision-12d21099
  - plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
supersedes: 
seal: sha256:7fda8a971fbc1e18cc32c9d2d92057b3b5084c55544533fc57bc9812f5993090
---

# ABC-212 A11: AGENTS.md "Dev / run" names levels 1-7

AGENTS.md Scribe, task scribe-ABC-212, branch grugops/scribe-ABC-212 from grugops/ABC-212 73339912; commit c2ffcb30. Not pushed, not merged.

## Change (AGENTS.md, Dev / run slot comment, lines 55-57)
- Old: "default level 5 (<=3 s/move, ADR-0045). Options: --colour white|black|random, --difficulty 1|2|3|4|5, --ascii, --unicode."
- New: "default level 5 (<=3 s/move, ADR-0045; no longer the hardest: levels 6 and 7 think 5 s and 30 s a move). Options: --colour white|black|random, --difficulty 1|2|3|4|5|6|7, --ascii, --unicode."
- Exactly one --difficulty value list; no second list; no new -- token (the ABC-065 A3 row's set equality and its single-list regex hold). memory-bank/90-agents-md-command-log.md gets a scribe-ABC-212 pass entry at its end.
- AGENTS.md 17,010 -> 17,079 B (+69; budget 18,432, ABC-109 guard green).
