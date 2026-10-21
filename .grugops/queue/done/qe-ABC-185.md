---
subtask: qe-ABC-185
role: qe-e2e
ticket: plans/tickets/ABC-185-eighty-five-hop-rows-in-the-trace-carry-5-to-9-cells-and-render-under-the-wrong-headers.md
ref: .grugops/context/qe-ABC-185/
branch: grugops/ABC-185 (tip 3d166e01; merge of main 80de5949 at 528c9ef0; code 745c6225; base bf6fc623); SE worktree ../wt-ABC-185 (read only)
width: 2 (beside ticket-to-pr-ABC-187)
---

# QE gate for ABC-185 (re-cell 86 short trace rows; records only)

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase). `main` has moved past `80de5949` (trace rows appended). If the tail conflicts, keep `main`'s appended rows verbatim below the repaired rows. Run every criterion at that merge; report the merge sha and any conflict.
- Verify `A1`–`A6` with your own scripts, not the SE's readings:
  - `A1-cells` prints `[]` at your merge.
  - `A2`: pair each repaired row with its base row (by Ticket cell and order); strip `|`, `\`, `—`, `<br>`, whitespace; N of N equal (SE: N = 86, joins `<br>` only).
  - `A3`: `|` line count equal base vs head (apart from rows appended on `main`).
  - `A4` (a)–(c), and **`A4` (d) is yours:** render with `marked` 15.0.12 to a file (`-o`) and read at least one row of each of the 9 layouts plus 5 at random (≥ 14) against the headers. 0 cells under a header their content does not match. Rule on the SE's 3 named exceptions (`:1239`, `:1244`, `:1250`: a second `grugops/qe-… @ sha` cell after the verdict, left in Status) and on the other word-order placements the done record lists.
  - `A5` fences; `A6`: `A1-fragments` prints `2 0` at your merge.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. No timing. UAT waiver in AGENTS.md's form.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-185` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-185 page there.
