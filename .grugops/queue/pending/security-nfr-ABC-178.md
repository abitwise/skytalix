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
