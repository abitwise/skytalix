---
subtask: qe-ABC-169
role: qe-e2e
ticket: ABC-169
page: plans/tickets/ABC-169-declare-the-engine-private.md
branch: grugops/ABC-169 @ 344a4128 (worktree ../wt-ABC-169; read-only for you)
base: 849d7f92
---

# QE ABC-169: try to break A1–A6 and the comment-only claim

The SE hop record is `.grugops/queue/done/ticket-to-pr-ABC-169-redo.md`.

- Independently re-check A1–A6 at the tip, and the A3 comment-only measurement: the transpile identity and the `-U0` hunk.
- Look for gaps:
  - Does any test still assume `license` is absent?
  - Does `npm pkg` or npm itself warn?
  - Does the credit wording match ADR-0044 D13?
  - Does the waiver grep hold?
- Read only from a detached checkout or a scratch worktree of `344a4128`. Never commit to `grugops/ABC-169`.
- Verdict: PASS, PASS_WITH_GAPS or FAIL, with findings numbered QE-169-a onwards.

Rules:
- No timing readings.
- Do not touch `plans/board.md`, `plans/traceability.md`, `wt-ABC-146`, `wt-ABC-170`, or other sessions' processes.
- Never push or merge.
- When done, write `.grugops/queue/done/qe-ABC-169.md` and `.claim.md`, uncommitted, in main's working tree. Put a trace row in the handoff.
