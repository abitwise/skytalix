---
id: ABC-307
title: "The default lane sheds about 0.25 s more: the census's nine rows move to deep lanes with remnants, the qe-hop trio together or not at all, before or with the next lane-adding merge, and NFR-008 is re-graded with a twin (test-only)"
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-011
feature: —
---

# ABC-307: the census's nine rows to deep lanes, with remnants, and a graded `NFR-008` re-read

> **Cut 2026-11-05 by BA/PM: DoR 9/10, Backlog** (task `bapm-rows-cut-1105`, records only, at `main` `a21136b0`; nothing run, built or timed; every
> title and line below was read with `grep` / `sed`). The id was checked free on every local ref at the cut.
> - **Sources:** Security/NFR's decision `secnfr-census-1105` `…19cea480` and readings `…e5e57903`, and the Orchestrator's rulings `orch-2026-10-30a`
>   `…f40ce634`.
> - **Form:** `ABC-302`'s page and `ADR-0046`'s form S. Where they differ, the Architect's dated lines win over this page.
> - **Row 10 is owed to the Architect** (§ The Architect's confirmation). **Every remnant below is a proposal, and each row's kill parity is
>   `UNKNOWN - verify`.** The ticket does not go Ready before his dated line. Column moves are the Orchestrator's.
> - **Lane hygiene in `EPIC-011`, outside the phase order.** No bar on another ticket moves.

## Problem

- **User:** the owner, and every agent hop that runs `npm test` at a gate.
- **Pain:** `NFR-008` is MET, graded, at **9.515 s [9.31, 9.63]** on `572edf13`, headroom 0.485 s. That is 0.085 s under the 9.6 s line. The census's rule
  read **G-WITH**: m + 0.10 = 9.615 s ≥ 9.6 s, so the next lane-adding merge may go only with a row move merged first or in the same merge. The Orchestrator
  gave `ABC-305` no exemption (`…f40ce634` 1). `R-N8H-1` stays MEDIUM.
- **Growth:** three claimants at ≤ +0.10 s each (`ABC-303`, `ABC-305`, `ABC-289`) land 9.815 s. The realised need under 9.6 s is **−0.215 s**.
- **Value:** the skip probe read **−0.365 s [−0.49, −0.33], 8 / 8**, against the −0.31 s bar. Forecast with the remnants: −0.30 s (621 ms × 0.49). Realised at
  `ABC-302`'s 76 %: **−0.23 to −0.25 s**, so the lane lands at 9.565–9.585 s with all three budgets spent. The margin under 9.6 s is 0.015–0.035 s, inside the
  noise. These are estimates; A9 grades them. No production line, NFR level, cap or lane command moves.
- **This is the last of the supply.** Every other default-lane row of ≥ 50 ms is a bar, a fine-step time row, a slice, a remnant, a pin or a guard (`…19cea480`).

## Scope

Lines are as read at `a21136b0`. **Rows are identified by title, not by line.** Kept and saved ms are Security/NFR's estimates, `UNKNOWN - verify`.

| # | row (`it` title) | file: describe `:line`, it `:line` | ms | proposed lane | proposed remnant | est. kept | est. saved |
|---|---|---|---:|---|---|---:|---:|
| Q1 | `ABC-105` A9 "--sweep lists ABC-073 as a finding" | `tools/grugops/qe-hop-integrity.test.ts`: `:136`, `:153` | 180 | option (ii), own file | the same asserts on injected notes, a named-folder subset | | |
| Q2 | `ABC-105` A3 "coverage() over EVERY real note (no --ticket folder filter) reads ABC-062 and ABC-073 as findings" | same: `:104`, `:121` | 90 | same | the same five reads on that subset, which keeps `quality-gate-ABC-066-qe` | | |
| Q3 | `ABC-105` A4 "prints each count line and every finding by id, exits 1; 0 when every row is grandfathered" | same: `:163`, `:164` | 65 | same | the same partition on that subset and the real board | 20 (Q1–Q3) | 315 (Q1–Q3) |
| L1 | `ABC-101` A8′ "A8′ — the seam built for each level moves exactly as `createLevel` does, on one seed and one injected clock" | `src/cli.test.ts`: `:4359`, `:4481` | 121 | `CLI_DEEP` by option (ii), or `uci-session`'s `ENGINE_DEEP` | levels 1 and the default, three calls each, with the non-vacuity asserts | 35 | 86 |
| L2 | `ABC-241` A4 "A4: with a legal ep capture available the same line is not a draw" | `src/cli.test.ts`: `:4622`, `:4679` | 77 | `uci-session`'s `ENGINE_DEEP`, beside `ABC-302`'s R8 | the same two asserts on a 500 ms virtual step | 8 | 69 |
| L3 | `ABC-241` A7 "A7: the move the search scores 0 is the move after which gameStatusOf reports the claim" | same: `:4622`, `:4685` | 62 | same | every assert unchanged, on a 500 ms virtual step | 8 | 54 |
| C1 | `ABC-171` A7 "two sessions on the same seededRandom(k) write the same bestmove sequence" | `src/uci-session.test.ts`: `:866`, `:899` | 54 | `ENGINE_DEEP`, own file | the same two `levelOneMoves(2)` and their equality | 36 | 18 |
| C2 | `ABC-212` A9 "setoption name Skill Level value 7 sets 7: a bare go searches 30 000 ms" | same: `:1024`, `:1083` | 51 | `ENGINE_DEEP`, own file | `budgetAt(["setoption name Skill Level value 7"], "go")` hands `{ budgetMs: 30_000 }` | 2 | 49 |
| B1 | `ABC-094` A3 "ten seeds, one pick each, at least 3 distinct replies" | `src/book.test.ts`: `:258`, `:259` | 50 | option (ii), own file | the first seeds that give three distinct replies, same assert | 20 | 30 |
| | **total** | | **750** | | | **129** | **621** |

- **The qe-hop trio (Q1–Q3) moves together or not at all** (`…f40ce634` 2). `allNotes()` and `plainSweep()` are lazy and shared, so moving one row hands its cost
  to the next reader. Without the trio the skip read falls to about −0.20 s, which is short.
- **Form per row:** `ABC-302`'s. **S** is this cut (a remnant, plus the full row deep). **W** (no remnant) needs default-lane parity the Architect measured. **K**
  (the row stays) drops the row, and it spends the slack (A6).
- **The full row is defined only under its lane's constant.** With the flag unset it is not defined: no `it.skip`, no `skipIf`. The `it` title stays
  byte-identical. A deep describe goes after its constant: a reference above a `const` throws at load, and `uci-session`'s is at `:2160`.
- **The remnant takes the row's place** in the original describe. Its title states what it samples, and it asserts its own non-vacuity.
- **No new test file, no new environment variable, no new `AGENTS.md` lane line** (`R-N8H-3`). Option (ii) is `arch-ABC-302`'s: an existing variable under a new
  constant, the row reached only by its `-t` line.
- **Each row reverts alone,** except the trio, which reverts as one.

## Out of scope

- Every row the census excluded, including `history-pane.nfr` A11 (`ADR-0029`'s guard for `NFR-002`, withdrawn in `…19cea480`), `ABC-281`'s and `ABC-302`'s
  remnants, and `src/cli.test.ts`'s spawned children.
- Rows under 50 ms, and folding small test files together (`…19cea480`: an unread lead, `UNKNOWN - verify`).
- Production `src/*.ts`, `tools/grugops/qe-hop-integrity.js`, `vitest.config.ts`, `package.json`, `data/`.
- **The owner's levers:** `NFR-008`'s 10 s, W, `maxWorkers: 2`, the heap flag.

## The Architect's confirmation (DoR row 10, owed)

A records hop plus scratch mutant reads, in `arch-ABC-302`'s form, on a scratch copy of `main`. Remnants and kill parity are his. **Nothing here is met yet.** He:

1. **Picks the form** (S / W / K) and confirms each remnant, measured: at the tip the remnant kills the row's mutant in the default lane, and the full row kills it
   in its deep lane. He gives each remnant's kept ms, and the forecast restated from them.
2. **Names A7's mutant for each row,** the one whose only default-lane killer at base is that row. For Q1–Q3 the mutants are on a scratch copy of
   `tools/grugops/qe-hop-integrity.js`.
3. **Reads `ABC-241` A7's own mutants (L3).** `arch-ABC-302`'s `raw/kill-matrix.tsv` names CLI A7 among the holders of eight: `QE-244-a`'s five (F230, QSEAMRAW,
   QPRIOROFF, QMATCH3, QTRIM1) and M2s, M4 and S241M1. `ADR-0046` § Dated 2026-11-04 (`arch-ABC-302`) and `ABC-302`'s A6 record A7 "still at step 100". A7's remnant
   keeps every assert, but on a coarser step, and the file's own comment says A4 and A7 lose a mutant at 1 000. 500 ms is unread.
4. **Places L1, and names each row's `-t` line** and each lane's base → tip count. For the three option (ii) files he names the variable.
5. **Says what happens to `T-QEHOP-GROWTH` if the trio moves, and plans it in the same hop** (`…f40ce634` 2 and 5). 5 428 note files at `a21136b0`, 72 short of 5 500.
6. **Writes `ADR-0046`'s dated section:** the forms, and the new `-t` lines for its run rule.

Four points BA/PM read from source and did not run:
- **L3's full row cannot move into `uci-session` as it stands.** That file does not import `gameStatusOf` (0 hits), and R8's deep describe has no `TWIN`. `ABC-302` allowed
  repeated fixtures and no added runtime import. The Architect says whether L3 takes an import there, or another place.
- **L2 and L3 assert a move or a score on a coarser step.** BA/PM reads `ADR-0046`'s depth-sensitive floor (2026-10-31, `SE-248-b`) as binding both remnants: depth, nodes and
  in-search node checks recorded, and below 2 checks the row keeps its step. `ADR-0046` also says the `ABC-241` rows were the only killers of F230, REP0 and S241M1 at
  step 100, before `ABC-302`'s remnants. L2 needs the same read as L3.
- **C2's remnant reads the handed budget, not the search.** `ABC-212` A14's plant P2 (the clamp left at 5 000) reds "`A4` level 7 and `A9` bare `go`", and the clamp is past the
  hand-over, so the remnant may be blind to it. `ABC-212` A12 allows the form. He names the default-lane holder.
- **Q1's remnant gives up the plain `--sweep` on the real tree.** `ABC-105` test note 1 wants real notes, not a fixture: a subset read through `readNotes`' existing filter is
  real notes. The subset must keep the positive controls (`ABC-031`, `ABC-072`), and the rows on a synthetic `root` may be what still holds the uninjected read path. He confirms.

If every row takes a form this page carries, the ticket goes Ready with a dated line and no re-cut. **If a row's guard has no default-lane holder under any form, it takes K.**
**A K past A6's slack, or dropping the trio or all three `cli` rows, comes back to the Orchestrator** (`…f40ce634` 2).

## Acceptance criteria

The base is `main` at the commit the build branches from. The tip is this ticket's delivered commit.

**Build (Software Engineer)**

- **`A1` (what the diff touches).** **Given** `git diff --name-only <base> <tip>`, **then** outside `.grugops/`, `plans/` and `memory-bank/` it lists only
  `src/cli.test.ts`, `src/uci-session.test.ts`, `src/book.test.ts` and `tools/grugops/qe-hop-integrity.test.ts`. No file is added or removed. `git -c core.quotePath=false
  diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` is **empty**. A remnant that needs a tool edit is a STOP to the Architect.
- **`A2` (bodies byte-identical).** **Given** the diff, **then** each moved row's body is byte-identical to base once the nesting indent is removed; no other row's title,
  body or `expect(` line changes; each moved row is defined only under a constant; the remnants are the only new default-lane code; added comments cite only `ABC-307`,
  `secnfr-census-1105`, the Architect's task and `ADR-0046`. A deep describe may repeat its row's small fixtures. Any other exception is the Architect's, by name.
- **`A3` (counts and names).** **Given** the vitest JSON report of `npm test` at base and tip, **then** the lane total at the tip is base's minus the rows in form W, with 0
  skipped and all passing. **Base reads 2 709 in 71 files** on `572edf13`, and it is re-read at the build's base. In each touched file the sorted full names equal base's with one
  name out and one in per S row. No " [deep" title appears, the files collected equal base's, and `lane-inventory` reports no findings.
- **`A4` (each moved row is green in its lane, by count).** **Given** the tip, **when** each row's `-t` line runs (the Architect's, DoR row 10), **then** it prints **"1 passed"**
  with 0 failed. Exit 0 with 0 tests fails. Brackets and parentheses are escaped (`QE-248-a`). Each touched file's full deep lane exits 0 with 0 failed, and its passed count is
  base's plus the file's S remnants plus the rows moved in from another file.
