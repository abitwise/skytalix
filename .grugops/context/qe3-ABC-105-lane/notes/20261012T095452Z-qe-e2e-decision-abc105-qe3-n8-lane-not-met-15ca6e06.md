---
id: 20261012T095452Z-qe-e2e-decision-abc105-qe3-n8-lane-not-met-15ca6e06
kind: decision
by: qe-e2e
task: qe3-ABC-105-lane
at: 2026-10-12T09:54:52Z
verified_by:
confidence: high
refs:
  - ABC-105
  - N8-LANE
  - NFR-008
  - ADR-0035
  - QE-105-x
  - plans/tickets/ABC-105-qe-hop-detector.md
  - 20261012T095451Z-qe-e2e-observation-abc105-qe3-n8-lane-reread-fc1f4a7c
  - 20261012T080100Z-qe-e2e-observation-abc105-n8-lane-narrow-set-met-7177253b
supersedes:
---

# QE3 `ABC-105`: `N8-LANE` is **NOT MET** at 650 ms CPU on the narrow set at `db1cfb6c`, by +0.040 s at the median

Hand-authored and unsealed (`AGENTS.md`). This is a grade under `ADR-0035` decision 1. It is not a stamp. The
readings are in `…fc1f4a7c`.

## The grade, step by step (window 3, n = 8)

- **Admissible.** The twin median is +0.000 s, 0.00 % of the 0.570 s base, which is within 1.5 %. Its sign is
  2/8, two-sided p 0.289, which is at chance.
- **Resolves 650 ms.** Twin R is 0.020 s, which is ≤ 0.650 s. The provisional `F` is 0.091 s, which is
  ≤ 650 ms.
- **Treatment median.** H − B reads **+0.690 s**, which is above 0.650 s, so the state is **NOT MET**.
- **Second NOT MET clause.** The treatment's lower end x(2), +0.670 s, is also above 0.650 s, which meets the
  "at any R" clause on its own.
- **By how much.** The median is over by **+0.040 s** (about 6 % above the bound). The interval is over by
  +0.020 to +0.050 s.

## What drives it (report only, no fix)

- **The file's five whole-tree reads of the real notes** account for 499.5 of its 538.3 in-worker ms, read
  from a single run's vitest JSON.
  - `A4`: 3 × `--sweep`, 282.0 ms.
  - `A9`: `--sweep lists ABC-073`, 109.4 ms.
  - `A3`: unfiltered `coverage()` over every note, 108.1 ms.
- **The fix added the last two** (`QE-105-p`'s closure). Before them, `qe-ABC-105` read +0.475 s, which was
  MET.
- **The cost grows with the notes tree** (2636 note files in the arm), not with the code.

## Status

- **`QE-105-x`** was LOW, and this re-read turns it into a **measured breach of `N8-LANE`**. QE suggests
  **MEDIUM** for it. The severity call, and what to do about it, belong to the Orchestrator and the owner.
- **Supersession.** `qe-ABC-105`'s MET (`…7177253b`) was for `60415a8a`. It does not carry to `db1cfb6c`.
- **Window 1** of this hop was inadmissible, and **window 2** was void because a foreign runner overlapped it.
  Neither is graded. Both are kept in `probe/`.
- **`F`.** This set now has an admissible twin R of 0.020 s at `db1cfb6c`. Recording the per-set `F` is
  Architect/Design's job (`ADR-0035` decision 3), and QE does not write it.
- **Not touched by this hop:** board, merge, the `Done` exit, and any change to the test file.
