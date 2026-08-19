---
id: 20260820T183000Z-uat-planner-artifact-ref-the-uat-pack-and-signoff-checklist-for-abc078-4c1d8a90
kind: artifact-ref
by: uat-planner
at: 2026-08-20T18:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-078
  - plans/tickets/ABC-078-iterative-deepening-and-the-engine-seam.md
  - .grugops/context/uat-ABC-078-2026-08-20/uat-pack.md
  - .grugops/context/uat-ABC-078-2026-08-20/signoff-checklist.md
  - src/engine.ts
  - src/cli.ts
  - AGENTS.md
supersedes: 
---

# The `ABC-078` UAT pack and the owner's signoff checklist — where they are

Two artifacts, written by hand under this task's folder because `scripts/context-io.ts` is absent on
this install (`AGENTS.md`: no `finding` is admissible, hand-author per
`agent-factory/contracts/context-note.md`):

- **`uat-pack.md`** — the goal in the user's words, entry criteria, test users and data, the six
  business scenarios with their pass/fail criteria and results, **the set of criteria that have no
  business-observable acceptance at all**, the known limitations, the rollback position, and the
  `In UAT` exit criteria.
- **`signoff-checklist.md`** — nine yes/no questions the owner can answer with his word, three of
  which (`Q7`–`Q9`) are the ones this hop deliberately could not answer for him.

**Neither file is a signature and neither carries a stamp.** The pack's first section says so in its
own words so that it cannot be quoted out of context.
