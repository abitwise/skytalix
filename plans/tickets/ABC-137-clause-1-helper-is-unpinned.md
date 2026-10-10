---
id: ABC-137
title: Clause 1's one expression is unpinned — narrowing `productionModulesIn` weakens three guards at once and the whole suite stays green (ADR-0011 R5c)
status: in-development
column: In Development
size: XS
priority: P3
epic: —
feature: —
---

# ABC-137 — pin clause 1's helper definition in the drift tripwire, the way `ABC-136` pinned the guard's operands

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cuts-r5c-f1331-2026-10-10`) at
> wave tip `5d55cc48`. The wave later moved to `3159ab68`, and this file is byte-identical there. The
> source is `ADR-0011` `R5c` (§ Pointers P6). Architect/Design ruled it a ticket and specified it in
> `.grugops/context/design-F-072-1/notes/…1708c558` § `QE-136-b`. The gap is QE's `QE-136-b`
> (`.grugops/context/qe-ABC-136/notes/…f3fd60a0`). **What this page pins is the Architect's; the
> spelling is the Engineer's.** Readings: `.grugops/context/bapm-cuts-r5c-f1331-2026-10-10/probe/RUN.txt`.

## Problem

*User*: the next hop that edits `src/history-pane.nfr.test.ts`. That hop trusts the drift tripwire to
red when a guard stops measuring the set it claims.

*Pain*: `ADR-0011` clause 1's one expression, `productionModulesIn` (`:163`–`:164`), is the scanned
set for three instruments: the licence guard (`:369`), the composer tripwire (`:583`) and the
frame-path probe (`:645`). Its **call** in the licence guard is pinned (`ABC-136`), but its
**definition** is not. A one-line filename exclusion in the helper is gate-clean and green. Re-run
at `5d55cc48` on QE's runner and planters, unchanged:

| build (QE's `plantqe136.py`) | exit | tests |
|---|---|---|
| `CONTROL` | 0 | 12/12 |
| `WPERFT-STATIC` (an unlicensed runtime importer) | **1** | licence guard red |
| `XHELPER-NARROW+FMT` | 0 | 12/12 |
| `XHELPER-NARROW+FMT+WPERFT-STATIC` | **0** | **12/12: the kill is gone** |

The Architect measured the whole suite on the last build at `7f7e6b84`: 52 files / 1608 passed. A
filename exclusion in this exact place is the shape `ABC-029` deleted, so it reads as tidying, not
as tampering.

*Value*: the edit that weakens three guards at once reds at the site and tells its author to re-run
the witnesses. The tripwire's comment states what it pins.

## Scope

In the existing drift-tripwire `it` (*"runs the guard's OWN expression — a drift tripwire, not a copy
that can go stale"*):
1. **One more framed literal:** clause 1's two-line helper definition, exactly as at `:163`–`:164`,
   with its leading newline and written with `\n` escapes (`ABC-057` `D1`), so that it cannot match
   itself. Its message says that clause 1's one expression is unchanged.
2. **The reach comment** (`:483`–`:489`, *"it pins four spans of the guard by TEXT"*) either names the
   helper pin or is narrowed to the truth. The helper is not a span **of the guard**, so the
   sentence as written becomes false.

## Out of scope

- **Any change to the helper or to the three call sites.** The pin reads clause 1 and changes no
  character of it.
- **`QE-136-a` (`XSPLICE`)** and the `QE-136-c` class (`XSHADOW-HELPER`, `XSHADOW-READ`,
  `XDEAD-COPY2`, `XLICENCE-PUSH`). These are accepted residuals with a trigger (`ADR-0011` P6), and
  a text pin does not reach them.
- **The copies of clause 1's expression in `src/cli.test.ts` and `src/render-seam.test.ts`.** Each
  copy holds its own file's guard. Pinning across files would be a new design question, and none
  has been raised.
- **`R3`'s recursive-enumeration fix.** When it comes, it updates this literal in the same diff.
- **Every other file,** including `ABC-030`'s line (`:115`).

## Acceptance (Given/When/Then)

"Planted" means QE's runner `.grugops/context/qe-ABC-136/probe/ledger.sh <repo> <sha> <scratch>
<builds…>`, with `plantqe136.py` and `plantqe057.py` copied unchanged into `<scratch>/bin/`. It uses
one fresh `git archive` per build and runs `vitest run src/history-pane.nfr.test.ts`. "Collapsed text"
is `ABC-134`'s definition (`.grugops/context/bapm-owed-batch-2026-10-10/probe/phrases.mjs`).

- **`A1` (the helper is pinned).** **Given** the delivered tree with `XHELPER-NARROW+FMT` planted, and
  again with `XHELPER-NARROW+FMT+WPERFT-STATIC`, **then** each run exits 1 and the drift tripwire is
  among the failed tests. *(At `5d55cc48`: both exit 0, 12/12.)*
- **`A2` (nothing else in the ledger moved).** **Given** the same runner on the delivered tree:
  - `CONTROL` exits 0 with **12** tests, as at `5d55cc48`;
  - `QSCAN-NARROW+FMT+WPERFT-STATIC`, `QLHS-INTERSECT+FMT+WPERFT-STATIC`, `M15+FMT` and
    `M15SUB+FMT` still fail the drift tripwire;
  - `WLAUNDER`, `WSTALELICENCE` and `WPERFT-STATIC` fail **the same tests by name** as at
    `5d55cc48`. Those are 3 (`A6.3`, `A6.4`, the licence guard), 1 and 1 (the licence guard);
  - no build prints `PLANT-FAILED`. Every planter anchor still occurs exactly once, including
    `plantqe136.py`'s `HELPER`. That proves the new literal does not match itself.
  - `XSHADOW-HELPER+FMT+WPERFT-STATIC` is **recorded**. It is green at `5d55cc48`, and green is
    expected and accepted (`QE-136-c`). Red is not a failure.
- **`A3` (the comment states its reach).** **Then** "it pins four spans of the guard by TEXT" occurs
  **0** times in collapsed text (**1** at `5d55cc48`). **And** the tripwire's `//` comment names `R5c`
  (**0** at `5d55cc48`) and says that clause 1's helper definition is pinned, in any spelling.
