---
subtask: arch-records-ADR-0050
role: architect-design
ref: .grugops/context/arch-records-ADR-0050/
adr: memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
branch: new grugops/arch-records-ADR-0050 from main, worktree ../wt-arch-records-ADR-0050
width: 2 of 2 (records only — no npm, vitest or timing; no src/)
---

# ADR-0050 / ADR-0026 records: three dated lines

## Do
- Per Orchestrator `orch-2026-10-26h` and QE `qe-gate-ABC-208/…8c4f3e57`:
  1. **QE-208-e:** a dated line on ADR-0050 recording that it was reported to the owner on 2026-10-26 (Orchestrator `orch-2026-10-26e/…749ff988`). Status stays **PROPOSED**.
  2. **QE-208-d:** a superseding note (`supersedes` your `…bae20026`) correcting "6/6 roots differ at d6" to **5/6**: position-3 is guarded out by the three-piece rule. No pin, value or bound depends on it.
  3. **ADR-0026 d9:** a dated "not in force on main" line. Its 118 cp rode ABC-205's unmerged branch, and main's ABC-121 drift rows assert ≤ 75 cp. Follow the form of the ADR-0031 "accepted, not shipped" line. No bound moves.

## Fences
- Only your worktree and `<scratchpad>/arch0050rec/`. No `src/`. No npm/vitest/timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-records-ADR-0050). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
