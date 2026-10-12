---
id: 20261012T064122Z-ba-pm-decision-addendum-after-rebase-t2-hang-bound-ruled-pointer-made-24c9cf99
kind: decision
by: ba-pm
at: 2026-10-12T06:41:22Z
verified_by:
confidence: high
refs:
  - ABC-116
  - ADR-0017
  - 20261012T063922Z-ba-pm-decision-fold-qe-145-117-148-116-cut-153-two-accepted-a2f37f6d
  - .grugops/context/design-2026-10-12-fold/notes/20261012T063636Z-architect-design-decision-t2-does-not-fire-on-a-hang-bound-change-14514376.md
  - plans/tickets/ABC-116-record-the-t2-re-measure-trigger-where-a-hop-will-meet-it.md
  - plans/nfr-catalog.md
  - plans/traceability.md
supersedes:
---

# Addendum after rebase: the hang-bound `T2` question is now ruled (does not fire), and the catalog pointer is made. No BA/PM decision changes

This note is hand-authored and unsealed. It adds to `…a2f37f6d` and supersedes nothing.

- **Why it exists:** while this hop ran, `main` moved from `d8794608` to `9bdd7fd3`. The Scribe merged
  at `684aa694` and the Architect at `9bdd7fd3`. The branch was rebased onto `9bdd7fd3`.
  - The only conflict was the append order at the END of `plans/traceability.md`. It was resolved by
    keeping every row: the Scribe's and the Architect's first, then this hop's two.
  - No file this hop edits was touched by either of the other hops.
- **Item 7, `T2` hang bound:** ruled by Architect/Design. It does **not** fire `T2` (`ADR-0017`
  § Addendum 2026-10-12 A1, `…14514376`).
  - This hop's routing said "if not, nothing on this page changes". A dated line on `ABC-116`
    records that this is now the case. The canonical `N8-SPAWN` row form keeps its four spellings.
  - BA/PM owes nothing further on it.
- **Item 6, `P3`:** the catalog pointer edit is made, which is the demotion trigger's first event. The
  second has not happened. A dated line on `ABC-116` says the trigger still has not fired. NOT `P3`
  stands.
- **Unchanged:** every other decision in `…a2f37f6d`, `ABC-153`, and the recommended board moves.
