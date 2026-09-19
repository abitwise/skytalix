---
id: 20260919T080700Z-architect-design-claim-what-this-ruling-did-not-verify-6e1c9b25
kind: claim
by: architect-design
at: 2026-09-19T08:07:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-079
  - ADR-0024
  - NFR-005
  - NFR-008
  - NFR-004
supersedes:
---

# What this ruling did NOT establish

1. **Reached depth at 3 s with ordered quiescence.** Estimated from node counts only (kiwipete
   ordered d4 = 1.0M nodes at a loaded ~320k nodes/s ≈ 3.1 s; position-6 d4 = 1.66M): kiwipete 3,
   position-6 3, against `ABC-078`'s 4 / 3 and the shipped build's 2 / 2. Not run through
   `chooseMove`; the re-hop's `ENGINE_DEEP=1` records it.
2. **`NFR-008` after ordering.** The +19 s CPU came from the unordered multiplier through every
   existing search/engine test; ordered it should be a fraction, but it was not measured here and
   the machine was loaded (3.0–6.5) throughout. The 15 s level did not move and is not this
   ruling's.
3. **The 1.5x headroom on `A5`** is a judgement. The first legitimate evaluator change is the
   test of whether it was too tight.
4. **The shipped position-6 d4 cell (166.7x) is the Engineer's**; the probe reproduced the kiwipete
   d4 shipped cell (58 567 981 nodes, 1 540.33x) but its position-6 d4 shipped run had not finished
   when this note was written and is not claimed.
5. **The delta and SEE-lite columns are diagnostics**, one margin each, unordered against any
   puzzle count. They say what the next lever is worth, not that it is right.
6. **Behaviour under `searchWithoutPruning` with ordered quiescence** (the `SEARCH_DEEP` lane's
   cost driver) was reasoned, not measured: a full window at every leaf. The re-hop measures it.
