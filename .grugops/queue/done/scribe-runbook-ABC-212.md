---
subtask: scribe-runbook-ABC-212
role: agents-md-scribe
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/scribe-runbook-ABC-212/
branch: new grugops/scribe-runbook-ABC-212 from grugops/qe-ABC-212 (052ae3ad), worktree ../wt-scribe-runbook-ABC-212
width: 1 of 3 (beside security-nfr-ABC-212, bapm-fold-ABC-212; records only)
---

# Runbook lines for QE-212-a (LOW) and QE-212-c (INFO)

## Do
- QE-212-a: in `memory-bank/70-runbook.md`, the `ENGINE_DEEP` levels lane command gains `--reporter=verbose` (or a line saying why), so the A4 max-time / max-depth log line prints when output goes to a file. Verify by running nothing heavy: read vitest's reporter behaviour from the QE evidence (`qe-ABC-212/…f9560997`), do NOT run the ENGINE_DEEP lane.
- QE-212-c: the "no output on each engine move" wording — the `thinking...` frame prints first; correct it.
- Mirror in `AGENTS.md` only if that command is restated there. Log the change in `memory-bank/90-agents-md-command-log.md`.

## Fences
- Only your worktree and `<scratchpad>/scribe212/`. No `src/` edits; no timing runs. Never push, force, amend or rebase; never merge into main; no board edits. Records: no hostnames, IPs, or personal paths.

## Publish
- Commit on your branch. Seal notes (task scribe-runbook-ABC-212). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

Done. Both lines applied; nothing run (no `ENGINE_DEEP`, no timing run, no lint: the worktree has no `node_modules`, and only markdown changed).

- Branch `grugops/scribe-runbook-ABC-212` from `grugops/qe-ABC-212` `052ae3ad`, worktree `../wt-scribe-runbook-ABC-212`. Content commit `adc9121d`; tip `df25c2e1` (adds only the note). Not pushed, not merged.
- QE-212-a: `AGENTS.md` Levels deep lane line gains `--reporter=verbose` at its end (`... npx vitest run src/levels.test.ts` -> `... npx vitest run src/levels.test.ts --reporter=verbose`). 17,079 -> **17,098 B** (+19; budget 18,432). The `ABC-173` `A3` shape check (`src/cli.test.ts`) counts a command by its heap flag and test file, so a trailing flag does not change it.
- QE-212-c: `memory-bank/70-runbook.md` § Operate: "expect about half a minute with no output on each engine move" -> "the `thinking...` line prints at once, then expect about half a minute with no further output on each engine move"; old sentence kept in a dated `[CHANGED]` bracket; one `_Updated_` header line added.
- `memory-bank/90-agents-md-command-log.md`: a dated CORRECTED paragraph in the Levels deep lane section and a `scribe-runbook-ABC-212` pass entry at the end.
- Brief vs tree: the runbook never carried the lane command (it lives only in `AGENTS.md`), so the flag went to `AGENTS.md` and the runbook gained no command line (a second copy would drift).
- Evidence for the flag is QE's reading `…f9560997` (file output printed none of the rows' log lines; `--reporter=verbose -t <row>` printed them), same cause as the `CLI_DEEP` / `LADDER_DEEP` entries. On a TTY: `UNKNOWN - verify`.
- Note (task `scribe-runbook-ABC-212`, sealed with `admitAndAppend`, context root the worktree's): `20261024T125500Z-agents-md-scribe-decision-20280cb7` (decision).
- Not touched: `src/`, `plans/` (traceability, board), ADR files, `plans/nfr-catalog.md`. No stops, no fence breach.

### Trace row (10 cells)

| ABC-212 (scribe-runbook) | AGENTS.md Levels deep lane command gains `--reporter=verbose` so the A4 max-time / max-depth log prints to a file (QE-212-a); runbook § Operate says `thinking...` prints first (QE-212-c); command-log pass appended | EPIC-008 | levels 6–7 | QE-212-a, QE-212-c, NFR-004 (tripwire log); note …20280cb7 | grugops/scribe-runbook-ABC-212 @ df25c2e1 (content adc9121d)<br>AGENTS.md, memory-bank/70-runbook.md, memory-bank/90-agents-md-command-log.md | docs only; nothing run | — | — | QE-212-a / -c applied |
