---
subtask: qe-ABC-165
role: qe-e2e
ticket: plans/tickets/ABC-165-ten-traceability-rows-do-not-render-as-ten-columns-and-a-metrics-header-runs-into-the-next.md
ref: .grugops/context/qe-ABC-165/
branch: grugops/ABC-165 (tip 893e9fd1; code 49fce033; base 9af98210); SE worktree ../wt-ABC-165 (read only)
width: 2 (beside qe-ABC-184)
---

# QE gate for ABC-165 (records only: `plans/traceability.md`, `plans/metrics.md`)

## Do
- Verify A1–A7 against the re-cut page, with your own scripts, not by eye and not the SE's:
  - `A1` at base and at the code commit: the 11 named rows leave the output; what remains is exactly the short rows that are `ABC-185`'s.
  - `A2`: every changed row equals its base row once `|`, `\`, `—` and whitespace are stripped; count the changed rows yourself. Then go beyond the strip: check each repaired row maps its cells to the **right columns** (a cell boundary moved to the wrong place still passes the strip). Grade the mapping row by row.
  - `A3`: row count equal at base and head.
  - The rewritten note: states the GFM rule, a runnable count, the forward row rule with the template (BA/PM `…d2b9bf09`), and names no row by its Ticket cell as malformed. Run the count it gives and confirm it agrees with `A1`.
  - The blank line above the header, and `plans/metrics.md:2-3`, with no other `metrics.md` line changed.
  - If you have a GFM renderer available offline, render the table region and the metrics header; if not, say so and grade by the rule.
- **The racing rule:** `main` has gained appended trace rows since `9af98210`. Merge the current `main` into your QE branch (not the SE's), keep `main`'s appended rows as they are, and re-run `A1`–`A3` at that merge. Report any conflict.
- **A7:** the SE notes that at the tip the file list also shows its 3 sealed notes; the code commit lists exactly the 2 files. Rule on it.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. Take no timing. UAT waiver in AGENTS.md's form.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-165` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-165 page there.
- No edits to `plans/traceability.md` or `plans/metrics.md` beyond the merge of `main`; no `src/`, `AGENTS.md`, `plans/board.md` or other ticket pages.
- Never push, `--force`, `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-165`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-165.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (forward row rule `…d2b9bf09`); check it with `A1`'s splitter:
  `| ABC-165 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
  `—` for an empty cell; a literal `|` is `\|`, inside code spans too; join facts with `<br>` or `; `.

## Result (qe-e2e, 2026-10-21 12:16Z): **PASS_WITH_GAPS**. Commit `57317ea8` on `grugops/qe-ABC-165` (from tip `893e9fd1`, code `49fce033`, base `9af98210`; merge of `main` @ `c22894bf` at `b19d4114`; worktree `../wt-qe-ABC-165`)

- Two commits: the racing-rule merge, then 5 sealed notes and a `## QE` section on the ABC-165 page.
- `plans/traceability.md` and `plans/metrics.md` differ from the code commit only by the merge of `main`.
- No `src/`, `AGENTS.md`, `plans/board.md` or other ticket page was touched.
- No push, force, amend or rebase, and no merge into `main`. No timing was taken.

### Acceptance (QE's own scripts, base `9af98210`)
- **`A1`:** 97 at base, 86 at `49fce033` and at `b19d4114`.
  - The multiset removed is exactly the 11 named cells, and none was added.
  - The 86 left are all short rows (7×38, 6×35, 5×9, 9×4) at `:1143–1253`, which is `ABC-185`'s `:1132–1242`
    shifted by 11.
  - A cmark-style splitter agrees with `A1`'s on every row.
- **`A2`:** 11 rows changed (line-multiset count), 11 of 11 equal after the strip, and every head row is 10 cells.
  - **Column mapping, graded row by row: 11 of 11 correct, 0 misplaced boundaries.** Each edit is minimal: 5
    escapes, 4 joins (QE rows: verdict joined to Tests, so the waiver stays in UAT), and `|`/`— |` inserts in 4 rows.
  - The leftovers are fixed by word order: `ABC-150 (design)` NFR and ADR ids in Status, the Scribe branch in
    Status, the `ABC-094` gates in Title, and the Release cell `''` in `ABC-065`/`066` as at base.
- **`A3`:** 685 = 685. At the merge it is 687: `main`'s `ABC-165 (SE)` and `ABC-184 (QE)` (10 cells each), verbatim
  at `:1256–1257`.
