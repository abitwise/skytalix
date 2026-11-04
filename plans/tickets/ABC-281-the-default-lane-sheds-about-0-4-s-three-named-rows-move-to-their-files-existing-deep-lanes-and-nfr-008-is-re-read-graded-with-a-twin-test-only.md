---
id: ABC-281
title: "The default lane sheds about 0.4 s: three named rows move to their own files' existing deep lanes (`QE-208-a` position-6 to `SEARCH_DEEP`; `ABC-230` A4 and levels A9 to `ENGINE_DEEP`), and QE re-reads `NFR-008` graded, with a twin (test-only)"
status: done
column: Done
closed: "2026-11-04, merged to local main at 983d16c3; QE PASS_WITH_GAPS (qe-ABC-281 …960d38ff); UAT waived (test-only); NFR-008 graded 9.42 s against base 9.90 s (−0.37 s, 8 / 8); post-merge npm test 2 650 / 2 650 (the Orchestrator's board card). Front matter only, by bapm-W1-bundle-cut"
size: S
priority: P2
epic: EPIC-011
feature: —
---

# ABC-281: three slow rows to their files' deep lanes, and a graded `NFR-008` re-read

> **DoR 10 of 10, Ready: 2026-11-04, BA/PM** (task `bapm-ABC-281-dor`, records only, at `main` `748d4fa3`; nothing
> run). Architect/Design met row 11 (`arch-ABC-281`, decision `…d7b2b02b`; `ADR-0046` § Dated 2026-11-04): **all three
> rows take form S (slice).** Each full row moves to its file's deep lane, and a small default-lane remnant keeps the
> row's unique kill. Default-lane kill parity was measured on seven mutants, so option (b) does not bind and there is
> no owner question.
>
> - **What this changes on the page** (each line below is marked "all-S, 2026-11-04"):
>   - § Scope: the three remnants, and R1's placement (the describe and its `sweep` stay);
>   - A2: the `sweep` stays, one copy;
>   - A3: the lane total and each file's count equal base's, and one name out, one in per file;
>   - A4: each deep lane reads base + 1;
>   - A6: the mutant list as the Architect recommended;
>   - A8 and § NFR triggers: the expected value is about 9.4–9.55 s (base − 0.36 s);
>   - `R-281-a`: closed for the measured mutants;
>   - § The Architect's confirmation: BA/PM's "the seed is used" reading is corrected.
> - **Where they differ, the `ADR-0046` dated section and its build conditions 1–5 win** over this page.
> - The board shows the card **In Development** (Orchestrator, `748d4fa3`). Column moves are the Orchestrator's; this
>   page records the `Backlog → Ready` exit only.

