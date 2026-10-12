---
id: 20261012T121016Z-architect-design-decision-abc154-close-risk-rulings-b1-b4-4ef98a0b
kind: decision
by: architect-design
task: design-ABC-154-close
at: 2026-10-12T12:10:16Z
verified_by:
confidence: high
refs:
  - ABC-154
  - ABC-105
  - N8-LANE
  - NFR-008
  - ADR-0035
  - RISK-ABC105-LANE
  - T-QEHOP-GROWTH
  - QE-105-x
  - QE-154-b
  - QE-154-c
  - QE-154-d
  - plans/nfr-catalog.md
  - 20261012T113800Z-qe-e2e-decision-abc154-verdict-pass-with-gaps-n8-met-d9ae510a
  - 20261012T113700Z-qe-e2e-observation-abc154-n8-lane-met-4e153e76
  - 20261012T105617Z-architect-design-decision-abc105-owner-ruling-risk-floor-growth-2a41a1c4
  - 20261012T121015Z-architect-design-observation-abc154-w1-recomputed-59338ee3
supersedes:
---

# `RISK-ABC105-LANE` CLOSED on a MET at `0f8036f9`. `QE-154-b`, `-c` and `-d` are ruled, and T-c is re-homed as `T-QEHOP-GROWTH`

This note is hand-authored and unsealed (`AGENTS.md`). The full text is in `ADR-0035` § Addendum 2026-10-12
(after ABC-154), B1–B4, and in the catalog's "Closure" subsection. This note gives the rulings only.

1. **Closure.**
   - `qe-ABC-154` w1 reads **MET at 650 ms CPU**: +0.380 s (+0.350..+0.410), twin −0.005 s, R 0.030 s. The
     recompute is in `…59338ee3`.
   - The code is `0f8036f9`, and `main`'s blobs for the file and the tool equal it.
   - The trigger was T-b. The catalog's own rule says "write the reading and close the risk", and that is done.
   - **Not back-dated to `8fd0c233`.** The owner's +0.370 s ruling stays a ruling, and no margin is written.
2. **`QE-154-b`: it satisfies A1.**
   - The pre-registration `b9a5c957` was committed after the addendum `e7d8a09f` (which is its ancestor) and
     before the window's first run. It reached `main` with the same blob, `5b865730`.
   - The wording is clarified: committed before the first run, on a commit that has the addendum as an ancestor,
     reaching `main` with the same blob.
   - **No recorded state moves.** QE4's `9ed227fa` does not have `e7d8a09f` as an ancestor, and w1 is admissible
     under the pre-A1 rule too.
3. **`QE-154-c`: `F` stays 0.020 s CPU / 0.020 s wall.**
   - The median of three is taken over 0.010, 0.020 and 0.030.
   - Stated sensitivity: QE4 w2 is uncounted under forward-only A1. Counted, it would make CPU `F` 0.030 s.
     Neither value is near a cut.
   - In the floors block, one dated sub-bullet records the third reading. The value does not change.
4. **T-c survives the closure, as `T-QEHOP-GROWTH`** on `tools/grugops/qe-hop-integrity.test.ts`.
   - It fires at 4,000 note files on `main`. The count is 2660 at `b89b3fd2`.
   - When it fires, the set is re-read at `main`'s tip:
     - MET: Architect/Design sets the next threshold;
     - NOT MET: it goes to the owner, and the lever is the whole-tree read count;
     - NOT READ: the trigger stays armed.
   - Severity LOW. Architect/Design owns the record, QE reads, and the Orchestrator dispatches.
   - Re-anchored projection: ~0.49 s at 4,000. It crosses 650 ms at ≈ 5,960 (≈ 5,590 from the upper end).
     4,000 stays.
   - The lift clause is kept: if a second test file reads the record, this becomes `N8-LANE` text. None does at
     `b89b3fd2`.
5. **`QE-154-d`: no bearing on admissibility, and no new rule.**
   - Load is logged and never gated (decision 2; § Pointers: "The load level: none").
   - R-1's load1 ≤ 8 is the full-lane wall clause and does not apply to a narrow-set reading.
   - Load is not among the void conditions.
   - The data agree:
     - the treatment does not rise in the high-load rounds;
     - the load shows in the twin's R, at 0.030 s, which the median-of-three rule absorbs.
   - The burst's cause is `UNKNOWN - verify`.
6. **NFR rows.** No row was touched. `NFR-00[1-8]` still hash `c74e7426…0d3b`, and all nine still hash
   `6b62892c…6b41`.

**Owed by others, not by this role:**
- The board line that says the catalog entry is owed is the Orchestrator's to update. The board is fenced here.
- `ABC-154`'s ticket page is BA/PM's, if it wants to cite the closure.
