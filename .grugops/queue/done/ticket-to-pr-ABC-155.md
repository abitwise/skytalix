---
result: done
branch: grugops/ABC-155-last-char-refusal
tip: dcc04871
code_commit: 819e6933
base: c9746851
---

---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-155
role: software-engineer
ticket: plans/tickets/ABC-155-the-book-sha256-test-never-offers-a-hash-that-differs-only-in-its-last-character.md
ref: .grugops/context/ticket-to-pr-ABC-155/
enqueued_by: orchestrator
enqueued_at: 2026-10-17T00:00:00Z
branch: grugops/ABC-155-last-char-refusal (cut from main c9746851)
---

# Subtask: implement ABC-155. You are the ONLY hop running (width 1).

Deliver A1–A3 exactly as the page states: one more refusal case inside the `ABC-145` describe's `A1/A2` `it` in
`tools/opening-book/book.test.ts`, and nothing else.

- Work in your own worktree (`../wt-ABC-155`) on the branch above. Show the gap first: `Q-PREFIX` green on the base test.
- Plant every mutant in a scratch copy OUTSIDE the repository; `git status --porcelain` empty afterwards. Record all ten A2 readings.
- Gates on your tip: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success true,
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`. File and test counts must equal base (58 / 1792 at c9746851).
- Fences: no byte of `tools/opening-book/compile.ts`, `data/`, `src/`, `AGENTS.md`, `plans/board.md`, or any other ticket page. Append your
  traceability row and a Delivery section on the ABC-155 page only.
- No timing reading. Commit typed notes under the ref on the branch. Never merge, push, --force, --amend or rebase.
- If a criterion cannot be met as written, STOP and report; do not amend it.
- Finish with `.grugops/queue/done/ticket-to-pr-ABC-155.md` (frontmatter: result, branch, tip, code_commit) and `ticket-to-pr-ABC-155.claim.md`, uncommitted on main.
