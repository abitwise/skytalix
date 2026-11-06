---
id: 20261106T201944Z-software-engineer-observation-cb124720
kind: observation
by: software-engineer
at: 2026-11-06T20:19:44Z
verified_by: 
confidence: high on the list; the depth-8 re-point is for the Architect to confirm
refs:
  - ABC-291
  - ADR-0075
  - EPIC-011
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - G1
  - G2
  - orch-2026-10-30a/20261105T141318Z-orchestrator-decision-69ee96e7
  - orch-2026-10-30a/20261106T192323Z-orchestrator-decision-40ef8351
  - arch-ABC-291-probe/20261105T141205Z-architect-design-decision-2926c26b
supersedes: 
seal: sha256:e95543bff862776417781bcb9e9901112d66cf132469908f98188a73b54895b1
---

# se-ABC-291 observation: K2 re-derived on this base: 64 rows against the probe's 58; the rows moved, old → new; the deep re-points and door joins

## K2's two lists
The patch without the cut, on `8e115110`, against `main`'s copy, default lane. `raw/out/k2-cand0.txt`, `raw/out/k2-list-groups.json`.

| group | at `cc6e64d1` | here | why it differs |
|---|---:|---:|---|
| 1 byte rows | 2 | 2 | red only without the cut. With it neither moves |
| 2 value rows | 2 | 2 | |
| 3 lost fixture | 1 | 1 | |
| 4 re-points | 26 | 25 | `ABC-283` (a) "iterations 1-4…" already reads `…WithoutQuietBundle` |
| 5 door joins | 14 | 21 | +7, `src/search.bundle.test.ts` `ABC-303` door rows |
| 6 switch sites | 13 | 13 | |
| **sum** | **58** | **64** | |

Four more `futilityNode` call lines stay green and wrong, as the probe said; here lines 275, 439, 440 and 710, the last moved from 698. They are edited.

## Pins moved, old → new (default lane)
- `src/engine.test.ts` `ABC-249`: f1e1 441 → 443, f1g1 520 → 522, title with them.
- `src/engine.test.ts` `ABC-282` A2 (c): e4d3 1 070 → 1 075.
- `futilityNode.length` 7 → 8.
- `tools/tune` emission row: 17 → 20 exports (K7).
- `QUIET_RULES`' source row gains `pawnShape: true`.

The two byte rows did not move. No zugzwang, mate-floor, `G1`, identity or relation pin moved.

## Lost fixture
`ABC-282` A2 (b), re-found by its own scan under `ADR-0028` d2, not re-pinned: decision note item 6.

## Deep lanes: re-points and door joins, under d4, figures unchanged
- `src/search.bundle.test.ts` "`ABC-303` — the bundle's own counts at depth 8", 2 rows: `search` and `chooseMove` → the off doors. No older door on the other side, so d4's clause does not name this row in so many words. `ABC-304` is the precedent: count rows re-pointed, figures unchanged. For the Architect to confirm.
- `src/engine.test.ts` `ABC-282` A0-1, 6 rows, and A0-2, 4 rows: the all-on figures → `chooseMoveWithoutPawnShape`. A0-1 keeps a relation on the shipped path: softMs absent and softMs 1 read one line.
- Door joins in the deep blocks: none beyond the default-lane lists.