- **Racing rule:** merging `main` @ `c22894bf` gave no conflict. `A1`–`A6` were re-run at the merge, and all
  hold.
- **`A4`:** (a) the note's command, copied out and run, prints the same 86 as `A1`; (b) the template is byte-equal to
  `…d2b9bf09` and splits into 10; (c) no row named; (d) `0`.
- **`A5`:** `:435` is empty. **`A6`:** `metrics.md:3` is empty, and no other line changed.
- **`A7`: ruled MET.** The code commit lists exactly the 2 files. The tip's 3 extra paths are the SE's sealed notes,
  which Workflow 16 requires; the criterion scores the delivery commit excluding `.grugops/` (the `ABC-065` `A6`
  precedent).
- **Render:** offline `marked` 15.0.12, GFM on; `cmark-gfm` is not installed.
  - At base, the table is built inside the blockquote (lazy continuation). At head it is top-level, so Scope 3 is
    confirmed.
  - The metrics `_Updated:` lines are now separate paragraphs.

### Gates (on `893e9fd1` and again at `b19d4114`)
- lint, typecheck and build exit 0.
- `npm test` 59 / 1987, with `last-run.json` success (0 failed, 0 pending, 0 todo).
- skip-integrity `--skip-count 0` gives `No findings.`.
- **UAT waiver:** `git diff --name-only 49fce033~1 49fce033 | grep -v '\.test\.ts$' | grep '^src/'` is empty. So is the
  same over `893e9fd1~1..893e9fd1` and `9af98210..893e9fd1`. The waiver applies: a waiver, not a signature.

### Gap register
- **`QE-165-a` MEDIUM → BA/PM** (bears on the owner's `ABC-185` worth-it call).
  - The rendered table ends at the blank line `:496`, before the HTML comment `:497–627`.
  - All 627 `|` lines from `:629` render as paragraph text: all 11 rows here and all 86 of `ABC-185`'s. That is
    the GFM rule, and `marked` measures the same.
  - Every word of the 11 rows renders at base and at head. No text was ever hidden, and "read by column" waits on
    the table being joined again.
  - Not a delivery defect: `A1`–`A7` measure the source.
- **`QE-165-b` LOW → BA/PM.** The note's surviving `:371-372` rule (eleven `|`, plain `.split('|')` = 10) disagrees
  with the new `:377-388` rule.
  - By the `:372` rule, 21 well-formed rows count as malformed, including the 3 this hop escaped.
  - `:364` and `:369` are stale.
  - Out of Scope 2.
- **`QE-165-c` INFO.** `A1`'s splitter counts 9 where GFM counts 10 for a cell that ends in `\\|` and for a row
  that ends `||`. There are 0 such rows today, and it is now the appender's check.
- **`QE-165-d` INFO.** The SE note says the paragraph became 13 lines; it is 12.

Notes (sealed, `.grugops/context/qe-ABC-165/notes/`): `…b3a03d95` (criteria and merge), `…62837fbe` (mapping),
`…482f15f6` (render), `…1c1151ee` (gates, waiver, scripts), `…892cc883` (verdict and gaps).

### Trace row (10 cells, checked with `A1`'s splitter; `A1` output unchanged across a simulated append)
| ABC-165 (QE) | QE gate over the 11 re-celled trace rows, the row note, the header blank line and `metrics.md:2-3` (subtask `qe-ABC-165`): A1–A7 MET on QE's own scripts at the code commit and at the `main` merge; column mapping 11 of 11 | — | — | `QE-165-a` MEDIUM (the rendered table ends at `:496`; rows from `:629` render as paragraph text); `QE-165-b` LOW (stale plain-split rule at `:371-372`); `QE-165-c`, `QE-165-d` INFO | `grugops/qe-ABC-165` @ `57317ea8` (merge of `main` `c22894bf` at `b19d4114`, no conflict)<br>`.grugops/context/qe-ABC-165/` (5 notes), ABC-165 page `## QE` | lint, typecheck, build exit 0; `npm test` 59/1987, `last-run.json` success; skip-integrity `--skip-count 0` `No findings.`; A1 97 → 86, A2 11 of 11, A3 685 = 685 | waiver measured: 0 `src/` production lines on `49fce033`, so it applies | — | **PASS_WITH_GAPS**; QE recommends `In Review` → `Ready for UAT`, then `Done` under the waiver |
