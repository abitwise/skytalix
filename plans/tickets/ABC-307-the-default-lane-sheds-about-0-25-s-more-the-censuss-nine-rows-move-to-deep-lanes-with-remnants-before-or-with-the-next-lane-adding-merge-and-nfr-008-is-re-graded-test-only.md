---
id: ABC-307
title: "The default lane sheds about 0.25 s more: the census's nine rows move to deep lanes with remnants, the qe-hop trio together or not at all, before or with the next lane-adding merge, and NFR-008 is re-graded with a twin (test-only)"
status: done
column: Done
closed: "2026-11-05, merged to local main at bce24018 (a merge commit); QE PASS (qe-ABC-307 …bec57958); A9 graded 9.085 s, H − B −0.350 s, read on the arms before the merge; UAT waived (test note 3; QE's verdict signs). A10: Security/NFR PASS_WITH_RISKS (…6c111277). Front matter and dated lines by bapm-lines-1106, 2026-11-06"
size: S
priority: P1
epic: EPIC-011
feature: —
---

# ABC-307: the census's nine rows to deep lanes, with remnants, and a graded `NFR-008` re-read

> **DoR 10 of 10, Ready: 2026-11-05, BA/PM** (task `bapm-ABC-307-lines`, records only, at `main` `91c21a9f`; nothing run). Row 10 closes on the Orchestrator's line
> (`…db111535` 1), over the Architect's reads (`arch-ABC-307-reads`: PREREG `…5c65a408`, observation `…f8c13d49`, decision `…727e0d0c`).
> - **All nine rows take form S.** No W, no K. Forms, remnants, lines and kills are measured, on scratch copies of `main` `8d66a706`.
> - **`AR-154-TWO-POINT-CONTROL` rides here:** `F1`–`F4` are on A4, A5 and A7, with `F1` in the deep lane (`…db111535` 2).
> - **Where they differ,** the rulings `…db111535` win first, then `ADR-0046` § Dated 2026-11-05 (`arch-ABC-307`) and (`arch-ABC-307-reads`) and the SE build lines in `…838ecf31` and
>   `…727e0d0c`, then this page. `ADR-0046` still reads `qe-hop` 35 and row 10 open: both predate the rulings.
> - The board shows the card in Backlog. Column moves are the Orchestrator's; this page records the `Backlog → Ready` exit only.
>
> **Cut 2026-11-05 by BA/PM: DoR 9/10, Backlog** (task `bapm-rows-cut-1105`, records only, at `main` `a21136b0`; nothing run, built or timed; every
> title and line below was read with `grep` / `sed`). The id was checked free on every local ref at the cut.
> - **Sources:** Security/NFR's decision `secnfr-census-1105` `…19cea480` and readings `…e5e57903`, and the Orchestrator's rulings `orch-2026-10-30a`
>   `…f40ce634`.
> - **Form:** `ABC-302`'s page and `ADR-0046`'s form S. Where they differ, the Architect's dated lines win over this page.
> - **Lane hygiene in `EPIC-011`, outside the phase order.** No bar on another ticket moves.

## Problem

- **User:** the owner, and every agent hop that runs `npm test` at a gate.
- **Pain:** `NFR-008` is MET, graded, at **9.515 s [9.31, 9.63]** on `572edf13`, headroom 0.485 s. That is 0.085 s under the 9.6 s line. The census's rule
  read **G-WITH**: m + 0.10 = 9.615 s ≥ 9.6 s, so the next lane-adding merge may go only with a row move merged first or in the same merge. The Orchestrator
  gave `ABC-305` no exemption (`…f40ce634` 1). `R-N8H-1` stays MEDIUM.
- **Growth:** three claimants at ≤ +0.10 s each (`ABC-303`, `ABC-305`, `ABC-289`) land 9.815 s. The realised need under 9.6 s is **−0.215 s**.
- **Value:** the skip probe read **−0.365 s [−0.49, −0.33], 8 / 8**, against the −0.31 s bar. Measured with the remnants (`…f8c13d49`): saved **592 of 750** at the sealed scale, about
  **−0.219 s** realised at 0.37 ms a ms, against the 581 that −0.215 s needs. So the lane lands near 9.596 s with all three budgets spent. The margin is 11 ms in-thread, about 0.004 s
  realised, and the read's noise is larger. Scaled row by row, not by the sum, the same read gives 569, about −0.211 s. These are forecasts; A9 grades them. No production line, NFR
  level, cap or lane command moves.
- **This is the last of the supply.** Every other default-lane row of ≥ 50 ms is a bar, a fine-step time row, a slice, a remnant, a pin or a guard (`…19cea480`).

## Scope

Lines are as read at `a21136b0`. **Rows are identified by title, not by line.** `ms` is the census's. Base, kept and saved are `arch-ABC-307-reads`' `raw/kept.tsv`: in-thread ms at
`8d66a706`, one core, one worker, median of three, ungraded. Every row takes form **S**.

