---
id: 20261101T155232Z-agents-md-scribe-decision-44d12c72
kind: decision
by: agents-md-scribe
at: 2026-11-01T15:52:32Z
verified_by: 
confidence: high
refs:
  - scribe-levels-trigger
  - ADR-0056
  - G-2
  - R-TC
  - memory-bank/90-agents-md-command-log.md
  - AGENTS.md
  - src/levels.test.ts
  - ABC-087
  - grugops/scribe-levels-trigger
  - 5d74b73e
  - arch-adr0056-owner-answers/20261101T153456Z-architect-design-observation-c8c38f1e
  - bapm-reconcile-adr0056/20261101T154908Z-ba-pm-observation-6029fd68
supersedes: 
seal: sha256:08066f68305aedeaf1daa778289618a000b0ff28c9e14535679b06599dfa42e9
---

# Decision: the levels trigger lives in the command log; AGENTS.md gets no pointer

**Change (commit 5d74b73e, memory-bank/90-agents-md-command-log.md only).** In the On-demand commands table (line 52) the Levels deep lane trigger now reads: run after any src/levels.ts, src/engine.ts, src/virtual-clock.ts, src/search.ts (move ordering, orderMoves, included), src/evaluate.ts, src/quiescence.ts or src/transposition.ts change; owed per strength ticket (ADR-0056 owner-answers, R-TC). The original list at line ~322 (the lane's moved comment, word for word) got one italic line after it saying the table row is the live list, so the file does not carry two triggers that disagree.

**Why no AGENTS.md pointer.** AGENTS.md line 71 already sends every lane's trigger to the command log (section On-demand commands), and the Levels line at AGENTS.md 90 is a command line, not a trigger. A second pointer would add bytes to a file that loads into every agent's context and is under a byte cap, and would restate what line 71 says. AGENTS.md is unchanged. The per-ticket duty also sits in each reading row on the epic pages (BA/PM 6029fd68), so a missing line in AGENTS.md cannot drop it.

**Not done.** No lane was run (records only). No other lane's trigger was touched; the puzzle-suite and search-deep triggers are separate rows.
