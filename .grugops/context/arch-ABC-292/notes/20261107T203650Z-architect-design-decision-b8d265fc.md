---
id: 20261107T203650Z-architect-design-decision-b8d265fc
kind: decision
by: architect-design
at: 2026-11-07T20:36:50Z
verified_by: 
confidence: high on the seam, the memo size and the order, each read from source; medium on the G2 ratio and the split, my judgment on read figures; the plain case is judgment; every cost forecast is UNKNOWN - verify; acceptance is the owner's
refs:
  - arch-ABC-292
  - ABC-292
  - ABC-306
  - ABC-291
  - ABC-290
  - ABC-293
  - ABC-289
  - ABC-282
  - ABC-303
  - ABC-083
  - EPIC-011
  - ADR-0076
  - ADR-0075
  - ADR-0056
  - ADR-0067
  - ADR-0071
  - ADR-0064
  - ADR-0031
  - ADR-0028
  - ADR-0034
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - G1
  - G2
  - G3
  - G6
  - C2-prime
  - S-prime
  - K0
  - K1
  - K2
  - K3
  - K4
  - K5
  - K7
  - F2
  - FL
  - b1227f2b
  - 70d931ab
  - 780d9021
  - arch-ABC-291-closed/20261107T200924Z-architect-design-decision-8cc32a89
  - arch-ABC-291-closed/20261107T200924Z-architect-design-observation-ad069f2f
  - arch-ABC-291-n8/20261106T224309Z-architect-design-decision-61a939d3
  - arch-ABC-301-miss/20261105T004221Z-architect-design-decision-e5a5ac0c
  - arch-owner-answers-1105/20261105T075329Z-architect-design-decision-ba8265e9
  - orch-2026-10-30a/20261107T201037Z-orchestrator-decision-aab9afd1
  - orch-2026-10-30a/20261106T225634Z-orchestrator-decision-6e0445ef
  - orch-2026-10-30a/20261106T211205Z-orchestrator-decision-32c023cc
  - orch-2026-10-30a/20261105T113540Z-orchestrator-decision-c1623ae7
  - qe-ABC-291/20261106T225544Z-qe-e2e-observation-2f762abf
  - qe-ABC-291/20261106T222838Z-qe-e2e-observation-024bbd63
  - se-ABC-291/20261106T201944Z-software-engineer-observation-cb124720
  - se-ABC-291/20261106T201944Z-software-engineer-failed-attempt-a8daf408
supersedes: 
seal: sha256:7341b3f2fb8ba350e8e5a8b3c693d91ef8b820a6271636636711467003f31ae1
---

# arch-ABC-292 decision: `ADR-0076` PROPOSED. The bishop pair and the rook file terms go on one read at 50, 20 and 10, outposts split off, `G2` ≤ 1.05 × with a tripwire at 1.03, QE's freeze before the probe and the build. My case: build it once, narrowed. Acceptance is the owner's, and no bar moved

Architect/Design, task `arch-ABC-292`, records only at `main` `b1227f2b`. Readings: this task's observation. Nothing was run. ADR: `memory-bank/50-decisions/ADR-0076-…`. Dated lines: one in `ADR-0056` D2, one in `ADR-0067`. No ticket, EPIC, board, `src/` or test edit.

