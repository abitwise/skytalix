---
subtask: qe-ABC-186
role: qe-e2e
ticket: plans/tickets/ABC-186-the-trace-table-stops-rendering-at-line-496-so-632-of-its-690-rows-render-as-paragraph-text.md
ref: .grugops/context/qe-ABC-186/
branch: grugops/ABC-186 (tip 9943e5f4; code 50d54d53; base a3e6f2a7); SE worktree ../wt-ABC-186 (read only)
width: 2 (beside bapm-fold-A-ABC-164)
---

# QE gate for ABC-186 (records only: `plans/traceability.md`)

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase; `main` has gained trace rows since `a3e6f2a7`), keep `main`'s appended rows as they are, and run every criterion at that merge. Report the merge sha and any conflict.
- Verify `A1`–`A7` with your own runs of the page's commands, not the SE's readings:
  - `A1-fragments`: `4 3` at base → `2 0` at the merge.
  - `A2`: render with `marked` 15.0.12 to a file (`-o`). Count `<table` and `<tr`, and check every `<tr` sits inside a table. The SE read base `<tr` as 60, not the page's 59, and attributes the extra one to a literal `<tr>` in the `ABC-186 (BA/PM)` row rendering as raw HTML while it was paragraph text. Confirm or refute.
  - `A3`: in `git diff -U0` base → head outside the note, exactly 2 empty lines removed and exactly 2 lines added, byte-equal to the header and delimiter rows, between the comment's end and the first row after it.
  - `A4`: `A1-cells` names equal at base and head.
  - `A5-note` `0 0 0 1 1 1`; the three byte-unchanged lines.
  - `A6`, `A7` as written.
- **Read the rewritten note** as a reader would: one counting rule, the forward row rule with the blank-line / HTML-comment sentence, no row named as malformed.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. No timing. UAT waiver in AGENTS.md's form.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-186` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-186 page there.
- No edits to `plans/traceability.md` beyond the merge of `main`; no `src/`, `AGENTS.md`, `plans/board.md` or other ticket pages.
- Never push, `--force`, `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-186`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-186.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (rule `…d2b9bf09`); do NOT append it yourself:
  `| ABC-186 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**Tip `0be87ae8`** on `grugops/qe-ABC-186` (local, not pushed; worktree `../wt-qe-ABC-186`), branched from `9943e5f4`. **Merge of `main`: `fb04f495`** (`main` `60d72e66` into the QE branch, `--no-ff`), **no conflict**. `main`'s appended row `ABC-186 (SE)` is kept verbatim. The trace diff `main`→`fb04f495` has the same 25 `+`/`-` lines as the code diff `a3e6f2a7`→`50d54d53`. **Verdict: PASS_WITH_GAPS.** A1–A7 are MET at the merge and at the code tip; 0 gaps block; 4 are INFO.

**Per criterion** (the page's own commands, copied from its fenced blocks and run on `git show` copies; observation `…observation-8515e0a0`):
- **A1 MET.** `A1-fragments` prints `4 3` at `3d36999b`, `a3e6f2a7` and `60d72e66`, and `2 0` at `50d54d53` and `fb04f495`.
- **A2 MET.** `marked` 15.0.12 (npx cache, `--gfm -o`). A script nests table open/close tags and places every row tag:
  - merge: 2 tables, 697 = 699 `|` lines − 2 delimiter rows, 0 outside a table (59 + 638);
  - code tip: 696 of 696.
  - Both header rows have 10 cells and are identical, and every row has 10 cells.
- **A2: the SE's 60-vs-59 is CONFIRMED.** At `3d36999b` there are 59, all inside the table. At `a3e6f2a7` there are 60: 59 inside, plus **1 outside a table**. That one is the literal `<tr>` in row `ABC-186 (BA/PM)` (base `:1264`), which is absent at `3d36999b`. It came out as raw HTML while the row was paragraph text. At the merge it renders as `&lt;tr&gt;` inside a cell.
- **A3 MET** (script, both base→code and `main`→merge). Outside the note, exactly 2 lines are removed (`:740`, `:742`, both empty) and exactly 2 added. The added pair equals `[header, delimiter]` byte for byte. It sits at head `:628–629`, after the blank line that follows the comment's `-->` and before `| ABC-057 |`. The note's hunks are `:364`, `:369–376` and `:387–388`, and `:1–363` is byte-equal.
- **A4 MET.** `A1-cells` (base `:382`, which matches `ABC-165`'s page) gives the same 86 names at all five revisions, with one md5.
- **A5 MET.** `1 1 1 0 0 0` → `0 0 0 1 1 1`. The escape-aware line, the `A1-cells` line and the "Do not append…" sentence each occur once in the note at base and at head.
- **A6 MET.** The `A1-fragments` line in the note is byte-equal to the page's. FORWARD ROW RULE names "a blank line, or an HTML comment". The note has only its own `-->`. In the render, none of its text appears outside a comment.
- **A7 MET.** Excluding `.grugops/`, both `main...HEAD` (merge) and `main...grugops/ABC-186` list only `plans/traceability.md`. (The QE branch also carries the ticket page's `## QE` section. That is QE's record, not the SE's delivery.)

