---
id: ABC-302
title: "The default lane sheds about 0.5 s: nine named rows move to existing deep lanes (seven to their own files' lanes, two across to lanes the Architect places), each with a default-lane remnant the Architect confirms by mutant reads, and QE re-grades `NFR-008` with a twin, target median ≤ 9.4 s (test-only)"
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-011
feature: —
---

# ABC-302: nine slow rows to existing deep lanes, with remnants, and a graded `NFR-008` re-read

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-ABC-302-cut`, records only, at `main` `9ee778b9`;
> nothing run, built or timed; every title and line below was read with `grep` / `sed`).
> - **Sources:** the Security/NFR decision `secnfr-nfr008-1104` `…1184fec4` (the rows, the ms each, the proposed
>   remnants and the must-stay list) and the Orchestrator's ruling `orch-2026-10-30a` `…112cd856` (option (a); this
>   ticket; the routing `arch-ABC-302` → `se-ABC-302` → `qe-ABC-302`).
> - **Form:** `ABC-281`'s form S (`ADR-0046` § Dated 2026-11-04, conditions 1–5), which is the precedent. Where they
>   differ, that section and the Architect's `arch-ABC-302` lines win over this page.
> - **Row 10 waits on `arch-ABC-302`** (§ The Architect's confirmation). Column moves are the Orchestrator's.
> - **Lane hygiene in `EPIC-011`, outside the phase order**, as `ABC-281` was. It is the critical path: `ABC-282` and
>   `ABC-301` build after it merges (ruling 3).

## Problem

- **User:** the owner, and every agent hop that runs `npm test` at a gate.
- **Pain:** `NFR-008` is MET, graded, at **9.84 s [9.78, 10.00]**, max 10.05 s (`…1184fec4`). That leaves 0.16 s of
  headroom on the median and 0.00 s at the top of the interval. 2 of 16 runs read over 10 s. The window spread is
  0.3–0.5 s, so a slow gate window can read NOT MET. That breach would go to the owner (`ADR-0035` D6). `R-N8H-1` is
  back to MEDIUM.
- **Growth:** each engine ticket adds about +0.15 s (`ABC-271` and `ABC-283` added +0.28 s together). `ABC-282` and
  `ABC-301` are next.
- **Value:** about **−0.50 to −0.55 s** of lane wall. Security/NFR's probe read −0.26 s for Part 1 and −0.555 s for
  Parts 1 + 2, both with the rows skipped, 8 / 8. The estimate with remnants is about −0.50 s (`ABC-281` kept about
  94 %). That puts `main` near **9.3 s**, so `R-N8H-1` would go to LOW. This form cannot close it (≤ 9.0 s). No
  production line, NFR level, cap or lane command moves.

## Scope

Line numbers are as read at `9ee778b9`. **Rows are identified by title, not by line** (test note 4).

**Part 1: seven rows, each to its own file's existing deep lane.**

| row | file: describe `:line`, it `:line` | ms | to (constant) | proposed remnant (the Architect confirms) |
|---|---|---:|---|---|
| R1 "search() to depth 4 and chooseMove deepened to 4: every null move is made out of check, with three or more pieces" | `src/search.null-move.test.ts`: `:705`, `:713` | 134 | `SEARCH_DEEP` (`RUN_DEEP`, `:63`) | the in-check root plus one middlegame root, both recursions, both asserts, and a rescaled non-vacuity count. The describe's other two rows (`:724`, `:729`) stay |
| R2 "A5: the CLI level seam's injected list equals UCI's, key for key, and both play d8e8" | `src/uci-session.test.ts`: `:1410`, `:1466` | 107 | `ENGINE_DEEP` (`RUN_ENGINE_DEEP`, `:2159`) | key-for-key list equality on a cheaper search. The A4 rows hold the d8e8 play |
| R3 "the rule changes the work: search() at depth 4 and chooseMove deepened to 4 on position-6 …" | `src/search.futility.test.ts`: `:559`, `:615` | 90 | `SEARCH_DEEP` (`RUN_DEEP`, `:54`) | the same comparison at depth 3, or one recursion |
| R4 "holds at every node within 2 plies of every perft position" | `src/zobrist.test.ts`: `:163`, `:164` | 86 | `ZOBRIST_DEEP` (`RUN_DEEP`, `:339`) | depth 1 over the same positions, with both halves asserted non-vacuous |
| R5 "on an infinite budget, maxDepth 1000 returns within the same consultation count" | `src/engine.test.ts`: `:1408`, `:1425` | 77 | `ENGINE_DEEP` (`RUN_DEEP`, `:78`) | the same equality on a shorter counting clock. Its sibling "at budgetMs 5, maxDepth 50 …" (`:1439`) stays |
| R6 "a fixed seed gives identical blunder decisions across runs" | `src/levels.test.ts`: `:937`, `:938` | 71 | `ENGINE_DEEP` (`RUN_DEEP`, `:87`) | the first 10 of the thirty (`ABC-281` R3's shape) |
| R7 "move, depth and nodes are equal on 30 of 30 positions, for each of two seeds" | `src/levels.test.ts`: `:325`, `:329` | 67 | `ENGINE_DEEP` (`RUN_DEEP`, `:87`) | seed 1 on the first 10 of the thirty |

**Part 2: two rows on the critical path whose files have no deep gate.** Each goes to an existing lane in another file.
**The Architect chooses the placement.**

| row | file: describe `:line`, it `:line` | ms | candidate places (`…1184fec4`) | remnant |
|---|---|---:|---|---|
| R8 "A4: with repetitionKeyHistory injected the default level plays d8e8 at exactly 0; base does not" | `src/cli.test.ts`: `:4622`, `:4649` | 188 | `src/cli.real-engine.test.ts` (`CLI_DEEP`, `RUN_DEEP` `:86`), or `uci-session`'s `ENGINE_DEEP` block | it keeps the seam's d8e8 play in `cli.test.ts` |
| R9 "ends every line at ply 128 with a leaf's score once the deepening passes it: no node or key past it" (the file's only row) | `src/engine.capacity.test.ts`: `:113`, `:114` | 115 | `src/engine.test.ts`'s `ENGINE_DEEP` block | the Architect names one that keeps the `KEY_ARRAY_CAPACITY` guard's kill |

- **Placement in Part 1 is the SE's, in `ABC-281`'s form.** The full row is defined only under the file's existing
  constant, inside a describe titled the original describe's title plus the file's suffix: " [deep, SEARCH_DEEP=1]",
  " [deep, ENGINE_DEEP=1]", " [deep, ZOBRIST_DEEP=1]", or " [deep]" in `src/levels.test.ts`. The `it` title stays
  byte-identical. With the flag unset, the row is **not defined**. It is not an `it.skip` or a `skipIf`. Another shape
  is allowed only if A4's `-t` line still prints "1 passed".
- **The remnant takes the row's place** in the original describe. Its title states exactly what it samples. It
  asserts its own non-vacuity.
- **Form per row** (`ABC-281`'s W / S / K): **S** is the cut's default (a remnant plus the full row deep). **W** (no
  remnant) is allowed only with default-lane kill parity measured by the Architect. **K** (the row stays) drops the row
  from this ticket. Choosing a form is the Architect's call, row by row.
- **No new test file, no new `AGENTS.md` lane line, no new environment variable** (`R-N8H-3`; `AGENTS.md` is 18 429
  of 18 432 B). No file is removed.
- **`AGENTS.md` counts:** two lane lines carry a count, and each becomes the tip's passed count for that lane. They are
  null-move ("45 rows", expected 46) and futility ("47 tests", expected 48). Each change is 0 B unless it crosses a
  digit boundary. The base counts are `UNKNOWN - verify` (not re-read here). The tip's count is written anyway. The SE
  makes both edits in the delivered commit, with one `memory-bank/90-agents-md-command-log.md` entry giving bytes
  before and after.
- **Each row reverts alone.**

## Out of scope

- Everything on `…1184fec4`'s must-stay list: the zugzwang rows (`zugzwang.001`, K+P); `src/search.bundle.test.ts`; every
  door-switch row (`QE-208-c`, the doors' "makes / no null move" rows); **`ABC-281`'s three remnants**; `uci-session`'s
  ABC-167 A5 / A6 / A7, ABC-171 A2 / A6, ABC-174 A5 and ABC-220 A13; `legal` ABC-206 A2 and `search.test` A4;
  `src/cli.test.ts`'s spawned children (`ADR-0008` C2).
- Every other row and every shared helper in the touched files.
- Production `src/*.ts`, `vitest.config.ts`, `package.json`, `tools/`, `data/`, `plans/nfr-catalog.md`.
- **The owner's levers:** `NFR-008`'s 10 s, W, `maxWorkers: 2`, the heap flag. **`Q-N8H-1`** is the Orchestrator's to
  put to the owner (ruling 4). This ticket does not wait on it.

## The Architect's confirmation (DoR row 10, `arch-ABC-302`)

A records hop plus scratch mutant reads, in `ABC-281`'s form: a scratch copy of `main`, never the repository's `src/`.
It is needed because every row moves coverage out of the default lane (`ADR-0046` § Consequences, kill parity). For
each of R1–R9 the Architect:

1. **Picks the form** (S / W / K) and confirms the remnant, measured. The remnant at the tip kills the row's unique
   mutant in the default lane, and the full row kills it in its deep lane.
2. **Names A6's mutant for the row,** the one whose only default-lane killer at base is that row. QE freezes it.
3. **Places R8 and R9** and names their `-t` lines.

Two points BA/PM read from source and did not run:
- **R9 cannot move into `src/engine.test.ts` with its body byte-identical as it stands.** `src/engine.capacity.test.ts`
  mocks `./legal.ts`, `./zobrist.ts` and `./search.ts` at file scope (`vi.mock`, `:44`, `:49`, `:60`; header: "in THIS
  FILE ONLY"). `src/engine.test.ts` has no `vi.mock`. In vitest a mock is hoisted and applies to the whole file. The
  Architect rules among:
  - (i) a rewrite that needs no mock (a new row, so A2's byte-identity is waived for R9 by name);
  - (ii) an `ENGINE_DEEP` gate inside its own file, run only by its `-t` line (`ADR-0046` rule item 3), with no lane line;
  - (iii) K.
  The file keeps at least its remnant under each of these, so it is not emptied.
- **R8 into `uci-session`:** that file spies on `./engine.ts` (`vi.mock(…, { spy: true })`, `:30`), and some describes
  reset or replace `chooseMove`'s implementation (`:1028`, `:1056`, `:1757`). The Architect confirms that the moved
  row reads the real search there.
- **R6 and R7 may already be held.** `ABC-281`'s remnant `QE-087-d (slice)` (`src/levels.test.ts:901`) runs seed 1 over
  the first 10 of the thirty. If a row's kill is already held, W is the cheaper form. The Architect decides from the
  mutant reads.

If the Architect picks a form this page already carries, the ticket goes Ready with a dated line and no re-cut.
**If a row's guard has no default-lane holder under any form, the move is option (b)**, the owner's. The Orchestrator
routes it, and that row takes K meanwhile.

## Acceptance criteria

The base is `main` at the commit the build branches from. The tip is this ticket's delivered commit.

**Build (Software Engineer)**

- **`A1` (what the diff touches).** **Given** `git diff --name-only <base> <tip>`, **then** it lists only the files of
  the rows moved (§ Scope), plus the Part 2 target files, plus `AGENTS.md` and the command log for A5. No file is added
  or removed. `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` is
  **empty**.
- **`A2` (bodies byte-identical).** **Given** the diff, **then**:
  - each moved row's body, from the line after its `it(` header to its closing `});`, is byte-identical to base. The
    only exception is R9 under option (i), if the Architect names it;
  - no other row's title, body or `expect(` line changes. That includes the siblings named in § Scope and `ABC-281`'s
    three remnants;
  - each moved row is defined only under an existing constant;
  - the remnants are the only new default-lane code;
  - added comments cite only `ABC-302`, `secnfr-nfr008-1104`, `arch-ABC-302` and `ADR-0046`.
- **`A3` (counts and names).** **Given** the vitest JSON report of `npm test` at base and tip, **then**:
  - **the lane total at the tip equals base's minus the number of rows taken in form W**, with 0 skipped and all
    passing. The total is equal if every row takes S;
  - in each touched file, the sorted full names equal base's with exactly one name out and one name in per S row. The
    moved row's full name goes out, and its remnant's comes in;
  - no " [deep" title appears;
  - the files collected equal base's (71 per `…1184fec4`, re-read at the base), and `lane-inventory` reports no
    findings.
- **`A4` (each moved row is green in its lane, by count).** **Given** the tip, **when** each line below runs, **then**
  it prints **"1 passed"** with 0 failed. Exit 0 with 0 tests fails. `-t` is a regular expression, so brackets and
  parentheses are escaped (`QE-248-a`). These are the rows' `ADR-0046` rule lines (rule item 3), and QE confirms them:

  ```
  SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts -t "A2 — the instrumented search makes 0 null moves in check, and 0 below three non-pawn pieces \[deep, SEARCH_DEEP=1\]"
  ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts -t "ABC-241 A4, A5 — UCI: the prior keys are repetition keys \[deep, ENGINE_DEEP=1\]"
  SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.futility.test.ts -t "the doors — searchWithoutFutility and chooseMoveWithoutFutility turn futility off, as every older door does \[deep, SEARCH_DEEP=1\]"
  ZOBRIST_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/zobrist.test.ts -t "ABC-075 property — the ep component tracks the ep FIELD, not availability \(ADR-0020\) \[deep, ZOBRIST_DEEP=1\]"
  ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/engine.test.ts -t "ABC-170 A5 — the limits only shorten; the ceiling still holds \[deep, ENGINE_DEEP=1\]"
  ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts -t "A7 — seeded, in deterministic mode \[deep\]"
  ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts -t "ABC-174 A3 — the default plays as the engine: chooseMove at 4 000 ms \(ABC-228, ADR-0053 d10\) \[deep\]"
  ```

  R8's and R9's lines are added by a dated line when `arch-ABC-302` places them. Also, each touched file's full deep
  lane, run as its `AGENTS.md` line spells it, exits 0 with 0 failed. Its passed count is base's count for that same
  command plus the number of rows moved into it. A row in form K has no line.
- **`A5` (`AGENTS.md`).** **Given** `AGENTS.md` at the tip, **then**:
  - the null-move and futility counts equal those lanes' passed counts at the tip, as read in A4;
  - no other byte changes, and the size is ≤ 18 432 B (`ABC-109` A5 green);
  - the command log has one entry with bytes before and after. If neither count changes, neither file is touched.

**Gate (QE, then Security/NFR)**

- **`A6` (kill parity, measured).** **Given** `arch-ABC-302`'s mutant list, frozen in QE's PREREG before any head
  run and applied to a scratch copy of production, **then** for each mutant:
  - at base, the default lane kills it (the control);
  - at the tip, the default lane kills it, **with the row's remnant among its killers, named**. Under W, the
    Architect's named holder kills it;
  - at the tip, the row's deep lane kills it.

  A miss is a STOP to Architect/Design, not a waiver.
- **`A7` (gates).** Lint, typecheck, unit and build are green. The default lane has 0 skips. `test-skip-integrity` and
  `lane-inventory` report no findings. **The `ADR-0046` run rule applies:** the diff touches the rule's files, so QE
  runs `ABC-248`'s and `ABC-281`'s four lines plus A4's lines, and records each passed count.
- **`A8` (`NFR-008`, graded with twin arms).** **Given** base and tip, **when** QE reads `npm test` as spelled, under
  `ABC-281` A8's conditions, **then** the report gives H's median wall with its interval, H − B in wall and CPU, and
  the twin's admissibility and R. The conditions are:
  - a PREREG note committed before the first poll;
  - ALONE inside the host lock;
  - load1 ≤ 8 before each scored run;
  - arms B, H and H2, where H2 is a `cmp`-verified identity twin of H (`ADR-0035` D1);
  - n ≥ 8 scored rounds, round 0 discarded.

  How a reading routes:
  - **Target: an H median ≤ 9.4 s**, graded, with an admissible twin. That meets this ticket's target. The probe
    forecasts about 9.3 s.
  - **9.4 s < H ≤ 10 s:** `NFR-008` is MET, and this ticket's target is missed. QE records it as a gap. The
    Orchestrator routes it with H − B and the B arm against its own graded reading. The read is not re-played to pass,
    and no row is added in this ticket.
  - **An H median ≥ 9.6 s** also triggers `Q-N8H-1`'s fallback (b), re-stating W. Putting it to the owner is the
    Orchestrator's job (ruling 4).
  - **H > 10 s** goes to the owner (`ADR-0035` D6). An inadmissible twin voids the reading, and it is re-read in
    another window.
- **`A9` (`R-N8H-1`).** **Given** A8, **then** Security/NFR records the state: LOW at a graded median < 9.5 s, closed at
  ≤ 9.0 s, HIGH at NOT MET. BA/PM does not rule it.

## NFR triggers

- **`NFR-008`:** `npm test` median wall ≤ 10 s at load1 ≤ 8, graded with an admissible identity twin. **This ticket's
  target is H ≤ 9.4 s** (A8). CPU is reported.
- **`NFR-010`** and the heap caps are untouched. No config, flag or worker count moves.
- **`AGENTS.md` budget:** ≤ 18 432 B (A5).
- **Security:** not triggered. Test-only, with no input, auth, data or secret surface.

## Test notes

1. **Freeze first.** A6's mutants and their base kill sets go in QE's PREREG before any head run.
2. **A1–A7 need no quiet host. A8 does,** ALONE.
3. **No UAT.** UAT is waived under the 2026-08-17 standing rule if `git -c core.quotePath=false diff --name-only
   <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` is empty. QE's verdict signs.
4. **Rows by title, not line.** If another merge lands first, re-read the line numbers. The titles hold.
5. **Rollback.** Revert the delivered commit. Each row goes back on its own.

## Size and priority

- **`S`.** It is nine rows on helpers the files already have, two counts, A6's frozen mutants and A8's graded read.
  **Not `M`:** the rows and lanes are named, the form is `ABC-281`'s, and the Architect fixes the remnants before the
  build. **Not `XS`:** A6 and A8.
- **`P1`.** The interval touches 10.00 s, so a slow window can route a breach to the owner. Two P2 tickets, `ABC-282`
  and `ABC-301`, build after it (ruling 3). That makes it the critical path, which `ABC-281` at P2 was not.

## Dependencies

- **`arch-ABC-302`** (DoR row 10): the forms, the remnants, A6's mutants, and R8 / R9 placement and `-t` lines.
- **Blocks:** `ABC-282` and `ABC-301` scope 0 build after this merges (`…112cd856` ruling 3).
- **Files:** `src/engine.test.ts` and `src/levels.test.ts` are shared with `ABC-282`'s and `ABC-301`'s rows. This
  ticket goes first (test note 4).
- **Host:** A8 waits for an ALONE slot.
- **Owners:** SE A1–A5; QE A6–A8; Security/NFR A9; Architect/Design row 10.

## Risks

- **`R-N8H-1` (MEDIUM):** 0.16 s of headroom, less than the window spread. Owner: the Orchestrator. Remedy owner:
  Architect/Design. A9 rules it.
- **`R-302-a` (LOW, new):** R9's file-scoped mocks may force option (i) or K, and R8's spied file may need care. Under
  K for R9, the saving drops by up to about 0.1 s, and 9.4 s gets close. Owner: Architect/Design, at row 10.
- **`R-N8H-3` (INFO):** about 0.1 s of start-up per new test file. Applied: no new file (A1).
- **Moved breadth runs only deep.** Mitigation: `ADR-0046`'s run rule gains A4's lines (rule item 3), and A6 measures
  what leaves.
- **The form is near its end** (`…1184fec4`): it buys about three engine tickets of growth. Hence `Q-N8H-1` now.

## Definition of Ready

BA/PM, 2026-11-04, at `main` `9ee778b9`. **9 of 10. Stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ 9.84 s graded [9.78, 10.00]; 0.16 s headroom under a 0.3–0.5 s spread; probe −0.555 s, 8 / 8 |
| 2 | scope and out-of-scope | ✅ nine rows by title, file and line, with their lanes and proposed remnants; no new file, lane line or variable; the must-stay list and the owner levers fenced |
| 3 | INVEST | ✅ one slice; each row reverts alone; testable by counts, names, mutants and a graded read |
| 4 | acceptance testable and measurable | ✅ name-only list; byte-identical bodies; lane total equal (S) or base − W; "1 passed" per `-t` line; deep count + rows moved; `AGENTS.md` ≤ 18 432 B; a per-mutant kill matrix; H ≤ 9.4 s target, ≤ 10 s MET |
| 5 | dependencies known | ✅ `arch-ABC-302`; blocks `ABC-282` / `ABC-301`; ALONE slot; owners |
| 6 | NFR triggers with targets | ✅ `NFR-008` ≤ 10 s, target ≤ 9.4 s graded with a twin; `NFR-010` untouched; security not triggered |
| 7 | test notes | ✅ five |
| 8 | size | ✅ `S` |
| 9 | priority | ✅ `P1`, argued |
| 10 | no major unresolved blocker | ❌ **`arch-ABC-302` owed:** a form and a confirmed remnant per row by mutant reads (kill parity), A6's mutant list, and R8 / R9 placement with their `-t` lines. R9 cannot keep its body byte-identical in `src/engine.test.ts` because of its file-scoped mocks |

**Recommended:** stays in `Backlog`. It goes **Ready on the Architect's dated line**, with no re-cut if each row takes
S, W or K. Column moves are the Orchestrator's.
