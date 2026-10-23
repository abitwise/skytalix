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

## Result
- Branch `grugops/scribe-standing-2026-10-22`, commit `86d3837c`, worktree `../wt-scribe-standing-2026-10-22`. Not merged, not pushed.
- `memory-bank/45-standing-rulings.md` +33 lines (10,725 -> 13,421 B): new section `## Dated entries (2026-10-22)` with four dated entries (ABC-189 R1 `…9d0dc304`; AR-1 premise re-read process rule `…1b62e80b`; AR-1 read from `…edd18e94` alone with pair-list diff; QE-198-a interim re-run rule `…479ce351`, which is in the brief's inputs but not its Do list) and one "Pending for the Release Manager" item (AR-1 check 4 `command diff`, `…e459881c`). The AR-1 record was not edited.
- `AGENTS.md`: unchanged (16,669 B of 18,432 B). No line is false because of these notes; no test run owed.
- Found, not changed: § Deployment posture of the rulings file still says "no `bin`/`main`/`exports`/`files`"; false for `bin` since ABC-168. Orchestrator to route (ADR-0007 is Architect/Design's).
- Notes (decision): `20261022T201857Z-agents-md-scribe-decision-a3aef2d3`, `20261022T201857Z-agents-md-scribe-decision-f1c2cf37`, sealed by `admitAndAppend`, in `.grugops/context/scribe-standing-2026-10-22/notes/` on the branch.
- Claim: bare `mkdir` of `claimed/scribe-standing-2026-10-22/` (no `claim.js` in the repo), 2026-10-22T20:18:09Z.

## Trace row
| 2026-10-22 | scribe-standing-2026-10-22 | memory-bank/45-standing-rulings.md (dated entries); AGENTS.md unchanged | notes `…a3aef2d3`, `…f1c2cf37` | commit `86d3837c` on `grugops/scribe-standing-2026-10-22` | no tests owed (docs only) | not merged |
