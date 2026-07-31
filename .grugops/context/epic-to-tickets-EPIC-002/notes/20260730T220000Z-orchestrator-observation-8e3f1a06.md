---
id: 20260730T220000Z-orchestrator-observation-8e3f1a06
kind: observation
by: orchestrator
at: 2026-07-30T22:00:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - ABC-011
  - ABC-012
  - ABC-013
  - ABC-014
  - ABC-015
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - ADR-0004
  - NFR-002
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - 20260730T140500Z-orchestrator-observation-c41a7e92
supersedes: 
---

# Close record — EPIC-002 decomposed into ABC-012..ABC-019; task closed with one human ruling outstanding

Close of task `epic-to-tickets-EPIC-002` (Workflow 03). Four subtasks over three waves, all
returned, all committed on `grugops/epic-to-tickets-EPIC-002`.

## What ran, and the width actually used

| Wave | Subtask | Role | Width |
|---|---|---|---|
| 1 | `architect-epic002-seams` | Architect/Design | 2 of 3, parallel |
| 1 | `system-analyst-epic002-turnloop` | System Analyst | " |
| 2 | `ba-pm-epic002-tickets` | BA/PM | 1 |
| 3 | `architect-nfr002-refresh` | Architect/Design | 1 |

Never above `queue.wip_limit` = 3, no width override taken, no WIP override taken on any board
column. `Ready` moved 0/8 → 3/8. No data was relayed agent-to-agent: wave 2 read wave 1 from
`notes/` on disk, wave 3 read waves 1 and 2 the same way. Each wave-1 agent was told explicitly
not to read or wait on the other, and neither did.

## The routing call that mattered, judged in hindsight

The wave split was made because `ADR-0002` deferred three seams to this decomposition and the
turn loop was one line against two unbuilt epics. Both premises held up:

- The Architect's SAN ruling created a **cross-epic ticket boundary over one file** (EPIC-002
  ships `toSan`, EPIC-003 adds `parseSan`). BA/PM could not have cut that boundary without the
  seam being closed first — it is a structure call, not a scope call.
- The System Analyst returned **eight** unresolved behaviours, two of them gating epic-level
  acceptance criteria. A solo BA/PM run would have cut tickets against criteria that were not
  testable, which fails the Definition of Ready at the epic level rather than the ticket level —
  the expensive place to find it.

Wave 3 was not planned at routing time. It exists because the decomposition itself invalidated a
premise in the `NFR-002` row that wave 1 had written, and BA/PM flagged rather than edited
another role's artifact. That flag working is the substrate behaving correctly, and the fix cost
one small subtask.

## The escalation chain worked in three steps, each refusing to overstep

`System Analyst → BA/PM → human` on the two blockers, and `Architect → human` on `ADR-0004`.
The System Analyst declined to invent a glyph-detection mechanism or a redraw model — correctly,
those are product calls. BA/PM ruled both, and escalated only the residue it could not own: an
ADR ratification, and one amendment that reduces a promise. Nobody manufactured a ruling to
unblock themselves, and no agent marked an ADR accepted.

Two promises are recorded as REDUCED in the epic's amendments (`2c` — no promise a replacement
glyph never appears; `4d` — the live frame no longer shows the whole move list). They are marked
as reductions in the epic rather than quietly rewritten. A human reading only the amendment
table will see them.

## Board state at close

`Ready` 3/8 — `ABC-011`, `ABC-012`, `ABC-014`. `Blocked` 1 — `ABC-013`, waiting on `ADR-0004`,
time-tracked, escalating 2026-08-01 per `blocked_escalation_days` = 2. `Backlog` — `ABC-015`
through `ABC-019` plus the `EPIC-002` epic row, annotated `decomposed: ABC-012..ABC-019`, which
matches what `EPIC-001` did. Eight ticket files written, eight traceability rows appended.

`ABC-011` was escalated `P2` → `P1` and promoted to `Ready` by BA/PM because its own recorded
escalation trigger fired verbatim — `ABC-012` is both the `ADR-0002` clause 2 history module and
the `positionCounts` supplier. That trigger was written on 2026-07-30 by the same role that
fired it, and it fired without anyone re-litigating the severity. Worth recording as evidence the
trigger convention pays for itself.

## What is NOT done, stated plainly

- **`ADR-0004` is `proposed`.** It blocks the merge of the first line of `src/san.ts`, hence
  `ABC-013`, hence `ABC-016`/`ABC-017`. One human ruling.
- **No code exists.** This task cut tickets; it wrote nothing under `src/`.
- **The `NFR-002` bounded-pane compute figure is `UNKNOWN - verify`** and cannot be closed until
  `ABC-013` ships, which is behind the same ADR ruling.
- **UAT for EPIC-002 is not addressable yet** — same reason EPIC-001's is deferred to EPIC-006.
- The five wave-1 System Analyst stop items that BA/PM did not need to rule on (SIGWINCH beyond
  the accepted cosmetic defect, stdin EOF, `NO_COLOR`, NFR-003 echo during the engine's turn,
  NFR-002's write half) stay open on their tickets. None blocks a `Ready` ticket.
