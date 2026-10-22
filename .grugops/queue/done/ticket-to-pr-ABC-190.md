---
subtask: ticket-to-pr-ABC-190
role: software-engineer
tickets: [ABC-190]
branch: grugops/ABC-190 (from main @ the main tip at your start); worktree ../wt-ABC-190
ref: .grugops/context/ticket-to-pr-ABC-190/
width: 3 (beside the other two hops of this wave; disjoint files)
---

# SE: ABC-190. Regenerate `package-lock.json` (`npm install --package-lock-only --ignore-scripts`) so the lock root carries `license` and `bin`. That one file only; ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-190-the-lock-root-lacks-the-license-and-bin-that-package-json-carries.md`: every criterion, § Scope, § Out of scope, § Test notes, and every source note it cites.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`, the owner delegation `.grugops/context/owner-delegation-2026-10-22/notes/20261022T140148Z-orchestrator-decision-5aaf7cec.md`.

## Do
- Create the worktree `../wt-ABC-190` on `grugops/ABC-190` from the current `main` (`ABC-168` is merged at `513c0211`; main is at or after `14b840cc`). A `node_modules` symlink is fine for gates.
- Run the page's command exactly, in your worktree only (never in main's checkout). The diff must be exactly what the page measures (numstat `4 0`, root metadata only, no dependency/version/integrity line). If it is anything else, stop and report with the diff.
- `npm ci --ignore-scripts --dry-run` (or the page's equivalent) reads the new lock cleanly. Record `npm audit` counts before and after: unchanged, and AR-1 is NOT re-stated (Release Manager's).
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (base count at your start, 60 / 1995, plus any rows the page adds); skip-count capture as spelled → `test-skip-integrity.js`. Heap 128 multi-file, 400 one-file. No timing claims.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing.

## Fences
- Only the files the page scopes, plus your notes in `../wt-ABC-190/.grugops/context/ticket-to-pr-ABC-190/` (the context root to pass). No other file, no `plans/`, `AGENTS.md`, `memory-bank/`, git config, `node_modules/` in main's checkout, other worktrees. Commit on `grugops/ABC-190` only. Never push, merge or `--force`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). Pass the context root named under Fences explicitly, never the plugin dir. Every `at` from `date -u` (UTC). Include a `kind: decision`. Append-only; artifacts as `observation`.
- Trace row (10 cells, plain table line: `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |`) in your done record `.grugops/queue/done/<subtask>.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave the pending file and the claim directory alone.

## Result

**Delivered.** Branch `grugops/ABC-190`, tip **`d79f4684`**, from `main` `823a9885` (holds `ABC-168` `513c0211`). There are two commits: `15766056` (the lock) and `d79f4684` (the SE notes). Nothing was pushed or merged, and no timing was taken.
The notes are sealed with `admitAndAppend`, and each reads back `sealVerdict` ok. They are in `../wt-ABC-190/.grugops/context/ticket-to-pr-ABC-190/notes/`: decision `…723e5ad8`, plus observations `…a451fa4c` (artifact, A1–A3, audit) and `…c86e3c83` (gates). They are **committed on the branch**, because A2 excludes `.grugops/` from its `--name-only` reading.

### The lock diff (`15766056`, the only non-notes file)
`git diff --numstat main...HEAD -- package-lock.json` gives `4	0	package-lock.json`:
```
@@ -7,6 +7,10 @@
     "": {
       "name": "skytalix",
       "version": "0.0.0",
+      "license": "UNLICENSED",
+      "bin": {
+        "skytalix": "dist/uci.js"
+      },
       "devDependencies": {
```
The command was `npm install --package-lock-only --ignore-scripts`, run with npm 11.20.0 and node v26.11.1 in the worktree only. Nothing was hand-edited.

### Per criterion
| crit | result |
|---|---|
| A1 | **MET**. `4	0`. The lines are exactly `license` plus the 3-line `bin` under `packages[""]` |
| A2 | **MET**. The `version\|resolved\|integrity` grep gives 0. `--name-only main...HEAD` without `.grugops/` lists only `package-lock.json` |
| A3 | **MET**. In a fresh clone of the tip (scratchpad): `npm ci --ignore-scripts --dry-run` rc 0, and `npm ci --ignore-scripts` rc 0. `git status --porcelain` is empty. A second regeneration exits rc 0 and adds no diff |
| A4 | **MET**. lint 0 (119 files), typecheck 0, build 0. `npm test` exits 0 with 60/1995 passed, the same as base. `last-run.json` shows success true, pending 0, todo 0. The skip-count capture (heap 128) gives 0, and `test-skip-integrity.js` reports `No findings.` with exit 0 |

### npm audit
The audit is the same before and after: the `vulnerabilities` object is byte-identical under `jq -S`. Counts are info 0, low 0, moderate 4, high 3, critical 0, total 7. AR-1 is not re-stated here, because it is the Release Manager's.

### UAT waiver form
`git -c core.quotePath=false diff --name-only 823a9885 d79f4684 | grep -v '\.test\.ts$' | grep '^src/'` prints nothing, and so does the `823a9885 15766056` range. There are zero production lines.

### Owed
- A QE hop (A1–A3).
- After it, a Security/NFR clause (a) hop. It closes QE-172-a on merge.

### Trace row
| ABC-190 (ticket-to-pr-ABC-190) | lock root regenerated: `license` + `bin` (QE-172-a, ABC-168 bin drift) | EPIC-007 | — | QE-172-a; Security/NFR …216ceb43, …75a45be0; audit unchanged 4 mod / 3 high (AR-1 not re-stated) | grugops/ABC-190 @ d79f4684 (lock 15766056)<br>package-lock.json (+4 −0) | lint/typecheck/build green; npm test 60/1995 = base; skips 0, No findings.; A1 4 0; A2 0; A3 npm ci rc 0, clean, idempotent | UAT waived (0 production lines) | — | In Development → In Review |