## What it decides
1. **Two terms, one read, one switch `pieceTerms`.** Outposts leave the ticket by the split rule, held, in `ABC-306`'s form. They are the only term that needs per-minor work, two more memo words and new miss-path work, and they have no anchor better than an analogy.
2. **Definitions:** a side with two or more bishops. A file with one of the side's rooks and no pawn: open. With no own pawn and an enemy pawn: semi-open. Once per file. Seventh-rank rule kept.
3. **The rule:** a file gives a rook what it costs a king, so `ROOK_OPEN_FILE` = `KING_FILE_OPEN` = 20 and `ROOK_SEMI_OPEN_FILE` = `KING_FILE_HALF_OPEN` = 10. `BISHOP_PAIR` = 2 × (`MATERIAL`[B] − 3 × `MATERIAL`[P]) = 50. Halves equal, by the rule. Blind to `zugzwang.001`.
4. **The seam:** the file word joins the memo, and `doubled` and `isolated` share a word from the start. 576 KiB, +0, seven reads on a hit. Rooks and bishops are gathered in the walk's existing branch.
5. **`G2` ≤ 1.05 ×**, for a term that works in the walk, because a correct build at 1.03 would be a coin flip against a 1.03 bar. It costs about 1 Elo by arithmetic. Forecast 1.02 to 1.05, low confidence. **The probe must show** `cand` ≤ 1.03, or else the build carries the cut, and the cut's arm must read ≤ 1.05, or the term is not built.
6. **F2's cut:** `kingExposure` reads the file word. It is held, not spent, because taken from the start it puts a speed gain inside the term's own read.
7. **`NFR-008` ≤ +0.10 s stays.** Expected +0.03 to +0.14 s, midpoint about +0.085 s, mostly import gaps and a part nobody can explain. No new default-lane test file. A correct build may read over about two times in five.
8. **Intent GAIN,** C2′ ≥ 50.0 of 100, S′ at 1 810, Levels. CF1–CF10 and FL with the table filled. W stays read by read, and I advise asking.
9. **K rows written so an exact build can meet them.** K1 (h)'s working form from the start.
10. **The freeze is a gate:** d10's eight steps. The dispatch checks `git merge-base --is-ancestor <freeze commit> main` and the brief cites the note's id. It sits before the probe, so it is blind by date, and PR3 reads it.
11. **The deep pins are named:** § The pins this term moves. PR11 reads them before the build.
12. **Tool line at the merge, the door, no second set:** d14. The last is his to accept.

## The plain case
**Build it, once, narrowed. If it misses, I would put stop to him as my own recommendation for the hand-valued path, not E3b next.** For: the two largest plain gaps left, the cheapest term left, a kind of gap E4b was not. Against: five hand-valued attempts with none live on `main`, a pass that proves little, a real price, an estimate that was for the whole row. If he does not mean to fund a third pull and is not after the small direct gain, stop now is the better answer, and it costs nothing here.

## The owner's questions, in `ADR-0076`
1. Accept `ADR-0076`? Recommended yes.
2. d11 (d) for this term, no second set of values after a miss? Recommended yes.
3. Pawn terms back at the same numbers in a bundle? Recommended no.
4. Games first over budget? Recommended yes, sealed in each PREREG before any figure.
5. A lone pass, given 87.5 %? Recommended: read it as "keep this term" and no more. It lets a pull be asked for and is no reason to say yes. Exactly one of three is more likely at 0 than at +10: 37.5 % against 23 %.

## One item that might read as a bar
`ABC-083` A4's first row and A3 (b) cannot hold as written on any exact build (this task's observation). I read both as lost fixture properties under `ADR-0064` d7 and `ADR-0028` d2, re-found by QE in the freeze. The relation stays and the ± 100 bound row stands, so I read no bar moved. **`ABC-292` names `ABC-083` A4 in its acceptance, so if the Orchestrator or the owner reads this as a bar loosened, it comes back before the seal.** This is stated, not ruled by me alone.

## Stopped at
Any `NFR-008` figure above +0.10 s: none proposed. `G2`'s ratio is this ADR's by the ticket's own words, so it moves no bar.

## For the Orchestrator
1. Take § The owner's questions to him, with `…8cc32a89`'s two folded in as 3 and 4.
2. Read K2's two rows above, and say if they come back.
3. The cut in d6 can be its own value-identical ticket whatever happens to the term. Your order, no dependency.
4. W for this read, and his held window for the probe's PR8.
5. After his answer: BA/PM's lines in § Consequences, and d10 from step 2.

## `UNKNOWN - verify`
Every reading. Whether a hand-valued term pays. These two terms' share of row E5. How far the rook term overlaps mobility. What the cut buys. Why `G2` reads at two levels.
