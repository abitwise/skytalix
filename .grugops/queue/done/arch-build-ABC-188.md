---
subtask: arch-build-ABC-188
role: architect-design
tickets: [ABC-188]
branch: grugops/ABC-188 (from main @ the main tip at your start); worktree ../wt-ABC-188
ref: .grugops/context/arch-build-ABC-188/
width: 1
---

# Architect (builder): ABC-188 — clause (b) limb 1 fires on `+` and `−` lines in a holder, and on a holder deleted or renamed away; the harness rows flip; QE-182-a folds in; `ADR-0036` § S1 gets a dated block. Closes `AR-163-DELONLY` on QE's read. ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-188-a-deletion-only-edit-to-a-limb-1-holder-fires-nothing-on-clause-b-and-abc-168-adds-the-second-holder.md`: every criterion, § Scope (four files), § Out of scope, the builder note.
- BA/PM notes `…89ba3c6d` (scratch readings), `…77891d86` (the cut), `…cd2ce2c9`; Security/NFR `…75a45be0` (ABC-168) and `…3e4b4a08` (ABC-163); `ADR-0036` § S1; ABC-182's harness and its QE notes.
- `AGENTS.md`, and `memory-bank/45-standing-rulings.md` for the gate rules.

## Do
- Create the worktree `../wt-ABC-188` on `grugops/ABC-188` from the current `main`. A `node_modules` symlink is fine (the instrument needs `typescript`); remove it before you finish if it isn't ignored.
- **Red first:** run the harness against base's instrument; it must fail on exactly `G1-IMP`, `G1-GRD`, `G1B`, `UNC1` and `REN` (page). Then the skip-only copy, which must fail on exactly `REN` (`A3`).
- Implement exactly the page's Scope. Limbs 2 and 3 byte-identical to `341da4c1` on every plant; `(b1) capability` unchanged; the empty-holder case unchanged.
- Read D1 and D2 by hand at `b71f8902` (`grugops/ABC-168`), as the page says; they are not committed rows.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (counts equal base); skip-integrity `--skip-count 0`. Heap 128 multi-file (as `npm test` sets). No timing. UAT waiver in AGENTS.md's form (must print nothing).

## Fences
- Only the four files the page scopes. No `src/`, `biome.json`, `plans/` (except nothing), other worktrees. Commit on `grugops/ABC-188` only. Never push or merge.
- **Stop and report** if a criterion can't be met as written, or if you read Security/NFR's ruling more narrowly than the page (BA/PM flagged that this goes back to Security/NFR before the build).

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `arch-build-ABC-188`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`. Write notes inside your worktree; include a `kind: decision`.
- Write `.grugops/queue/done/arch-build-ABC-188.md` (brief + `## Result`: tip, per-criterion results, harness output, gates, waiver) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-188 (Architect build) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**Tip `66d6a2f1`** (`66d6a2f10f841dac7142994c7999216107b625c0`) on `grugops/ABC-188`, worktree `../wt-ABC-188`, from `main` `5cd279a4`. Not pushed, not merged.
- **Commits:**
  - `98487c1e`: the harness only, so the red run comes first.
  - `d722a6b6`: the instrument, and the harness's `R2 file` print. This is the code commit, and the harness runs are at this tip.
  - `eb097a7b`: the `ADR-0036` block, and `r2-mutants.out.txt` = the A4 run.
  - `66d6a2f1`: 2 sealed notes.
- **Files:** `git diff --name-only main...HEAD` = the 4 Scope files plus `.grugops/context/arch-build-ABC-188/notes/` (2). `src/`, `biome.json` and `plans/` are untouched.
- **Verdict: built, A1–A9 met on the builder's read.** QE's read of A2–A7 is owed; `AR-163-DELONLY` closes on that read.
- **Security/NFR's ruling, read the same as the page (not narrower):** a holder deleted at `<head>` held limb 1 at `<base>` and has changed lines. No return to Security/NFR was needed.

