---
id: ABC-300
title: "The harness plays a clock: `tools/rating/rating.ts d` accepts `--tc 40/8`, and both skytalix sides get tc=40/8, timemargin=0 and option.TimeMode=uci-clock-mode in place of st= and timemargin=, with a control: line in machine.txt. Any other --tc value, and --tc with --budget-ms, are refused. Every existing r, d and rpair dry-run print stays byte-equal (tools only; ABC-282 A6's harness, ADR-0071 D10)"
status: done
column: Done
size: S
priority: P2
epic: EPIC-011
feature: —
adr: "No new ADR. The control and its shape are ADR-0071 D10 (PROPOSED 2026-11-04, arch-ABC-282; the harness ticket's proposed scope, cut here by BA/PM). Where a control may be set is ADR-0056 R-TC part 1 item 1, which names cutechess-cli's tc= and timemargin and the shipped TimeMode option. R-TC item 4: 0 lines under src/"
---

# ABC-300: `d` plays a clock (`--tc 40/8`), so `ABC-282`'s read can run

> **Cut 2026-11-04 by BA/PM: DoR 10/10, Ready** (task `bapm-ABC-282-adr`, records only, at `main` `19581ca1`;
> nothing run). Source: `ADR-0071` D10 ("The harness ticket comes first. It is a tools ticket, and BA/PM cuts it")
> and the Architect's owed lines (`arch-ABC-282` decision `…0187186b`, "BA/PM, the harness ticket to cut"), with the
> harness finding in observation `…1938110b`. The id `ABC-300` was checked free on every local branch at the cut.
> - **No new ADR:** R-TC part 1 item 1 already allows a control set by `tc=`, `timemargin` and `TimeMode`, and
>   `ADR-0071` D10 fixes this one. It changes no engine rule.
> - **One change from the Architect's proposed scope (a BA/PM judgment, flagged):** `usage()` names `--tc 40/8`, so
>   `ABC-276` A5's pinned usage text is the one existing pair-check row that is updated (A4). Leaving `usage()` silent
>   would repeat `QE-275-a`.
> - The column moves are the Orchestrator's. The front matter reads Ready, the BA/PM exit.

## Problem

- **User:** QE, who plays `ABC-282` A6 (100 games at `tc=40/8` in `uci-clock-mode`). Behind QE, the owner, whose
  40/15 claim (`ADR-0056` C1) is played in that mode.
- **Pain, read in `tools/rating/rating.ts` at `19581ca1` (not run):**
  - `cutechessArgs` gives every skytalix engine `st=<ms/1000>` and `timemargin=` (around lines 417–430). No token
    can carry a clock or `option.TimeMode`.
  - `d` takes only `--budget-ms` 3 000 / 2 500 / 2 000 / 1 500 / 1 000 / 100 (`D_BUDGETS_MS`, line 112). Any other
    flag is refused with the usage text (around line 838).
  - A grep of `tools/` finds no `tc=` and no `TimeMode`. `ABC-222` and `ABC-223` played 40/15 from QE's own scratch
    `cutechess-cli` commands, not from the harness.
- **Value:** `ABC-282` A6 runs as one pinned command with C2′'s guarantees (built artifacts from the SHAs, sealed
  records, `EPIC-008`'s states). The alternative, a scratch command (`ADR-0071` § Alternatives A8), is ruled out.

## Scope

1. **`d` accepts `--tc 40/8`, the only value.** With it, each of the two skytalix sides (`name=skytalix` and
   `name=base`) gets `tc=40/8`, `timemargin=0` and `option.TimeMode=uci-clock-mode` in place of `st=` and
   `timemargin=`.
2. **Everything else is as `d --budget-ms 100`:** the openings, `-games 2`, `-rounds`, `-maxmoves 200`,
   `-concurrency`, `restart=on`, `-debug all`, the build of each SHA's `dist/uci.js`, the redaction and the sealing.
3. **Records:** `machine.txt` gets a `control:` line naming both sides' `tc`, `timemargin` and `TimeMode`. A real
   run's `cmd.txt` carries the argv as played, as today.
