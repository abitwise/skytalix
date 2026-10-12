---
id: 20261012T105617Z-architect-design-decision-abc105-owner-ruling-risk-floor-growth-2a41a1c4
kind: decision
by: architect-design
task: design-ABC-105-lane
at: 2026-10-12T10:56:17Z
verified_by:
confidence: high
refs:
  - ABC-105
  - QE-105-x
  - RISK-ABC105-LANE
  - RISK-ABC144-FCAP
  - N8-LANE
  - NFR-008
  - ADR-0035
  - plans/nfr-catalog.md
  - tools/grugops/qe-hop-integrity.test.ts
  - 20261012T103400Z-qe-e2e-decision-abc105-qe4-verdict-pass-with-gaps-n8-not-read-6a647762
  - 20261012T095452Z-qe-e2e-decision-abc105-qe3-n8-lane-not-met-15ca6e06
  - 20261012T080100Z-qe-e2e-observation-abc105-n8-lane-narrow-set-met-7177253b
  - 20261012T105615Z-architect-design-observation-abc105-six-windows-recomputed-d1e341ef
supersedes:
---

# `ABC-105`: the owner's ruling is recorded as his ruling, `QE-105-x` is carried as `RISK-ABC105-LANE`, the set's `F` is 0.020 s, and the growth trigger is 4,000 notes

This note is hand-authored and unsealed. It covers brief items 2–5. The full texts are `ADR-0035` § Addendum
2026-10-12 A2/A3 and the catalog section "`N8-LANE` at `ABC-105`" at the end of `plans/nfr-catalog.md`.

## Item 2: the owner's ruling

- **The ruling.** `ABC-105` merged (`f6400877`) "on the +0.370 s reading". That is QE4 w2's ungraded treatment
  median.
- **How it is recorded.** It goes in the catalog as **the owner's ruling, NOT a MET and NOT a margin**.
  `N8-LANE` at `8fd0c233` is NOT READ.
- **The source** is the Orchestrator's merge commit, the board line `c1841b36` and this hop's brief. The owner's
  verbatim words are not in any note on `main`. They are `UNKNOWN - verify`, owed by the Orchestrator.
- **`RISK-ABC105-LANE`** (`QE-105-x`, MEDIUM) carries the owed formal reading.
  - **Triggers**, whichever comes first:
    - T-a: the next width-1 timing window;
    - T-b: any change to `tools/grugops/qe-hop-integrity.test.ts` or `.js`;
    - T-c: 4,000 note files.
  - **Method:** QE4's pre-registration, with A1 applied.
  - **Outcomes:**
    - MET closes the risk.
    - NOT MET goes to the owner.
    - NOT READ leaves it open.

## Item 3: the per-set `F`

- **`tools/grugops/qe-hop-integrity.test.ts` against the placeholder: `F` = 0.020 s CPU / 0.020 s wall.**
- **The sources** are two admissible twins at n = 8, k = 2:
  - `60415a8a` R 0.010 / 0.010, twin CPU −0.13, **−0.01**, −0.01, 0.00, 0.00, 0.01, **0.01**, 0.01;
  - `db1cfb6c` w3 R 0.020 / 0.020, −0.01, **−0.01**, 0.00, 0.00, 0.00, 0.00, **0.02**, 0.03.
- **There are fewer than three readings, so the largest governs.** It replaces the provisional 16 % (0.091–0.092 s).
- **Listed, not used:** the inadmissible QE3 w1 (0.010) and QE4 w2 (0.030); the void QE3 w2 and QE4 w1.

## Item 4: growth

- **The cost scales with `.grugops/context`, at 2 whole-tree reads per run.**
- **The projection** is arithmetic over the two admissible readings and has no state. It is ≈ 0.153 s +
  0.215 s × N / 2630, which crosses 650 ms at N ≈ 6,100 notes.
- **The record grows by ~39 notes a day.** It counted 1682 → 1970 → 2513 → 2645 from 2026-08-21 to 2026-10-12
  (`probe/record-growth.out.txt`).
- **The trigger is 4,000 notes**, where the projection reads ≈ 0.48 s.
- **Not `N8-LANE` text.** One file reads the record, so this is a risk and not a clause. Lift it into `N8-LANE`
  if a second test file reads the record.

## Item 5: what is unchanged

- **The NFR rows:** `NFR-001`–`NFR-008` hash `c74e742698b5…0d3b` before and after, and all nine `NFR-` rows hash
  `6b62892c…6b41` before and after. No row was changed on purpose, so no new hash is given.
- **`RISK-ABC144-FCAP` is unchanged.**
  - A1 binds below a 0.667 s base only.
  - A2 is a narrow-set instrument.
  - The full-lane 4.1.11, k = 2 twin R is still owed. For a future full-lane twin, only the zeros-dropped sign
    convention applies, and ties are rare at a ~20 s base.
