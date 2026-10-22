---
subtask: bapm-rule-QE-189
role: ba-pm
tickets: [ABC-189]
branch: main (records only; commit nothing, the Orchestrator commits)
ref: .grugops/context/bapm-rule-QE-189/
width: 3 (beside qe-ABC-178b and ticket-to-pr-ABC-198)
---

# BA/PM (records only): rule QE-189-a (LOW proposed) and QE-189-b/-c (INFO) from ABC-189's QE gate. ABC-189 is merged; this gates nothing

## Read first
- QE `.grugops/context/qe-ABC-189/notes/` in main's tree (merged; verdict `…b2012318`) and the `## QE` section on ABC-189's page.
- ABC-189's page; Security/NFR `security-nfr-ABC-168` `…75a45be0` § 5 (AR-168-BINPIN and its packaging trigger); ABC-168's page (A7, `dist/`); `tsconfig.build.json`; the owner delegation `…5aaf7cec`.

## Do
- **QE-189-a:** the pin checks `bin`'s text, not that the build emits that file. Changing `tsconfig.build.json` `outDir` to `build` passes every gate while `bin` names a missing `dist/uci.js`. Rule cut (an XS test-only pin, e.g. `outDir` plus the `bin` target exist after `npm run build`, or a check that reads `tsconfig.build.json`) / fold (into the packaging ticket AR-168-BINPIN's trigger would pull, if one exists) / accept with a reopen trigger. Weigh it against the ABC-168 A7 lane, which already builds `dist/`: does any existing row read `dist/uci.js` after a build? Measure on a scratch copy if you cut (no vitest in main's checkout; one-file runs in scratch only). Next free id **ABC-199**.
- QE-189-b (the pin is stricter than npm) and QE-189-c (no test reads the lock root's `bin`): agree INFO, or say why not.
- If anything is cut, one `_Updated:` line at the top of `plans/board.md` and the card. Otherwise only a dated line on ABC-189's page.

## Fences
- Only `plans/` and your notes (context root: this repository's `.grugops/context`). No `src/`, `tsconfig*`, `package*.json`, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config. Commit nothing. Touch no board card except a new one.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-189`). Every `at` from `date -u`. Include a `kind: decision`.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/bapm-rule-QE-189.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.
