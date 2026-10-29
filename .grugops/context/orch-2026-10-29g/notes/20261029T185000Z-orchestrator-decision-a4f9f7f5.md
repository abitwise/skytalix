---
id: 20261029T185000Z-orchestrator-decision-a4f9f7f5
kind: decision
by: orchestrator
at: 2026-10-29T18:50:00Z
verified_by: 
confidence: high
refs:
  - orch-2026-10-29g/…3b55e347
  - grugops/arch-rule-ABC-205-g6
  - grugops/qe-ABC-168
  - 7e831392
  - ABC-205
  - ABC-168
supersedes: 
seal: sha256:e9a649c558f997df503be1434664f534a0f57a2f8e9ed8fbe95a319280d4d32a
---

# Owner word: delete leftover branches no longer needed

**Owner, 2026-10-29, in session:** "in case the branches that are no longer needed, delete them"

**Deleted on origin:**
- `grugops/ABC-205`, `grugops/ABC-205-final` and `grugops/qe-ABC-205`. All three are ancestors of `arch-rule-ABC-205-g6`, so their commits stay reachable.
- `grugops/qe-ABC-168`. Its content is on main: notes and probe were already there, and § QE was restored in `f598a68d`. Its sha `7e831392` (and merge `6d27dc9e`), cited in records, is no longer reachable from any branch. The content is not lost.

**Kept:** `grugops/arch-rule-ABC-205-g6`. It is the only archive of ABC-205's closed-unmerged code (evaluate.ts plus tests), and it keeps the cited shas (`18a0570e`, `f3e14a00`, `b5d5cea5`, `ffa0a5e8`, `0daeed42`) reachable. Delete it only on the owner's word that ABC-205 will not be revisited.
