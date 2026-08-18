---
id: 20260818T092000Z-architect-design-artifact-ref-adr-0012-and-what-was-not-edited-b6d270f1
kind: artifact-ref
by: architect-design
at: 2026-08-18T09:20:00Z
verified_by: 
confidence: high
refs:
  - ADR-0012
  - NFR-004
  - ABC-078
  - ABC-095
supersedes: 
---

# The artifact, and the exhaustive list of what this hop wrote and did not write

## Scope

**Written by this hop, and nothing else:**

- `memory-bank/50-decisions/ADR-0012-book-engine-composition-point.md` — status **`proposed`**, the
  ADR-template sections (Status / Context / Decision / Alternatives / Consequences / Rollback), nine
  numbered clauses in this directory's house style.
- The three notes in this folder.
- The queue claim directory `.grugops/queue/claimed/design-engine-seam-composition-2026-08-18/`,
  taken by a bare `mkdir` per Workflow 17 and `AGENTS.md`. It did not pre-exist.

**Deliberately NOT written, each with its reason:**

- **`src/` — 0 files.** Instructed, and correct regardless: an ADR adds zero production lines.
- **`plans/nfr-catalog.md` — not edited.** No target, bar, level or verification instrument moves.
  `NFR-004`'s row is `EPIC-004`'s, and `ABC-095` already carries the consumed-not-owned bars
  (≤ 30 ms on a hit, ≤ 5 ms miss overhead). A row for a decision that measures nothing would be the
  gold-plating this catalog's own rules refuse.
- **`plans/traceability.md` — not edited.** No ticket changed column, no code or test row moved, and
  the ADR is `proposed`. There is nothing verified to record; a row asserting a link to an
  unratified decision would overstate it.
- **`plans/tickets/ABC-095…` — not edited.** Its DoR is BA/PM's pen, by instruction. My reading of
  what it becomes is in this hop's `observation` note, offered rather than applied.
- **`plans/tickets/ABC-078…` — not edited.** Its `A6` needs no change; its stale `## Dependencies`
  prose is recommended to BA/PM.
- **`plans/board.md` — not edited.** No ticket moved column at this hop; `ABC-095` is still in
  `Backlog` and blocked on `ABC-078`.
- **`.grugops/test-skips.md` — human-owned; not written.**
- **No `kind: finding` and no `§14-gate#<id>` stamp** anywhere. `context.human_admission` is `off`.

## Risks

- **The ADR is `proposed`, and an agent may not ratify it.** By `ADR-0009`'s own accepted test — no
  target moved, no level set, zero production lines — nothing would be owed a signature; it is left
  `proposed` anyway because it binds the ticket shape of three epics and this project's standing
  rule is that a human ratifies. Do not quote it as accepted until the owner has said so.
