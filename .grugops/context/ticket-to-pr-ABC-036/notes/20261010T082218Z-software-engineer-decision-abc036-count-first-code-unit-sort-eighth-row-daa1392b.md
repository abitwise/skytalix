---
id: 20261010T082218Z-software-engineer-decision-abc036-count-first-code-unit-sort-eighth-row-daa1392b
kind: decision
by: software-engineer
at: 2026-10-10T08:22:18Z
verified_by: 
confidence: high
refs:
  - ABC-036
  - ABC-035
  - ABC-033
  - EPIC-003
  - ADR-0004
  - src/command-input.ts
  - src/command-input.test.ts
  - .grugops/context/rescore-batch-2026-10-10/notes/20261010T081343Z-ba-pm-decision-six-ticket-rescore-three-ready-four-rulings-owed-973fd389.md
  - .grugops/queue/claimed/ticket-to-pr-ABC-036/ticket-to-pr-ABC-036.md
supersedes: 
---

# `ABC-036`: implementation decisions for `moves`

Hand-authored, no seal (degraded posture, `AGENTS.md`). Subtask `ticket-to-pr-ABC-036`, branch
`grugops/ABC-036-moves-command` from `85eb80c`, code commit `6aad5c9`. Any of these the
Orchestrator or QE may reverse; each is one line of code.

1. **The count item reads `legal moves: <n>` and is the FIRST message item** (test note 6). The
   colon form avoids a singular/plural branch: one legal move is common when in check, and
   `1 legal moves` would be wrong. It is at most 16 columns (218 moves max), inside the
   18-column narrowest frame, so it is always placed whole.
2. **"Ascending SAN-string order" is read as code-unit order** (`Array.prototype.sort()` with no
   comparator). Two readings exist. Code-unit order is identical on every machine and puts piece
   moves before pawn moves (`Na3` < `a3`). A locale-aware compare (`localeCompare`) would put
   `a3` first, and its order could vary by locale. The start position's full 20-token order is
   pinned by a test row, so a switch to locale order reds it. **Flagged, not silently picked:**
   if the product wants alphabetical-ignoring-case, that is a one-line change plus that row.
3. **`moves` is the LAST (eighth) row of `COMMAND_TABLE`.** `A7` states the order of the table
   matters, and the `ABC-035 A7` rows are green and unedited with it last.
4. **The production default is `deps ?? { legalMoves, toSan }`, local to the module.**
   `move-input.ts`'s `PRODUCTION_DEPS` is not exported, and `A6` keeps that file byte-identical.
   Through the seam both calls can be spied (`A4`). A second test row asserts the production
   path (no seam) makes exactly one module-level `legalMoves` call at the start position, where no
   move gives check. That shows the default also passes the list.
5. **`moves` is NOT added to `TOKEN_SPELLINGS`.** `ABC-035 A2` asserts zero `legalMoves` calls
   for every line in that list ("classification asks the position nothing"). `moves` derives by
   contract, so that row would be wrong for it. `moves` has its own tolerance rows under the same
   rule: four accepted spellings, five refused (`move`, `movess`, `mo`, `moves e4`, `moves 2`).
6. **`ABC-035 A4`'s foreign-token row is RETIRED.** It asserted `moves` absent from the table.
   By precedent (`resign` at `ABC-045`, `new` at `ABC-046`, `undo` at `ABC-102`) a token
   leaves that list when its ticket adds it. `moves` was the last entry. The list would be empty,
   so the loop is removed and its comment says why. The positive half (every table token is in
   `help`) now covers `moves`.
7. **`A1` runs all six `PERFT_SUITE` positions** (the start position plus five mid-games; the
   criterion asks for three or more). The published perft depth-1 count is a second anchor beside
   `legalMoves(position).length`. The FENs are copied: `PERFT_SUITE` is not exported, and
   `src/perft.test.ts` is outside this ticket's files.
