---
task: wave-2026-09-25
subtask: scribe-ABC-101
role: agents-md-scribe
ticket: plans/tickets/ABC-101-difficulty-selection.md
ref: .grugops/context/scribe-ABC-101/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-101-difficulty-selection (tip ccc274ab; code ac8deab1; worktree ../wt-ticket-to-pr-ABC-101)
---

# Subtask: land ABC-101's `AGENTS.md` dev/run line ON THE ABC-101 BRANCH. You are the ONLY hop running (width 1).

The SE delivered ABC-101 (`ac8deab1`); the suite has exactly one red, `ABC-065` `A3` ("the documented option list EQUALS the accepted set", `expected 3 to be greater than or equal to 4`), which waits on this line. ABC-101 `A6` waits on it too.
- The exact OLD → NEW block is in `.grugops/context/ticket-to-pr-ABC-101/probe/agents-md-dev-run-slot.txt` on the branch (+4 B: 24,569 → 24,573 B; budget 24,576 B, `ABC-109` `A5`). BA/PM (`…f4a8b6ee`, ruling 6) found it conflicts with no criterion, and offered one wording remark you may take or leave: "default level 3 (3 s/move)" drops the old "up to", reading a ceiling as a fixed time; "(≤3 s/move)" costs 3 B and lands at exactly 24,576 B. Your call; say which and why.
- Optional (BA/PM's note): refresh a stale `CLI_DEEP` row count in `AGENTS.md` only if it fits the byte budget and a test does not pin the old value; otherwise report it as owed.
- Work in the existing worktree `../wt-ticket-to-pr-ABC-101` (the SE is finished; the branch is checked out there). Edit ONLY `AGENTS.md`, your notes under `ref:`, and one trace row at the END of `plans/traceability.md`. Do not touch `src/`, tests, `plans/board.md`, ticket pages, ADRs.
- Gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test` — expect **0 failures** (58 files, 1789 tests), `.test-results/last-run.json` success true, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`. Report `wc -c AGENTS.md`.

## Fences
No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`, rebase. Never merge or push. `node_modules` symlinked into the WORKTREE root only (it is already there if the SE left it); never `ln -s` in the main checkout. End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/scribe-ABC-101` in the main checkout, then FLAT `.grugops/queue/done/scribe-ABC-101.md` and `.claim.md` there, uncommitted; `rmdir` the claim dir. Report: branch tip, the line as landed, byte count, gate counts.
