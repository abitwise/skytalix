---
id: 20261010T183612Z-security-nfr-decision-catalog-r1-provisional-retired-node26-risk003-measured-ar133-recorded-d1e00b44
kind: decision
by: security-nfr
at: 2026-10-10T18:36:12Z
verified_by:
confidence: high
refs:
  - NFR-005
  - NFR-008
  - N8-LANE
  - RISK-003
  - AR-133-WRAP
  - AR-133-LOADER
  - F-138-1
  - QE-131-f
  - ADR-0003
  - ADR-0035
  - ADR-0037
  - ADR-0038
  - ABC-131
  - ABC-138
  - ABC-087
  - plans/nfr-catalog.md
  - plans/traceability.md
  - .grugops/context/wave-2026-09-25/notes/20261010T173005Z-orchestrator-decision-owner-word-eight-answers-6a1f3d92.md
  - .grugops/context/ruling-timing-protocol/notes/20261010T105455Z-architect-design-decision-qe-119-a-ruled-bound-checked-only-above-floor-narrow-file-set-nfr008-breached-both-clauses-recommend-rescope-16f50d6f.md
  - .grugops/context/design-owed-rulings-2026-10-10/notes/20261010T134751Z-architect-design-decision-six-owed-rulings-pointers-r5b-ticket-delta-95c73721.md
  - .grugops/context/qe-ABC-131/notes/20261010T145645Z-qe-e2e-observation-abc131-readings-margin-a4-07d83577.md
  - .grugops/context/secnfr-ABC-138/notes/20261010T170303Z-security-nfr-decision-abc138-pass-with-risks-wrap-discharged-loader-narrowed-scan-retired-91830257.md
supersedes:
---

# Catalog brought up to the owner's eight answers. `NFR-008` is re-scoped to R-1 (wall ≤ 10 s at load1 ≤ 8, CPU reported). `NFR-005`'s depth-7 `PROVISIONAL` marker is retired. The reference runtime is Node v26.11.0. `RISK-003`'s 0.8x is measured. `AR-133-*` is recorded. **One level moved, and it is the owner's.**

This note is hand-authored and unsealed. It is a `decision`, not a stamp: `human_admission` is `off`.
- **Branch:** `grugops/secnfr-catalog-2026-10-10-b`, from wave tip `dd5393bd`.
- **Why `-b`:** the id `secnfr-catalog-2026-10-10` was already used by the 11:12Z hop. Its branch (`3b37fee6`,
  merged) and its `done/` records were left untouched.

## Applied in `plans/nfr-catalog.md`

1. **`ADR-0035`, R-1, on `NFR-008`.**
   - **`Target`:** the R-1 level sentence (e), and the re-declared stack with the clause state (b). The old
     3 s / 15 s sentence is struck through and kept. The clause state is adapted: decision 5's BREACHED /
     BREACHED is on the old levels, and R-1 is not read at this hop.
   - **`Applies to`:** the seven `*_DEEP` variables (a), re-checked at `dd5393bd` and still seven.
   - **`N8-LANE`:** the instrument, resolution, floor-by-count and scope bullets (c).
   - **New section** above `ABC-074`'s (d), with the per-set `F` from `…95c73721` item 5.
2. **`NFR-005`: the marker is retired.** Depth 6 is the FAIL floor and depth 7 the WARN level. Both are
   ratified and read on the M3 reference. No number moved. The catalog holds no depth reading on v26.11.0.
3. **The reference runtime is v26.11.0.** v24.12.0 figures are history, with their runtime labels kept.
   - This hop read `node --version` = v26.11.0 and `npm --version` = 11.20.0. The row names 11.7.0; that
     is recorded, not ruled.
   - Dated notes went in at the `NFR-002` unknowns row, the `NFR-004` runtime note and fence, and the
     `ABC-074` subsections.
