---
id: ABC-275
title: "R1's harness: `tools/rating/rating.ts r` accepts `--budget-ms 100`, with skytalix at st=0.1 / timemargin 50 and Stockfish at st=0.1 / timemargin 2000. At 100 ms, `--elo` above 2 600 is refused. Every other argv, default, pin and dry-run print stays byte-equal (tools only; `ABC-255` item 2 narrowed to `r`)"
status: ready
column: Ready
size: S
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0056 D6, dated line of 2026-11-03 (arch-post-269 decision …8136b589: R1–R3 survive on C4's 100 ms reading; the harness gap and the change, § 2), with the pointer in D5 \"C4 and C1 re-pointed\". ADR-0056 R-TC item 4 (0 lines under src/). No new ADR: the change is ABC-255's design narrowed to r"
---

# ABC-275: `r` plays Stockfish at 100 ms, so R1 can run

> **Cut 2026-11-03 by BA/PM: DoR 10/10, Ready** (task `bapm-R1-cut`, records only, at `main` `30d15584`; nothing
> run). Source: the Architect's R1 ruling (`arch-post-269` decision `…8136b589` § 2, "The change (`tools/` only, S;
> `ABC-255` item 2 narrowed to `r`; `rpair` untouched)"), the owed-lines note `…1fa63931` item 2, and the
> Orchestrator's brief, which fixes the id and **P2** (it gates R1, and R1 goes before the next strength merge). The
> Architect's note wrote P3. The brief's P2 is followed because it is the Orchestrator's placement ruling (board,
> 2026-11-03: "R1 runs before the next value-changing merge").
> - The Ready column move is the Orchestrator's. The front matter reads Ready, the BA/PM exit.

## Problem

- **User:** QE, who reads R1 (`ABC-273`), and then R2 and R3. Behind QE, the owner, who wants to see the climb
  (`EPIC-011` G2).
- **Pain:** R1 cannot run today. The following was read in `tools/rating/rating.ts` at `30d15584`, not run:
  - `r --budget-ms 100` throws `--budget-ms 100: r takes only 500` (the check is around line 826).
  - `cutechessArgs` fixes Stockfish at `st=0.5` / `timemargin=2000` for every `r` run (around lines 420–434).
  - `rpair` is 4 000 ms, and `d` is self-play. No command plays C4's 100 ms reading against Stockfish.
  - The pair-check row `r refuses any --budget-ms but 500` asserts this refusal (`tools/rating/pair-check.ts` line 421).
- **Value:** R1 runs as one pinned command, in about 0.4–0.9 h (estimate, `…8136b589` § 3). The alternative ruled
  out is R1 at 0.5 s with today's tool: about 1.8 h, an owner ask, and a scale that C1 and C4 do not use.

## Scope

1. **`r` accepts `--budget-ms 100`.** At 100:
   - skytalix gets `st=0.1` and `timemargin=50` (the existing `SHORT_MARGIN_MS` entry for 100);
   - Stockfish gets `st=0.1` and `timemargin=2000` in place of `st=0.5`. Its other tokens stay as they are: `Threads 1`,
     `Hash 16`, `UCI_LimitStrength`, `UCI_Elo` E.
2. **At 100, `--elo` above 2 600 is refused** with a non-zero exit. Above E 2 600, C3′'s probe runs first
   (`ADR-0056` D5).
3. **Everything else is byte-equal to `main` at the cut:**
   - every dry-run print of `r` without the flag (4 000 ms) and of `r --budget-ms 500` (S′);
   - every dry-run print of `d` at each budget it takes today;
   - every dry-run print of `rpair`;
   - every default (`r`'s `--elo` 1 650, `--rounds` 100, `--concurrency` 2), every pin (the `cutechess-cli` and
     Stockfish sha256 values, the openings sha256) and the `--elo` range 1 320–3 190 at every budget other than 100.
4. **Records:** a real run's `cmd.txt` carries the argv as played. `machine.txt` gets a `control:` line at 100 that
   names both sides' `st` and `timemargin`. The S′ line at 500 stays byte-equal.
5. **The pair-check rows** go in `tools/rating/pair-check.ts`, the offline check (`node --test`, not in the lane).

## Out of scope

