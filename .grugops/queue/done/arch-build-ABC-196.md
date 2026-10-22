---
subtask: arch-build-ABC-196
role: architect-design
tickets: [ABC-196]
branch: grugops/ABC-196 (from main @ the main tip at your start); worktree ../wt-ABC-196
ref: .grugops/context/arch-build-ABC-196/
width: 3 (beside merge-prep-ABC-168 and bapm-rerule-ABC-178; disjoint files)
---

# Architect (builder): ABC-196. Each twin-referenced row of `r2-mutants.sh` asserts its expected limb 2/3 reading, so a drifted anchor or a dropped capability line goes red, naming the row. Harness only, ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-196-a-drifted-anchor-or-a-dropped-capability-line-turns-a-twin-row-of-r2-mutants-into-a-silent-control.md`: every criterion, § Scope, § Out of scope, § Test notes.
- BA/PM `.grugops/context/bapm-rule-QE-195/notes/` (`…f0144de0` the cut, `…466ee18d` the base-red and prototype readings); QE `.grugops/context/qe-ABC-195/notes/` (`…f36a06c3`, `…741eebba` plants and drift copies); your own `arch-build-ABC-195` notes; `ADR-0036` § S1.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`.

## Do
- Create the worktree `../wt-ABC-196` on `grugops/ABC-196` from the current `main`. A `node_modules` symlink is fine.
- **Red first:** reproduce the page's base-red readings (D2 drift, the `src/cli.ts`-only refactor, a dropped `leak()`) at rc 0 / 25 of 25 on today's harness, then show your guard reds each one, naming only the silent rows.
- Implement exactly the page's Scope. Head output stays byte-equal where the page says it does. Run the base instrument check the page names.
- Plants and routes only in scratch clones (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`). **Never** set git config or attributes in this repository, any worktree, or your real `HOME`; never touch `node_modules/` in main's checkout. Use `/usr/bin/diff` (the shell defines `diff` as a function).
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (counts equal base, 59 / 1994); skip-count capture as spelled → `test-skip-integrity.js`. Heap 128 multi-file, 400 one-file. No timing.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing.

## Fences
- Only the files the page scopes (plus your notes under `../wt-ABC-196/.grugops/context/arch-build-ABC-196/`, which is the context root to pass). No `src/`, `plans/`, `AGENTS.md`, `memory-bank/`, ADRs, other worktrees. Commit on `grugops/ABC-196` only. Never push, merge or `--force`.
- Do not touch the pending file or the claim directory beyond writing your done record.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass the context root explicitly** (named under Fences), never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Notes are append-only; a wrong note gets a superseding note. Record artifacts as `observation` (no §14 gate run, no `finding`).
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |`, exactly 10 cells, as a plain table line. Put it in your done record: append `## Result` to this file and write `.grugops/queue/done/<subtask>.md` + `.claim.md` in main's tree, uncommitted. The Orchestrator appends the trace row and commits records.

## Result (architect-design, 2026-10-22T13:56:00Z): **ABC-196 built as the page scopes, shape (a). A1–A7 met on the builder's read; QE's read is owed. No stop.**

- **Branch:** `grugops/ABC-196` @ `0492a007` in `../wt-ABC-196`, from `main` `a7857e0b`. Two commits:
  - `6d15460b`, the harness;
  - `0492a007`, the notes.
  - Not pushed, not merged.
- **Change:** one file, `.grugops/context/design-F-072-1/probe/r2-mutants.sh` (22 `+` / 12 `−`).
  - Each `TW` row carries its expected limb 2/3 verdicts on its plant: `FIRES FIRES`, and `FIRES "does not fire"` on PP-EDIT.
  - A mismatch goes in `XP`, so exit 0 becomes exit 1, with one new line naming `row:limb`.
  - The header states the guard. Its "never runs as a silent control" promise becomes what `pc` checks.
  - `r2-mutants.out.txt` is untouched: the fixed harness at `0dfd17b3` is byte-equal to it.
- **Readings** (private env, scratch clone outside the repository, head instrument `24b963b14fa4f1bf`):
  - **A2:** base harness D2 / R (`14fea7d4`) / L each rc 0, `25 of 25`.
  - **A3:** the fixed harness exits rc 1 on each. D2 and R name `PP-EDIT:limb2`. L names `PP-TPL`, `PP-REDIR` and `RA-PLUS` on limbs 2 and 3. No other row is named.
  - **A4:** rc 0, `25 of 25`, 177 lines `cmp` byte-equal.
  - **A5:** on the base instrument (`2c0c1985e6607110`), rc 1. The `MISMATCH: RA-PLUS SP-N5` line and the 9-limb `DIFFER` line are identical to base's, plus 1 new line naming the same 9.
  - **A6:** D1/D3/D4/D5 each exit 2, naming the plant.
- **Gates on the tip:**
  - lint, typecheck and build 0;
  - `npm test` 59 / 1994, `last-run.json` success true (= base);
  - skip count 0 → `No findings.`;
  - `biome.json` unchanged.
- **UAT waiver form** (`a7857e0b..0492a007` and `6d15460b~1..6d15460b`): prints nothing. UAT is waived; a waiver is not a signature. A QE hop is owed.
- **Notes**, sealed under `../wt-ABC-196/.grugops/context/arch-build-ABC-196/notes/` and committed on the branch:
  - `20261022T135459Z-architect-design-decision-7cd5d10a`;
  - `20261022T135459Z-architect-design-observation-d955ee60`.
- **Records:** the pending file and the claim directory are untouched; this done record and its `.claim.md` are written uncommitted in main's tree. No git config or attributes were set anywhere.

### Trace row (10 cells, header order)

| ABC-196 (arch-build-ABC-196) | r2-mutants.sh: each TW row (PP-TPL, PP-REDIR, RA-PLUS, PP-EDIT, SP-N5) asserts its expected limb 2/3 verdicts on its plant; a mismatch exits 1 naming row:limb; header states the guard (QE-195-a) | — | — | QE-195-a; AR-193-HUNKHDR (stays closed); ADR-0036 S1 (unchanged); NFR-008 (0 children, 0 rows, no timing); notes …7cd5d10a, …d955ee60 | grugops/ABC-196 @ 0492a007 (harness 6d15460b)<br>.grugops/context/design-F-072-1/probe/r2-mutants.sh (22+/12−) | lint/typecheck/build 0; npm test 59/1994, last-run success; skip 0, No findings; base harness D2/R/L rc 0 25 of 25, fixed rc 1 naming only the silent limbs; head 177 lines byte-equal; base instrument rc 1, same 9 limbs; D1/D3/D4/D5 rc 2 | waiver form prints nothing (0 src lines): UAT waived, not a signature | — | built, ready for QE (In Review is the Orchestrator's move) |
