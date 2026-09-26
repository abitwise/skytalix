---
id: 20260927T001000Z-orchestrator-decision-8c8aa8a9
kind: decision
by: orchestrator
at: 2026-09-27T00:10:00Z
verified_by: 
confidence: high
refs:
  - ADR-0006
  - ABC-123
  - adr0006-amend-sentence
supersedes: 
---

Owner (Olger Oeselg), 2026-09-26, verbatim: "i will delegate these decisions to you. Contact me when big decision is needed or input context for your session goes over 500k"

Scope of the delegation as the Orchestrator reads it: the two open decisions, plus routine flow decisions of the same size. NOT delegated (the kit's standing rule, unchanged): moving or merging `main`, any deploy, and final UAT acceptance. Those, and any "big decision" (a new ADR, a changed decision clause, an NFR threshold, or a new accepted risk), go back to the owner.

Decisions taken under the delegation:
1. ADR-0006 collision sentence: ACCEPT the Architect's rescope as proposed in `…9c4d2b18` (evidence `…5e1a7c30`). It changes no Decision clause, keeps G6 and the rights key, and cites no new risk. Architect to apply it verbatim, with the erratum crediting the owner's delegation (this note).
2. ABC-123 (DoR 9/10, XS, P2): PULL. Build it through Workflow 04 (Engineer), then Workflow 05 (QE) and Security/NFR (tools/grugops is the gate's own surface). Stop at Ready for UAT; the owner accepts. A7's baseline must be the current 48/1,467, not 47/1,446.
