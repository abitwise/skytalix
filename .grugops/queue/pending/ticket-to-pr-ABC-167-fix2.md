---
subtask: ticket-to-pr-ABC-167-fix2
role: software-engineer
ticket: ABC-167
page: plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
branch: grugops/ABC-167 @ 20a9fc5d
worktree: ../wt-ABC-167
---

# Resume the ABC-167 fix hop on the ruled clock steps (tests only)

`bapm-amend2-ABC-167` has ruled the clock step for each amended A5, A6 and A7 row.
- The ruling is merged on main; read it in `.grugops/context/bapm-amend2-ABC-167/notes/…5c7a1e30`.
- No amended row stays on step 1.
- The bound G ≤ time ≤ G + 2·step is kept.
- The timeout is **not** raised.

## Steps
1. In `../wt-ABC-167`, run `git merge --no-ff main` to bring in the re-ruled page.
2. Re-write the amended rows in `src/uci-session.test.ts` to the ruled step and window for each row.
   - `src/uci-session.ts` should need no change. If it does, stop and report.
3. Make sure each row still fails on the wrong build it names. Check this on scratch copies where it is cheap.
4. Keep the `src` diff exactly `src/uci-session.ts` and `src/uci-session.test.ts`.

## Gates (on your tip)
- `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`.
- Check that `.test-results/last-run.json` shows `success: true` and the full count. If the 60 s bound cut the run off, re-run it.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`.
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts`.

## Fences
- Take no timing readings. N8-LANE stays OWED.
- Do not touch `plans/board.md`, `plans/traceability.md`, `../wt-ABC-146`, or any process you did not start.
- Never push. Never merge to main.
- Keep the hop lean.

## Handoff
Write `.grugops/queue/done/ticket-to-pr-ABC-167-fix2.md` and `.claim.md` in main's working tree. Leave them uncommitted. Include:
- the tip;
- the result for each row;
- the gates;
- the output of `git diff --name-only <merge-base with main>...<tip> | grep -v '\.test\.ts$' | grep '^src/'`;
- a trace row.
