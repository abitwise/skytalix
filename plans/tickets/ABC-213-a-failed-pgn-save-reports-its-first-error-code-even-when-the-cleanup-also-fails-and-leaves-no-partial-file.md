---
id: ABC-213
title: "A failed PGN save reports its first error code even when the cleanup also fails, and a single fault leaves no partial file: guard the cleanup unlink and pin both"
status: ready
column: Ready
size: XS
priority: P3
epic: EPIC-006
feature: PGN export (ABC-203, ADR-0047)
---

# ABC-213: guard the cleanup `unlinkSync` in `src/pgn-file.ts`, report the first code, and pin "no partial file" and the double fault

> **Cut 2026-10-24 by BA/PM** (task `bapm-cut-levels-6-7`, records only, at `main` `6c0ab29e`). The rulings are in
> `.grugops/context/bapm-cut-levels-6-7/notes/`. This hop ran no test and no probe.
>
> **Source.** Security/NFR `…eaaa1133` § 5 accepted `QE-203-c` as **`AR-203-UNLINK`** (LOW) with "an XS follow-up
> (BA/PM cuts it, the SE builds it)", and recommended folding `QE-203-b` (`AR-203-LANEGAP` (b)) into it. The
> Orchestrator routed it here (`orch-2026-10-24c`). QE's findings are in `…f28588e1`. No bound moves.

## Problem

- **User:** the owner, who plays `npm run chess` and opens the saved PGN in an analysis tool.
- **Pain:** if writing the PGN fails **and** removing the partial file also fails, the unlink's error escapes
  `writePgnFile`. The session then ends with exit 70 and `internal error: a bug ended this session…` instead of
  `PGN not saved: <CODE>` and exit 0 (QE's reproduction, `qe-ABC-203/raw/a10/a10-cli-readings.txt` lines 16–19). That
  departs from `ADR-0047` D5 ("a failure is an errno code"). Separately, no lane row pins D4's "no partial file":
  QE's plant X1 (drop the unlink) passes the lane.
- **Value:** a save failure always ends the way `ADR-0047` promises, and a regression that leaves partial files goes
  red. The reach is low (two faults at once), and it fails closed today, hence XS and P3.

## Scope

1. **The fix** (`src/pgn-file.ts`, the cleanup branch only): the `unlinkSync(path)` after a failed write or close is
   guarded. An errno-coded unlink failure is dropped, and the result carries **the first failure's** code. A throw
   with no errno code still leaves the function (D5: a defect is rethrown).
2. **The pins** (in the existing `src/pgn.test.ts`): rows `A1`–`A3`, on the rig Architect/Design rules (§ Design
   owed).
3. **Records:** an `ADR-0047` D4 dated line (Architect/Design): on a double fault, the path's removal is best-effort
   and the first code is reported.

## Out of scope

- **`QE-203-a`** (A10 pinned at the CLI). It is **not cut**: it stays the accepted residual `AR-203-LANEGAP` (a). A
  CLI child costs a full entry-point spawn, and none of the existing outcome children can host a `games` regular file
  without breaking its own stderr pins. **Ride-along trigger:** the next ticket that adds an outcome child to
  `src/cli.test.ts`, or edits the PGN wiring in `src/cli.ts`, folds the A10 row in (or pays for its own spawn).
- The `games` symlink (`AR-203-SYMLINK`), any new mode, any change to `src/cli.ts` or `src/pgn.ts`.
- `QE-203-d`, `QE-203-e` (INFO).

## Acceptance criteria

- **A1. Double fault → the first code** (`AR-203-UNLINK`, `QE-203-c`).
  - **Given** `writePgnFile`, where the write to the open descriptor fails with errno code `W` and the cleanup unlink
    fails with errno code `U ≠ W`, **when** it returns, **then** the result is `{ ok: false, code: W }` and nothing is
    thrown.
  - The same holds when the close fails with `C` (and the write succeeded) and the unlink fails with `U`: the result
    is `{ ok: false, code: C }`.
- **A2. Single fault → no partial file** (`QE-203-b`). **Given** the write fails with an errno code **after at least
  one byte reached the file**, and the unlink succeeds, **when** it returns, **then** the result is
  `{ ok: false, code: W }` and `games/` holds **0** files. The same holds for a close failure.
- **A3. A defect still escapes.** **Given** the unlink throws an error with no errno code, **then** that error leaves
  `writePgnFile`, so the guard does not swallow it.
- **A4. Plants** (pre-registered; each must red at least one of `A1`–`A3` at head):
  - X1: drop the unlink → `A2`;
  - X3: today's unguarded unlink → `A1`;
  - X4: the guard reports `U` instead of the first code → `A1`;
  - X5: the guard swallows every throw (`catch {}`) → `A3`.
- **A5. The red test, by hand** (QE). QE's `.grugops/context/qe-ABC-203/raw/scripts/unlinkfault.mjs` (write EFBIG +
  unlink EACCES through a resolve hook, the CLI spawned, `resign`) gives:
  - at base: exit 70, as recorded;
  - at head: **exit 0**, stderr exactly `PGN not saved: EFBIG\n`, and the stdout tail equal to the control's.
  - The control, `unlinkfault-control.mjs`, is unchanged at head: `PGN not saved: EFBIG`, exit 0, 0 files.
- **A6. The holder's contract holds.**
  - `src/pgn-file.ts`'s diff touches the cleanup branch only.
  - It still has one `node:fs` import, one export and no `process.` reference, and it writes nothing to stdout or
    stderr.
  - It binds the same five calls (`ADR-0036` limb 1).
  - `src/cli.ts` and `src/pgn.ts` are byte-identical to base.
