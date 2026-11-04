---
id: ABC-302
title: "The default lane sheds about 0.5 s: nine named rows move to existing deep lanes (eight within their own files, one across to `uci-session`'s `ENGINE_DEEP`); six keep a default-lane remnant (form S) and three move whole (form W), at kill parity the Architect measured on 27 mutants, and QE re-grades `NFR-008` with a twin, target median ≤ 9.4 s (test-only)"
status: done
column: Done
size: S
priority: P1
epic: EPIC-011
feature: —
---

# ABC-302: nine slow rows to existing deep lanes, six with remnants, and a graded `NFR-008` re-read

> **DoR 10 of 10, Ready: 2026-11-04, BA/PM** (task `bapm-ABC-302-dor`, records only, at `main` `bff22046`; nothing
> run). Architect/Design met row 10 (`arch-ABC-302`, decision `…bcadd41d`, observation `…8c8cfeed`, PREREG
> `…23abb6c5`; `ADR-0046` § Dated 2026-11-04 (`arch-ABC-302`)). **R1, R2, R4, R5, R8 and R9 take form S; R3, R6 and
> R7 take W.** R8 goes to `src/uci-session.test.ts`'s `ENGINE_DEEP`. R9 takes option (ii) and stays in its own file.
> Kill parity was measured on 27 mutants, so option (b) does not bind and there is no owner question.
>
> - **What this changes on the page** (each line below is marked "Row 10, 2026-11-04"): the title; § Problem's value;
>   § Scope (forms, R8 / R9 placement, the futility count); A1–A6 and A8; § NFR triggers; `R-302-a`; § Definition of
>   Ready.
> - **Where they differ, `ADR-0046`'s dated section and the SE build lines in `…bcadd41d` win** over this page.
> - The board shows the card **In Development** (Orchestrator, `bff22046`). Column moves are the Orchestrator's; this
>   page records the `Backlog → Ready` exit only.

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
  - **Row 10, 2026-11-04:** the six remnants keep 100 ms of the nine rows' 948 ms in-thread, so about 89 % is saved.
    The Architect's forecast is about **−0.50 s** of wall (the −0.555 s probe × 0.89), with `main` near **9.3 s**.
    It is an estimate; A8 grades it.

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
- **Row 10, 2026-11-04: the forms and remnants** (`…bcadd41d`; `ADR-0046` § Dated 2026-11-04 (`arch-ABC-302`)). The
  SE builds to `…bcadd41d` § SE build lines 1–8. No K, so all nine rows stay in this ticket:

  | row | form | full row's lane | the default-lane remnant (its title states what it samples) |
  |---|---|---|---|
  | R1 | S | `SEARCH_DEEP`, a nested deep describe | the in-check root and position-5, both recursions to depth 4, the asserts unchanged, made > 100 (210 at base) |
  | R2 | S | `ENGINE_DEEP`, after `RUN_ENGINE_DEEP` | "A5 (slice): on a 500 ms virtual step, …": the same asserts, the seam and UCI `go` both at 500 |
  | R3 | **W** | `SEARCH_DEEP`, a nested deep describe | none. R3 kills 0 of the 27 (its doors turn off more than futility) |
  | R4 | S | `ZOBRIST_DEEP`, after `RUN_DEEP` | the same walk 1 ply deep (`checkEpComponent(…, 1)`), both halves non-vacuous |
  | R5 | S | `ENGINE_DEEP`, a deep describe (see the note below the table) | the same equality on a 10 000 ms counting clock, `consultations` > 2 (8 at base) |
  | R6 | **W** | `ENGINE_DEEP`, " [deep]" | none. Held by A10 and `QE-087-d (slice)` |
  | R7 | **W** | `ENGINE_DEEP`, " [deep]" | none. Held by levels A6 ("at rate 0 returns `chooseMove`'s …") |
  | R8 | S | **`src/uci-session.test.ts`'s `ENGINE_DEEP`**, its own describe | in `src/cli.test.ts`, "A4 (slice): on a 500 ms virtual step, …": seam, direct and hash-list calls at 500, plus the direct call's depth ≥ 5 (8 at base). The describe's A7 row stays at 100 |
  | R9 | S, **option (ii)** | `ENGINE_DEEP` **in its own file**, reached only by its `-t` line | the same body on a clock spent after `2 * ITERATIONS` (260) root passes |

  - **R8 reads the real search** in `uci-session` (its spy calls through; measured, `…8c8cfeed`). **R9 under (ii)**
    adds `const RUN_DEEP = process.env.ENGINE_DEEP === "1"` to `src/engine.capacity.test.ts`: an existing variable
    under a new constant. No `AGENTS.md` line, no environment variable and no file is added; its `-t` line joins
    `ADR-0046`'s run-rule table (rule item 3). `AGENTS.md`'s engine deep line does not reach it, which is recorded,
    not changed.
  - **Placement after the constant:** the deep describes in `uci-session` and `zobrist` go after their constants
    (about `:2159` and `:339`). A reference above a `const` throws at load.
  - **R5's placement is read two ways.** `ADR-0046`'s table says "a sibling describe". `…bcadd41d` build line 3 nests
    R5 inside the original describe, as it does R1 and R3, so `countingClock` stays one copy. BA/PM does not rule
    this. Either shape meets A2 if `countingClock` stays one copy and A4's R5 line prints "1 passed".
  - **The futility count is corrected:** "expected 48" above is wrong. Base already defines 53 in that lane, and W
    leaves 53 (A5).
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

