---
id: 20261010T154202Z-ba-pm-observation-r5c-f1331-readings-at-5d55cc48-and-3159ab68-bd7b201e
kind: observation
by: ba-pm
at: 2026-10-10T15:42:02Z
verified_by:
confidence: high
refs:
  - R5c
  - QE-136-b
  - F-133-1
  - QE-133-a
  - QE-133-b
  - AR-133-LOADER
  - AR-133-WRAP
  - C14
  - ABC-137
  - ABC-138
  - src/history-pane.nfr.test.ts
  - src/cli.test.ts
  - .grugops/context/qe-ABC-136/probe/ledger.sh
  - .grugops/context/qe-ABC-136/probe/plantqe136.py
  - .grugops/context/secnfr-ABC-133/probe/loader-scan.mjs
  - .grugops/context/qe-ABC-133/probe/plants.sh
  - .grugops/context/bapm-cuts-r5c-f1331-2026-10-10/probe/RUN.txt
  - .grugops/context/bapm-cuts-r5c-f1331-2026-10-10/probe/f1331-plants.sh
  - .grugops/context/bapm-cuts-r5c-f1331-2026-10-10/probe/f1331-dryrun.sh
  - 20261010T154202Z-ba-pm-decision-r5c-cut-abc137-f1331-cut-a-and-b-abc138-c14-split-3b2a76f6
supersedes:
---

# Readings at `5d55cc48` and `3159ab68`: the `R5c` survivor is still green, all 12 `F-133-1` holes are still green, no accepted-risk trigger fires, and Security's (a) false-counts `C14`

This note is hand-authored and unsealed. The full output is in `../probe/RUN.txt`, from
2026-10-10T15:32Z to 15:36Z, Node v26.11.0, load1 6.7–12.0. Every planted build was a fresh `git
archive` tree; nothing was planted in a checkout.

## The wave moved during this hop

- The enqueue was `5d55cc48`, and this branch's base. The tip is now `3159ab68`: `ABC-129` merged
  `3730f28e`, and `ABC-132` was pulled.
- `src/history-pane.nfr.test.ts` is byte-identical across the two.
- `src/cli.test.ts` gained two comment hunks (+1 line), from `ABC-129`.
- A `grugops/ABC-132-stale-docblocks` branch exists at `3159ab68` with no commits of its own. It
  "touches" `src/cli.test.ts` only through `ABC-129`'s merge.

## `R5c` (QE's `ledger.sh` and planters, unchanged, at `5d55cc48`)

| build | exit | tests |
|---|---|---|
| `CONTROL` | 0 | 12/12 |
| `WPERFT-STATIC` | 1 | licence guard |
| `XHELPER-NARROW+FMT`, and `+WPERFT-STATIC` | **0** | **12/12** |
| `XSHADOW-HELPER+FMT+WPERFT-STATIC` | 0 | 12/12 |
| `QSCAN-NARROW` / `QLHS-INTERSECT` (`+FMT+WPERFT-STATIC`), `M15+FMT`, `M15SUB+FMT` | 1 | the drift tripwire |
| `WLAUNDER` | 1 | 3 (`A6.3`, `A6.4`, licence) |
| `WSTALELICENCE` | 1 | licence |

- **Raw text.** The framed helper occurs **1** time, and so does `plantqe136.py`'s `HELPER` anchor.
- **Collapsed text.** "it pins four spans of the guard by TEXT" occurs **1** time, and `R5c` **0**.
- **Call sites:** `:369`, `:583`, `:645`.

## `F-133-1`

- **`src/cli.test.ts` is byte-identical** at QE-133's head `82104f70` and at `5d55cc48` (blob
  `6afe2848`).
- **Trigger check (`loader-scan.mjs`).** At both tips it reads `childProcessArgCalls` `[]`, one
  `createRequire` site (`@1858`, then `@1859`) and `spawnSyncValueRefs` = the `ImportSpecifier` `@32`
  and the `CallExpression` `@343`. **Neither `AR-133-LOADER` nor `AR-133-WRAP` is promoted.**
- **Plants at `3159ab68`** (`probe/f1331-plants.sh`, QE's and Security's recipes byte-for-byte):
  18 runs, 0 aborted, **every one GREEN 67/67**. The holes are `X5`, `X5b`, `X6`, `X7`, `S2`, `S3`,
  `C5`–`C8`, `C10` and `Q14`; the controls are the unmutated file, `E-A1`, `S-CTRL`, `C13`, `C14` and
  `C15`.
- **Dry run** (`probe/f1331-dryrun.sh`: each plant applied to a copy, then `loader-scan.mjs`):
  - (a) lists one entry for each of `X5`, `X5b`, `X6`, `X7`, `S2` and `S3`;
  - (b) reads 3 for each of `C5`–`C8`, `C10` and `Q14`;
  - the unmutated file, `E-A1`, `S-CTRL`, `C13` and `C15` read `[]` and 2;
  - **`C14` reads (a) `["JSON.stringify@60"]`.** Its recipe ends `void JSON.stringify("child_process");`.
    The split is `C14-ARRAY` `[]` and `C14-ARG` `["JSON.stringify@60"]`.
- **Churn:** 37 commits touched `src/cli.test.ts` on the wave since 2026-08-01. Their subjects name
  18 tickets, and `ABC-129` also touched it.

## Not measured

- `A5`'s CPU at either tip. The last readings are QE's 173.2 ms and Security/NFR's 192.3 ms, cited
  on `ABC-138` rather than re-taken.
- The whole-suite run on the `R5c` survivor was not repeated. The Architect read 52 files / 1608 at
  `7f7e6b84`.
