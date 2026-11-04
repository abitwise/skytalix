---
id: 20261104T172018Z-ba-pm-observation-1db6e1a0
kind: observation
by: ba-pm
at: 2026-11-04T17:20:18Z
verified_by: 
confidence: high for what git, grep and sed show at main d7cd6871 (id scan over every local branch, ancestor checks, ADR text, rating.ts source); nothing run
refs:
  - bapm-ABC-301-cut
  - grugops/bapm-ABC-301-cut
  - ABC-301
  - ABC-239
  - ABC-271
  - ABC-272
  - ABC-280
  - ABC-283
  - ABC-287
  - ABC-290
  - ABC-293
  - EPIC-011
  - E2
  - E4a
  - ADR-0067
  - ADR-0070
  - ADR-0056
  - B-T4
  - B-T7
  - B-T8
  - F3
  - G2
  - C2-prime
  - Q-3K-11
  - QE-271-f
  - QE-271-g
  - QE-271-h
  - QE-271-i
  - QE-270-e
  - QE-283-a
  - R-N8H-1
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - UAT
  - secnfr-nfr008-1104
  - d7cd6871
  - 8d6ea5dc
  - 872e5ffc
  - 0c8b385a
  - 58e90d07
  - 48b98f43
  - orch-2026-10-30a/20261104T165451Z-orchestrator-decision-dda43b71
  - orch-2026-10-30a/20261104T162502Z-orchestrator-decision-264e420e
  - orch-2026-10-30a/20261104T020219Z-orchestrator-decision-4c76bf7a
  - arch-second-pull-1104/20261104T170627Z-architect-design-decision-4917f0f7
  - arch-second-pull-1104/20261104T170627Z-architect-design-decision-a5d74f70
  - arch-ABC-239-f3f4/20261104T020001Z-architect-design-observation-4eae0fd3
  - qe-ABC-271/20261104T162300Z-qe-e2e-observation-d0f7af61
  - qe-ABC-283/20261104T164437Z-qe-e2e-observation-d15c2a10
  - se-ABC-283-merge/20261104T170008Z-software-engineer-observation-f7f63e1d
supersedes: 
seal: sha256:1e7b6f1190de05329284d558fb82d2f7be7b9ef43b3261ec9970153ee3e92662
---

# bapm-ABC-301-cut observation: what the records and the harness source on `main` `d7cd6871` show, read before ABC-301 was written

BA/PM, task `bapm-ABC-301-cut`, records only. Read with git, grep and sed at `main` `d7cd6871`. Nothing was run.

- **The id is free.** No `plans/tickets/ABC-301*` exists on any local branch, from a scan of `git ls-tree` over every
  `refs/heads`. On `main`, `ABC-301` appears only in `ADR-0056`, `ADR-0067`, `plans/board.md` and
  `plans/traceability.md`, each as "next id" or "owed".
- **The dependencies are on `main`.** `git merge-base --is-ancestor` holds for each of these:
  - `872e5ffc` "merge(ABC-271): E4a structure only at 0";
  - `0c8b385a` "merge(ABC-280): tools/tune lands alone";
  - `58e90d07` "merge(ABC-283): the O1h+O3s+S1 bundle";
  - `48b98f43` "merge(arch-second-pull-1104)".
- **`ADR-0067` at `d7cd6871`:**
  - § Status and the decision log carry the owner's `…dda43b71` (the d6 amendment adopted; B-T8 re-confirmed).
  - The bars table's B-T8 row carries the re-confirmation.
  - The dated line under the table lists the four preconditions and the endgame `G2` row.
  - F3's row carries the restated form.
- **`ADR-0070` at `d7cd6871`:** d3 and d4 carry the `arch-second-pull-1104` dated lines (the endgame cost about
  1.12 ×; `pawnStructureForTest` accepted; `QE-271-g` and `-h` owed). d7 fits KD and FP eg ≥ 0 with U held at 0.
  F4 and F5 are as the page quotes them.
- **`ADR-0056`** carries § "Dated 2026-11-04 (`arch-second-pull-1104`), PROPOSED: the bundle read" at line 1361.
- **The `EPIC-011` pointer existed.** § The per-change rule already held the `bapm-ABC-283-done` pointer, which names
  that section, `Q-3K-11` and reading (b).
- **The `EPIC-011` owner rows were still open.** § Owner questions held the d6-amendment and B-T8 rows as open, with
  no `Q-3K-11` row.
- **The harness: `rpair` has no 0.5 s control.** In `tools/rating/rating.ts`:
  - `rpair` accepts `--elo`, `--rounds` and `--concurrency` only (the usage text);
  - the header notes (`ABC-247`, `ABC-255`) say `rpair` gives skytalix `Skill Level` 6 and plays the 4 000 ms
    budget (`R_BUDGET_MS`);
  - `R_BUDGETS_MS` (`--budget-ms` 500 / 100) is checked for mode `r` only.
  - So the 0.5 s control exists only as `r --budget-ms 500`. `ABC-239` A6 records the first pull's ruling "one
    `rpair`".
- **The `NFR-008` readings:** `QE-283-a`'s 9.60 s (`ABC-283` page); `se-ABC-283-merge` `…f7f63e1d`'s 9.77 s on the
  merged tree, ungraded (`plans/traceability.md`). The Security/NFR brief `secnfr-nfr008-1104` is in
  `.grugops/queue/pending/`, not yet done.
- **Pages that mention "the second pull"** with no id: `ABC-239`, `ABC-271`, `ABC-280`, `ABC-284`, `ABC-287`,
  `ABC-290`, `ABC-291`, `ABC-292`, `ABC-293` and `ABC-295`.
