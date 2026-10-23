---
subtask: ticket-to-pr-ABC-197
role: software-engineer
ticket: plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
ref: .grugops/context/ticket-to-pr-ABC-197/
inputs: BA/PM re-rule …4bb78960, …b4d5793f; Architect …578a9290 (F = 0.070 s, the dated block on the page); Security/NFR …d0c770b5 (headroom 0.990 s); QE-178-f (…931fad2b, optional QP1d)
width: 2 (beside qe-ABC-201)
---

# Build ABC-197 (R2): one step-100 UCI row restores the 100 ms dropped-token budget band

## Do
- Create worktree `../wt-ABC-197` on `grugops/ABC-197` from `main`, with its own `npm ci --ignore-scripts`. Never run npm in main's checkout.
- Build exactly to the page: the row's shape and criteria, red-first on its named plants, and the Architect's dated block (pre-register A6 with F = 0.070 s, not `16pct`). QE-178-f's QP1d is optional, as the Orchestrator ruled.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` (expect 61 files / 2 019 tests if one row is added); skip capture → `test-skip-integrity.js`; `UCI_DEEP`. Heap 128 multi-file, 400 one-file. The UAT waiver form must print nothing.
- **No timing claims.** A6 (N8-LANE) and A7 (NFR-008) are taken by a later quiet-host QE timing hop.
- The page's cost line still cites the old 0.605 s headroom; the current figure is 0.990 s (`…d0c770b5`). Note it, and do not edit the estimate.

## Fences
- Only the file(s) the page names. No `package*.json`, `tools/`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se197/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `ticket-to-pr-ABC-197`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
