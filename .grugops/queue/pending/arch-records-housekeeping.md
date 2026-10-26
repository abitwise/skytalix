---
subtask: arch-records-housekeeping
role: architect-design
ref: .grugops/context/arch-records-housekeeping/
branch: new grugops/arch-records-housekeeping from main, worktree ../wt-arch-records-housekeeping
width: 2 of 2 (records only — no npm, vitest or timing; no src/)
---

# Two stale record lines: Node floor in 30-architecture; ADR-0034 118 cp pointer

## Do
1. **QE-216-h:** the architecture page (§ Stack line "TypeScript on Node >= 22") should read >= 22.18, matching `package.json` engines since ABC-216 (39b93505). Add a dated line per the page's convention.
2. **ADR-0034 addendum decision 1:** its pointer says the clean-lead bar "reads 118 cp" (OD-205-2). That is not in force on `main`, where the ABC-121 rows assert ≤ 75 cp, the same as your ADR-0026 d9 line in `arch-records-ADR-0050/…f9357ec6`. Add the same dated "accepted, not in force on main" line. No bound moves.

## Fences
- Only those two files, your worktree and `<scratchpad>/arch-hk/`. No `src/`. No npm/vitest/timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-records-housekeeping). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
