---
id: 20260819T172000Z-ba-pm-artifact-ref-what-this-hop-wrote-and-what-it-refused-5e6f7a8b
kind: artifact-ref
by: ba-pm
at: 2026-08-19T17:20:00Z
verified_by:
confidence: high
refs:
  - ABC-043
supersedes:
---

# What this hop wrote, and what it deliberately refused

## Written

`plans/tickets/ABC-043-the-live-session.md` only:

- `## Dependencies` — rewritten; all three blockers discharged with the file that discharges each.
- `## Scope` — two composition constraints: the merged `createEngine` at `DEFAULT_BUDGET_MS` (no new
  number, no new flag), and `createLineInputSeam`'s single-caller precondition (`G6`).
- **New** `## The ruling on `A5` and `A2`'s testability` — the ruling, the measured mechanism, the two
  refused shapes, three limits, and the named real-engine coverage gap.
- `A2` and `A5` — one clarifying sentence each. **No criterion loosened; both discriminating
  requirements restated as they were.**
- `## Security / NFR triggers` — a new `N8-SPAWN` row (7 forced children, derived criterion by
  criterion) and a refreshed `NFR-004` line.
- `## Test notes` — five → eight; note 5's stale spawn budget struck with its reason.
- `## Definition of Ready` — a dated re-score **beside** the cut-hop table, which is left whole.

## Refused

- **No new ticket.** The ruling did not need one; the one thing that would have justified one — a
  production fault-injection surface — was refused on its merits.
- **`[D31]`'s `EPIC-006` half left alone**, as briefed. It is ruled on the page and is `ABC-043`'s to
  build.
- **No `src/` file, no board column, no ADR, no merge, no deploy.** `ADR-0011` clause 4 and `ADR-0013`
  read only.
- **No `plans/traceability.md` row** — no ticket was cut and no requirement linkage changed.
- **10/10 on the DoR**, which was available on the discharged blockers alone and would have hidden the
  lane question.
