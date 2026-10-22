---
subtask: qe-ABC-193
role: qe-e2e
ticket: plans/tickets/ABC-193-git-config-or-environment-can-blind-clause-bs-one-diff-call-and-a-non-ascii-production-file-goes-unseen.md
ref: .grugops/context/qe-ABC-193/
branch: grugops/ABC-193 (tip 3d734fa1; harness e6f91f1d, code 63eadabe, ADR+out 6b83874c; base 47a3c9a1); worktree ../wt-ABC-193 (read only)
width: 2 (beside qe-ABC-192)
---

# QE gate for ABC-193 (diff call immune to config/env routes; `-c core.quotePath=false` on every git call; still-quoted paths fire as disputes; 20-row harness; ADR-0036 § S1 block). Your read of A2–A7 closes `AR-191-GITENV` and AR-191-QUOTEPATH's instrument half

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha.
- Verify every criterion A1–A9 (incl. the by-hand A6) against the page with your own runs, before opening the Architect's notes (`…2b7be2e6`, `…c1511dfb` on the branch).
- **Re-plant independently:** the harness against (i) head (20 of 20), (ii) base's instrument (fails on exactly the 7 rows), (iii) each part-removed copy (the page's table). Build your own routes beyond the harness rows — e.g. `color.ui=always`, `GIT_CONFIG_COUNT`/`GIT_CONFIG_KEY_0` injection, a global attributes file with a `diff=<drv>` command, `diff.mnemonicPrefix`, `diff.noprefix`, `GIT_DIFF_OPTS`, other quoted names (newline, backslash, non-ASCII + `"`) — and say for each whether head fires and base is blind. Also probe R-193-a (a hunk line beginning `-- "` / `++ "`): does it really raise a false dispute, and is it only ever on the safe side?
- **Every route only inside scratch clones** with their own `.git` and private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`, or a run's own environment. **Never** in this repository, any worktree (they share one `.git/config`), or your real `HOME`. Run the stand-in below before you finish.
- **`ADR-0036` § S1 block:** dated, after ABC-191's, 0 lines edited, consistent with the code; it retires the GITENV stand-in only as far as the instrument now covers it.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 files; base count at your merge); skip-count capture as spelled → `test-skip-integrity.js`. No timing. Note `/usr/bin/diff` (this host's shell defines `diff` as a function).
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing. AR-191-GITENV stand-in, in your shell and worktree: `git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF` prints nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register; say plainly whether AR-191-GITENV's close condition is met and whether AR-191-QUOTEPATH's instrument half is met.

## Fences
- Work in your own worktree `../wt-qe-ABC-193` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-193 page there.
- No edits to the instrument, harness, ADR, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-192`, `../wt-qe-ABC-192`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-193`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u` (UTC). Append-only; `artifact-ref` needs a §14 gate run, so record artifacts as `observation`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/qe-ABC-193.md` + `.claim.md`, main's tree, uncommitted).

## Result

**PASS_WITH_GAPS.**
- Gaps: `QE-193-a` (LOW proposed), `QE-193-b` (MEDIUM proposed), `QE-193-c`/`-d`/`-e` (INFO).
- 0 are blocking and none is against a criterion. Each predates the ticket (it is there on base's instrument) or is fail-safe.
- Branch `grugops/qe-ABC-193` @ **`d20a70d5`** (worktree `../wt-qe-ABC-193`, branched at the tip `3d734fa1`).

**Merges of `main`.**
- `a4561a26` was merged at **`f33eb318`** (no conflict), and every criterion was run there.
- During the run `main` moved to `c4bce2b1`: `ABC-192` merged at `7a2ec8bc` and `src/cli.test.ts` gained 98 lines. A9 names that merge's counts, so I merged again at **`0222d54d`** (no conflict).
- I re-ran A1–A7, the gates, the stand-in and every own route at `0222d54d`. The results are identical once plant ids are masked.
- `git merge-tree --write-tree c4bce2b1 d20a70d5` is clean.

**Commit `d20a70d5`:** 4 sealed notes and a `## QE` section on the ABC-193 page. There are no edits to the instrument, the harness, the ADR, `src/`, `AGENTS.md`, the board, the trace or other pages.