- **A7. Lane cost.** 0 new spawned children (`src/pgn.test.ts` keeps exactly one `spawnSync` site), unless the rig
  ruling says otherwise (§ Design owed, (c)). The existing guard "the neutral `games/` holds one file per `PGN saved:`
  child" stays green. Every `ABC-203` row passes with no edit to its expected values.

## NFR triggers

- **`ADR-0036` clause (b): fires.** It is an edit to a limb-1 holder, so Ruling 2 routes it to **In Security/NFR**
  after QE. That hop also closes `AR-203-UNLINK`, once QE reads the plant red then green (`…eaaa1133` § 5).
- **`NFR-008` / `N8-SPAWN` (`SEC-203-a` ruled here).**
  - **No criterion of this ticket forces a child.** `A1`–`A3` are about `writePgnFile`'s results, not about a process.
    So **nothing is chargeable to `N8-SPAWN`** (charge 0 ms), whatever rig is ruled. A child added for convenience
    is the ticket's own cost under `N8-LANE`.
  - Rig (a) adds in-child content only. Rig (b) adds 1 file, so an `N8-LANE` reading is owed (the "adds a test file"
    bar). Rig (c) adds 1 spawn, gross on `N8-LANE`.
  - **Target:** the writer child's CPU, median of 5 at base and at head, reported by the SE. If it grows by more than
    50 ms, Security/NFR rules an `N8-LANE` reading.
  - **`SEC-203-a` disposition (BA/PM):** agreed with Security/NFR. The `ABC-203` writer child stays uncharged and
    gross on `N8-LANE`. `ABC-203`'s page says 0 spawns and delivers 1. Its dated erratum (1 spawn, licensed at design
    for `ERR_WORKER_UNSUPPORTED_OPERATION`, not `N8-SPAWN`-chargeable) is written by the next BA/PM hop that holds
    that page. This hop's fence excludes it.
- **ASVS L1:** no row changes. The nearest row, `V16.5.3` "fails securely", is L2. The fix restores D5.

## Test notes

1. The faults cannot come from the OS alone. A failed unlink after a successful open in the same directory needs a
   double (QE `…f28588e1`). `A2`'s "at least one byte reached the file" makes X1 discriminate, as QE's RLIMIT reading
   did (100 B left by the plant).
2. `A5` is QE's hand reading with the scripts already on `main`. It is not a lane row.
3. UAT is owed (a production line changes). The QE verdict signs it under the owner delegation (`…5aaf7cec` item 2).

## Design owed (Architect/Design, one question, before the SE pull)

**Which rig may carry `A1`–`A3`?** QE's resolve hook substitutes `node:fs` as `pgn-file.ts` sees it. `ADR-0015`'s rule
covers "a module substitution inside a spawned child", and (S) needs a seam supplier at `runTurnLoop`'s bag, which
`node:fs` is not. `ADR-0015`'s (N) is BA/PM's, and it holds: the criteria assert the holder's results, not `node:fs`'s.
Precedent: the `ABC-200` follow-up ruled a hook-faking child rig unlicensed until an ADR says so (`…97a4b809`).

| rig | spawns | files | note |
|---|---:|---:|---|
| (a) the existing writer child registers a `node:module` hook and imports a second, query-suffixed copy of the holder | 0 | 0 | cheapest; needs an `ADR-0015` reading or addendum (it is not the delivered composition) |
| (b) a new in-process test file with `vi.mock("node:fs")` (no `chdir`, since nothing real is written) | 0 | +1 | `src/engine.capacity.test.ts` precedent; `N8-LANE` reading owed |
| (c) a new child with `--import` of the hook | +1 | 0 | not `N8-SPAWN`-chargeable |

**Recommended: (a).** If (a) is refused, (b). The criteria hold under all three.

## Size and priority

- **Size: XS.** One guarded statement, three rows and one dated ADR line.
- **Priority: P3.** LOW, fails closed, and needs two faults at once. **Trigger** (`…eaaa1133` § 5): any ticket that
  edits `src/pgn-file.ts` carries this fix before it merges, and so becomes the pull.

## Dependencies

- `ABC-203`'s code is on `main` (`5e23e249`, an ancestor of `6c0ab29e`). `ABC-203`'s own `N8-LANE` reading
  (`qe-timing-ABC-203`) is pending. **Pull `ABC-213` after that reading**, so the reading measures `ABC-203` alone.
- No file is shared with `ABC-212` or `EPIC-008`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ reproduced by QE (exit 70 vs exit 0); departs from `ADR-0047` D5 |
| 2 | scope and out-of-scope | ✅ fix + `QE-203-b`/`-c` pins; `QE-203-a` left with a ride-along trigger |
| 3 | INVEST | ✅ independent, XS, testable |
| 4 | testable, measurable acceptance | ✅ `A1`–`A7`: result values, 0 files, 4 plants, exit codes, byte-identical files |
| 5 | dependencies known | ✅ after `qe-timing-ABC-203`; rig ruling first |
| 6 | NFR triggers with targets | ✅ `ADR-0036` Ruling 2; `N8-SPAWN` 0; writer child CPU +≤ 50 ms or an `N8-LANE` reading |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ XS |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ✅ the rig question has a recommended answer and a fallback |

**DoR 10/10. Ready → In Design** (one question), then SE → QE → In Security/NFR (Ruling 2).
