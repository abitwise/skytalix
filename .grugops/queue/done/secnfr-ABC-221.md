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

## Result

*Security/NFR, 2026-10-31, task `secnfr-ABC-221`; records only. Branch `grugops/secnfr-ABC-221` from `main` `2c0f7ee9`. Code under review `grugops/ABC-221` `c48a6f83` (base `d58f2d77`), read with git only. Catalog commit `787820c3`. Notes sealed through context-io `admitAndAppend`: decision `…ef060512`, observation `…8881d726`. Nothing was run, built or timed (QE holds the host alone).*

- **Gate: PASS** (the role's PASS_WITH_RISKS; ASVS L1, `block_on: high`). **No required fix.**
  - The closed set gained one value, still matched exactly (`TIME_MODES.find(m => m === value)`, frozen tuple, no key lookup). The refusal echo still goes through `printableOf`.
  - `go`'s numbers are unchanged. In the mode every branch is ≤ 59 500. ±Infinity and NaN land on the cap, C's floor or depth 1. Levels are value-identical.
  - `ADR-0036` clause (b) was read, not run: 0 capability tokens in the added production lines.
  - One new test child, in `ENGINE_DEEP` only: no shell, synchronous, and 0 default-lane spawns.
  - **Conditional on QE:** the result reopens if QE's `A10` reads a wall over 60 000 ms or a growth over 1 MiB, or if `A14b` in the mode reads R1 over 100 ms.
- **`NFR-004`:**
  - **Target:** gains "; 60 s in UCI `TimeMode` `uci-clock-mode` (budget ≤ 59.5 s). The engine's one clamp sits at the largest ceiling in force, 60 s". This is `ADR-0052` § Consequences, verbatim, a pure insertion, with a dated line quoting the owner's Q5 "5. increase to 60s" (`…a67f71ac`, `…3dd61448`).
  - **Clause B:** the raw-call bound moves 32 s → 60 s (owner's Q5). The mechanism line says cap 59 500 on every `parseGo` branch, 500 ms margin. Two dated "32 000 true until `ABC-221`'s merge" notes.
  - **Verified by:** MET on the budget (`A7`). MET on the real clock on the SE's reading (`A10` max 59 501.1 ms), pending QE.
- **`AR-NFR004-A` at 59.5 s: STANDS, re-accepted (+1.1 ms, 3 calls, thin). Owner: Security/NFR.** The 500 ms margin means it no longer reaches the ceiling in this mode. The raw-call residual at 60 000 has no reading and no surface reaches it (`SEC-221-a`).
- **`AR-UCI-BUSY` at ≤ 60 s: HOLDS EXACTLY.** Worst case ≈ 59 631 ms; worst read ≈ 59 501.1 ms plus the drain (QE `A14b` pending). **Owner: Architect/Design.**
- **`NFR-009` at 59.5 s:** MET on the SE's reading (heap growth ≤ +0.12 MiB, `arrayBuffers` 0 and 4.51 MiB, depth 13), pending QE.
- **`NFR-008`:** not ruled here. The SE's informal reading is +0.16 s (≈ 9.57 s, `UNKNOWN - verify`). QE's `G8` decides; > 9.6 s fires tranche 2, and > 10 s means `A9` NOT MET.
- **`SE-221-b` opinion (the Architect rules):** no security or NFR risk. It is the `ABC-081` `A7` instrument's form, not the entry point, and D8's guards hold. But D8's "no spawn site" words are now false, so D8 needs a dated line either way (`SEC-221-b`). Security/NFR prefers keeping the pinned row over a hand reading.
- **Owner: nothing new.** Both moved levels are his Q5 words, and no other NFR level moved.
- **Checks:** all 12 NFR rows hashed before and after: only `NFR-004` and `NFR-009` moved. The edited lines were verified as pure insertions. 0 host paths were added.
- **Not touched:** `src/`, `tools/`, `data/`, tests, ADRs, the board, the trace, tickets and `AGENTS.md`. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-221 (Security/NFR gate) | uci-clock-mode over UCI: NFR-004 gains 60 s in TimeMode uci-clock-mode (budget ≤ 59.5 s; clamp 60 000); clause B raw-call bound 32 s → 60 s (owner's Q5); A7 exact, A10 max 59 501.1 ms (SE, pending QE); AR-NFR004-A re-read at 59.5 s, stands (+1.1 ms); AR-UCI-BUSY ≤ 60 s holds exactly (≈ 59 631 ms worst case); NFR-009 MET at 59.5 s (SE, pending QE); PASS (PASS_WITH_RISKS), no required fix; SEC-221-a/b INFO; SE-221-b opinion | EPIC-009 | — | NFR-004 (text, owner's Q5 …a67f71ac, …3dd61448, ADR-0052 § Consequences); NFR-009; AR-NFR004-A; AR-UCI-BUSY (ADR-0052 D7, ADR-0044 D5); NFR-008 (QE's G8); NFR-010 (read) | grugops/secnfr-ABC-221 @ 787820c3 (plans/nfr-catalog.md: NFR-004 Target + Verified by, NFR-009 Verified by, AR-UCI-BUSY bullet, 1 _Updated line, closing section); .grugops/context/secnfr-ABC-221/notes/ (decision …ef060512, observation …8881d726) | none run (records only); readings cited from se-ABC-221 …af63269c (A10, A11 row 2, informal G8), …563fc63b (census) | — (ABC-221 UAT signed by the QE verdict) | — | ABC-221 → Ready for UAT after QE's verdict (Orchestrator); merge is a human's |
