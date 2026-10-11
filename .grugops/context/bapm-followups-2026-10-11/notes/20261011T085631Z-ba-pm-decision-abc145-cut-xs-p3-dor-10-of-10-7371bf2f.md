---
id: 20261011T085631Z-ba-pm-decision-abc145-cut-xs-p3-dor-10-of-10-7371bf2f
kind: decision
by: ba-pm
at: 2026-10-11T08:56:31Z
verified_by:
confidence: high
refs:
  - ABC-145
  - QE-093-b
  - ABC-093
  - EPIC-005
  - ADR-0037
  - ADR-0023
  - ADR-0035
  - NFR-008
  - NFR-006
  - plans/tickets/ABC-145-the-book-compiler-stamps-its-source-commit-and-never-checks-the-source-bytes.md
  - tools/opening-book/compile.ts
  - tools/opening-book/book.test.ts
  - data/opening-book/ATTRIBUTION.md
  - 20261011T083621Z-architect-design-decision-qe093b-compiler-checks-source-sha256-ticket-xs-p3-e95791ae
  - 20261010T185733Z-qe-e2e-observation-abc093-mutants-gap-register-cce9af72
supersedes:
---

# Item 1: `ABC-145` cut from `QE-093-b`. `XS`, `P3`, DoR 10/10, `Backlog`, recommended → `Ready`

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). Nothing was run or timed.

- **The page:** `plans/tickets/ABC-145-…md`. It follows the Architect's specification (`…e95791ae`) item for item: a `SOURCE_SHA256` constant, the check on the command-line path before `writeBook`, an in-process function, two tests, and the `ATTRIBUTION.md` § Regenerating line.
- **The facts were re-read at `aebde4c9`, not taken on faith.**
  - `SOURCE_COMMIT` is at `compile.ts:26`, `writeBook` at `:134`, and the command-line block at `:139–147`.
  - The five sha256 values are in the `ATTRIBUTION.md` table, and the `QE-093-b` trap line is at `90-agents-md-command-log.md:79`.
  - The `ADR-0037` D1(f) amendment is at `:148–166`.
  - `book.test.ts` holds 9 `it` blocks.
- **Three sharpenings by BA/PM.** Each one makes a criterion measurable; none adds scope.
  - **`A2` (control).** An unaltered fixture passes. Without it, a check that refuses everything would meet `A1`.
  - **`A3`, per-row.** Each constant value must sit on the table row that names its own file, 5 of 5. A bare-presence check would pass two swapped values.
  - **`A4`, negative run.** One byte is appended to a copy of a real file: the command exits non-zero and `book.json` still `cmp`s 0. The positive run alone would not show the refusal on real bytes.
- **`A5` uses a joined-text search, not a line `grep`.** This is `G-QE-070-2`'s lesson applied at the first cut after it (see `…f28792c7`).
- **Size and priority.** `XS`: no harness, no new file, no child process, no production code. `P3`: `book.json` is correct today (`ABC-093` `A1` reproduced it), and the risk bites only at a future regeneration. **Promotion trigger:** a hop that will change `SOURCE_COMMIT` or regenerate the book is scheduled. `ABC-145` then merges first, at `P2`.
- **Epic `EPIC-005`, the same as `ABC-093`.** Owner: Software Engineer, then QE. UAT is waived by measurement, expected because there are 0 production lines. That is read at the exit, not asserted here.
- **Board:** front matter `backlog`/`Backlog`, as on `ABC-143`. The column move is the Orchestrator's. **Recommended: `Backlog → Ready`.** The DoR is met. The `Ready` WIP limit is 8, and the board count is not re-read here.
