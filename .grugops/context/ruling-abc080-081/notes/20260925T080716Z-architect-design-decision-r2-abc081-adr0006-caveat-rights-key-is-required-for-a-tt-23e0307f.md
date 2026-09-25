---
id: 20260925T080716Z-architect-design-decision-r2-abc081-adr0006-caveat-rights-key-is-required-for-a-tt-23e0307f
kind: decision
by: architect-design
at: 2026-09-25T08:07:16Z
verified_by:
confidence: high
refs:
  - ABC-081
  - ADR-0006
  - ADR-0020
  - EPIC-004
  - 20260925T080516Z-architect-design-observation-castling-pairs-subtrees-and-memory-baseline-30cea5d2
supersedes:
---

# Ruling 2 — `ABC-081` DoR item 5a: `ADR-0006` stands unchanged; for a transposition table the rights key is not merely safe, it is REQUIRED

Hand-authored, no `seal` (degraded posture per `AGENTS.md`).

**The answer is "unchanged"**, so by the ticket's own terms `ABC-081` proceeds as written and
`ABC-075` does not change. `src/zobrist.ts` is not touched. `ADR-0006` gains a dated amendment
section recording the answer. That section is an amendment, not a re-opening: no clause of its
Decision changes.

**Why the answer is stronger for the table than it was for repetition.** `ADR-0006` argued about
repetition, where "same position" means the same position **now**. There it called
over-discrimination "the safe error direction": a missed draw, never a false one. A table entry
stores the value of a **subtree**, and the subtree's legal moves depend on the castling
**rights**, because a right that is blocked now can become usable a few plies later.

Measured on `ADR-0006`'s own pair `knight-g1`: identical placement, side to move and current move
list (15 / 15), different right. Perft 3 reads 1 335 vs 1 320, and `search` reads 850 vs 830 at
depth 3 and 830 vs 820 at depth 4. A key that hashed availability would collide the two, and the
table would return a **wrong score**, not a miss. So for `EPIC-004` hashing rights is the only
sound key, not a conservative choice.

**What the table inherits, restated honestly.** On pairs where the unusable right can never
become usable (`ADR-0006`'s in-check and f1-attacked pairs read identical subtrees at d4), the
two positions sit in different entries. That wastes a probe and is never a wrong answer. The
cost is unmeasured, and no measurement is owed: no probe here found a case where it matters.

**Falsifier added to `ADR-0006`** (row `G6`): a TT-keyed search reporting a score for a position
that differs from the table-off search at the same depth, on a pair differing only in castling
rights. It is checked by `ABC-081`'s own `A1` (table on vs off, identical scores).
