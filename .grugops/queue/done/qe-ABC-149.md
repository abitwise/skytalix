---
task: wave-2026-09-25
subtask: qe-ABC-149
role: qe-e2e
ticket: plans/tickets/ABC-149-the-result-file-reporters-exit-code-check-is-pinned-by-no-plant.md
ref: .grugops/context/qe-ABC-149/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-149-reporter-plants (tip 9a309fb4; code e3e9c126; base 4973d8e0)
base: 4973d8e0
---

# Subtask: QE review of ABC-149 (reporter REGRESSION PLANTS block).

Re-plant every row and mutant yourself in your own copies (not the SE's): the six rows at head, M1, M9, the query
without its run / suite / error arms. Check the block's commands run as written (the SE fixed one quoting bug),
the comment-only and fence checks, and the SE's note that an inverted assertion reads numFailedTestSuites 2.
No timing readings. Commit notes on the ticket branch; never merge. Use /usr/bin/diff.
