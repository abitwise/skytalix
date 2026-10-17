---
result: done
branch: grugops/ABC-096-opening-name
tip: 2acebaa8
code_commit: a48da51c
base: 6edadcf0
---

---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-096
role: software-engineer
ticket: plans/tickets/ABC-096-show-the-named-opening-when-the-book-knows-it.md
ref: .grugops/context/ticket-to-pr-ABC-096/
enqueued_by: orchestrator
enqueued_at: 2026-10-17T00:00:00Z
branch: grugops/ABC-096-opening-name (cut from main 6edadcf0)
---

# Subtask: implement ABC-096 as re-scored (DoR 10/10) under ADR-0043. You are the only hop running.

Deliver A1–A10 exactly as the page states, inside its code fence (production: `src/book.ts`, `src/render-seam.ts`, `src/cli.ts`; tests:
`src/render-seam.test.ts`, `src/history-pane.nfr.test.ts`, `src/cli.test.ts`, `src/book-engine.test.ts`). The must-not-change list holds,
including `src/frame.ts`, `src/turn-loop.ts`, `src/book.test.ts`, snapshots, `data/`, `tools/`. No new file, dependency or spawn.
Read the page's test note 6 (digit-free `render-seam.ts`; banned words in `src/cli.ts`). A red that can only be fixed outside the fence:
STOP and report, do not widen it.
- Worktree: `git worktree add /Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-096 -b grugops/ABC-096-opening-name 6edadcf0`.
- Gates on your tip: lint, typecheck, build, `npm test` (base 58 / 1810), `last-run.json` success, skip-integrity `--skip-count 0`,
  and `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`; read every red.
- Do not touch `plans/board.md` or `AGENTS.md`. Delivery section on the ABC-096 page, one appended trace row, typed notes under the ref.
- No timing reading beyond what a criterion's own test asserts (Security/NFR measures NFR-007). Never merge, push, --force, --amend, rebase.
- Finish with `.grugops/queue/done/ticket-to-pr-ABC-096.md` (frontmatter: result, branch, tip, code_commit) and its `.claim.md`, uncommitted on main.
