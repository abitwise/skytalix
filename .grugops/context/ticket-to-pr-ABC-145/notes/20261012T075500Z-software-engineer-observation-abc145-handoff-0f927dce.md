---
id: 20261012T075500Z-software-engineer-observation-abc145-handoff-0f927dce
kind: observation
by: software-engineer
at: 2026-10-12T07:55:00Z
verified_by:
confidence: high
refs:
  - ABC-145
  - ADR-0037
  - QE-093-b
  - NFR-008
  - plans/tickets/ABC-145-the-book-compiler-stamps-its-source-commit-and-never-checks-the-source-bytes.md
supersedes:
---

# SE `ABC-145`: hand-off, and one count in the ticket that does not match the file

This note is hand-authored and unsealed. No §14 gate verdict exists on this install, so it carries no `sha` / `gate_run` / `content_hash` triple.

- **The ticket says "the 9 existing `it` blocks"; the base file holds 10.** At `main`, `book.test.ts` has
  9 `it(` calls and one `it.each(defects)` over 8 rows: 10 blocks, 17 tests. The fence's intent (no
  existing block changed) is met for all 10. The count in the ticket's prose is not corrected here (ticket
  prose is BA/PM's).
- **`A6` is read at the code commit `7be28bf9` (`main..7be28bf9`), not at the branch tip.** The docs commit
  on top adds the state-plane paths the subtask requires (these notes, `plans/traceability.md`, the ticket's
  § Delivery). Read literally at the tip, `A6`'s "subset of 3" and "0 new files" would fail on those. QE
  should read the fence on the code commit, or rule otherwise.
- **Owed after merge, not in this diff:** the Scribe's one-line update to
  `memory-bank/90-agents-md-command-log.md` (the `QE-093-b` trap line), per ticket § Out of scope.
- **Owed before `Done`:** the QE hop. `NFR-008` is a count pin (0 files / +2 tests / 0 spawns), read above;
  no timing bound is written.
- Recommended board move: `In Development` → `In Review` (the Orchestrator owns `plans/board.md` this
  wave).
