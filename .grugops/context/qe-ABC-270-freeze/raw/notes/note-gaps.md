# qe-ABC-270-freeze gaps: three reading notes for se-ABC-270 and for QE's grading of K1 (c) (INFO / LOW). None blocks the build

QE/E2E, task `qe-ABC-270-freeze`, at `main` `00e99db8` (`src/` tree `4cb84035`). This note goes with the PREREG `20261103T222633Z-qe-e2e-decision-fa82b3f3`, which holds the frozen pairs.

- **`QE-270-a` (LOW, the Engineer): K1 (c) reads each king's exposure, and `main` has no per-king seam.**
  - `kingExposure` is module-private. `evaluate` reads only black minus white.
  - On QP2's A, both kings carry 35 cp with a queen against them. The 0 → 2 × seam then moves `evaluate` by **0**, so an `evaluate`-only reading cannot see QP2's per-king 3 × at all.
  - The PREREG gives both forms: the per-king cp (subject 3 ×, the other king equal) and the white-POV `evaluate` deltas.
  - **QE grades the per-king form.** The build needs a test-only per-king read, in the house's `…ForTest` pattern; the form is the Engineer's. If no such read exists, QE grades the `evaluate` deltas and records that QP2's A was graded only on the net.
- **`QE-270-b` (INFO): "differ only by the enemy queen" is not "differ only in exposure".**
  - Removing a queen moves the phase by 4, material, the queen's square value and mobility. So whole-`evaluate` A against B is no K1 (c) reading.
  - Only the exposure term, or the seam delta within one position (pairs at 2 × against 0), reads K1 (c).
- **`QE-270-c` (INFO): what QP7 and QC8 catch.**
  - QP7 (two enemy queens against none) is one of the seven K1 (c) pairs. A form that counts queens instead of flagging them reads 5 × there, and fails.
  - QC8 is a control outside the ≥ 6: two queens against one, and nothing may move. ADR-0068 d1 says "at least one queen", so both rows follow from the ADR text. Neither adds a bar.
- **No coverage claim.** No ABC-270 code exists, so nothing was graded. K0's numbers are copied from `ADR-0068` d6. Whether they hold on the build is the Engineer's K0 read (`UNKNOWN - verify` until it runs).