> **Cut 2026-11-04 by BA/PM** (task `bapm-nfr008-rows`, records only, at `main` `3e87ceaf`). Nothing was run, built
> or timed; every line number and title below was read with `grep` / `sed`. `src/`, `tools/`, `AGENTS.md`,
> `plans/nfr-catalog.md` and the board are untouched.
>
> - **Source:** Security/NFR `secnfr-nfr008-headroom`: decision `…8a4fb936` (PASS_WITH_RISKS, the recommendation),
>   observations `…f925027f` (`main` read ALONE, median 9.77 / 9.90 s) and `…69126dca` (the three-row probe,
>   −0.38 s paired median wall, 7 of 7).
> - **DoR 9 of 10. It stays in `Backlog`.** Row 10 (no major unresolved blocker) waits on row 11: **Architect/Design
>   confirms the coverage moves** (§ The Architect's confirmation). If the Architect picks a form this page already
>   carries, the ticket goes Ready with a dated line and no re-cut. Column moves are the Orchestrator's.
> - **Homed in `EPIC-011` as lane hygiene, outside the phase order** (as `ABC-276`–`ABC-278` are). `EPIC-010` is done.
>   The latest lane growth came from this epic's merges (`ABC-279`, `ABC-280`).

## Problem

- **User:** the owner, and every agent hop that runs `npm test` at a gate.
- **Pain:** `main`'s default lane is under `NFR-008`'s 10 s, but only just.
  - It read under 10 s in 15 of 15 scored runs: median 9.77 s (n 8) and 9.90 s (n 7), max 9.98 s (`…f925027f`).
  - The headroom on the median is **0.10–0.23 s**. The window-to-window spread is **≈ 0.3–0.5 s**, which is larger.
    The lane has grown +0.52 s since `ABC-244`'s 9.25 s (2026-10-30).
  - So the next default-lane addition can put a gate's median over 10 s on an ordinary window. A breach goes to the
    owner (`ADR-0035` D6). That is `R-N8H-1`, MEDIUM.
- **Value:** about **−0.38 s of lane wall** (probe, paired median, 7 of 7 negative; −1.09 s CPU). The lane would sit
  near 9.4 s. This is an estimate until A8 reads it. No production line, NFR level, cap or lane command moves.
  - **All-S, 2026-11-04:** the three remnants keep about 45 ms of the rows' 738 ms in-thread. The Architect's forecast
    is about **−0.36 s** of wall (693 / 738 of the probe's −0.38 s), so the lane would sit near 9.4–9.55 s.

## Scope

Three rows, in three test files. Each file already has a deep lane, gated by its own `RUN_DEEP` constant. Line numbers
are as read at `3e87ceaf`.

| row | file (lines) | probe cost | to | what is gated, and the new title |
|---|---|---|---|---|
| **R1:** `QE-208-a`, "position-6, the even readings 4 to 24: 0 mutated roots, and aborts landing inside a null subtree" | `src/search.null-move.test.ts` (describe `:495`, it `:535`; the deep block opens at `:723`) | 365 ms | `SEARCH_DEEP=1` | the whole describe moves (it holds this one row and its `sweep` helper). Both titles gain the file's suffix " [deep, SEARCH_DEEP=1]", the file's own pattern (`:766`, `:772`) |
| **R2:** `ABC-230` A4, "A4: an empty list is node-equal to an absent one over the endgames and the thirty" | `src/engine.test.ts` (describe `:1688`, it `:1689`; the deep block opens at `:1017`) | 236 ms | `ENGINE_DEEP=1` | the row alone moves, into a describe titled with the original describe's title plus " [deep, ENGINE_DEEP=1]". The `it` title stays byte-identical. Its sibling "the three test-only doors ignore prior keys…" **stays** in the default lane, byte-identical |
| **R3:** "A9 — different seeds actually differ" › "≥ 5 seeds over the same ≥ 30 positions give ≥ 2 distinct blunder-decision sequences" | `src/levels.test.ts` (describe `:899`, it `:900`; the deep block opens at `:1048`) | 135 ms | `ENGINE_DEEP=1` | the whole describe moves (one row). The describe title gains " [deep]", the suffix this file's deep describes use. The `it` title stays byte-identical |

- **Placement is the SE's.** It can go in the file's existing `if (RUN_DEEP)` block, or in a new `if (RUN_DEEP)` beside
  the row, using the same constant. With the flag unset the row is **not defined**, which is the files' pattern. It is
  not an `it.skip` or a `skipIf`.
- **All-S, 2026-11-04: the default-lane remnants** (`ADR-0046` § Dated 2026-11-04, conditions 1–5). Each full row still
  moves as the table says. One new default-lane row per file keeps that row's unique kill:

  | row | the remnant (confirmed by Architect/Design) | where it sits | its title must name |
  |---|---|---|---|
  | R1 | the file's `sweep` on `chooseMoveWithoutTaper` at readings **8 and 10**: 0 mutated roots, and `insideNull` ≥ 1 asserted (2 at base). About 20 ms | **The R1 describe and its `sweep` stay in the default lane.** The remnant `it` takes the row's place. Inside the describe, an `if (RUN_DEEP)` holds a describe titled the describe's own title plus " [deep, SEARCH_DEEP=1]". It holds the full row: its `it` title plus the suffix, and its body byte-identical. **One copy of `sweep`, byte-identical; no duplicate** (condition 2). Another shape is the SE's only if it keeps one `sweep` and A4's `-t` line still prints "1 passed" | readings 8 and 10, and `chooseMoveWithoutTaper` |
  | R2 | `[]` vs absent, `figures` equal, on **kr-corner, startpos and position-6**. About 21 ms | in the original describe, beside the byte-identical sibling (condition 3). The full row goes into the " [deep, ENGINE_DEEP=1]" describe as the table says | the three positions |
  | R3 | `QE-087-d`'s draw check on **seed 1 over the first 10 of the thirty**, asserting at least one blunder and at least one engine move. About 4 ms | a new default-lane describe. The A9 describe moves whole, with " [deep]" (condition 4) | seed 1 and the first 10 of the thirty |

  - **A different subset** needs the same evidence (condition 1): at the tip it kills every A6 mutant in the default
    lane, and it asserts its own non-vacuity (R1: `insideNull` ≥ 1; R3: ≥ 1 blunder and ≥ 1 engine move).
  - The remnant's exact title is the SE's, inside the "must name" column and A2's rule (it states exactly what it
    samples).
- **`AGENTS.md`:** of the three lane lines, only the null-move line carries a count ("Null-move deep lane (opt-in,
  ABC-208, 44 rows)"). That count becomes the tip's deep-lane total, expected 45. The engine and levels lines carry no
  count and no row names, so they need no edit. **How it fits:** `AGENTS.md` is 18 429 B against the 18 432 B budget
  (`src/cli.test.ts` `ABC-109` A5). "44" → "45" is the same byte count, 0 B net. A count that crosses a digit boundary
  would cost +1 B and still fit inside the 3 B. If base's count is not 44 (`UNKNOWN - verify`: it was counted at
  `ABC-208` and not re-read here), the tip's count is written anyway. **Who:** the SE, in the delivered commit, with
  one entry in `memory-bank/90-agents-md-command-log.md` (bytes before and after). The Orchestrator may route the two
  lines to a Scribe hop instead, but it lands inside this ticket's diff, before QE.