**Met 2026-11-04** (`arch-ABC-302` `…bcadd41d`): every row takes a form this page carries, so there is no re-cut and no
option (b). R8 reads the real search in `uci-session`; R9 takes (ii). The lines are marked "Row 10, 2026-11-04".

## Acceptance criteria

The base is `main` at the commit the build branches from. The tip is this ticket's delivered commit.

**Build (Software Engineer)**

- **`A1` (what the diff touches).** **Given** `git diff --name-only <base> <tip>`, **then** it lists only the files of
  the rows moved (§ Scope), plus the Part 2 target files, plus `AGENTS.md` and the command log for A5. No file is added
  or removed. `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` is
  **empty**.
  - **Row 10, 2026-11-04: the list is these ten files and no others:** `src/search.null-move.test.ts`,
    `src/uci-session.test.ts`, `src/search.futility.test.ts`, `src/zobrist.test.ts`, `src/engine.test.ts`,
    `src/levels.test.ts`, `src/cli.test.ts`, `src/engine.capacity.test.ts`, `AGENTS.md` and
    `memory-bank/90-agents-md-command-log.md`. The Part 2 targets are `uci-session` (R8) and R9's own file.
- **`A2` (bodies byte-identical).** **Given** the diff, **then**:
  - each moved row's body, from the line after its `it(` header to its closing `});`, is byte-identical to base. The
    only exception is R9 under option (i), if the Architect names it;
  - no other row's title, body or `expect(` line changes. That includes the siblings named in § Scope and `ABC-281`'s
    three remnants;
  - each moved row is defined only under an existing constant;
  - the remnants are the only new default-lane code;
  - added comments cite only `ABC-302`, `secnfr-nfr008-1104`, `arch-ABC-302` and `ADR-0046`.
  - **Row 10, 2026-11-04 (`qe-ABC-281`'s ruling; `…bcadd41d`):**
    - "byte-identical" reads **once the nesting indent is removed**. One `biome-ignore format` line, outside the body,
      is allowed on R1's deep `it`;
    - **R9 is waived by name** under option (ii): its file gains `const RUN_DEEP = process.env.ENGINE_DEEP === "1"`.
      Its body is identical, indent aside;
    - each deep describe may repeat its row's small fixtures (R2 and R8: FEN, MOVES, `STEP_MS = 100`, `gameOf`, and
      `lastHanded` or `labelOf`, `seamOf`, `scoreWith`). They are not the row's body. No runtime import is added;
    - the default describe's `STEP_MS` that R2's move leaves unused moves with the row.
