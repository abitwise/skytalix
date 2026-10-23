---
subtask: arch-floor-reread
role: architect-design
ticket: plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
ref: .grugops/context/arch-floor-reread/
inputs: Security/NFR …d0c770b5 (R-178-1, the stale provisional F 0.654 s for src/uci-session.test.ts) and …f636dfd0 (ABC-200's new 5-file set, provisional F 1.316 s above the bound, first twin R 0.050 s); QE timing …03c392fc; ADR-0035 D2
width: 2 (beside qe-ABC-201)
---

# Re-read the per-set floor F for the two sets whose provisional F is stale (R-178-1), so ABC-197's timing hop can be pre-registered

## Do
- For `src/uci-session.test.ts` (ONE-FILE): rule F from the admissible twins (R 0.070 s from ABC-177 A8, and R 0.030 s here). Rule whether the vitest 4.1.11 → 4.1.12 bump starts a new series.
- For ABC-200's 5-file set: record its first admissible twin (R 0.050 s), and say whether a provisional F stands or one more window is owed.
- Check ABC-197's 650 ms bound against the ruled F, as a cut check. If ABC-197's page needs an amendment, write it as a dated block. If any bound would move, that is an NFR-bound change: STOP and write it as an owner question.
- Records only. No runs.

## Fences
- Work on `grugops/arch-floor-reread` (worktree `../wt-arch-floor-reread` from `main`). Records only. No `src/`, `tools/` or `package*.json`. On `plans/board.md`: one `_Updated` line. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/archF/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-floor-reread`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
