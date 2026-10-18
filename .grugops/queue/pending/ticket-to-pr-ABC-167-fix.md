---
subtask: ticket-to-pr-ABC-167-fix
role: software-engineer
ticket: ABC-167
page: plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
branch: grugops/ABC-167 @ 4dbbfbd8
worktree: ../wt-ABC-167
---

# Make ABC-167's amended rows green (QE-167-a to QE-167-h)

The ticket page was amended on main at `2f89196f`, in `bapm-amend-ABC-167`. The amendment adds 21 rows, each marked *Amended 2026-10-18*. Read the rulings in `.grugops/context/bapm-amend-ABC-167/notes/…7d2e41b9`.

1. In `../wt-ABC-167`, merge main into `grugops/ABC-167`: `git merge --no-ff main`. This brings in the amended page.
2. Write every amended row as a test in `src/uci-session.test.ts`.
3. Make the four rows that fail at the tip pass, by changing `src/uci-session.ts`:
   - `A6-e2`: on `position` while a `bestmove` is held, write the held `bestmove` first.
   - `A6-e3`: the same for `ucinewgame`.
   - `A6-e4`: on `quit`, write the held `bestmove`.
   - `A7-f1`: a keyword is never a value.
4. Confirm each new test fails on a wrong build. Where it is cheap, check this against the mutant a row targets (M02–M06, M11, M12, M15, M29, M47–M51), using scratch copies only.
5. The `src` diff must stay exactly `src/uci-session.ts` and `src/uci-session.test.ts` (A12).

## Gates (all on your tip)
- `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`.
- Check `.test-results/last-run.json`: it must show `success: true` and the full count. If the 60 s bound cut the run off, re-run it.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`.
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts`.

## Fences
- Take **no timing readings**. N8-LANE stays OWED.
- Do not touch `plans/board.md`, `plans/traceability.md`, `../wt-ABC-146`, or any process you did not start.
- Never push, never merge to main.
- Keep this hop lean. ABC-166's width-1 run waits for it.
- If a row is ambiguous, **stop and report** instead of deciding it yourself.

## Handoff
Write `.grugops/queue/done/ticket-to-pr-ABC-167-fix.md` and `.claim.md` in main's working tree. Leave both uncommitted. Include:
- the tip;
- the result for each row;
- the mutants each row now kills;
- the gate output;
- the measurement `git diff --name-only <merge-base with main>...<tip> | grep -v '\.test\.ts$' | grep '^src/'`;
- a trace row.
