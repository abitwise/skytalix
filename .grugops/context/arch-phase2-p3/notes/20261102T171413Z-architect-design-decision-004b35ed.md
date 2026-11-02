---
id: 20261102T171413Z-architect-design-decision-004b35ed
kind: decision
by: architect-design
at: 2026-11-02T17:14:13Z
verified_by: 
confidence: high on the measured premise and bars; the Elo effect is an estimate until C2' reads it; the cause of ABC-264's loss stays unmeasured
refs:
  - arch-phase2-p3
  - grugops/arch-phase2-p3
  - EPIC-011
  - P3
  - P4
  - P5
  - P6
  - P1
  - P2
  - ADR-0061
  - ADR-0056
  - ADR-0059
  - ADR-0060
  - ADR-0050
  - ADR-0026
  - ABC-264
  - ABC-121
  - ABC-233
  - f2388e40
  - cfff6993
  - 4d1c0616
  - arch-phase2-rebase/20261102T151839Z-architect-design-decision-f9f440c9
  - arch-phase2-p1/20261102T144713Z-architect-design-observation-35bd3967
  - NFR-005
  - NFR-008
supersedes: 
seal: sha256:5ae08ed2eaefdee9b997754f38e960b55dd96a6215f18030e0a0bafb7d97cd3d
---

# P3 futility is the Phase 2 item that stands without P1; ADR-0061 (PROPOSED): skip quiet non-checking moves after the first at null-window nodes of remaining depth 1-3 when eval + 150/350/550 cp <= alpha, behind searchWithoutFutility / chooseMoveWithoutFutility; bars A4 (a) <= 0.88x at depth 8 both recursions, (b) >= +0.20 ply at 47 000 nodes, A3 drift all within 25 cp, mate 0, zugzwang 7/7, cut audit <= 0.5 % flips and 0 >= 200 cp; intent GAIN

## Context
Brief arch-phase2-p3: measure P4, P3, P5, P6 on main; carry ABC-264's lesson (margins vs threats; drift cannot see forks) and propose a cheap tactical check; write the ADR for the best Elo-per-cost item independent of P1. Probe: the observation of this task (same `at`).

## Decision
1. Item: P3. Measured 0.79-0.83x at depth 8 in both recursions, +0.279 ply at 47 000 nodes, every safety row clean (drift 100 %, max 10 cp; mate 0/189; zugzwang 7/7; G1 54/58; audit 0 of 2 943). Reads no move number or reduction, so independent of P1; D2's "depends on P2" was sequencing. Cost S.
2. Rejected for now: P4 (drift 87.7-89.3 %, audit 11.5-11.9 % with piece-sized errors, a fifth of root moves change; needs a quiet order = O1h, ABC-233); P6 (loses zugzwang.004, drift 345 cp, audit 1.4-2.0 %, one missed mate); P5 (clean, depth-gated, +0.06-0.09 ply; a NEUTRAL candidate with a deep bar).
3. Margins as ABC-264's lesson: depth 1 covers a quiet move's own eval change (its child is quiescence; checks never skipped): 150. From depth 2 each margin sits above the piece a threat most often wins: 350 > minor 325 at d2, 550 > rook 500 at d3. The linear 100/200 form flips at d2 (0.27 %); 150/350/550 flips nowhere. Depth 4 (750) measured clean and better (+0.321) but not taken (sub-queen margin at a depth that can win a queen; thin sample); a dated amendment may add it later.
4. Rule, predicates, switch, doors (ADR-0061 d1-d5): futilityNode(position, depth, ply, alphaIn, beta) and futileMove(position, move, index), FUTILITY_MARGIN = [0,150,350,550]; first move always searched; captures, promotions, checks never skipped; index advances past a skip; fail-soft best stored as today. Switch `futility` (Switches, Heuristics), on in search()/chooseMove only; doors searchWithoutFutility, chooseMoveWithoutFutility; every older door off; export lists +3 (ABC-077 A6) / +1 (ABC-078 A4); rows re-pointed per ADR-0050 d4 / ADR-0058 d5 / ADR-0059 d6.
5. Pre-registered bars: A2 predicate cells and each guard clause, a source row. A3 drift d5 on the 190 in both recursions every non-mate within 25 cp, 0 sign changes; mate floor d5 on the 287 0 violations; zugzwang 7/7 at recorded depths; (d) cut audit on a scratch copy of the build (search() d6 over the 196, every 10th firing node) flips <= 0.5 % and 0 with error >= 200 cp. A4 (a) <= 0.88x on each of 0.7958 / 0.7876 / 0.8295 / 0.8220; (b) reach >= door + 0.20 ply (measured +0.279); (c) G6 >= base. Instrument check: 888 786 / 1 262 046 / 1 306 981 / 391 451, reach 5.558 / 5.837 on src f2388e40. A5 G1 >= 54/58 no NEWLY. A6 C2' GAIN >= 50.0/100, S', Levels deep lane.
6. Falsifiers F1-F8 (ADR-0061 table). No fallback margin pre-chosen; margins are never raised after a read.
7. Intent GAIN, named before the read: fires at 100 ms (0.803x nodes at depth 6, 901 655 moves skipped). Estimate +15-35 Elo by ADR-0055's speed rule; C2' resolves +-48.
8. The tactical check: the cut audit. Calibrated on ABC-264's rule: 0.08 % flips, one 201 cp error in 28 486, none >= 300 cp; so ADR-0059's "skipped forks" judgement is not supported, and the -42 is noise (P(<=44|0) = 0.095) or a cost outside cut verdicts. The audit is a guard, not a predictor. Dated line added to ADR-0059 Status.
9. Order suggestion (Orchestrator's call), dated in ADR-0056 D2: P3 now, independent of the P1 re-open -> P1 if re-opened green -> P5 (NEUTRAL) -> P4 after O1h -> P6 not before E1/E2.
10. Status PROPOSED; the owner's ("accept ADR-0061" / "decline it"). Reading (b): build and gates may start; C2' and merge wait on acceptance. Default without an answer: no futility on main.

## Alternatives
P1 first; P4; P6; P5; linear 100/200; depth 1 only; depth 4 too; a three-non-pawn-piece guard; edit in place without a door. Each rejected in ADR-0061 Alternatives with its measurement.

## Scope
Records only: ADR-0061 (new); dated lines in ADR-0056 D2 (rows P3-P6) and ADR-0059 Status (item 4 measured). No src/, tests, plans or board. ADR-0025 and ADR-0060 untouched.

## Risks
- File collision with the P1 re-open (src/search.ts, src/engine.ts): the second to merge re-reads its door counts (ADR-0061 d9); bars stay.
- Eval-scale coupling: E1/E2 re-scale the margins; re-read by a dated amendment with audit and drift re-run.
- ADR number: ADR-0061 checked free at commit (ADR-0062 on main from arch-ABC-266; arch-ADR-0060-reopen added none).
- Page owed by BA/PM (P3 ticket not cut yet).
