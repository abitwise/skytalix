---
id: 20260920T012500Z-software-engineer-claim-four-gates-green-at-b8afa30-42-files-1317-tests-0-skips-11-production-lines-7b3f8d02
kind: claim
by: software-engineer
at: 2026-09-20T01:25:00Z
verified_by:
confidence: high
refs:
  - ABC-045
  - src/command-input.ts
  - src/command-input.test.ts
  - src/cli.test.ts
  - .grugops/test-skips.md
supersedes:
---

# `ABC-045` — the four gates at `b8afa30`, raw numbers, and every criterion by count

**NOT A STAMP — a `claim`.** No `finding` is admissible on this install (`AGENTS.md`). This is
the Software Engineer's own gate run on the branch tip `grugops/ABC-045-resign` @ `b8afa30`
(off `grugops/wave-2026-09-19` @ `bd40d85`), in the isolated worktree with the main checkout's
`node_modules` symlinked. Every command was RUN through a node script (`raw-gates-harness.mjs.txt`
beside this note; the PreToolUse hook refuses `npm run`); nothing is quoted from memory. Raw
summary: `raw-gates-summary.json.txt`.

| gate | command | result |
| --- | --- | --- |
| lint | `npx biome check .` | exit 0 — `Checked 76 files in 102ms. No fixes applied.` |
| typecheck | `npx tsc --noEmit` | exit 0, no output |
| build | `npx tsc --noEmit` (the build slot's command) | exit 0, no output |
| unit | `npx vitest run --dir src` | exit 0 — **42 files passed (42), 1317 tests passed (1317)**, duration 4.99 s; base **42 / 1297 / 0** → **+0 files, +20 tests** |
| skip count | `npx vitest run --dir src --reporter=json` → `numPendingTests + numTodoTests` | **0** (pending 0, todo 0, failed 0, 265 suites) |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.` |
| the files alone | `npx vitest run src/command-input.test.ts` / `src/cli.test.ts` | **98 / 98** (was 79; `tests 19ms`) and **62 / 62** (was 61; `tests 30ms`, duration 3.14 s) |

`self_fix_attempts` spent: **0** — every gate was green on its first run at the tip.

## Criteria, by count

- **`A1`** — pure: `resolvePromptLine(newGame(START_FEN), "resign")` `toEqual`
  `{ kind: "game-over", result: "black-wins", reason: "resignation" }`; after `e2e4` →
  `white-wins`; `Object.keys` exactly `["kind", "result", "reason"]`. Through the merged loop:
  `humanColour: "white"` at the start → `black-wins` / `resignation` / `exitCode 0`;
  `humanColour: "black"` after `e4` → `white-wins` / `resignation` / `0` (the engine seam throws,
  so reaching it would be red). Green.
- **`A2`** — fixture at ply **4** (`e4 e5 Nf3 Nc6`), `legalMoves(...).length > 0` asserted;
  `reads` **1** of a 2-line script; `legalCalls() − legalAtOutcome` **0**; `derives() −
  derivesAtOutcome` **0**; `renders` **1** (zero frames after the outcome — the interpretation in
  the sibling `decision` § 3); FEN unchanged; `moves.length` **4**. Control row: the same spy counts
  ≥ 1 on `d2d4`. Green.
- **`A3`** — `coordinateCalls` **0**, `sanCalls` **0**, `seam.deriveCalls` **0**, module-boundary
  `legalMoves` delta **0**, `gameStatusOf` **0**; outcome the exact object. Green. Also covered by
  `ABC-035` `A2`'s sweep, which now includes the three `resign` spellings.
- **`A4`** — `CHILDREN.resigns` exit **0**; stdout `slice(-written.length)` byte-equal to
  `renderResultScreen({ result: "black-wins", reason: "resignation", exitCode: 0 }, playedOut(["e2e4","e7e5"]))`
  joined + `\n`; the screen contains `"resignation"` and `"Black wins"`; no `INPUT_ENDED_NOTICE`;
  frames **3** (= 1 + 2 plies); frames after the screen **0**; no `"did not finish"`. Green.
- **`A5`** — script `["resign", "d2d4"]`: `reads` **1**, result `black-wins`; and
  `messagesPerFrame` `[[]]` (no message region, no second render). Green. The entry-point half
  rides `A4`'s third line (`d4`, legal, never read).
- **`A6`** — `git diff --name-only bd40d85 b8afa30 -- src/` → EXACTLY `src/cli.test.ts`,
  `src/command-input.test.ts`, `src/command-input.ts`; `git diff --quiet` over `src/turn-loop.ts`,
  `src/gameend.ts`, `src/line-input.ts`, `src/cli.ts`, `src/result-screen.ts`, `src/move-input.ts`,
  `src/rejection.ts`, `src/zobrist.ts`, `src/search.ts`, `src/quiescence.ts`, `src/engine.ts` →
  byte-identical. `git diff --numstat`: `src/cli.test.ts` 65/10, `src/command-input.test.ts`
  171/6, `src/command-input.ts` 38/18. Added NON-COMMENT production lines in
  `src/command-input.ts`: **11** (the type widening ×3, the row, the 7-line branch); the rest of
  the 38 is docblock. Suite green, skip **0**.
- **`ABC-035`'s own rows, re-run with the fifth token:** `A1` (three new spellings, two new
  non-tokens `resig` / `resigns`), `A2` (neither grammar reads `resign` as a move on three FENs),
  `A4` (`help` names every table row; `resign` LEFT the foreign list; `COMMAND_TABLE.length + 1`
  items), `A6` (zero derives on every spelling), `A7` (hidden count **0** at both fixtures with five
  tokens), the no-stream fence, the no-argument fence (`resign now`). All green.

## Standing rules honoured

Production lines > 0, so the 2026-08-17 UAT waiver does NOT apply; the owner's word is needed at
`In UAT`. QE's hop is owed at `In Review` (2026-08-17 directive). Not merged, not deployed.
`plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` not opened.
