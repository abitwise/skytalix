---
subtask: arch-build-ABC-191
role: architect-design
tickets: [ABC-191]
branch: grugops/ABC-191 (from main @ the main tip at your start); worktree ../wt-ABC-191
ref: .grugops/context/arch-build-ABC-191/
width: 3 (beside ticket-to-pr-ABC-176 and bapm-epic007-confirm; disjoint files)
---

# Architect (builder): ABC-191 — clause (b)'s one diff call reads `--text --no-textconv`; `r2-mutants.sh` gains `BIN-NUL` and `BIN-ATTR`; `.out.txt` regenerated; `ADR-0036` § S1 dated block retiring the `--numstat` stand-in. Closes `AR-188-BINARY` on QE's read. ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-191-a-production-file-git-treats-as-binary-hides-every-changed-line-from-clause-b.md`: every criterion, § Scope (four files), § Out of scope, § Test notes.
- BA/PM notes in `.grugops/context/bapm-cut-AR-188-BINARY/notes/` (`…d4004b45` scratch readings, `…2edce8cb` the cut); Security/NFR `…f5843a71`; owner record `…9f5ca4b4`; `ADR-0036` § S1 (incl. the ABC-188 block); ABC-188's harness and its done records.
- `AGENTS.md`, and `memory-bank/45-standing-rulings.md` for the gate rules.

## Do
- Create the worktree `../wt-ABC-191` on `grugops/ABC-191` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- **Red first:** run the 12-row harness against base's instrument; it must fail on exactly `BIN-NUL` and `BIN-ATTR` (page). Show each flag alone falls short, as the page states.
- Implement exactly the page's Scope. The 10 `ABC-188` rows unchanged; limbs 2/3 compared as the page's table says.
- Note the `.gitattributes` plant: build it only in scratch/plant checkouts; never commit a `.gitattributes` to `grugops/ABC-191` and never leave `.git/info/attributes` edited in any shared git dir (worktrees share `.git/info`). Report if you touched it at all.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (counts equal base, 59 / 1987 at last merge); skip-integrity `--skip-count 0`. Heap 128 multi-file (as `npm test` sets), 400 for one-file runs. No timing.
- UAT waiver in AGENTS.md's form (must print nothing), and the AR-188-BINARY stand-in `git diff --numstat <base> <tip> -- src | awk '$1=="-"'` (must print nothing).

## Fences
- Only the four files the page scopes (plus your own notes and done record). No `src/`, `biome.json`, `plans/`, `AGENTS.md`, other worktrees. Commit on `grugops/ABC-191` only. Never push or merge. No `--force` on any git command.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree (or, for records-only hops, this repo root) as the context root explicitly** — never the plugin dir. Take every `at` from `date -u` (UTC, never local time). Include a `kind: decision`. `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Task `arch-build-ABC-191`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, `—` for empty, `\|` for a literal pipe. Put it in your done record; the Orchestrator appends it.

## Result

**Tip `797a238b`** (`797a238b15a5b5eb4ea6cbc786354c5de54694b9`) on `grugops/ABC-191`, worktree `../wt-ABC-191`, from `main` `01836fff`. Not pushed, not merged. `main` has since moved to `f6a31f42` (records only, EPIC-007); no file overlap.
- **Commits:**
  - `56d7215f`: the harness only (`BIN-NUL`, `BIN-ATTR`, the X1 reference and `mask`), so the red run comes first.
  - `11245e3d`: the instrument, one argv (`--text --no-textconv`). This is the code commit; A4 ran at this tip. sha-256 `d3abb8478f9e372e…` = BA/PM's prototype.
  - `6b79aa51`: the `ADR-0036` block, and `r2-mutants.out.txt` = the A4 run.
  - `797a238b`: 2 sealed notes.
- **Files:** `git diff --name-only main...HEAD` = the 4 Scope files plus `.grugops/context/arch-build-ABC-191/notes/` (2). `src/`, `biome.json`, `plans/`, `AGENTS.md` and `.gitattributes` untouched.
- **Verdict: built, A1–A9 met on the builder's read.** QE's read of A2–A7 is owed; `AR-188-BINARY` closes on that read.

| | result |
|---|---|
| A1 | MET: 4 Scope files plus this hop's notes (ignored per `QE-182-d`). The waiver pipe is empty |
| A2 | MET (run first, harness `56d7215f`, base `clause-b.mjs` copy `55641c55…`): rc **1**, `limb 1 MISMATCH: BIN-NUL BIN-ATTR`, `limbs 2/3 DIFFER … : BIN-NUL:limb2 BIN-NUL:limb3 BIN-ATTR:limb2 BIN-ATTR:limb3`; the 10 existing rows `ok`, 20 `identical` |
| A3 | MET: `--no-textconv` only: rc **1**, the same 2 rows and 4 limbs. `--text` only: rc **0**, 12/12; on `TXC` it reads `6 + lines, 12 - lines` |
| A4 | MET: rc **0**, `12 of 12 limb-1 rows as expected; limbs 2 and 3 identical to 341da4c1 on the same plant on 10 of 10, and to 341da4c1 on X1 (plant ids masked) on BIN-NUL and BIN-ATTR`. The 10 rows equal the prior output with ids masked. Status, `HEAD`s and refs unchanged (worktree and main checkout) |
| A5 | MET: `BIN-NUL` `2 + lines, 4 - lines`; `BIN-ATTR` `1 + line, 3 - lines` (X1's) |
| A6 | MET: `TXC` `14bb3ed4`, clone-local `diff.bin.textconv`. Head FIRES `1 + line, 3 - lines`; base `6 + lines, 12 - lines`. Limbs 2/3 equal `341da4c1` on X1, masked, on both |
| A7 | MET: shim on `BIN-NUL`: 1 `diff` call, `diff -U0 --no-renames --text --no-textconv 11245e3d 8e0795d0 -- src`; 87 git calls, base 87; `execFileSync` argv, no shell (`V1.2.5`) |
| A8 | MET: ADR diff 22 `+` / 0 `−`; the block after the `ABC-188` block states (i)–(iii) and the rollback (revert `11245e3d`, the stand-in returns) |
| A9 | MET: see the gates |

**Gates at `6b79aa51`** (`797a238b` adds notes only):
- lint rc 0 (116 files); typecheck rc 0; build rc 0.
- `npm test` rc 0, 59 files / 1987 tests. `last-run.json`: `success` true, 0 failed, 0 pending, 0 todo. Equal to base.
- Skip count 0. `test-skip-integrity.js --skip-count 0`: `No findings.`
- Heap 128, set by `npm test`. No timing was taken.

**UAT waiver** (AGENTS.md form, unfiltered): `git diff --name-only <c>~1 <c> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing for `56d7215f`, `11245e3d`, `6b79aa51` and `797a238b`, and over `main...HEAD`. 0 `.snap` changed.
**`AR-188-BINARY` stand-in:** `git diff --numstat 01836fff 797a238b -- src | awk '$1=="-"'` prints nothing (0 `src` numstat lines at all).