4. **Refusals:** `--tc` with `--budget-ms` is refused, and any `--tc` value other than `40/8` is refused, each with a
   non-zero exit before any build or process start.
5. **`usage()`** names `--tc 40/8` on `d`'s line.
6. **The pair-check rows** go in `tools/rating/pair-check.ts`, the offline check (`node --test`, not in the lane).

## Out of scope

- **`r` and `rpair`:** no `--tc`. They refuse it as any unknown flag is refused today (the usage text).
- **Any other control:** 40/15, sudden death, an increment (`ADR-0071` § Alternatives A9). A later read that needs one
  cuts its own ticket.
- **`--tc` for Stockfish** (an `r` clock). Not asked.
- **Reading the games:** period-end clock left, the `info string partial` share and mean completed depth are QE's,
  read from `-debug all` (`ADR-0071` D10). `summarise` already counts "loses on time" as a fault (`FAULT_TEXT`), so
  C-2 needs no new parsing.
- **Running `ABC-282` A6**, or any game at all. Every row below is a dry run or a refusal.
- **Any change to `src/`, `data/` or `vitest.config.ts`** (`ADR-0056` R-TC item 4).

## Acceptance criteria

All rows are offline: `--dry-run` prints or refusals. No engine and no `cutechess-cli` is started.

- **A1 (the new dry-run row).** **Given** `main` with this change,
  **when** `node tools/rating/rating.ts d <c> <b> <out> --tc 40/8 --rounds 50 --concurrency 1 --dry-run` runs,
  **then** it exits 0, writes nothing to `<out>`, and prints one `cutechess-cli` argv equal to the argv of
  `d <c> <b> <out> --budget-ms 100 --rounds 50 --concurrency 1 --dry-run`, except in each of the two engine blocks:
  - `st=0.1` is replaced by `tc=40/8`, in the same place;
  - `timemargin=50` is replaced by `timemargin=0`, in the same place;
  - `option.TimeMode=uci-clock-mode` follows `restart=on` (where `rpair` puts its `option.Skill Level=` token).

  No other token differs. The row compares the whole vector, not single tokens.
- **A2 (refusals).** **When** each of these runs, **then** it exits non-zero and prints no argv:
  1. `d … --tc 40/15`, `d … --tc 40/8+0.1`, `d … --tc 10+0.1` and `d … --tc x`. The message names `--tc`, the value
     given and `40/8`.
  2. `d … --tc 40/8 --budget-ms 100` and `d … --tc 40/8 --budget-ms 3000`. The message names both flags.
  3. `r … --tc 40/8` and `rpair … --tc 40/8`: refused with the usage text, as any unknown flag is today.
- **A3 (byte-equal elsewhere).** **Given** the same change, **then** every existing `r`, `d` and `rpair` dry-run print
  equals the one at the cut (`main` `19581ca1`), byte for byte: `r` at its default, at 500 and at 100; `d` at its
  default and at each of 3 000, 2 500, 2 000, 1 500, 1 000 and 100; `rpair` at its default. Today's pair-check rows for
  these (the `ABC-225`, `ABC-247`, `ABC-255`, `ABC-275` and `ABC-276` describes) pass unedited, with the one exception
  in A4.
- **A4 (the usage text).** `usage()` gains `--tc 40/8` on `d`'s line (and, if the Engineer adds one, a line saying
  what it does). No other usage byte changes. `ABC-276` A5's pinned usage text is the one existing row updated, to
  the new text. Its two cases (no mode; `rpair --budget-ms 100`) keep their meaning.
- **A5 (the engine is not changed).** **Given** the PR, **then** `git diff --name-only <base> <head> -- src/ data/
  vitest.config.ts` prints 0 lines. The diff touches only `tools/rating/`. In the A1 vector the control reaches
  skytalix only as `tc=`, `timemargin=` and the shipped `TimeMode` option.
