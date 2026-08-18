---
id: 20260819T112000Z-software-engineer-observation-abc037-gate-security-and-lane-cost-e5a7c9d1
kind: observation
by: software-engineer
at: 2026-08-19T11:20:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - ABC-108
  - NFR-008
  - NFR-003
  - N8-LANE
supersedes:
---

# The gate, the three security bars, and a lane cost that is REPORTED and not claimed

## Gate — full blocking gate, run in a contained agent worktree

`ls -a .claude/` in this worktree shows **no `worktrees/` directory**, so the recorded `npm test` and
`npm run lint` commands work correctly here and were run AS RECORDED. The repo root's contamination
(`ABC-050`) was not chased.

| step | result |
|---|---|
| `npm test` | **exit 0 — 39 files / 1175 tests, 0 failed** (baseline in the same tree with the two new files moved out: **38 files / 1152 tests**, which reproduces the orchestrator's figure exactly) |
| skip count (`--reporter=json`, `jq '.numPendingTests + .numTodoTests'`) | **0** |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |
| `npm run lint` | **exit 0 — 70 files checked** |
| `npm run typecheck` | **exit 0** |
| `npm run build` | **exit 0** |
| `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **exit 0 — 32/32, 37.62 s** |
| `INPUT_DEEP=1 npx vitest run src/line-input.test.ts` | **exit 0 — 26 passed** (23 in the default lane) |
| `A8` from git | `src/line-input.ts` **232/0**, `src/line-input.test.ts` **771/0**, nothing else under `src/`; `src/turn-loop.ts` and `src/frame.ts` byte-identical by blob hash `9334daf1…` / `6d2a8685…` on both sides |

## Lane cost — REPORTED, and `N8-LANE` explicitly NOT claimed met

`ABC-108` (P1) records the default lane at or over `NFR-008`'s 13 s CPU clause, and it did so before
`ABC-078` arrived. **A 5% slice of a spent total is not a slice**, so `N8-LANE`'s 650 ms is not
granted to this ticket and this ticket does not assert it.

Protocol: paired, interleaved, **n = 7**, `RUSAGE_CHILDREN` user + sys around `npm test`, the two new
files moved out of the tree and back for the paired half of each round.

```
round 0 WITH 14.26  WITHOUT 14.08      round 4 WITH 14.80  WITHOUT 14.51
round 1 WITH 14.35  WITHOUT 14.13      round 5 WITH 14.73  WITHOUT 14.55
round 2 WITH 14.54  WITHOUT 14.38      round 6 WITH 14.81  WITHOUT 14.67
round 3 WITH 14.67  WITHOUT 14.57
```

- **Median paired delta: `+0.185 s` CPU. Sign 7/7 positive** — the delta is real, not noise.
- Median lane: **14.51 s WITHOUT / 14.67 s WITH**. Wall: **2.72 s / 2.90 s**.
- **The lane was already 14.51 s before this ticket touched it**, which is `ABC-108`'s point measured
  again from a different tree: `NFR-008`'s 13 s CPU clause is breached with or without this work, and
  its 3 s wall clause is at **2.90 s** with this file — 0.10 s of headroom.

The ticket page priced this file at ≈160 ms as arithmetic over the published floor. Measured: 185 ms.
The page's arithmetic was close and slightly low.

**Breadth is behind `INPUT_DEEP=1`** and, unset, the deep cases are **NOT DEFINED** rather than
skipped — the `PERFT_DEEP` / `SEARCH_DEEP` / `ENGINE_DEEP` shape — so the gate's skip count stays 0.
It costs 26 ms above the default lane when opted into.

## Security — the three bars, each measured, plus the firing threshold

**The trigger was NOT waived and was not treated as pre-cleared.** Two ordering blockers going away
changes nothing about this half.

1. **The read line is data, never code. MET.** Zero occurrences in the delivered module of `eval`,
   `Function`, `require`, dynamic `import(`, `child_process`, `exec*`, `spawn*`, `fetch`, `writeSync`,
   `node:`, `process`, `console`, `globalThis`, `Buffer` — asserted by a token scan of the delivered
   file with comments stripped, plus an import-set assertion of exactly four relative project modules.
   The line is passed to `resolvePromptLine` as a string and is never interpreted as anything else.
2. **Unbounded input is bounded. MET at the cap, with one honest hole in the retention proof.**
   **The cap is 1024 characters** and it is stated in the test rows. A 1024-character line reaches the
   resolver (the boundary is not off by one — `M4` reds 1); a **1025**-character line resolves
   `{ kind: "rejected", messages: ["line too long", "max 1024 chars"] }`, reaches **no** resolver
   (`texts` empty, `legalMoves` 0), and cannot grow the frame — both message items are ≤ 14 columns
   against the narrowest board-only frame's `W` of 18, and `rejected` is a non-advancing outcome. A
   16 MiB unterminated flood is survived, rejected, kept from every resolver, and recovered from on
   the next line. **The one thing NOT proved by test is the retained-BYTES bound** — see the mutant
   ledger: `heapUsed` was measured incapable of seeing the leak and that assertion was deleted rather
   than kept green. The bound is a construction argument in `absorb`.
3. **Every byte to the terminal goes through the frame's sanitizer. MET.** This module writes the
   prompt and nothing else — a hostile line `\x1b[2J\x1b[Hzz\x07` produces output writes of exactly
   `"> "` with zero `\x1b`. The typed line is never echoed by this module at all. The one door
   anything player-derived can take is `assembleFrame`, and the test drives that hostile string
   through the real `assembleFrame` and asserts every returned row is free of `[\x00-\x1f\x7f]`.

**Firing threshold — NOT fired.** The diff touches no file under `src/` beyond this module and its
one test file. `package.json` is unchanged and **still has no `dependencies` key at all** — asserted
in the suite as `"dependencies" in manifest === false`, absent rather than `{}`, re-verified today.
**The module imports zero Node builtins** — fewer than the one the threshold permits.

## `NFR-003`

Owned here and by no other ticket in the epic. Carried as `A7`'s counts: **0** derives per keystroke,
**1** per submitted line, asserted by spy over `MoveInputDeps`. **No wall clock is asserted in this
suite**, per the standing rule (`src/gameend.nfr.test.ts:16-17`); the < 50 ms reading is a
`plans/nfr-catalog.md` entry with its machine and is not produced here.
