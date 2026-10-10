---
id: ABC-135
title: "`A8`'s consumer instrument reads a comment as a specifier, and two properties it has are pinned by no test — test-only, one file"
status: in-development
column: In Development
size: XS
priority: P3
epic: —
feature: —
---

# ABC-135 — `bindsAValueFrom` stops counting comments, and its multi-line and every-statement reading get a row each

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-owed-batch-2026-10-10`) at
> wave tip `35ad336b`. The source is QE's `ABC-054` gap register (`.grugops/context/qe-ABC-054/notes/…ee331683`):
> `QE-054-a` (LOW, "needs a ticket, not this hop") and `QE-054-c` (LOW, "SE fix-forward, optional,
> XS, test-only"). They are one ticket because they are one function and one test in one file.
> Reasoning: `.grugops/context/bapm-owed-batch-2026-10-10/notes/`.

## Problem

*User*: the hop that next reads `ABC-041` `A8`, or applies its rule to a new target. `A8` asks
whether a production module is a **runtime consumer** of a renderer (`ADR-0030` decision 2: an
`import` that binds at least one value).

*Pain* — re-measured at `35ad336b` on the instrument's own expression (`src/render-seam.test.ts:107-123`,
unchanged since `9989f28c`):
- **`QE-054-a`, an over-count (a false GREEN).** Four comment spellings each count a consumer that
  binds no value:
  - `import { /* c */ type X } from "./m.ts";`
  - an all-`type` brace with a trailing `// c`
  - an all-`type` brace with a commented-out `// f,` line
  - `import { f } from "./m.ts";` at column 0 inside a `/* … */` block

  QE showed each one is gate-clean and leaves `A8` GREEN on `X3b`. Only `A11` reds them, and `A11`
  reaches the seam's three modules only. **This is a misreading of the accepted ADR, not a residual:**
  decision 2 defines a consumer by the statement's value bindings, and a comment is neither a
  specifier nor a statement. It is not `ADR-0030`'s `C1` (a value bound and never called) or `C2`
  (re-export chains).
- **`QE-054-c`, two properties held and pinned by nothing.** The instrument reads a statement
  **across lines** (12 of 35 production modules spell one that way, re-measured) and reads
  **every** statement in a file. Both hold today. QE's `M-SINGLE-LINE` and `M-FIRST-STATEMENT-ONLY`
  each survive 24/24. A refactor that loses either one would false-RED `A8` on the next legitimate
  multi-line or split import.

*Value*: `A8`'s instrument means what `ADR-0030` decision 2 says, in both directions, before the
first time its rule is applied beyond the three targets `A11` backs up.

## Scope

- Make `bindsAValueFrom` (or its caller) **not read comments as specifiers or statements**. The method
  is the Engineer's. The file already strips comments for `A3`/`A6` (`deliveredCode`, `:136-139`).
  Applied before the instrument, out of tree at `35ad336b`, that strip turned all four spellings to
  "not a consumer" and left the real-tree map unchanged (see `A3`). This is a feasibility reading,
  not a design.
- **Add rows** to the instrument's spelling test (or a sibling `it`): the four `QE-054-a` spellings
  as `false`, plus `QE-054-c`'s two as `true`:
  - a multi-line mixed brace `import {\n  type X,\n  f,\n} from "./m.ts";`
  - a source with `import type { X } from "./m.ts";` followed by `import { f } from "./m.ts";`
- The instrument's docblock says comments are not read.

## Out of scope

