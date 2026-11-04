# bapm-ABC-283-done observation: what the records on `main` `fd6b595f` show, read before the pages were written

BA/PM, task `bapm-ABC-283-done`, records only. Read with git, grep and sed at `main` `fd6b595f`; nothing run.

- **The merge:** `58e90d07` "merge(ABC-283): the O1h+O3s+S1 bundle (history with K3, SEE ordering, root aspiration) —
  C2′ 66.0/100 (+115 ± 67) — QE PASS_WITH_GAPS (signs UAT); re-read on main with ABC-271" is on `main`.
- **The board at `fd6b595f`:** the top line records **ABC-283 DONE** (merged `58e90d07`; QE `…de1dc511` signs UAT),
  "ADR-0063/0065/0066 now in force", "ABC-233/234/236 delivered by ABC-283" and "ABC-282 unheld". A `## Done` entry
  for `[ABC-283]` reads "Delivers ABC-233, ABC-234, ABC-236". The cards `[ABC-233]`, `[ABC-234]` and `[ABC-236]` are
  still in a Backlog list, with their older text (`[ABC-234]` and `[ABC-236]` with the 2026-11-03 PARKED line); `[ABC-282]`'s card still reads "Held: builds after
  ABC-283 merges or misses".
- **The ADRs at `fd6b595f`** (written by `arch-ABC-283-accept`, merged `5b5e57e7`): `ADR-0063`, `ADR-0065` and
  `ADR-0066` § Status open with "ACCEPTED 2026-11-04 by the owner's word, as a bundle … In force when `ABC-283` merges."
  `ADR-0060` § Status carries R-283-LMR (dated 2026-11-04). `ADR-0066` d9 carries QE-283-c's dated line.
- **The pages before the edit:** `ABC-233`, `ABC-234`, `ABC-236` were `status: backlog` with a PROPOSED / parked
  `adr:` and DoR 9/10 (row 10 ❌ on F4). `ABC-283` was `status: ready` / `column: Ready` (QE-283-g). `ABC-282` held
  "until `ABC-283` merges or misses" in its top banner, § Dependencies and the line under the DoR. `ABC-286` and
  `ABC-288` were held on `ABC-283` in their banner, § Dependencies and DoR row 10. `ABC-284` named `ABC-283` merging as
  trigger (2) with no R-283-LMR pointer.
- **`ABC-233`'s table size:** § NFR triggers and DoR row 6 already read 32 KiB (dated 2026-11-02, `bapm-records-1102c`);
  only "16 KiB" in struck text remains.
- **The QE figures used** are `qe-ABC-283` `…de1dc511`'s table and `…f8f8c2cc`'s gaps; the merged-tree figures are
  `se-ABC-283-merge` `…f7f63e1d`'s (`npm test` 2 687 / 2 687; lane head median 9.77 s on the quiet read).
- **The bundling rule's draft** is the Architect's task `arch-second-pull-1104` (its brief is in the pending queue at
  `fd6b595f`); no rule text is on `main` yet.
