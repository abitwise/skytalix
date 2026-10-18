---
subtask: secnfr-ABC-169
role: security-nfr
ticket: ABC-169
page: plans/tickets/ABC-169-declare-the-engine-private.md
branch: grugops/ABC-169 @ 344a4128 (worktree ../wt-ABC-169; read-only for you)
base: 849d7f92
---

# Security/NFR ABC-169: ABC-041 clause (a) review of the package.json change

The SE hop record is `.grugops/queue/done/ticket-to-pr-ABC-169-redo.md`.

- ABC-041 clause (a) fires on any `package.json` touch. Review the single added key `license` for supply-chain or manifest risk:
  - npm publish behaviour with `private: true`;
  - any effect on lifecycle hooks or scripts.
- Confirm that ADR-0036 (b1), (b2) and (c) do not fire for the three-file diff.
- Result: PASS or FAIL, with required fixes and accepted risks.
- Records only. Read from a detached checkout of `344a4128`, and never commit to `grugops/ABC-169`.

Rules:
- No timing readings.
- Do not touch `plans/board.md`, `plans/traceability.md`, `wt-ABC-146`, `wt-ABC-170`, or other sessions' processes.
- Never push or merge.
- When done, write `.grugops/queue/done/secnfr-ABC-169.md` and `.claim.md`, uncommitted, in main's working tree, and put a trace row in
  the handoff.
