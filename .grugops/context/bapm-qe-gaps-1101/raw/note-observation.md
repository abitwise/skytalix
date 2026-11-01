# Artifacts of `bapm-qe-gaps-1101`: two new ticket pages (`ABC-260`, `ABC-261`), `EPIC-010` rows 31–32, dated test notes on `ABC-233`/`236`/`237`/`238` and `ABC-251`, three trace rows; nothing else touched

Records commit `62399736` on `grugops/bapm-qe-gaps-1101` (from `main` `661828d5`; claim commit `dda56d80`).

- **`plans/tickets/ABC-260-…`** (new): XS, P2, `EPIC-010`, Backlog, DoR 10/10, Ready recommended. A1–A9, with a stop
  rule if A1 and A3–A5 cannot hold together.
- **`plans/tickets/ABC-261-…`** (new): XS, P3, `EPIC-010`, Backlog, DoR 10/10 conditional on `ABC-254`'s merge. A1–A9,
  with a stop rule if no board meets A2.
- **`plans/epics/EPIC-010-…`**: rows 31 (`ABC-260`) and 32 (`ABC-261`) appended to § Tickets after row 30. Each row
  states that its row number is not its pull order. No other line changed.
- **`ABC-233`, `ABC-236`, `ABC-237`, `ABC-238`**: § Test notes item 2 added (QE-249-a; one QE-249-b line). Scope,
  acceptance and DoR unchanged.
- **`ABC-251`**: § Test notes item 6 added (QE-259-c review habit; `ABC-260` named). Scope, acceptance and DoR
  unchanged.
- **`plans/traceability.md`**: three 10-cell rows appended (`ABC-260`, `ABC-261`, `bapm-qe-gaps-1101`).
- **Facts read for the pages** (raw `grep` of the files at `661828d5`, not a test run): `\bprocess\b` occurs in
  comments only (`src/evaluate.ts` 2 lines, `src/transposition.ts` 2). No line of the five core files or
  `src/levels.ts` holds a quote followed by `//` or `/*`. The `ABC-249` row has `label`, `withKeys` and `base` in
  scope. `ABC-254`'s `hasLegalMove` and `legalCapturesAndQueenPromotions` were read at `600d8de3`.
- **Not touched:** the board, `memory-bank/`, `src/`, `tools/`, `data/`, `EPIC-011`, `AGENTS.md`, the pages of
  `ABC-249`/`ABC-254`/`ABC-259`. Nothing run, built, timed, pushed or merged.
