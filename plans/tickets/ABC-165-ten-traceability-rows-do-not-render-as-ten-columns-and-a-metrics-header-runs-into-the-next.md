---
id: ABC-165
title: "Ten `plans/traceability.md` rows do not split into the table's ten columns, the paragraph that lists the known malformations names a different set, and a `plans/metrics.md` header runs into the next"
status: backlog
column: Backlog
size: S
priority: P3
epic: —
feature: —
---

# ABC-165 — repair how two `plans/` files render. Words kept byte for byte; ZERO `src/` lines

> **Cut 2026-10-17 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-followups`), bundling two gaps about how
> `plans/` files render. Both go to the Orchestrator, who owns the trace and routes the build:
> - **`QE-040-c`** (INFO; `.grugops/context/qe-ABC-040/notes/…5ded03e3`): the malformation paragraph in
>   `plans/traceability.md` is stale. QE counted 5 bad rows;
> - **`QE-156-a`** (LOW; `.grugops/context/qe-ABC-156/notes/…1e769dea`): two `plans/metrics.md` header lines render as
>   one paragraph.
>
> The two files differ, but one hop with one owner costs less than two. The re-measure at `main` `1671f24f` found the
> trace defect is **larger than QE's count and still growing**: three of the ten rows were appended on 2026-10-17
> (`…bapm-cut-followups/notes/…readings-85e8dfdd`).

## Problem

*User:* anyone who reads the trace or the metrics in a Markdown renderer, and any role about to append a trace row.

*Pain (trace).* The table at `plans/traceability.md:425` has ten columns. In GitHub-flavoured Markdown, an unescaped `|`
separates cells and `\|` does not. At `1671f24f`, **10 rows** do not split into 10 cells:

| line | row | cells | shape |
|---|---|---:|---|
| 626 | `ABC-065` | 11 | an unescaped `\|` inside the text |
| 627 | `ABC-066` | 13 | unescaped `\|` inside a code span (`[--colour white\|black…]`) |
| 735 | `ABC-109 (UAT)` | 11 | an unescaped `\|` inside a command |
| 951 | `Scribe book-regen (AGENTS.md)` | 9 | one cell short |
| 982 | `ABC-094 (accepted)` | 6 | four cells short |
| 1001 | `Scribe lines (AGENTS.md)` | 9 | one cell short |
| 1006 | `ABC-150 (design)` | 2 | almost all text in one cell |
| 1099 | `ABC-030 (QE)` | 11 | one cell too many (appended 2026-10-17) |
| 1101 | `ABC-024 (QE)` | 11 | the same (appended 2026-10-17) |
| 1103 | `ABC-156 (QE)` | 11 | the same (appended 2026-10-17) |

The paragraph at `:377-378` says the known malformations are `ABC-009` (12 cells) and `ABC-011`, `ABC-015`, `ABC-019`
(11 each). Under the GFM rule all four of those split into 10. The paragraph's own `strip('|').split('|')` rule counts
escaped pipes as separators, so it flags rows that render correctly (those four, and others such as `ABC-062`).

*Pain (metrics).* `plans/metrics.md:2` (the 2026-10-17 `_Updated:` line) is followed directly by `:3` (the 2026-08-20
line), with no blank line and no trailing `\`. CommonMark renders the two as one paragraph.

*Value:* the trace renders as a table a reader can scan by column, and the note that guards it counts by the rule
the renderer uses.

## Scope

1. **Repair the ten rows** so that each splits into exactly 10 cells under the GFM rule. Escape a `|` with `\`, add
   `—` for a missing cell, or move a cell boundary. The Engineer maps each cell to its column.
2. **Rewrite the malformation paragraph** (`:377-378`): it states the GFM rule (unescaped `|` separates; `\|` does
   not) with a runnable count, and the known set as of the repair date (expected: none). The rest of the note at
   `:370-376` and the 2026-10-17 reconciliation sentence stay.
3. **`plans/metrics.md`:** a trailing `\` on `:2`, or a blank line between `:2` and `:3`.

## Out of scope

- **Any word of any trace cell.** No row is added, removed, merged or re-ordered.
- Every other `plans/` file, `src/`, the board.
- Changing how future rows are written. The Orchestrator may adopt the count from Scope 2 as a pre-append check.

## Acceptance (Given/When/Then)

- **`A1` (every row splits into ten).** **Given** head, **when** this runs:

  ```
  python3 -c "import re;L=open('plans/traceability.md').read().split('\n');print([i for i,l in enumerate(L,1) if l.startswith('|') and not re.match(r'^\|\s*-',l) and len(re.split(r'(?<!\\\\)\|',l.strip().strip('|')))!=10])"
  ```

  **then** it prints `[]`. At `1671f24f` it prints the ten lines above.
- **`A2` (no word moved).** For every repaired row, the base row and the head row are equal once every `|`, `\`, `—`
  and whitespace character is removed from both. The delivery note lists the 10 comparisons, 10 of 10 equal.
- **`A3` (no row added or removed).** The number of lines starting with `|` is equal at base and head, apart from any
  row the delivering hop is told to append for itself.
- **`A4` (the paragraph).** The rewritten paragraph contains the `A1` count or an equivalent one, and names no row as
  malformed that `A1` passes.
- **`A5` (metrics).** `sed -n 2p plans/metrics.md` ends with `\`, or `sed -n 3p plans/metrics.md` is empty. No other
  line of `plans/metrics.md` changes.
- **`A6` (fences).** `git diff --name-only <base>` lists exactly `plans/traceability.md` and `plans/metrics.md`.

## Dependencies

- **None blocking.** Rows are appended to the trace by most hops. **Branch from the latest `main` and run `A1` at the
  tip**, so that any row appended in between is repaired too.
- `ABC-040` and `ABC-156` — `Done`.

## Security / NFR triggers

- **Not triggered.** Records only. 0 test files, 0 tests.

## Test notes

1. **Read `A1` and `A2` with scripts, not by eye.** The rows run to thousands of characters.
2. **Gates:** lint, typecheck, build, `npm test`. A QE hop is owed. The UAT waiver is expected (0 production lines).

## Size and priority

**`S`:** ten rows with four different shapes, each needing its cells mapped to columns, plus a paragraph and one
character. **Not `XS`:** the mapping is judgement on rows up to 1,644 bytes long. **Not `M`:** two files, no code.

**`P3`:** a rendering defect; every word is still in the file and greppable. **Not `P2`:** no gate or test reads the
trace's columns.

## Definition of Ready

BA/PM, 2026-10-17. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 10 rows at `1671f24f`, listed by line; the paragraph names 4 rows that split correctly |
| 2 | scope and out-of-scope clear | **✅** render repair only; no word changes |
| 3 | INVEST-shaped | **✅** independent |
| 4 | acceptance testable and measurable | **✅** `[]`, 10 of 10 equal, equal row count, one line ending |
| 5 | dependencies known | **✅** none; run at the tip |
| 6 | security/NFR triggers with a measurable target | **✅** not triggered |
| 7 | test notes present | **✅** two |
| 8 | size assigned | **✅** `S` |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's. Owner: **the Orchestrator** (routes the build; the Software Engineer built
`ABC-040` and `ABC-156`), then QE.
