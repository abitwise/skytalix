---
id: 20260925T141421Z-architect-design-claim-what-this-ruling-did-not-verify-0f93c6b1
kind: claim
by: architect-design
at: 2026-09-25T14:14:21Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-121
  - ADR-0026
  - NFR-005
  - N8-LANE
supersedes:
---

# What this ruling did not verify

Hand-authored, no `seal`. None of these is load-bearing for the rulings, but each is a place
the build or a later hop can find this ruling wrong.

1. **The probe is not the build.** It is faithful with both switches off (0 / 48 cells), and it
   reproduces the shipped ratio figures. But its PVS/LMR code is this hop's, not the Engineer's.
   A different but legitimate wiring could read different drift and node figures. Examples are
   reducing inside the re-search, or skipping PVS at the root.
2. **PVS value-identity is measured at depths 3–4 only** (0/190 each). At depth 5 the drift
   table compares PVS+LMR against PVS alone. It assumes PVS alone still has the base's value
   there. That is expected, because PVS is exact, but it was not re-measured.
3. **The depth-7 margin (1.68x / 1.83x) divides probe nodes by QE's `ABC-081` node capacity.**
   It assumes PVS/LMR leave the node rate unchanged. Two probe wall-clock runs disagree by a
   whole ply with the load (12.4 vs 5.5–6.2). `NFR-005` is Security/NFR's reading on plain node,
   not this one.
4. **Default-lane cost of the new rows under `N8-LANE` (650 ms) was not measured.** Only the
   probe's deep-shaped passes were timed, and those under load.
5. **The re-point list in Ruling 1 was read from the test files, not executed.** No test was run
   against a door, because no door exists yet. The Engineer's own list, checked by QE, is the
   inventory.
6. **The corpus mate coverage is 3 positions.** A reduction that loses a mate in a position
   outside the corpus and outside the five pinned mate rows would pass every row proposed here.
   That is the gap `ABC-084` closes, and `ADR-0026` names it.
7. **`UNKNOWN - verify`: the queue claim was taken inside this hop's worktree,** because the
   dispatch forbade touching the main checkout. So the bare `mkdir` does not exclude a claimant
   working in a different checkout. Scribe's `scribe-deep-lanes-081` claim directory sits in the
   main checkout. The dispatch named one agent per subtask, so no race occurred. The mechanism
   did not prevent one.
