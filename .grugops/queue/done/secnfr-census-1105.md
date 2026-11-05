---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T11:49:20Z
subtask: secnfr-census-1105
role: security-nfr
ref: .grugops/context/secnfr-census-1105/
branch: new grugops/secnfr-census-1105 from main — worktree .claude/worktrees/secnfr-census-1105
width: reads and timing on main under the host lock; records only, no src or test edit.
---
# Row census of main after W1
Read the Orchestrator's decisions …f30bd604 item 3 and …42f7fd67 item 1, and the census of secnfr-nfr008-1104 and secnfr-ABC-302-a9 for method.
1. Graded default-lane read on main with W1 in, by the sealed method those hops used. PREREG sealed before any run; timing runs ALONE in one lock hold. Other work queues on the same lock, so release it between stages.
2. Census: where the lane's time goes, and a named list of rows that could move to deep lanes, each with its remnant, to find about −0.28 s for ABC-303 and ABC-289 and ABC-305's budget. Say if the supply falls short.
3. Say what gates: lane against 9.6 s, and whether the next lane-adding merge may go.
Keep the whole hop under 50 minutes of lock. If it would run longer, stop and report. Record any foreign load on the host; never touch it. Check every output file is non-empty before reading it.
Every test, build or engine run goes under the host lock named in your dispatch prompt.
Fences: your records only. No src, test, ticket, ADR, EPIC or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task secnfr-census-1105, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result
by: security-nfr (claude-opus-5-5), 2026-11-05T12:29:55Z. **PASS_WITH_RISKS.** PREREG `…b9038a14` sealed and committed (`a5f68a4d`) before any timing; probe plan `…1d72a218` sealed before the probe.
- **`NFR-008` MET, graded:** `main` `572edf13` H median **9.515 s** [9.31, 9.63], max 9.64 s. Twin admissible (CPU −0.040 s = 0.12 %, sign 4 / 8), n 8, k 2, ALONE in one hold, 0 foreign vitest in 86 samples. B `7117ce75` 9.405 s; H − B +0.015 s [−0.120, +0.200].
  - **Lines:** 10 s MET, headroom 0.485 s; 9.6 s below by 0.085 s; 9.5 s above by 0.015 s. `R-N8H-1` stays MEDIUM.
- **The first read was thrown out.** Session 1 was not ALONE: another project's vitest (`grugops`) ran through all 8 rounds, about 1.5 cores, outside this lock (`…6315faad`). Its 9.76 s grades nothing. The PREREG's one re-read is the grade. Nothing was touched.
- **What gates: G-WITH.** m + 0.10 = 9.615 s ≥ 9.6 s, so the next lane-adding merge (`ABC-303` or `ABC-305`) may go only with a row move merged first or in the same merge. It gates no build. It turned on 0.015 s, inside the noise, under a rule fixed before the read.
- **Census:** worker time is 43 % per-file start-up, 38 % rows, 20 % `src/cli.test.ts`'s collect children. That file's worker is no longer a critical path.
- **Rows:** nine rows, 750 ms in-thread, each with a proposed remnant: `qe-hop-integrity` A9, A3, A4 (together or not at all); `cli` A8′, ABC-241 A4 legal-ep, A7; `uci-session` ABC-171 A7, ABC-212 A9; `book` ABC-094 A3. Table in `…19cea480`.
- **Saving:** skip probe **−0.365 s [−0.49, −0.33], 8 / 8**, against the −0.31 s skip bar for the −0.28 s ask. **The supply reaches it, thinly:** forecast −0.30 s with this list's remnants, realised about −0.23 to −0.25 s against a −0.215 s need, landing 9.565–9.585 s with all three budgets spent. After it the row supply is spent. Remnants and kill parity are `UNKNOWN - verify`, for the Architect.
- **Other risks:** `R-N8H-2` LOW, 5 417 note files at `bffb23c4`, 83 short of 5 500, about 8–9 busy hours away. `R-N8H-3` INFO. New `R-CEN-1` LOW (foreign load voids timing reads; owner Orchestrator).
- **Owed:** the catalog's `NFR-008` line (outside this fence, not written); the row-move ticket.
- **Lock:** about 14 min of 50, in four holds, released between stages. `main` moved to `bffb23c4` meanwhile; over the lane inputs only `AGENTS.md` differs.
- **Notes:** `…b9038a14` (PREREG), `…6315faad` (session 1), `…1d72a218` (probe plan), `…e5e57903` (readings), `…19cea480` (decision). Commits `1ccac7f6` (claim), `a5f68a4d`, `aee5643c`, `fffcb0b3`, `567fab83`. No src, test, config, ticket, ADR, EPIC, board or catalog edit.
