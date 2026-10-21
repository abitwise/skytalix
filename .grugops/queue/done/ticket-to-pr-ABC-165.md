---
subtask: ticket-to-pr-ABC-165
role: software-engineer
tickets: [ABC-165]
branch: grugops/ABC-165 (from main @ the main tip at your start); worktree ../wt-ABC-165
ref: .grugops/context/ticket-to-pr-ABC-165/
width: 2 (beside qe-ABC-184; disjoint files)
---

# SE: ABC-165 (re-cut): repair the 11 trace rows that hide text, rewrite the trace's malformation note with the forward row rule, one blank line above the table header, and the `plans/metrics.md:2-3` join. Words kept byte for byte; ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-165-ten-traceability-rows-do-not-render-as-ten-columns-and-a-metrics-header-runs-into-the-next.md` as re-cut in `bapm-rescope-ABC-165`: every criterion, § Scope, § Out of scope, § Dependencies (its racing rule).
- BA/PM's notes `…50929881` (readings), `…d2b9bf09` (the forward row rule), `…e9a6c68a` (the split), and the Orchestrator's adoption `…34da66ba`.
- `AGENTS.md`: the 12 coding rules, and where the sealed-note writer lives.

## Do
- Create the worktree `../wt-ABC-165` on `grugops/ABC-165` from the current `main`. A `node_modules` symlink is fine (needed for the gates); remove it before you finish if it isn't ignored.
- Read `A1` and `A2` with scripts, not by eye (rows run to 16 KB). Show `A1` at base first.
- Implement exactly the page's scope. Touch no row below the 11 the page names; the 86 short rows are `ABC-185`.
- **The Orchestrator keeps appending 10-cell rows to the end of the trace while you work.** Before you finish, merge the current `main` into your branch (a merge, not a rebase), keep `main`'s appended rows exactly as they are, and re-run every criterion at the tip.
- Gates on the tip: lint, typecheck, build; `npm test` + `.test-results/last-run.json` success (59 / 1987, must equal base); skip-integrity `--skip-count 0`. `CLI_DEEP`/`PERFT_DEEP` are not needed (no `src/` change) unless the page asks.
- Heap rule: `npm test` sets 128 itself; one run at a time. Take no timing.
- Measure the UAT waiver in AGENTS.md's form (must print nothing).

## Fences
- Only `plans/traceability.md` and `plans/metrics.md`. No word of any trace cell changes; no row is added, removed, merged or re-ordered.
- Never touch `plans/board.md`, `AGENTS.md`, `src/`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-165` only. Never push or merge into `main`.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-165`. **Pass your worktree as the context root explicitly** (the writer's default root is the plugin's own directory). Take every `at` from `date -u` (UTC).
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-165.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (forward row rule, `…d2b9bf09`). Check it with `A1`'s splitter before you write it:
  `| ABC-165 (SE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
  `—` for an empty cell, never a missing one; a literal `|` is `\|`, inside code spans too; join two facts in one cell with `<br>` or `; `.

## Result

**Tip `893e9fd1`** on `grugops/ABC-165` (local, not pushed), from `main` `9af98210`. Commits: `49fce033` (the edits, `plans/traceability.md` +24/−13 and `plans/metrics.md` +1) and `893e9fd1` (notes). `main` was merged at the tip: still `9af98210`, "Already up to date", so there were no appended rows to keep. Verdict: **A1–A7 MET; ready for In Review / QE.**

**Edits** (decision `…decision-aa2e1e2b`). Every repair passes A2's strip. Each one escapes a `|`, adds a `| — ` cell, or moves a cell boundary at an existing space.
- `ABC-065`: 1 `|` escaped in a code span. `ABC-066`: 3 escaped in the usage line. `ABC-109 (UAT)`: 1 escaped in the `grep` pipe.
- QE rows `ABC-030`/`ABC-024`/`ABC-156`/`ABC-157`: the boundary between Tests and the `**PASS_WITH_GAPS.**` verdict is removed, so the waiver lands in UAT, `—` in Release, and the move in Status.
- The two `Scribe … (AGENTS.md)` rows: Code is split after `log.md\`;`, so the gates text lands in Tests.
- `ABC-094 (accepted)`: `—` added for Epic, Feature, NFRs and Release.
- `ABC-150 (design)` (2 cells): Title / `—`×3 / Code = the `(subtask …)` parenthesis / Tests = `D1`,`D2` / `—`×2 / Status = `D3` onward. This is a judgement call: word order puts the NFR ids in Status.
- Note `:377-378` is replaced by 13 indented lines: the GFM rule, A1's command verbatim, the forward rule with the Scope 2 template in a code span, and a pointer to `ABC-185`. The `ABC-029 … CORRECT.` sentence was dropped with it; the same fact stands at `:364-367`.
- One blank line before `| Ticket | Title |` (now `:435`). One blank line at `plans/metrics.md:3`.

