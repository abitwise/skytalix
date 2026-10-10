---
id: ABC-135
title: "`A8`'s consumer instrument reads a comment as a specifier, and two properties it has are pinned by no test — test-only, one file"
status: in-review
column: In Review
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

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-135`).
Branch `grugops/ABC-135-a8-comment-specifiers` from `5c17d1ed`, code in `b09d880`. Not merged, not pushed.
Readings and raw files: `.grugops/context/ticket-to-pr-ABC-135/notes/`. Every mutant and cost run was in a
`git archive` copy outside the repository.

**Premise re-verified at `5c17d1ed`:** the instrument is byte-unchanged since `35ad336b`, all six rows read
`true`, and the map is 1,190 / 92. **Criteria: 4 of 4 met.** Red first: with the six rows added and the
instrument unchanged, the new `it` failed on `import { /* c */ type X }` (`expected true to be false`).

| # | verdict | reading |
|---|---|---|
| `A1` | MET | The instrument matches over `withoutComments(source)`, the file's existing `deliveredCode` strip lifted into one helper. A sibling `it` asserts the four `QE-054-a` spellings `false`. The eight `ADR-0030` rows, their strings and their `toHaveLength(4)` are untouched. `M-NO-STRIP` reds the new `it` only |
| `A2` | MET | The two `QE-054-c` rows assert `true`. `M-SINGLE-LINE` (`[^;"\\n]`) and `M-FIRST-STATEMENT-ONLY` (`.slice(0, 1)`) each **survive** the base (12/12) and each **red** the tip on exactly their row (1 failed / 12 passed). Pristine: 12 and 13 passed |
| `A3` | MET | The instrument was lifted verbatim from each tree and run over every ordered pair of the 35 production modules. Base and tip both read 1,190 pairs / 92 consumers, and the maps are byte-identical (sha256 `a8da4a9d…`). `render-seam.ts` consumes `render.ts`, `status-panel.ts` and `history-pane.ts` |
| `A4` | MET | `git diff --name-only 5c17d1ed..b09d880` = `src/render-seam.test.ts` only (+31/−6). Lint, typecheck and build exit 0. `npm test` exit 0 at 51 files / **1585** (base 1584, so +1 `it`). Skips 0. Integrity `No findings.`. `lane-inventory.js` 51/51 `No findings.` |

**`N8-LANE`: MET** on the narrow set (`ADR-0035`). The first reading (n = 8) had an inadmissible twin
(−2.17 %). The second reading (n = 12, load1 8.2–10.8): twin −10 ms (−0.84 %, admissible), R 40 ms; tip
−15 ms, interval [−70, +20] ms. No file was added. **Owed:** the QE hop, the `In Review` move
(Orchestrator) and the merge. UAT is waived by rule (`.test.ts` only), measured at merge.

## QE

**2026-10-10, QE/E2E** (task `wave-2026-09-25`, subtask `qe-ABC-135`, Workflow 04 review exit).
**Result: PASS_WITH_GAPS. `A1`–`A4` are MET and no gap blocks it.** QE re-derived each criterion with
its own harnesses in `git archive` copies. It added one test-only commit, `ce6d8746` (+15 in
`src/render-seam.test.ts`, 0 production lines). Notes: `.grugops/context/qe-ABC-135/notes/` (decision
`…28ea625e`, observations `…2a045cdb` and `…efa99c8b`, artifact-ref `…5b93e7c5`).

| # | QE verdict | independent evidence |
|---|---|---|
| `A1` | MET | The four rows read `true` on the base instrument and `false` on the tip, and a TypeScript-parser oracle also reads `false`. The eight `ADR-0030` rows' `it` is byte-identical at base, `b09d880c` and `ce6d8746` |
| `A2` | MET | `M-SINGLE-LINE` and `M-FIRST-STATEMENT-ONLY` each survive the base and red the tip on exactly their row. Pristine: 12, 13, 14 |
| `A3` | MET | AST-lifted instrument: base and tip both 1,190 / 92, byte-identical maps (sha256 `a8da4a9d…`). The parser oracle agrees on all 1,190 pairs. The headline holds |
| `A4` | MET | `src/` diff = `src/render-seam.test.ts` only. Lint, typecheck, build exit 0. `npm test` 51 / 1586 (base 1584, Engineer 1585), 0 skips. Integrity and inventory `No findings.` |

**Gaps.**
- `QE-135-a` (LOW): **closed** by `ce6d8746`. Three over-strip mutants (`M-LINE-TO-EOF`, `M-LINE-WHOLE-LINE`, `M-SWAP-ORDER`) survived the delivered file and the real-tree map. They are now RED.
- `QE-135-b` (LOW): the docblock does not name the second naive-strip limit, a `/*` inside a line comment. There is 0 exposure on today's tree.
- INFO:
  - `QE-135-c`: the map is a one-off measurement, not a test.
  - `QE-135-d`: an unreachable over-count, a comment inside a specifier.
  - `QE-135-e`: two column-0 under-counts from before this ticket.
  - `QE-135-f`: `A4` on the branch tip versus the code commits.

**The sibling `it` is endorsed**: it keeps the eight rows and their `toHaveLength(4)` byte-identical.
**Owed:** the `In Review` move and the merge (Orchestrator). UAT is waived by rule (0 production
lines on both commits).
