---
subtask: rm-restate-AR-1-premise
role: release-manager
priority: P1 (ABC-056 bin trigger fired)
ref: .grugops/context/rm-restate-AR-1-premise/
inputs: Security/NFR …7d7b76ec §§ 2–3 and …a8796ea3 (task security-nfr-AR-1-premise); Orchestrator …32c61052, …1b62e80b; RM …130fb9a3 (task rm-restate-AR-1); AR-1 record …901f43b6 (rm-ABC-158); owner set …193e08fb
width: 1
---

# Re-state AR-1 in full: reason, premise check table 1–8, and triggers

## Do
- On a fresh clone of `main` @ the current tip (scratch `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/rm-ar1p/`; you may re-use `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec-ar1/bin/checks-v2.sh` read-only), run the revised checks 1–8 from `…7d7b76ec` § 3, and confirm each reads as expected.
- Adopt §§ 2–3, or replace them with stated reasons. Re-state AR-1 as one complete record that supersedes `…901f43b6`:
  - the advisory set: 3 pairs, LOW in context;
  - the revised reason;
  - the check table with commands;
  - triggers (1) advisory drift, (2) premise drift on checks 1–8, and (3) pair-list diff, not counts.
- Record the residual you own: a loader flag set outside the repo (LOW, accepted by the Orchestrator in `…32c61052`).
- **STOP condition:** if any check reads differently from expected, or any pair is HIGH in context, publish a `finding` and stop.

## Fences
- Records only. Work on `grugops/rm-restate-AR-1-premise` (worktree `../wt-rm-restate-AR-1-premise` from `main`). No edits to `src/`, `tools/`, `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Never run npm in main's checkout. No timing runs. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/rm-ar1p/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `rm-restate-AR-1-premise`), `at` from `date -u`, with a `kind: decision` that supersedes `…901f43b6`. Write `## Result` plus a 10-cell trace row into this brief, then move it to `done/`.
