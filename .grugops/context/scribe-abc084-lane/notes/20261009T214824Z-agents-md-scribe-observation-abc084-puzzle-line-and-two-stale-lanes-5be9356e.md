---
id: 20261009T214824Z-agents-md-scribe-observation-abc084-puzzle-line-and-two-stale-lanes-5be9356e
kind: observation
by: agents-md-scribe
at: 2026-10-09T21:48:24Z
verified_by:
confidence: high
refs:
  - ABC-084
  - ABC-086
  - ABC-109
  - AGENTS.md
  - .grugops/context/ticket-to-pr-ABC-084/
  - .grugops/context/wave-2026-09-25/notes/20261009T205550Z-orchestrator-decision-b61e0d35.md
supersedes:
---

# `AGENTS.md` § Commands § Test — `ABC-084` `A8` landed, two stale lines refreshed

Hand-authored per `agent-factory/contracts/context-note.md`: no sanctioned writer on this install and
`context.human_admission` is `off` (`AGENTS.md`'s own recorded fact). Branch
`grugops/scribe-abc084-lane`, from `grugops/ABC-084-puzzle-suite` @ `e426e91`. Not merged, not pushed.

## What changed (`AGENTS.md` only, +15 / -4 lines)

1. **Puzzle-suite line added** after the quiescence deep lane. Carries `A8`'s four items: the command
   (`PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`); the owner's file list **verbatim**
   from note `…b61e0d35` (`src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`,
   `src/quiescence.ts`, `src/transposition.ts`, move ordering); "red = QE FAIL"; the baseline rule
   (own commit, stated reason, no trigger-list file, raise is QE's, lowering needs the owner's
   word). Adds one fact the Engineer's draft lacked: not a `quality.mandatory_gates` entry.
2. **`Test (all)` comment**: RUN 2026-10-09, exit 0, 50 files, 1539 tests, 6.66 s (was 47 / 1446).
3. **`ENGINE_DEEP` comment**: was "23 passed (17 default), 98.7 s" — stale since `ABC-086`. Now 45
   passed (32 default), 318.6 s wall, plus "run after any `src/virtual-clock.ts` change".

## Readings (RUN by me on this base, 2026-10-09)

- `npm test`: exit 0, 50 files / 1539 / 0 failed, 6.66 s (7.1 s real); re-run after the edit: same.
- `ENGINE_DEEP=1 npx vitest run src/engine.test.ts`: exit 0, 45 passed, **318.6 s** (319 s wall),
  **load1 10.0 at start, 7.6 at end** — QE and Security/NFR were running tests on this machine at the
  same time. The `ABC-086` receipts at load1 ~7-8 read 291.9 s and 291.4 s, so the lane is about 5
  minutes, not the ~100 s the line said; the line records the loaded reading and the quiet one.
- `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`: exit 0, 12 passed, 17.3 s at load1 ~11
  (Engineer: ~13 s quiet). Default lane: 9 passed. `PUZZLE_DEEP=weakened`: 10/40, exit 1 (1 failed, 10
  passed of 11), 20.9 s wall in-run — the red demonstration exits 1 by design, as the line says.
- `npm run lint`: clean.
- `wc -c AGENTS.md`: **23 464 B** (was 22 451; +1 013). Cap 24 576 B (`ABC-109`): 1 112 B headroom.
  The runnability guard tests are inside `npm test` (1539 green).

## Left alone

The transposition `ENGINE_DEEP` line (26 passed / 4.8 s) and every other lane line: outside the brief,
not re-measured here. Timing figures above are load-dependent; none is a gate.