**Notes.**
- How they were sealed: `admitAndAppend`, grugops 2.1.0 plugin cache, task `qe-ABC-193`.
- The context root, passed explicitly, was `../wt-qe-ABC-193/.grugops/context`. Each `at` came from `date -u`.
- The writer returned `findings` `[]` for all 4. There is no `finding`, because there was no §14 gate run.
- The notes:
  - `20261021T182104Z-qe-e2e-observation-dfb6a6c3`: A1–A9;
  - `20261021T182104Z-qe-e2e-observation-9c7a6680`: re-plants, own routes, names, R-193-a;
  - `20261021T182104Z-qe-e2e-observation-1cf412e5`: gates, waiver, stand-in, artifacts;
  - `20261021T182104Z-qe-e2e-decision-69c93667`: the verdict and gap register.

**Criteria.** All are my own runs, taken before I opened the Architect's `…2b7be2e6`/`…c1511dfb`. Those notes agree on every number they share.
- **A1 MET.** `main...HEAD` holds the 4 Scope files plus 2 Architect notes. The waiver prints nothing over the range, for each commit and for each merge.
- **A2 MET.** Base's instrument (`d3abb847…`) exits 1, with `MISMATCH: G-COLOR G-EXT G-ENV G-DRV G-PFX QU QE2` and DIFFER on exactly those 14 limbs. The 12 old rows and `ADD` read `ok`/`identical`.
- **A3 MET.** Every copy reads the page's red set: `noQP` gives `QU QE2`/4 limbs; no flags gives 5 rows/10; `--no-color` gives `G-COLOR`/2; `--no-ext-diff` gives 3 rows/6; no prefixes gives `G-PFX`/2. No `--dst-prefix` gives DIFFER only, on `G-PFX`'s 2 limbs. No `--src-prefix` gives rc 0. My own no-(c) copy also gives rc 0.
- **A4 MET.** rc 0, 20 of 20. The 12 rows are byte-identical to base's (83 lines). There is no route left in the clone, and the repository is unchanged. The output equals the committed `r2-mutants.out.txt` with ids masked. A mutated harness that leaves `color.*` behind exits 2, so the guard bites.
- **A5 MET.** `2 + lines, 0 - lines` and `capability: 1` on all 8 new rows, with `src/qé.ts` unquoted. Limb 3 does not fire on `QU` only.
- **A6 MET.**
  - `PFX-X1`: head reads `1 + line, 3 - lines`; base reads `production files changed: 0` and does not fire; the no-src copy reads `1/0`; the no-dst copy reads `0/3`.
  - `CQ1`/`CQT`/`CQ2` are disputed at head on limbs 1 and 3, with the name as git prints it. Base and the no-(c) copy are silent.
  - `CQS` is silent.
- **A7 MET.** 87 calls, all 87 beginning `-c core.quotePath=false`, and 87 on base. One `diff` with the page's argv. `execFileSync` with an array and no shell.
- **A8 MET.** 34 `+` and 0 `−`. The block is dated 2026-10-21, sits after `ABC-191`'s, and is consistent with `63eadabe`/`11245e3d`. The stand-in it retires checks five things, and the instrument now covers each of them.
- **A9 MET.** At `0222d54d`, 59/1994 equals `ABC-192`'s merge (at `f33eb318` it was 59/1992, base's). The skip count is 0, and `biome.json` is unchanged.

**Own routes** (scratch clones, private `HOME`/`TMPDIR`/`GIT_CONFIG_GLOBAL`, `GIT_CONFIG_NOSYSTEM=1`):
- **Head byte-identical to route-off, base blind** (does not fire on limbs 1 and 3):
  - `color.ui=always`;
  - global `color.diff=always`;
  - `GIT_CONFIG_COUNT` colour, external and prefixes;
  - `GIT_CONFIG_PARAMETERS` colour and external;
  - a global `core.attributesFile` with `diff=drv` + `command`;
  - a worktree `.gitattributes` with `diff=drv` + `command`.
- **Harmless on both:** `diff.mnemonicPrefix`, `diff.noprefix`, `diff.context`, `diff.interHunkContext`, `diff.algorithm=patience`, `diff.relative`, and `textconv` + attribute.
- **`GIT_DIFF_OPTS=--unified=5`:** it overrides `-U0`, and the counts inflate to `7/5` on both (fail-safe; `QE-193-c`).
- **`core.quotePath=true`** (local, `GIT_CONFIG_COUNT` or `GIT_CONFIG_PARAMETERS`) on `QU`: head is unchanged, because the command-line `-c` wins.
- **Quoted names:** newline, backslash, `é`+`"`, a deleted quoted file, and a non-production `src/q"t.md` are all disputed at head and silent on base.
- **Space name:** `src/q t.ts`, unreached or reached gaining `node:fs`+`fetch`, is silent at head and at base (`QE-193-a`).

