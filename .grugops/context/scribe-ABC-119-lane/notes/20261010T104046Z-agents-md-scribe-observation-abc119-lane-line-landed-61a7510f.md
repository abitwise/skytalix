---
id: 20261010T104046Z-agents-md-scribe-observation-abc119-lane-line-landed-61a7510f
kind: observation
by: agents-md-scribe
at: 2026-10-10T10:40:46Z
verified_by:
confidence: high
refs:
  - ABC-119
  - ABC-127
  - ABC-109
  - QE-119-b
  - AGENTS.md
  - .grugops/context/ticket-to-pr-ABC-119-r2/
  - .grugops/context/qe-ABC-119/
supersedes:
---

# `AGENTS.md` § Commands § Test — `ABC-119` real-engine CLI lane line landed

Hand-authored per `agent-factory/contracts/context-note.md`: no sanctioned writer on this install and
`context.human_admission` is `off` (`AGENTS.md`'s own recorded fact). Branch
`grugops/scribe-ABC-119-lane`, from `grugops/wave-2026-09-25` @ `f76e041d`. Code commit `46c986f7`.
Not merged, not pushed.

## What changed (`AGENTS.md` only, +4 / -0 lines, commit `46c986f7`)

One list item, inserted after the PVS/LMR deep lane and before `Test (single file)`. It is the Engineer's
drafted line (`…2409b286`) with three edits: the RUN receipt now carries my own reading next to QE's
(`…bc7d8341`); the children range reads 3099-3147 ms (mine 3099 / 3103, QE 3116-3147); and the trigger
is the one QE-119-b asked to see written where a reader of `AGENTS.md` finds it:
**"Run at QE and after any src/cli.ts or src/engine.ts change."** QE-119-b (LOW) is closed by this line.

```
- Real-engine CLI lane (opt-in, ABC-119): `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`
  <!-- RUN 2026-10-10: exit 0, 7 passed (1 default), 6.4 s at load1 4.4 (QE: 6.3-6.5 s at load1
  15-18); two real children of `node src/cli.ts --colour black --ascii`, 3099-3147 ms each. Unset:
  NOT DEFINED, not skipped. Run at QE and after any src/cli.ts or src/engine.ts change. -->
```

## Size against the cap (`ABC-109`, 24 576 B)

- Wave tip `AGENTS.md`: 23 879 B. Branch: **24 264 B** (+385). Headroom 312 B.
- Scratch merge with `grugops/ABC-127-harder-puzzles` (`git merge-tree --write-tree`, no ref written):
  `AGENTS.md` auto-merges with no conflict, **24 433 B** (ABC-127 adds +169). Headroom **143 B**. Both fit; STOP not needed.
- The edit sits after the PVS/LMR comment (wave line 126), below the `PUZZLE_DEEP` comment (lines 113-121), outside ABC-127's hunk and its context.
- **Headroom is thin.** The next `AGENTS.md` addition beyond ~140 B after both land trips the `ABC-109` A5 guard.

## Readings (RUN by me on the branch, 2026-10-10)

- `npm run lint`: exit 0, 98 files. `npm run typecheck`: exit 0.
- `npm test` (`CLI_DEEP` unset): exit 0, 51 files / 1541 tests, 6.40 s. The `AGENTS.md` guards in `src/cli.test.ts`
  (`ABC-065` slot, `ABC-109` A5 byte budget) are inside it and green.
- `node tools/grugops/lane-inventory.js`: exit 0, "The lane collects 51 test files; git tracks 51. No findings."
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: exit 0, 7 passed, 6.36 s, load1 ~4.4; children 3099 and 3103 ms.

## Left alone

Every other test-count receipt (`Test (all)` still reads 50 files / 1539 from 2026-10-09; the tree is 51 / 1541)
— outside the brief, owed to a later Scribe pass. `NFR-008`'s variable list (six names missing, `CLI_DEEP` added) is
Architect/Design's. Not touched: `src/`, the board, the ticket, the ABC-127 branch.

## Merge note (not mine to fix)

`plans/traceability.md` already conflicts between the wave tip and `grugops/ABC-127-harder-puzzles` (both append rows at the
tail and add an `_Updated` line); this ticket's row lands in the same tail zone. The Orchestrator resolves at merge, keeping both sides' rows.
