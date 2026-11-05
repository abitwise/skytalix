---
id: 20261105T001541Z-qe-e2e-decision-9ac0fbda
kind: decision
by: qe-e2e
at: 2026-11-05T00:15:41Z
verified_by: 
confidence: high on the two readings and on A3 (b)'s door, which rest on named records; A4 (b)'s door is UNKNOWN - verify, the Architect's
refs:
  - qe-ABC-304
  - ABC-304
  - ABC-271
  - ABC-279
  - ABC-283
  - ADR-0070
  - ADR-0069
  - ADR-0072
  - ADR-0063
  - NFR-009
  - EPIC-011
  - grugops/ABC-304
  - e1ac9209
  - 9e0d4044
  - se-ABC-304/20261105T000021Z-software-engineer-decision-aa228da0
  - se-ABC-304/20261105T000021Z-software-engineer-observation-26228fe3
  - se-ABC-304/20261105T000021Z-software-engineer-observation-74a63e3d
  - arch-ABC-303-open/20261104T233811Z-architect-design-decision-84f9bae1
  - arch-ABC-303-open/20261104T233941Z-architect-design-decision-e28552ac
  - arch-ABC-283-mate/20261104T142415Z-architect-design-decision-05ef9fc9
  - se-ABC-283/20261104T135528Z-software-engineer-observation-6000a44f
  - bapm-K0-cut/20261104T235027Z-ba-pm-decision-555a9a9e
  - ADR-0050
  - ADR-0058
  - ADR-0061
  - ADR-0064
  - ABC-268
  - ABC-303
  - QE-304-a
  - QE-304-b
supersedes: 
seal: sha256:4732274d64aed6ff179199b4ba2a31fb817916bac85bb20c9c1c6a3080b74d0a
---

# qe-ABC-304 rulings: both disclosed readings stand. A3 (b) needs no door ruling: the records keep it on `search()`. A4 (b) needs the Architect: no record rules it, and the rule's words reach it

QE/E2E, task `qe-ABC-304`. Readings are in this task's observation. Nothing here moves a row, a figure or a bar.

## The engineer's two readings (`…aa228da0` items 2 and 3)

**Item 2, one comment per re-point, not one per row: upheld.** Scope 4's "each re-point" follows scopes 1 to 3, which are three blocks, and the diff has three comments. Each cites a dated line that exists: `ADR-0070` d5, `ADR-0069` d11 with `ADR-0072` d7, and `ADR-0063` § Consequences. The same file's `ABC-283` comment does the same: one block over A4 (a)'s four rows. Nine comments would not fit the ticket's "about ten changed lines". K0's comment sits above the helper but speaks of "the rows", so the two `search` rows below it are covered.

**Item 3, A3 (a)'s log labels stay: upheld.** Scope 2 says titles stay, and `…555a9a9e` J4 gives the reason: lane logs and `-t` lines stay comparable. A label is not a title, so the scope does not strictly cover it. The precedent does: `src/search.pvs-lmr.test.ts` logs "search() d5" over `searchWithoutNullMove`. The cost is that a log line says `search()` over a door. The comment above the rows states the door, so nothing is hidden.

## A3 (b): no door ruling needed

It stays on `search()`. The records settle it:
- `ADR-0069` d8, the row's own ADR, keeps value and behaviour rows on the shipped path and names mates. `ADR-0061` d6 and `ADR-0064` d7 say "the mate rows". d11's dated line names mates again.
- `arch-ABC-283-mate` `…05ef9fc9` names this row. SE line 4 has `ABC-279` A3 (b) turn green "with no re-pin", and its evidence is the row read with all three parts on, 0 / 190. `…6000a44f` records it as not re-pointed, as an `ADR-0064` d7 safety bar. `ABC-283` B2 (a) grades that floor.
- The row did that job. It went red on the KRK defect on the shipped path, which a door could not have shown. `src/search.bundle.test.ts` floors the shipped path only against the all-off doors.
- `grugops/ABC-303`'s `src/see.test.ts` leaves it on `search()`.

Against that, disclosed: `ADR-0058` d5 and `ADR-0050` d4 name a same-depth mate floor among re-points, and the null-move and `ABC-228` floors do stand on doors. Those are older, and the later words, including this row's own ADR, are specific. Nothing depends on the answer today: 0 of 190 on both sides.

**One line is owed, and it is wording only.** d11's dated line and `…84f9bae1` item 3 say mates "compare with no door". That is untrue of this row: its reference is `searchWithoutSeePruning`. The reason given is wrong, and the conclusion stands on d8. If the Architect meant that clause as the test, A3 (b) would re-point against `…05ef9fc9`. I do not read it so, and I record that reading as mine. Raised as `QE-304-b`.

## A4 (b): needs the Architect

**No record rules this row.** `…84f9bae1` rules A3 (a). Scope 2 and A5's nine leave A4 (b) out. A grep of `main`'s ADRs, tickets and notes for the row's label and for `reach(chooseMove)` finds no line on its door: `qe-ABC-279` reads its figure, and nothing later names it. So its door is `UNKNOWN - verify`. Below is what QE can say, and it is not a ruling.

**The rule's words reach it.**
- The shipped side is `chooseMove`, and the other side is an older door, `chooseMoveWithoutSeePruning`.
- It is not zugzwang, a mate row or `G1`.
- It shares `ADR-0069` F4 with A4 (a), which `ABC-283` re-pointed as a work row.
- Its twin in form, `ABC-268` A4 (b) in `src/search.futility.test.ts`, already stands on `chooseMoveWithoutTaper`.
- Its level, door + 0.55, comes from ⌊20 · 0.7 · 0.837⌋ / 20, Q1 alone. On `chooseMove` it reads 6.868, +0.989: Q1 plus the bundle, under a level nobody set for that stack, in `…84f9bae1`'s terms. On the door it reads 6.716, +0.837, the ADR's figure exactly.

**Why it is the Architect's and not this hop's.** Which search stands on a bar's side is his to rule, as he ruled A3 (a) by name. `ABC-304` bars the edit: scope 2 names two rows, and A5 counts nine. It is the same family as `…e28552ac` names: a row out of the re-pointer's view stays where it was. A likely reason, not a recorded one: a `chooseMove(` grep does not find `reach(chooseMove)`.

**It gates nothing.** The row clears ≥ + 0.55 on either side, so there is no red, no STOP and no owner question. `ABC-304` does not wait on it. If he rules a re-point, it is one test line, on `src/see.test.ts`, which collides with `grugops/ABC-303`; who carries it is the Orchestrator's. Raised as `QE-304-a`.