- **`rpair`:** no control and no flag. It stays byte-equal.
- **`d`:** no change.
- **Any other `r` budget.** `--budget-ms` 4 000, 1 000, 50 and any other value are still refused.
- **Changing `r`'s default `--elo`.** R1 writes `--elo 1810` out (`…8136b589` § 2), and the default stays 1 650.
- **A default for `CUTECHESS_CLI` or `STOCKFISH`.** Both stay required (`QE-269-j` is the Orchestrator's runbook
  line).
- **Tightening how `--budget-ms` is parsed.** `QE-255-b` (INFO: `500.0` / `5e2` / `0x1F4` are accepted) stays as it is.
  The value 100 parses exactly as 500 does.
- **C3′'s E > 2 600 probe.** This ticket only refuses that range.
- **Running R1** (`ABC-273`, QE's), and any game at all. Every row below is a dry run or a refusal.
- **Any change to `src/`, `data/` or `vitest.config.ts`** (`ADR-0056` R-TC item 4; the owner's condition carried from
  `ABC-255` A6).

## Acceptance criteria

All rows are offline: `--dry-run` prints or refusals. No engine and no `cutechess-cli` is started.

- **A1 (R1's dry-run row).** **Given** `main` with this change,
  **when** `node tools/rating/rating.ts r <sha> <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1 --dry-run`
  runs,
  **then** it exits 0, writes nothing to `<out>`, and prints one `cutechess-cli` argv equal to:
  - skytalix: `st=0.1`, `timemargin=50`, `restart=on`, and no `option.` token;
  - Stockfish: `st=0.1`, `timemargin=2000`, `restart=on`, `option.Threads=1`, `option.Hash=16`,
    `option.UCI_LimitStrength=true`, `option.UCI_Elo=1810`;
  - tail: today's opening file with `format=epd order=sequential -repeat`, `-games 2 -rounds 100 -concurrency 1`,
    `-maxmoves 200`, `-pgnout <out>/r.pgn`, `-debug all`.

  The row compares the whole vector, not single tokens.
- **A2 (byte-equal elsewhere).** **Given** the same change, **then** the dry-run print equals the one at the cut
  (`main` `30d15584`), byte for byte, for each of these:
  1. `r <sha> <out> --dry-run` and `r <sha> <out> --elo 1810 --rounds 5 --concurrency 1 --dry-run` (4 000 ms);
  2. `r <sha> <out> --budget-ms 500 --rounds 5 --concurrency 1 --dry-run` and the same with `--elo 1810` (S′);
  3. `d` at its default and at each of 3 000, 2 500, 2 000, 1 500, 1 000 and 100;
  4. `rpair` at its default.

  Today's pair-check rows for these (the `ABC-225`, `ABC-247` and `ABC-255` describes) pass unedited. The one
  exception is the refusal row in A3.
- **A3 (refusals).** **When** each of these runs, **then** it exits non-zero and prints no argv. In items 1 and 2
  the message also names the flag and the value given:
  1. `r … --budget-ms 4000`, `r … --budget-ms 1000`, `r … --budget-ms 50` and `r … --budget-ms x`: still refused. The
     message names the values `r` accepts, 500 and 100.
  2. `r … --budget-ms 100 --elo 2601` and `r … --budget-ms 100 --elo 3190`: refused. The message names 2 600.
  3. `d … --budget-ms 500` and `rpair … --budget-ms 100`: still refused, with today's message (`d`'s "not one of" and
     `rpair`'s usage text).

  Today's row `r refuses any --budget-ms but 500` (pair-check line 421, which asserts that 100 is refused) is the one
  existing row inverted. Its other cases keep their meaning, with the message regex updated.
- **A4 (the E 2 600 edge).** **Given** `--budget-ms 100`, **then** `--elo 2600` and `--elo 1320` each print an argv
  with `option.UCI_Elo=` that value (exit 0). **Given** `--budget-ms 500` or no flag, **then** `--elo 2601` and
  `--elo 3190` still print (exit 0), as today.
- **A5 (the engine is not changed).** **Given** the PR, **then** `git diff --name-only <base> <head> -- src/ data/
  vitest.config.ts` prints 0 lines (read from the PR's numstat at review). The diff touches only `tools/rating/`. In
  every A1 vector the control reaches skytalix only as `st=` and `timemargin=`.
- **A6 (records at a real run; checked at R1, not offline).** **When** `ABC-273` runs R1 through this command,
  **then** its `cmd.txt` carries Stockfish `st=0.1 timemargin=2000`, and `machine.txt` carries a `control:` line
  naming skytalix `st=0.1 timemargin=50` and Stockfish `st=0.1 timemargin=2000`. QE reads both under `ABC-273`
  R1-A2. No offline row is required: `QE-255-a`, a gap of the same kind, was declined by `bapm-qe-gaps-1101b`.
- **A7 (gates).** `npm run lint`, `typecheck`, `test` and `build` are green at every commit. The default lane gains 0
  rows: `pair-check.ts` is not a `*.test.*` file. `node --test tools/rating/pair-check.ts` passes in full, with every
  row green.

## What happens on a miss

- **A2 shows any byte difference:** a defect. It is fixed before review, and no existing row is re-pinned to match.
- **A5 fails:** NOT MET. The change moves out of the engine before review.
- **A1's vector differs from the shape above in any token:** back to the Software Engineer. The shape is the
  Architect's (`…8136b589` § 1, "Shape"), so a different reading of it is the Architect's call, not the Engineer's.

## NFR triggers

- **`NFR-008`:** 0 new default-lane rows, and no run enters `npm test`.
- **Security (ASVS L1):** no new input path. `--budget-ms` and `--elo` are validated before any build or process
  start, as today, and `r` builds only the SHAs it is given (`ABC-204`).
- **Host:** none. Dry runs only. R1's host time (about 0.4–0.9 h) is `ABC-273`'s.

## Test notes

1. Rows in `tools/rating/pair-check.ts`, in a new `ABC-275` describe beside `ABC-255`'s. A1 is a whole-vector
   `deepEqual`. The `stockfish(argv, elo)` helper fixes `st=0.5`, so A1 needs a 0.1 form of it. The 0.5 rows keep the
   old helper unchanged.
2. A2's byte-equality: the existing `ABC-225` / `ABC-247` / `ABC-255` rows are the regression net. They pass unedited
   (A3's one row is the exception). The Engineer may also diff the dry-run prints of A2's list against `30d15584` in
   the PR description.
3. No UAT: tools only (as `ABC-225`, `ABC-247`, `ABC-255`). QE's verdict signs.
4. `--dry-run` reads both tool paths at load, so the rows set `CUTECHESS_CLI` and `STOCKFISH` to any readable file,
   as `pair-check.ts` does today.

## Size and priority

- **Size: S.** One budget on `r`, Stockfish's `st` and `timemargin` by budget, one `--elo` guard, one inverted row and
  about six new rows. Low end of S. The brief allowed XS / S, and S matches the Architect's sizing.
- **Priority: P2.** It gates R1 (`ABC-273`), and R1 goes before the next value-changing merge (`ABC-239`, `ABC-270`,
  `ABC-271` or `ABC-272`). `ABC-274` is value-identical and does not close R1's window.

## Dependencies

- **`ABC-255` Done** (merged `87484808`). Met.
- **The Architect's ruling** (`…8136b589`, written into `ADR-0056` D6). Met.
- **File overlap:** `tools/rating/` only. No open ticket edits `tools/rating/` (`ABC-274` edits `src/`), so it can run
  beside `se-ABC-274` by width.
- **Blocks:** `ABC-273` (R1).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `r` refuses 100 and fixes Stockfish at `st=0.5` (read at `30d15584`), so R1 has no command |
| 2 | scope and out-of-scope | ✅ `r` at 100 only; `rpair`, `d`, defaults, pins and `src/` untouched |
| 3 | INVEST | ✅ S; independent of every engine ticket; valuable (unblocks R1) |
| 4 | testable, measurable acceptance | ✅ A1 a whole-vector `deepEqual`; A2 byte-equal across the named prints; A3 / A4 exit codes and messages at 2 600 / 2 601; A5 0 lines under `src/` / `data/` |
| 5 | dependencies known | ✅ `ABC-255` Done; the ruling is in `ADR-0056` D6 |
| 6 | NFR triggers with targets | ✅ `NFR-008` 0 lane rows; no new input path |
| 7 | test notes | ✅ 1–4 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 (Orchestrator's brief) |
| 10 | no major unresolved blocker | ✅ none. No owner item is involved (`…8136b589` § 3: a measurement setting inside the accepted D5 / C4 control) |

**DoR 10/10: Ready.** The column move is the Orchestrator's.
