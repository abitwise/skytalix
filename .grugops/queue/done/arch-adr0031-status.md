---
subtask: arch-adr0031-status
role: architect-design
ref: .grugops/context/arch-adr0031-status/
adr: memory-bank/50-decisions/ADR-0031-a-mobility-term-that-misses-the-leaf-cost-bar-is-cut-and-king-safety-ships-alone.md
branch: new grugops/arch-adr0031-status from main, worktree ../wt-arch-adr0031-status
width: 2 of 3 (beside bapm-close-ABC-205; records only)
---

# ADR-0031 addendum: dated status line — accepted, not shipped (G6 STOP)

## Do
- Per your ruling `arch-rule-ABC-205-g6/…912bcb0d` and Orchestrator `…154f2ced`: one dated status line on the ADR-0031 addendum (accepted 2026-10-24 by the owner; not shipped: ABC-205 closed under S1 after the G6 STOP; the gate-vs-blend finding in one sentence; forms on `grugops/ABC-205-final`). Nothing else moves.

## Fences
- Only your worktree and `<scratchpad>/arch0031/`. No `src/`. No npm/vitest. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-adr0031-status). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

Architect/Design, 2026-10-25, branch `grugops/arch-adr0031-status` @ `4247a557` (= `bb9fd7ef` + 2 records commits; not
pushed, not merged). Records only: no `src/`, no ticket, `EPIC-008`, board or trace edit. Scratch `<scratchpad>/arch0031/`
holds the sealing script only.

- **The line** (commit `9d059f6e`): `ADR-0031` § Addendum 2026-10-24 (`ABC-205`) → `### Status`, first entry, above the
  existing **ACCEPTED** paragraph. One paragraph, 6 insertions: **"2026-10-25: accepted, not shipped."** Accepted 2026-10-24
  by the owner (`…fb0468ff`); `ABC-205` closed unmerged under `EPIC-008` `S1` after the `G6` STOP (position-6 median 7
  against base's 8, `…234d9814`); the shelter gate (`A3`), not the blend, carries the depth-8 growth (+3.2 to +5.0 % on
  every gate-on variant), so no variant is predicted to clear "≥ base" (`…912bcb0d`; `…154f2ced`); the forms stay on
  `grugops/ABC-205-final` (`b5d5cea5`), unmerged.
- **Nothing else moves:** decisions 1–5, `A1`–`A7`, the ADR's top `## Status`, levels and bounds are unchanged.
- **Notes** (`.grugops/context/arch-adr0031-status/notes/`): decision `…73400120` (1), plus the rendered index.
- **Merge:** the branch is records only against `main` (4 files: the ADR and the context dir). Safe to merge whole.

**Trace row** (for the Orchestrator):

| ABC-205 (arch-adr0031-status) | ADR-0031 addendum dated 2026-10-25: accepted, not shipped; ABC-205 closed unmerged under S1 after the G6 STOP | EPIC-008 | king safety: queen scale ×3, tapered gated king square (not shipped; forms on grugops/ABC-205-final b5d5cea5) | NFR-005 G6 ≥ base: no bound moved | grugops/arch-adr0031-status @ 4247a557 (bb9fd7ef + records)<br>memory-bank/50-decisions/ADR-0031-…-king-safety-ships-alone.md § Addendum → Status<br>.grugops/context/arch-adr0031-status/notes/ (1) | text quoted from sealed notes; no reading taken | UAT not signed (QE FAIL stands) | Orchestrator merges records; BA/PM close in parallel | Closed under S1 (BA/PM's move; no board edit here) |
