---
id: 20261023T222657Z-architect-design-decision-49e3ba84
kind: decision
by: architect-design
at: 2026-10-23T22:26:57Z
verified_by: 
confidence: high: wording checked against source on this tree
refs:
  - ABC-212
  - ADR-0045
  - NFR-004
  - ABC-200
  - memory-bank/70-runbook.md
  - grugops/scribe-ABC-212
  - grugops/arch-runbook-ABC-212
  - ticket-to-pr-ABC-212/20261023T220736Z-software-engineer-decision-e4a87583
  - scribe-ABC-212/20261023T222231Z-agents-md-scribe-decision-35329b73
  - plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
supersedes: 
seal: sha256:6aac681b2701672e02dd9552b8b80c0d4b04597b910a705e662ef17e288b94bb
---

# ABC-212 A11: runbook § Operate names levels 1-7

Architect/Design, task arch-runbook-ABC-212, branch grugops/arch-runbook-ABC-212 from grugops/scribe-ABC-212 2ba55ea7; commit 8cc78fee. Not pushed, not merged.

## Change (memory-bank/70-runbook.md § Operate, game bullet)
- Old: "--difficulty 1|2|3|4|5 (default 5, ADR-0045)"; prompt "difficulty (1|2|3|4|5) [5]: ".
- New: "--difficulty 1|2|3|4|5|6|7 (default 5, ADR-0045)"; prompt "difficulty (1|2|3|4|5|6|7) [5]: "; new bullet: levels 1 weakest to 7 strongest, default 5 no longer the hardest (thinks up to 3 s), level 6 thinks 5 s and level 7 thinks 30 s a move, hard ceilings 7 s / 32 s per the NFR-004 text the owner accepts (ADR-0045 § AMENDMENT 2026-10-24); expect about 30 s with no output per level-7 engine move.
- Old wording kept in a dated [CHANGED 2026-10-24] bracket; one _Updated_ header line added.

## Checked on 2ba55ea7
- src/cli-options.ts: Difficulty = 1..7, DEFAULT_DIFFICULTY = 5, "--difficulty needs one of 1|2|3|4|5|6|7".
- src/levels.ts LEVELS: 5 = 3000 ms, 6 = 5000 ms, 7 = 30000 ms, blunder rate 0; comment: NFR-004 ceiling 5 s at 1-5, 7 s at 6, 32 s at 7.
- src/startup-questions.ts:120-124: prompt levels = DIFFICULTY_VALUES.join("|").

## Open (not mine, fenced)
- plans/nfr-catalog.md NFR-004 row on this branch still reads "hard ceiling 5 s at any difficulty"; Security/NFR owns that row.
- No test reads 70-runbook.md; no gate run (records only).
