---
subtask: arch-design-ABC-206
role: architect-design
ticket: plans/tickets/ABC-206-the-search-runs-faster-with-identical-answers.md
ref: .grugops/context/arch-design-ABC-206/
width: 3 of 3 (beside arch-design-ABC-205 and ticket-to-pr-ABC-212)
---

# Design ruling for ABC-206 (faster search, identical answers)

## Do
- Rule the leaf's shape (one move generation per leaf; captures-only generation in quiescence; check detection without playing the move in LMR) and any test-only door or export, so the identity sweep (same move, score, nodes, clock checks) holds. Name the merge-order/conflict plan with ABC-212 (`HARD_CEILING_MS` in `src/engine.ts`) and ABC-205.
- Light probes on a scratch copy only. A NEW ADR or a change to an accepted one is PROPOSED and STOPs to the owner; an NFR-001 leaf-clause change is the owner's too. Dated `## Design ruling` on the page; recommend the next move.

## Fences
- Worktree `../wt-arch-design-ABC-206` from `main`. Only the ABC-206 page, a proposed ADR if needed, your notes. No `src/`, tests, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/design206/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `arch-design-ABC-206`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
