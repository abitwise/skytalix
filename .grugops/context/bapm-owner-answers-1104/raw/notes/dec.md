# bapm-owner-answers-1104 decision: the owner's answers folded into ABC-282, ABC-289 and EPIC-011 (ADR-0071 ACCEPTED, form (a); Q-3K-10 yes)

BA/PM, task `bapm-owner-answers-1104`, records only, on `grugops/bapm-owner-answers-1104` from `main` `7dd241cf`.
Nothing was run except the note seal and the records-path check. Pages are in `b9593f90`. Inputs: the owner's word as
the Orchestrator recorded it (`orch-2026-10-30a` `…7de79e90`: "Accept the W1 time-use design (ADR-0071); Q-3K-10:
yes") and the Architect's owed lines (`arch-owner-answers-1104` `…d6345b29` § 4). The Orchestrator accepted both
Architect judgment calls: F7 reads "accepted, not in force", and Q2 gets its own ADR amending d4.

## ABC-282 (W1): DoR 10/10, Ready, unchanged
- `adr:` → "ADR-0071 ACCEPTED 2026-11-04 (owner, OQ-0071-1, form (a), as written; orch-2026-10-30a …7de79e90). Not in
  force until this ticket merges on A6." This is the Architect's line, word for word.
- The merge sentence in the `bapm-ABC-282-adr` header → "It merges only on its read (A6). The owner accepted
  `ADR-0071` 2026-11-04."
- § Dependencies: the ADR bullet reads ACCEPTED, and the merge waits on A6 only. The old wording is kept in brackets.
  The `ABC-300` bullet gains "merged `4ea39135`" (QE PASS_WITH_GAPS `…fbda2ad6`), and QE-300-a is carried here. The
  `ABC-283` bullet gains the Orchestrator's hold: the page holds until `ABC-283` merges or misses.
- A new dated header block at the top lists these changes. No bar, row, size or priority moves.

## ABC-289 (Q2): DoR 9/10, Backlog, held (row 10 is still ❌)
- Hold 1, the owner's, is **lifted**: `Q-3K-10` answered yes. `ADR-0024` d4 is open for Q2's design only.
- **What still holds it:** (a) the Architect's re-measure on `main` with Q1 in it (`ADR-0024` § Status, the fourth
  block, item 2, under a sealed PREREG); (b) a new ADR, by `ADR-0069`'s pattern, that amends d4, and the owner's
  acceptance of it (reading (b) lets the build start on PROPOSED).
- Title → "… Held on the Architect's re-measure over Q1 and its ADR". `adr:` drops the owner's item. Its ADR item
  reads "a new ADR that amends ADR-0024 d4 (the Architect's call, ADR-0024 § Status, 2026-11-04)… it must show the
  nine items listed there."
- DoR row 5 → "`Q-3K-10` answered yes". DoR row 10 stays ❌; the d4 part is struck, and a dated line says it waits
  only on the re-measure and the ADR. F1 is struck through and marked moot. § Dependencies strikes `Q-3K-10`.
- A new dated header block sits at the top.

## EPIC-011
- § Owner questions: **OQ-0071-1** is struck through, answered (a), accepted as written; `ADR-0071` ACCEPTED, not in
  force until `ABC-282` merges on A6. **`Q-3K-10`** is struck through, answered yes; d4 is open for Q2's design only.
  A new dated header line reads "Open now: Q-3K-6, Q-3K-8, the `ADR-0067` d6 amendment and B-T8's re-confirmation,
  plus the Q-3K-1 wording row."
- The rows that named `Q-3K-10` as a hold each gain "held on the Architect's re-measure over Q1 and its ADR": § Phases
  row 3 (Q2), § Tickets row 41 and § Dependencies' `ABC-289` line. § Tickets row 34 gains "`ADR-0071` ACCEPTED
  2026-11-04" and `ABC-300` merged. A new top block lists these rows. The history headers stay as written.

## Judgments, flagged
- **J1. Four `ABC-282` lines go beyond the three owed lines, all stating the same facts.** Without them the page
  would contradict itself. They are: DoR row 5 (PROPOSED struck, ACCEPTED added, `ABC-300` merged); the line under
  the DoR ("A6 waits on `ABC-300`" gets a dated "merged" note); the § Dependencies ADR bullet; and scope 4's option
  (b) sentence (a dated "not taken; no follow-up owed"). The Architect wrote "the rest of the page is unchanged". I
  read that as "no other decision moves", not "leave stale facts".
- **J2. `ABC-289`'s `adr:` items are renumbered** (1) the re-measure and (2) the ADR, after the owner's item was
  dropped. The as-cut list of ADR contents (margin, exclusions, door names, the firing figure at 100 ms, the intent)
  is kept beside "the nine items".
- **J3. `ABC-289`'s file name keeps its as-cut slug** (`…-held-on-adr-0024-d4-and-a-re-measure.md`). Only the title
  changes. A rename would break the links to the page from the board, the epic and the trace. Renaming is the
  Orchestrator's call.
- **J4. `EPIC-011` § Phases row 5 (W1) is not touched.** Its last dated note still reads `ADR-0071` PROPOSED and
  names OQ-0071-1. That row was not in the owed list. The new top block and row 34 carry the acceptance. If the
  Orchestrator wants the row updated as well, it is a one-line dated note.

## Not done here (fences)
The board, the ADRs and `src/` are untouched, and so are `ABC-271` and `ABC-283` (QE is on them). The Q2 slot and the
board cards are the Orchestrator's.
