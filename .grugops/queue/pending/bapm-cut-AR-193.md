---
subtask: bapm-cut-AR-193
role: ba-pm
tickets: []
branch: main (records only; commit nothing — the Orchestrator commits)
ref: .grugops/context/bapm-cut-AR-193/
width: 1
---

# BA/PM (records only): cut the AR-193-HUNKHDR + AR-193-SPACEPATH fix as one XS/P3 ticket (builder Architect/Design; gates no merge)

## Read first
- Security/NFR result `.grugops/context/security-nfr-QE-193/notes/20261021T183616Z-security-nfr-decision-5719a86d.md`, readings `…c5270049`, and its `probe/` (`repro.sh`, `repro.out.txt`, `fix-prototype.patch`, `r2-fix-vs-head.txt`).
- Orchestrator record `…73e94c9f` (both ARs, the stand-in); QE `qe-ABC-193` `…69c93667`, `…9c7a6680`; `ADR-0036` § S1 (all dated blocks); ABC-193's page as the shape to follow; `.grugops/context/design-F-072-1/probe/clause-b.mjs`, `r2-mutants.sh`.

## Do
- Cut one ticket (next free id ABC-195) holding exactly what `…5719a86d` says the fix must hold: (a) `---`/`+++` (and the C-quoted test) read as headers only between `diff --git ` and that file's first `@@`; (b) strip one trailing TAB from an unquoted header path; (c) harness rows `PP-TPL`, `PP-EDIT`, `PP-REDIR`, `SP-N5`, `RA-PLUS` firing at head and silent on `63eadabe`, the 20 existing rows unchanged; (d) a dated `ADR-0036` § S1 block retiring the stand-in, which also states block (i)'s scope exactly (QE-193-c). Close conditions as Security ruled. `GIT_DIFF_OPTS` handling: optional, your call, never a close term.
- Measure base red on a scratch prototype outside the repository (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`), as `bapm-cut-AR-191` did.
- Size, priority (XS/P3 per Security), DoR score; column Ready if 10/10. One `_Updated:` line at the top of `plans/board.md` and the card.

## Fences
- Only `plans/` (board, the new ticket page) and your notes. No `src/`, instrument, harness, ADR, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config, `node_modules/`. Commit nothing.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-cut-AR-193`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line. Put it in your done record (`.grugops/queue/done/bapm-cut-AR-193.md` + `.claim.md`, main's tree, uncommitted).
