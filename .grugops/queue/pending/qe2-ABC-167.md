---
subtask: qe2-ABC-167
role: qe-e2e
ticket: ABC-167
page: plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
branch: grugops/ABC-167 @ 6922f772
ref: .grugops/context/qe2-ABC-167/
---

# QE re-check of ABC-167 after the fix hops (lean)

**What you are checking.** Your first pass (`qe-ABC-167`, PASS_WITH_GAPS) raised QE-167-a to QE-167-h. Since then:
- BA/PM amended the ticket twice (`…7d2e41b9`, `…5c7a1e30`).
- The SE delivered `20a9fc5d`, then the tip `6922f772`. Read both done files: `ticket-to-pr-ABC-167-fix.md` and `ticket-to-pr-ABC-167-fix2.md`.

**Scope.** Check that each amended row exists, passes, and fails on the wrong build it targets. Do not redo the whole first pass. Focus on:
- the code change: held `bestmove` released on `position` / `ucinewgame` / `quit`; a keyword is never read as a value;
- the mutants that survived your first pass: M02 to M06, M11, M12, M15, M23, M29, M43, M44, M47 to M51.

Give each QE-167 gap one of three states: closed, accepted, or still open.

**Setup.** Work in a scratch worktree, detached: `git worktree add --detach ../wt-qe2-ABC-167 6922f772`. Remove it when you are done.

**Gates at the tip.** Run lint, typecheck, build and `npm test`. Check that `last-run.json` shows `success: true` with the full count, and run integrity with skip 0.

**N8-LANE.** Read it only in a quiet window verified from the foreground: 180 s with no foreign `vitest` and no `oeselg-labs/platform` process. Record the host and load. Otherwise mark it OWED. Never estimate it.

**Fences.**
- Do not touch `src/`, `plans/board.md`, `plans/traceability.md`, `../wt-ABC-167`, `../wt-ABC-146`, or any process you did not start.
- Do not fix defects. Never push, merge or self-sign.

**Publish.**
- Hand-authored, unsealed notes under `ref:` in main's working tree, including one `kind: decision` note authored by `qe-e2e`.
- `.grugops/queue/done/qe2-ABC-167.md` and `.claim.md`, uncommitted. Include the verdict, the state of each gap, the mutants, the gates, N8-LANE, any new gaps, and a trace row.
