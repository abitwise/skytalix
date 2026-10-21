---
subtask: arch-build-ABC-193
role: architect-design
tickets: [ABC-193]
branch: grugops/ABC-193 (from main @ the main tip at your start); worktree ../wt-ABC-193
ref: .grugops/context/arch-build-ABC-193/
width: 3 (beside ticket-to-pr-ABC-192 and scribe-waiver-quotepath; disjoint files)
---

# Architect (builder): ABC-193 — clause (b)'s diff call gains `--no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/`; every instrument git call runs with `-c core.quotePath=false`; a still-quoted path fires as a dispute; 8 harness rows (20 total); `.out.txt` regenerated; `ADR-0036` § S1 block retiring the GITENV stand-in. Closes AR-191-GITENV (and AR-191-QUOTEPATH's instrument half) on QE's read. ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-193-git-config-or-environment-can-blind-clause-bs-one-diff-call-and-a-non-ascii-production-file-goes-unseen.md`: every criterion (incl. the by-hand A6), § Scope, § Out of scope, § Test notes.
- BA/PM `.grugops/context/bapm-cut-AR-191/notes/` (`…a7367f5d` readings, `…7db22c5f` the cut); Security/NFR `.grugops/context/security-nfr-QE-191-a/notes/…7c1f3590` and its `probe/`; Orchestrator `…eb401873`, `…717a2219`; `ADR-0036` § S1; ABC-191's harness and done records.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`.

## Do
- Create the worktree `../wt-ABC-193` on `grugops/ABC-193` from the current `main`. A `node_modules` symlink is fine.
- **Red first:** the 20-row harness against base's instrument fails on exactly the page's 7 rows; show each part's red set as the page's table states.
- Implement exactly the page's Scope. The 12 existing rows unchanged.
- **Git routes are set only inside the harness's own scratch clones** (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`) or a run's environment. **Never** set git config, `.git/info/attributes` or a global attributes file in this repository, any worktree (they share one `.git/config`), or your real `HOME`. Run the stand-in line below before you finish and report its output.
- Note: this host's shell defines `diff` as a function; use `/usr/bin/diff` for plain diffs.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (counts equal base); skip-count capture as spelled → `test-skip-integrity.js`. Heap 128 multi-file, 400 one-file. No timing.
- UAT waiver in the owner's new form (`…717a2219`): `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing. AR-191-GITENV stand-in, in your shell and worktree: `git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF` must print nothing.

## Fences
- Only the four files the page scopes (plus your notes). No `src/`, `plans/`, `AGENTS.md`, `memory-bank/` other than the ADR, other worktrees. Commit on `grugops/ABC-193` only. Never push, merge or `--force`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree as the context root explicitly** — never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Notes are append-only: never delete one; a wrong note gets a superseding note. `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Task `arch-build-ABC-193`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/<subtask>.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.

## Result

- **Branch:** `grugops/ABC-193` @ `3d734fa1`, worktree `../wt-ABC-193`, from `main` `47a3c9a1`. Not pushed, not merged. `main` moved to `ec5c42d7` during the hop (the Scribe's waiver merge `4f81850c` and queue records); no file overlaps, and the branch is not merged with it.
- **Commits:**
  - `e6f91f1d`: the harness only (8 rows, the `rt` route hook, the `QP` reference mode, `mk` unquoted, the leftover check), so red runs first.
  - `63eadabe`: the instrument, the code commit. Every git call reads `-c core.quotePath=false`; the one diff call reads `--no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/`; a `--- "`/`+++ "` path is an unresolved item `<path> (C-quoted by git; not read)`. 7 `+` / 4 `−`. sha-256 `2c0c1985e6607110…`. A3–A7 ran at this tip.
  - `6b83874c`: the `ADR-0036` block, and `r2-mutants.out.txt` = the A4 run.
  - `3d734fa1`: 2 sealed notes.
- **Files:** `git diff --name-only main...HEAD` = the 4 Scope files plus `.grugops/context/arch-build-ABC-193/notes/` (2). `src/`, `biome.json`, `.gitattributes`, `AGENTS.md`, `plans/` untouched.
- **Verdict: built, A1–A9 met on the builder's read.** QE's read of A2–A7 is owed; `AR-191-GITENV` closes on it, and `AR-191-QUOTEPATH`'s instrument half on `QU`/`QE2`/A6.

| | result |
|---|---|
| A1 | MET: 4 Scope files plus this hop's notes (ignored per `QE-182-d`). The owner's waiver form is empty per commit and over the range |
| A2 | MET (run first, harness `e6f91f1d`, base `d3abb847…`): rc **1**, `limb 1 MISMATCH: G-COLOR G-EXT G-ENV G-DRV G-PFX QU QE2`, DIFFER on exactly those 14 limbs; 12 earlier rows and `ADD` `ok`, 26 `identical`. Route rows on base: `(b1) capability: 0`, `does not fire`. Same at tip `63eadabe` |
| A3 | MET: no quotePath rc 1 `QU QE2` + 4; no flags rc 1 the 5 route rows + 10; no `--no-color` rc 1 `G-COLOR` + 2; no `--no-ext-diff` rc 1 `G-EXT G-ENV G-DRV` + 6; no prefixes rc 1 `G-PFX` + 2; no `--dst-prefix` rc 1, no MISMATCH, DIFFER `G-PFX:limb2 G-PFX:limb3`; no `--src-prefix` rc 0 |
| A4 | MET: rc **0**, 20 of 20, 40 limbs identical to their named references; the 12 earlier rows 83 lines byte-equal to base's on the same tip (header aside); clones hold 0 `color.*`/`diff.*` keys and no `.git/info/attributes`; status empty, `HEAD`s unchanged |
| A5 | MET: `ADD` + 5 routes `src/fen.ts  (fired by Ruling 2: 2 + lines, 0 - lines; holds limb 1 at <head>)`; `QU`/`QE2` the same for `src/qé.ts`, unquoted; capability 1; limb 3 FIRES on all but `QU` |
| A6 | MET: `PFX-X1` head `1 + line, 3 - lines` (base silent; no `--src` `1/0`; no `--dst` `0/3`, changed 0). `CQ1`, `CQT`, `CQ2` head FIRES (disputed) on L1 and L3 naming `"src/q\"t.ts"` / `"src/q\tt.ts"`; base and the no-(c) copy silent. `CQS` silent, no dispute names the file |
| A7 | MET: shim on `ADD` L1: 87 calls, 87 with `-c core.quotePath=false` first (base 87, 0); one `diff` call with `-U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ … -- src`; `execFileSync` argv, no shell (`V1.2.5`) |
| A8 | MET: ADR diff 30 `+` / 0 `−`; the block after `ABC-191`'s states (i)–(v) and the rollback (revert `63eadabe`) |
| A9 | MET: see the gates |

**Gates at `6b83874c`** (`3d734fa1` adds notes only):
- lint rc 0 (116 files); typecheck rc 0; build rc 0.
- `npm test` rc 0, 59 files / 1992 tests. `last-run.json`: `success` true, 0 failed, 0 pending, 0 todo. Equal to base.
- Skip-count capture as spelled: `0`. `test-skip-integrity.js --skip-count 0`: `No findings.`
- Heap 128, set by `npm test`; no one-file run needed. No timing taken.

**UAT waiver** (owner's new form, `…717a2219`): `git -c core.quotePath=false diff --name-only <c>~1 <c> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing for `e6f91f1d`, `63eadabe`, `6b83874c`, `3d734fa1`, and over `47a3c9a1..3d734fa1`.
**`AR-191-GITENV` stand-in:** prints nothing in my shell, in `../wt-ABC-193` and in main's checkout (2026-10-21T17:47Z and 17:48Z).

