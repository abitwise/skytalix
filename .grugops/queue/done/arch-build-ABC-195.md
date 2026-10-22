---
subtask: arch-build-ABC-195
role: architect-design
tickets: [ABC-195]
branch: grugops/ABC-195 (from main @ the main tip at your start); worktree ../wt-ABC-195
ref: .grugops/context/arch-build-ABC-195/
width: 2 (beside ticket-to-pr-ABC-194; disjoint files)
---

# Architect (builder): ABC-195 — clause (b) reads `---`/`+++` as headers only before a file's first `@@`; an unquoted header path drops one trailing TAB; 5 harness rows (25 total) with control twins; `.out.txt` regenerated; `ADR-0036` § S1 block retiring the HUNKHDR stand-in. Closes AR-193-HUNKHDR and AR-193-SPACEPATH on QE's read. ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-195-an-added-line-starting-plus-plus-hides-later-hunks-from-clause-b-and-a-production-file-whose-name-holds-a-space-goes-unseen.md`: every criterion, § Scope (incl. the three harness supports), § Out of scope, § Test notes.
- BA/PM `.grugops/context/bapm-cut-AR-193/notes/` (`…7e1a757e` readings, `…d7a70688` the cut); Security/NFR `.grugops/context/security-nfr-QE-193/notes/…5719a86d` and its `probe/` (`fix-prototype.patch`, `repro.sh`); Orchestrator `…73e94c9f`, `…f61be5db`; QE `qe-ABC-193` notes; `ADR-0036` § S1; ABC-193's harness.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`.

