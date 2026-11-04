# bapm-ABC-282-adr observation: the checks behind the ABC-282 and ABC-300 pages (read with git and grep at main 19581ca1; nothing run)

BA/PM, task `bapm-ABC-282-adr`. Every line below was read with git, grep or sed. No test, build or tool was run (only
the note seal and the records-path check).

- **`ABC-300` is free.** No `plans/tickets/ABC-300*` exists on any local branch (`git ls-tree` over every
  `refs/heads`), and no commit message names it. On `main` the id appears only in the Architect's records
  (`ADR-0071`, `…0187186b`, `arch-ABC-282` brief), the board header and the trace row, each as "next free".
- **The harness cannot play a clock on `main`** (`tools/rating/rating.ts`, 923 lines), confirming `…1938110b`:
  - `cutechessArgs` (from line 417) gives each skytalix engine `st=${ms / 1000}` and `timemargin=${timemarginMs(ms)}`,
    then `restart=on`, then `rpair`'s optional `option.Skill Level=`.
  - `D_BUDGETS_MS = [3000, 2500, 2000, 1500, 1000, 100]` (line 112); `d` refuses any other `--budget-ms` (line ~854).
  - Unknown flags go to `usage()` (line ~838): `r` allows `--elo --rounds --budget-ms --concurrency`, `d` allows
    `--rounds --budget-ms --concurrency`.
  - `machine.txt`'s `control:` line is written only for `SHORT_MARGIN_MS` budgets (lines ~882–889).
  - `grep -rn 'tc=\|TimeMode' tools/` finds nothing.
  - The tail is `-each proto=uci`, sequential openings with `-repeat`, `-games 2 -rounds N -concurrency C`,
    `-maxmoves 200`, `-pgnout`, `-debug all` (lines 451–454).
- **The usage text is pinned byte for byte** by `ABC-276` A5 in `tools/rating/pair-check.ts` (~lines 906–925), which
  is why `ABC-300` names it as the one existing row updated.
- **R-TC part 1 item 1** (`ADR-0056` ~line 1207) names "`cutechess-cli`'s `st=` / `tc=` / `timemargin`, … the harness
  under `tools/rating/`, and … the UCI options the product already ships (`Skill Level`, `TimeMode`, `OwnBook`)" as
  where a control is set. So `ABC-300` needs no new ADR.
- **`ABC-078` A3** is at lines 67–70 of its page, unchanged since its cut; the dated line sits directly under it.
- **No open ticket edits `tools/rating/`.** `ABC-275` and `ABC-276` are Done on the board; `ABC-295` and `ABC-299` are
  readings that play the harness.
- **The clock.** `date -u` read `2026-11-04T14:04:11Z` at the claim, after the brief's own `at` (`14:03:33Z`).
