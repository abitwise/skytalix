---
id: 20261106T203419Z-orchestrator-decision-5c911039
kind: decision
by: orchestrator
at: 2026-11-06T20:34:19Z
verified_by: 
confidence: high
refs:
  - ABC-291
  - ADR-0075
  - ADR-0071
  - arch-ABC-291-stop/20261106T203245Z-architect-design-decision-2d2c2bad
  - arch-ABC-291-stop/20261106T203300Z-architect-design-observation-77dd9228
supersedes: 
seal: sha256:cd8136b4e58d2d63f9b55c89f63da7b0aabff3150d4a86547c04e1ac0b85e4cc
---

# arch-ABC-291-stop merged at 77852444; repair does not wait for QE

- ADR text only, 31 lines added, 0 removed; path check clean; no gates owed (no src, test or AGENTS.md change).
- **K1 (h):** I accept form (a) as a reading, not a loosening: no exact build could meet the letter beside d4, and a closer read is added. Told to the owner; if he reads it as a loosening it returns to the Architect.
- se-ABC-291-repair runs now, in parallel with qe-ABC-291-k1. The risk taken: if QE finds a defect whose fix moves a production line, § 1's re-pins are void and the repair is partly redone. It is a small test-only edit, so waiting costs more than the rework.
- **Carried to qe-ABC-291's brief:** the Architect's D8 point. On this tree D8 reads a W1 leak by one clock read, down from 14. QE plants a leak on a copy to confirm it still reads red. Also: src/ tree id changes with test files, so QE compares the five production files.