| # | row (`it` title) | file: describe `:line`, it `:line` | ms | the full row's lane | the remnant's `it` title | base | kept | saved |
|---|---|---|---:|---|---|---:|---:|---:|
| Q1 | `ABC-105` A9 "--sweep lists ABC-073 as a finding" | `tools/grugops/qe-hop-integrity.test.ts`: `:136`, `:153` | 180 | `ENGINE_DEEP`, own file, option (ii) | "--sweep on a copy of the named folders lists ABC-073 as a finding, with its trap in the copy" | 252.2 | 13.9 | 238.3 |
| Q2 | `ABC-105` A3 "coverage() over EVERY real note (no --ticket folder filter) reads ABC-062 and ABC-073 as findings" | same: `:104`, `:121` | 90 | same | "coverage() over the named folders' real notes reads ABC-062 and ABC-073 as findings" | 129.9 | 7.3 | 122.5 |
| Q3 | `ABC-105` A4 "prints each count line and every finding by id, exits 1; 0 when every row is grandfathered" | same: `:163`, `:164` | 65 | same | "on a copy of the named folders: prints each count line and every finding by id, exits 1; 0 when every row is grandfathered" | 61.4 | 26.9 | 34.5 |
| L1 | `ABC-101` A8′ "A8′ — the seam built for each level moves exactly as `createLevel` does, on one seed and one injected clock" | `src/cli.test.ts`: `:4359`, `:4481` | 121 | `src/uci-session.test.ts`'s `ENGINE_DEEP` | "A8′ (sample) — levels 1 and the default: the seam moves exactly as `createLevel` does, on one seed and one injected clock" | 156.0 | 84.1 | 71.9 |
| L2 | `ABC-241` A4 "A4: with a legal ep capture available the same line is not a draw" | `src/cli.test.ts`: `:4622`, `:4679` | 77 | `src/uci-session.test.ts`'s `ENGINE_DEEP`, a describe of its own with L3 | "A4 (no search): with a legal ep capture available the two key lists are equal; on the uncapturable line they are not" | 116.8 | 0.3 | 116.4 |
| L3 | `ABC-241` A7 "A7: the move the search scores 0 is the move after which gameStatusOf reports the claim" | same: `:4622`, `:4685` | 62 | same describe | "A7 (no search): after d8e8, the move A4 (slice) pins, gameStatusOf reports the claim" | 76.8 | 3.5 | 73.3 |
| C1 | `ABC-171` A7 "two sessions on the same seededRandom(k) write the same bestmove sequence" | `src/uci-session.test.ts`: `:866`, `:899` | 54 | `ENGINE_DEEP`, own file | "two sessions on seededRandom(2), over the first two gos (a blunder, then the engine), write the same bestmove sequence" | 58.1 | 12.3 | 45.7 |
| C2 | `ABC-212` A9 "setoption name Skill Level value 7 sets 7: a bare go searches 30 000 ms" | same: `:1024`, `:1083` | 51 | `ENGINE_DEEP`, own file | "setoption name Skill Level value 7 sets 7: a bare go hands the engine 30 000 ms" | 51.2 | 1.9 | 49.3 |
| B1 | `ABC-094` A3 "ten seeds, one pick each, at least 3 distinct replies" | `src/book.test.ts`: `:258`, `:259` | 50 | `ENGINE_DEEP`, own file, option (ii) | "seeds 1 to 7, one pick each, at least 3 distinct replies" | 44.0 | 49.6 | −5.6 |
| | **total** | | **750** | | | **946.2** | **199.9** | **746.3** |

- **At the sealed scale (× 0.793): kept 158, saved 592 of 750.** B1's −5.6 is noise around a small saving: its three base reads run 34.6–59.3. **k is 7:** the third distinct reply is at seed 7.
- **The build is `ADR-0046`'s, measured.** The SE builds to `…838ecf31` § SE build lines 1–8 and `…727e0d0c` § SE build lines, which `raw/tip.py` wrote with `B1_K=7`. A remnant the SE varies is
  re-read on its mutant on a scratch copy.
- **The trio's sample.** `NAMED` is `ADR-0046`'s five-id pattern: 15 folders and 52 notes at `02e6e180`, which hold both positive controls and both traps. Q1 and Q3 run a plain `--sweep` through `{ root }`
  on a temp copy of those folders, the real board and the snapshot. Q2 reads `readNotes(<real context>, NAMED)`.
- **The qe-hop trio (Q1–Q3) moves together or not at all** (`…f40ce634` 2). `allNotes()` and `plainSweep()` are lazy and shared, so moving one row hands its cost
  to the next reader. Without the trio the skip read falls to about −0.20 s, which is short.
- **Form per row:** `ABC-302`'s. **S** is this cut (a remnant, plus the full row deep). **W** (no remnant) needs default-lane parity the Architect measured. **K**
  (the row stays) drops the row, and it spends the slack (A6). No row takes W or K.