- **No new test file** (`R-N8H-3`: every new file costs ≈ 0.1 s of wall before its first assertion).
- **Each row reverts alone.**

## Out of scope

- `src/cli.test.ts`'s collect-time children, and its 0.6 s `A9_SETTLE_SECONDS` sleep. They are the default lane's only
  end-to-end runs of the delivered command (`ADR-0008` Ruling 4 / `C2`). The sleep is a second-tranche candidate for
  Architect/Design only, because it guards a race.
- More `src/uci-session.test.ts` rows (`ABC-248` moved the time-blind ones), and `tools/grugops/qe-hop-integrity.test.ts`
  (no deep lane under `tools/`; its growth is `T-QEHOP-GROWTH`'s, `R-N8H-2`).
- `QE-208-b`, A2's depth-6 rows, and every other row in the three files. That includes all shared helpers (`instrument`,
  `probes`, `fenOf`, `figures`, `tickingClock`, `playAll`, `assertPerMove`, `decisions`, `seededRandom`).
- Production `src/*.ts`, `vitest.config.ts`, `package.json`, `tools/`, `data/` and `plans/nfr-catalog.md`.
- **The owner's levers:** `NFR-008`'s 10 s, `maxWorkers: 2`, the heap flag, W. **`Q-N8H-1`** (re-state `NFR-008`?) is
  held by the Orchestrator and **not asked**. Security/NFR's trigger for asking it is A8's median at ≥ 9.6 s.

## The Architect's confirmation (DoR row 11): ruled **needed**, and narrowed

Security/NFR's decision `…8a4fb936` names Architect/Design to confirm the moves, "as owner of the floor account". I
looked at whether the confirmation could be ruled not needed (test-only, coverage kept in deep lanes). **It cannot,
for this reason:**

- **The floor account is not what moves.** `NFR-008`'s row splits the budget into the content account (per ticket,
  owner BA/PM at each cut) and the floor account (files × per-file cost, owner Architect/Design). No file leaves the
  lane and no per-file cost changes, so on that ground alone BA/PM could rule it.
- **Coverage is what moves, and the standing record gives that call to the owner, not to BA/PM.**
  - `ADR-0046` § Addendum 2026-10-31 (census, T2b) and BA/PM's own ruling on `ABC-248` ("Why not T2b") say this.
    `QE-208-a` is the default lane's **only** row that aborts inside an open null move. Moving it to `SEARCH_DEEP`
    takes `ADR-0050`'s abort-restores-root guard out of the default lane, "where no other row holds them". That
    trade is option (b) of the owner framing, "so it stays his lever".
  - `ADR-0046` § Consequences lets a row leave the default lane "only under default-lane kill parity, and only on the
    tranche-2 ticket".
- **Security/NFR's "what stays" list does not hold R1's guard.** The decision lists `src/engine.test.ts` "leaves every
  searched position byte-identical, aborted iteration or not" (`:848`). That row is `ABC-078` A7. Its clock is spent
  after the entry reading, so it aborts before any null move opens (`:813`–`:833`; `ADR-0046` census line, re-read
  here statically). It also lists "unmakeNullMove leaves every position byte-identical" (`:219`), a unit row with no
  abort. Neither one aborts inside a null subtree. This is reasoned from source, not a mutant run. A6's parity run
  decides it.
