---
type: decision
role: software-engineer
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-040
at: 2026-10-17T11:50:00Z
sealed: false
refs: [ABC-040, ABC-028, ABC-029]
---

# How the two halves were done

- **ABC-028 — delete under `R3`.** Done only after the A2 check passed at repair time on the second
  `ABC-028` row (rows addressed by id + ordinal, never by line number).
- **ABC-029 — merge under `R4`, then delete.** Status = `live[:d] + stale[d:] + " **" + live[d:]` on
  stripped cells, with `d` re-derived. The original cell padding was kept, and cells 0–8 of the live
  row were not changed.
- **Comment block.** The 10-line `KNOWN DUPLICATE ROWS … NOT repaired` paragraph (incl. `APPEND TO THE
  FIRST OF EACH PAIR`) is replaced by one dated 7-line sentence. With no pairs left, the write-routing
  rule has nothing to route. The adjacent malformation paragraph (incl. `ABC-029 was repaired
  2026-08-12 and is CORRECT`) is untouched. It is stale per the 2026-10-12 re-score, but it is out of scope.
- **Commit split, so that A6 holds on the code commit.** The code commit `8d2e4f8b` touches only
  `plans/traceability.md` (three edits plus this hop's row). The ticket page's Delivery section and these notes are a
  separate docs commit, as the brief requires. Read A6's "exactly one file" against `8d2e4f8b`.
- Not touched: the `ABC-100` / `ABC-154` bare pairs and the non-10-cell rows (out of scope per the re-score).
