# arch-ABC-283-accept decision: ADR-0063 (with K3), ADR-0065 and ADR-0066 are ACCEPTED 2026-11-04 as a bundle, by the owner's word, in force when ABC-283 merges. Each pay premise was overridden by the owner, not met; the one read was the bundle's

Architect/Design, task `arch-ABC-283-accept`, records only, on `grugops/arch-ABC-283-accept` from `main` `715beb1c`. Nothing was run, built or timed; the one command beyond reading was a read-only `git merge-tree` check (below). Inputs: the owner's ruling `orch-2026-10-30a` `…4c4cb03d` (ruling 2), the Orchestrator's `…6c6fb0be` (K3), `…c7609f51` (re-pins) and `…2409cec9` (dispositions); QE's verdict `qe-ABC-283` `…de1dc511` and gaps `…f8f8c2cc` (read from `grugops/qe-ABC-283`); `se-ABC-283` `…d64042c4` (as built).

## What was written (memory-bank/50-decisions only)
- **`ADR-0063`:** a Status block, ACCEPTED as a bundle, **with K3 in force** (decision 4's quiet key is max(0, h)); the premise overridden, not met; the read the bundle's (C2′ 66.0 / 100, S′ 6.0 / 10, F5 does not fire); the as-built letter differences (killers at 500 000 + rank, the tier with SEE on, +7 exports, the all-off doors); R-283-LMR; the pre-merge condition QE-283-i. A new § Decision log (six rows). A dated line under § Decision's preamble.
- **`ADR-0065`:** the same Status block (as built: `src/see.ts` reused, its own −50 test `losingForOrdering`, losing captures at 100 000 + MVV-LVA between the killers and every history cell); a new § Decision log (five rows); a dated line under § Decision's preamble.
- **`ADR-0066`:** the same Status block (A100 as written; the KRK mate row re-pin 5 → 6, a pin); a new § Decision log (six rows); a dated line under § Decision's preamble; QE-283-c under decision 9 (the companion note).
- **`ADR-0056`:** one dated D2 block for rows O1h, O3s and S1 (the cells' new reading, the "parked" lines superseded, what the merge unholds).
- **`ADR-0060`:** R-283-LMR (the companion note).

## Judgments, flagged
- **"In force when ABC-283 merges"** is read with the Orchestrator's pre-merge condition (`…2409cec9` 1, QE-283-i): the acceptance takes effect at the merge on the re-read merged tree, not before.
- **The F5 rows are not edited.** The bundle's C2′ meets each ADR's own F5 line (43.0 for `ADR-0063`, 50.0 for `ADR-0065` and `ADR-0066`), but no reading isolates one ADR's share. Each Status says so.
- **Titles and file names keep the PROPOSED wording** ("its pay premise is not met on main"): sealed notes cite the paths, and the premise is still not met as measured.
- **Merge hygiene.** `grugops/ABC-283` carries `arch-ABC-283-mate`'s dated lines in `ADR-0063` § Status, at the same anchor. The new Status block sits directly under the heading, so `git merge-tree` of this tree against `grugops/ABC-283-merge` (`62151993`) is clean. Nothing else in the five ADRs is touched by that branch.

## Owed (BA/PM), not edited here
1. **`ABC-233`, `ABC-234`, `ABC-236` pages and front matter.**
   - `adr:` → "`ADR-0063` (with K3) / `ADR-0065` / `ADR-0066` ACCEPTED 2026-11-04 as a bundle by the owner's word (`orch-2026-10-30a` `…4c4cb03d` ruling 2) on `qe-ABC-283` PASS_WITH_GAPS `…de1dc511` (C2′ 66.0 / 100); in force when `ABC-283` merges. The premise was overridden, not met."
   - DoR item 10 → "ADR accepted as a bundle (`ABC-283`)"; the "PARKED" banner is superseded by a dated line naming `ABC-283` as the build.
   - `status` / `column`: on `ABC-283`'s merge, each page is delivered by `ABC-283` (the board move is the Orchestrator's; BA/PM sets the front matter to match it).
   - `ABC-233` only: the table is 32 KiB, not 16 KiB (`ADR-0063` § Consequences, still owed), and the quiet key is K3's max(0, h).
   - `ABC-234` only: the build reuses `src/see.ts` (`ABC-279`); its −50 test is its own, beside Q1's 0.
   - `ABC-236` only: the KRK mate row is at iteration 6 (a pin; `ADR-0066` d9 holds); QE-283-c's optional iteration-5 mate row.
2. **`ABC-283` page front matter:** `status: ready` / `column: Ready` is stale (QE-283-g); `adr:` → "ACCEPTED as a bundle 2026-11-04, in force at this merge"; B5's pass branch applies.
3. **`EPIC-011` rows:** § Phases rows O1h, O3s and S1 (parked → accepted as a bundle, delivered by `ABC-283`); § Tickets rows for `ABC-233` / `ABC-234` / `ABC-236` / `ABC-283`; § Dedupe audit and § Dependencies lines that name them parked; the `ABC-283` cut banner ("`ABC-233`, `ABC-234` and `ABC-236` stay as the design pages") gets the outcome.
4. **Unheld after the merge** (`…2409cec9` 5): `ABC-282` (W1; its "held until `ABC-283` merges or misses" banner and DoR row), `ABC-286` (P4) and `ABC-288` (O2c) for their probes (each page's hold line and DoR row 10). `ABC-284` (P1) gains a pointer to R-283-LMR (`ADR-0060` § Status, 2026-11-04) under its trigger 2.

## Owed (Orchestrator)
- The board moves at the merge; confirm the merge-time reading of "in force" above.