- **`A4` (test-only, one path, clause 1 untouched).**
  - `git diff --name-only <base>..<delivered>` lists exactly `src/history-pane.nfr.test.ts`, so
    there are 0 production lines and 0 new files.
  - The helper's two lines are byte-identical to the base. The framed helper text (real newlines)
    occurs exactly **1** time in the raw file, as at `5d55cc48` (`RUN.txt`).
  - Lint, typecheck, build and `npm test` exit 0. The raw readers `src/cli.test.ts` `A12` and
    `src/render-seam.test.ts` `A9` are inside `npm test`. The skip count is 0, and integrity prints
    `No findings.`

## Dependencies

- **None open. Pullable now.** `ABC-134` is `Done` (merged `c28bec7f`), and that was the Architect's
  sequencing condition. `ABC-136` is `Done` (`f87f0b6f`).
- **No unmerged branch touches this file** (checked at `5d55cc48` over every `grugops/*` branch,
  relative to its merge-base).
- **May run in parallel with `ABC-132`** (`In Development`, three production files) and with
  `ABC-138` (`src/cli.test.ts`). The files are disjoint.
- **`ABC-030` (Backlog)** edits `:115` of this file. That is merge order only; the second one rebases.
- **Promote:** if a ticket is cut or pulled that edits clause 1's helper (for example `R3`'s
  recursive enumeration), this ticket goes before it or folds into it, and takes its priority.

## Security / NFR triggers

- **`N8-LANE` — ≤ 650 ms CPU net.** No new file, no new `it` and no spawn. One `toContain` on a string
  the `it` already reads is ≈ 0. QE timed two such scans at 0.37 µs (`qe-ABC-136` `micro.mjs`), which
  is below `ADR-0035`'s **proposed** 0.058 s floor for this file.
- **`NFR-002` — not triggered.** No instrument's code changes. The pin reads text.
- **Security — not triggered.** Under `ADR-0036` (DELTA), clause (b) does not fire: there are 0
  production files. (a) No manifest. (c) No spawn, network or write. (d) One test file.
