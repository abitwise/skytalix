---
subtask: qe-ABC-170
role: qe-e2e
ticket: ABC-170
page: plans/tickets/ABC-170-the-engine-takes-two-optional-limits-maxdepth-and-maxnodes.md
branch: grugops/ABC-170 @ 64b07741 (code e29f7951; worktree ../wt-ABC-170; read-only for you)
base: 358810ac
---

# QE ABC-170: try to break the optional maxDepth / maxNodes limits

The SE hop record is `.grugops/queue/done/ticket-to-pr-ABC-170.md`.

- Independently re-check A1–A5 and A7 at the tip.
- Hunt for gaps. Ideas:
  - `maxDepth` 0, negative, NaN or fractional values;
  - `maxNodes` 0 or negative;
  - a limit combined with a tiny `budgetMs`;
  - a node limit hit inside quiescence;
  - whether the "absent = today's engine" identity (A3) is really node-for-node on positions outside the six perft FENs;
  - whether the loosened A4 header check (now whitespace-insensitive) would still catch a constant depth cap.
- Run a mutation probe where it helps, for example dropping the `maxNodes` term or swapping the clock-first order. Report which tests
  kill each mutant.
- **A6 (NFR-005 timing) stays OPEN.** Do not run `ENGINE_DEEP` timing rows or any timing reading; the Orchestrator takes that reading in a
  quiet window.
- Read only from a detached checkout or a scratch worktree of `64b07741`, and never commit to `grugops/ABC-170`.
- Verdict: PASS, PASS_WITH_GAPS or FAIL, with findings numbered QE-170-a onwards.

Rules:
- Do not touch `plans/board.md`, `plans/traceability.md`, `wt-ABC-146`, `wt-ABC-169`, or other sessions' processes.
- Never push or merge.
- When done, write `.grugops/queue/done/qe-ABC-170.md` and `.claim.md`, uncommitted, in main's working tree, and put a trace row in the
  handoff.
