# bapm-ABC-242-225-owner: facts read for the fold, and items seen but not acted on

Every fact here was read from committed records or with `git` at `main` `5090a4d6`. Nothing was run.

## Facts read
- **ABC-225 width-1 rate.** These R smokes ran at `--concurrency 1` with skytalix `st=4`, 10 games each:
  - `qe-ABC-228-ii` `…2123617d`: 11:20:50–11:56:58Z, 36.1 min;
  - `qe-ABC-241` `…5d70bb7c`: 13:55:52–14:28:29Z, 32.6 min.

  At 3 000 ms, `qe-ABC-230` (`…ba5a249a`, QE-230-b) read 27.6 min at width 1, with a Tctl median of 73.75 °C. The width-2 rate behind the old estimate is 44–46 games/h at 3 000 ms (`EPIC-010` § cost).
- **`rpair --concurrency`.** `git grep` on `grugops/ABC-225` shows that `tools/rating/rating.ts` takes `[--concurrency C]` for `rpair`, 1–8, default 2. So the owner's width 1 needs no code.
- **qe-ABC-225's block** (`grugops/qe-ABC-225` `3da78303`, `…3a53bdfc`): A1–A4 MET, and A5 and A6 unread after a THERMAL STOP at a Tctl median of 87.05 °C, width 2. QE's option (iii) said "its wall cannot project the width-2 pair". That is why A6 is re-worded.
- **Files in flight, from `git diff --stat main...grugops/ABC-229`:** `src/legal.ts`, `src/quiescence*.ts` and `src/search*.ts`. None is an `ABC-242` file. `ABC-243`'s A4 fence is `src/uci-session.test.ts` and `src/transposition.test.ts`, so it does not touch `src/cli.test.ts`.
- **ABC-221 and the whole-second reading.** `ABC-221` § NFR triggers reads "≤ 60 s" exactly (59 500 + ~31 + 100 < 60 000). Its A10 reads ≤ 60 000 ms of wall. Neither cites the whole-second reading, so the page is unchanged.

## Seen, not acted on (other roles' text)
- **`ADR-0052` D7** still says "If the owner rejects it, only the text of this entry and `A11`'s bound move". This is the Architect's text. A dated "confirmed 2026-10-30" pointer is LOW, for the next Architect hop.
- **`plans/nfr-catalog.md`** has two lines for Security/NFR, which fit `secnfr-catalog-rebase`:
  - `AR-UCI-BUSY`'s re-open condition "the owner declines the whole-second reading";
  - the dated line "already an open confirmation in the ticket's FOLDED note".
- **`EPIC-010` milestone 1's batch width.** It is about 9 h at width 2 and about 22–24 h at width 1 (estimated). This is the Orchestrator's to schedule, or to take to the owner. The owner's heat concern and the batch's wall pull in opposite directions.
- **`ABC-225` Scope 1's "3 000 ms"** is left as written. The dated line from `bapm-ABC-228-merge-fold` already reads it as 4 000 ms from the merge.

## Checks
- `git diff --check` is clean.
- The host-path, login and host-name scan of the added lines found 0 hits. The owner's catalog clause, which names the host, was deliberately not re-quoted.
- `reference-check` was not run, because it needs `node`: `UNKNOWN - verify`.
