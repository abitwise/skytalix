---
subtask: secnfr-ABC-221
role: security-nfr
ticket: ABC-221
ref: .grugops/context/secnfr-ABC-221/
branch: new grugops/secnfr-ABC-221 from main (worktree .claude/worktrees/secnfr-ABC-221); code under review: grugops/ABC-221 c48a6f83 (read with git show/diff; do not run it)
width: records only; no vitest, no timing, no engine runs (QE holds the host ALONE)
---
# Security/NFR gate (records): ABC-221 uci-clock-mode; NFR-004 clamp 32 → 60 s
## Read
The ticket page § NFR triggers; ADR-0052 D4/D6/D7/D8; plans/nfr-catalog.md (NFR-004 clause B, NFR-009, NFR-011, AR-NFR004-A, AR-UCI-BUSY);
`git diff d58f2d77 c48a6f83 -- src`; se-ABC-221's notes on that branch (A10 readings: walls ≤ 59 501.1 ms, heap growth ≤ 0.12 MiB); secnfr-ABC-220's notes.
## Do
- Place NFR-004's 60 s text for `uci-clock-mode`, as the ticket proposes. Move clause B's raw-call bound from 32 s to 60 s, citing the owner's Q5.
- Re-read AR-NFR004-A at 59.5 s and AR-UCI-BUSY at ≤ 60 s. Read NFR-009 from the SE's A10 figures, marked pending QE's reading.
- ASVS L1: the closed set gains one value, and `go`'s numbers are already parsed and refused.
- Give an opinion on SE-221-b: one spawnSync call in the deep lane of `src/uci-session.test.ts`, against ADR-0052 D8's "no spawn site". The ruling is the Architect's.
- Result: PASS / PASS_WITH_FIXES / FAIL, with required fixes and accepted risks. Any NFR level you would move beyond the owner's words goes to the owner; do not move it.
## Fences
Records only: plans/nfr-catalog.md and your notes. No src/, tools/, data/, ADR, ticket or board edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `secnfr-ABC-221`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.
