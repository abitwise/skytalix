---
id: 20261101T203909Z-software-engineer-decision-4342e5b5
kind: decision
by: software-engineer
at: 2026-11-01T20:39:09Z
verified_by: 
confidence: high on the inlining evidence (68/68 TurboFan trace); the speed probe is informal
refs:
  - ABC-251
  - se-ABC-251
  - EPIC-010
  - ADR-0055
  - grugops/ABC-251
  - 51b803c0
  - arch-abc250-close/20261101T202347Z-architect-design-decision-a07418ac
  - src/position.ts
  - src/engine.ts
  - src/evaluate.ts
  - src/moves.ts
  - src/quiescence.ts
  - se-ABC-227
supersedes: 
seal: sha256:bbb69d4bc17ebda4e5c743a2bb014b30a55375b856b08fb4d31b34a2888e928b
---

# ABC-251 STOPPED at item 2a (profile first): nothing to cut. No code built; no ALONE read owed

**Decision.** Per the page's item 2a stop rule and the brief's STOP rule, the build stops before any edit. The Orchestrator closes the ticket as dropped with "nothing to cut". Per the page, that is not a miss and owes no failed-attempt note. No src/ file was changed on grugops/ABC-251.

**Why: the helper half has no call to remove.**
- The informal CPU profile (base main 51b803c0, chooseMove at 4 s, kiwipete and position-6, 2 fresh runs each, under the host lock) does show an isBlack frame at 2.16-2.46 % self time, and pieceType at 0.19-0.34 %.
- `--trace-turbo-inlining` shows TurboFan inlined **68 of 68** call sites it considered for the two helpers (0 refused, 0 deopts). Those sites are in whiteMinusBlack, squaresReached, generateCaptures, generateMoves, raySliderAttacks, isSquareAttackedBy, addPawnCaptures, pawnStructure, isPassedPawn, orderMoves, orderKey, orderCaptures, quiesce and leafScore.
- The frame is source attribution, not a call. V8's CPU profiler gives an inlined function's instructions back to the inlinee's frame. A microbenchmark showed this: an inlined helper still drew 2 665 of about 6 000 samples as its own frame (raw/m2.mjs; inlining confirmed by trace).
- So hand-inlining builds the same optimised code. The premise of se-ABC-227's "~2 % not inlined" does not hold on today's main.
- Informal corroboration (labelled informal; not A3, not a grade): a scratch copy of src/ had both helpers hand-inlined throughout moves.ts, evaluate.ts and quiescence.ts, a superset of the profiled sites. Interleaved against base at 4 s, fresh processes, it read median nps ratios of kiwipete 1.016 (1.009 without the cold first pair), position-6 0.996 and start 1.013. Base spreads were 2.2-4.2 %. That is noise-level and below 1.03 on every board.

**Why: only the Budget half would be left, and it measures nothing.** deepen's self time is 0.01-0.03 %. The `...heuristics` spread yields a fast-properties object with one map across the doors (`%HasFastProperties` true, `%HaveSameMap` true; raw/budget.mjs), so its per-node read sites are already monomorphic. Writing the six fields out would change the map, not the cost. That is the stop rule's "only the Budget half is left" case, verbatim.

**Fence kept.** No src/ edit, no test edit, nothing pushed or merged. Review notes 6 and 7 (QE-259-c, QE-260-a) have no diff to read.
