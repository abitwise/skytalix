# ABC-021 — board history

> **Relocated from `plans/board.md` on 2026-08-10 by the Orchestrator.** The board had grown to
> 549,833 characters, 97% of it per-hop transition narrative. This file holds every board entry
> written about `ABC-021`, **verbatim** — only the surrounding `<!--` / `-->` HTML-comment delimiters
> were removed so the text renders. Nothing was rewritten, summarised or dropped, and none of it
> is duplicated back on the board.
>
> Ticket: [`ABC-021-draw-claim-interaction.md`](../ABC-021-draw-claim-interaction.md)

Entries appear in the order they stood in `board.md` (newest first, as the board was written).

---

## Backlog (WIP unlimited) — column note

AMENDED 2026-07-31: a NINTH EPIC-002 ticket, ABC-021 (draw-claim interaction, S, 2 points), was cut
  under the owner's legality-first directive, taking this epic to 9 tickets / 25 points. The largest
  is still L, so there is still no SPLIT_REQUIRED and the epic's XL size is unchanged. ABC-020 was
  cut in the same step but belongs to EPIC-001, not here — it changes src/gameend.ts, which is the
  rules core. See the re-sequencing comment under Ready.

  EPIC-002 DECOMPOSED 2026-07-30 by BA/PM (task `epic-to-tickets-EPIC-002`, Workflow 03) into
  ABC-012..ABC-019 — 8 tickets, 23 points. Epic size corrected M -> XL in-file with the reason,
  exactly as EPIC-001 recorded its own L -> XL correction; the no-XL rule binds TICKETS, and the
  largest here is L, so there is NO SPLIT_REQUIRED. The epic ROW STAYS IN BACKLOG carrying a
  `decomposed:` annotation — that is precisely what EPIC-001 did on 2026-07-22, and it left Backlog
  only on 2026-07-24 when all seven of its tickets were merged. An epic row is a container; it exits
  Backlog for Done when its tickets are Done. The Backlog exit BA/PM actually owns and has taken
  today is the TICKET-level one: Backlog -> Ready for ABC-012, ABC-014 and ABC-011.

  ABC-015..ABC-019 meet the Definition of Ready in full. They are held in Backlog because each has
  an unbuilt PREDECESSOR TICKET, not because anything about them is unresolved — they are NOT
  Blocked-column blocked, and BA/PM promotes each as its `blocked-until` list clears. Same pattern
  ABC-004..007 used.

  CORRECTED 2026-08-08 by BA/PM at ABC-015's promotion: "meet the Definition of Ready IN FULL" was
  NOT true of ABC-015 — two acceptance defects were found at the Backlog exit and fixed before it
  moved (an input tuple with no stated output; a criterion no implementation could fail). The
  sentence is left standing because it records what was believed on 2026-07-30; read it as the
  decomposition's claim, not as a current verdict. ABC-016..ABC-019 were NOT re-checked here — this
  subtask promoted one ticket and does not vouch for the other four.

  Two of this epic's four acceptance criteria were AMENDED before these tickets were cut, because
  wave 1 established they could not be met as written and an untestable criterion fails the
  Definition of Ready for every ticket beneath it. Both amendments are recorded in place in
  plans/epics/EPIC-002-terminal-board-and-game-loop.md with what changed and whether a promise was
  reduced (it was, twice, and both are marked REDUCED rather than softened quietly).

---