**Fence:** every route and plant lived in `git clone --shared` scratch clones under the session scratchpad, with a private `HOME`/`TMPDIR`/`GIT_CONFIG_GLOBAL` and `GIT_CONFIG_NOSYSTEM=1`. Main's `.git/config` holds `core.*` only, and `.git/info/` holds `exclude` and `refs`. `../wt-ABC-192` and `../wt-scribe-waiver-quotepath` were not touched.

**Residuals (INFO, none against a criterion):** `R-193-a`: a `-U0` hunk line whose text starts `-- "` or `++ "` would list as a C-quoted path, a false dispute in the fail-safe direction (`src/` has 0 such lines). `R-193-b`: `ls-tree` still drops a C-quoted name, as the page designs (`CQS` silent; a new edge to one is the existing `not a production file` dispute).

`node_modules` in the worktree is a symlink, git-ignored via `.git/info/exclude`.

**Notes (sealed, committed on the branch):** `.grugops/context/arch-build-ABC-193/notes/20261021T174842Z-architect-design-decision-2b7be2e6.md`, `…20261021T174836Z-architect-design-observation-c1511dfb.md`.

**Trace row (for the Orchestrator to append):**

| ABC-193 (Architect build) | built the AR-191-GITENV and AR-191-QUOTEPATH fix: clause-b.mjs runs every git call with -c core.quotePath=false, its one diff call reads --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/, and a C-quoted path FIRES (disputed); r2-mutants.sh at 20 rows (ADD, G-COLOR, G-EXT, G-ENV, G-DRV, G-PFX, QU, QE2); out.txt regenerated; ADR-0036 § S1 dated block retires the GITENV stand-in at merge | — | — | AR-191-GITENV (fix built; closes on QE's read), AR-191-QUOTEPATH (instrument half), QE-191-a, QE-191-b, ADR-0036 § S1, V1.2.5, F-095-1, NFR-008 0/0/0, R-193-a, R-193-b (INFO) | grugops/ABC-193 @ 3d734fa1 (code 63eadabe)<br>.grugops/context/design-F-072-1/probe/clause-b.mjs, r2-mutants.sh, r2-mutants.out.txt; memory-bank/50-decisions/ADR-0036-…md; 2 notes | A2 rc 1, 7 rows + 14 limbs; A3 each part its own red set, --src-prefix rc 0; A4 rc 0 20/20, 12 rows byte-equal base; A5 2/0; A6 PFX-X1 1/3, CQ1 CQT CQ2 disputed, CQS silent; A7 87 calls all -c, 1 diff call, = base count; lint/typecheck/build rc 0; npm test 59/1992 = base; skips 0; integrity No findings | UAT waived (0 production lines; owner's -c core.quotePath=false form empty per commit and over the range) | — | built, A1–A9 met; In Development → In Review is the Orchestrator's move; QE hop owed (A2–A7) |
