---
subtask: security-nfr-ABC-178
role: security-nfr
ticket: plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
ref: .grugops/context/security-nfr-ABC-178/
branch: grugops/qe-timing-ABC-178 (d9308e4f; merge 00f77f26)
width: 1 (records only; quiet window still held for the timing hops that follow)
---

# Rule the NFR-008 state after ABC-178's B7/B8 readings

## Do
- Read QE's timing notes in `grugops/qe-timing-ABC-178` (`…22b92995` preconditions, `…03c392fc` B7, `…25efab27` B8, `…39e59d96` verdict) and the probe folder.
- Rule the `NFR-008` state and the `N8-LANE` charge for ABC-178, as the page asks. QE's readings:
  - B8: H at 9.010 s [8.86, 9.03]; B, `main` on vitest 4.1.12, at 8.985 s.
  - B7: +0.010 s CPU, MET; the provisional floor F is 0.654 s.
  - Rule on whether the floor caveat matters.
- Record the published headroom now (10 s minus H), for later tickets such as ABC-200, ABC-197 and ABC-201 to read. If `plans/nfr-catalog.md` is yours, add one dated insertion and leave the bars untouched.
- **Records only. No runs:** the host stays quiet for the timing hops that follow. Be quick.
- Result: PASS, PASS_WITH_RISKS or FAIL.

## Fences
- Work on `grugops/security-nfr-ABC-178` (worktree `../wt-security-nfr-ABC-178` from `main`). No `src/`, `tools/`, `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec178/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `security-nfr-ABC-178`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**PASS_WITH_RISKS** (Security/NFR, 2026-10-23, branch `grugops/security-nfr-ABC-178` @ `dae5b1e1`, records only: no vitest, no lane, no timing, no probe).

- **`NFR-008` (R-1): MET, 9.010 s** median wall [8.86, 9.03] on merge `00f77f26`, **with no flag**: thermal 0 in 8/8 rounds, 0 foreign polls, AC 36/36, load1 ≤ 8, all four arms, pre-registered, vitest 4.1.12. It supersedes `ABC-177`'s warm 9.395 s as the latest verdict. `main` (B) reads 8.985 s. `ADR-0035` D6 does not fire. It carries to the merged tree only while the lane-input diff `00f77f26` → merged `main` is empty (empty at `be4e1f73`).
- **`N8-LANE` (B7): MET.** H−B CPU +0.010 s [−0.010, +0.020] against 650 ms, R 0.030 s.
- **Floor caveat: it does not change the state.** F is a cut-time rule. The state test (R ≤ b, median ≤ b) does not read F, and this window's R (0.030 s) is 22× under the bound. **It matters going forward:** the set's provisional F (0.654 s) is stale. There are two admissible twins (R 0.070 s at `ABC-177` A8, R 0.030 s here), so F is 0.070 s or 0.030 s (`UNKNOWN - verify`). Until F is re-read, `ABC-197`'s 650 ms bound on this same set fails a strict cut check. That is **`R-178-1` (LOW, owner Architect/Design)**: re-read it before `ABC-197`'s timing hop is pre-registered.
- **Published headroom: 0.990 s** to W on H (10.000 − 9.010), ≈ 9.9 × the wall R. **0.190 s** to `ADR-0046` D4's 9.2 s. On `main`: 1.015 s / 0.215 s. For `ABC-199`, `ABC-200`, `ABC-197` and `ABC-201`. Each later lane-input merge spends it on an estimate until the lane is read again.
- **`R-177-1`: CLOSED.** Its condition ("the next Security/NFR gate that reads the full lane under its own pre-registration") is met, and the reading is thermal 0.
- **Security:** not triggered. `src/uci-session.test.ts` +9, 0 removed lines. No production byte.
- **Required fixes:** none. **Accepted risks:** `R-178-1` (LOW, Architect/Design).
- **Catalog:** one dated insertion in the `NFR-008` `Target` cell. Removing it recovers the old file exactly. All other rows are byte-identical. No bar, F or W moved.
- **Notes** (`.grugops/context/security-nfr-ABC-178/notes/` on my branch, sealed by grugops 2.1.0 `admitAndAppend`, read back as 2 notes with seal ok, index rendered): `20261023T072556Z-security-nfr-observation-d4582dad` (the readings and the headroom); `20261023T072556Z-security-nfr-decision-d0c770b5` (the rulings and the result).
- **Not touched:** `src/`, `tools/`, `package*.json`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` (the row below is for the Orchestrator), the ticket page. No column moved. Recommended: `In Security/NFR` → `Ready for UAT` (UAT waived, 0 production lines). Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-178 (security-nfr) | Security/NFR gate: NFR-008 MET 9.010 s on 00f77f26 (clean: thermal 0 8/8, 0 foreign, AC, 4 arms; B 8.985 s); N8-LANE MET +0.010 s CPU; floor caveat does not change the state (F stale, R-178-1); R-177-1 closed; published headroom 0.990 s to W, 0.190 s to 9.2 s | EPIC-007 | B7, B8 | NFR-008; N8-LANE; ADR-0035; ADR-0046 D4; R-177-1 (closed); R-178-1 | `grugops/security-nfr-ABC-178` @ `dae5b1e1` (records only)<br>`.grugops/context/security-nfr-ABC-178/notes/` (…d4582dad, …d0c770b5) | records only; QE readouts at `d9308e4f` cross-checked (n8-a1 174/174a, full-a1 174b); lane-input diff a93c1e72..be4e1f73 empty | — | — | PASS_WITH_RISKS (no required fixes; R-178-1 LOW, owner Architect/Design); UAT waived (0 production lines); column move and merge are the Orchestrator's |
