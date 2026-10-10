---
id: ABC-136
title: The licence guard's two operands are unpinned — narrowing either one turns its equality into a subset check and the suite stays green (ADR-0011 R5b)
status: in-development
column: In Development
size: XS
priority: P3
epic: —
feature: —
---

# ABC-136 — pin the licence guard's scanned set and importer set, the way `ABC-057` pinned its comparator

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-followups-2026-10-10`) at wave
> tip `71418879`. The source is `ADR-0011` `R5b` (`§ Pointers 2026-10-10`, P4), which Architect/Design
> ruled a ticket and specified in decision note
> `.grugops/context/design-owed-rulings-2026-10-10/notes/…95c73721` § 3. The gap is QE's `QE-057-a`
> (`.grugops/context/qe-ABC-057/notes/…a331f012`). **What this page pins is the Architect's; the
> spelling is the Engineer's.** Readings: `.grugops/context/bapm-followups-2026-10-10/probe/RUN.txt`.

## Problem

*User*: the next hop that edits the licence guard in `src/history-pane.nfr.test.ts`. That guard holds
`ADR-0002` clause 4's single-supplier invariant over every production module (`ADR-0011` clause 3).
The reader trusts the drift tripwire to tell them when the guard stops measuring what it says.

*Pain*: `ABC-057` pinned the guard's **operator** (`R5`, closed). Its two **operands** are unpinned.
Each of these one-line, gate-clean edits drops the unlicensed-importer kill, and the file stays green.
Re-run here on QE's own planter at `71418879` (the file is byte-identical to QE's `00aad4da`):

| mutant (QE's `plantqe057.py`) | edit | with `WPERFT-STATIC` planted |
|---|---|---|
| `QSCAN-NARROW` | the guard's `const production = productionModulesIn(directory);` (`:361`) narrowed by a `.filter` | **12/12 green** |
| `QLHS-INTERSECT` | the `runtimeImporters` statement (`:362-366`) narrowed to the licence before the equality | **12/12 green** |

`WPERFT-STATIC` (an unlicensed runtime importer of `history.ts`) is **red** on the pristine tree. So
each edit turns the equality into a subset check, as `R5` warned for the operator. The tripwire's
comment (`:476-477`) says *"a hop that widens the guard reds this test"*. Today that claims more than
the tripwire pins.

*Value*: the guard's one real kill (the unlicensed importer) cannot be silently undone by a narrowing
edit that a reviewer could pass as a tidy-up. A comment that overclaims becomes one that states its
reach.

## Scope

In the existing drift-tripwire `it` (*"runs the guard's OWN expression — a drift tripwire, not a copy
that can go stale"*), add two text pins and narrow its comment:
1. **The scanned set.** The guard's `const production = productionModulesIn(directory);` line,
   framed together with the line after it so that it is unique. `:621` has a similar call
   (`productionModulesIn(directory.pathname)`).
2. **The importer set.** The whole `const runtimeImporters = production.filter(…);` statement
   through its closing `);`.
3. **The comment** says what is pinned (the expression, the comparator and the two operands) and
   that a pin is not tamper-proof. It stops claiming that any widening reds the test.

Both pins are framed literals with the leading newline and indent, as `ABC-057` `D1` requires, so
that they cannot match themselves.

## Out of scope

- **Any change to the guard's own statements** (`:361-374`). The pins READ those lines and change no
  expression, so `ABC-029`'s bar is not crossed (`ADR-0011` P4).
- **Making the pins tamper-proof.** A weakening that keeps the pinned text in a block comment
  survives a text pin. QE's `QMOVE-COMMENTED-M15` survives the operator pin today. This is the same
  accepted residual as `R5`'s: *"a weakening just has to show in the diff"*.
- **`ABC-134`'s four comment sentences** in the same file. That is a separate ticket, sequenced after
  this one (§ Dependencies).
- **Every other file,** including `ABC-030`'s line (`:115`).

## Acceptance (Given/When/Then)

"Planted" means: on a fresh `git archive` of the tree with `node_modules` linked, run QE's planter
`.grugops/context/qe-ABC-057/probe/plantqe057.py <tree> <build>`, then
`npx vitest run src/history-pane.nfr.test.ts`. `probe/r5b-ledger.sh` in this task's context does
exactly that. "Collapsed text" is `ABC-134`'s definition (`bapm-owed-batch-2026-10-10/probe/phrases.mjs`).

- **`A1` (the scanned set is pinned).** **Given** the delivered tree with `QSCAN-NARROW+FMT` planted,
  and again with `QSCAN-NARROW+FMT+WPERFT-STATIC`, **then** each run exits 1 and the drift tripwire
  is among the failed tests. *(At `71418879`: both exit 0, 12/12.)*
- **`A2` (the importer set is pinned).** **Given** `QLHS-INTERSECT+FMT`, and again with
  `QLHS-INTERSECT+FMT+WPERFT-STATIC`, **then** each exits 1 and the drift tripwire is among the
  failed tests. *(At `71418879`: both exit 0, 12/12.)*
- **`A3` (nothing else in the ledger moved).** **Given** the same planter on the delivered tree:
  - `CONTROL` exits 0, with the same test count as the base (**12** in this file at `71418879`);
  - `M15+FMT` and `M15SUB+FMT` still fail the drift tripwire;
  - `WLAUNDER`, `WSTALELICENCE` and `WPERFT-STATIC` fail **the same tests by name** as on the base.
    At `71418879` those are 3, 1 and 1;
  - no build prints `PLANT-FAILED`. Every planter anchor still occurs exactly once, which also
    proves that no pin matches itself.
- **`A4` (the comment states its reach).** **Then** "a hop that widens the guard reds this test"
  occurs **0** times in collapsed text (**1** at `71418879`). **And** the tripwire's `//` comment
  names `R5b`, `productionModulesIn` and `runtimeImporters`, and says that a pin is not
  tamper-proof. Any spelling is acceptable, for example "a weakening has to show in the diff".
