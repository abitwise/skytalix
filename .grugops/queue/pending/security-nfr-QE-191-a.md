---
subtask: security-nfr-QE-191-a
role: security-nfr
tickets: [ABC-191]
branch: main (read only; records only — commit nothing, the Orchestrator commits)
ref: .grugops/context/security-nfr-QE-191-a/
width: 2 (beside qe-ABC-176)
---

# Security/NFR (short read): rate QE-191-a — operator config/environment that can still blind clause (b)'s one diff call. ABC-191 is merged; this gates nothing already merged

## Read first
- QE gap register `.grugops/context/qe-ABC-191/notes/20261021T164012Z-qe-e2e-observation-9bc0b262.md` (QE-191-a/-b/-c) and verdict `…16ba4076`; Orchestrator merge/close `…7f7588a5`.
- Your own `…f5843a71` (AR-188-BINARY), `ADR-0036` § S1 (all dated blocks), `.grugops/context/design-F-072-1/probe/clause-b.mjs`.

## Do
- Rate QE-191-a (external diff driver via `diff=<drv>` + `diff.<drv>.command`; `GIT_EXTERNAL_DIFF`; `color.diff=always`; `diff.srcPrefix`/`dstPrefix`): reachable by whom, on which checkout the Orchestrator routes from, with what effect. You may reproduce in a scratch clone with its own `.git` and a private `TMPDIR`/`HOME`/`GIT_CONFIG_GLOBAL`.
- Rule: accept (with owner and trigger), or open an AR and say what a fix ticket must hold (QE's untried flags: `--no-ext-diff`, `--no-color`, `--src-prefix=a/ --dst-prefix=b/`). Say whether any of it should be measured by hand at merges until fixed (a stand-in), or not.
- Glance at QE-191-b (non-ASCII names, INFO): agree or re-rate.

## Fences
- Read only on the repository: no edits to `src/`, the instrument, harness, ADRs, `AGENTS.md`, `plans/`. Never edit this repository's or any worktree's git config or `.git/info/attributes`. Do not touch `../wt-ABC-176`, `../wt-qe-ABC-176`.
- Your notes go into main's tree under `.grugops/context/security-nfr-QE-191-a/`, uncommitted.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `security-nfr-QE-191-a`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision` with your result. A `finding` needs a §14 gate stamp; if you have none, record it as a decision or observation.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells. Put it in your done record (`.grugops/queue/done/security-nfr-QE-191-a.md` + `.claim.md`, main's tree, uncommitted).
