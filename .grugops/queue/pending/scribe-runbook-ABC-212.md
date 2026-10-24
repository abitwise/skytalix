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
