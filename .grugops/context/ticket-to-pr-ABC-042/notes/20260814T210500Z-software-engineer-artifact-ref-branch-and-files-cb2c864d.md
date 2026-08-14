---
id: 20260814T210500Z-software-engineer-artifact-ref-branch-and-files-cb2c864d
kind: artifact-ref
by: software-engineer
at: 2026-08-14T21:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - EPIC-006
  - src/cli.ts
  - src/cli-options.ts
  - src/cli.test.ts
  - src/history-pane.nfr.test.ts
  - package.json
  - AGENTS.md
supersedes: 
---

# What was produced, by reference

## Branch and commits

- **Branch:** `grugops/ticket-to-pr-ABC-042`, branched from **`main @ 7df25b9`** (the subtask named
  `5b85d31`; `main` had moved, and the move touches **zero** bytes under `src/` — verified).
- **Commit 1 — the delivered change:** `e140355` *feat(ABC-042): grug make one command print board,
  and grug not call it game*. `git diff --name-only 7df25b9 e140355` is **exactly** the six paths
  `A12` names.
- **Commit 2 — the queue and context state** Workflows 16 and 17 require: the claim record, the
  subtask's `pending -> claimed -> done` transition, and these notes. **No code.**
- **No push, no PR, no merge, no deploy.** This repo has no remote; `autonomy: pr` means branch +
  gate here. The merge is the Orchestrator's to sequence and the human's to hold.

## Files

| file | what it is |
|---|---|
| `src/cli.ts` | **NEW, 93 lines.** The entry point. Exports nothing; reads `process.argv` once; supplies `process.stdout` as the `FrameSink`; writes the rejection message on `process.stderr` through its own byte filter; sets `process.exitCode` and never calls `process.exit()` |
| `src/cli-options.ts` | **NEW, 156 lines.** The pure resolver. One exported closed enumeration (`ACCEPTED_ARGUMENTS`), exact-string-equality membership, rejection as the default branch, `--colour random` resolved here, the orientation derived here. Names no ambient handle at all |
| `src/cli.test.ts` | **NEW, 690 lines, 29 tests.** Both modules. Ten children spawned once each at module scope with both channels piped; everything else is zero-spawn |
| `src/history-pane.nfr.test.ts` | **+7 −1.** The one licensed edit: `LICENSED_DRIVERS` gains `"cli.ts"` plus the citation Architect/Design supplied. Nothing else in the file |
| `package.json` | **+1 line.** `"chess": "node src/cli.ts"` under `scripts`. No `bin`, no `main`, no `files`, no `publishConfig`, no `dependencies`; `private` still `true` |
| `AGENTS.md` | `Dev / run: UNKNOWN - verify` -> `` `npm run chess` ``, with the argument surface and the "it prints a board, it does not play a game" limit beside it |

## Tests added

29, in one file: `A1` x2, `A2`, `A3`, `A4` x3, `A5` x2, `A6` x7, `A7` x2, `A8` x3, `A9` x3, `A10`,
`A12`, bar 1 (with bar 4 inside it), bar 3, and one that pins the spawn count at ten.

## Commands run, and their results

```
npm run lint          PASS  54 files, no fixes, 2 pre-existing infos
npm run typecheck     PASS  tsc --noEmit
npm test              PASS  856/856, 30 files   (827/29 at the base)
npm run build         PASS  tsc --noEmit
npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'   ->  0
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
                      PASS  "No findings.", exit 0
npm run chess         exit 0, 23 rows on stdout, ASCII on a pipe
```

## Not produced, deliberately

`plans/board.md` (the Orchestrator's and the human's), `plans/traceability.md` (owed, and `A12`'s
file list forbids it here), `plans/nfr-catalog.md` (`A11` says untouched), `plans/metrics.md`, any
ADR (`ADR-0012` is still the next free id), and any `§14-gate` stamp — **no `finding` is admissible
on this install and none was written.**
