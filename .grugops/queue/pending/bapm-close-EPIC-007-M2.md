---
subtask: bapm-close-EPIC-007-M2
role: ba-pm
ticket: plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
ref: .grugops/context/bapm-close-EPIC-007-M2/
width: 2 (records only; disjoint files from arch-adr0007-bin-note)
---

# Close EPIC-007's M2 on the owner's acceptance (records only)

## Do
- The owner closed M2 (one En Croissant game) on his existing acceptance of ABC-168 A8–A10 (`…d3681daa`, citing `…0b63d92f` and your `…2fddb7fa` recommendation).
- Add one dated insertion to the EPIC-007 page: M2 closed by acceptance, not read (no agent observed a game; say so plainly). M1 and M8(a) stay open until `cutechess-cli` is on the host; then one XS agent-run QE reading ticket, as your `…2fddb7fa` describes. EPIC-007 stays open (status/column unchanged). Update `RISK-EPIC007-02` wording only if it names M2 as open.
- Do not cut the M1/M8(a) ticket now unless you judge a Backlog page with an install trigger is the cleaner record; if so, say why.

## Fences
- Work on `grugops/bapm-close-EPIC-007-M2` (worktree `../wt-bapm-close-EPIC-007-M2` from `main`). Only the EPIC-007 page and your notes. No `src/`, `memory-bank/50-decisions/`, `plans/board.md`, `plans/traceability.md`, `.grugops/factory.config.json`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm007/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-close-EPIC-007-M2`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
