---
subtask: bapm-epic008-g6-rule
role: ba-pm
ref: .grugops/context/bapm-epic008-g6-rule/
epic: plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
branch: new grugops/bapm-epic008-g6-rule from main, worktree ../wt-bapm-epic008-g6-rule
width: 2 of 2 agents (records only)
---

# EPIC-008: G6 reading rule (QE-215-a) + ABC-215 Done line

## Do
- Per Orchestrator `orch-2026-10-25w/…ccf209d9` and QE `qe-ABC-215/…c2c3540f` (finding QE-215-a): write the G6 reading rule that qe-ABC-205 and qe-ABC-215 pre-registered into EPIC-008's G6 row, dated. The rule is n = 5 per board per build, interleaved; grade by median; any run below 6 fails. Bounds do not move: depth ≥ 6 and "≥ base" stay as written, and QE-205-c stays the owner's open question.
- Add a dated line for ABC-215 to EPIC-008: Done, merged `5c91e2e4`, D NEUTRAL +15.6 ± 23.8, S3 met (row 9 and M2).
- Add a dated status line to the ABC-215 ticket page (Done, merged `5c91e2e4`).

## Fences
- Only your worktree and `<scratchpad>/bapm008/`. No `src/`. No npm/vitest. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task bapm-epic008-g6-rule). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-25T12:21Z): **EPIC-008's `G6` row carries its reading rule, dated (`QE-215-a`). No bound moved. `ABC-215` Done lines dated on EPIC-008 (row 9, `M2`) and on its page. No stop.**

Records only. Branch `grugops/bapm-epic008-g6-rule` in `../wt-bapm-epic008-g6-rule`, cut from `main` `0e2358ce`. One
commit, **`0e5eb19a`**, not merged and not pushed. No npm, vitest or timing ran. No `src/` edit. Scratch:
`<scratchpad>/bapm008/` (the seal script only).

Notes are in `.grugops/context/bapm-epic008-g6-rule/notes/`. They were sealed with grugops 2.1.0 `context-io.js`
`admitAndAppend` (context root: the worktree's `.grugops/context`), and `readContext` read back 2 of 2:
- `20261025T122057Z-ba-pm-observation-4e2acdc8`: the re-reads at `0e2358ce`;
- `20261025T122057Z-ba-pm-decision-8e51ba1e`: the rule and the Done lines.

| item | ruling |
|---|---|
| `G6` reading rule | Appended to the `G6` row's bar cell (EPIC-008 line 136), dated: **5 runs per board per build, interleaved; "≥ base" graded by the median; any run below depth 6 FAILs.** The detail is the one both QE readings ran (5 rounds, kiwipete pair then position-6 pair, odd rounds base first; fresh process per search, `chooseMove` at 3 000 ms real clock, `choice.depth`; median per board, both boards; depth 7 WARN reported; graded over all runs; pre-registered before the first run). Source: `ABC-205`'s "How `G6` is read" |
| n = 5 | `ABC-205`'s page said "at least 5"; both readings ran exactly 5. Fixing n means it is never chosen after a look at the runs. A reading-rule narrowing, not a bound move |
| bounds | Unchanged. The bar text "depth **≥ 6** (FAIL floor), depth 7 (WARN), and **≥ the base build's** completed depth, same machine, same session" is byte-equal to `main`. The other ten gate rows and the nine ticket rows are byte-equal |
| `QE-205-c` | **Still the owner's open question.** The row states the default: "≥ base" is graded until he answers. `QE-215-b` stays with that question (not ruled here) |
| EPIC-008 `M2` | Dated line in the § Success measures box: `ABC-215` shipped measured; merged `5c91e2e4`; D NEUTRAL, X = +15.6 ± 23.8 (400 of 400, 0 faults); not LOSS and X ≥ 0, so S3 met without the extension |
| EPIC-008 row 9 | Dated line under the tickets table: `ABC-215` Done, merged `5c91e2e4`, D NEUTRAL +15.6 ± 23.8, S3 met; the row's cells are as cut |
| `ABC-215` page | Dated banner under the title: Done 2026-10-25, merged `5c91e2e4`; QE PASS at `7d4cea3e` (`…c2c3540f`) signs UAT; D NEUTRAL +15.6 ± 23.8, S3 met; Orchestrator `…ccf209d9` |

Files on the branch:
- `plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md` (+8/−1);
- `plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md` (+4);
- 2 notes.

Not touched: `src/`, `plans/nfr-catalog.md` (NFR-005), the tickets-table cells, the frontmatter of EPIC-008 and of the
`ABC-215` page (the page still reads `status: ready`, `column: Ready`, as other merged pages do), `plans/board.md`,
`plans/traceability.md`, `memory-bank/`, other worktrees, the remote and git config. In main's checkout, only this
queue record and its claim moved, uncommitted, for the Orchestrator.

Owed (Orchestrator): merge this records branch; the board card line and the trace row below.

### Board card line (for the Orchestrator; no column move)

- **ABC-215 (Done)**, appended to its card: `2026-10-25: EPIC-008 G6 reading rule written (bapm-epic008-g6-rule, …8e51ba1e; QE-215-a closed): 5 interleaved runs per board per build, median, any run < 6 FAILs; no bound moved; QE-205-c open. Done lines on EPIC-008 (row 9, M2) and the page.`

### Trace row (10 cells, header order)

| ABC-215 (bapm-epic008-g6-rule) | Done lines dated (EPIC-008 row 9 and M2; page banner): merged 5c91e2e4, D NEUTRAL +15.6 ± 23.8, S3 met; QE-215-a closed: EPIC-008 G6 row carries its reading rule (5 interleaved runs per board per build, median, any run < 6 FAILs) | EPIC-008 | own evaluation values by rule; CC BY-SA carve-out removed | NFR-005 G6: no bound moved (≥ 6 floor, 7 WARN, ≥ base byte-equal); QE-205-c open (default graded); notes …4e2acdc8, …8e51ba1e | grugops/bapm-epic008-g6-rule @ 0e5eb19a (records only)<br>plans/epics/EPIC-008-…md (G6 row, M2 line, row-9 line); plans/tickets/ABC-215-…md (Done banner) | — (records only) | signed by QE PASS …c2c3540f (unchanged) | — | Done (no column move) |
