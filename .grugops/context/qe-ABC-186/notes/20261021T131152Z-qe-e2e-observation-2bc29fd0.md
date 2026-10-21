---
id: 20261021T131152Z-qe-e2e-observation-2bc29fd0
kind: observation
by: qe-e2e
at: 2026-10-21T13:11:52Z
verified_by: 
confidence: high for the mutant table (run); medium for the reader pass (judgement)
refs:
  - ABC-186
  - plans/traceability.md
  - plans/tickets/ABC-186-the-trace-table-stops-rendering-at-line-496-so-632-of-its-690-rows-render-as-paragraph-text.md
  - grugops/ABC-186
  - grugops/qe-ABC-186
  - a3e6f2a7
  - 50d54d53
  - 9943e5f4
  - 60d72e66
  - fb04f495
  - 20261021T130542Z-software-engineer-observation-d172f686
  - 20261021T130548Z-software-engineer-observation-ce25d55c
  - 20261021T130542Z-software-engineer-decision-7e693dd0
  - QE-186-b
  - QE-186-d
supersedes: 
seal: sha256:cdac107c8d0e8542ced24038062e13b3b6b0b56a83d61dcfcfe63da188075170
---

# ABC-186 break attempts: the forward guard against mutant appends, and a reader's pass over the rewritten note

**Mutant appends on scratch copies of the merge's trace.** `A1-fragments` and `marked` were run on each:

| mutant | `A1-fragments` | `marked` `<tr` vs expected | caught? |
|---|---|---|---|
| correct 10-cell append | `2 0` | 698 / 698 | n/a (control) |
| blank line, then the row | `3 1` | 697 / 698 | yes |
| `<!-- x -->`, then the row | `3 1` | 697 / 698 | yes |
| second header copy edited (`Status`→`State`) | `2 1` | 697 / 697 | yes |
| row indented by two spaces | `2 0` | 698 / 697 | **no** (QE-186-b) |

The guard catches both failure shapes the ticket names. The indented row still renders as a table row in `marked`. The only harm is that `A1-fragments`, `A1-cells` and A2's `grep -c '^|'` cannot see it.

**Reader's pass over the note (head `:349–395`).**
- **One counting rule.** Only the escape-aware split remains (the COUNT paragraph and ROW SHAPE AND COUNT, the same regex). `ELEVEN`, "12 fields", "11 content cells" and the `strip('|').split('|')` prescription are gone. The plain `.split('|')` is now named only as the wrong counter. The 2026-08-13 "every row gives 10" paragraph opens with `HISTORY, superseded by ROW SHAPE AND COUNT below:`, so it no longer contradicts the 86 short rows.
- **Forward row rule.** It has the "append directly below the table's last row" sentence, names a blank line and an HTML comment as table-enders, and has the `A1-fragments` command with `2 0 today`. The appender's check names both commands.
- **No row named as malformed.** ABC-009/011/015/019 are named only as wrongly listed (all well-formed). ABC-029 is named as malformed in the past, already repaired. ABC-028/029 are named in the duplicate-row history. The pre-existing sentence "This note names no row." is literally untrue but is meant as "names no row as malformed" (QE-186-d, out of this ticket's scope).
- Cosmetic, not a gap:
  - The HISTORY line is 148 characters (left unwrapped on purpose, to keep the diff one line).
  - "Do not append…" now ends the renderer line, with no blank line before ROW SHAPE AND COUNT.
  - "the table's last row" means the last row of the file, now that there are two tables.