**Per criterion** (all scripted; observation `…observation-b33097d3`):
- **A1 MET.** At base `A1-cells` prints 97 names (80 distinct). At the tip it prints 86, none of the 11. The command copied from the new note also prints 86.
- **A2 MET, 11 of 11 equal**, each to exactly one tip row of 10 cells: 626→637, 627→638, 735→746, 951→962, 982→993, 1001→1012, 1006→1017, 1099→1110, 1101→1112, 1103→1114, 1121→1132.
- **A3 MET.** 685 lines start with `|` at base and at the tip. Every other row is byte-identical. This hop appended no row.
- **A4 MET.** (a) A1's command, verbatim. (b) The template splits into 10. Its line is indented, so it is not a table row. (c) No Ticket cell is named as malformed. (d) `grep -c 'ABC-009 (12 cells)'` prints `0`.
- **A5 MET.** The line above the header is empty.
- **A6 MET.** `sed -n 3p plans/metrics.md` is empty. The diff is one added line.
- **A7 MET, with one exception.** `git diff --name-only 9af98210 49fce033` lists exactly `plans/metrics.md` and `plans/traceability.md`. At the tip it also lists the 3 notes under `.grugops/context/ticket-to-pr-ABC-165/notes/`, which the brief requires on the branch.

**Gates on the tip `893e9fd1`:**
- lint rc 0 (116 files)
- typecheck rc 0
- build rc 0
- `npm test` rc 0: 59 / 1987 passed, which equals the base count in the brief. `last-run.json` reports success true, 0 pending, 0 todo.
- skip-integrity `--skip-count 0`: `No findings.`

No timing was taken. `CLI_DEEP`/`PERFT_DEEP` were not run (no `src/` change).

**UAT waiver.** These two commands print nothing:
- `git diff --name-only HEAD~1 HEAD | grep -v '\.test\.ts$' | grep '^src/'`
- `git diff --name-only 9af98210 893e9fd1 | grep -v '\.test\.ts$' | grep '^src/'`

No `.snap` files changed. The waiver applies.

**Notes** (task `ticket-to-pr-ABC-165`, on the branch, sealed):
- `…decision-aa2e1e2b` (row mapping)
- `…observation-b33097d3` (acceptance and gates)
- `…observation-8d6adb53` (delivery record). The writer refuses an `artifact-ref` without a §14 `gate_run`.

**Flagged, not touched** (out of scope): the note's `:364` "every row gives 10" (2026-08-13) and `:371-372` "ELEVEN `|` characters" / plain `.split('|')` are stale against the escape-aware rule.

**Not touched:**
- `plans/board.md`, `AGENTS.md`, `src/`, and other tickets' files and worktrees.
- `git status --porcelain` is empty in the worktree.
- The `node_modules` symlink stays; it is ignored via `.git/info/exclude`.

**Re-merge before QE/merge.** If `main` moves, merge it again and re-run `verify.py`-equivalent A1–A7. The rows this hop touches are all at or above `:1132` at the tip.

**Trace row** (10 cells, checked with A1's splitter; for the Orchestrator to append):
| ABC-165 (SE) | 11 trace rows re-celled to 10 (stray `\|` escaped; cells joined or split with whitespace and `—` only, no word changed); malformation note rewritten with the GFM rule, the A1 count and the forward row rule; blank line above the header; blank line at `plans/metrics.md:3` | — | — | QE-040-c; QE-156-a; decision `…aa2e1e2b` | `grugops/ABC-165` @ `893e9fd1` (code `49fce033`, base `9af98210`)<br>`plans/traceability.md`, `plans/metrics.md` | A1–A7 met (A1 97 → 86, none of the 11; A2 11 of 11; A3 685 = 685); lint, typecheck, build rc 0; `npm test` 59/1987 = base, skip 0, `No findings.` | waiver measured empty (0 `src/` lines) | — | In Development → In Review; QE owed |
