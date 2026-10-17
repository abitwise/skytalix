---
task: wave-2026-09-25
subtask: qe-ABC-155
role: qe-e2e
ticket: plans/tickets/ABC-155-the-book-sha256-test-never-offers-a-hash-that-differs-only-in-its-last-character.md
ref: .grugops/context/qe-ABC-155/
enqueued_by: orchestrator
enqueued_at: 2026-10-17T00:00:00Z
branch: grugops/ABC-155-last-char-refusal (tip dcc04871; code 819e6933; base c9746851)
---

# Subtask: QE gate for ABC-155. You are the ONLY hop running (width 1).

Verify A1–A3 against the page. Re-plant the mutants yourself (Q-PREFIX, Q-CASE, M05, M-SWAP, M06) in scratch copies OUTSIDE the
repository, base test and head test; do not copy the SE's readings (`.grugops/context/ticket-to-pr-ABC-155/notes/`). Re-run the gates
on the tip (lint, typecheck, build, `npm test`, `last-run.json` success, skip-integrity `--skip-count 0`) and the fences. Measure the UAT
waiver: `git diff --name-only c9746851...dcc04871 | grep -v '\.test\.ts$' | grep '^src/'`.

Return PASS / PASS_WITH_GAPS / FAIL with a gap register. Work in your own worktree on the ticket branch; commit your typed notes and a QE
section on the ABC-155 page there. Do not touch production files, `plans/board.md`, or other ticket pages. No timing reading. Never merge,
push, --force, --amend or rebase. Finish with `.grugops/queue/done/qe-ABC-155.md` and `qe-ABC-155.claim.md`, uncommitted on main.
