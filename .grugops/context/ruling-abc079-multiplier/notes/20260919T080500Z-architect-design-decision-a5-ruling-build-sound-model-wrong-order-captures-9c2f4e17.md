---
id: 20260919T080500Z-architect-design-decision-a5-ruling-build-sound-model-wrong-order-captures-9c2f4e17
kind: decision
by: architect-design
at: 2026-09-19T08:05:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-080
  - ABC-081
  - ABC-084
  - ABC-078
  - ABC-077
  - ADR-0024
  - ADR-0003
  - NFR-005
  - NFR-004
  - NFR-008
  - src/quiescence.ts
  - src/search.ts
  - src/engine.ts
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
  - memory-bank/50-decisions/ADR-0024-quiescence-cost-is-measured-and-captures-are-ordered-inside-quiescence.md
supersedes:
---

# Ruling on `ABC-079`'s tripped `A5`: the build is a sound stand-pat quiescence, the 2.5x model is wrong as an input, and the bound is missing its one lever — order the captures INSIDE quiescence

Overturnable on the same evidence: every number is from `../probe079.ts`, out-of-tree, re-runnable.
Full table in the sibling `observation` note; the reasoning and alternatives in `ADR-0024`.

## The ruling, in three sentences

1. **The build is NOT defective:** an independent textbook stand-pat quiescence written for this
   probe reproduces the shipped `quiesce` to the node (totals AND per-ply histograms) at depths 1–3
   on both benchmark positions, so the 702x–1 540x is a property of UNORDERED quiescence on
   capture-dense positions — the capture tree grows with capture ply (kiwipete depth 1: 75 nodes at
   ply 1, 14 851 at ply 8) and the cap of 8 is what holds it (13 730x / 20 871x uncapped).
2. **The model is wrong as an input:** `ADR-0003`'s 2.5x was a literature share-of-nodes figure for
   an ordered engine with a table and SEE, not a same-depth ratio, and no fix inside this ticket's
   fence reaches 4x on kiwipete — so `ADR-0024` supersedes that one input with measured figures and
   `A5` is re-stated at 1.5x the ORDERED reading, still a stop condition.
3. **The fix is in `ABC-079`, not `ABC-080`:** MVV-LVA ordering of the capture list inside `quiesce`
   is lossless (same score, same move, every cell) and brings kiwipete to 120x / 33x / 45x / 26x and
   position-6 to 6.3x / 17x / 8.3x / 7.5x at depths 1–4; it is ruled part of the horizon fix because
   it decides whether the capture tree is bounded, and `ABC-080` reuses the exported key.

## What the Engineer's re-hop must change (and nothing else)

1. `src/quiescence.ts`: sort the capture list MVV-LVA before the loop — victim value descending,
   attacker value ascending as the tiebreak, a capturing promotion ranked by victim plus promotion
   piece. Export the key (`move → number`, pure, stateless) for `ABC-080`. Correct the header's
   *"captures are searched in generation order"* line. Cap stays 8.
2. `src/quiescence.test.ts` `A5`: levels per `ADR-0024` decision 3 — kiwipete ≤ 180x (d1, default
   lane), ≤ 50x (d2), ≤ 70x (d3); position-6 ≤ 10x (d1), ≤ 26x (d2), ≤ 13x (d3). Measured ordered:
   120.2x / 33.2x / 45.0x and 6.3x / 17.4x / 8.3x. Still asserted; over the level = stop and
   report, not tune.
3. `src/engine.test.ts`: re-fixture the three RED cases (`A2` node bound, `A3` depth-2 premise ×2)
   against the ORDERED counts — kiwipete depth 1 is 5 888 nodes ordered, not 34 401; position-6
   depth 2 is 9 804, not 211 986. If `A2`'s 10 240 bound holds at 5 888 it stays as written.
4. Re-run and record: default lane green; `SEARCH_DEEP=1` on `src/quiescence.test.ts` AND on
   `src/search.test.ts` to completion (exit 0, counts, wall); `ENGINE_DEEP=1` to completion
   including the 50 ms case; `NFR-008` CPU and `N8-LANE` paired figures. `NFR-005`'s reached depth
   at 3 s on both positions REPORTED (expected: kiwipete 3, position-6 3 — `UNKNOWN - verify`).
5. `A1`–`A4`, `A6`: re-run, not re-argued; ordering is lossless so the verdicts should be
   unchanged, and a changed verdict is a finding to report.

## Dependency ruling

**`ABC-080` does NOT land first.** Its MVV-LVA arm becomes a reuse of `src/quiescence.ts`'s key
(one-line follow-up on its page and board row — BA/PM's, not gating). `ABC-081` unchanged.

## The three collateral rulings

- `searchWithoutQuiescence` test-only export: **IN** (same mechanism as `searchWithoutPruning`;
  the `A4`/`A5` door; rejected alternative: an options parameter on `search()`).
- Unabortable first iteration with depth-1 quiescence: **accepted bound once ordered** (5 888
  nodes on kiwipete, ~16 ms loaded), not an `ABC-078` regression to re-structure; the `ENGINE_DEEP`
  50 ms case must pass as written or be reported with the number.
- `SEARCH_DEEP` on `src/search.test.ts`: must read **exit 0 at its existing per-case timeouts**,
  counts and wall recorded. If the unpruned-oracle pair cannot meet 30 s ordered, that case's depth
  drops by one on kiwipete only, recorded; the timeout is not raised first.

## Fences honoured

Zero files under `src/` in this ruling's diff (probe out-of-tree, kept beside these notes).
`NFR-008`'s 15 s level, `AGENTS.md`, `plans/board.md` untouched. `NFR-005`'s human-ratified levels
not moved — their arithmetic input is corrected in `ADR-0024` decision 6 and the consequence is
stated for the owner.
