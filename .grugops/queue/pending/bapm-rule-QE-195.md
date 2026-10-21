---
subtask: bapm-rule-QE-195
role: ba-pm
tickets: [ABC-195]
branch: main (records only; commit nothing — the Orchestrator commits)
ref: .grugops/context/bapm-rule-QE-195/
width: 1
---

# BA/PM (records only): rule QE-195-a (LOW proposed) from ABC-195's QE gate. ABC-195 is merged; this gates nothing

## Read first
- QE verdict and gap register `.grugops/context/qe-ABC-195/notes/20261021T203404Z-qe-e2e-decision-f36a06c3.md`, plants and drift copies `…741eebba`; Orchestrator close `20261021T203559Z-orchestrator-decision-ed1933d8`.
- ABC-195's page and `ADR-0036` § S1 (ABC-195 block); `.grugops/context/design-F-072-1/probe/r2-mutants.sh`; your own `bapm-cut-AR-193` notes.

## Do
- **QE-195-a:** the five new rows check limbs 2/3 only for equality with `341da4c1` on the twin, and the plant check guards only the header-shaped anchor; if PP-EDIT's in-place anchor `resolveOptions(process.argv.slice(2))` stops matching, the harness still reads 25 of 25 (measured by QE with a one-line drift copy). Rule cut / fold / accept. QE's fix shapes: assert each new row's expected limb 2/3 verdict, or make the plant check also require the capability line. If you cut, measure base red on a scratch copy outside the repository (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`); next free id ABC-196.
- QE-195-b/-c are recorded INFO by the Orchestrator; agree or say why not.
- If anything is cut, one `_Updated:` line at the top of `plans/board.md` and the card. Otherwise only a dated line on ABC-195's page.

## Fences
- Only `plans/` and your notes. No `src/`, instrument, harness, ADR, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config, `node_modules/`. Commit nothing.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-195`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line. Put it in your done record (`.grugops/queue/done/bapm-rule-QE-195.md` + `.claim.md`, main's tree, uncommitted).
