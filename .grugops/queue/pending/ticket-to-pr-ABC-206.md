---
subtask: ticket-to-pr-ABC-206
role: software-engineer
ticket: plans/tickets/ABC-206-the-search-runs-faster-with-identical-answers.md
ref: .grugops/context/ticket-to-pr-ABC-206/
width: 3 of 3
---

# Build ABC-206: faster search, identical answers

## Do
- Worktree `../wt-ABC-206` on `grugops/ABC-206` from `main`, own `npm ci --ignore-scripts`. Never run npm in main's checkout.
- Build to the page's `## Design ruling` as three commits (i) leaf, (ii) captures-only quiescence, (iii) givesCheck — each value-identical and droppable. A1 differential (the Architect's probe scripts are a starting point) and A2 rows/count guards at each commit. Stay out of `engine.test.ts` and the five test files ABC-205 re-pins.
- Gates: lint, typecheck, build; `npm test` + `last-run.json`; skips; perft deep lane if the page names it. **No timing readings** (A4 is QE's, alone). Any existing red outside the ruling → STOP to Architect.
- OD-206-1 is open with the owner: build all three pieces; the merge waits on his answer.

## Fences
- Only files the ruling names. No `package*.json`, ADRs, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se206/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `ticket-to-pr-ABC-206`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
