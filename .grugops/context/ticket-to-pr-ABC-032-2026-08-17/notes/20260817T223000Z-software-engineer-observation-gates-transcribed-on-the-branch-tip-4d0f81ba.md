---
id: 20260817T223000Z-software-engineer-observation-gates-transcribed-on-the-branch-tip-4d0f81ba
kind: observation
by: software-engineer
at: 2026-08-17T22:30:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - A6
  - .grugops/test-skips.md
supersedes:
---

# Gates, run on the branch tip and transcribed

Branch `grugops/abc032-parse-san`, tip `c98b1e2`, base `main` @ `bf371d7`. Working tree clean at
the time of the run. **The Orchestrator re-runs these itself and holds the merge; nothing here was
merged and `main` was not touched.**

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | `Checked 59 files in 88ms. No fixes applied.` — exit 0, no errors |
| typecheck | `npm run typecheck` (`tsc --noEmit`) | exit 0, no output |
| build | `npm run build` (`tsc --noEmit`) | exit 0, no output |
| test | `npm test` | `Test Files 33 passed (33)` / `Tests 957 passed (957)`, duration 2.89s |
| skip count | `npx vitest run --reporter=json 2>/dev/null \| jq '.numPendingTests + .numTodoTests'` | `0` |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.` — exit 0 |
| perft deep (`A6`) | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | `Test Files 1 passed (1)` / `Tests 32 passed (32)`, duration 38.63s |

`.grugops/test-skips.md` was READ ONLY. It is human-owned and no agent may write a row into it; the
skip count is 0 and no justification was needed or authored.

## One red on the way, and what it was

The first `npm test` on this branch was `1 failed | 956 passed`. The failure was `src/san.test.ts`
`A20` — `ABC-013`'s module-surface row asserting `Object.keys(namespace)).toEqual(["toSan"])`,
which the new export necessarily moves. The second attempt (`["parseSan", "toSan"]`) also failed:
the namespace key order is DECLARATION order, not alphabetical. `["toSan", "parseSan"]` is green.
Recorded because the sequence is the evidence that the row was moved by measurement rather than
guessed at, and because the next engineer to add an export to any module will hit the same ordering
surprise.

`biome check` also failed once on formatting only (`parseSan`'s signature exceeded the line width);
`npx biome check --write src/san.ts src/san.parse.test.ts` fixed 2 files, and it touched only lines
this ticket added.
