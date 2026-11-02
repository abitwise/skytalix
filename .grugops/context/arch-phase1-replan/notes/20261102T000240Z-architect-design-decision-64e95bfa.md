---
id: 20261102T000240Z-architect-design-decision-64e95bfa
kind: decision
by: architect-design
at: 2026-11-02T00:02:40Z
verified_by: 
confidence: high on the evidence; the pause changes ADR-0056 D6's Phase 1 order, so the Orchestrator carries it to the owner with the ADR answers
refs:
  - arch-phase1-replan
  - EPIC-011
  - ABC-238
  - ABC-237
  - ABC-257
  - ABC-258
  - ADR-0058
  - ADR-0025
  - ADR-0056
  - se-ABC-238/20261101T233711Z-software-engineer-failed-attempt-db17e44b
  - se-ABC-238/20261101T233711Z-software-engineer-observation-3beb1ada
  - grugops/arch-phase1-replan
  - 772153a7
  - ABC-236
  - ABC-233
  - ABC-081
  - ABC-209
  - NFR-005
  - NFR-009
  - ADR-0026
supersedes: 
seal: sha256:506f1cbcec1dbd5ee210d2dd456ed4ed766f5e6ce6de1443bf0c9559ec25d3e1
---

# Ruling: pause EPIC-011's Phase 1 TT strand. A combined T1+T3 attempt is defined, with its bar pre-registered, and resumes only on a read that can see it. Next: Phase 2's P2 (reverse futility)

## Decision
1. **T1 alone: F4 fired and stands. It is not loosened.** ABC-238 does not merge. The code (grugops/ABC-238 3abaefdd) stays as the reference.
2. **No combined attempt now.** The numbers support a combined node premise only at depth 8 and only with the table kept across moves:
   - T1+T3, searches 2-9 pooled: 0.904x;
   - T1 alone 0.976x, T3 alone 0.973x. This synergy is the premise.
   - At depth 6, about the 100 ms read's depth, T1 adds nothing over T3 (geometric mean 0.960x vs 0.944x). So the C2' read of a T1+T3 ticket would re-read ABC-209 (NEUTRAL +8.7 +/- 18.3 over 800 games; P(pass | +10) = 0.66, ADR-0056 C2').
   - T2 adds no measurable gain on a lightly loaded table in any setting. It pays only under pressure.
3. **The pre-registered combined attempt (for resumption, never measured here):** ABC-257 re-scoped to carry ABC-238's rule and doors. T2 is out.
   - **Trigger:** the owner answers yes to the open C2' question (a mechanism that cannot fire at the read's control is read on the NEUTRAL bar plus its own mechanism rows), or he allows a longer-control read. Without one, it stays paused.
   - **Mechanism bar, on held-out lines:**
     - three 16-ply lines from position-3, position-4 and position-5, each played by main's chooseMove at maxDepth 6;
     - the engine searches plies 0, 2, ..., 16 at fixed depth 8;
     - the head has T1 on and the table kept across the game's searches; the door is main (cleared, exact depth).
     - **PASS:** the summed nodes of searches 2-9, pooled over the three games, are <= 0.93x the door's, and no game is above 1.00x. A line that ends early counts the searches it has.
     - P(pass | true 0.905x) is about 0.7 (estimate: per-search sd 0.22).
   - **Also owed:** the F1-F3 and F6 analogues; ABC-209's A1-A5 and A7; ABC-257's re-checks 1-2 (the ADR-0058 d7 pre-root argument across moves; the ADR-0025 d4 amendment's "never wrong" line). Re-check 3 (an age rule) is moot without T2.
4. **ADRs (dated status lines; both stay PROPOSED, the owner's call):**
   - ADR-0058: recommend he accept it, so it reads "accepted, not in force on main". Decision 7 and the doors are the combined attempt's base.
   - ADR-0025 T2 amendment: recommend he park it with ABC-258.
5. **Next ticket: Phase 2 P2, reverse futility (static null move).**
   - ADR-0056 D2: +30-60 [B], size S, risk low-medium, top expected Elo per cost.
   - It acts at remaining depth 1-3, so the 100 ms read sees it (P(pass | +40) = 0.95).
   - BA/PM cuts it from the stub under a new id; the Architect writes its ADR (an off-door pair, ADR-0026 d10).
   - If a full page is wanted sooner: ABC-233 (history heuristic, DoR 9/10, owes its ADR).

## BA/PM owes (records; the board is the Orchestrator's)
- **ABC-238:** closed unmerged on F4, with these figures and the code reference. ABC-081's dated A1 line gains "not in force: ADR-0058 not in force, ABC-238 closed unmerged".
- **ABC-237:** parked. Reason: no eviction of deeper entries on the 2^18 table at depth 8 or less; it pays only on a loaded table (0.77x at 2^14). It is re-read with ABC-258. Its ABC-238 sequence hold is moot.
- **ABC-257:** re-scoped to the combined T1+T3 attempt above, and paused until the trigger.
  - Drop the dependency "ABC-237 merged or closed".
  - Replace A8 (one game <= 0.90x) with the pre-registered bar. On the dev set, T1+T3 read 0.874x / 0.931x / 0.922x per game.
  - Strike "an entry ... never cuts" (measured 17-23 % of exact cuts) from its premise.
- **ABC-258:** restate its premise with the store fraction (3-5 % of nodes; about 0.4-1.0 M stores a search at 40/15, not 14-20 M). Fold T2 in as the alternative remedy, measured alongside. Paused with the strand.
- **ABC-236:** lift its "after T1 / ABC-238" dependency while T1 is not in force. The fail-soft instability coupling returns with T1.
- **EPIC-011:** mark Phase 1 rows T1-T4 paused under this ruling; Phase 2 is next; correct row T3's "a kept entry almost never cuts".

## Scope
Records only: ADR-0058 and ADR-0025 status lines, these notes, the queue files. No src/, plans/ or board.

## Risks
- The 0.93x bar sits on a modest premise (about 0.90x, +/-4 %). A held-out miss ends the strand.
- Pausing Phase 1 changes ADR-0056 D6's order, so the owner should hear it with the ADR answers. If he wants T1+T3 read at 100 ms anyway, the read is about a coin flip at its likely +5-15 Elo (estimate).
- The 40/15 effect of every TT change is UNKNOWN - verify; no read in the per-change rule sees it.
