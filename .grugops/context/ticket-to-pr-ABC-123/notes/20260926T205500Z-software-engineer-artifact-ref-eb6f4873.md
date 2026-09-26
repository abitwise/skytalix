---
id: 20260926T205500Z-software-engineer-artifact-ref-eb6f4873
kind: artifact-ref
by: software-engineer
at: 2026-09-26T20:55:00Z
verified_by:
confidence: high
refs:
  - ABC-123
  - ticket-to-pr-ABC-123
  - wave-2026-09-25
  - tools/grugops/run-bounded.js
  - tools/grugops/run-bounded.proof.js
  - plans/tickets/ABC-123-run-bounded-timeout-ceiling-and-stale-header.md
  - plans/traceability.md
supersedes:
---

# ABC-123 artifacts: branch `grugops/ABC-123-run-bounded-r2r3` from `e57da89`, one commit, not merged and not pushed

Hand-authored and unsealed. The commit sha is not written here, because a note cannot name the
commit that contains it. Read it with `git log -1 grugops/ABC-123-run-bounded-r2r3`.

- **Code:**
  - `tools/grugops/run-bounded.js`: the R2 guard, the Contract `exit 2` line, and the R3 header;
  - `tools/grugops/run-bounded.proof.js`: 17 new rows and a header line.
- **Docs:**
  - the ticket page gains a `## Delivery` section, and its frontmatter is not moved;
  - `plans/traceability.md` gains one row, `ABC-123 (build)`.
- **Notes:** decisions `…02e24867`, readings `…35a5af66`, and the raw outputs in this directory:
  - `raw-out-proof-red-unfixed.txt` and `raw-out-proof-green-fixed.txt`;
  - `raw-harness-spawn-spy.cjs.txt`;
  - `raw-out-spawn-spy-unfixed.txt` and `raw-out-spawn-spy-fixed.txt`;
  - `raw-out-gates.txt`.
- **Commands to re-run:**
  - `node tools/grugops/run-bounded.proof.js`, which should exit 0;
  - `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.
- **Remaining work, not this hop's:**
  - QE hop (Workflow 05), then Security/NFR, including confirming the `N8-SPAWN` 0 ms ruling;
  - the board move to `In Review` (Orchestrator);
  - UAT waiver reading (Orchestrator).
- **Nothing left running.** Every child in the proof and probes exited or was reaped. The hang row
  reported ESRCH for the group, the fixture and the grandchild.
