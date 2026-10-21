---
subtask: bapm-cut-AR-191
role: ba-pm
tickets: []
branch: main (records only; commit nothing — the Orchestrator commits)
ref: .grugops/context/bapm-cut-AR-191/
width: 1
---

# BA/PM (records only): cut the AR-191-GITENV fix, with AR-191-QUOTEPATH folded in, as one XS/P3 ticket (builder Architect/Design; gates no merge)

## Read first
- Security/NFR result `.grugops/context/security-nfr-QE-191-a/notes/20261021T165304Z-security-nfr-decision-7c1f3590.md` and readings `…62620bb0`; its `probe/` (`RUN.txt`, `standin.sh`, plant scripts).
- Orchestrator record `…eb401873` (both ARs, the stand-in, the dispute-line rule).
- QE `qe-ABC-191` gap register `…9bc0b262`; `ADR-0036` § S1 (all dated blocks); ABC-191's page as the shape to follow; `.grugops/context/design-F-072-1/probe/clause-b.mjs`, `r2-mutants.sh`.

## Do
- Cut one ticket (next free id ABC-193) holding exactly what `…7c1f3590` says the fix must hold: (a) the one diff call gains `--no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/`; every instrument git call runs with `-c core.quotePath=false`; (b) harness rows with addition plants for `color.diff=always`, `diff.external`, `GIT_EXTERNAL_DIFF`, `diff.<drv>.command` + attribute, `diff.srcPrefix`/`dstPrefix`, plus QU and QE2 — each FIRES at head and is silent on the `837e8b22` instrument; (c) a dated `ADR-0036` § S1 block retiring the GITENV stand-in. Close conditions for both ARs as Security ruled.
- Measure base red on a scratch prototype outside the repository with a private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR` where you can (as `bapm-cut-AR-188-BINARY` did). Never set git config or attributes in this repository or any worktree.
- **Out of scope:** the `AGENTS.md` UAT waiver form (`git -c core.quotePath=false diff --name-only …`) — that is the owner's text and his open call; name it on the page as owed outside the fence.
- Size, priority (XS/P3 per Security), DoR score; column Ready if 10/10. One `_Updated:` line at the top of `plans/board.md` and the card.

## Fences
- Only `plans/` (board, the new ticket page) and your notes. No `src/`, instrument, harness, ADR, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config. Commit nothing.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-cut-AR-191`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line. Put it in your done record (`.grugops/queue/done/bapm-cut-AR-191.md` + `.claim.md`, main's tree, uncommitted).
