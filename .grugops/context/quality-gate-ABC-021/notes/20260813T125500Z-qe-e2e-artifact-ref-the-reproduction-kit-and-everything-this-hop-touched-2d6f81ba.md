---
id: 20260813T125500Z-qe-e2e-artifact-ref-the-reproduction-kit-and-everything-this-hop-touched-2d6f81ba
kind: artifact-ref
by: qe-e2e
at: 2026-08-13T12:55:00Z
verified_by:
confidence: high
refs:
  - ABC-021
  - src/turn-loop.test.ts
  - plans/traceability.md
  - plans/tickets/ABC-021-draw-claim-interaction.md
supersedes:
---

# The reproduction kit, and everything this hop wrote

> **Hand-authored.** Not a `finding`.

## Files this hop wrote — three, and one of them is a test file

| file | Δ | what |
|---|---|---|
| `src/turn-loop.test.ts` | +73 / −1 | one call-through `keyHistory` spy in the existing `vi.mock("./history.ts")` factory, and two rows: `A8` (the derive ledger) and `A9` (the widest refusal message at the narrowest frame). **ZERO new test FILES** |
| `plans/traceability.md` | `ABC-021`'s row + one `_Updated:` line | the QE result, the two rows added, the gaps, and the two numbers `:2` got wrong |
| `plans/tickets/ABC-021-…md` | one block | the gate record and the gaps, where BA/PM will look for them |

Plus this task's six context notes and the queue records under
`.grugops/queue/{claimed,done}/quality-gate-ABC-021/`.

**Files this hop did NOT write, asserted rather than assumed:** `src/turn-loop.ts` md5
`347755edcbfcc8dfe7c1dae150ddc8b5` at the start of the hop **and at the end**;
`src/turn-loop.nfr.test.ts` `d48a0eb3…`, `src/gameend.ts` `7121f414…`, `src/history.ts`
`12f8c562…`, `src/frame.ts` `bf3e5a84…` — all unmoved. `plans/board.md`, `plans/metrics.md`,
`plans/nfr-catalog.md`, `memory-bank/`, `.grugops/test-skips.md`, the four `*.nfr.test.ts` files
`ABC-030` owns, and every ticket file but `ABC-021`'s: never opened for edit.

## The reproduction kit — OUTSIDE the repository, and deleted

Three throwaway instruments were built in the session scratchpad, **never inside the worktree**, so
they add nothing to the lane `ABC-026` measures and there is no repo file to forget to remove:

| instrument | what it does |
|---|---|
| `mutate.mjs` | the mutant runner. **PINS `src/turn-loop.ts` and `src/turn-loop.test.ts` by md5 and THROWS rather than measuring the wrong tree**; applies one named mutation by unique-anchor substitution (throws if the anchor is absent or ambiguous); runs `tsc --noEmit` **and** the FULL suite with the JSON reporter; prints `CAUGHT` / `CAUGHT BY TYPECHECK` / `SURVIVED` with the killing assertions; **restores from a pristine copy in a `finally`.** 17 mutants: `M1`–`M17` |
| `width-probe.ts` | measures `MESSAGE_ROWS`/`PROMPT_ROWS`, the board's width in both glyph modes, `W` board-only and at the REAL merged panels, and the delivered region against the ticket's prose |
| `termination-probe.ts` | drives the real `runTurnLoop` through seven claim paths (`T1`–`T7`) with its own seams — repeated refusals, refuse-then-play, the human as BLACK, double claim, claim after mate, and the reachability of an empty `draws` |

**Assertion that they are gone from the tree:** `git status --short` in the worktree lists no
untracked file under `src/`, `plans/` or the repo root; the only paths this hop leaves behind are
the three files in the table above, the six notes, and the queue records. `node_modules` was a
symlink to `../cli-chess-example/node_modules` for the duration and **was removed before the hop
closed** — asserted, not assumed.

## Every command, so the numbers can be re-run rather than believed

```
git merge-base main HEAD
git diff --numstat 06c5427..HEAD
git merge-tree --write-tree main HEAD                 # clean tree, exit 0 — no rebase conflict
npm run lint                                          # 0 — 49 files, 2 pre-existing infos
npm run typecheck                                     # 0
npm run build                                         # 0
npm test                                              # 0 — 28 files, 816/816
npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'   # 0
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0      # 2 = COULD NOT RUN
PERFT_DEEP=1 npx vitest run src/perft.test.ts         # 0 — 32/32, 37.47 s
npx vitest run --coverage --coverage.include='src/turn-loop.ts' --coverage.reporter=text \
    src/turn-loop.test.ts src/turn-loop.nfr.test.ts   # 100 / 100 / 100 / 100
    (same, with describe("ABC-021 acceptance") skipped)   # 81.11 stmts, uncovered 234-244, 335-341
/usr/bin/time -p npx vitest run                       # 7 interleaved A/B/A rounds, medians 10.72 / 10.92 / 10.79 s CPU
```

## The two rows I added, and why each exists

**`A8` — "the ONE derive the loop makes on its own, ledgered."** It exists because **a mutant
survived**: `keyHistory(history)` once per advancing ply passes the delivered suite 814/814 while
`repetitionCounts` reads 0 and `gameStatus` reads `plies + 1`. Four clauses — 0 on an advancing run,
1 on a refused claim, 2 on two refusals, **0 on an ALLOWED claim**. The last is the only assertion in
the tree that pins the ticket's central boundary, *the loop adjudicates and the seam asks*, and it
pins it by cost rather than by structure.

**`A9` — "the widest refusal message still fits the narrowest frame."** It exists because the width
argument was carried by a comment and by nothing else. `50-move 99 of 100` is 17 columns, the widest
value either item can reach on the refusal path, and no fixture reached it; the board is 18 columns
in both glyph modes, which is the floor under `W`. One column of margin, now asserted at the maximum
rather than only at `50-move 0 of 100`.

**Both are in the existing file, beside `ABC-019`'s and `ABC-021`'s own rows.** A new file would have
cost the lane 100–229 ms against a ratified 13 s clause for two `it` bodies, and there was no reason
to spend it.