4. **`RISK-003`:**
   - **Step 1.25** = 19/24 readings (0.792x): 54/58, 0 NEWLY-MISSED.
   - **Step 1.3** reads the same 19 readings.
   - **Step 1.35** = 18 readings: 51/58, losing mate-in-3 seeds 1, 69 and 1163.
   - **One reading to spare.** The model margin is ≥ 26 % / ≤ 33 % (`QE-131-f`).
   - **Source:** read from `ABC-131` § Delivery and § QE, and `…07d83577`.
5. **`AR-133-WRAP` discharged, `AR-133-LOADER` narrowed** (LOW, owner BA/PM, event trigger).
   - **`loader-scan.mjs`:** retired from the per-diff routine, except on branches cut before `497d3b2f`.
   - This was not recorded before (0 catalog hits). `497d3b2f` is on `main`.

**Row hashes** (`sha256` of each `^| NFR-00n |` line, first 8 hex):
- **Changed:** `NFR-005` `00e245db` → `0b10362e`; `NFR-008` `080ba017` → `49127594`.
- **Unchanged:** `NFR-001` `fcae7ccf`, `-002` `75fcc5e2`, `-003` `b4e0d7f2`, `-004` `053ba48a`, `-006` `850ba137`,
  `-007` `a6121cbd`, `-009` `5ab79753`.
- **Eight-row hash:** `d7ee3487` → `c74e7426`. Table lines 66 → 70 (one new 4-line floors table).

## v24 mentions in ADRs and `AGENTS.md` (listed, not edited)

**`AGENTS.md`: 0.** The ADR mentions are 19 lines in 11 files. **None binds the reference forward.** Each is the
provenance of a figure taken on v24.12.0, which is true history:
- `ADR-0002`: :56, :111, :197
- `ADR-0003`: :72, :476
- `ADR-0004`: :162
- `ADR-0005`: :192, :225
- `ADR-0014`: :56 (the `NFR-008` breach ruling's machine line)
- `ADR-0016`: :20
- `ADR-0017`: :23
- `ADR-0018`: :65 (decision 4's evidence table, "toolchain on the measuring machine")
- `ADR-0019`: :82 (the 15 s ruling's machine line)
- `ADR-0024`: :35
- `ADR-0035`: :56, :57, :75, :85, :231 (this is the ADR that re-declares v26.11.0; each line names v24 as history)

**Recommendation:** no edit is owed. If the Orchestrator wants one, a dated pointer in `ADR-0014` and
`ADR-0019`, the two `NFR-008` level rulings, is enough. Outside the asked scope: `memory-bank/60-progress.md`
has 1 hit.

## `ADR-0037` / `ADR-0038` (recommend; no row added)

- **`ADR-0037`** (accepted by Architect/Design): **no new row.**
  - `NFR-006` (≤ 1 MB) is the book's row already.
  - **Owed at `ABC-093` `A5`:** fill `Verified by` from the delivered file, and settle MB vs MiB. The ADR reads
    1,048,576 B, and 356,295 B passes either way.
  - `N-LOAD` (3.5 ms) stays `ABC-094`'s bar.
- **`ADR-0038`** (proposed): **no new row.**
  - `LADDER_DEEP` is opt-in, not a gate. It joins `NFR-008`'s `Applies to` through the grep definition.
  - Its default-lane cost is +1 file by count.
  - The ~10 machine-hour verdict run is reported per run (decision 5), not levelled.

## Flagged (each with an owner)

- **Architect/Design:**
  - `--dir src` stops matching `npm test` when `ADR-0037`'s `tools/opening-book/book.test.ts` lands.
    `tools/` is not excluded in `vitest.config.ts`.
  - The file count at `ABC-084` reads 49 in the proposal and 51 in `ADR-0035`.
  - `N8-LANE`'s "5 % of the total" has no CPU level under R-1. All three are LOW.
- **Security/NFR, next `NFR-004` ruling:** the `Verified by` cell's open question is answered by the re-base.
  The cell was not moved.
- **Owner, via the Orchestrator:** W = 10 s rests on the Orchestrator's R-1 mapping of *"2. accept"*.

## Fence kept

Only `plans/nfr-catalog.md`, this note and one trace row were written. Nothing was measured, merged or pushed.
