---
subtask: scribe-agents-md-clockmode
role: agents-md-scribe
ref: .grugops/context/scribe-agents-md-clockmode/
branch: new grugops/scribe-agents-md-clockmode from main (worktree .claude/worktrees/scribe-agents-md-clockmode)
width: records only; no vitest, no engine, no timing (a 400-game batch holds the host ALONE). Leave no process running.
---
# Scribe: AGENTS.md lines for uci-clock-mode (ABC-221 merged)
## Read
AGENTS.md (budget about 18 432 B; it was 18 176 B); ADR-0052 (D4, D6, D8 with the 2026-10-31 spawn rule); ADR-0045 A3 fold; secnfr-ABC-221 (carried items: the TimeMode and A10 lines).
## Do
- Update the TimeMode line to the three values: uci-clock-mode spends min(59.5 s, C) under a 60 s ceiling; HARD_CEILING_MS is 60 000.
- Add the A10 deep-lane line only if it fits.
- Stay inside the byte budget: trim or reword, never overflow. Report the byte count before and after.
## Fences
AGENTS.md only. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `scribe-agents-md-clockmode`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.

## Result
- **Done.** `AGENTS.md` only; 2 lines changed (2 insertions, 2 deletions). Bytes **18 176 before, 18 421 after** (+245; budget about 18 432, 11 B spare). A first draft read 18 499 and was trimmed.
- **TimeMode line (Dev / run):** now `level|simple-tournament|uci-clock-mode`, default `level`; `uci-clock-mode` spends `min(59.5 s, C)`, ceiling 60 s; both modes ignore `Skill Level`; `HARD_CEILING_MS` = 60 000.
- **A10 deep-lane line:** it fit, folded into the existing `src/uci-session.test.ts` lane line (same file, same `ENGINE_DEEP=1` spelling) rather than as a new line. Added the one-row filter `-t "ABC-221 A10"` (the form QE ran) and the D8 spawn rule in one clause (`ENGINE_DEEP` only, sync, argument array).
- **Not run:** no vitest, engine or timing. The `-t` filter is QE's form, not re-run here.
- **Notes:** `.grugops/context/scribe-agents-md-clockmode/notes/` (a decision `38f0e378` and an observation `fb8ed12e`), sealed through `admitAndAppend` (the MCP `propose_note` tool was not offered to this hop; same writer, called in process with the worktree as root), index rendered.