- **A6 (records at a real run; checked at `ABC-282` A6, not offline).** **When** `ABC-282` A6 runs through this
  command, **then** `machine.txt` carries a `control:` line naming skytalix and base `tc=40/8`, `timemargin=0` and
  `TimeMode` `uci-clock-mode`, and `cmd.txt` carries the A1 tokens as played. QE reads both there, as `ABC-275` A6 was
  read at R1.
- **A7 (gates).** `npm run lint`, `typecheck`, `test` and `build` are green at every commit. The default lane gains 0
  rows (`pair-check.ts` is not a `*.test.*` file). `node --test tools/rating/pair-check.ts` passes in full.

## What happens on a miss

- **A3 shows any byte difference:** a defect. It is fixed before review, and no existing row is re-pinned to match.
- **A5 fails:** NOT MET. The change moves out of the engine before review.
- **A1's vector differs from the shape above in any token:** back to the Software Engineer. The shape is the
  Architect's (`ADR-0071` D10), so a different reading of it is the Architect's call.

## NFR triggers

- **`NFR-008`:** 0 new default-lane rows, and no run enters `npm test`.
- **Security (ASVS L1):** one new flag, `--tc`, validated as the exact text `40/8` before any build or process start;
  nothing else reaches the argv. `d` builds only the SHAs it is given (`ABC-204`).
- **Host:** none. Dry runs only. A6's host time (about 40 min, an estimate) is `ABC-282`'s.

## Test notes

1. Rows in `tools/rating/pair-check.ts`, in a new `ABC-300` describe. A1 is a whole-vector `deepEqual`, built from
   the `--budget-ms 100` vector with the three named token changes.
2. A3's byte-equality: the existing rows are the regression net and pass unedited (A4's one row is the exception).
3. No UAT: tools only (as `ABC-225`, `ABC-247`, `ABC-255`, `ABC-275`). QE's verdict signs.
4. `--dry-run` reads both tool paths at load, so the rows set `CUTECHESS_CLI` and `STOCKFISH` to any readable file,
   as `pair-check.ts` does today.

## Size and priority

- **Size: S.** One flag on `d`, three tokens per engine block, one `control:` line, three refusals, one usage line and
  about five rows. Like `ABC-275`.
- **Priority: P2.** It gates `ABC-282` A6, and W1 lands before the first 40/15 reading (`EPIC-011` § Phases W1).

## Dependencies

- **`ADR-0071` D10** fixes the control (PROPOSED; OQ-0071-1 pending). The tools change is harmless on its own
  (`ADR-0071` § Rollback), so the build may start now under reading (b). **If the owner declines `ADR-0071`, this
  ticket loses its only planned consumer**; the Orchestrator then decides whether to hold or drop it.
- **File overlap:** `tools/rating/` only. No open ticket edits `tools/rating/` (`ABC-295` and `ABC-299` are readings
  that play it). It can run beside `se-ABC-283` by width.
- **Blocks:** `ABC-282` A6 (not its build).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `d` emits only `st=` and takes only `--budget-ms` (read at `19581ca1`), so no harness command plays a clock |
| 2 | scope and out-of-scope | ✅ `d --tc 40/8` only; `r`, `rpair`, other controls, reading the games and `src/` out |
| 3 | INVEST | ✅ S; independent of every engine ticket; valuable (unblocks `ABC-282` A6) |
| 4 | testable, measurable acceptance | ✅ A1 a whole-vector `deepEqual` with three named token changes; A2 exit codes and messages; A3 byte-equal across the named prints; A4 one usage line, one row updated; A5 0 lines under `src/` / `data/` |
| 5 | dependencies known | ✅ `ADR-0071` D10 (PROPOSED, reading (b)); `tools/rating/` only |
| 6 | NFR triggers with targets | ✅ `NFR-008` 0 lane rows; one validated flag |
| 7 | test notes | ✅ 1–4 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ none. No new ADR is needed (R-TC part 1 item 1; `ADR-0071` D10). The owner's acceptance of `ADR-0071` decides whether A6 is played, not whether this tool is correct |

**DoR 10/10: Ready.** The column move is the Orchestrator's.
