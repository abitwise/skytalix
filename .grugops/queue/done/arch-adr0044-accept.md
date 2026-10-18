---
done_at: 2026-10-18T10:35:49Z
branch: grugops/arch-adr0044-accept (worktree ../wt-arch-adr0044-accept, from main 50e081fc)
tip: c0837d49 (parent 50e081fc; records only: ADR-0044 accepted + D13 rewritten to private + one decision note)
result: DONE. ADR-0044 ACCEPTED 2026-10-18 by the owner (note ...c3e81a57). Not legal advice.
  - Status: an "accepted" line first, with the earlier proposed text kept under "Previously" (the ADR-0038 pattern). Peer frontmatter added (kind: adr, id: ADR-0044); the ADR had none. New section "Revision — private" (P1-P6).
  - D13 rewritten: private, all rights reserved; "private": true + "license": "UNLICENSED"; no LICENSE, no NOTICE. ABC-169 re-scoped to declaring private (package.json field + evaluate.ts comment).
  - Kit files: the four MIT kit files stay MIT and keep their notice. At 50e081fc none carries MIT text, so the notice text is UNKNOWN - verify, the kit's to supply, and it blocks nothing.
  - Tables: they stay as they are, with an attribution comment in the src/evaluate.ts header (wording in D13). Re-deriving our own values is a precondition for any distribution to third parties (bundle, binary, npm publish, handed-over dist/ or clone); that ticket is cut only on the owner's word. This is the Orchestrator's default reading, and the owner may correct it.
  - Q14 answered (keep npm run chess); Q15 moot; Q12-Q15 in a new "Answered at acceptance" table; the older question lists are relabelled "kept for the record".
  - AGPL "Source" link advice withdrawn (D13 bullet + inline marker in evaluation item 4). The AGPL evaluation is kept as the dated subsection "Considered, not chosen".
  - Consequences: the Config line (UNLICENSED, no LICENSE/NOTICE), the BA/PM suggestion (ABC-169 = declaring private, Q15 moot) and the Distribution bullet (re-derivation precondition).
  - Note: .grugops/context/arch-adr0044-accept/notes/20261018T103417Z-architect-design-decision-adr-0044-accepted-d13-private-unlicensed-tables-attributed-fe0a5538.md (decision; supersedes ...15c4fd4e on the licence choice only). Clock skew: host 10:34Z against the owner note's 11:30Z, UNKNOWN - verify.
  - Fences: git diff --name-only 50e081fc HEAD -- src tools package.json package-lock.json vitest.config.ts plans is empty. No test run. Nothing pushed or merged. The note is hand-authored and unsealed (no context-io.ts on this install).
  - Trace row is in the handoff.
---
