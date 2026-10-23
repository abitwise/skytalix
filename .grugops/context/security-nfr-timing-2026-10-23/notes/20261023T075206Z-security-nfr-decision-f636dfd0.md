---
id: 20261023T075206Z-security-nfr-decision-f636dfd0
kind: decision
by: security-nfr
at: 2026-10-23T07:52:06Z
verified_by: 
confidence: high (state read in three readout views; F re-read is Architect/Design, UNKNOWN - verify)
refs:
  - security-nfr-timing-2026-10-23
  - ABC-200
  - ABC-201
  - EPIC-006
  - NFR-007
  - NFR-008
  - N8-LANE
  - ADR-0035
  - ADR-0018
  - c91445e3
  - 1d5316e0
  - 5bf1e3d6
  - 55618845
  - c9dd9d1f
  - 52c15f56
  - 20261022T194346Z-security-nfr-decision-08e4152e
  - 20261023T072556Z-security-nfr-decision-d0c770b5
  - 20261023T074000Z-orchestrator-decision-8c94d901
  - R-178-1
  - plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
supersedes: 
seal: sha256:c902bacfac5cc4ef8a3c06ca0be3678644e3619364719560a490d9a18a9bcd05
---

# ABC-200 N8-LANE: **MET.** H − B +0.030 s CPU [−0.010, +0.060] against 650 ms, twin R 0.050 s (admissible). The full-lane NFR-008 reading is not owed before merge

This is a `decision`, not a `finding`: `human_admission` is off on this install, so no stamp exists. The readings are in this task's observation note.

- **What was read.** The reading owed by `…08e4152e` § 3, taken as that section spells it: the narrowest set (5 files, resolved at HEAD); B with the one-assertion placeholder; the identity twin T; 8 scored interleaved rounds; CPU from `/usr/bin/time -p`; the paired median with the sign test; `ADR-0035` D1 admissibility. The bar is 0.650 s CPU.
- **The charge.** +0.030 s (≈ 4.6 % of the bound; 0.36 % of the set's B CPU). The upper interval end, +0.060 s, is 0.590 s under b. R is 0.050 s, 13× under b. The state is **MET** in the grading view, the 174a view and the strict view.
- **Preconditions held.** They held for the whole window: AC on every poll and run, load1 ≤ 3.68, 0 foreign vitest and thermal 0 on all 27 runs. "Thermal kept and flagged" had nothing to flag.
- **Accounts.** The floor is charged by count (+1 file) to the floor account, owner Architect/Design. `N8-SPAWN` takes 0, because no criterion forces a spawn. The spawning suites in the set are identical B to H and cancel.
- **The floor caveat** (same class as `R-178-1`; no new risk ID).
  - The set has no recorded per-set F. The provisional 16 % F is 1.316 s, which is above b, so a strict cut check would print `650 ms >= F: False`. It does not change the state: F is a cut-time rule, and the state test (R ≤ b, median ≤ b) does not read it.
  - This window's twin R 0.050 s is the set's first admissible reading.
  - **Owner:** Architect/Design, who owns the floor account and re-reads F. It is not a fix this ticket owes.
- **NFR-008 full lane: not owed before merge.** `…08e4152e` § 3 made it owed only on NOT MET or UNRESOLVED. The published headroom is 0.990 s on H (`…d0c770b5`). After this merge it stands, by estimate, at about 0.99 s minus one file's floor plus the +0.03 s of content, until the next full-lane window reads it.
- **Merge condition.** The reading is of merge `5bf1e3d6`. It carries to `main` only while the lane-input diff (`src`, `tools`, `package*.json`, `vitest.config.ts`, `tsconfig*.json`) between `5bf1e3d6` and the merged result equals ABC-200's own 7 files. Today `main` has no lane-input change after `c91445e3`.
- **Result for this hop:** MET. No required fixes. Accepted risks are unchanged (`AR-200-C1ECHO`, `-SLOT`, `-NOSTACK`, `-EPIPEQ` from `…08e4152e`). The column move and the merge are the Orchestrator's.
