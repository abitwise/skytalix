---
id: 20261102T135100Z-architect-design-decision-1b50793b
kind: decision
by: architect-design
at: 2026-11-02T13:51:00Z
verified_by: 
confidence: high on the folds (owner's verbatim words); the 10 885 cp bound is derived by reading, not measured
refs:
  - arch-owner-answers-1102
  - grugops/arch-owner-answers-1102
  - 7daf8086
  - orch-2026-10-30a/20261102T134058Z-orchestrator-decision-81ae2db4
  - EPIC-011
  - ADR-0059
  - ADR-0058
  - ADR-0025
  - ADR-0056
  - ADR-0044
  - ADR-0033
  - ABC-264
  - ABC-257
  - ABC-238
  - ABC-237
  - ABC-258
  - QE-264-b
  - qe-ABC-264/20261102T015326Z-qe-e2e-observation-3a95d391
  - NFR-009
supersedes: 
seal: sha256:529ce00398ace5c5cefe34af9ae97f4b1aaa12d1b6cf5966413fd23e30632d2d
---

# The owner's answers folded into ADR-0059, ADR-0058, ADR-0025, ADR-0056 and ADR-0044 (records only)

Architect/Design, task `arch-owner-answers-1102`, on `grugops/arch-owner-answers-1102` from `main` `7daf8086`. Source: Orchestrator `orch-2026-10-30a` `…81ae2db4`, verbatim *"R yes, P yes, A accept, B park, C yes; 1 yes, 2 a, 3 c, 4 a, 5 no, 6 later"*. Nothing was run, built or timed.

- **ADR-0059 -> ACCEPTED.** In force at `ABC-264`'s merge; "accepted, not in force" if it does not merge. Releases `ABC-264` part 2 (A6 C2' GAIN >= 50.0/100; S' 10 games at 0.5 s vs E 1 650; Levels deep lane), then the merge.
- **QE-264-b fixed in ADR-0059 d2 (dated bullet).** The premise "static eval < 10 000, asserted" was false (QE measured -10 535; the test asserts only `MATE_FLOOR > 10 000`). True bound, derived by reading `src/evaluate.ts` at `7daf8086`, not measured: **|evaluate| <= 10 885 cp** on any board within legal promotion (<= 15 non-king pieces a side, <= 8 promoted). Largest case 9Q 2R 2B 2N vs bare king: material + PST 10 630, bare king PST <= 50, mobility clamp 100, king safety <= 105. Far below `MATE_FLOOR` 20 000, so the beta-only band test stands and A2's row is met by argument; no test row owed. Named limit: the FEN reader does not bound piece counts; about 22+ queens a side could reach `MATE_FLOOR` (an `ADR-0033` residual, not this predicate's). Owed elsewhere: the page's A2 wording (BA/PM); the comment `src/transposition.ts:58-60` (Engineer, with the next edit of that file).
- **ADR-0058 -> ACCEPTED, NOT IN FORCE.** Switched on only at `ABC-257`'s merge if A8' (<= 0.93x, no game > 1.00x) and its game read pass; an A8' miss ends the strand with no further line. Decision 9's read lapses with `ABC-238`. Decisions 1-7 port to the shared layout unchanged.
- **ADR-0025 T2 amendment -> PARKED with ABC-258.** Neither accepted nor declined. Re-asked with `ABC-258` or after the threads worker pool, whichever loads the table first, with fresh figures. Its open NEUTRAL-bar question is marked answered.
- **ADR-0056:** fourth fold in Status; C2' dated line = C (below); C1 dated line = OQ-3 (c); D6 dated line = P and the threads strand's place; D7 dated line = Q-3K-3 reading by OQ-2 (a), C and P answered; Q-3K-4/6/7/8 still open.
- **C, as recorded (ADR-0056 C2'):** NEUTRAL (>= 43.0/100) may grade a strength change invisible at 100 ms, never alone: the ticket's own pre-registered measured bar must pass too. **Who names it: the ticket's page, before the read** ("NEUTRAL (invisible at 100 ms)"), written by BA/PM from the design note at or before Ready; never re-classed after a score is seen; QE grades on the intent the page held when the read began. Qualifies only when the design's 100 ms firing figure (measured or derived) shows it barely fires; ABC-264 (5.8 % of nodes cut at depth 6) stays GAIN. C-1, C-2, S', Levels lane unchanged.
- **ADR-0044:** a status pointer: D5's reversal accepted for the thread tickets (OQ-1); the amending ADR comes with the worker-pool ticket; D5 stands on `main` until then.
- **ABC-257:** its old trigger (C) is met; it stays paused under P alone. Lifting the pause is the Orchestrator's within P.
