# ABC-013 — board history

> **Relocated from `plans/board.md` on 2026-08-10 by the Orchestrator.** The board had grown to
> 549,833 characters, 97% of it per-hop transition narrative. This file holds every board entry
> written about `ABC-013`, **verbatim** — only the surrounding `<!--` / `-->` HTML-comment delimiters
> were removed so the text renders. Nothing was rewritten, summarised or dropped, and none of it
> is duplicated back on the board.
>
> Ticket: [`ABC-013-san-rendering.md`](../ABC-013-san-rendering.md)

Entries appear in the order they stood in `board.md` (newest first, as the board was written).

---

## Blocked (visible, time-tracked) — column note

CLEARED 2026-07-31 by Architect/Design (subtask `architect-adr0004-ratify`): ADR-0004 is
  `accepted`, so ABC-013's single blocker is gone and it moved to Ready (see the Ready comment for
  why Ready and not Backlog). Blocked time: 2026-07-30 -> 2026-07-31, ONE day against
  `blocked_escalation_days: 2` — it never escalated. First entry to and first exit from this column
  in the project's history; the Blocked convention worked exactly as written, which is worth one
  line in plans/metrics.md when the next sweep runs.

  HOW it was ratified matters and is not what the paragraph below anticipated. ADR-0004 was ruled on
  by the ORCHESTRATOR under an explicit, quoted delegation from the project owner Olger Oeselg dated
  2026-07-31 ("I will give ADR-0004 ownership to you, you can decide if changes are needed or it can
  be scrapped") — NOT by a human directly. It is the FIRST ADR in this project ratified that way, it
  is explicitly NOT precedent, and the delegation was specific to ADR-0004 by name. The standing rule
  that no agent may mark an ADR accepted is unchanged for every other ADR. The last line of the
  paragraph below — "this is the same ruling on the same kind of artifact" — is therefore CORRECTED
  rather than fulfilled: same kind of artifact, different kind of ruling.

  The ruling accepted clauses 1 and 3 as proposed and AMENDED clause 2. The amendment lands on
  EPIC-003's `parseSan` (a discriminated result that keeps `ambiguous` and `rejected` distinct, plus
  the move-identity invariant), not on ABC-013's `toSan` — so ABC-013's scope, size, priority,
  acceptance criteria and NFR bars are all unchanged by it.

  As written 2026-07-30, when the ticket entered this column:
  ABC-013 is the FIRST ticket this project has put in Blocked, and it is here rather than in Ready
  on purpose. It meets every other Definition-of-Ready check; what it fails is "no major unresolved
  blocker". ADR-0004 (SAN ownership) says of itself that it does NOT block cutting tickets but DOES
  block "the merge of the first line of src/san.ts", because that is the point at which the decision
  becomes expensive to reverse. A ticket in Ready is pullable, and pulling this one would produce
  code that cannot land — so it sits in Blocked, visible and time-tracked against
  `blocked_escalation_days: 2`, rather than buried in a dependency line where the human ruling it
  needs would be invisible.

  Ratification alone clears it. ADR-0002 and ADR-0003 were each ratified in session by a named
  human on 2026-07-30; this is the same ruling on the same kind of artifact.

  ABC-016 and ABC-017 depend on ABC-013 and therefore inherit the wait. They are in BACKLOG, not
  Blocked: their blocker is a ticket, not a decision, and duplicating one decision across three
  Blocked rows would make the column lie about how many human rulings are outstanding. There is
  exactly one.

---
