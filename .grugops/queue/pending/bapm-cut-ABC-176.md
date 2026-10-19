---
subtask: bapm-cut-ABC-176
role: ba-pm
ticket: ABC-176 (new)
branch: grugops/bapm-cut-ABC-176 (from main, current tip)
worktree: ../wt-bapm-cut-ABC-176
ref: .grugops/context/bapm-cut-ABC-176/
---

# Cut ABC-176: a refused run must never read as a clean skip count or a quiet result (owner word `…5c8d2f71`)

Read these first:
- SEC-173-1, in `.grugops/context/secnfr-ABC-173/notes/…f3757b98` and `probe/skipzero.out`. A skip-count capture typed without its new prefix prints `0` and exits 0, even though the guard refused the run (`numTotalTests` 0, `success` false). 24 files under `.grugops/` still quote the old command.
- QE-173-d, in `.grugops/context/qe-ABC-173/notes/…e81b5c27`. On a guard refusal, `last-run.json` records no error.

Cut **one XS ticket, ABC-176** (P3, epic —). Write Given/When/Then criteria that a wrong build fails:
- When the guard refuses a run, the skip-count capture reports the refusal and does not print a number, or it exits non-zero.
- The result file names the refusal.
- The old unprefixed quotes are handled in one of two ways, and the ticket picks one:
  - they are corrected;
  - they are declared history, with a pointer.

Name the files the change may touch (`tools/grugops/`, the `AGENTS.md` line, tests), and name the pins that move. Score the DoR. Next free id after this: ABC-177.

**Fences:**
- Records only.
- Do not run any vitest or timing.
- Do not touch `src/`, `tools/`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`.
- Never push or merge.

**Hand-off:** write `.grugops/queue/done/bapm-cut-ABC-176.md` and `.claim.md` in main's working tree, uncommitted. Include the commit, the page, the criteria, the DoR and a trace row.
