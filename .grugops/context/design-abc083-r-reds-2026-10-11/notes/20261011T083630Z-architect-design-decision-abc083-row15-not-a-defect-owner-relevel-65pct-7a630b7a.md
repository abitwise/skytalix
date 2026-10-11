---
id: 20261011T083630Z-architect-design-decision-abc083-row15-not-a-defect-owner-relevel-65pct-7a630b7a
kind: decision
by: architect-design
at: 2026-10-11T08:36:30Z
verified_by: 
confidence: high
refs:
  - ABC-083
  - ABC-080
  - ADR-0028
  - ADR-0024
  - ADR-0039
  - memory-bank/50-decisions/ADR-0039-abc083s-two-r-reds-are-not-defects-the-owner-re-levels-them-and-an-r-red-is-not-a-cut-trigger.md
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-stop-two-class-r-levels-and-puzzle-red-e3f81b07.md
  - src/search.ordering.test.ts
  - .grugops/context/ticket-to-pr-ABC-083/probe/r15.out.jsonl
supersedes: 
seal: sha256:2f9e5f751e8c84f8b9680f83842f9984aa55e46b40115b64db711f80a068dc94
---

# Row 15 (`ABC-080` `A3` default-lane guard, position-6 d2): a level, not a defect. The owner re-levels it: ≤ 40.5% → ≤ 65% (`ADR-0039`, proposed)

Recorded through `context-io.js` `appendNote` (sealed and admitted, no stamp). A decision, not a finding. No reading was taken at this hop.
The evidence is the build's committed probe (`r15.out.jsonl` on `fa81b948`).

- **Class: level (R).** No row label depends on an evaluator margin, so `ADR-0028` decision 2 does not apply.
- **`ADR-0028` d4 applies.** The 40.5% already is 1.5x of the 27.0% recorded at `ABC-080`'s tip (the
  `ADR-0024` d3 rule, as written in the test). No second automatic headroom is allowed.
- **Not a defect.** Proof 1 holds: `ABC-080` `A1` keeps equal scores in every cell, and the identity and oracle
  rows are green. Proof 2 holds by mechanism:
  - only `src/evaluate.ts` changed;
  - the bare d2 tree stays at 136 nodes;
  - the growth (2 429 → 3 871) is quiescence below that tree, at the stand-pat seam.

  The criterion's own reading (d4, `SEARCH_DEEP`) is green: 1.82% / 2.48% against ≤ 4%.
- **Not re-pinned by an agent.** `ADR-0028` d4 makes the re-level the owner's word, and accepting `ADR-0039` is that
  word. **Recommended level: ≤ 65%** (43.56 × 1.5, rounded down).
- **Proof 3:** the no-ordering mutant reads 100% by construction. The exact `A4` d2 pins (8 887 / 4 419 / 3 871)
  catch a partial loss.
- **Conditions:**
  - only on a build that ships mobility;
  - in its own commit, on the rebased branch;
  - with the row re-read.
