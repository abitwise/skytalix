---
id: 20260925T180000Z-orchestrator-decision-0288b6ed
kind: decision
by: orchestrator
at: 2026-09-25T18:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-080
  - ABC-081
  - NFR-005
  - main
supersedes: 
---

# Owner's word, 2026-09-25 (third) — ABC-080 accepted, NFR-005 runner, main merge

Verbatim: *"1. accept ABC-080 ; 2. use recommendation ; 3. main merge"*

1. **ABC-080 ACCEPTED → Done.** It is on the wave branch.
2. **NFR-005 binds PLAIN NODE**, following the Security/NFR recommendation (`secnfr-ABC-080` decision): `npm run chess` runs `node src/cli.ts`. Vitest depth readings are reported, not ruled. The catalogue row's wording is Security/NFR's pen at ABC-081's gate. The verdict comes at ABC-081.
3. **Main merge:** the owner asked again. The Orchestrator does not merge to `main` (kit hard limit: humans hold merge). The safe target is the wave tip after this note's commit: it holds ABC-046, ABC-120, ABC-079 and ABC-080, all accepted, and no unreviewed code (ABC-081 is building on its own branch). The fast-forward command is handed to the owner.