**`.gitattributes` / `.git/info/attributes`:** a `.gitattributes` existed only in the harness's and A6's scratch clones (own `.git` dirs under the session scratchpad). `.git/info/attributes` was never created or edited anywhere; main's `.git/info/` holds `exclude` and `refs` only.

**Residuals (INFO, none against a criterion):** `R-191-a`: `BIN-ATTR` is 8 chars against the `%-7s` pad, so its header line loses one space; cosmetic. `R-188-b` carries over (file-list check only; the NUL byte was read by `od -c`). `core.attributesFile` with `-diff` not planted (`UNKNOWN - verify`; `--text` does not consult the source).

`node_modules` in the worktree is a symlink, git-ignored via `.git/info/exclude`.

**Notes (sealed, in the worktree, committed on the branch):** `.grugops/context/arch-build-ABC-191/notes/20261021T162507Z-architect-design-decision-0c4ec0c5.md`, `…20261021T162500Z-architect-design-observation-7eb389c5.md`.

**Trace row (for the Orchestrator to append):**

| ABC-191 (Architect build) | built the AR-188-BINARY fix: clause-b.mjs's one diff call reads --text --no-textconv; r2-mutants.sh at 12 rows (BIN-NUL, BIN-ATTR FIRE; their limbs 2/3 vs 341da4c1 on X1, plant ids masked); out.txt regenerated; ADR-0036 § S1 dated block retires the --numstat stand-in at merge | — | — | AR-188-BINARY (fix built; closes on QE's read), QE-188-a, ADR-0036 § S1, V1.2.5, NFR-008 0/0/0, R-191-a, R-188-b (INFO) | grugops/ABC-191 @ 797a238b (code 11245e3d)<br>.grugops/context/design-F-072-1/probe/clause-b.mjs, r2-mutants.sh, r2-mutants.out.txt; memory-bank/50-decisions/ADR-0036-…md; 2 notes | A2 rc 1 BIN-NUL BIN-ATTR + 4 limbs; A3 --no-textconv rc 1 as A2, --text rc 0 but TXC 6/12; A4 rc 0 12/12; A5 2/4, 1/3; A6 TXC 1/3 (base 6/12); A7 1 diff call, 87 = base; lint/typecheck/build rc 0; npm test 59/1987 = base; skips 0; integrity No findings; numstat stand-in empty | UAT waived (0 production lines; pipe empty per commit and over the range) | — | built, A1–A9 met; In Development → In Review is the Orchestrator's move; QE hop owed (A2–A7) |