- **UAT: WAIVED by the standing 2026-08-17 rule** (`.test.ts` only, so 0 production lines). The QE hop
  applies.

## Test notes

1. **Frame the literal with a leading `\n` and write it with `\n` escapes** (`ABC-057` `D1`). A literal
   with real newlines matches its own source. It would also make `plantqe136.py`'s `HELPER` anchor
   occur twice, so `A2` would print `PLANT-FAILED`.
2. **No `biome-ignore` should be needed.** The helper text holds no `${`, unlike `ABC-136`'s importer
   pin. If one appears, QE asks why.
3. **Three readers take this file RAW.**
   - `src/cli.test.ts` `A12` (`:1695`) reads the first `const LICENSED_DRIVERS: readonly string[] = […]`.
   - `src/render-seam.test.ts` `A9` (`:408`) reads `^const COMPOSITION_ROOT = "render-seam\.ts";$`.
   - The tripwire reads this file's own text.

   The literal spells neither declaration, and no new comment may spell either one.
4. **Measure on a `git archive` tree, not on the branch checkout.** The base readings are
   `probe/r5c-ledger-5d55cc48.tsv`.

## Size and priority rationale

**Size `XS` (1).** One framed literal and one comment sentence, in one existing `it` of one test file.
The ledger exists (QE's runner and planters). **Not `XL`. No split.**

**Priority `P3`.** Graded LOW by QE and by Architect/Design. No hop edits clause 1 today, and the risk
predates this hop (`ABC-029`). § Dependencies has the promotion trigger.

## Definition of Ready

Assessed by BA/PM at the cutting hop, **2026-10-10**, wave tip `5d55cc48`. The file is byte-identical
at `3159ab68`. **Result: 10 of 10, 0 ⚠️ — MET → `Ready`.** The board move is the Orchestrator's.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the survivor re-run at the tip on QE's runner, with its three dependent call sites |
| 2 | scope and out-of-scope clear | **✅** one literal and one comment in one `it`. Fenced: clause 1 itself, `QE-136-a`/`-c`, the cross-file copies, `R3`, other files |
| 3 | INVEST-shaped | **✅** independent (no open predecessor), small, testable by an existing ledger |
| 4 | acceptance testable and measurable | **✅** two builds that must exit 1 (both exit 0 today), seven that keep their verdicts by name, one recorded, two phrase counts, and one-path and byte-identity checks |
| 5 | dependencies known | **✅** none open. `ABC-132`/`ABC-138` are disjoint, and `ABC-030` is merge order |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms (≈ 0). `NFR-002` and security are not triggered (`ADR-0036`). UAT is waived by rule |
| 7 | test notes present | **✅** four (framing, no `biome-ignore`, raw readers, measure on an archive) |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P3`, with a promotion trigger |
| 10 | no major unresolved blocker | **✅** none |

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-137`).
- Branch `grugops/ABC-137-helper-pin`, from `2946e22a`. The code is `54280bc8`
  (`src/history-pane.nfr.test.ts` +12/−4: one framed helper pin and the reach comment).
- Not merged, not pushed.
- Decisions, readings and raw files are in `.grugops/context/ticket-to-pr-ABC-137/` (`…3c71e0a4`,
  `…9e4b2d17`, `probe/`) and are not restated here.

**`A1`–`A4` are met. No stop condition fired.**
- The premise held at `2946e22a`, where the file is byte-identical to `5d55cc48`: both `XHELPER-NARROW` builds
  were green 12/12.
- On the delivered tree, both builds exit 1 on the drift tripwire ("clause 1's one expression is unchanged"). The
  rest of the ledger is unchanged by test name. Every span, `ABC-136`'s three pins and the helper hash identically.
- Cost: both `ADR-0035` sets are admissible (twin +0.04 % / −0.15 %), and `N8-LANE` is MET.
- **Deviation:** the planters are an SE port. QE's scripts could not be executed on this host. The planted
  readings use `probe/plant137.mjs`, a line-for-line port with the same anchors. The port reproduces BA/PM's
  `5d55cc48` ledger row for row. QE should re-run `A1`/`A2` with its own unchanged scripts.