- **`A5` (test-only, one path, the guard untouched).**
  - `git diff --name-only <base>..<delivered>` lists exactly `src/history-pane.nfr.test.ts`, so
    there are 0 production lines.
  - The guard's three statements are byte-identical to the base: the `const production` line, the
    `runtimeImporters` statement and the `toEqual` line. Each framed form occurs exactly once in
    the file's raw text, as it did at `71418879` (`RUN.txt`).
  - Lint, typecheck, build and `npm test` exit 0.
  - The skip count is 0, and integrity prints `No findings.`

## Dependencies

- **None open.** `ABC-057` is `Done` (merged `f7f957ae`), and `ADR-0011` P4 rules the ticket. **Pullable
  now.**
- **`ABC-134` touches the same file. SEQUENCE, do not fold: this ticket first, then `ABC-134`. Never
  run them in parallel** (the Architect's fence).
  - **Why not fold.** `ABC-134` is comment-only by contract: its `A5` is a no-executable-line filter.
    This ticket adds executable pins and is proven by a mutant ledger, so the two QE hops check
    different things. Folding would break `ABC-134`'s cleanest criterion to save one QE hop.
  - **Why this one first.** `R5`'s own trigger reads *"the next hop that opens
    `src/history-pane.nfr.test.ts` for any reason folds it in"*. Landing `R5b` before any other hop
    on this file honours that trigger without a fold. The kill it restores is also worth more than
    the narration `ABC-134` corrects.
  - **If `ABC-134` is already pulled when this reaches `Ready`,** it finishes first and this one
    follows. The order serves the file; it is not a blocker.
- **`ABC-030` (Backlog)** edits `:115` of this file. Merge order only; the second one rebases.
- **No unmerged branch touches this file** (checked at `71418879` over every `grugops/*` branch).
  `ABC-133` (`src/cli.test.ts`, `In Review` at `679e847d`) and `ABC-135`
  (`src/render-seam.test.ts`, merged `b826075a`) are disjoint, so this can run in parallel with
  `ABC-133`.

## Security / NFR triggers

- **`N8-LANE` — ≤ 650 ms CPU net.** No new file, no new `it` and no spawn. Two `toContain` checks on a
  string the `it` already reads take microseconds, below `ADR-0035`'s **proposed** 0.058 s floor for
  this file.
- **`NFR-002` — not triggered.** The licence guard is `ADR-0002` clause 4's, not `NFR-002`'s
  (`ADR-0011` clause 3). No frame-path instrument changes.
- **Security — not triggered.** Under `ADR-0036` (DELTA), clause (b) does not fire: 0 production files.
  (a) No manifest. (c) The test file adds no spawn, network or write. (d) The blast radius is one test
  file.
- **UAT: WAIVED by the standing 2026-08-17 rule** (`.test.ts` only, so 0 production lines). The QE hop
  applies.

## Test notes

1. **Frame each pin with a leading `\n` and the indent, written with `\n` escapes** (`ABC-057` `D1`).
   A literal with real newlines matches its own source line. It also makes a planter anchor occur
   twice, so `A3` prints `PLANT-FAILED`.
2. **The over-pin is accepted**, as `ABC-057` test note 2 accepts it. The `runtimeImporters`
   statement contains the regex literal, so a regex change reds two pins. That is fine, because
   both messages tell the reader to re-run the witnesses.
3. **Three readers take this file RAW** (`ABC-134` test note 1):
   - `src/render-seam.test.ts` `A9` and `src/cli.test.ts` `A12` read the first
     `const LICENSED_DRIVERS…` and `^const COMPOSITION_ROOT = …$`. Do not spell either declaration
     in a new literal or comment.
   - The licence pin (`:478-488`) reads this file's own text with `toContain`.
4. **Measure on the delivered tree, not on the branch checkout.** `probe/r5b-ledger.sh <repo> <sha>
   <scratch> <builds…>` makes a fresh archive per build. The base readings are in `RUN.txt`.

## Size and priority rationale

**Size `XS` (1).** Two framed literals and one comment, in one existing `it` of one test file. The
ledger already exists (QE's planter). **Not `XL`. No split.**

**Priority `P3`.** Graded LOW by QE and by Architect/Design. No hop edits the guard today, and the
risk is pre-existing (`ABC-029`). **Promote:** if a ticket is cut or pulled that edits the licence
guard's statements (`:361-374`), this ticket becomes that ticket's predecessor and takes its
priority (the Architect's trigger).

## Definition of Ready

Assessed by BA/PM at the cutting hop, **2026-10-10**, wave tip `71418879`. **Result: 10 of 10, 0 ⚠️
— MET → `Ready`.** The board move is the Orchestrator's.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two survivors re-run at the tip on QE's planter, each with its site |
| 2 | scope and out-of-scope clear | **✅** two pins and one comment in one `it`. Fenced: the guard's statements, tamper-proofing, `ABC-134`, other files |
| 3 | INVEST-shaped | **✅** independent (no open predecessor), small, testable by an existing ledger |
| 4 | acceptance testable and measurable | **✅** four mutant builds that must exit 1 (each exits 0 today), five that keep their verdicts by test name, one phrase from 1 to 0, and one-path and byte-identity checks |
| 5 | dependencies known | **✅** none open; `ABC-134` sequenced after, `ABC-030` merge order, `ABC-133`/`ABC-135` disjoint |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms (microseconds); `NFR-002` and security not triggered (`ADR-0036`); UAT waived by rule |
| 7 | test notes present | **✅** four (framing, accepted over-pin, raw readers, measure on archive) |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P3`, with the Architect's promotion trigger |
| 10 | no major unresolved blocker | **✅** none |

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-136`).
- Branch `grugops/ABC-136-licence-operands`, from `c715b3c2`. The code is `b50b0e2b`
  (`src/history-pane.nfr.test.ts` +16/−2: the tripwire comment and two pins).
- Not merged, not pushed.
- Decisions, readings and raw files are in `.grugops/context/ticket-to-pr-ABC-136/` (`…5b359211`,
  `…881e15e2`, `probe/`) and are not restated here.

**`A1`–`A5` are met. No stop condition fired.**
- The premise held at `c715b3c2` (the file is byte-identical to `71418879`): both operand mutants
  were green 12/12, with and without `WPERFT-STATIC`.
- On the delivered tree, all four `A1`/`A2` builds exit 1 on the drift tripwire. The rest of the ledger
  is unchanged by test name, and `ABC-057`'s spans hash identically.
- Cost: both `ADR-0035` sets were inadmissible under parallel load (twin over 1.5 %). The readings are
  reported in the observation note, with no claim made against the floor.

## QE 2026-10-10 (QE/E2E, `qe-ABC-136`, Workflow 04 review exit): PASS_WITH_GAPS

Reviewed `c715b3c2..520fa185` (code `b50b0e2b`). Every reading is QE's own, taken in a fresh `git archive` tree per
build. The planter is QE-057's, unchanged; QE's own narrowings are in `plantqe136.py`.

**`A1`–`A5` are MET. No test was added.**

- **`A1`**: `QSCAN-NARROW+FMT` exits 0 with 12/12 at base and exits 1 at head on the tripwire ("scans EVERY
  production module"). The same holds with `+WPERFT-STATIC`.
- **`A2`**: `QLHS-INTERSECT+FMT` behaves the same way, with and without `+WPERFT-STATIC`.
  - Under `+FMT` the scan pin fires first, because Biome rewraps the statement.
  - With the scan pin deleted, the importer pin alone still reds both builds. Each pin carries its own kill.
- **`A3`**: `CONTROL` runs 12 tests, the same as base. `M15` and `M15SUB` red on the tripwire. `WLAUNDER`,
  `WSTALELICENCE` and `WPERFT-STATIC` fail 3, 1 and 1 tests, the same tests by name. No build of 54 printed
  `PLANT-FAILED`, and every anchor counts 1.
- **`A4`**: the phrase count goes from 1 to 0. The tripwire's `//` comment names `R5b`, `productionModulesIn` and
  `runtimeImporters`, and says the pin is "not tamper-proof".
- **`A5`**:
  - The diff touches one path, +16/−2. Six added lines are executable.
  - The guard's three framed statements each count 1 at base and at head.
  - `ABC-057`'s seven spans hash identically, and match QE-057's recorded hashes.
- **`biome-ignore`: endorsed.**
  - Removing it gives exactly 1 warning, on the pinned literal.
  - It does not leak: a second `${` string in the same `it` is still flagged.
- **Gates** at `520fa185`:
  - lint, typecheck and build exit 0 (lint printed no diagnostics);
  - `npm test`: 52 files / 1608 passed;
  - skip count 0; integrity `No findings.`;
  - `lane-inventory.js`: 52 = 52, `No findings.`
- **Gaps:**
  - **`QE-136-a` LOW → Architect/Design.** An in-place `runtimeImporters.splice(…)` placed after the pinned
    statement is gate-clean and green across the whole suite with `WPERFT-STATIC`. That is inside `R5b`'s ruled
    property ("any gate-clean edit between … and the comparator"), so the two pins do not deliver all of it.
  - **`QE-136-b` LOW → Architect/Design.** Narrowing clause 1's helper `productionModulesIn` (`:163-164`) is
    gate-clean and drops the kill. No test pins the helper's text. The new comment and the message read wider than
    the call-site pin does.
  - **`QE-136-c`–`-e` INFO:**
    - shadowed `productionModulesIn` and `readFileSync`, a verbatim dead copy, and the licence pushed in place:
      the accepted residual class;
    - the masked importer pin under `+FMT`;
    - a stale header comment in the Software Engineer's `timing.sh`.
- **Cost: UNKNOWN - verify.** Both `ADR-0035` sets were inadmissible:

  | set | twin | load1 median |
  |---|---|---|
  | 1 | +1.73 % | 14.50 |
  | 2 | +1.92 % | 13.26 |

  No claim is made against the 0.058 s floor. The two added scans take 0.37 µs (observation only). One admissible
  reading is owed when load allows.
- **Readings and notes:** `.grugops/context/qe-ABC-136/`: `…b5b3f575` (decision), `…2f217343` (readings),
  `…f3fd60a0` (gaps), and `probe/`.
- **UAT** is WAIVED by the standing rule (0 production lines, measured).
- **Not merged, not pushed.**
