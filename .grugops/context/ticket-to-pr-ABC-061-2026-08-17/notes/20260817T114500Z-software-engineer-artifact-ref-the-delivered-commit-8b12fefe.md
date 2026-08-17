---
id: 20260817T114500Z-software-engineer-artifact-ref-the-delivered-commit-8b12fefe
kind: artifact-ref
by: software-engineer
at: 2026-08-17T11:45:00Z
verified_by: 
confidence: high
refs:
  - ABC-061
  - src/cli.test.ts
  - plans/tickets/ABC-061-resolver-accepting-path-asserts-only-ok.md
supersedes: 
---

# The delivered artifact for `ABC-061`

- **Branch:** `grugops/abc061-resolver-value-assertions`, off `main` @ `a1f3643`.
- **Delivered commit:** `74900e79a00caafa1ddfb1622c565c1a1b1ca938` —
  `test(cli): grug pin the six accepted argvs by what they resolve to`.
- **`git diff --name-only 74900e7~1 74900e7`** ⇒ `src/cli.test.ts`. One path, and it is a `.test.ts`.
- **What it adds:** two `it` blocks inside `describe("ABC-042 — the accepted set is closed")`,
  immediately after the merged `A6(i)` accepting row, which is unchanged:
  - `ABC-061 A2 — the five deterministic accepted argvs are pinned by WHAT THEY RESOLVE TO`
  - `ABC-061 A3 — \`--colour random\` is pinned as a PAIR, whichever side the coin lands`
  Plus one changed import line (`type ResolvedOptions`) and a comment at the site naming both
  mutants, so a later hop cannot "simplify" the object comparisons back to `.ok` without reading why.
- **Context notes for this task** are its siblings in this folder: the mutant observations
  (`…-observation-both-mutants-run-and-watched-c062c84e`), the design decisions
  (`…-decision-value-assertions-shaped-by-the-union-and-placed-by-identity-ad1befff`), and the
  per-criterion verdicts with the gate results
  (`…-claim-per-criterion-verdicts-and-gate-results-305ee8cc`).
- **Not merged.** Nothing was pushed (no remote), no board column was moved by me, and the
  Orchestrator holds the merge and re-runs the gate.
