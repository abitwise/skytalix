---
id: 20260820T214000Z-ba-pm-observation-the-nine-off-shape-trace-rows-are-two-and-the-other-seven-are-a-splitter-artefact-e91c2d64
kind: observation
by: ba-pm
at: 2026-08-20T21:40:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - plans/traceability.md
  - ABC-065
  - ABC-066
supersedes:
---

# The "nine off-shape traceability rows" this file keeps repeating are TWO — the other seven are a splitter artefact

Found while asserting my own appended row's shape. **Nothing was repaired and nothing was touched**; the
rows are unowned and are not this hop's. Filed so the next hop counting them does not repeat a number
without measuring it — which is how the figure survived this long.

## What I measured on `main` @ `414ef75` (117 table rows including mine, 116 pre-existing)

- **Naive `line.split("|")` → 9 pre-existing off-shape rows:** `ABC-009`, `ABC-011`, `ABC-015`,
  `ABC-019`, `ABC-031 (evidence)`, `ABC-062`, `ABC-065`, `ABC-066`, `ABC-106`. This is the count the
  file's headers have carried for days.
- **Escape-aware split — `re.split(r'(?<!\\)\|', line)` → 2:** only **`ABC-065`** (13 pipe-fields) and
  **`ABC-066`** (15) are genuinely malformed.

The other **seven are CORRECT**: they contain a `\|` inside a cell (a literal pipe in prose such as
`| head -2`), which a naive split counts as a column separator and an escape-aware split does not.

**My own `ABC-115` row is in the same family**: it reads **16** under a naive split and **12 pipe-fields
/ 10 cells** under an escape-aware one, which is the shape the header row declares. I asserted it the
escape-aware way and said so in the file's `_Updated:_` line, so nobody "repairs" it into a broken row.

## Why this matters beyond tidiness

A row-shape count is an instrument, and this one has been reporting **4.5x** the real number. Any future
ticket cut to "fix the nine off-shape rows" would have spent most of its budget rewriting seven correct
rows — and rewriting them naively would BREAK them. **Whoever owns those rows should re-measure before
scoping; the honest number is two.**

**Not a finding** (`human_admission` is `off`, no `finding` is admissible on this install), and **not a
ticket** — cutting one is out of this subtask's fences.
