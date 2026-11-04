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
