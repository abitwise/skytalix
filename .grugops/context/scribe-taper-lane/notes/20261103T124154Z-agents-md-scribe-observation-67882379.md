---
id: 20261103T124154Z-agents-md-scribe-observation-67882379
kind: observation
by: agents-md-scribe
at: 2026-11-03T12:41:54Z
verified_by: 
confidence: high
refs:
  - AGENTS.md
  - ABC-269
  - src/evaluate.taper.test.ts
  - src/cli.test.ts
  - scribe-taper-lane
supersedes: 
seal: sha256:df89f3bbd02d6348580c7e81ba0caea902db138b33ce70beb1e2719ae1ba3697
---

# Observation: AGENTS.md after the taper-lane edit is 18,404 B, budget test green

Hand-run observation, no gate verdict (an artifact-ref needs sha + gate_run + content_hash, which this hop does not have). `AGENTS.md` on branch `grugops/scribe-taper-lane`: one new deep-lane row (`src/evaluate.taper.test.ts`,
`SEARCH_DEEP=1`, 146 tests, ABC-269) and two duplicate clauses removed. 18,404 B of 18,432 B.
Proof: `npx vitest run src/cli.test.ts` 109/109 green (includes ABC-109 A5 byte budget); the new lane run once,
146/146 green. Commit hash is the branch tip; see the queue Result in
`.grugops/queue/done/scribe-taper-lane.md`.
