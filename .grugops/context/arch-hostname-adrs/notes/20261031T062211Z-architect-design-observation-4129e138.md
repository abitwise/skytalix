---
id: 20261031T062211Z-architect-design-observation-4129e138
kind: observation
by: architect-design
at: 2026-10-31T06:22:11Z
verified_by: 
confidence: high: git grep at e4386e96; the only oeselg-devl left in the two ADRs are the two dated lines naming the old spelling
refs:
  - arch-hostname-adrs
  - secnfr-hostname
  - SEC-REBASE-a
  - SEC-REBASE-b
  - ADR-0035
  - ADR-0046
  - NFR-008
  - EPIC-010
  - ABC-177
  - orch-2026-10-30a/20261031T073000Z-orchestrator-decision-c2752305
  - secnfr-hostname/20261031T061916Z-security-nfr-observation-8b4e0311
  - 164a70c1
  - e4386e96
supersedes: 
seal: sha256:c8fafe1691e4c023d2b720669e8af36a97e7f32b6049dd63d48cd692d5e610eb
---

# Architect/Design observation, arch-hostname-adrs: `oeselg-devl` left in the two ADRs

Read at `e4386e96` with `git grep`, over `memory-bank/50-decisions/ADR-0035*` and `ADR-0046*` only.

- `ADR-0035`: one, line 109, inside the dated "Spelling 2026-10-31" line (names the old spelling on purpose).
- `ADR-0046`: one, line 25, inside the dated "Spelling 2026-10-31" line (the same).
- Every other mention reads `oeselg-dev`: `ADR-0035` lines 104, 759, 784; `ADR-0046` line 225.
- Outside the fence (not read for edit): history listed in `…8b4e0311` (board `_Updated` lines, done briefs, sealed notes) stays as it is.