**Reading the note** (`…observation-2bc29fd0`):
- **One counting rule:** the escape-aware split. The ELEVEN / plain-split prescription is gone, and `.split('|')` now appears only as the wrong counter.
- The 2026-08-13 paragraph opens with "HISTORY, superseded by ROW SHAPE AND COUNT below:".
- The forward rule has the blank-line / HTML-comment sentence, `A1-fragments`, and a check that names both commands.
- No row is named as malformed today. The only rows named are history: ABC-009/011/015/019 as wrongly listed, ABC-029 as malformed and already repaired, and the ABC-028/029 duplicates.

**Break attempts** (scratch copies of the merge's trace):
- A blank line before an appended row gives `3 1`. An HTML comment before it gives `3 1`. A drifted second header gives `2 1`. All three are caught.
- A row indented by 2 spaces gives `2 0` and still renders as a table row. It is not caught (QE-186-b).
- A correct append gives `2 0` with 698 of 698 rows (the control).

**Gates** at `fb04f495` (`…observation-f3984558`). `src`, `tools`, `package.json`, the lockfile, `tsconfig.json` and `biome.json` have the same tree/blob ids as the code tip `50d54d53`.
- lint rc 0 (116 files); typecheck rc 0; build rc 0.
- `npm test` rc 0, 59 files / 1987 tests. `.test-results/last-run.json`: `success: true`, 1987 passed, 0 failed / pending / todo.
- `test-skip-integrity.js --skip-count 0`: "No findings.", rc 0.
- No timing was taken.

**UAT waiver** (AGENTS.md form): `git diff --name-only 50d54d53~1 50d54d53 | grep -v '\.test\.ts$' | grep '^src/'` prints nothing, and `main...HEAD` also prints nothing. 0 production lines, so the waiver holds. A waiver is not a signature. Re-measure on the delivered commit.

**Gap register** (verdict `…decision-8c01b4ee`; none blocks, none cut):
- **QE-186-a (INFO).** The page puts the escape-aware split at `:355`. At `3d36999b` it is `:354`, and `:355` is the "A plain `.split('|')` does NOT…" line. Both are byte-unchanged.
- **QE-186-b (INFO).** `A1-fragments`, `A1-cells` and A2's `grep -c '^|'` only see lines that start with `|`. A row indented 1–3 spaces renders as a row but is invisible to all three. 0 such rows today.
- **QE-186-c (INFO, UNKNOWN - verify).** No second renderer was tried (`cmark-gfm` and GitHub). None is installed, and nothing was fetched. Carried over from the page.
- **QE-186-d (INFO, out of scope).** The ABC-165 sentence "This note names no row." is literally untrue: it means "none as malformed". Wording only.

**Recommended move** (the Orchestrator's): `In Review` → `Ready for UAT`, with Security/NFR not triggered (per the page). Then the standing waiver applies after merge. Before merge, follow the page's racing rule: merge `main` again, re-run A1–A7, and freeze trace appends.

**Notes** (task `qe-ABC-186`, committed on the QE branch in `0be87ae8`, sealed by `admitAndAppend` with the worktree's context root): `20261021T131152Z-qe-e2e-observation-8515e0a0` (criteria), `…-observation-f3984558` (gates), `…-observation-2bc29fd0` (break and reading), `…-decision-8c01b4ee` (verdict). No `finding`: `human_admission` is off and there is no §14 stamp.

**Fences held:**
- No edit to `plans/traceability.md` beyond the merge.
- No `src/`, `AGENTS.md`, `plans/board.md` or other ticket page touched.
- No push, force, amend or rebase, and nothing merged into `main`.
- `node_modules` in the worktree is a git-ignored symlink to the main checkout's copy.

**Trace row** (10 cells, not appended):
`| ABC-186 (QE) | QE gate at the merge of main: A1–A7 re-run and MET; the SE's 60-vs-59 base reading confirmed (the extra one is the literal tag in row ABC-186 (BA/PM)); 5 mutant appends tried | — | — | QE-165-a, QE-165-b; QE-186-a, QE-186-b, QE-186-c, QE-186-d (all INFO) | grugops/qe-ABC-186 @ 0be87ae8 (merge of main fb04f495)<br>ABC-186 page (## QE) + 4 notes; no trace edit | lint, typecheck, build rc 0; npm test 59 / 1987 passed; skip-integrity 0; A1 `2 0`, A2 2 tables / 697 of 697 rows, A4 86 = base, A5 `0 0 0 1 1 1` | waiver (0 production lines) | — | PASS_WITH_GAPS; In Review → Ready for UAT (Orchestrator's move) |`
