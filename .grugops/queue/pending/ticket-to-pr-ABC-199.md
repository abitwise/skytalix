---
subtask: ticket-to-pr-ABC-199
role: software-engineer
ticket: plans/tickets/ABC-199-two-coverage-heavy-rows-time-out-at-vitests-5-s-default-under-load-lighten-them-and-keep-the-timeout.md
ref: .grugops/context/ticket-to-pr-ABC-199/
inputs: BA/PM …479ce351, …1563f813 (bapm-rule-QE-198); QE …0751bfeb (qe-ABC-198); owner ruling …6e1d9b47 (lighten, never raise the timeout); ABC-173 precedent
width: 2 (beside bapm-next-slice, records only)
---

# Build ABC-199: lighten two rows, add no timeout

## Do
- Create worktree `../wt-ABC-199` on `grugops/ABC-199` from `main`. Install its own `node_modules` with `npm ci --ignore-scripts`; never run npm in main's checkout.
- Build exactly to the page's criteria:
  - node counts at most 60 % of base;
  - K1–K4 red at the tip wherever they are red at base;
  - no added `timeout`;
  - test counts unchanged;
  - the written fallback applies if a row cannot get lighter without losing a kill.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success; skip-count capture → `test-skip-integrity.js`; `UCI_DEEP`. Heap 128 multi-file, 400 one-file. The UAT waiver form must print nothing.
- **No timing claims and no NFR-008 readings.**
- **Merge order:** ABC-199 merges only after ABC-178, so ABC-178's timing hop reads a tree without it. Do not merge into `main`. If `main` gains ABC-178 while you work, merge `main` in (a merge, not a rebase).
- Before every heavy run, check with `pgrep -fl '[v]itest'`. If a run named `qe-timing-ABC-178` is active, pause until it finishes.

## Fences
- Only the two files the page names. No `package*.json`, `tools/`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se199/`. Never push, force, amend or rebase.

## Publish
- Seal notes via the plugin writer (task `ticket-to-pr-ABC-199`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief, then move it to `done/`.
