---
id: 20261011T084936Z-software-engineer-observation-abc114-readings-a1-a6-5b2e8c41
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-114
at: 2026-10-11T08:49:36Z
verified_by:
confidence: high
refs:
  - ABC-114
  - ABC-113
  - ABC-043
  - ABC-044
  - EPIC-006
  - NFR-008
supersedes:
---

# SE `ABC-114`: the readings behind the replacement sentences (code `67296100`, base `7411f73a`)

This note is hand-authored and unsealed (no writer or stamp issuer on this install; see `AGENTS.md`).
I ran every reading below on 2026-10-11 in my own worktree, on macOS Darwin 25.5.0 with Node v26.11.0.
**I authored the sentences these readings support, and they are NOT validated (`A7`).** A QE hop
must re-plant the builds itself and must not quote these numbers.

## The control

`git show main:src/cli.test.ts` and `main:src/result-screen.test.ts` are byte-identical (`cmp`) to
the tip. So are `src/cli.ts` and `src/result-screen.ts`, because `ABC-113` (`cc037b3e`) is on `main`.
A literal `main` control re-runs this instrument, and I ran it for `M9` to confirm that: same single
red, the count row. For a control that can tell the rows apart, I used the pre-`ABC-113` file at
`cc037b3e^`. Against the delivered build, its `src/cli.test.ts` gives `2 failed | 53 passed (55)`. The
two reds are `ABC-042` `A9` and `A10`, which is drift since August and unrelated. Control readings are
therefore per row. The result-screen control is fully green on the delivered build (53 / 1680).

## A1 (`M9`, plus `D3` so the two can be told apart)

- `M9`: `const decoy = { ...history };` after the `newGame` line, with `history: decoy,` at the call.
  `tsc --noEmit` exit 0. This instrument: `1 failed | 66 passed (67)`, `A1`, "expected [ 'history =',
  'history:' ] to have a length of 1 but got 2". Control `cc037b3e^`: `3 failed | 52 passed (55)`,
  which is the 2 drift reds plus `A1` on "the `history` option is not the shorthand… expected
  'runTurnLoop({\n      history: decoy,…' to match /\bhistory,/".
- `D3`: the call wrapped in `await (async (history: GameHistory) => runTurnLoop({ history, … }))({
  ...history })`. `tsc` exit 0. This instrument: `1 failed | 66 passed`, `A1`, the count row, got 2.
  Control: only the 2 drift reds, so `A1` is GREEN.
- So `D3` leaves both the initializer row and the shorthand row green, while `M9` reds the shorthand
  row. Each build was reverted with `git checkout --`, and porcelain was empty afterwards.

## A2 (`D4`)

`const spare = { ...history }; for (const history of [spare]) {` wrapping the `try`/`catch`. `tsc`
exit 0. Full lane `npm test`: 53 files / 1680 tests, 0 failed. Control `cc037b3e^` cli file: only the
2 drift reds, so `A1` is green. It is green on both instruments. Reverted, porcelain empty.

## A3 (`M15`)

In `headline()`, before the generic return: fivefold → `["Draw by repetition.", "Specifically
fivefold repetition, automatic under FIDE 9.6.1."]`, threefold → `["Draw by repetition. Specifically
threefold repetition, claimed by the player to move under FIDE 9.2."]`. `tsc` exit 0.
- This instrument, full lane: `1 failed | 1679 passed (1680)`. The one failure is `ABC-044 A2 … >
  NEITHER STRING IS A SUBSTRING OF THE OTHER`, "threefold-repetition's headline contains
  fivefold-repetition's: expected 'Draw by repetition. Specifically thre…' not to contain 'Draw by
  repetition.'".
- Control (`cc037b3e^:src/result-screen.test.ts` in place), full lane: 53 / 1680, all green.
- **Agreement with the `ABC-113` QE note:** same shape (one red, the retargeted row; control green).
  The totals differ only because the lane has grown (1207 then, 1680 now). There is no substantive
  disagreement.

## A4 (the FIFO harness), re-run

Harness: `mkfifo`, then `node src/cli.ts --colour white --ascii < fifo`. The writer sends `e2e4\n`,
holds the FIFO for H seconds, and closes it. The child then gets up to 8 s to exit before
`kill -9`. Boards are counted as the `   a b c d e f g h` footer, prompts as `> `, and "move played"
as `last: e4`.

| build | H | boards | prompts | bytes | move played | exited after close |
|---|---|---|---|---|---|---|
| delivered | 1, 3, 5, then 1 again | 3 | 2 | 1481 | yes | no (killed) ×4 |
| `G03` hoisted + `void options.input(…)` | 1, 3, 5, twice each | 3 | 3 | 1483 | yes | no (killed) ×6 |

`G03` was `tsc`-clean, and against this instrument it gives `12 failed | 55 passed (67)`, `G6`
among them. Reverted, porcelain empty. EOF probe on the same FIFO pattern: a bare
`node -e 'process.stdin.on("end",…)'` received the data and never fired `end` within 3 s of the
writer closing (killed). `cat` exited 0 on EOF. So "no end-of-input for ANY program" is too broad on
this machine; what holds is "in Node". The comment says Node.

## A5 / A6

- `git diff --name-only main...HEAD -- src/` and `7411f73a...HEAD -- src/` both list exactly
  `src/cli.test.ts` and `src/result-screen.test.ts`. `--numstat … ':!src/*.test.ts'` is empty.
  `numstat`: `25 9 src/cli.test.ts`, `13 6 src/result-screen.test.ts`.
- `git diff -U0 main...HEAD -- src/` has 0 added or removed lines that are not `//` comment lines.
- Lane (`npm test`, JSON file read): 53 files / 1680 tests / 0 pending / 0 todo before, and the same
  after, both green.

## Gates on the delivered tree

`npm run lint` exit 0 (102 files). `npm run typecheck` exit 0. `npm run build` exit 0. `npm test`
exit 0 (53 / 1680). `.grugops/test-skips.md` is human-owned and was not run against:
`UNKNOWN - verify`. Lane cost: loaded machine (two other agent batches running), not graded.
