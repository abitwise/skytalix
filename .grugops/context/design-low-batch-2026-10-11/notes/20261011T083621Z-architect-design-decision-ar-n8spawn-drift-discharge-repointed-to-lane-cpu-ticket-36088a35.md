---
id: 20261011T083621Z-architect-design-decision-ar-n8spawn-drift-discharge-repointed-to-lane-cpu-ticket-36088a35
kind: decision
by: architect-design
at: 2026-10-11T08:36:21Z
verified_by:
confidence: high
refs:
  - AR-N8SPAWN-DRIFT
  - ADR-0017
  - ADR-0035
  - ABC-108
  - ABC-116
  - NFR-008
  - N8-SPAWN
  - src/cli.test.ts
  - .grugops/queue/claimed/bapm-batch-2026-10-11/bapm-batch-2026-10-11.md
  - 20261010T201446Z-orchestrator-observation-handoff-5-e41d7a20
  - 20261010T192920Z-orchestrator-decision-owner-word-six-answers-b7c41e09
  - 20261010T190811Z-ba-pm-decision-backlog-rescored-r1-two-drop-four-ready-one-held-abc142-cut-d8990fbb
supersedes:
---

# Item 5: `AR-N8SPAWN-DRIFT`'s discharge moves to the owner's lane-CPU ticket, with one readable condition

This note is hand-authored and unsealed. Nothing was run or timed.

## The question
- `ADR-0017` decision 3 placed the discharge *"at `ABC-108`'s remedy, as one input among many"*.
- The owner DROPPED `ABC-108` on 2026-10-10 (*"2. yes"*, `…b7c41e09` item 2), so the risk has no carrier.

## Ruling
- **The new discharge point is the P1 ticket for the owner's goal, "reduce `npm test` CPU on the MacBook Air
  M3".** BA/PM is cutting it now (`bapm-batch-2026-10-11` item 5). Its id is not known at this hop.
  - It is `ABC-108`'s successor in kind: the hop that reads where the lane's CPU goes.
  - It is the framing decision 3 used: a grown child is one input among many.
- **The discharge condition, read from that ticket's own per-file readings:**
  - `src/cli.test.ts` holds 27 children (`N8_SPAWN = 17 + 7 + 1 + 2` at `:1838`). If it reads within its
    `F` = 1.097 s of its most recent admissible base reading (`ADR-0035` amendment under decision 3), the
    risk is **DISCHARGED for that tree**.
  - If it reads more than `F` over, check each child against its criterion's priced shape (the substitution
    hook present, not the real engine). Any child that grew is a finding against the hop that grew it,
    under `T2`.
  - The drift on record is +2.60 s CPU from one child, about 2.4x `F`. So the condition can see it.
- **Unchanged:**
  - `T2` stays the only forward control, and `ABC-116` (Ready) carries it.
  - `ADR-0017` decision 1 and its Rollback falsifier stand.
  - A discharge on one tree does not close the risk for later trees.
- **A second signal, not a discharge:** R-1's W trip-wire at each Security/NFR gate. One grown child is about
  +2.7 s of wall against about 3 s of runway to W = 10 s.
- **Fallback.** If the lane-CPU ticket is not cut, or its readings skip `src/cli.test.ts`, the discharge falls
  to the next hop that reads `src/cli.test.ts` on its narrow set, under the same condition.

## Recorded
`ADR-0017`, a Status pointer and `§ Pointers 2026-10-11`.

## Follow-ups
- **BA/PM:**
  - fold one scope bullet into the lane-CPU P1 ticket: *"read `src/cli.test.ts`'s CPU against its last base
    reading. Within `F` 1.097 s, `AR-N8SPAWN-DRIFT` is discharged. Over it, check each child against `T2`
    (`ADR-0017` § Pointers 2026-10-11)"*;
  - re-point `ABC-116`'s two lines that say `ABC-108` holds the discharge (page lines ~124 and ~185). This is
    a pointer fold: no DoR, size or column change.
- **Security/NFR, at the next catalog hop:** in the catalog's `AR-N8SPAWN-DRIFT` block, *"Discharge: at
  `ABC-108`'s remedy"* gains *"→ re-pointed 2026-10-11 to the lane-CPU P1 ticket (`ADR-0017` § Pointers
  2026-10-11)"*.
