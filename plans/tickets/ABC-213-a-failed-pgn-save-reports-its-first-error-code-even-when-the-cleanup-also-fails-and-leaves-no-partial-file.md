---
id: ABC-213
title: "A failed PGN save reports its first error code even when the cleanup also fails, and a single fault leaves no partial file: guard the cleanup unlink and pin both"
status: in-design
column: In Design
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

## Design ruling

> **Architect/Design, 2026-10-24** (task `arch-design-ABC-213`, records plus light probes, at `main` `af4a934c`).
> Notes: `.grugops/context/arch-design-ABC-213/notes/`. The probes ran on a scratch copy of `src/` in the session
> scratchpad (`design213/`), never `src/`. **No accepted ADR is changed and none is proposed, so the owner STOP
> does not fire.** The host was at load1 about 6, with other hops running, so no timing figure here is a reading.

### The ruling: rig (b′), the `node:fs` double of rig (b), hosted in the existing `src/pgn.test.ts`. 0 spawns, 0 files

| rig | `ADR-0015` | spawns | files | verdict |
|---|---|---:|---:|---|
| (a) hook in the writer child | **refused by the letter.** It is "a module substitution inside a spawned child", and `node:fs` fails (S): it is not a supplier at `runTurnLoop`'s bag (`src/cli.ts` imports no `node:fs`). Licensing it needs an addendum that scopes the rule to children that run the delivered composition, which is an accepted-ADR change (owner) | 0 | 0 | **not ruled.** Works mechanically (probe 1), but buys nothing (b′) does not |
| (b) `vi.mock("node:fs")` in a new file | **outside the rule.** In-process, not a child. `ADR-0009` 9c holds: the double lives in a test file | 0 | +1 | **the fallback** (`N8-LANE` reading owed) |
| **(b′) the same double, in `src/pgn.test.ts`** | **outside the rule**, as (b) | **0** | **0** | **RULED** |
| (c) a new child with `--import` | refused by the letter, as (a) | +1 | 0 | not ruled |

**Why (b′).**
1. **It needs no ADR change.** `ADR-0015`'s rule is stated for "a module substitution inside a spawned child". An
   in-process double is outside its letter. Standing practice confirms it: `src/engine.capacity.test.ts` and
   `src/gameend.nfr.test.ts` substitute modules in-process that fail (S), and no hop has read `ADR-0015` onto them.
