---
task: wave-2026-09-25
subtask: resume-ABC-101
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-101-difficulty-selection.md
ref: .grugops/context/resume-ABC-101/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-101-difficulty-selection (tip 27dddf86; worktree ../wt-ticket-to-pr-ABC-101)
base: main @ a01bf6fb (carries the BA/PM amendments)
---

# Subtask: resume ABC-101 on its own branch and deliver it. You are the ONLY hop running (width 1).

BA/PM ruled the stop (merged on main at `a01bf6fb`; decision note `.grugops/context/bapm-amend-ABC-101/notes/…f4a8b6ee`): `ABC-086` `A5`(i) is re-pinned as **(i′)** with four assertions; `ABC-101` `A9` is widened by `src/engine.test.ts` (that one row and its imports only); `A7` is read in two halves; `ABC-042` carries a dated pointer. Read § Amendment on ABC-086 and ABC-101 before you start.

1. In the existing worktree `../wt-ticket-to-pr-ABC-101`, bring main in with `git merge --no-ff main` (no rebase). Resolve a `plans/traceability.md` conflict by keeping both sides' rows; stop and report on any other conflict.
2. Apply `.grugops/context/ticket-to-pr-ABC-101/probe/abc101-full-not-committed.diff` (`git apply --3way` or plain `git apply`; check `git apply --check` first). If it does not apply cleanly, stop and report.
3. Replace `src/engine.test.ts`'s `A5`(i) row with the four (i′) assertions exactly as the page states, adding only the imports they need. Check `git diff -U0 <base> HEAD -- src/engine.test.ts`: hunks only in the import block and that one `it`.
4. Keep `ABC-042` `A8`'s lists exact, each new number's meaning in the comment. A7: 0 matches on the `+` lines you add (except a comment citing the ruling).
5. Gates: lint, typecheck, build, `npm test`. **Expected and allowed: exactly one red, `ABC-065` `A3`**, which waits on the `AGENTS.md` dev/run line the Scribe lands next on this same branch. Any other red: stop and report. Plus `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts` (expect 10/10), 0 `abc095-book-absent-*` copies before and after, and skip-integrity `--skip-count 0` (with `.grugops/test-skips.md`).
6. Commit code and tests as one commit, then records (notes, § Delivery addendum on the ABC-101 page, one trace row at the END of `plans/traceability.md`).

## Fences
Never merge to main or push. Do not touch `plans/board.md`, `AGENTS.md`, engine modules (search, evaluation, ordering, TT, ID, time budget, `levels.ts`), `src/book*.ts`, `data/`, other tickets' pages. `node_modules` symlinked into the WORKTREE root only — never `ln -s` in the main checkout. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`, rebase. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. No timing readings. End each commit with a `Co-Authored-By:` trailer naming the model you actually are. Queue: `mkdir .grugops/queue/claimed/resume-ABC-101` in the main checkout, then FLAT `.grugops/queue/done/resume-ABC-101.md` and `.claim.md`, uncommitted; `rmdir` the claim dir. Report: branch tip and code commit, gates with counts (naming the one expected red), each criterion PASS/FAIL, the `-U0` reading of `engine.test.ts`, A7's added-lines reading, clause-b on the delivered pair, files changed.
