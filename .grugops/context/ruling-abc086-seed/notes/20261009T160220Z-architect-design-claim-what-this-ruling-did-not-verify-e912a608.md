---
id: 20261009T160220Z-architect-design-claim-what-this-ruling-did-not-verify-e912a608
kind: claim
by: architect-design
at: 2026-10-09T16:02:20Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-086
  - ABC-087
  - ADR-0027
supersedes:
---

# What this ruling did not verify

Hand-authored, no `seal`.

- **(a)'s construction is one construction.** The probe widens the root to `best - 1` and
  re-searches ties to an exact score. Other ways to find the equal-best set were not measured. One
  example is a second null window at `best` only for moves that fail high. Any of them still
  changes root windows and the stored root move, which is where the measured value change comes
  from. That is argued here, not measured.
- **The node cost of (a) is a probe figure** (+3.3–5.2%). It was not read with the `N8-LANE`
  instrument, and it is not a lane-cost claim.
- **The real-clock figure (≈ 0.62 M nodes in 3 s, kiwipete, depth 7) was read while another probe
  ran.** It is load-dependent and serves only as scale against the ceiling's 5.11 M. It is not a
  pin and not an `NFR-005` reading.
- **The virtual-clock module is not built.** Its name, its signature and the exact comment wording
  are the Engineer's under `ABC-086`. This ruling fixes only the constraints.
- **The blunder draw's need for per-move scores under PVS** is named for `ABC-087` and not
  designed here.
