---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T13:42:00Z
subtask: arch-owner-answers-1102
role: architect-design
ref: .grugops/context/arch-owner-answers-1102/
branch: new grugops/arch-owner-answers-1102 from main (5695ec63+) — worktree .claude/worktrees/arch-owner-answers-1102
width: records only; no test, build or engine run.
---
# Fold the owner's answers into the ADRs (note …81ae2db4)
## Do (memory-bank/50-decisions only)
- ADR-0059 → ACCEPTED. Also fix QE-264-b: the "static eval < 10 000" wording is false at extremes (−10 535 measured with nine queens) — state the true bound or drop the claim.
- ADR-0058 → ACCEPTED, NOT IN FORCE (switched on only if ABC-257 T1+T3 meets A8′ ≤ 0.93×).
- ADR-0025 T2 amendment → PARKED with ABC-258.
- ADR-0056 → record C: NEUTRAL bar (≥ 43.0/100) allowed for changes invisible at 100 ms, together with the ticket's own measured bar; say who names a ticket as NEUTRAL (its page, before the read).
- ADR-0057 → ACCEPTED with OQ-1 yes (incl. ADR-0044 D5 reversal for thread tickets; amending ADR with the worker-pool ticket), OQ-2 a, OQ-3 c (Threads 1 first), OQ-4 a, OQ-5 no, OQ-6 later. Add a status line to ADR-0044 pointing at the coming amendment. Name the inputs BA/PM needs to cut the ~3 thread tickets (shared table, worker pool + Threads option, lanes) and where they sit in EPIC-011's order now that phase 1 is paused.
## Fences
Records only; no src/tools/tests, no board/plans edits. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task arch-owner-answers-1102, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-owner-answers-1102` from `main` `7daf8086`.
  Records only: `memory-bank/50-decisions/` and this task's notes. No `src/`, `tools/`, tests, plans or board edits.
  Nothing run, built or timed.
- **ADR-0059 → ACCEPTED**, in force at `ABC-264`'s merge (else "accepted, not in force"). Releases `ABC-264` part 2.
  **QE-264-b fixed** (d2 dated bullet): the true bound is **|evaluate| ≤ 10 885 cp** on any board within legal
  promotion (9Q 2R 2B 2N vs bare king: 10 630 + 50 + 100 + 105), derived by reading `src/evaluate.ts`, not measured;
  QE's −10 535 sits inside; far below `MATE_FLOOR` 20 000, so A2's row is met by argument with no test row owed.
  Named limit: the FEN reader does not bound piece counts (≈ 22+ queens a side could reach `MATE_FLOOR`; an
  `ADR-0033` residual). Owed elsewhere: the page's A2 wording (BA/PM); the false comment at
  `src/transposition.ts:58-60` (Engineer, next edit of that file).
- **ADR-0058 → ACCEPTED, NOT IN FORCE.** Comes into force only at `ABC-257`'s merge with A8′ (≤ 0.93×, no game
  > 1.00×) and its game read passing; an A8′ miss ends the strand. Decision 9's read lapsed with `ABC-238`.
- **ADR-0025 T2 amendment → PARKED with `ABC-258`.** Re-asked with T4 or after the threads worker pool (whichever
  loads the table first), with fresh figures. Its NEUTRAL-bar question marked answered.
- **ADR-0056:** fourth-fold status; C2′ dated line (C: NEUTRAL ≥ 43.0/100 for a change invisible at 100 ms, always
  with its own pre-registered measured bar; **named by the ticket's page before the read**, written by BA/PM from
  the design note, never re-classed after a score; ABC-264 stays GAIN); C1 (OQ-3 c labels); D6 (P is his order;
  threads place); D7 (Q-3K-3 by OQ-2 a; Q-3K-4/6/7/8 still open).
- **ADR-0057 → ACCEPTED** with OQ-1 yes, 2 a, 3 c, 4 a, 5 no, 6 later. D6 dated line and a new § Inputs for the
  thread tickets (TH-1 shared table, TH-2 worker pool + `Threads`, TH-3 tests and lanes). **Place:** after Phase 2
  and R1, before Phase 3; TH-1 may be pulled beside Phase 2 by width; all three before W1 and any 40/15 reading;
  T2/T4 re-asked after TH-2.
- **ADR-0044:** status pointer: D5 reversal accepted (OQ-1), the amending ADR comes with TH-2; D5 stands until then.
- **Open (none blocks `ABC-264` part 2):** (1) the TH-1 `ADR-0025` d2/d4 amendment changes an accepted ADR not named
  in OQ-1, so it is recommended to be asked when written; (2) the threads place is a recommendation for the
  Orchestrator and BA/PM; (3) `ABC-257`'s trigger (C) is met, so P alone holds it; (4) LOW: the transposition.ts
  comment; (5) LOW: QE-264-e (stalemate at a cut node) is outside this brief and still unnamed in ADR-0059.
- **Commits:** claim `34294f32`; ADRs + notes `01aed339`; this Result, the trace row and the move to done/ in the
  closing commit. Not pushed, not merged.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` from `date -u`;
  3 of 3 read back, index rendered):
  - decision `20261102T135100Z-architect-design-decision-1b50793b` (the folds, QE-264-b, C);
  - decision `20261102T135100Z-architect-design-decision-a0df22b8` (ADR-0057 answers, threads place, TH-1..3 inputs);
  - observation `20261102T135108Z-architect-design-observation-c0591ef8` (artifacts, open questions).

### Trace row (10 cells, header order)

| arch-owner-answers-1102 | owner answers folded: ADR-0059 accepted (+ QE-264-b bound 10 885 cp derived); ADR-0058 accepted not in force (ABC-257 A8′); ADR-0025 T2 parked with ABC-258; ADR-0056 C (NEUTRAL for 100 ms-invisible changes, page names it before the read), P, C1 thread labels, Q-3K-3; ADR-0057 accepted OQ-1..6, threads after Phase 2 + R1 (TH-1 pullable), TH-1..3 inputs; ADR-0044 D5 pointer | EPIC-011 | ADR-0059 (ACCEPTED); ADR-0058 (ACCEPTED, NOT IN FORCE); ADR-0025 (T2 PARKED); ADR-0056 (dated lines); ADR-0057 (ACCEPTED); ADR-0044 (pointer) | NFR-009 (OQ-4 a reading, level unchanged), NFR-008, NFR-005, NFR-004 (thread inputs); no NFR file | `grugops/arch-owner-answers-1102` (records only; claim `34294f32`, ADRs + notes `01aed339`) | — (nothing run) | — (records) | — | Records done (Architect); BA/PM: ABC-264 A2 wording, EPIC-011 Out-of-scope threads line, TH-1..3 pages; Orchestrator: threads place, ADR-0025 TH-1 ask, ABC-257 pause |
