---
task: wave-2026-09-25
subtask: qe-n8-ABC-095
role: qe-e2e
ticket: plans/tickets/ABC-095-short-circuit-the-engines-move-choice-with-the-book-and-fall-through-cleanly.md
ref: .grugops/context/qe-n8-ABC-095/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/qe-n8-ABC-095 (off Security/NFR tip 7b93c973, which carries QE e1444f23; SE code 09740ea4; base main 0974102f)
---

# Subtask: re-read N8-LANE for ABC-095 (QE-095-N8, MEDIUM; QE-095-h). You are the ONLY hop running (width 1). Timing only.

Owner word 2026-10-12 (answering "(a) stop the scaffolder and pause the grugops-kit tests; one re-read" vs "(b) merge without the reading"): **"I answer a"**. The platform scaffolder (PID 63446) is gone; the owner is pausing the grugops-kit vitest (`~/Projects/public/grugops`) from another session.

- **Protocol:** ADR-0035 narrow-set protocol as amended (A1–A3, B1–B4), the same instrument and graders QE used in `qe-ABC-095` (`.grugops/context/qe-ABC-095/probe/`: `window-n8.sh`, `readout-n8.py`, the pre-registration `preregistration.txt` and its erratum). Sets: `src/cli.test.ts` (floor 0.100 s) and `src/cli.real-engine.test.ts` default lane (provisional floor as pre-registered), each graded against its floor and the 650 ms bar, base `0974102f`, head `2307fc11`. Add `src/book-engine.test.ts` (QE-095-h) as a third set ONLY if you pre-register it with its floor; otherwise report QE-095-h as still owed.
- **B1:** commit a NEW pre-registration for these re-read windows on your branch BEFORE the first run (on a commit with the ADR-0035 addendum as ancestor). Carry the void clauses unchanged (forward-only; QE-095-i is the Architect's question, not yours): any foreign vitest, any `oeselg-labs/platform` process. Log load1, thermal pressure level (`com.apple.system.thermalpressurelevel`), foreign vitest, platform processes and power source before and after every round. Power source is logged, not a void clause (the laptop may be on battery; say so).
- **Waiting:** gate each window on clean samples as before. Overall wait budget: 45 minutes from your first gate sample. If no clean window opens, report NOT READ with the void log — never pool, never estimate, never compute what void windows "would have read".
- Grade each set MET / NOT MET / NOT READ with the median delta, sign test and rounds.

## Fences
Own worktree: `git worktree add ../wt-qe-n8-ABC-095 -b grugops/qe-n8-ABC-095 7b93c973`; symlink `node_modules` into the WORKTREE root only — never `ln -s` in the main checkout. Base/head trees for timing in scratch copies or worktrees outside the main checkout; remove any you create by exact path. Edit only your notes and probe under `ref:`, the ticket page's § QE (append-only, dated), and one trace row at the END of `plans/traceability.md`. Do not touch `src/`, `tools/`, tests, `plans/board.md`, `AGENTS.md`, ADRs. Never kill or touch other sessions' processes. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`, rebase. Never merge or push. End commits with a `Co-Authored-By:` trailer naming the model you are. Write your verdict as a qe-e2e `decision` note whose refs name ABC-095 (the QE-hop check must stay covered). Queue: `mkdir .grugops/queue/claimed/qe-n8-ABC-095` in the main checkout, then FLAT `.grugops/queue/done/qe-n8-ABC-095.md` and `.claim.md` there, uncommitted; `rmdir` the claim dir.

Report: branch tip; per set MET / NOT MET / NOT READ with the numbers read; the window log (gate times, void rounds and why); QE-095-h's state.