- **`A3` (counts and names).** **Given** the vitest JSON report of `npm test` at base and tip, **then**:
  - **the lane total at the tip equals base's minus the number of rows taken in form W**, with 0 skipped and all
    passing. The total is equal if every row takes S;
  - in each touched file, the sorted full names equal base's with exactly one name out and one name in per S row. The
    moved row's full name goes out, and its remnant's comes in;
  - no " [deep" title appears;
  - the files collected equal base's (71 per `…1184fec4`, re-read at the base), and `lane-inventory` reports no
    findings.
  - **Row 10, 2026-11-04 (this is what A3 reads; three rows take W):**
    - the lane total is **base − 3: 2 684** at `fed3f2b4`'s 2 687 (Architect's tip sketch, 71 files). It is re-read at
      the build's base;
    - `search.futility` goes −1 (37 → 36) and `levels` −2 (49 → 47): names out, none in;
    - each S file has exactly one name out and one in: `search.null-move`, `uci-session` (R2), `zobrist`, `engine`,
      `cli` (R8's remnant) and `engine.capacity`. `cli` stays 109, and `uci-session`'s default lane stays 230.
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

  **Row 10, 2026-11-04 (`…bcadd41d`; no K, so nine lines):**
  - The seven lines above stand as spelled; R2's names the page's describe. **Add R8's and R9's:**

    ```
    ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts -t "ABC-241 A4, A7 — the CLI: a third occurrence through an uncapturable ep square \[deep, ENGINE_DEEP=1\]"
    ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/engine.capacity.test.ts -t "ABC-122 A8: src/engine\.ts's KEY_ARRAY_CAPACITY guard, reached through chooseMove\(\) \[deep, ENGINE_DEEP=1\]"
    ```

    R9's parentheses must stay escaped. Unescaped, `()` is an empty group, the pattern does not match, and the run
    reports 0 tests. All nine lines join `ADR-0046`'s run-rule table (rule item 3).
  - **"Plus the rows moved into it" reads:** base + the file's S remnants + the rows moved in from another file. W
    adds 0. These are the defined counts at `fed3f2b4` (the Architect's `counts.tsv`). The passed counts are QE's to
    read:

    | lane (as `AGENTS.md` spells it) | base → tip |
    |---|---|
    | `SEARCH_DEEP` `src/search.null-move.test.ts` | 45 → **46** |
    | `SEARCH_DEEP` `src/search.futility.test.ts` | 53 → **53** |
    | `ZOBRIST_DEEP` `src/zobrist.test.ts` | 33 → **34** |
    | `ENGINE_DEEP` `src/engine.test.ts` | 83 → **84** |
    | `ENGINE_DEEP` `src/levels.test.ts` | 58 → **58** |
    | `ENGINE_DEEP` `src/uci-session.test.ts` | 241 → **243** (R2's remnant, R8 moved in) |
    | `ENGINE_DEEP` `src/engine.capacity.test.ts` | 1 → **2**. It has no `AGENTS.md` line; its `-t` line is its lane |
- **`A5` (`AGENTS.md`).** **Given** `AGENTS.md` at the tip, **then**:
  - the null-move and futility counts equal those lanes' passed counts at the tip, as read in A4;
  - no other byte changes, and the size is ≤ 18 432 B (`ABC-109` A5 green);
  - the command log has one entry with bytes before and after. If neither count changes, neither file is touched.
  - **Row 10, 2026-11-04:** null-move "45 rows" becomes **46**, and futility "47 tests" becomes **53**. The 47 was
    already stale at base, and W leaves 53. Both changes are 0 B. The passed counts in A4 decide; these are the
    expected values.

**Gate (QE, then Security/NFR)**

- **`A6` (kill parity, measured).** **Given** `arch-ABC-302`'s mutant list, frozen in QE's PREREG before any head
  run and applied to a scratch copy of production, **then** for each mutant:
  - at base, the default lane kills it (the control);
  - at the tip, the default lane kills it, **with the row's remnant among its killers, named**. Under W, the
    Architect's named holder kills it;
  - at the tip, the row's deep lane kills it.

  A miss is a STOP to Architect/Design, not a waiver.

  **Row 10, 2026-11-04: the list QE freezes is the PREREG's 27 killed mutants** (`…23abb6c5`; definitions in
  `.grugops/context/arch-ABC-302/raw/mut.py`, base and tip kill sets in `raw/kill-matrix.tsv`):
  - the Architect's 16: M1, M2, M2s, M3, M3s, M4, M4z, M5, M5c, M6, M6t, M7, M7n, M8d, M9 and M9r;
  - `QE-244-a`'s five: F230, QSEAMRAW, QPRIOROFF (re-anchored), QMATCH3 and QTRIM1;
  - the rest of the `ABC-241` rows' sets: REP0, S241M1, QMATCH1, UNTRIM, S241M6 and QUCINOKEYS.

  The control for each is base's default lane. M1p is out, because nothing kills it at base. Each row's mutant, and
  the named killer at the tip:

  | row | form | A6 mutant | named default-lane killer at the tip |
  |---|---|---|---|
  | R1 | S | M1 | R1's remnant (and `engine` `ABC-249`) |
  | R2 | S | M2 | R2's remnant only |
  | R3 | W | none on the list | M3 and M3s are carried as the holders' control: futility's "both recursions test the node once …" and `QE-268-b` (plus `transposition` A5 for M3). R3's deep line passes under M3 (the recorded blindness), so the deep-lane kill is not read for R3 |
  | R4 | S | M4 (plus M4z) | R4's remnant, among 19 (M4z: 22) |
  | R5 | S | M5 (plus M5c) | R5's remnant (and two source-text rows) |
  | R6 | W | M6 | A10 and `QE-087-d (slice)` (and 19 more) |
  | R7 | W | M7n (plus M7) | levels A6 (and `ABC-242` A6) |
  | R8 | S | M8d | R8's remnant (and R2's) only |
  | R9 | S | M9 (plus M9r) | R9's remnant only |

  Every other mutant on the list must stay killed by the tip's default lane, by the holders `raw/kill-matrix.tsv`
  names. For `QE-244-a`'s five, those include CLI `ABC-241` A7 (still at step 100), CLI `ABC-230` A1 and R8's remnant.
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
    forecasts about 9.3 s. **Row 10, 2026-11-04:** the expected head is **about 9.3 s (base − 0.50 s)**, the
    Architect's forecast with the remnants counted. 9.4 s is a target, not a bar, as the Orchestrator ruled.
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
  target is H ≤ 9.4 s** (A8). CPU is reported. **Row 10, 2026-11-04:** expected H ≈ 9.3 s (base − 0.50 s); no NFR
  level, bar or trigger moves.
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
  **Met 2026-11-04** (`…bcadd41d`): six S, three W, R8 to `uci-session`, R9 option (ii).
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
  - **Row 10, 2026-11-04: closed** (owner Architect/Design, `…bcadd41d`). R9 moves under option (ii) at measured
    parity, and R8 reads the real search in `uci-session`.
- **`R-N8H-3` (INFO):** about 0.1 s of start-up per new test file. Applied: no new file (A1).
- **Moved breadth runs only deep.** Mitigation: `ADR-0046`'s run rule gains A4's lines (rule item 3), and A6 measures
  what leaves.
- **The form is near its end** (`…1184fec4`): it buys about three engine tickets of growth. Hence `Q-N8H-1` now.

## Definition of Ready

BA/PM, 2026-11-04, at `main` `9ee778b9`. **9 of 10. Stays in `Backlog`.**

**Re-read 2026-11-04, BA/PM (`bapm-ABC-302-dor`, at `main` `bff22046`): 10 of 10, row 10 met. Ready.** Rows 1–9
stand, re-read under the Architect's forms:
- row 2: the forms and remnants are named (§ Scope, row 10), and no row takes K;
- row 4: lane total base − 3 (2 684); per-file deep counts; nine `-t` lines; 27 frozen mutants with the named killer;
- row 6: expected about 9.3 s, target 9.4 s unchanged;
- row 8: still `S`.

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
| 10 | no major unresolved blocker | ✅ 2026-11-04, Architect/Design (`arch-ABC-302`; `ADR-0046` § Dated 2026-11-04 (`arch-ABC-302`)): R1, R2, R4, R5, R8 **S**; R3, R6, R7 **W**; R8's full row to `src/uci-session.test.ts`'s `ENGINE_DEEP` block; R9 **S** under option (ii). Default-lane kill parity was measured on 27 mutants (PREREG `…23abb6c5`), so option (b) does not bind and there is no owner question. DoR 10 of 10: Ready. *(Was: ❌ `arch-ABC-302` owed: a form and a confirmed remnant per row by mutant reads, A6's mutant list, and R8 / R9 placement with their `-t` lines.)* |

**Recommended:** stays in `Backlog`. It goes **Ready on the Architect's dated line**, with no re-cut if each row takes
S, W or K. Column moves are the Orchestrator's.

**2026-11-04: Ready.** The Architect's line is dated, every row takes a form this page carries (S, W, or R9's option
(ii)), and there was no re-cut. The board shows In Development (Orchestrator, `bff22046`).
