---
id: 20261018T122616Z-software-engineer-decision-reference-and-pins-3b9d52e1
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-170
at: 2026-10-18T12:26:16Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-170
  - ABC-170
  - ADR-0044
  - RISK-EPIC007-04
supersedes:
---

# ABC-170: identity reference, import placement and the two A4 pins

1. **`A1`/`A2` compare shipped `chooseMove` against shipped `search`** (reductions on in both), as the page
   words it. The probe showed both pairs (`chooseMove`/`search` and `…WithoutReductions`/`searchWithoutReductions`)
   agree at the limited depths; the shipped pair is the one the limits matter for. `A2` adds one row the page does
   not spell out: the limited run visits more nodes than a `maxDepth: d` run, proving the depth-`d+1` iteration was
   entered and discarded rather than never started.
2. **`search` is imported by a top-level `await import("./search.ts")` in the appended block**, not added to the
   import block at `:60`, so `A4`'s fence holds: `git diff -U0` hunks are `:517`, `:520-523` (inside `:478-556`)
   and `:1200+` (appended).
3. **The `max_?depth` check** strips comment lines and pins the code occurrences to exactly
   `readonly maxDepth?: number;` and `iteration <= (options.maxDepth ?? Number.POSITIVE_INFINITY) &&`.
   `default_?depth`, `fixed_?depth` and the defaulted-depth regex are unchanged.
4. **The loop-header check** collapses whitespace (biome breaks the header over lines) and pins
   `now() < budget.deadline && iteration <= (options.maxDepth ?? …) && budget.nodes < budget.maxNodes`, clock
   first; it bans `iteration <= <digit or CONSTANT>`.
5. **`maxNodes` lives on `Budget`** (`options.maxNodes ?? Infinity`) because `countNode` needs it; `maxDepth` is
   read inline in the header, so no `const …Depth = …` exists for the defaulted-depth regex to catch.
