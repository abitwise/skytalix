---
id: 20261021T120443Z-software-engineer-decision-aa2e1e2b
kind: decision
by: software-engineer
at: 2026-10-21T12:04:43Z
verified_by: 
confidence: high (scripted A2 check, 11 of 11)
refs:
  - ABC-165
  - ABC-185
  - plans/traceability.md
  - plans/metrics.md
  - grugops/ABC-165
  - 49fce033
  - 9af98210
  - 20261021T115747Z-ba-pm-decision-d2b9bf09
  - 20261021T120500Z-orchestrator-decision-34da66ba
supersedes: 
seal: sha256:0695a07d4b1afacb5715109593f09151dde41fdf1ff4ba243fc1916ec24f177e
---

# ABC-165 row mapping: escape stray pipes, join or split only with whitespace and `—`, so A2's strip leaves every row equal

**Constraint that decided the method.** `A2` removes only `|`, `\`, `—` and whitespace before comparing. A `<br>` or
`; ` joiner would add characters and fail it, so every repair is one of: escape a `|` as `\|`, insert a `| — ` cell,
delete a `|` (join two cells with one space), or insert a `|` (split a cell at an existing space).

**Per row (base `9af98210` line → what changed).**
- `:626` `ABC-065` (11): the `|` in the code span `(its \`|\` sits` escaped. The stray boundary was inside Status.
- `:627` `ABC-066` (13): the three `|` in the code span `[--colour white|black|random] [--ascii | --unicode]` escaped.
- `:735` `ABC-109 (UAT)` (11): the `|` in `-- 'src/*' | grep -v` escaped; the UAT cell is whole again.
- `:951` `Scribe book-regen (AGENTS.md)` (9) and `:1001` `Scribe lines (AGENTS.md)` (9): the Code cell is split after
  `log.md\`;`, so the gates text (`npm test` 53/1680 green / no test run) lands in Tests. The `;` stays at the end of
  Code (A2 would see it removed otherwise).
- `:982` `ABC-094 (accepted)` (6): `—` for Epic, Feature, NFRs after the title, and `—` for Release before `Done`.
  `src/book.ts` → Code, `src/book.test.ts` → Tests, the UAT pack → UAT.
- `:1006` `ABC-150 (design)` (2): Title `Architect/Design \`D1\`–\`D3\``; Epic, Feature, NFRs `—`; Code = the
  `(subtask … nothing profiled).` parenthesis (branch, base, method commit); Tests = `D1` and `D2` measurements;
  UAT, Release `—`; Status = `D3` onward (the ruling, the NFR ids, the notes).
- `:1099`/`:1101`/`:1103`/`:1121` (QE rows, 11): the `|` between Tests and the `**PASS_WITH_GAPS.**` verdict is
  removed (joined by one space), so the waiver lands in UAT, `—` in Release, the column move in Status.

**Options not taken.** For the QE rows, dropping the empty Release `—` instead would put the waiver under Release.
For `ABC-150`, putting `D1`–`D3` under NFRs would keep the NFR ids in their column but put measurements under NFRs;
the words' order fixes the ids at the end, so they sit in Status. Judgement, open to QE.

**Paragraph.** `:377-378` replaced by 13 lines: the GFM rule, the A1 command verbatim (runnable when copied; prints
86 at the tip), the forward row rule with the Scope 2 template in a code span (indented, so it is not a table row:
A3 unchanged), and a pointer to `ABC-185`. The sentence `ABC-029 was repaired 2026-08-12 and is CORRECT.` from
`:378` is dropped with the paragraph (the same fact stands at `:364-367`). `:370-376` and the 2026-10-17
reconciliation sentence are unchanged.

**Trace row.** Not appended on this branch: the Orchestrator is the single appender (`…34da66ba`). The 10-cell row is
in the done record, checked with A1's splitter.