## Do
- Create the worktree `../wt-ABC-195` on `grugops/ABC-195` from the current `main`. A `node_modules` symlink is fine.
- **Red first:** the 25-row harness against base's instrument reproduces the page's base-red table; each half-removed copy reproduces its row.
- Implement exactly the page's Scope. The 20 existing rows unchanged.
- Plants and routes only in scratch clones (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`). **Never** set git config or attributes in this repository, any worktree, or your real `HOME`; never touch `node_modules/` in main's checkout. Use `/usr/bin/diff` (the shell defines `diff` as a function).
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (counts equal base, 59 / 1994); skip-count capture as spelled → `test-skip-integrity.js`. Heap 128 multi-file, 400 one-file. No timing.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing. AR-193-HUNKHDR stand-in (`…73e94c9f`): `git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <tip> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'` must print nothing.

## Fences
- Only the four files the page scopes (plus your notes). No `src/`, `plans/`, `AGENTS.md`, `memory-bank/` other than the ADR, other worktrees. Commit on `grugops/ABC-195` only. Never push, merge or `--force`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree as the context root explicitly** — never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Notes are append-only: never delete one; a wrong note gets a superseding note. `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Task `arch-build-ABC-195`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/<subtask>.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.

## Result

- **Branch:** `grugops/ABC-195` @ `f9709ed8`, worktree `../wt-ABC-195`, from `main` `99d07d32`. Not pushed, not merged. `main` moved to `5427f807` during the hop (the Orchestrator's queue records for `ABC-194`); no file overlap, and the branch is not merged with it.
- **Commits:**
  - `5e840c58`: the harness only (5 rows, the `TW` twin reference with `twmask`, the plant check `pc`, the Ruling 2 parse split at `  (fired by Ruling 2:`, header comment and summary lines), so red runs first.
  - `0dfd17b3`: the instrument, the code commit. `changedLines` only: a `header` flag set on `diff --git `, cleared on `@@`, gating the C-quoted test and both header tests; one trailing TAB dropped from an unquoted header path. 8 `+` / 5 `−` (3 added, 5 edited). sha-256 `24b963b14fa4f1bf…` (base `2c0c1985e6607110…`). A2–A7 ran at this tip.
  - `6b0f8575`: the `ADR-0036` block, and `r2-mutants.out.txt` = the A4 run.
  - `f9709ed8`: 2 sealed notes.
- **Files:** `git diff --name-only main...HEAD` = the 4 Scope files plus `.grugops/context/arch-build-ABC-195/notes/` (2). `src/`, `biome.json`, `.gitattributes`, `AGENTS.md`, `plans/` untouched.
- **Verdict: built, A1–A9 met on the builder's read.** QE's read of A2–A7 is owed; `AR-193-HUNKHDR` and `AR-193-SPACEPATH` close on it.

| | result |
|---|---|
| A1 | MET: 4 Scope files plus this hop's notes (ignored per `QE-182-d`). The owner's waiver form is empty per commit and over the range |
| A2 | MET (run first, harness `5e840c58`, base instrument; again at `0dfd17b3`): rc **1**, `limb 1 MISMATCH: RA-PLUS SP-N5`, DIFFER on exactly `PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3 PP-EDIT:limb2 SP-N5:limb2 SP-N5:limb3`; the 20 rows `ok`/`identical`, byte-equal to main's harness on base (139 lines) |
| A3 | MET: without (b) rc 1, `MISMATCH: SP-N5`, DIFFER `SP-N5:limb2 SP-N5:limb3`; without (a) rc 1, `MISMATCH: RA-PLUS`, DIFFER on the page's 7 limbs; the 20 rows byte-identical to A4's in both |
| A4 | MET: rc **0**, 25 of 25, every limb 2/3 identical to its named reference; the 20 rows byte-equal to base's harness on base's instrument at the same tip (139 lines, header aside); plant check 1, 1, 1, 1, 2 on the plants, 0 on each twin; clones hold 0 `color.*`/`diff.*` keys and no `.git/info/attributes`; the worktree's status, `HEAD` and refs unchanged around the runs |
| A5 | MET: `SP-N5` capability 1, `src/q t.ts  (fired by Ruling 2: 3 + lines, 0 - lines; holds limb 1 at <head>)` with no TAB, limb 2 `src/q t.ts:3`, limb 3 `src/q t.ts:4`; `PP-TPL`/`PP-REDIR`/`RA-PLUS` limb 2 `src/fen.ts:351`, limb 3 `src/fen.ts:352`; `PP-EDIT` limb 2 `src/cli.ts:142 … slice(1)`; `PP-REDIR` 1 file (base 2, naming `src/glyph-mode.ts`); `RA-PLUS` 0 `C-quoted` per limb (base 1) |
| A6 | MET: `src/q"t.ts`, `src/a "b.ts`, `src/c<TAB>d.ts`: FIRES (disputed), 3 `C-quoted` on head and base; `PM`: head `0 + lines, 2 - lines`, base `0 + lines, 1 - line`, both FIRE |
| A7 | MET: three hunks at base lines 210, 213–215, 223–224 inside `changedLines` (206–236); the `git("diff", …)` line byte-identical; one `execFileSync` argv, no shell (`V1.2.5`) |
| A8 | MET: ADR diff 43 `+` / 0 `−`; the block after `ABC-193`'s states (i)–(v), the harness and the rollback (revert `0dfd17b3`) |
| A9 | MET: see the gates |

**Gates at `6b0f8575`** (`f9709ed8` adds notes only):
- lint rc 0 (116 files); typecheck rc 0; build rc 0.
- `npm test` rc 0, 59 files / 1994 tests. `last-run.json`: `success` true, 0 failed, 0 pending, 0 todo. Equal to base.
- Skip-count capture as spelled: `0`. `test-skip-integrity.js --skip-count 0`: `No findings.`
- Heap 128 (`npm test` and the capture); no one-file run needed. No timing taken.

**UAT waiver** (owner's form): `git -c core.quotePath=false diff --name-only <c>~1 <c> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing for `5e840c58`, `0dfd17b3`, `6b0f8575`, `f9709ed8`, and over `99d07d32..f9709ed8`.
**`AR-193-HUNKHDR` stand-in** (`…73e94c9f`): prints nothing over `99d07d32..6b0f8575` / `..f9709ed8` and for each commit, in my shell and in the private env (2026-10-21T20:08Z, 20:11Z).

**Fence:** every plant lived in `git clone --shared` scratch clones under the session scratchpad, with a private `HOME`/`TMPDIR`/`GIT_CONFIG_GLOBAL` and `GIT_CONFIG_NOSYSTEM=1`. No git config or attributes set in the repository, any worktree or the real `HOME`. Main's `.git/config` holds `core.*` only; `.git/info/` holds `exclude` and `refs`. Main's `node_modules/` only read (the worktree's `node_modules` is a git-ignored symlink to it). `../wt-ABC-194` and `../wt-qe-ABC-194` not touched. No breach.

**Residuals (INFO, none against a criterion):** none new. The trailing TAB in a C-quoted dispute line for a name holding a space and a `"` stays (fenced by the page).

**Notes (sealed, committed on the branch):** `.grugops/context/arch-build-ABC-195/notes/20261021T201014Z-architect-design-observation-1bafd98d.md`, `…20261021T201020Z-architect-design-decision-6a068acf.md`.

**Trace row (for the Orchestrator to append):**

| ABC-195 (Architect build) | built the AR-193-HUNKHDR and AR-193-SPACEPATH fix: clause-b.mjs changedLines reads ---/+++ (and the C-quoted test) as headers only between `diff --git ` and the first @@, and drops one trailing TAB from an unquoted header path; r2-mutants.sh at 25 rows (PP-TPL, PP-REDIR, RA-PLUS, PP-EDIT, SP-N5) with the TW control-twin reference, a plant check and a Ruling 2 parse that reads spaced names; out.txt regenerated; ADR-0036 § S1 dated block retires the HUNKHDR stand-in at merge | — | — | AR-193-HUNKHDR (fix built; closes on QE read), AR-193-SPACEPATH (fix built; closes on QE read), QE-193-a, QE-193-b, QE-193-c (scope stated in ADR), R-193-a (gone), ADR-0036 § S1, V1.2.5, F-095-1, NFR-008 0/0/0 | grugops/ABC-195 @ f9709ed8 (code 0dfd17b3)<br>.grugops/context/design-F-072-1/probe/clause-b.mjs, r2-mutants.sh, r2-mutants.out.txt; memory-bank/50-decisions/ADR-0036-…md; 2 notes | A2 rc 1, MISMATCH RA-PLUS SP-N5 + 9 limbs; A3 no-(b) SP-N5 + 2, no-(a) RA-PLUS + 7; A4 rc 0 25/25, 20 rows byte-equal base (139 lines), plant check 1/1/1/1/2 vs 0; A5 SP-N5 3/0 no TAB, PP-REDIR 1 file (base 2), RA-PLUS 0 C-quoted (base 1/limb); A6 3 C-quoted on both, PM 0/2 vs 0/1; A7 3 hunks in changedLines, diff-call line unchanged; lint/typecheck/build rc 0; npm test 59/1994 = base; skips 0; integrity No findings | UAT waived (0 production lines; owner's -c core.quotePath=false form empty per commit and over the range); HUNKHDR stand-in empty | — | built, A1–A9 met; In Development → In Review is the Orchestrator's move; QE hop owed (A2–A7) |