| | result |
|---|---|
| A1 | MET: 4 Scope files plus this hop's notes (ignored per `QE-182-d`). The waiver pipe is empty |
| A2 | MET: base `clause-b.mjs` copy, rc **1**, `r2-mutants: limb 1 MISMATCH: G1-IMP G1-GRD G1B UNC1 REN`, 0 `DIFFER`. Also red at `98487c1e`, before the instrument edit |
| A3 | MET: skip-only copy, rc **1**, `limb 1 MISMATCH: REN`, 0 `DIFFER` |
| A4 | MET: rc **0**, `10 of 10 limb-1 rows as expected; limbs 2 and 3 identical to 341da4c1 on 10 of 10`. Status, `HEAD` and refs are the same before and after (worktree and main checkout) |
| A5 | MET: G1-IMP `0 + lines, 1 - line`; G1B `0 + lines, 1 - line`; REN `src/book-file.ts … 0 + lines, 17 - lines; holds limb 1 at <base>`; P2b `1 + line, 1 - line` |
| A6 | MET at `b71f8902` (the `ABC-168` tip; `uci.ts` unchanged). D1 (0/1) and D2 (0/4) are limb 1 FIRES: `src/uci.ts`, `<base> and <head>`, `−` 1 / `−` 4. Limbs 2/3 are `cmp`-identical to `341da4c1`. Base's instrument: does not fire |
| A7 | MET: scratch drift `b294ba6f` (`read: () => readBookFile(),`), rc **2**, stderr `plant P2c did not apply at b294ba6f: changed [src/book-file.ts], names [src/book-file.ts src/cli.ts]` |
| A8 | MET: the ADR diff is 25 `+` / 0 `−`. `#### Ruling 2 widened — 2026-10-21 (ABC-188)` comes after the `ABC-163` block and states (i)–(vi) |
| A9 | MET: see the gates |

**Gates at `eb097a7b`** (`66d6a2f1` adds notes only):
- lint rc 0 (116 files); typecheck rc 0; build rc 0.
- `npm test` rc 0, 59 files / 1987 tests. `last-run.json`: `success` true, 0 failed, 0 pending, 0 todo. That equals base (59 / 1987, with test inputs byte-equal to `4890782a`).
- Skip count 0. `test-skip-integrity.js --skip-count 0`: `No findings.`
- Heap 128, set by `npm test`. No timing was taken.

**UAT waiver** (AGENTS.md form, unfiltered): `git diff --name-only <c>~1 <c> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing for `98487c1e`, `d722a6b6`, `eb097a7b` and `66d6a2f1`, and over `main...HEAD`. 0 `.snap` changed.

**Residuals (INFO, none against a criterion):**
- `R-188-a`: the new `--- ` header match shares the `+++ ` match's assumption about content lines that start with `-- `. At worst it under-counts `−`, and the file still fires. 0 such lines in production `src/`.
- `R-188-b`: the file-list check does not catch a partial edit inside one file (`X1`, `G1B-base`).
- Flagged, not changed: `production files changed` omits a file deleted at `<head>` on every limb.

`node_modules` in the worktree is a symlink, git-ignored via `.git/info/exclude`.

**Notes (sealed, in the worktree, committed on the branch):** `.grugops/context/arch-build-ABC-188/notes/20261021T150717Z-architect-design-decision-7d78d7cc.md`, `…observation-f83c0463.md`.

**Trace row (for the Orchestrator to append):**

| ABC-188 (Architect build) | built the AR-163-DELONLY fix: clause-b.mjs limb 1 Ruling 2 fires on + and − lines in a holder, a holder deleted or renamed away included, with +/− counts printed; r2-mutants.sh at 10 rows with a per-plant file-list check (QE-182-a); ADR-0036 § S1 dated block | — | — | AR-163-DELONLY (fix built; closes on QE's read), AR-163-UNCOMMENT (limb 1 covered by UNC1), QE-182-a (folded), ADR-0036 § S1, NFR-008 0/0/0, R-188-a, R-188-b (INFO) | grugops/ABC-188 @ 66d6a2f1 (code d722a6b6)<br>.grugops/context/design-F-072-1/probe/clause-b.mjs, r2-mutants.sh, r2-mutants.out.txt; memory-bank/50-decisions/ADR-0036-…md; 2 notes | A2 rc 1 exactly 5; A3 rc 1 REN only; A4 rc 0 10/10, limbs 2/3 10/10; A5 0/1, 0/1, 0/17, 1/1; A6 D1, D2 FIRE; A7 rc 2 P2c; lint/typecheck/build rc 0; npm test 59/1987 = base; skips 0; integrity No findings | UAT waived (0 production lines; pipe empty per commit and over the range) | — | built, A1–A9 met; In Development → In Review is the Orchestrator's move; QE hop owed (A2–A7) |
