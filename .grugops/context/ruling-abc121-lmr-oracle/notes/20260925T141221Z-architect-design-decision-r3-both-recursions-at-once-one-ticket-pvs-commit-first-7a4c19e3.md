---
id: 20260925T141221Z-architect-design-decision-r3-both-recursions-at-once-one-ticket-pvs-commit-first-7a4c19e3
kind: decision
by: architect-design
at: 2026-09-25T14:12:21Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ABC-078
  - ABC-080
  - ADR-0026
  - NFR-005
  - 20260925T081016Z-architect-design-decision-r5-depth6-path-and-candidate-tickets-2ba4fca3
  - 20260925T140921Z-architect-design-observation-lmr-drift-order-dependence-and-depth7-nodes-8d25f0c6
supersedes:
---

# Ruling 3: both recursions at once, YES. Split into two tickets, NO. Build it as two commits, PVS first

Hand-authored, no `seal` (degraded posture per `AGENTS.md`).

## Both recursions in the same ticket: yes, as the ticket says

- **`src/engine.ts` is the product and `search()` is its oracle.** With PVS/LMR in only one of
  them, `ABC-078` `A3` compares two algorithms. That is the drift `ABC-080`'s ruling (`…f7e66060`,
  R1 point 3) exists to prevent.
- **The reduction rule is one exported pure predicate in `src/search.ts`**, called by both
  recursions (the `orderMoves` shape). It is the only new export that is not a door. Its name is
  the Engineer's.
- **The null-window / re-search control flow is copied code in each recursion.** Its guards are
  `A4` through both recursions and `ABC-078` `A3` on the `…WithoutReductions` pair (Ruling 1).

## Split PVS and LMR into two tickets: no

| | PVS alone | LMR, no PVS | PVS + LMR |
|---|---|---|---|
| cumulative nodes to depth 7 (kiwipete / position-6) | 1 640 040 / 1 452 406 | 580 389 / 755 013 | **532 363 / 467 461** |
| vs 3 s capacity (892 682 / 853 278) | **does not reach d7** | 1.54x / **1.13x** | **1.68x / 1.83x** |
| value | identical (0/190) | bounded (same drift as PVS+LMR) | bounded |

1. **PVS alone buys no ply.** A PVS-only ticket fails INVEST's *Valuable*: it delivers nothing
   the player or `NFR-005` can see.
2. **LMR without PVS is thin on position-6 (1.13x).** PVS is worth 1.6x on top of LMR there. So
   the two belong together, and neither half is the insurance R5 asked for.
3. **A split buys no test isolation the doors do not already give.** With
   `searchWithoutReductions` in the tree, PVS sits under every identity row by itself (Ruling 1).
   A second ticket would add one more DoR, build, QE, Security/NFR and UAT cycle, and UAT needs
   the owner's word because production lines change. No oracle gets sharper for that cost.

## Build order inside the ticket (a test note for BA/PM; the Engineer's to follow)

1. **Commit 1: the switches, the four doors, the re-pointing, and PVS in both recursions.**
   - The gate is green with **every pre-existing row unchanged**, and the Engineer lists the
     re-pointed rows.
   - It adds the new PVS identity link (`searchWithoutReductions` ≡
     `searchWithoutPvsOrReductions`).
   - QE can verify this commit alone. If a merged row goes red here, a door is not what it
     claims to be.
2. **Commit 2: the reduction predicate and LMR, plus `A1`–`A5`.**
   - Rolling back LMR means reverting this commit only.

## Size

This is BA/PM's call. The oracle work is real: four doors, two export-list widenings, and roughly
twenty re-pointed rows. It is mechanical, though, and needs no re-levelling. **It is NOT a reason
for `SPLIT_REQUIRED`.** If BA/PM re-sizes, the reason is this plumbing, not LMR.
