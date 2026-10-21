---
subtask: qe-ABC-195
role: qe-e2e
ticket: plans/tickets/ABC-195-an-added-line-starting-plus-plus-hides-later-hunks-from-clause-b-and-a-production-file-whose-name-holds-a-space-goes-unseen.md
ref: .grugops/context/qe-ABC-195/
branch: grugops/ABC-195 (tip f9709ed8; harness 5e840c58, code 0dfd17b3, ADR+out 6b0f8575; base 99d07d32); worktree ../wt-ABC-195 (read only)
width: 2 (beside qe-ABC-194)
---

# QE gate for ABC-195 (headers only before a file's first `@@`; one trailing TAB stripped from unquoted header paths; 25-row harness with control twins and a plant check; ADR-0036 § S1 block). Your read closes `AR-193-HUNKHDR` and `AR-193-SPACEPATH`

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha.
- Verify every criterion against the page with your own runs, before opening the Architect's notes (`…6a068acf`, `…1bafd98d` on the branch).
- **Re-plant independently:** the harness against (i) head (25 of 25), (ii) base's instrument (the page's base-red table), (iii) each half-removed copy. Build your own beyond the rows — e.g. `++ ` / `-- ` lines at the first and last line of a hunk, several in one file, in a deleted file, a `+++ b/<other file>` redirect inside a new file, a `diff --git` look-alike line inside a hunk, names with two spaces / a trailing space / a leading space, a name with a space and non-ASCII, a name with a real TAB (must be C-quoted and dispute). Say for each whether head reads right and base was wrong. Check the twins and the plant check really guard against a drifting anchor.
- Plants only in scratch clones (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`). **Never** set git config or attributes in this repository, any worktree, or your real `HOME`; never touch `node_modules/` in main's checkout. Use `/usr/bin/diff`.
- **`ADR-0036` § S1 block:** dated, after ABC-193's, 0 lines edited, consistent with the code; it retires the HUNKHDR stand-in only as far as the instrument now covers it, and states block (i)'s scope exactly (QE-193-c). Note the Architect spelled the heading id in backticks.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 files; base count at your merge); skip-count capture as spelled → `test-skip-integrity.js`. No timing.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing. HUNKHDR stand-in: `git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <tip> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'` prints nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register; say plainly whether AR-193-HUNKHDR's and AR-193-SPACEPATH's close conditions are met.

## Fences
- Work in your own worktree `../wt-qe-ABC-195` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-195 page there.
- No edits to the instrument, harness, ADR, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-194`, `../wt-qe-ABC-194`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-195`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u` (UTC). Append-only; `artifact-ref` needs a §14 gate run, so record artifacts as `observation`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/qe-ABC-195.md` + `.claim.md`, main's tree, uncommitted).

## Result

**PASS_WITH_GAPS.**
- Gaps: `QE-195-a` (LOW proposed); `QE-195-b` and `QE-195-c` (INFO).
- 0 are blocking and none is against a criterion.
- Branch `grugops/qe-ABC-195` @ **`78a52b1c`** (worktree `../wt-qe-ABC-195`, branched at the tip `f9709ed8`). `git merge-tree --write-tree main 78a52b1c` is clean against `main` `0233ee28`.

**Merges of `main`:**
- `f6855262` merged at `fb6d7565`.
- `main` then moved (ABC-194 merged at `0d05f252`, then `0233ee28`), so I merged it again at **`88b03a37`**. Both were merges with no conflict.
- The gates and the 5 harness runs were re-run at `88b03a37`. My own plants and the drift copies ran at `fb6d7565`. Between the two merges `src/` differs only in `src/cli.test.ts`, which `isProduction` excludes.

**Commit `78a52b1c`:** 4 sealed notes and a `## QE` section on the ABC-195 page. There are no other edits.

**Notes.** Sealed by `admitAndAppend` (grugops 2.1.0 plugin cache, task `qe-ABC-195`). The context root was `../wt-qe-ABC-195/.grugops/context`, passed explicitly. `at` came from `date -u`, and the writer returned `findings` `[]` for all 4. There is no `finding`, because there was no §14 gate run.
- `20261021T203404Z-qe-e2e-observation-19f087b9`: A1–A9;
- `20261021T203404Z-qe-e2e-observation-741eebba`: own plants and harness drift copies;
- `20261021T203404Z-qe-e2e-observation-6c531283`: gates, waiver, stand-in, artifacts;
- `20261021T203404Z-qe-e2e-decision-f36a06c3`: the verdict, gap register and close conditions.

**Criteria.** All are my own runs, taken before I opened the Architect's `…1bafd98d`/`…6a068acf`. Those notes agree on every shared number.
- **A1 MET.** 4 Scope files + 2 Architect notes. The waiver prints nothing over the range and for each of the 4 commits.
- **A2 MET.** Base instrument `2c0c1985e6607110`: rc 1, `MISMATCH: RA-PLUS SP-N5`, DIFFER on exactly the 9 limbs.
- **A3 MET.**
  - Without (b): rc 1, `SP-N5`, plus `SP-N5:limb2/3`.
  - Without (a): rc 1, `RA-PLUS`, plus the 7 limbs.
- **A4 MET.**
  - rc 0, 25 of 25. Plant check 1/1/1/1/2 vs 0.
  - The 20 rows (139 lines) are `cmp`-identical across base-harness-on-base and head-harness on base/noA/noB/head.
  - The committed out file equals my run with the ids masked.
  - The clone holds no route; main's status and refs are unchanged.
- **A5 MET.** Every named line and count, by hand (`SP-N5` with no TAB; `:351`/`:352`; `cli.ts:142`; 1 vs 2 files; 0 vs 1 `C-quoted`).
- **A6 MET.** 3 `C-quoted` on both; `PM` `2 -` vs `1 -`.
- **A7 MET.** 3 hunks inside `changedLines`; the `git("diff", …)` line is unchanged.
- **A8 MET.** 43 `+` / 0 `−`; dated, after ABC-193's block; (i)–(v) and the rollback hold. (iii) holds as measured under `GIT_DIFF_OPTS=--unified=5`.
- **A9 MET.** See the gates.

**Close conditions:**
- **`AR-193-HUNKHDR`: MET.** `PP-TPL`/`PP-EDIT`/`PP-REDIR`/`RA-PLUS` fire at head as the table says and are silent (or falsely disputed, `RA-PLUS`) on base, with the 20 rows unchanged.
- **`AR-193-SPACEPATH`: MET.** `SP-N5` FIRES on limbs 1/2/3 at head and is silent on base.
- The Orchestrator records both closes. The stand-in retires at merge (ADR-0036 § S1 (iv)).

**Own plants** (23, own `git clone` with its own `.git`, private env):
- **Head right, base wrong (17):**
  - `++ ` as the only, first or last line of a hunk.
  - Several `++ ` lines over 3 hunks.
  - `-- ` first and last of a removed hunk (`5 -` vs `3 -`).
  - A minus redirect `-- a/src/glyph-mode.ts` (`2 -` vs `1 -`).
  - A new file holding `++ b/src/glyph-mode.ts`: base lists an untouched file.
  - `diff --git` / `@@` look-alikes inside a hunk.
  - Two spaces, a directory ending in a space, a leading space, and space plus non-ASCII, each reached and unreached.
- **Head and base equal and right (6):**
  - A6's two plants.
  - A deleted file holding `-- `/`++ ` redirects.
  - A real TAB (C-quoted, disputes), reached and unreached.
  - A trailing space after `.ts` (not production on either; Node cannot import it), reached and unreached.
- **Drift copies of the harness (5):**
  - Template anchor, `PP-EDIT` template anchor, spaceless `SP-N5`, and a twin keeping `++`: each exits 2.
  - **`PP-EDIT`'s `slice(2)` anchor: exit 0, 25 of 25 → QE-195-a.**

**Gap register:**
- **QE-195-a (LOW proposed).** The `TW` rows assert limbs 2/3 only by equality with `341da4c1` on the twin. The plant check guards only the header-shaped anchor, so drift in `PP-EDIT`'s in-place edit anchor runs silently.
  - Fix shape: assert each `TW` row's expected limb 2/3 verdict, or have `pc` require the capability line.
  - Owner: BA/PM rules; Architect builds.
- **QE-195-b (INFO).** The retiring stand-in also flagged a trailing-space name after `.ts`, which no instrument reads and Node cannot import. Nothing reachable is lost.
- **QE-195-c (INFO).** The ADR heading id is in backticks, matching ABC-193's block. Cosmetic.

**Gates** (at `88b03a37`, the worktree's own `npm ci`):
- Lint, typecheck and build 0.
- `npm test` 0: 59 files / 1994 tests, equal to base at the merge (`main` `0233ee28`). `last-run.json` `success` true, 0 failed / pending / todo.
- Skip-count capture as spelled → `0` → `test-skip-integrity.js`: `No findings.`

**Waiver / stand-in.**
- The UAT waiver form prints nothing over `99d07d32..f9709ed8`, over `99d07d32..88b03a37` and for each commit. UAT is waived (0 `src/` lines); a waiver is not a signature.
- The HUNKHDR stand-in prints nothing over both ranges.

**Fence breach:** none.
- Scratch work was only in the session scratchpad `…/scratchpad/qe195/`, through a wrapper with a private `HOME`/`TMPDIR`/`GIT_CONFIG_GLOBAL` and `GIT_CONFIG_NOSYSTEM=1`.
- Plants lived only in scratch clones with their own `.git`.
- No git config or attributes were set in the repository, any worktree or the real `HOME`. The worktree `node_modules` is its own `npm ci`; main's `node_modules` was not touched.
- One slip: a stray `/tmp/null` from a lint redirect typo was removed at once.
- `../wt-ABC-194`, `../wt-qe-ABC-194` and `../wt-ABC-195` were not touched (`../wt-ABC-195` was read through git only).
- No push, force, amend or rebase, and no merge into `main`.

| ABC-195 (QE) | QE gate: A1–A9 met by own runs at merge 88b03a37; A2 base red = RA-PLUS SP-N5 + 9 limbs; A3 noB = SP-N5 (2 limbs), noA = RA-PLUS (7 limbs); A4 25 of 25, 20 rows byte-equal to base (139 lines); 23 own plants (17 base-wrong, head right on all); 5 harness drift copies: 4 exit 2, PP-EDIT slice(2) anchor drift silent at 25 of 25 | — | — | AR-193-HUNKHDR (close condition met), AR-193-SPACEPATH (close condition met), ADR-0036 § S1, QE-193-c, V1.2.5, NFR-008, QE-195-a (LOW), QE-195-b/c (INFO) | grugops/qe-ABC-195 @ 78a52b1c (merge 88b03a37 = tip f9709ed8 + main 0233ee28)<br>plans/tickets/ABC-195-an-added-line-starting-plus-plus-hides-later-hunks-from-clause-b-and-a-production-file-whose-name-holds-a-space-goes-unseen.md, .grugops/context/qe-ABC-195/notes/ (4) | lint/typecheck/build 0; npm test 59/1994 success; skip-count 0 → No findings; r2-mutants 25/25 | UAT waived (0 src/ lines; waiver form and HUNKHDR stand-in print nothing); not a signature | — | PASS_WITH_GAPS (QE done; In Review exit is the Orchestrator's) |