- **R2 and R3 move single-holder properties too.**
  - R2 is the only row that reads `priorKeys: []` against an absent list on `chooseMove`. `grep` finds one
    `priorKeys: []` in `src/*.test.ts`.
  - R3 is the default lane's only row asserting that the seed is used (≥ 2 distinct sequences). It is also the only
    one asserting `QE-087-d`, one draw per move (`ADR-0032` d2): `grep` finds that assertion only at
    `src/levels.test.ts:906`. "A7 — seeded" checks that a fixed seed repeats, and catches neither defect.
  - **Correction (all-S, 2026-11-04, BA/PM, from Architect/Design `…d7b2b02b` / `…e969c2f0`): "the seed is used" is
    not single-held.** It was reasoned from `grep`, not run. Measured, the seed-ignored mutant (M3a, `seededRandom(0)`)
    has **15 other default-lane killers** besides R3: levels A10 "the seed is threaded, not global", `ABC-242` A6, and
    13 `src/uci-session.test.ts` rows. **The single-held property is the one draw per move (`QE-087-d`).** An extra
    draw before the decision (M3b) is also killed by `ABC-242` A6, on move 1. An extra draw after the decision, on a
    blunder (M3c, `ABC-087`'s `M5b` shape) or on an engine move (M3d), is killed by R3 alone. So R3's remnant keeps
    `QE-087-d`, and "the seed is used" leaves the default lane only as breadth, with A10 still holding it. The
    `QE-087-d` half of the sentence above stands. BA/PM's observation `bapm-nfr008-rows` `…d012231e` carries the same
    reading, and this line corrects it.
  - Security/NFR's table states this plainly ("coverage that leaves the default lane").

**So the confirmation is a DoR row, and the question is narrow.** Architect/Design picks one form per row and records it
as a dated line (in `ADR-0046`, the lane remedy's account, or a note the Orchestrator cites):

| form | what it means | what this page's acceptance then reads |
|---|---|---|
| **W (whole)** | the row moves whole, and its coverage runs only in its deep lane. The Architect states why `ADR-0046`'s option (b) does not bind this move, or that it does, in which case the Orchestrator routes it (`Q-N8H-1`; owner delegation) | A3 base − 1 for that file; A6 reports the row's mutant as "default lane: not killed, deep lane: killed" |
| **S (slice)** | a default-lane remnant keeps the row's unique kill. The full row moves deep. Security/NFR's decision names this "acceptable at part of the saving". For R1 that means a subset of the readings with `insideNull` ≥ 1 on `chooseMoveWithoutTaper`. The SE picks the subset and the Architect confirms it | A3 count equal for that file; the remnant's title states exactly what it samples; A6 reads "default lane: killed" |
| **K (keep)** | the row stays, and leaves this ticket | the row's criteria drop; the ticket closes on the others |

BA/PM's lean, not binding on the Architect: W for R2 and R3 (each guards one property with no design record naming
it a default-lane guard), and S for R1 (`ADR-0050`'s guard, which `ADR-0046` does name, and which is cheap to keep
partly). How often the `ENGINE_DEEP` lanes are run at gates is not on record here (`UNKNOWN - verify`); it bears on
W. **If the Architect picks W for all three, the acceptance
below stands as written** (the default lane drops by exactly 3).

**The Architect's pick, 2026-11-04 (`arch-ABC-281` `…d7b2b02b`; `ADR-0046` § Dated 2026-11-04): S, S, S.** It
supersedes the lean above. Under W, M1, M2, M3c and M3d would each lose their only default-lane killer. That fails
`ADR-0046` § Consequences' kill parity, and it is option (b). Under S, the tip sketch's default lane reads 2 650 /
2 650 green and kills all seven mutants, so parity holds. K would give up about 94 % of the saving for kills the
remnants already hold. `ADR-0046` reads § Consequences' "only on the tranche-2 ticket" as carrying to `ABC-281` under
the same parity condition, for these three rows only, with **this cut as BA/PM's word**, as the `ABC-248` ruling was
for tranche 2. BA/PM gives that word here: the cut carries form S, and A6 checks parity. The `ENGINE_DEEP` run
frequency stays `UNKNOWN - verify`, and under S no unique kill depends on it. **The acceptance below is now read
under form S for all three rows** (the all-S lines).

## Acceptance criteria

The base is `main` at the commit the build branches from. The tip is this ticket's delivered commit. "The form" is the
Architect's per-row pick (row 11). The criteria are written for W, with the S and K variants inline.

**Build (Software Engineer)**

- **`A1` (what the diff may touch).** **Given** `git diff <base> <tip>`, **then**:
  - `--name-only` prints only `src/search.null-move.test.ts`, `src/engine.test.ts`, `src/levels.test.ts`, and, only
    with A5's count change, `AGENTS.md` and `memory-bank/90-agents-md-command-log.md`. No file is added;
  - no production `src/` line changes. `git diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` is
    empty.
- **`A2` (bodies byte-identical).** **Given** the diff, **then**:
  - each moved row's body, from the line after its `it(` header to its closing `});`, is byte-identical to base. Only
    its enclosing block and the titles in § Scope change;
  - R1's `sweep` helper moves with its describe, byte-identical. **All-S, 2026-11-04:** the `sweep` **stays**, one copy,
    byte-identical, with no duplicate helper (condition 2);
  - no other row's title, body or `expect(` line changes. R2's sibling "the three test-only doors ignore prior keys…"
    and "A7 — seeded" are byte-identical;
  - each moved row is defined only under its file's existing `RUN_DEEP` constant. No `it.skip`, `skipIf` or new
    environment variable is added;
  - under form S, the remnant is the only new default-lane code, and its title states the readings or positions it
    keeps, exactly;
  - added comments cite only `ABC-281` and `secnfr-nfr008-headroom`. **All-S, 2026-11-04:** `arch-ABC-281` and
    `ADR-0046` may be cited too.
- **`A3` (counts and names).** **Given** the vitest JSON report of `npm test` at base and at the tip, **then**:
  - **the lane total at the tip is base − 3**, with 0 skipped and all passing. At `main` `08843504` that is
    2 650 → 2 647; it is re-read at the build's base. Under form S or K, the total is base − (rows moved whole);
  - each of the three files' counts is base − 1. Under S or K, that file's count is equal;
  - each file's sorted full names equal base's with exactly the moved title removed. Under S, the remnant's retitle is
    the only other difference;
  - the files collected are equal (69 at `08843504`), and `lane-inventory` reports no findings.
  - **All-S, 2026-11-04 (this is what A3 reads):**
    - the lane total at the tip **equals base's**, with 0 skipped and all passing. That is 2 650 → 2 650 at `ff07571f`
      (`src/` tree `8adb0a18`, as at `08843504`). It is re-read at the build's base;
    - **each of the three files' counts equals base's**;
    - in each file, the sorted full names equal base's with **exactly one name out and one in**. Out goes the moved
      row's full name. In comes the remnant's full name, which states what it samples (§ Scope, all-S table). No other
      name differs. With the flag unset, no " [deep" title appears in the report;
    - the files collected and `lane-inventory` read as above.
- **`A4` (each moved row is green in its lane, by count, not by exit code).** **Given** the tip, **when** each line
  below runs, on one line, with the brackets escaped (vitest reads `-t` as a regular expression; `QE-248-a`), **then**
  each prints **"1 passed"** and 0 failed. Exit 0 with 0 tests fails the check. A brief that fences `npx` runs the same
  arguments through `node_modules/.bin/vitest`.

  ```
  SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts -t "QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical \[deep, SEARCH_DEEP=1\]"
  ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/engine.test.ts -t "ABC-230 A3 and A4 — no prior keys is base, node for node, and the doors take none \[deep, ENGINE_DEEP=1\]"
  ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts -t "A9 — different seeds actually differ \[deep\]"
  ```

  Also: each file's full deep lane, run as its `AGENTS.md` line spells it, exits 0 with 0 failed, and its passed
  count is base's deep count + 1. With the flag unset, the moved title is absent from A3's report.

  **All-S, 2026-11-04:**
  - The three `-t` lines stand as spelled, and each prints "1 passed". Under R1's nested placement, the inner
    describe's title is the R1 describe's title plus " [deep, SEARCH_DEEP=1]". The `-t` matches that inner describe,
    and only the full row sits inside it. The remnant's name has no " [deep" and is not matched. R2's and R3's `-t`
    match their deep describes the same way.
  - Each file's deep lane, run as its `AGENTS.md` line spells it with the flag set, exits 0 with 0 failed. Its passed
    count is **base's count for that same command + 1**: the remnant replaces the row in the default part, and the
    full row is added in the deep part.
  - A5's null-move "44 rows" becomes that lane's passed count at the tip (condition 5). 45 is expected if base reads
    44 (`UNKNOWN - verify`, as in § Scope).
- **`A5` (`AGENTS.md`).** **Given** `AGENTS.md` at the tip, **then**:
  - the null-move line's row count equals that lane's passed count at the tip, as read in A4;
  - no other byte of `AGENTS.md` changes;
  - its size is ≤ 18 432 B (`ABC-109` A5 green). Expected 18 429 → 18 429 B;
  - `memory-bank/90-agents-md-command-log.md` has one entry with bytes before and after.

  If the count does not change, neither file is touched.

**Gate (QE, then Security/NFR)**

- **`A6` (what coverage left the default lane, measured).** **Given** these mutants, frozen in QE's pre-registration
  before any head run, **when** each is applied to a scratch copy of production (never the repository's `src/`),
  **then** QE reports, per mutant, killed or not by the default lane at the tip, and killed or not by the row's deep
  lane at the tip:
  - R1: `ADR-0050`'s plant, the null move not unmade on abort;
  - R2: one mutant that treats `priorKeys: []` unlike an absent list;
  - R3: one that ignores the seed (one fixed generator), and one that takes an extra draw per move (`QE-087-d`).

  Each is killed at base by the default lane, which is the control. **Every one is killed by its deep lane at the
  tip.** Under form W, a "not killed" by the default lane matches the Architect's line for that row; under form S, the
  default lane kills it. A mismatch is a STOP to Architect/Design, not a waiver.

  **All-S, 2026-11-04: the list QE freezes** (as Architect/Design recommended in `ADR-0046` § Dated 2026-11-04; the
  mutant ids are the Architect's, from `.grugops/context/arch-ABC-281/raw/mut.py`):
  - **R1: M1.** `ADR-0050`'s plant: the null move is unmade without `finally`, so it is not unmade on abort.
  - **R2: the M2c shape.** An empty `priorKeys` list turns the null move off. This shape needs the null move, so it is
    invisible on the six endgames and seen on startpos and position-6. The M2 shape (an empty list leaves the table
    uncleared) may be added; QE decides.
  - **R3: the M3c shape (`ABC-087`'s `M5b`).** An extra draw after the decision, on a blunder move. **Not M3b**: an
    extra draw before the decision has a second default-lane killer (`ABC-242` A6), so it tests nothing about A9.
  - The original list's seed-ignored mutant (M3a) is **dropped**: it has 15 other default-lane killers (§ The
    Architect's confirmation, correction), so it tests nothing about R3.

  How each mutant reads under all-S:
  - at base, the default lane kills it (the control);
  - at the tip, the default lane kills it, **and the row's remnant is among its killers, named.** For M2c the
    `QE-208-c` source-literal row also kills it, so a kill by that row alone does not count;
  - at the tip, the row's deep lane kills it.

  A remnant that does not kill its mutant is a STOP to Architect/Design (condition 1), not a waiver.
- **`A7` (gates).** **Given** the tip, **then** lint, typecheck, unit and build are green. The default lane has 0
  skips. `test-skip-integrity` and `lane-inventory` report no findings.
- **`A8` (`NFR-008`, graded: the twin re-read).** **Given** base and tip, **when** QE reads `npm test` as spelled,
  under these conditions:
  - pre-registered: a PREREG note committed before the first poll;
  - **ALONE** inside the host lock, never beside a smoke, a batch or another timed read;
  - AC power recorded per run (`oeselg-dev` has no battery, so this holds trivially, `…f925027f`);
  - load1 ≤ 8 before each scored run;
  - arms B (base), H (tip) and **H2, an identity twin of H** (its own copy, `cmp`-verified), per `ADR-0035` D1 and
    decision 2;
  - n ≥ 8 scored rounds, round 0 discarded;

  **then** the report gives:
  - H's median wall with its interval;
  - H − B, wall and CPU;
  - the twin's admissibility (median CPU delta ≤ 1.5 % of the lane's CPU) and its R.

  How a reading routes:
  - **H ≤ 10 s with an admissible twin is `NFR-008` MET, graded.**
  - An inadmissible twin voids the reading. It is re-read in another window and not graded.
  - **H > 10 s goes to the owner** (`ADR-0035` D6). The ticket holds at the gate until his word. No cap, pin, bar or
    level moves to get under.
  - The expected value, not a bar, is ≈ 9.4 s (base − 0.38 s). An H median **≥ 9.6 s** is the Orchestrator's trigger
    to put `Q-N8H-1` (b) or (c) to the owner (Security/NFR's framing). It does not fail this ticket.
  - **All-S, 2026-11-04:** the expected value, still not a bar, is **about 9.4–9.55 s (base − 0.36 s)**, the
    Architect's forecast. The 9.6 s trigger is unchanged.
- **`A9` (`R-N8H-1`).** **Given** A8, **then** Security/NFR records `R-N8H-1`'s state as closed or carried, with the
  reading cited. BA/PM does not rule it.
  - **Ruled 2026-11-04 by Security/NFR** (`secnfr-ABC-281-a9`, `…2e3b747f` on `…52f74e3c`; QE A8 `…c7e298cd`): **`R-N8H-1`
    carried, downgraded MEDIUM → LOW.** H is 9.42 s [9.33, 9.51], so headroom is 0.58 s, above the 0.3–0.5 s window spread by
    only 0.08–0.28 s. Owner: Orchestrator; remedy owner: Architect/Design. Back to MEDIUM at any ALONE or graded median ≥ 9.5 s;
    closed at a graded median ≤ 9.0 s. `R-N8H-2` and `R-N8H-3` are unchanged. `R-281-a` stays LOW: how often the deep lanes run
    is `UNKNOWN - verify`, and Architect/Design owns that rule. `Q-N8H-1` stays held (9.42 s < 9.6 s). Result: PASS_WITH_RISKS.

## NFR triggers

- **`NFR-008`:** `npm test` median wall **≤ 10 s** at load1 ≤ 8 on the declared stack. Graded with an admissible
  identity twin (A8). CPU is reported.
- **Expected:** H ≈ 9.4 s. Reported, not a bar. **≥ 9.6 s** is the `Q-N8H-1` trigger, which the Orchestrator holds.
  **All-S, 2026-11-04:** H ≈ 9.4–9.55 s (base − 0.36 s; the remnants cost about 0.02 s of wall). Still reported, not a
  bar.
- **`NFR-010`** and the heap caps are untouched. No config, flag or worker count moves.
- **`N8-LANE`:** not read. The ticket adds no default-lane cost, and A8 reads the change on the full lane.
- **`AGENTS.md` budget:** ≤ 18 432 B (A5).
- **Security:** not triggered. Test-only, with no input, auth, data or secret surface.

## Test notes

1. **Freeze first.** A6's mutants are recorded, with their base kill sets, in QE's pre-registration before any head
   run. The SE's own checks use the same list.
2. **A1–A7 need no quiet host. A8 does,** ALONE. Under the host lock today, `se-ABC-239b`'s fits and QE's game reads
   queue ahead of it.
3. **No UAT.** The ticket changes no production line. UAT is waived under `AGENTS.md`'s standing rule (2026-08-17) if
   `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` is empty at delivery.
   `AGENTS.md` and the command log are not under `src/`. QE's verdict signs.
4. **`-t` is a regular expression.** Escape both brackets. The check is the count (A4).
5. **Rows by title, not line.** `ABC-239`'s redo may re-pin value rows in these files first. If it does, re-read the
   line numbers. The titles do not change.
6. **Rollback.** Revert the delivered commit. Each row goes back on its own.

## Size and priority

**`S`, low end.** The moves alone are `XS`: three rows, and one count. **All-S, 2026-11-04:** still `S`. The three
remnants are small rows on helpers the files already have, and their subsets are confirmed, so nothing new is
estimated. **Not `XS`:** A6's frozen mutants and A8's
graded twin read, which needs an ALONE slot. **Not `M`:** the rows are named, and the files and lanes already exist.

**`P2`.** `NFR-008` is MET (15 of 15 under 10 s), and no user-visible behaviour is wrong, so **not `P1`**. **Not
`P3`:** the headroom is smaller than the window spread, so the next default-lane addition can route a breach to the
owner.

**Epic: `EPIC-011`**, as lane hygiene outside the phase order.

## Dependencies

- **Architect/Design: DoR row 11, one form per row** (§ The Architect's confirmation). It is a records hop with
  nothing to run. **Met 2026-11-04** (`arch-ABC-281` `…d7b2b02b`): S, S, S.
- **Files:** no open ticket's scope names these three rows. `ABC-239`'s redo (`se-ABC-239b`, pending) may re-pin
  value rows in test files. Whichever merges second re-reads its line numbers (test note 5).
- **Host:** A8 waits for an ALONE slot.
- **Owners:** SE A1–A5; QE A6–A8; Security/NFR A9 and `NFR-008`'s state; Architect/Design row 11.

## Risks (from `secnfr-nfr008-headroom` `…8a4fb936`)

- **`R-N8H-1` (MEDIUM):** `NFR-008` has ≈ 0.1–0.2 s of headroom on `main`, less than the window spread.
  - Owner: the **Orchestrator** (routes this cut, holds the watch). Remedy owner: **Architect/Design**.
  - It stays open until this ticket's A8 re-read. Then it is closed or carried (A9).
- **`R-N8H-2` (LOW):** `qe-hop-integrity.test.ts`'s cost grows with the note store (367–417 ms at 5 064 note files).
  - Owner: **Architect/Design**. `T-QEHOP-GROWTH` re-arms at 5 500 note files.
  - Not this ticket's.
- **`R-N8H-3` (INFO):** start-up dominates small files: ≈ 0.1 s of wall per new test file before its first
  assertion. Owner: **BA/PM**, at each cut. Applied here: no new file (A1). It carries to later cuts as "prefer adding
  rows to an existing file".
- **`R-281-a` (LOW, this cut):** moved coverage runs only when someone runs a deep lane. No `npm run` script runs a
  `*_DEEP` lane (`AGENTS.md`). Mitigation: A6 measures exactly what leaves the default lane, and the Architect's
  per-row form decides whether that is acceptable. Owner: Architect/Design (row 11).
  - **All-S, 2026-11-04: closed for the measured mutants, and carried to A6's list** (`ADR-0046` § Dated 2026-11-04).
    The tip sketch's default lane kills all seven mutants (M1, M2, M2c, M3a–M3d); A6 re-reads the frozen ones on the
    real tip.
  - What runs only deep under S is **breadth**, with no unique kill measured in it:
    - R1: readings 4–24 other than 8 and 10;
    - R2: 33 of the 36 positions;
    - R3: four more seeds, 20 more moves on seed 1, and "the seed is used" (levels A10 still holds it in the default
      lane).
- **`Q-N8H-1`:** held by the Orchestrator, **not asked**. Security/NFR recommends (a): keep the 10 s level and keep
  moving heavy rows to deep lanes. Ask (b) or (c) only if A8 reads ≥ 9.6 s.

## Definition of Ready

BA/PM, 2026-11-04, at `main` `3e87ceaf`. **Result: 9 of 10, plus row 11 open. Stays in `Backlog`.**

**Re-read 2026-11-04, BA/PM (`bapm-ABC-281-dor`, at `main` `748d4fa3`): 10 of 10, row 11 met. Ready.** Rows 1–9 stand,
re-read under all-S:
- row 2: the remnants are named (§ Scope, all-S);
- row 4: lane total equal to base's, one name out and one in per file, deep lane + 1, a frozen mutant list with the
  remnant among the killers;
- row 6: expected 9.4–9.55 s;
- row 8: still `S`.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ median 9.77 / 9.90 s; headroom 0.10–0.23 s is below the 0.3–0.5 s spread; −0.38 s measured on a probe |
| 2 | scope and out-of-scope clear | ✅ three rows by title and line, their target lanes and titles; the `AGENTS.md` count and how it fits (0 B of 3 B); `cli.test.ts`, `uci-session`, `qe-hop`, the helpers and the owner levers fenced off |
| 3 | INVEST-shaped | ✅ one slice; independent of in-flight work; each row reverts alone; testable by counts, names, mutants and a graded read |
| 4 | acceptance testable and measurable | ✅ name-only list; byte-identical bodies; base − 3 tests, 0 skipped; "1 passed" per deep row; deep total + 1; `AGENTS.md` ≤ 18 432 B; a killed or not-killed matrix per mutant; H ≤ 10 s with an admissible twin |
| 5 | dependencies known | ✅ Architect row 11; `ABC-239` redo may re-pin (by title); ALONE slot for A8; owners named |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-008` ≤ 10 s graded with a twin; 9.6 s `Q-N8H-1` trigger (report); `NFR-010` untouched; security not triggered |
| 7 | test notes present | ✅ six |
| 8 | size assigned | ✅ `S` (low end) |
| 9 | priority assigned | ✅ `P2`, both directions argued |
| 10 | no major unresolved blocker | ✅ 2026-11-04: row 11 met; no owner question (option (b) does not bind). A8's ALONE slot is scheduling, not a blocker |
| 11 | **Architect/Design confirms the coverage moves** (Security/NFR `…8a4fb936`) | ✅ 2026-11-04, Architect/Design (`arch-ABC-281`; `ADR-0046` § Dated 2026-11-04): R1 **S** (readings 8 and 10 on `chooseMoveWithoutTaper`), R2 **S** (kr-corner, startpos, position-6), R3 **S** (`QE-087-d`, seed 1, the first 10 of the thirty). Default-lane kill parity measured on seven mutants, so option (b) does not bind and there is no owner question. Row 10 ✅. DoR 10 of 10: Ready. *(Was: ⏳ open, one form (W / S / K) per row; ruled needed because `ADR-0046`'s T2b census and § Consequences put coverage-losing moves at the owner's option (b), and R1's guard had no other default-lane holder.)* |

**Recommended:** stays in `Backlog`. It goes **Ready on the Architect's dated line**, with no re-cut if the form is W, S
or K per row. Column moves are the Orchestrator's.

**2026-11-04: Ready.** The Architect's line is dated, the form is S on every row, and there was no re-cut: the all-S
lines are this page's own S variants, filled in. The board shows In Development (Orchestrator, `748d4fa3`).
