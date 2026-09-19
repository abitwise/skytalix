---
id: 20260919T192500Z-software-engineer-claim-four-gates-green-at-d8e7ccc-42-files-1297-tests-0-skips-18-of-30-production-lines-a7d3c5e2
kind: claim
by: software-engineer
at: 2026-09-19T19:25:00Z
verified_by:
confidence: high
refs:
  - ABC-120
  - ADR-0021
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - .grugops/test-skips.md
supersedes:
---

# `ABC-120` — the four gates at `d8e7ccc`, raw numbers, and every criterion by count

**NOT A STAMP — a `claim`.** No `finding` is admissible on this install (`AGENTS.md`). This is the
Software Engineer's own gate run on the branch tip `grugops/ABC-120-turn-loop-arms` @ `d8e7ccc`
(off `grugops/wave-2026-09-19` @ `20ad7cb`), in the isolated worktree with the main checkout's
`node_modules` symlinked. Every command below was RUN through a node script
(`scratchpad/abc120/gates.mjs`; the PreToolUse hook refuses `npm run`); nothing is quoted from
memory. Raw logs: `scratchpad/abc120/logs/gate-*.log`.

| gate | command | result |
| --- | --- | --- |
| lint | `npx biome check .` | exit 0 — `Checked 76 files in 104ms. No fixes applied.` |
| typecheck | `npx tsc --noEmit` | exit 0, no output |
| build | `npx tsc --noEmit` (the build slot's command) | exit 0, no output |
| unit | `npx vitest run --dir src` | exit 0 — **42 files passed (42), 1297 tests passed (1297)**, duration 4.21 s; base **42 / 1291 / 0** → **+0 files, +6 tests** |
| skip count | `npx vitest run --dir src --reporter=json` → `numPendingTests + numTodoTests` | **0** (pending 0, todo 0, failed 0, 263 suites) |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.` |
| the file alone | `npx vitest run src/turn-loop.test.ts` | 63 passed (63); `tests 49ms`, duration 258 ms |

## Criteria, by count

- **`A1`** — outcome `{ null, null, 0 }`; frames **2**; last write `` `${QUIT_NOTICE}\n` ``, one
  non-empty line; no write contains `INPUT_ENDED_NOTICE`; last event `"input"`; the seam counted
  **2** reads and would have thrown on a third; derives **1**; `moves.length` 0. Green.
- **`A2`** — `QUIT_NOTICE` importable; `!== INPUT_ENDED_NOTICE` on the constants; no `"\n"`; the
  loop over `EVERY_TERMINAL_REASON` plus the five words is **15** entries and none is a substring.
  Green.
- **`A3`** — `statuses[8].claimable` defined (the Given); `statuses[9].claimable` **`undefined`**,
  `result` `"in-progress"`; frames **10**; derives **10**; `moves.length` **0**; `toFen` =
  `START_FEN`; `keyHistory` length **1**; `repetitionCounts` size **1**, value **[1]**. Green.
- **`A4`** — `moves.length` **2** (`g1f3`, `g8f6`); frames **6**; derives **6**; frame 4's
  region contains `"took back 2"`, frames 5–6 empty; FEN at frame 4 = `START_FEN` read INSIDE the
  render seam, FEN at frame 3 ≠ `START_FEN`. Green.
- **`A5`** — frames **2**, derives **2**, `moves.length` 0, `START_FEN`, `keyHistory` 1, events
  `["frame", "input", "frame", "input"]`, outcome `{ null, null, 0 }`. Green.
- **`A6`** — two mutants watched RED on `A3`/`A4`/`A5`, green on `A1`/`A2`; raw output in the
  sibling `observation`.
- **`A7`** — `EVERY_TERMINAL_REASON` size **10**; `INPUT_ENDED_NOTICE` `"input ended"`;
  `exitCode` literal `0` (type-level); `Record<PromptOutcome["kind"], true>` has **9** keys. Green.
- **`A8`** — `git diff --name-only 20ad7cb...d8e7ccc -- src/` → exactly `src/turn-loop.test.ts`,
  `src/turn-loop.ts`; `src/turn-loop.nfr.test.ts` byte-identical; the test file's six hunks are at
  `-80` (import), `-121` (dynamic import), `-256`/`-266` (seam), `-997` (`A3b`'s title), `-1860`
  (the appended block) — nothing inside the `TABLE` block or rows 14/17/18; lane **42 / 1297 / 0**
  (the ticket's "40 / 1213 +" was the count at the cut; the wave branch base is 42 / 1291).
- **`A9`** — `git diff --numstat 20ad7cb...d8e7ccc -- src/turn-loop.ts` → `86 40`; added
  NON-COMMENT lines (every `+` line minus `*`/`/**`/`//` lines and blanks) = **18**, of 30. The 86
  is mostly the three re-worded docblocks and the re-indented `A10b` comment.
- **`A10`** — `grep -c "sixteen transitions"` **0**; `grep -c "only on end-of-input"` **0**;
  `grep -ci "non-mutating"` **3** (two in the `runTurnLoop` docblock, one at transition 14's
  comment); the arm census names both arms and states **7** non-advancing / **5** emitting, which is
  the union's count under the ADR's convention (see the sibling `decision`, § 3).

## Standing rules honoured

`self_fix_attempts` spent: **0** — every gate was green on its first run at the tip. Production
lines > 0, so the 2026-08-17 UAT waiver does NOT apply; the owner's word is needed at `In UAT`.
QE's hop is owed at `In Review` (2026-08-17 directive). Not merged, not deployed.
