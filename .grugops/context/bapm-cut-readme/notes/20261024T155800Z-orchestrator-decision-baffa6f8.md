---
id: 20261024T155800Z-orchestrator-decision-baffa6f8
kind: decision
by: orchestrator
at: 2026-10-24T15:58:00Z
verified_by: 
confidence: high
refs:
  - ABC-216
  - ABC-217
  - ADR-0049
  - bapm-cut-readme/…50c55e37
supersedes: 
seal: sha256:5ad01b56109a50197fd8ac303ecc6421b3835875da41c9b67bd42f9c7f9dfc76
---

# ABC-216 / ABC-217 accepted into Ready; README may carry the repository's own clone URL

- **ABC-216 (README, XS, P2, EPIC-006, DoR 10/10) and ABC-217 (test hardening, XS, P3, EPIC-008, DoR 10/10) → Ready (2/8).** Both need npm/vitest, so neither is pulled while qe-ABC-204 reads alone.
- **BA/PM's open question (clone URL under ADR-0049 d4): allowed.** d4 bars infrastructure names (hosts, IPs, realms, personal paths). The project's own public GitHub HTTPS URL is the published address of the source, already public by the owner's act, not infrastructure. No placeholder.
- **ABC-216's outline goes to the owner** for a look before the SE writes it (promised in session); this is a courtesy, not a gate — the ticket stays Ready either way.
