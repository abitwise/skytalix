---
id: 20261105T081150Z-architect-design-decision-3e6b25fb
kind: decision
by: architect-design
at: 2026-11-05T08:11:50Z
verified_by: 
confidence: high that the trigger now takes a bundle term and that his four limits stand, as the Orchestrator's note gives them; medium on the two readings under test 3, which are mine and open to overruling; nothing run
refs:
  - arch-owner-answers-1105b
  - ADR-0067
  - ADR-0056
  - ABC-290
  - ABC-291
  - ABC-292
  - ABC-293
  - EPIC-011
  - R-BUNDLE-1
  - zugzwang.001
  - dd88560f
  - orch-2026-10-30a/20261105T080350Z-orchestrator-decision-0f1ab02e
  - arch-owner-answers-1105/20261105T075356Z-architect-design-decision-5f5833e3
  - arch-ABC-301-miss/20261105T004221Z-architect-design-decision-e5a5ac0c
supersedes: 
seal: sha256:910c1df36917a68dac8a4b698069aa244ef383d90d482320dabee2a7eefbc685
---

# arch-owner-answers-1105b item 2: a term merged inside a bundle meets the third-pull trigger. The four tests are read on the term, not the bundle. Every other limit stands

Architect/Design, task `arch-owner-answers-1105b`, records only, on `grugops/arch-owner-answers-1105b` from `main` `6ff2554e`. Nothing was run. Source: `orch-2026-10-30a` `…0f1ab02e`, verbatim "1. yes; 2. yes; 3. yes". Line of record: the dated line at the end of `ADR-0067`'s wait block, with pointers at its § Status, its decision log and its "Its own read" line, and at `ADR-0056` D6 item 4. This supersedes reading 3 of `…5f5833e3`.

**The trigger now reads:** a term named before this miss has merged, on its own read or as a part of a bundle that merged under B1–B7. A bundle that does not merge opens nothing.

**The four tests.**
1. **Named before the miss.** The term itself must be on such a record. The bundle need not be, and a named part carries no partner through.
2. **Stands without the row.** "Its own read" becomes the read it merged on. "Its own reason" is not relaxed, and B1's relation must also hold with `zugzwang.001` removed.
3. **Blind.** It now also covers which parts share a bundle and their values. Two readings of mine: a B3 per-part read of the row is the row in hand, so a form or value changed after it fails the test for that term; and two such terms in one bundle both enter the free set.
4. **Capped.** Unchanged: one door, one fit, one attempt. Two named terms open it once.

**What stands.** Named before the miss, at most one more attempt, a third miss on this row closes tuning, and the attempt stays his call. Asking is not a yes.

**The cost, stated.** B5 stands, so the door reads a merge and not a credit. A term's own worth stays unread when the door opens, and under R-BUNDLE-1 a part with a small negative share can open it. That is weaker evidence than an own read gave. I record it because his "yes" takes it on, not to reopen it.

**The default does not move.** The next terms still go on their own reads in D6's order. This makes a bundle count; it does not make one the route.

**Not settled.** E5 without per-piece mobility at the door is already routed to `ABC-291`'s ADR brief (`…42f7fd67`). It is not ruled here.
