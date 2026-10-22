---
subtask: bapm-rule-QE-196
role: ba-pm
tickets: [ABC-196]
branch: main (records only; commit nothing, the Orchestrator commits)
ref: .grugops/context/bapm-rule-QE-196/
width: 2 (beside qe-ABC-178, which may be taking timing; take no timing and run no vitest)
---

# BA/PM (records only): rule QE-196-a (LOW proposed) from ABC-196's QE gate. ABC-196 itself is not gated by this

## Read first
- QE verdict and gap register: `../wt-qe-ABC-196/.grugops/context/qe-ABC-196/notes/` (the current verdict `…decision-df052eb2` supersedes `…fd211043`), and the `## QE` section on ABC-196's page in that worktree. QE's R3 drift clone and run outputs: `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe196/` (read only).
- Your own `bapm-rule-QE-195` notes (`…f0144de0`, `…466ee18d`); ABC-196's page; `ADR-0036` § S1.
- The owner delegation `.grugops/context/owner-delegation-2026-10-22/notes/20261022T140148Z-orchestrator-decision-5aaf7cec.md`. You rule LOW gaps yourself; nothing here goes to the owner.

## Do
- **QE-196-a:** a mergeable `src/cli.ts`-only refactor (R3: `main` as an arrow `const`, `printableOf` below it) leaves the fixed harness at 25 of 25. PP-EDIT still reads FIRES, but on a line the pre-ABC-195 instrument also sees, so PP-EDIT's part of AR-193-HUNKHDR goes silent. The other three `++` rows still cover the class. Rule cut / fold / accept, giving the reason. Weigh it against QE-195-a's cut and against diminishing returns: the guard keeps growing to chase drift in one harness. QE's unmeasured shapes: twin rows require the pre-ABC-195 instrument to NOT read as expected; or the plant check requires limb 2's line to come after the stand-in line. If you cut, measure base red on a scratch copy outside the repository (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`; harness runs only, no vitest); next free id ABC-198.
- QE-196-b/-c are INFO: agree, or say why not.
- If anything is cut, one `_Updated:` line at the top of `plans/board.md` and the card. Otherwise only a dated line on ABC-196's page (main's tree).

## Fences
- Only `plans/` and your notes (context root: this repository's `.grugops/context`). No `src/`, instrument, harness, ADR, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config, `node_modules/`. Commit nothing. Run no vitest and take no timing.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-196`). Pass this repository root's `.grugops/context` as the context root explicitly. Every `at` from `date -u`. Include a `kind: decision`.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/bapm-rule-QE-196.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.