- **Every production file, and `src/history-pane.nfr.test.ts`** (the licence guard and the composer
  tripwire are other instruments; `ABC-134` covers the latter's prose).
- **`ADR-0030`'s residuals `C1`/`C2`** and `QE-054-d`/`-e`/`-f`/`-g` (INFO). `QE-054-e`'s under-counts
  (`{ type as t }`, string-named specifiers) fail RED and are not taken here.
- **A compiler-API parser.** `ADR-0030` alternative 4 rejected it.

## Acceptance (Given/When/Then)

- **`A1` (`QE-054-a`: a comment is not a consumer).** **Given** each of the four `QE-054-a` spellings
  above, **then** the instrument returns `false`, asserted by a row each. **And** the eight
  `ADR-0030` rows keep their verdicts (4 `true`, 4 `false`), and their spelling strings are unchanged.
- **`A2` (`QE-054-c`: the two properties are pinned).** **Given** the two `QE-054-c` sources, **then**
  the instrument returns `true` for each. **And** the PR note shows `M-SINGLE-LINE` (the clause
  pattern cannot cross a newline) RED on the first and `M-FIRST-STATEMENT-ONLY` (only the first
  `import` from the target is read) RED on the second, each planted on the delivered instrument,
  with the pristine run green.
- **`A3` (no over-strip on the real tree).** **Given** every ordered pair of production modules,
  **then** the delivered instrument's consumer verdicts equal the base instrument's on the same
  tree. At `35ad336b` that is 1,190 pairs, of which 92 are consumers; re-read it on the base. **And**
  `A8`'s headline still reads `render-seam.ts` among the consumers of `render.ts`,
  `status-panel.ts` and `history-pane.ts`.
- **`A4` (test-only, one path).** `git diff --name-only <base>..<delivered>` lists exactly
  `src/render-seam.test.ts`. Lint, typecheck, build and `npm test` exit 0, the skip count is 0, and
  integrity prints `No findings.` The PR note gives the test count against the base's.

## Dependencies

- **None open.** `ABC-054` is `Done` (`cb044bb2`); `ADR-0030` is accepted. **Pullable now.**
- **No unmerged branch touches `src/render-seam.test.ts`** (checked at `35ad336b`).
- **`ABC-134`** edits `src/history-pane.nfr.test.ts` only, so the two are disjoint and can run in
  parallel.
- **Architect/Design may prefer to name `QE-054-a` as a residual `C3` instead** (QE offered both).
  This page reads the fix as conformance to decision 2, which needs no new ruling. If the Architect
  rules `C3`, strike `A1` before the pull. `A2`–`A4` stand alone.

## Security / NFR triggers

- **`N8-LANE` — ≤ 650 ms CPU net.** No new file. Six string rows through one regex is microseconds.
- **`NFR-002` — not triggered.** No production module and no frame-path instrument changes.
- **Security — not triggered.** Test-only, no spawn, no manifest.
- **UAT: WAIVED by the standing 2026-08-17 rule** (`.test.ts` only, so 0 production lines). The QE
  hop applies.

## Test notes

1. **A naive comment strip can eat code.** A `/*` inside a string or regex literal in a production
   module would open a fake block and hide a real import. That under-count fails RED, and it is what
   `A3`'s whole-map equality catches. Do not drop `A3` for the three-target headline.
2. **`A8` is `toContain`, so `A8` alone cannot see an over-count** (QE, "not a gap"). The new
   `false` rows are what kill it. Do not convert `A8` to an equality: a later legitimate consumer
   would red it.
3. **Biome's autofix rewrites three of the four spellings to `import type`** (QE). The rows are
   string literals, so the gate never reformats them, but do not copy them into a module.

## Size and priority rationale

**Size `XS` (1).** One function and six rows in one file, with the fix's feasibility measured out of
tree. **Not `XL`. No split.**

**Priority `P3`.** Both gaps are LOW. `QE-054-a` has no live exposure today: `A11` reds every
spelling at the seam's three targets, and `QE-054-c` fails RED. **Promote to `P2` when `A8`'s rule
is first applied to a target outside those three** (`ADR-0030` `C1`'s own trigger), because from then
on `A11` is not behind it.

## Definition of Ready

Assessed by BA/PM at the cutting hop, **2026-10-10**, wave tip `35ad336b`. **Result: 10 of 10, 0 ⚠️
— MET → `Ready`.** The board move is the Orchestrator's.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** four over-counting spellings and two unpinned properties, each re-measured on the instrument's own expression |
| 2 | scope and out-of-scope clear | **✅** one function and six rows; fences on production files, the probe file, `C1`/`C2`, the INFO gaps and a compiler API |
| 3 | INVEST-shaped | **✅** independent, small and testable; the `C3` alternative is named, and only `A1` depends on it |
| 4 | acceptance testable and measurable | **✅** six row verdicts, eight unchanged, two named mutants RED, a 1,190-pair map equal to the base, one path |
| 5 | dependencies known | **✅** none open; `ABC-134` disjoint; the Architect's alternative named |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≈ 0 (no file); `NFR-002` and security not triggered; UAT waived by rule |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` (1), with feasibility measured |
| 9 | priority assigned | **✅** `P3`, with a named promotion trigger |
| 10 | no major unresolved blocker | **✅** the fix reads the accepted ADR as written. The `C3` alternative would only strike `A1` |