- No edits to `plans/traceability.md` beyond the merge of `main`; no `src/`, `AGENTS.md`, `plans/board.md` or other ticket pages.
- Never push, `--force`, `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-185`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-185.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-185 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**Verdict: PASS_WITH_GAPS** (4 INFO, 0 blocking). Branch `grugops/qe-ABC-185` (worktree `../wt-qe-ABC-185`), from tip `3d166e01`. **Tip `29fb9859`.** Nothing pushed; nothing merged into `main`.
- **Merges of `main`** (merge commits, not rebases; no conflict either time; `main`'s appended rows kept verbatim at the tail):
  - `a78c353a` at `6273bed2`, the first full run.
  - `main` then moved during the hop (`d42f6a3b`: the 2 ten-cell `ABC-187` rows). I merged it at **`262defb7`** and re-ran every criterion and gate there.
  - At finish `main` is `94795bce`, which adds queue, board and 2 ticket pages only: 0 lines of `plans/traceability.md` or `src/`. So the trace criteria at `262defb7` still match `main`'s trace. I did not merge again.
- Commits: `8bf02a21` (5 notes + `## QE` on the ABC-185 page) and `29fb9859` (re-merge note + 2 lines on the page). No edit to `plans/traceability.md` beyond the merges; no `src/`, `AGENTS.md`, board or other ticket page.
- Notes (sealed with `admitAndAppend`, task `qe-ABC-185`, worktree as the context root, `at` from `date -u`): observations `…d85e5668` (A1–A6), `…3e4f4af5` (A4 (d) reading), `…d0b8f5a8` (gates), `…15ca26fd` (gap register), `…ee6c6b75` (re-merge); decision `…89e79764` (rulings and verdict). No finding and no artifact-ref: there was no §14-gate run.

**Criteria, by QE's own scripts at `262defb7` (same results at `6273bed2`):**
- **A1 MET:** `A1-cells` prints 86 at base `bf6fc623` and at `main`, and `[]` at code `745c6225` and at the merge.
- **A2 MET:** QE found the source rows itself (short at base). Base and code have the same line count (1273), and exactly those 86 lines changed. Paired by Ticket cell and order, 86 of 86 are equal after the strip.
- **A3 MET:** `|` lines are 705 = 705 (base → code) and 710 = 710 (`main` → merge).
- **A4 (a) MET:** 86/86 byte-equal; all 86 head rows split into 10.
- **A4 (b) MET:** every head row aligned back to its source cells (86/86). Branch or merge cells sit in Code except `:1239`, `:1244` and `:1250`, the SE's 3 named exceptions; 0 unexplained.
- **A4 (c):** QE's derived map equals the SE's on 84/86 rows. At `:1192` and `:1198` a trailing bare `—` reads as UAT or Status, and both render the same (QE-185-d).
- **A4 (d) MET:** `marked` 15.0.12 `--gfm -o` gives 2 `<table` and 708 `<tr` (= `|` lines − 2), each row with 10 cells. QE read 14 rows, 140 cells (seed 185):
  - one per layout: `:1152` 6/c3, `:1191` 7/c4, `:1174` 7/c3, `:1156` 5/c2, `:1189` 7/none, `:1180` 9/none, `:1176` 5/c3, `:1198` 6/none, `:1207` 6/c2;
  - 5 at random: `:1142`, `:1190`, `:1194`, `:1226`, `:1250`.
  - 0 cells are avoidably misplaced.
- **Rulings:**
  - The SE's 3 named exceptions are **accepted**: the second `grugops/qe-… @ sha` is the last cell, after the verdict, and A2 forbids moving it ahead.
  - The other word-order placements in the SE's record are **accepted**: `:1145`, `:1146`, `:1155`, `:1160`, `:1176`, `:1177`/`:1180` (sha in Title), `:1187`–`:1189`, `:1188`, `:1198`, `:1229`, `:1231`, and the mixed EPIC/ADR cells. QE checked each against the order-keeping alternatives, and none is better.
  - A script scan finds exactly 5 branch references outside Code, all named.
- **A5 MET:** `git diff --name-only main...3d166e01`, excluding `.grugops/`, lists only `plans/traceability.md`. In `-U0`, removed = the 86 sources and added = the 86 repairs (multisets).
- **A6 MET:** `A1-fragments` prints `2 0` at base, code, `main` and both merges.

**Gates** at `6273bed2` and again at `262defb7`. Both code trees are identical to `745c6225` (empty `--stat` over src, tools and configs). No timing taken.
- lint, typecheck and build: exit 0.
- `npm test`: exit 0, **59 files / 1987 tests**. `last-run.json` (written by the run): success true, 1987/1987, 0 failed, 0 pending, 0 todo, 59 results.
- `test-skip-integrity.js --skip-count 0`: `No findings.`, exit 0.

**UAT waiver (AGENTS.md form):** `git diff --name-only 745c6225~1 745c6225 | grep -v '\.test\.ts$' | grep '^src/'` prints nothing (grep rc 1), and the same holds for `main...HEAD`. 0 production lines, so the waiver applies. A waiver is not a signature.

**Gap register (all INFO):**
- **QE-185-a:** 5 branch references sit outside Code, all forced by A2: `:1239`, `:1244`, `:1250` in Status, and `:1177`, `:1180` in Title (the `<sha> on grugops/…` form, which A4 (b)'s regex misses).
- **QE-185-b:** other word-order fragments are joined under a header of another kind; listed above and ruled accepted.
- **QE-185-c:** `:1190` and `:1194` render Code as `branch<br>—`. Cosmetic.
- **QE-185-d:** the A4 (c) map is one of two equal readings at `:1192` and `:1198`.

**Racing:** the page's short freeze applies from `262defb7`. If `main` appends a trace row before the merge, merge `main` into the branch again and re-run `A1-cells` and `A1-fragments`.

**Trace row (for the Orchestrator to append; 10 cells, checked with `A1-cells`' splitter):**
`| ABC-185 (QE) | QE gate on the re-cell: A1–A6 by own scripts at merge of main; 14 rows (140 cells) read in a marked 15.0.12 render, 0 avoidably misplaced; SE's 3 A4 (b) exceptions and word-order placements ruled accepted | — | — | QE-185-a, QE-185-b, QE-185-c, QE-185-d (INFO) | grugops/qe-ABC-185 @ 29fb9859 (from 3d166e01; merges of main a78c353a = 6273bed2, d42f6a3b = 262defb7)<br>ABC-185 page (## QE); .grugops/context/qe-ABC-185/ | A1 `[]`; A2 86/86; A3 705=705, 710=710; A5 one file; A6 `2 0`; lint, typecheck, build exit 0; npm test 59 files / 1987, last-run success; skip-count 0 "No findings." | waiver (0 production lines) | — | PASS_WITH_GAPS; In Review → Ready for UAT/merge (Orchestrator's move) |`
