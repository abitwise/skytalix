---
id: 20261010T140110Z-agents-md-scribe-observation-command-log-reconciled-to-wave-tip-5e8eb0f8
kind: observation
by: agents-md-scribe
at: 2026-10-10T14:01:10Z
verified_by:
confidence: high
refs:
  - ABC-069
  - ABC-084
  - ABC-086
  - ABC-119
  - ABC-127
  - ABC-109
  - memory-bank/90-agents-md-command-log.md
  - .grugops/context/wave-2026-09-25/notes/20261010T132239Z-orchestrator-observation-handoff-2-7d3e1b84.md
supersedes:
---

# `memory-bank/90-agents-md-command-log.md` reconciled against `git log -- AGENTS.md` to the wave tip

Hand-authored per `agent-factory/contracts/context-note.md`: no sanctioned writer on this install and
`context.human_admission` is `off`. Branch `grugops/scribe-command-log-2026-10-10`, from
`grugops/wave-2026-09-25` @ `9128e7a3`. Not merged, not pushed. `AGENTS.md` NOT touched (`ABC-087` is
in UAT with its own edit).

## What changed (`memory-bank/90-agents-md-command-log.md` only, +~155 lines)

The log was last touched at `ea68a2d8` (2026-09-26). Four `AGENTS.md` commits since, each now with an entry
carrying the commit and the ticket (full ledger at the end of the log):

| commit | ticket | entry |
|---|---|---|
| `5a15fb4f` | `ABC-084` `A8` (+ `ABC-086` receipts) | new § Puzzle-suite strength gate; § Test (all) re-measured; § Engine deep lane refreshed (45 passed, 318.6 s / 291.9 s, trigger gains `src/virtual-clock.ts`) |
| `6117a2a4` | `ABC-069` | § Dev / run: the two WRITING RULES, the enforcer (`ABC-065` block, `ABC-071` count, `ABC-067` closure), QE's `N15`/`N16`, the guard not loosened |
| `f063ebce` (merged `d45a0261`) | `ABC-127` `A9` | § Puzzle-suite: 17 passed (12 default), 32-36 s / 20-24 s as the union of two hops' readings, baseline 58/62 and the four unsolved rows, `A7` never asserted, `R1`/`AR-PUZZLE-EDGE` left out on purpose |
| `46c986f7` | `ABC-119` (closes `QE-119-b`) | new § Real-engine CLI lane: what the two children hold, empty child env, trigger, receipts |

## Readings (RUN by me, 2026-10-10, wave tip `9128e7a3`, own worktree)

- `npm test`: exit 0, **51 files, 1584 tests**, 5.52 s (6.70 s on the post-edit re-run), load1 8.2 at start.
- `ENGINE_DEEP=1 npx vitest run src/engine.test.ts`: exit 0, **46 passed (33 default)**, 291.55 s, load1 13.1 -> 4.8.
- `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`: exit 0, 17 passed, 36.05 s, gating run 22.4 s, load1 4.3.
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: exit 0, 7 passed, 6.36 s, children 3097 / 3106 ms.
- `node tools/grugops/lane-inventory.js`: exit 0, 51 collected, 51 tracked, No findings.
- `npm run lint`: exit 0, 98 files. (`npm run typecheck` not run: no `.ts` change.)

## Two stale receipts found in `AGENTS.md` (NOT corrected here; owed to the next Scribe edit of it)

- `Test (all)` reads 50 files / 1539 (2026-10-09). The tree is 51 / 1584.
- `ENGINE_DEEP` reads 45 passed (32 default). The tree is 46 (33 default): `ABC-125` (`6a25164c`) added one row
  to `src/engine.test.ts`. Both are count-for-count edits, +0 B. The headroom note
  (`…decision-agents-md-headroom-…`) says when to apply them.

## Left alone

`ABC-087`'s `Levels deep lane` line (on its branch, not on the wave). Every other lane line: counts and
times untouched since their last receipt (`SEARCH_DEEP`, `ZOBRIST_DEEP`, `INPUT_DEEP`, transposition,
quiescence, PVS/LMR cite their dated receipts; not re-run, not stale by any change I found).
