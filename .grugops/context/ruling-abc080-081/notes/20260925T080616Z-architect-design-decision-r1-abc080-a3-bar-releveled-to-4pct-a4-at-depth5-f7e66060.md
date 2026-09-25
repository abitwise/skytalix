---
id: 20260925T080616Z-architect-design-decision-r1-abc080-a3-bar-releveled-to-4pct-a4-at-depth5-f7e66060
kind: decision
by: architect-design
at: 2026-09-25T08:06:16Z
verified_by:
confidence: high
refs:
  - ABC-080
  - ADR-0024
  - NFR-005
  - 20260925T080216Z-architect-design-observation-ordering-probe-a3-a4-kiwipete-position6-e18c1093
supersedes:
---

# Ruling 1 — `ABC-080` DoR item 10: `A3`'s bar is re-leveled from ≤ 40% to ≤ 4%, and `A4` reads at depth 5

Hand-authored, no `seal` (degraded posture per `AGENTS.md`).

**Measured, not assumed** (sibling observation `…e18c1093`). This is `ABC-080`'s full comparator
(MVV-LVA + killers; the hash arm is dormant with no table) against the unordered search, at
fixed depth 4:

- kiwipete: 26 175 / 990 122 = **2.64%**
- position-6: 34 885 / 1 663 808 = **2.10%**
- Scores are identical (50 / 30).

## Decision

1. **`A3`'s bar becomes ≤ 4% on each of kiwipete and position-6 at depth 4.** That is 1.5x the
   larger reading (2.64% × 1.5 = 3.96%), the same headroom rule as `ADR-0024` decision 3. Node
   counts are deterministic, so the headroom absorbs legitimate evaluator changes, not noise. A
   build that loses most of its ordering reads 10x–40x over the level, and that is what the bar
   must catch. `≤ 40%` would pass a comparator that had silently stopped ordering captures,
   provided it still ordered something. **Report the actual figure, as the criterion already
   says.**
2. **`A4` is read at depth 5 on BOTH positions, in addition to kiwipete depth 4.** The delete
   rule ("a heuristic whose configuration does not reduce the node count is a candidate for
   deletion") is judged on the depth-5 reading.
   - At kiwipete depth 4, killers read −0.2%, which would falsely condemn them.
   - At depth 5 they read −5.7% (kiwipete) and −20.5% (position-6).
   - The hash-move configuration needs a table, so it stays "not yet measurable" until `ABC-081`
     lands, as the ticket already provides. Measured with a prototype table: −14% at d4, −12%
     to −19% at d6.
3. **The ordering goes into BOTH recursions** (`src/search.ts` and the abortable copy in
   `src/engine.ts`). The engine is the production path `A7` measures. `search()` is the identity
   oracle `ABC-078`'s `A3` holds the engine to. Ordering one without the other makes that sweep
   compare two algorithms.
   - Ordering alone flipped 0 of 48 root moves against `search()`, so this is safe. The one flip
     the probe saw came from the hash move (`ABC-081`'s ruling).
4. **`G4`** (the unguarded promotion term in `mvvLvaKey`, routed here by BA/PM) is unchanged:
   still a test-notes addition for `A4`, not a criterion.

**Item 10 is discharged by measurement.** The bar is now set from this codebase's own reading,
which is what the item asked for. BA/PM owns the ticket's wording. The ticket page § Ruling
carries the numbers.

**Not moved:** `NFR-005`'s levels, `A7`'s non-decreasing-depth floor, and `N8-LANE`'s shape.
The unordered d4 comparator costs 3.4 s (kiwipete) plus 5.5 s (position-6) in one process, so it
belongs in the opt-in deep lane the ticket already names.