- **The full row is defined only under its lane's constant.** With the flag unset it is not defined: no `it.skip`, no `skipIf`. The `it` title stays
  byte-identical. A deep describe goes after its constant: a reference above a `const` throws at load, and `uci-session`'s is at `:2160`. All five deep describes there go at the end of
  the file, after R8's block.
- **The remnant takes the row's place** in the original describe. Its title states what it samples, and it asserts its own non-vacuity.
- **No new test file, no new environment variable, no new `AGENTS.md` lane line** (`R-N8H-3`). Option (ii) is `arch-ABC-302`'s: an existing variable under a new
  constant, the row reached only by its `-t` line. Here it is `ENGINE_DEEP`, under `const RUN_DEEP`, in `tools/grugops/qe-hop-integrity.test.ts` and `src/book.test.ts`.
- **One row is new, and it is deep only:** `F1` (A4), by `…db111535` 2.
- **Each row reverts alone,** except the trio, which reverts as one.

## Out of scope

- Every row the census excluded, including `history-pane.nfr` A11 (`ADR-0029`'s guard for `NFR-002`, withdrawn in `…19cea480`), `ABC-281`'s and `ABC-302`'s
  remnants, and `src/cli.test.ts`'s spawned children.
- Rows under 50 ms, and folding small test files together (`…19cea480`: an unread lead, `UNKNOWN - verify`).
- Production `src/*.ts`, `tools/grugops/qe-hop-integrity.js`, `vitest.config.ts`, `package.json`, `data/`.
- **The owner's levers:** `NFR-008`'s 10 s, W, `maxWorkers: 2`, the heap flag.

## The Architect's confirmation (DoR row 10, met 2026-11-05)

Read under PREREG `…5c65a408`, on scratch copies of `main` `8d66a706`, about 25 minutes of lock. What was asked, and what came back:

1. **The form and each remnant, measured.** All nine take S. The remnant is among the tip's default-lane killers of its own mutant, and the full row kills that mutant in its deep lane, for every row but
   one: C1's full row passes alone under MC1, at the tip and at base. That goes by `…db111535` 1 (A7). Kept ms: § Scope. The forecast: § Problem.
2. **A7's mutants:** the table in A7. "Only default-lane killer at base" did not hold, and for the trio it reads per trio. So A7 says "killed" per mutant: "only killer" holds for ML1 alone.
3. **`ABC-241` A7's own mutants (L3):** the eight are read and hold. Tip killers: F230 7, M2s 6, M4 20, QSEAMRAW 6, QPRIOROFF 15, QMATCH3 19, QTRIM1 29, S241M1 19.
4. **L1's place, each `-t` line, each count:** L1 goes to `src/uci-session.test.ts`'s `ENGINE_DEEP`. The lines and counts are in A4. The option (ii) variable is `ENGINE_DEEP`.
5. **`T-QEHOP-GROWTH`:** `ADR-0035` § Addendum 2026-11-05 C6; § NFR triggers and A10 here.
6. **`ADR-0046`'s dated sections:** both are written. The run rule reads 22 lines (A8).

BA/PM's four points, answered (`ADR-0046` § Dated 2026-11-05 (`arch-ABC-307`)):
- **L3's import.** `gameStatusOf` joins the existing `./history.ts` import, so no module is added. `TWIN` is a repeated fixture. A2 names both.
- **The floor on L2 and L3.** Neither remnant searches, so the floor has nothing to read, and both full rows keep step 100. `ABC-302`'s R2 and R8 remnants stand (`…f86e0257`).
- **C2 against P2.** The remnant kills P2a (the session reads `HARD_CEILING_MS` too, which the ADR first read wrongly) and is blind to P2b. A7 names P2b's holders.
- **Q1's plain `--sweep`.** It stays plain, on real notes, on a copy. What leaves the default lane is breadth over the whole real tree: `R-307-c`.

**The cut's K rule does not bind `R-307-c`.** Its guard has no default-lane holder under any form, and the Orchestrator accepted that (`…f86e0257` 3). Any later K routes by A6, and dropping the trio or all
three `cli` rows comes back to him (`…f40ce634` 2).

## Acceptance criteria

The base is `main` at the commit the build branches from. The tip is this ticket's delivered commit.

**Build (Software Engineer)**

- **`A1` (what the diff touches).** **Given** `git diff --name-only <base> <tip>`, **then** outside `.grugops/`, `plans/` and `memory-bank/` it lists only
  `src/cli.test.ts`, `src/uci-session.test.ts`, `src/book.test.ts` and `tools/grugops/qe-hop-integrity.test.ts`. No file is added or removed. `git -c core.quotePath=false
  diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` is **empty**. A remnant that needs a tool edit is a STOP to the Architect.
- **`A2` (bodies byte-identical).** **Given** the diff, **then** each moved row's body is byte-identical to base once the nesting indent is removed; no other row's title,
  body or `expect(` line changes; each moved row is defined only under a constant; the remnants are the only new default-lane code; added comments cite only `ABC-307`,
  `secnfr-census-1105`, the Architect's task and `ADR-0046`. A deep describe may repeat its row's small fixtures: C1's `goes` and `levelOneMoves`, C2's `searchAt`, L1's `LEVEL_WORDS` and a `newGame(START_FEN)`,
  L2's and L3's what R8's has plus `TWIN`. Any other exception is the Architect's, by name. His are:
  - `src/uci-session.test.ts`'s `./history.ts` import gains `gameStatusOf`;
  - `levelOneMoves`' loop in the default describe reads `goes.slice(0, 4)`;
  - `src/book.test.ts` and `tools/grugops/qe-hop-integrity.test.ts` gain `const RUN_DEEP = process.env.ENGINE_DEEP === "1"`;
  - the qe-hop file gains the `cpSync` and `afterAll` bindings, `NAMED` and `namedRoot`;
  - `STEP_MS`, `seamOf` and `scoreWith` leave `src/cli.test.ts`'s default describe;
  - L2's and L3's deep describe is titled "ABC-241 A4, A7 — the CLI: the ep twin and the claim [deep, ENGINE_DEEP=1]", not the original title plus the suffix.

  One more comes with the ruling, not from him (`…db111535` 2; § Open 3): `F1`'s row, the `node:fs` bindings its listing needs, and a comment on it citing `AR-154-TWO-POINT-CONTROL`.
- **`A3` (counts and names).** **Given** the vitest JSON report of `npm test` at base and tip, **then** the lane total at the tip equals base's, because no row takes W, with 0 skipped and all passing. **Base
  reads 2 709 in 71 files** at `8d66a706`, and it is re-read at the build's base. In each touched file the sorted full names equal base's with one name out and one in per S row: 9 out and 9 in over the
  four files. No " [deep" title appears, `F1`'s included, the files collected equal base's, and `lane-inventory` reports no findings.
- **`A4` (each moved row is green in its lane, by count).** **Given** the tip, **when** each of the nine lines below runs, **then** it prints **"1 passed"** with 0 failed. Exit 0 with 0 tests fails. Brackets and
  parentheses are escaped (`QE-248-a`). Each touched file's full deep lane exits 0 with 0 failed, and its passed count is base's plus the file's S remnants plus the rows moved in from another file, plus `F1` on
  the qe-hop file. `src/cli.test.ts` has no deep lane to read. The prefix of each line is `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run`.

  ```
  tools/grugops/qe-hop-integrity.test.ts -t "ABC-105 A9 — the security-nfr substitute is visible, not silent \(real notes\) \[deep, ENGINE_DEEP=1\]"
  tools/grugops/qe-hop-integrity.test.ts -t "ABC-105 A3 — the refs-only false pass is closed \(real notes\) \[deep, ENGINE_DEEP=1\]"
  tools/grugops/qe-hop-integrity.test.ts -t "ABC-105 A4 — the sweep's counts partition the Done rows \(real board\) \[deep, ENGINE_DEEP=1\]"
  src/uci-session.test.ts -t "ABC-101 — --difficulty selects a level, and the played engine is that level \[deep, ENGINE_DEEP=1\]"
  src/uci-session.test.ts -t "ABC-241 A4, A7 — the CLI: the ep twin and the claim \[deep, ENGINE_DEEP=1\] A4: with a legal ep capture available the same line is not a draw"
  src/uci-session.test.ts -t "ABC-241 A4, A7 — the CLI: the ep twin and the claim \[deep, ENGINE_DEEP=1\] A7: the move the search scores 0 is the move after which gameStatusOf reports the claim"
  src/uci-session.test.ts -t "ABC-171 A7 — the blunder path \[deep, ENGINE_DEEP=1\]"
  src/uci-session.test.ts -t "ABC-212 A9 — Skill Level reaches 7, and levels 6-7 take the rate-0 path \[deep, ENGINE_DEEP=1\]"
  src/book.test.ts -t "ABC-094 A3 — variety after 1\. e4 on seeds 1 to 10 \[deep, ENGINE_DEEP=1\]"
  ```

  - **Counts, `ENGINE_DEEP`, base → tip:** `uci-session` 265 → 270, `qe-hop` 32 → **36**, `book` 35 → 36. Base is `8d66a706`, re-read at the build's base. The default-lane counts do not move: `uci-session` 245,
    `book` 35, `qe-hop` 32, `cli` 109.
  - **How far these are read.** They are `vitest list` counts: no whole deep lane ran at base or tip, as sealed, so A4 gives the first passed counts. The list read `qe-hop` 35, and **36 is that plus `F1`,
    which is not built** (`…db111535` 2).
  - **`F1`** (`AR-154-TWO-POINT-CONTROL`, on `ABC-154`'s page). `allNotes().length` equals the number of `*.md` names under every non-symlink `.grugops/context/<folder>/notes/`. The number comes from a listing
    that opens no note. The check compares two counts and never a literal. **It is deep:** defined only under `RUN_DEEP`, so `A5` holds and `T-QEHOP-GROWTH` does not re-arm. It takes a describe of its
    own. Inside a trio describe, that describe's line above would read 2, not 1. The file's deep lane reads it.
- **`A5` (the trio).** **Given** the tip, **then** Q1, Q2 and Q3 have all moved, or none has. If they have, **then** with the flag unset no row in the file calls `readNotes` with
  no folder filter, or runs `--sweep` with neither notes nor a root injected. The copied root is the injected root this allows. Measured by the sentinel A5R, which throws on any unfiltered `readNotes` of the real
  tree: 3 red at base, 0 at the tip. QE repeats it.
  - **`F4`.** Whole-tree `readNotes` calls stay 2. There are 0 spawns and at most 1 new `it`. Skips are 0. Here the 2 is the deep lane's, counted by `ABC-154` `A4`'s method, and with the flag unset the count is 0. The
    one new `it` is `F1`'s; the remnants are A2's and A3's.
  - **`F4`'s listing cost** is read by the host ticket's `N8-LANE` re-read at 650 ms CPU, never estimated. **BA/PM's reading, not a ruling (§ Open 4):** `F1` is deep, so `npm test` never runs the listing, and A3's names
    show that. There is no default-lane cost to read, this ticket adds no `N8-LANE` read, and the fallback (one control id per folder form, the owner's lever) does not arise.

**List (Architect, read at the Ready line)**

- **`A6` (the skip-probe bar, −0.31 s).** The nine rows read −0.365 s, so the bar is met for the whole list (`…e5e57903`). No row takes K. **At kept 158 the margin is 11 ms:** saved 592 of 750 against the 581 that
  −0.215 s needs, on the sealed scale, and 569 on an unsealed scale. That is thinner than the read's noise, and the census's 113 ms is no longer there to spend. **So any K but B1 reads past the slack and goes to the
  Orchestrator** (`…db111535` 3). C1 alone lands at about 555. L3 with B1 or C2 is past it (`…f86e0257` 2). Past the slack the supply is short. No row is added in this ticket.

**Gate (QE, then Security/NFR)**

- **`A7` (kill parity, per row, measured).** **Given** the list below, frozen in QE's PREREG before any head run and applied to a scratch copy, **then** for each mutant: at base the default lane kills it; at the tip the
  default lane kills it, **with the row's remnant among its killers, named** (where the table names holders, those holders); at the tip the row's deep lane kills it. Say "killed" per mutant, not "only killer". A miss
  is a STOP to Architect/Design, not a waiver. Anchors: `arch-ABC-307-reads`' `raw/mut.py` and `raw/plants.py`. The killers as read: `raw/kill-matrix.tsv`, `raw/plants.tsv`.

  | row | mutants with the remnant among the killers | mutants a guard leaves the remnant on, and their named holders |
  |---|---|---|
  | Q1 | `q4a-readNotes-unfiltered-drops-secnfr`, `q4a-readNotes-unfiltered-drops-quality-gate` | |
  | Q2 | MQ2 | |
  | Q3 | MQ3 | |
  | L1 | ML1, M6, M7 | |
  | L2 | S241M2 | QMATCH1: `cli` A4 (slice), `uci` A4, `ABC-249` |
  | L3 | S241M1, S241M2, S241M4, M4 | F230, M2s, QSEAMRAW, QPRIOROFF, QMATCH3, QTRIM1: `cli` A4 (slice), `uci` A5 (slice), `cli` `ABC-230` A1 |
  | C1 | M6; MC1, lane only | |
  | C2 | MC2h, P2a | P2b: `ABC-221` A11, `ABC-220` A6 and A13, `ABC-221` A7, `ABC-259` |
  | B1 | MB1, M4, M4z | |

  - **`ABC-241` A7's own read is a named line of this list:** F230, M2s, M4, QSEAMRAW, QPRIOROFF, QMATCH3, QTRIM1 and S241M1 each stay killed by the tip's default lane, by the table's remnants and holders.
  - **`ABC-154`'s plants.** The rest of the set is `raw/plants.py`'s, loaded, not retyped. Every plant the base file kills, the tip file kills. The six memo plants are the exception, by design: the memos stay under the
    constant, so at the tip they read 0 in the default lane and go red on the deep rows, by base's names. Their default-lane read is the re-anchored `q4b`: `q4b-tip-named-read-empty` Q2's remnant,
    `q4b-tip-copied-root-empty` Q1's, `q4b-tip-both-empty (two faults)` both.
  - **C1, MC1 and M6** (`…db111535` 1). **MC1 is lane-only:** the default lane kills it at base and at the tip, with C1's remnant among the killers, and it has no deep leg. Its kill depends on how many sessions ran first, so
    alone on its `-t` line the full row passes, at base too. **C1's clause (d) reads on M6,** which the full row kills alone. **QE adds one order-independent form of MC1 to the PREREG and reads it at base and tip, in the
    hop it already runs. A miss there is a STOP.** It reads as every mutant above does. That form is `UNKNOWN - verify`: nobody has written or run one.
  - **`F2`** (`AR-154-TWO-POINT-CONTROL`). QE's two green plants, loaded verbatim from `.grugops/context/qe-ABC-154/probe/plants6.py` `extra` mode (`q5x-…-drops-qe-folders-real-tree-only` and
    `q5x-…-drops-quality-gate-except-ABC-031 (real tree)`), each turn **≥ 1** red at head and 0 at base. The unmutated head is green. **Head here is the tip under `ENGINE_DEEP=1`,** because `F1` is deep: both read 0 at base and
    0 in the tip's default lane, as `arch-ABC-307-reads` read them. Their red at head is a prediction, `UNKNOWN - verify`, until `F1` is built.
  - **`F3`.** Head ⊇ base by name over the 32 plants, QE's `own` plants and the two `F2` plants. Head is again the tip under `ENGINE_DEEP=1`, because the trio's names leave the default lane. `arch-ABC-307-reads` read its deep
    leg only where a trio row kills at base, and it left out `own`'s three random-half plants, which read differently on each run. QE's PREREG says how it reads those three.
- **`A8` (gates).** Lint, typecheck, unit and build are green. The default lane has 0 skips. `test-skip-integrity` and `lane-inventory` report no findings. `ADR-0046`'s run rule
  applies: QE runs every line of its set, which is **22** with A4's nine, and records each passed count: `ABC-167` A5 reads 4 passed and every other line 1 passed. The rule's trigger gains two files,
  `tools/grugops/qe-hop-integrity.js` and `data/opening-book/book.json`.
- **`A9` (`NFR-008`, graded with twin arms).** **Given** base and tip, **when** QE reads `npm test` as spelled, **then** the report gives H's median wall with its interval and max, H − B
  in wall and CPU, and the twin's admissibility and R, against 10 s, 9.6 s and 9.5 s. The conditions: a PREREG note committed before the first poll; ALONE inside the host
  lock; load1 ≤ 8 before each scored run; a per-run foreign-load check (`R-CEN-1`; `…b9038a14`'s `flags.py` rule); arms B, H and H2, where H2 is a `cmp`-verified identity twin of
  H (`ADR-0035` D1); n ≥ 8 scored rounds, round 0 discarded. It is the first graded read after this ticket merges (`…19cea480`), so it reads `main` (§ Open 1). How a reading routes:
  - **Target, not a bar: H − B ≤ −0.215 s** in median wall, graded, with an admissible twin (`…db111535` 3). A6's margin is thinner than the noise. A miss is a gap QE records and the Orchestrator routes. The read is not
    re-played to pass, and no row is added in this ticket.
  - **The next lane-adding merge:** H's median goes through `…b9038a14`'s rule, G-GO, G-WITH or G-HOLD, and the routing is the Orchestrator's.
  - **The lane at ≥ 9.6 s after all budgets:** the standing rule applies (`…f30bd604` 2, `…db111535` 3): a row move first, the owner if the next graded read is still ≥ 9.6 s. § Problem's supply line stands (§ Open 5).
  - **H > 10 s** goes to the owner (`ADR-0035` D6). An inadmissible twin voids the reading, and it is re-read in another window.
  - *2026-11-06 (`bapm-lines-1106`; `…43e6d8fd` 5): **the read was on the arms, before the merge, not on `main`.** B `e01d39b1`, H `797bb1a5`, H2 its twin, under `…b17275dd`, which allows the branch with H's lane inputs equal. They are: the lane-input diff is empty at `main` `375f6362` (`…01f729cb`, `…bec57958`). The merge, `bce24018`, came after. No read of `main` after the merge stands as A9's, and QE's gap on that stays as QE wrote it. The nearest figure is another ticket's: `ABC-305`'s B arm, `a8594b50`, which is `main` with this ticket in, read 9.24 s [9.03, 9.31] (`…9c9e2a35`). It is that read's arm, and this page does not read it as A9's.*
  - *2026-11-06 (`bapm-lines-1106`): **the forecast against the read.** § Problem forecast −0.219 s realised (592 of 750, the sealed scale, at 0.37 ms a ms) and −0.211 s scaled row by row (569). `ADR-0046` § `arch-ABC-307`'s earlier forecast, before the remnants were measured, was −0.235 to −0.25 s, and it stands as a forecast. The skip probe read −0.365 s [−0.49, −0.33]. A9 read **−0.350 s** paired median wall, interval −0.500 to −0.220 s (`…78d1f873`). That is 0.131 s past the sealed forecast, 0.139 s past the row-by-row one, 0.100 s past the ADR's far end, and 0.015 s short of the probe. Why it landed past the forecast is `UNKNOWN - verify`: no record reads the cause. The read is one window. Its margin on the target, 0.135 s, is under the twin's wall R of 0.210 s, and one of its 8 deltas, −0.16 s, sits above the target (`…bec57958`). This line states figures only. `R-307-b` is not ruled here; its owner is the Orchestrator.*
- **`A10` (`R-N8H-1` and the catalog).** **Given** A9, **then** Security/NFR records `R-N8H-1`'s state by `…b9038a14`'s marks (BA/PM does not rule it), and writes `plans/nfr-catalog.md`'s
  `NFR-008` line by one dated insertion: the census's **9.515 s on `572edf13`**, with `R-N8H-1` MEDIUM, then A9's reading. It rides with the graded read (`…f40ce634` 5). No level moves.
  - **`T-QEHOP-GROWTH` retires at this ticket's merge, if the trio moved** (`ADR-0035` C6): not MET, and nothing is read. The 650 ms bound stands, and the set's last reading stays 4 272 notes. Its one dated catalog insertion
    rides here, or with a records hop after the merge.
  - **`R-N8H-2`:** the Architect reads it closed from the merge, since its cost ends with the whole-tree read (C6). Security/NFR records it here.
- **`A11` (records and QE).** `node tools/grugops/records-path-check.js --base main` exits 0 at the tip. A `qe-e2e` hop records its verdict before the ticket leaves In Review.

## NFR triggers

- **`NFR-008`:** `npm test` median wall ≤ 10 s at load1 ≤ 8, graded with an admissible twin (A9). This ticket's target, not a bar, is H − B ≤ −0.215 s; no NFR level moves.
- **`T-QEHOP-GROWTH`:** retires at this ticket's merge (A10). Until then a crossing of 5,500 note files is not read, and the backstop is **5,900** (`ADR-0035` C6; `…f86e0257` 4). `main` reads 5 441 at `91c21a9f`. If the trio
  is dropped, the read is due at once. It re-arms if a default-lane row reads the record whole again.
- **`NFR-010`** and the heap caps are untouched. **Security:** not triggered. Test-only, with no input, auth, data or secret surface.

## Test notes

1. **Freeze first.** A7's mutants and their base kill sets go in QE's PREREG before any head run, with the order-independent MC1 and the `F2` and `F3` plants.
2. **A1–A5 and A7–A8 need no quiet host. A9 does,** ALONE. Foreign load is recorded, never touched. The owner has been told, and he may hold his other project for it (`…f40ce634` 4).
3. **No UAT.** It is waived under the 2026-08-17 standing rule if A1's `grep` is empty. QE's verdict signs.
4. **Rows by title, not line.** If another merge lands first, re-read the line numbers. The titles hold.
5. **Rollback.** Revert the delivered commit. Each row goes back on its own, and the trio as one.

## Size and priority

- **`S`.** Nine rows in four files, one deep row for `F1`, A7's frozen mutants and A9's graded read. **Not `M`:** the rows and lanes are named, the form is `ABC-302`'s, and the Architect's remnants are measured. **Not `XS`:** A7 and A9.
  A tool edit, or a remnant the Architect cannot fit to this form, re-prices it.
- **`P1`.** The sealed rule holds the next lane-adding merge on it, and that merge is `ABC-303` or `ABC-305`.

## Dependencies

- **The Architect** (DoR row 10): § The Architect's confirmation. **Met 2026-11-05,** on `…db111535` 1.
- **Blocks:** this ticket merges **before or with the next lane-adding merge,** whichever of `ABC-303` and `ABC-305` that is (`…f40ce634` 1). `ABC-289` comes after them.
- **Waits on this merge:** `ABC-305`'s re-read, gates and deep lanes (its read went VOID; `…9e878ba6`), and QE's seal on `ABC-303` (`…d30513bc`).
- **Files:** by `git diff --name-only`, `grugops/ABC-303` at `2fd5243b` and `grugops/ABC-305` at `a321b45e` touch none of the four files.
- **Host:** A9 waits for an ALONE slot. **Owners:** SE A1–A5; Architect row 10 and A6; QE A7–A9; Security/NFR A10.

## Open, not bars (for the Orchestrator)

1. **"With" the next merge: answered.** This ticket merges alone and first, A9 reads `main`, and `ABC-305` re-reads on top (`…838ecf31`, `…9e878ba6`).
   *2026-11-06 (`bapm-lines-1106`; `…43e6d8fd` 5): it merged alone and first, at `bce24018`, and `ABC-305` re-read on top (`…9c9e2a35`). A9 did not read `main`: it read the arms before the merge, under `…b17275dd`, with H's lane inputs equal at `main` `375f6362`. See A9's dated line.*
2. **`ABC-305`'s A5: answered.** Its read went VOID. A re-read on the same harness, under a new PREREG, waits for this merge (`…9e878ba6`).
3. **`F1`'s A2 exception.** A2 keeps exceptions for the Architect, and he named none for `F1`. His "no further `node:fs` binding" (`…727e0d0c`) predates the ruling. This page reads it as following from `…db111535` 2.
4. **`F4`'s cost clause and `F1` on the run rule.** A5 reads the clause as having nothing to read. And `F1` is on none of the 22 lines, so a later tool edit runs the trio's three lines and not `F1`. The rule is
   `ADR-0046`'s, so neither is settled here. This hop's own read is A4's whole deep lane.
5. **A row move first, with no rows.** The standing rule (A9) starts with a row move, and § Problem says the census names none behind this ticket. Ruling 3 keeps the rule, and the page carries both.

## Risks

- **`R-N8H-1` (MEDIUM):** 9.515 s is not below 9.5 s. Owner: the Orchestrator. Remedy owner: Architect/Design. A10 records it.
  *2026-11-06 (`bapm-lines-1106`; `…6c111277`): **LOW, not closed.** By Security/NFR's marks on A9's 9.085 s [9.02, 9.17]: below 9.5 s, above 9.0 s. A risk rating, not an NFR level: `NFR-008` stays at 10 s.*
- **`R-307-a`: closed, measured.** L2's and L3's remnants search nothing, and L3's full row fits `uci-session` with one name added to an import.
- **`R-307-b` (LOW):** the margin on the −0.215 s need is 11 ms in-thread (592 against 581), about 0.004 s realised, inside the noise, and the supply is spent after this ticket. Owner: the Orchestrator (`…f30bd604` item 4).
- **`R-307-c` (LOW, accepted `…f86e0257` 3):** three things leave the default lane with no holder there: a malformed note or a symbolic link outside the named folders; the wiring of levels 2, 3, 4, 6 and 7 through the seam;
  a real level-7 search through the session. Cover: the 22 lines and the hand-run `--sweep`. Owner: Architect/Design.
- **`AR-154-TWO-POINT-CONTROL`:** its trigger `R-a` fired on this ticket, and `F1`–`F4` ride here (`…db111535` 2).
- **`R-N8H-2` (LOW):** note growth; closes from the merge (A10). **`R-CEN-1` (LOW):** foreign load voids timing reads (test note 2). **`R-N8H-3` (INFO):** applied, no new file.
  *2026-11-06 (`bapm-lines-1106`; `…b17275dd`, `…6c111277`, `…43e6d8fd` 4): **`R-CEN-1` reads MEDIUM.** Moved from LOW on 2026-11-05 and carried there on the day's count, five voided graded lane reads of seven, and it now covers any foreign load, not one project. No figure was wrongly read. The Orchestrator accepted it as a delivery risk for that day. Every timing read waits for the owner's word that the host is quiet; the slot gate alone does not protect a read. Owner: the Orchestrator.*
- **Moved breadth runs only deep.** Mitigation: `ADR-0046`'s run rule gains A4's lines, and A7 measures what leaves.

## Definition of Ready

BA/PM, 2026-11-05, at `main` `91c21a9f`. **10 of 10. Ready.** The cut scored 9 of 10 at `a21136b0`.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ 9.515 s graded, G-WITH; need −0.215 s realised; probe −0.365 s, 8 / 8; measured forecast −0.219 s, margin 11 ms in-thread |
| 2 | scope and out-of-scope | ✅ nine rows by title, file and line, each with its measured lane and remnant; `F1` the one new row, deep; no new file, lane line or variable; the census's exclusions and the owner's levers fenced |
| 3 | INVEST | ✅ one slice; each row reverts alone, the trio as one; testable by counts, names, mutants and a graded read |
| 4 | acceptance testable and measurable | ✅ name-only list; byte-identical bodies with exceptions by name; lane total 2 709; "1 passed" on nine named lines; deep counts 270, 36, 36; A6's 11 ms reading; a per-mutant kill table; `F1`–`F4`; H − B and ≤ 10 s |
| 5 | dependencies known | ✅ the Architect, met; merges alone and first; ALONE slot; what waits on it; owners |
| 6 | NFR triggers with targets | ✅ `NFR-008` ≤ 10 s, target H − B ≤ −0.215 s graded with a twin; `T-QEHOP-GROWTH` retires at the merge, backstop 5,900; security not triggered |
| 7 | test notes | ✅ five |
| 8 | size | ✅ `S` |
| 9 | priority | ✅ `P1`, argued |
| 10 | no major unresolved blocker | ✅ *2026-11-05, the Architect (`…727e0d0c`): not closed. Every form, remnant, `-t` line, count, kept ms and kill is measured and eight rows hold, but the PREREG closes it only with all nine S, and C1 misses (d) on MC1.* *2026-11-05, the Orchestrator (`…db111535` 1): MC1 is lane-only, C1 (d) reads on M6, QE adds one order-independent form of MC1 at base and tip, and a miss is a STOP. Row 10 closes on this line.* § Open 3–5 are not blockers |

**Recommended:** Ready, then `se-ABC-307`. Column moves are the Orchestrator's.
