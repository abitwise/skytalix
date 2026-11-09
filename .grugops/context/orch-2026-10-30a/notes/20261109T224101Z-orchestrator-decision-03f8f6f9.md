---
id: 20261109T224101Z-orchestrator-decision-03f8f6f9
kind: decision
by: orchestrator
at: 2026-11-09T22:41:01Z
verified_by: 
confidence: high
refs:
  - README.md
  - ABC-295
  - ABC-309
  - src/levels.ts
supersedes: 
seal: sha256:ea45fed9f9c73cbbfe1293d6382f4e01d78e1f1c106218aa965be82e831dfcf5
---

Owner, 2026-11-09: "add the projected level ratings to the readme". This is a docs-only change, cut as ABC-311 by this note (owner delegation; BA/PM records the page at the next records hop). Acceptance:

- **A1.** README § Levels gains a "Projected strength" row or column: L1 ~1 000–1 300; L2 ~1 300–1 550; L3 ~1 550–1 750; L4 ~1 800–1 950; L5 ~2 150–2 250; L6 ~2 170–2 270; L7 ~2 300–2 450.
- **A2.** Plain words say these are projections, not measurements. They are drawn from the one measured figure (§ Strength, 1 902.5 ± 49.1 at 100 ms, no blunders) with two assumptions: about +50 to +60 per doubling of time (shrinking at longer times), and an unmeasured penalty for blunder rates. They are on that scale only, and not FIDE or online ratings.
- **A3.** § Strength stays true. It may point to the projections, but it keeps saying that level 5 at 4 s was not measured.
- **A4.** The level 1–7 times match src/levels.ts.
- **A5.** Docs only; no src/. Lint and build pass, and the art cmp still exits 0.

QE checks the result, and QE's verdict signs UAT.
