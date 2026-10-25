---
id: 20261025T043307Z-architect-design-decision-73400120
kind: decision
by: architect-design
at: 2026-10-25T04:33:07Z
verified_by: 
confidence: high (text quoted from sealed notes; no reading taken)
refs:
  - ADR-0031
  - ABC-205
  - EPIC-008
  - S1
  - G6
  - NFR-005
  - memory-bank/50-decisions/ADR-0031-a-mobility-term-that-misses-the-leaf-cost-bar-is-cut-and-king-safety-ships-alone.md
  - arch-rule-ABC-205-g6/20261025T042840Z-architect-design-decision-912bcb0d
  - arch-rule-ABC-205-g6/20261025T043100Z-orchestrator-decision-154f2ced
  - qe-ABC-205/20261025T041540Z-qe-e2e-decision-234d9814
  - grugops/arch-adr0031-status
  - 9d059f6e
  - grugops/ABC-205-final
  - b5d5cea5
supersedes: 
seal: sha256:7adfd1ddc64586a925b89252e63960f735684c161fa4d06261bb1f7c9b0bece2
---

# Architect/Design: ADR-0031 addendum dated 2026-10-25 "accepted, not shipped" (G6 STOP). One status entry; nothing else moves

Task `arch-adr0031-status`, records only. Branch `grugops/arch-adr0031-status` from `main` `bb9fd7ef`; the ADR commit is
`9d059f6e`. Inputs: Architect ruling `…912bcb0d` (option 2: "the `ADR-0031` addendum gets a dated status line after the
close"), Orchestrator `…154f2ced` (close routed), QE `…234d9814`. Scratch: `<scratchpad>/arch0031/` (the sealing script only).

## What was written
- **Where:** `memory-bank/50-decisions/ADR-0031-…-king-safety-ships-alone.md`, § Addendum 2026-10-24 (`ABC-205`) → `### Status`,
  as its first entry, above the existing **ACCEPTED** paragraph. One paragraph (5 source lines, 6 insertions with the blank line).
- **Says:** accepted 2026-10-24 by the owner (`…fb0468ff`); `ABC-205` closed unmerged under `EPIC-008` `S1` after the `G6`
  STOP (position-6 median depth 7 against base's 8); the shelter gate (`A3`), not the blend, carries the depth-8 tree growth
  (+3.2 to +5.0 % on every gate-on variant), so no variant is predicted to clear "≥ base"; the forms stay on
  `grugops/ABC-205-final` (`b5d5cea5`), unmerged.

## What did not move
- Decisions 1–5, `A1`–`A7`, Alternatives, Consequences and Rollback of the addendum: unchanged. The ADR's top `## Status`
  is unchanged. No level, bound or NFR moves; "≥ base" stays as written (the owner's forward question is open).
- No `src/`, ticket, `EPIC-008`, board or trace edit here (BA/PM closes the ticket and the epic's lines beside this task).

## Note on timing
- The line names the close as the Orchestrator's delivery call (`…154f2ced`). BA/PM's ticket close ran in parallel; if BA/PM
  re-cuts rather than closes, this entry is superseded by a new dated one, not edited.