- **`A5` (the trio).** **Given** the tip, **then** Q1, Q2 and Q3 have all moved, or none has. If they have, **then** with the flag unset no row in the file calls `readNotes` with
  no folder filter, or runs `--sweep` with neither notes nor a root injected.

**List (Architect, read at the Ready line)**

- **`A6` (the skip-probe bar, −0.31 s).** The nine rows read −0.365 s, so the bar is met for the whole list (`…e5e57903`). **A K spends the slack:** the K rows' in-thread ms sum to
  at most **113 ms** (`…19cea480`'s figure), by the ms in § Scope. So any two of C1, C2 and B1 can fall, or L2 or L3 alone. L1 alone cannot. L3 with B1 (112) or C2 (113) sits on the
  line, and the census does not name it, so that is the Orchestrator's too. Past the slack the supply is short, and it goes to him. No row is added in this ticket.

**Gate (QE, then Security/NFR)**

- **`A7` (kill parity, per row, measured).** **Given** the Architect's mutant list, frozen in QE's PREREG before any head run and applied to a scratch copy, **then** for each mutant:
  at base the default lane kills it; at the tip the default lane kills it, **with the row's remnant among its killers, named** (under W, his named holder); at the tip the row's deep
  lane kills it. **`ABC-241` A7's own read is a named line of this list:** each of the eight mutants in point 3 stays killed by the tip's default lane, by holders he names. A miss
  is a STOP to Architect/Design, not a waiver.
- **`A8` (gates).** Lint, typecheck, unit and build are green. The default lane has 0 skips. `test-skip-integrity` and `lane-inventory` report no findings. `ADR-0046`'s run rule
  applies: QE runs every line of its set, plus A4's lines, and records each passed count.
- **`A9` (`NFR-008`, graded with twin arms).** **Given** base and tip, **when** QE reads `npm test` as spelled, **then** the report gives H's median wall with its interval and max, H − B
  in wall and CPU, and the twin's admissibility and R, against 10 s, 9.6 s and 9.5 s. The conditions: a PREREG note committed before the first poll; ALONE inside the host
  lock; load1 ≤ 8 before each scored run; a per-run foreign-load check (`R-CEN-1`; `…b9038a14`'s `flags.py` rule); arms B, H and H2, where H2 is a `cmp`-verified identity twin of
  H (`ADR-0035` D1); n ≥ 8 scored rounds, round 0 discarded. It is the first graded read after this ticket merges (`…19cea480`). How a reading routes:
  - **Target, not a bar: H − B ≤ −0.215 s** in median wall, graded, with an admissible twin. A miss is a gap QE records and the Orchestrator routes. The read is not re-played to pass, and
    no row is added in this ticket.
  - **The next lane-adding merge:** H's median goes through `…b9038a14`'s rule, G-GO, G-WITH or G-HOLD, and the routing is the Orchestrator's.
  - **H ≥ 9.6 s** is `…f30bd604` item 2's line. There is no row supply left behind this ticket, so he routes it with the owner's fallback (b) in view.
  - **H > 10 s** goes to the owner (`ADR-0035` D6). An inadmissible twin voids the reading, and it is re-read in another window.
- **`A10` (`R-N8H-1` and the catalog).** **Given** A9, **then** Security/NFR records `R-N8H-1`'s state by `…b9038a14`'s marks (BA/PM does not rule it), and writes `plans/nfr-catalog.md`'s
  `NFR-008` line by one dated insertion: the census's **9.515 s on `572edf13`**, with `R-N8H-1` MEDIUM, then A9's reading. It rides with the graded read (`…f40ce634` 5). No level moves.
- **`A11` (records and QE).** `node tools/grugops/records-path-check.js --base main` exits 0 at the tip. A `qe-e2e` hop records its verdict before the ticket leaves In Review.

## NFR triggers

- **`NFR-008`:** `npm test` median wall ≤ 10 s at load1 ≤ 8, graded with an admissible twin (A9). This ticket's target is H − B ≤ −0.215 s; no NFR level moves.
- **`T-QEHOP-GROWTH`:** re-arms at 5,500 note files. Owed to the Architect (point 5).
- **`NFR-010`** and the heap caps are untouched. **Security:** not triggered. Test-only, with no input, auth, data or secret surface.

## Test notes

1. **Freeze first.** A7's mutants and their base kill sets go in QE's PREREG before any head run.
2. **A1–A5 and A7–A8 need no quiet host. A9 does,** ALONE. Foreign load is recorded, never touched. The owner has been told, and he may hold his other project for it (`…f40ce634` 4).
3. **No UAT.** It is waived under the 2026-08-17 standing rule if A1's `grep` is empty. QE's verdict signs.
4. **Rows by title, not line.** If another merge lands first, re-read the line numbers. The titles hold.
5. **Rollback.** Revert the delivered commit. Each row goes back on its own, and the trio as one.

## Size and priority

- **`S`.** Nine rows in four files, A7's frozen mutants and A9's graded read. **Not `M`:** the rows and lanes are named, and the form is `ABC-302`'s. **Not `XS`:** A7 and A9.
  A tool edit, or a remnant the Architect cannot fit to this form, re-prices it.
- **`P1`.** The sealed rule holds the next lane-adding merge on it, and that merge is `ABC-303` or `ABC-305`.

## Dependencies

- **The Architect** (DoR row 10): § The Architect's confirmation. **Owed.**
- **Blocks:** this ticket merges **before or with the next lane-adding merge,** whichever of `ABC-303` and `ABC-305` that is (`…f40ce634` 1). `ABC-289` comes after them.
- **Does not block:** `ABC-305`'s build and its `N8-LANE` read run now; only the landing waits (`…f40ce634` 3). Neither build waits on the census (`…16e0ec2c` 1).
- **Files:** by `git diff --name-only`, `grugops/ABC-303` at `2fd5243b` and `grugops/ABC-305` at `a321b45e` touch none of the four files.
- **Host:** A9 waits for an ALONE slot. **Owners:** SE A1–A5; Architect row 10 and A6; QE A7–A9; Security/NFR A10.

## Open, not bars (for the Orchestrator)

1. **"With" the next merge.** If this goes in one merge with `ABC-303` or `ABC-305`, which tree A9 reads is `UNKNOWN - verify`. This page reads this ticket's tip.
2. **`ABC-305`'s A5.** Its read is taken now, on a base without this ticket. If this merges first, whether that read stands is `UNKNOWN - verify`. That page does not say.

## Risks

- **`R-N8H-1` (MEDIUM):** 9.515 s is not below 9.5 s. Owner: the Orchestrator. Remedy owner: Architect/Design. A10 records it.
- **`R-307-a` (LOW, new):** L2's and L3's remnants may not hold at 500 ms, and L3's full row may not fit `uci-session`. Falling alone, either fits the slack. Falling together, 139 ms is past
  it, and the supply is short. Owner: Architect/Design, at row 10.
- **`R-307-b` (LOW, new):** the realised margin under 9.6 s is 0.015–0.035 s, inside the noise, and the supply is spent after this ticket. Owner: the Orchestrator (`…f30bd604` item 4).
- **`R-N8H-2` (LOW):** note growth. **`R-CEN-1` (LOW):** foreign load voids timing reads (test note 2). **`R-N8H-3` (INFO):** applied, no new file.
- **Moved breadth runs only deep.** Mitigation: `ADR-0046`'s run rule gains A4's lines, and A7 measures what leaves.

## Definition of Ready

BA/PM, 2026-11-05, at `main` `a21136b0`. **9 of 10. Stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ 9.515 s graded, G-WITH; need −0.215 s realised; probe −0.365 s, 8 / 8 |
| 2 | scope and out-of-scope | ✅ nine rows by title, file and line; no new file, lane line or variable; the census's exclusions and the owner's levers fenced. The remnants are proposals, row 10's |
| 3 | INVEST | ✅ one slice; each row reverts alone, the trio as one; testable by counts, names, mutants and a graded read |
| 4 | acceptance testable and measurable | ✅ name-only list; byte-identical bodies; lane total base − W; "1 passed" per `-t` line; 113 ms slack; a per-mutant kill matrix; H − B and ≤ 10 s. The `-t` lines and mutant names are row 10's |
| 5 | dependencies known | ✅ the Architect; before or with the next lane-adding merge; ALONE slot; owners |
| 6 | NFR triggers with targets | ✅ `NFR-008` ≤ 10 s, target H − B ≤ −0.215 s graded with a twin; security not triggered |
| 7 | test notes | ✅ five |
| 8 | size | ✅ `S` |
| 9 | priority | ✅ `P1`, argued |
| 10 | no major unresolved blocker | ❌ **Owed to the Architect:** a form and a confirmed remnant per row by mutant reads, kill parity per row, `ABC-241` A7's own mutant read, L1's placement and every `-t` line, `T-QEHOP-GROWTH`, and `ADR-0046`'s dated section |

**Recommended:** stays in `Backlog`. It goes **Ready on the Architect's dated line**, with no re-cut if each row takes S, W or K inside A6. Column moves are the Orchestrator's.