**R-193-a:** confirmed. A `-- "`/`++ "` hunk line is a false dispute on all 3 limbs at head, and head against the no-(c) copy differs only by the dispute lines and the verdict. So it is only ever on the safe side. Its pre-existing sibling is not (`QE-193-b`): an added `++ ` line, lint-clean in a template literal, blinds limbs 2 and 3 for later hunks of that file, at head and at base.

**Gates at `0222d54d`:**
- lint 0 (116 files), typecheck 0, build 0.
- `npm test` 0: 59 files, 1994/1994. `last-run.json` reads `success` true, `exitCode` 0, 0 failed, 0 pending, 0 todo.
- Skip count (as spelled) is 0. `test-skip-integrity.js --skip-count 0` reads `No findings.`, rc 0.
- Comparisons used `/usr/bin/diff`. No timing.

**UAT waiver:** the owner's form printed nothing over `47a3c9a1 3d734fa1`, for each of the 4 commits, for each merge and for `d20a70d5`. WAIVED (0 production lines); not a signature.
**AR-191-GITENV stand-in:** it printed nothing in my shell and worktree. No git config was set in the repository, any worktree or the real `HOME`.

**AR-191-GITENV:** the close condition is MET. **AR-191-QUOTEPATH:** the instrument half is MET as written. The waiver half is already on `main` (`4f81850c`). `QE-193-a` is a sibling the close term does not reach; I recommend carrying it as its own risk.

**Gap register:**
- **QE-193-a (LOW proposed).** A production path with a space is unseen: git appends a TAB to the `---`/`+++` header. Owner: Security/NFR rates, BA/PM cuts.
- **QE-193-b (MEDIUM proposed).** An added line starting `++ ` resets the header parse, so a later-hunk `fetch` or `process` read is silent on limbs 2 and 3. Fix shape: headers only before the first `@@`. Owner: Security/NFR rates, BA/PM cuts.
- **QE-193-c (INFO).** `GIT_DIFF_OPTS` overrides `-U0` (over-count only). ADR (i)'s "environment" wording is broader than the flags cover.
- **QE-193-d (INFO).** ADR (v) says the waiver form is "still owed", but it is on `main` since `4f81850c`. For the Orchestrator's close record; no ADR edit.
- **QE-193-e (INFO).** A C-quoted non-production path also disputes (fail-safe).

**Fence breach:** none of the brief's fences, but I made one error outside them, now repaired.
- A `ln -s` of mine in a scratch clone ran on a stale clone link and failed with "File exists". It wrote nothing.
- While cleaning up, I deleted the pre-existing self-link `../cli-chess-example/node_modules/node_modules -> …/cli-chess-example/node_modules`, dated Oct 17 and not mine.
- I recreated it at once with the same target and the same mtime (`touch -h -t 202610171530`). It is not tracked by git.

Everything else:
- Scratch work: only in the new `…/scratchpad/qe193/`.
- Worktree `node_modules` is the house symlink (excluded).
- I did not touch `../wt-ABC-193`, `../wt-ABC-192` or `../wt-qe-ABC-192`.
- No push, force, amend or rebase, and no merge into `main`.

| ABC-193 (QE) | QE gate: A1–A9 met by own runs at merges f33eb318 and 0222d54d; A2 base red on exactly 7 rows/14 limbs, A3 each part's red set, A4 20/20 with 12 rows byte-equal to base; A6 PFX-X1 + CQ1/CQT/CQ2/CQS by hand; A7 87/87 calls carry -c, one diff argv; 9 own config/env routes (head =off, base blind) + 7 harmless + GIT_DIFF_OPTS; R-193-a safe-side only | — | — | AR-191-GITENV (close condition met), AR-191-QUOTEPATH (instrument half met), ADR-0036 S1, R-193-a, F-095-1, V1.2.5, NFR-008, QE-193-a (LOW), QE-193-b (MEDIUM), QE-193-c/d/e (INFO) | grugops/qe-ABC-193 @ d20a70d5 (merge 0222d54d = tip 3d734fa1 + main c4bce2b1)<br>plans/tickets/ABC-193-git-config-or-environment-can-blind-clause-bs-one-diff-call-and-a-non-ascii-production-file-goes-unseen.md, .grugops/context/qe-ABC-193/notes/ (4) | lint/typecheck/build 0; npm test 59/1994 success; skip-count 0 → No findings | UAT waived (0 production lines; quotePath waiver form prints nothing; GITENV stand-in prints nothing); not a signature | — | PASS_WITH_GAPS (QE done; In Review exit is the Orchestrator's) |
