---
id: 20261104T141111Z-ba-pm-observation-4cb87e83
kind: observation
by: ba-pm
at: 2026-11-04T14:11:11Z
verified_by: 
confidence: high for what git, grep and sed show at main 19581ca1; nothing run
refs:
  - bapm-ABC-282-adr
  - grugops/bapm-ABC-282-adr
  - ABC-282
  - ABC-300
  - ABC-078
  - ABC-283
  - ABC-276
  - ABC-275
  - ABC-255
  - ABC-223
  - ABC-222
  - ABC-266
  - ABC-238
  - EPIC-011
  - EPIC-009
  - W1
  - ADR-0071
  - ADR-0056
  - ADR-0052
  - ADR-0066
  - R-TC
  - OQ-0071-1
  - R-0071-1
  - R-0071-2
  - R-0071-3
  - R-0071-4
  - QE-275-a
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - src/engine.ts
  - src/uci-session.ts
  - src/engine.test.ts
  - 19581ca1
  - 9471eb32
  - 5853d17f
  - 4fb3da04
  - d1575d7a
  - arch-ABC-282/20261104T140129Z-architect-design-decision-0187186b
  - arch-ABC-282/20261104T140129Z-architect-design-observation-1938110b
  - arch-ABC-282/20261104T134523Z-architect-design-decision-5dbc040d
supersedes: 
seal: sha256:b00aa47c002690a0ff5c29bf55a6e5855f749ca95df767b21640312507a035b9
---

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