2. **It does not walk round the fence.** `ADR-0015`'s reason for (S) is that a product module reached by a static
   import has no contract: "its source IS its behaviour". Here no product source is replaced. The holder runs
   byte-for-byte, and the substituted module is the platform's `node:fs`, which has a published contract: these
   calls throw errno-coded errors. **(C) holds:** `EFBIG` on a write, `EIO` on a close and `EACCES` on an unlink are
   all failures a real OS can give. **(N) holds** (BA/PM's): the rows assert `writePgnFile`'s results, not `node:fs`'s.
3. **It is the cheapest rig on every axis:** 0 spawns, 0 files, and the writer child stays byte-identical. It also
   matches the page's own Scope 2 ("in the existing `src/pgn.test.ts`") and `A7` (one `spawnSync` site).
4. **Rig (a) is not proposed.** `ADR-0015` clause 2: "a widening bought to unblock a ticket is a precedent, not a
   rule". Nothing here needs the widening. The addendum's case, should a later ticket need it, is in the decision note.

### The double: what the SE builds (test code only)

One hoisted `vi.mock("node:fs", importOriginal)` in `src/pgn.test.ts`, with `vi.hoisted` fault state.
- **It spreads the real module and doubles only the holder's five bindings**: `mkdirSync`, `openSync`,
  `writeFileSync`, `closeSync`, `unlinkSync`. The `default` export carries the same five. Every other binding the file
  uses (`mkdtempSync`, `readFileSync`, `readdirSync`, `rmSync`) is the real one, so no existing row is re-routed. That
  answers `src/gameend.nfr.test.ts`'s own-file reason ("would re-route the module graph for every test there").
- **Unarmed, the five pass straight through**, and a **relative** path throws loudly. Nothing in this file may write
  into the repository (`ADR-0047`'s first falsifier).
- **Armed** (per row, by `beforeEach`/`afterEach` or inline):
  - relative paths are re-rooted under the row's own `mkdtemp` directory. This stands in for `ADR-0047` D3's working
    directory seam, because `pool: "threads"` forbids `chdir`. The directory is removed by the exact path `mkdtemp`
    returned;
  - a write fault writes **one real byte** to the open descriptor through the real `writeSync`, then throws
    `{ code: W }`. That is `A2`'s "at least one byte reached the file", on the real disk;
  - a close fault closes for real, then throws `{ code: C }`;
  - an unlink fault throws `{ code: U }`, or, for `A3`, an `Error` with no `code`. Either way it removes nothing.
- **A canary before the first armed call.** The double's namespace carries a marker. The rows assert that the file's
  own `node:fs` namespace has it, so a mocking change in vitest goes red before any write can land outside the root.
- **Rows** (a new `describe("ABC-213 — …")`): `A1` write W + unlink U, and close C + unlink U; `A2` write W, and
  close C, each with `games/` read from the real root as `[]`; `A3` a codeless unlink throw leaves the call.
- **The holder fix stays the SE's.** The probe used a 4-line guard: `try { unlinkSync(path) } catch (error) {
  errnoOf(error); }`, then report `errnoOf(failure)`. It met `A1`–`A3`, and a codeless first failure still rethrows
  (D5). The file header gains one paragraph that names this ruling and states why the double is outside `ADR-0015`.

### Probe results (scratch copy at `af4a934c`; deterministic)

1. **Rig (a)** (the writer child's `-e` script plus `registerHooks`, which swaps `node:fs` only for a `?fault` copy of
   the holder): it works, and the real copy is unaffected.
   - Base: `A1` throws `EACCES` (X3 red).
   - Fix: all green.
   - X1 leaves 1-byte and 21-byte files (`A2` red).
   - X4 reports `EACCES` (`A1` red).
   - X5 returns `EFBIG` for the codeless throw (`A3` red).
2. **Rig (b)**, as a standalone file and **(b′)** hosted in a copy of `src/pgn.test.ts`, under the lane's own vitest
   4.1.12 with `viteModuleRunner: false` and Node 26.11.1: `vi.mock("node:fs")` reaches the holder.

   | holder variant | rows red (each host) | existing `pgn.test.ts` rows (b′) |
   |---|---|---|
   | base (= X3) | `A1` ×2 | 15/15 green |
   | fix | none (6/6) | 15/15 green |
   | X1 drop the unlink | `A2` ×2, `A3` | 15/15 green |
   | X4 report U | `A1` ×2 | 15/15 green |
   | X5 `catch {}` | `A3` | 15/15 green |

   No `games/` landed in the copy's root or `src/`. **Every `A4` plant reds the row it names, in both hosts.**
3. **Cost, indicative only** (load1 about 6, n = 5, one-file `vitest run`, process user+sys CPU):
   - `src/pgn.test.ts` with no edit: median 1.35 s; with (b′) added: median 1.42 s, so about +0.07 s;
   - the standalone (b) file alone: median 1.07 s. That cost is what (b′) avoids.

### NFR impact

- **`N8-SPAWN`: 0**, as BA/PM ruled.
- **`N8-LANE`:** (b′) adds no file, no spawn and no in-child content. The writer child is byte-identical, so its
  CPU growth is **0** against the page's 50 ms target. No `N8-LANE` reading is owed by the page's bars. The
  in-process cost (about +0.07 s indicative) is reported for Security/NFR's look under `ADR-0036` Ruling 2, which
  this ticket reaches anyway.
- **`ADR-0036` limb 1:** unchanged, five calls. **ASVS:** no row.

### `ADR-0047` D4 dated line (owed by Scope 3; drafted here, not written: this hop's fence excludes the ADR)

> **2026-10-24, `ABC-213`.** A reading, not a change. On a double fault (the write or close fails, then the cleanup
> unlink fails with an errno code), removal is best-effort. The result is the **first** failure's code (D5), and the
> partial file may remain. A codeless unlink throw is a defect and is rethrown (D5). `A1`–`A3` run in-process against
> a call-through `node:fs` double that re-roots relative paths (the `ABC-213` design ruling). `A8`–`A10` stay in the
> writer child.

It reverses nothing and adds no permission: D4 is silent on a failed removal, and D5 decides it. This role reads it
as below the owner's bar (delegation `…5aaf7cec` item 3, which escalates a change or a reversal). **The
Orchestrator confirms that reading when it routes the line.** If it reads the line as a change, the line goes to the
owner as INFO before it is written.

### Recommended next move (Orchestrator)

1. Merge this records branch.
2. Move ABC-213 `In Design` → `Ready for Dev`.
3. Queue the SE (`ticket-to-pr-ABC-213`, (b′) as above) **after** `qe-timing-ABC-203` reports, as the page's
   Dependencies say. Then QE runs the four plants and `A5` by hand, then `In Security/NFR` (Ruling 2 closes
   `AR-203-UNLINK`).
4. Route the D4 dated line to Architect/Design at the build's records step.
5. **Fallback**, if the SE or QE finds the hosted mock disturbs a row: the same block in its own file (rig (b),
   probed green). Its `N8-LANE` reading is then owed.
