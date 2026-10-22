---
subtask: scribe-standing-2026-10-22
role: agents-md-scribe
ref: .grugops/context/scribe-standing-2026-10-22/
inputs: BA/PM …9d0dc304 (bapm-rule-QE-189, reopen trigger R1); Orchestrator …1b62e80b (AR-1 premise re-read rule), …e459881c (AR-1 check 4 spelling), …b935fad8; BA/PM …479ce351 (QE-198-a interim re-run rule, ended when ABC-199 merges); Release Manager …edd18e94 (AR-1)
width: 1
---

# Carry today's standing rules into memory-bank/45-standing-rulings.md

## Do
- Add dated entries to `memory-bank/45-standing-rulings.md`. Each one cites its note id and does not restate it.
  1. ABC-189's reopen trigger R1, from `…9d0dc304`.
  2. The process rule from `…1b62e80b`: any ticket that adds a `bin`, a build output or a runtime dependency owes an AR-1 premise re-read before it is Done.
  3. AR-1 is read from `…edd18e94` alone, and the pair-list diff replaces the count (trigger 3).
- Record the AR-1 check 4 spelling fix (`command diff`, from `…e459881c`) as a pending item for the Release Manager. Do not edit the AR-1 record.
- Touch `AGENTS.md` only if an existing line there is now false. If one is, keep the file's size budget and the counts its tests pin. Run `npm test` in your worktree if you edit it.

## Fences
- Work on `grugops/scribe-standing-2026-10-22` (worktree `../wt-scribe-standing-2026-10-22` from `main`, with its own `npm ci --ignore-scripts` only if you run tests). No `src/`, `tools/` or `package*.json` changes. No timing runs. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/scribe1022/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `scribe-standing-2026-10-22`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
