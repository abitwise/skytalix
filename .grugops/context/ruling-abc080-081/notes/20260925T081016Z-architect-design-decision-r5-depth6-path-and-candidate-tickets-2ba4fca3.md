---
id: 20260925T081016Z-architect-design-decision-r5-depth6-path-and-candidate-tickets-2ba4fca3
kind: decision
by: architect-design
at: 2026-09-25T08:10:16Z
verified_by:
confidence: medium
refs:
  - NFR-005
  - NFR-004
  - ABC-080
  - ABC-081
  - ADR-0024
  - ADR-0003
  - ADR-0025
  - 20260925T080416Z-architect-design-observation-depth-in-3s-per-lever-29d67423
  - .grugops/context/wave-2026-09-24/notes/20260925T104000Z-orchestrator-decision-36b66fbd.md
supersedes:
---

# Ruling 5 — the depth-6 path: `ABC-080` + `ABC-081` reach the floor on the M3; PVS + LMR is the margin and the depth-7 answer

Hand-authored, no `seal` (degraded posture per `AGENTS.md`). **`NFR-005` is not re-leveled.**
The owner's word keeps the depth-6 floor, and nothing here argues with it.

## The 3.6x arithmetic is superseded by measurement

BA/PM's reading took the tickets' written BARS (≤ 40% and ≤ 70%) as their EFFECTS. Measured:

- **Ordering** cuts fixed-depth-4 nodes to 2.1–2.6%, which is ~40x, not 2.5x.
- **The table plus the hash move** cuts ID nodes to 50–63%.
- **Iterative deepening** reuses each iteration's best move, which a bar at fixed depth does not
  see.

Measured depth completed within 3 000 ms, cumulative ID, M3, loaded (observation `…29d67423`):

| step | kiwipete | position-6 | size (pts) | depth gained | depth per point |
|---|---|---|---|---|---|
| today | 3 | 3 | — | — | — |
| **`ABC-080`** ordering | 5 | 5 | M (3) | **+2** | **0.67** |
| **`ABC-081`** table + hash move, on top | **6** (1.93x margin) | **6** (1.51x margin) | M (3) | +1 | 0.33 |
| **C1 — PVS + LMR** (candidate), on top | **7** (1 783 ms) | **7** (1 444 ms) | S–M (2–3) | +1 | 0.33–0.50 |
| C2 — null move (candidate), on top of C1 | 7 (d8 4 287 ms) | 8 (1 962 ms) | S (2) | +0 / +1 | ~0.25 |
| C3 — pseudo-legal search, `ADR-0003` (c1) (candidate) | `UNKNOWN - verify` | `UNKNOWN - verify` | M (3) | est. +0.5 to +1 | est. 0.2–0.3 |
| C4 — fused leaf (candidate) | +0 (4–12% time) | +0 | XS (1) | 0 | 0 (margin only) |
| PVS alone | +0 (−7% to −9% nodes) | +0 | — | 0 | fold into C1 |
| budget | fenced: `NFR-004` 3 s is the owner's | — | — | — | — |

Ranked by depth per point: **`ABC-080` (0.67) > C1 (0.33–0.50) ≥ `ABC-081` (0.33) > C3 (est.) >
C2 (~0.25) > C4 (0).** `ABC-081` ranks below C1 on depth alone. It is still owed first: C1's LMR
leans on the hash move for its re-search ordering, and in-tree repetition is a correctness
requirement (`ADR-0002`), not an optimisation.

## What the path needs, answered plainly

1. **For the depth-6 FLOOR: `ABC-080` then `ABC-081`, and nothing else on this machine.**
   The margin is thin on position-6 (1.51x). The real table will be typed arrays rather than the
   probe's `Map`, which should help. Under vitest, where QE measured one ply shallower than plain
   node, 1.5x may not hold. **That is the risk C1 insures.**
2. **For the depth-7 WARN level (PROVISIONAL): C1 (PVS + LMR).** It reaches 7 on both positions
   with 1.7x–2.1x margin in the probe.
3. **Sequence:** `ABC-080` → `ABC-081` → C1. C2 only if C1's margin measures thin. C3 and C4 are
   margin work, to cut only if a later `NFR-005` reading needs them.

## Candidate tickets for BA/PM to cut (names only; criteria are BA/PM's)

- **C1 — Principal-variation search with late-move reductions.** PVS null-window re-search. LMR
  reduces one ply on quiet, non-checking moves at index ≥ 3 and depth ≥ 3 (the probe's
  parameters), and re-searches at full depth on a fail-high.
  - **NOT value-preserving**, so an identity-with-`search()` criterion is wrong for it. It needs a
    game-quality criterion instead, for example the tactical suite `ABC-084` names, or a bounded
    score drift against the unreduced search.
  - Depends on `ABC-080` and `ABC-081`.
- **C2 — Null-move pruning (R = 2).** Guarded: not in check, side to move has non-pawn material,
  never two null moves in a row. Zugzwang is the known failure; the guard is the probe's own.
  Not value-preserving. Depends on C1.
- **C3 — Pseudo-legal full-width search** (`ADR-0003` clause 3 (c1)). `ADR-0003` measured 2.6x on
  the perft path. It was **not re-measured on the search here** (`UNKNOWN - verify`); at the
  measured branching of 2.1–4.7 per ply, that is roughly half to one ply. `ADR-0003` notes it
  argues for `ABC-009` first (phantom castle reachable from the search path).
- **C4 — Fused leaf.** `leafScore` generates legal moves once and passes them to the capture
  search. Value-identical (nodes and scores match `search.ts`), XS. Worth 4–12% of time, no ply.
