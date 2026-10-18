---
subtask: arch-adr0044-accept
role: architect-design
from: main HEAD
branch: grugops/arch-adr0044-accept
worktree: ../wt-arch-adr0044-accept
---

# ADR-0044 → ACCEPTED; D13 rewritten to private (records only)

Read the owner-word note `.grugops/context/wave-2026-09-25/notes/20261018T113000Z-orchestrator-decision-owner-word-engine-private-adr0044-epic007-accepted-c3e81a57.md`.

1. Set ADR-0044's status (headings and frontmatter) to **ACCEPTED, 2026-10-18, owner**, citing the note. Do it the way ADR-0038 was
   marked accepted.
2. Rewrite D13 to cover the following, and keep the AGPL evaluation as a dated "considered, not chosen" record:
   - The engine is private, all rights reserved: `"private": true`, `"license": "UNLICENSED"`, no LICENSE file.
   - The four MIT kit files keep their notice.
   - The Michniewski tables stay as they are, with an attribution comment in the `src/evaluate.ts` header.
   - Re-deriving our own values is a precondition for any distribution of the engine to third parties.
   - Q14 is answered (keep `npm run chess`), and Q15 is moot.
   - The AGPL "Source link" advice is withdrawn.
3. Mark Q12–Q15 answered in the owner-questions section.

Write one short decision note under `.grugops/context/arch-adr0044-accept/notes/`.

Fences:
- No diff to src, tools, package*.json, vitest.config.ts or plans.
- No tests.
- Nothing pushed or merged.
- When done, write `.grugops/queue/done/arch-adr0044-accept.md` and `.claim.md`, uncommitted, in main's working tree, and include a trace
  row in the handoff.
