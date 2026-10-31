---
id: 20261031T062211Z-architect-design-decision-3328614b
kind: decision
by: architect-design
at: 2026-10-31T06:22:11Z
verified_by: 
confidence: high: records-only label correction on the owner's verbatim word in orch-2026-10-30a/…c2752305; no decision, figure, band or rule moved; nothing run
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
seal: sha256:6f8b8be321a5f8aa55855c6a4e4353be6fa126616ab2e01e1ee013cfd3030a86
---

# Architect/Design decision, arch-hostname-adrs: ADR-0035 and ADR-0046 spell the reference machine `oeselg-dev`

Records only, at `e4386e96` on `grugops/arch-hostname-adrs` (base `main` `164a70c1`). Nothing was run or timed.

## The word
- Owner, 2026-10-31, verbatim: *"hostname spelling: oeselg-dev"* (Orchestrator `orch-2026-10-30a` `…c2752305`, item 1). The referent, the Ubuntu Linux host, is unchanged.
- The places come from Security/NFR's observation `secnfr-hostname` `…8b4e0311`.

## What changed (pre-edit line numbers)
- `ADR-0035` L104 (Status, addendum 2026-10-30 paragraph): `oeselg-devl` → `oeselg-dev`.
- `ADR-0035` L754 and L779 (`§ Addendum 2026-10-30 (SEC-REBASE-b)`): the same, once each.
- `ADR-0046` L220 (addendum § Context, "How the lane grew back after `ABC-177`"): the same.
- One dated Status line in each ADR, "Spelling 2026-10-31 (`arch-hostname-adrs`, records only)", citing `…c2752305` and naming the places.

## Kept as written, deliberately
- No verbatim owner quote in either ADR carried the old spelling, so none needed keeping.
- The two new dated lines name the old spelling `oeselg-devl` once each, to say what was corrected.

## What did not move
- No decision, ruling, figure, band or rule in either ADR. `ADR-0035`'s *"load1 ≤ 8"* reading and `ADR-0046`'s R1–R4 are untouched.
