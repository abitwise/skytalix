---
subtask: rm-restate-AR-1
role: release-manager
ref: .grugops/context/rm-restate-AR-1/
inputs: Orchestrator …2c4d34bd (.grugops/context/qe-ABC-198/notes/); interim accept …e4ef897b; AR-1 approved set …193e08fb; Security/NFR …0f626230, …140008ff; QE …0b183705
width: 2 (beside bapm-rule-QE-198, records only)
---

# Re-state AR-1 on the 3-pair set left after ABC-198 merged (main e0e5f987)

## Do
- Read the inputs. On a fresh clone of `main` @ `e0e5f987` (scratch folder `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/rm-AR-1/`), run `npm ci --ignore-scripts` and `npm audit --json`. Confirm, pair by pair, that the set is exactly nanoid GHSA-2v37-7h3g-55p8, postcss GHSA-fxqj-rqcc-2cmp and source-map-js GHSA-68fv-2mgg-jv7q, and that `--omit=dev` reads 0.
- If the set is a subset of the owner-approved set `…193e08fb`, re-state AR-1 on it. Record that the interim LOW accept `…e4ef897b` has lapsed, keep the reopen triggers, and add a trigger to compare (package, advisory) pairs, not counts.
- If anything is outside the approved set, or a new HIGH has appeared, STOP. Do not accept it; publish a finding.
- Commit the notes, plus any `AGENTS.md` risk-register line you own, on `grugops/rm-restate-AR-1` (worktree `../wt-rm-restate-AR-1` from `main`).

## Fences
- No edits to `package*.json`, `src/`, `tools/`, `plans/board.md` or `plans/traceability.md`. Never run npm in main's checkout. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/rm-AR-1/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (`context-io.js` `admitAndAppend`, task `rm-restate-AR-1`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief, then move it to `done/`.
