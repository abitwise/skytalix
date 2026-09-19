---
id: 20260919T222100Z-qe-e2e-observation-abc120-mutant-ledger-15-mutants-raw-red-rows-and-messages-9c3a7e51
kind: observation
by: qe-e2e
at: 2026-09-19T22:21:00Z
verified_by:
confidence: high
refs:
  - ABC-120
  - ADR-0021
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - src/turn-loop.nfr.test.ts
supersedes:
---

# `ABC-120` mutant ledger — 15 mutants planted in the worktree's `src/turn-loop.ts`, each reverted with `src/` asserted clean; raw red rows and first failure messages

**Not a finding.** Raw output quoted from vitest's JSON reporter (`raw-mutants-summary.json.txt`,
`raw-mutant-Mn-summary.json.txt`; harnesses `raw-mutants-harness.mjs.txt`, `raw-mutant-Mn-harness.mjs.txt`).

## Method

Each mutant is one or two exact-string edits, asserted to match **exactly once** (the harness throws
otherwise), written into the worktree's own `src/turn-loop.ts`; `npx vitest run src/turn-loop.test.ts
src/turn-loop.nfr.test.ts --reporter=json` (67 rows); then `git checkout -- src/turn-loop.ts`, the
file compared byte-for-byte to the original, and `git status --porcelain -- src` asserted EMPTY — the
harness throws if not. A mutant with zero reds in the two files would have been re-run against the
whole lane; none needed it. Load 4.4–7.5 throughout (two sibling hops live); each run 0.83–1.10 s.

## Control — `M0`

`67 passed (67)`, exit 0.

## The ledger (row names shortened to the criterion id; messages are the first line of the first failure)

```
M1_takeback_no_derive_continue                 3 failed | 64 passed
  A3 :: AssertionError: expected { by: 'white', …(1) } to be undefined
  A4 :: AssertionError: expected 5 to be 6 // Object.is equality
  A5 :: AssertionError: expected 1 to be 2 // Object.is equality
M2_takeback_routed_as_command_7_8_9            3 failed | 64 passed
  A3 :: AssertionError: expected { by: 'white', …(1) } to be undefined
  A4 :: AssertionError: expected [ { from: 20, to: 52, …(4) }, …(3) ] to have a length of 2 but got 4
  A5 :: AssertionError: expected 1 to be 2 // Object.is equality
Ma_quit_renders_a_frame_before_exiting         2 failed | 65 passed
  A1 :: AssertionError: expected [ …(3) ] to have a length of 2 but got 3
  A3 :: AssertionError: expected [ …(11) ] to have a length of 10 but got 11
Mb_quit_writes_INPUT_ENDED_NOTICE              1 failed | 66 passed
  A1 :: AssertionError: expected 'input ended\n' to be 'quit\n' // Object.is equality
Mc_quit_exitCode_1                             2 failed | 65 passed
  A1 :: AssertionError: expected { result: null, reason: null, …(1) } to deeply equal { result: null, reason: null, …(1) }
  A3 :: (same — the fixture ends in `quit`)
Md_takeback_N_minus_1                          2 failed | 65 passed
  A3 :: AssertionError: expected { result: null, …(2) } to deeply equal { result: null, reason: null, …(1) }
        (7 of 8 plies taken back leaves Black to move; the engine seam reads the script's `quit` token,
         finds no move, throws → transition 12, `reason: "engine-threw"` — red on the outcome clause)
  A4 :: AssertionError: expected [ Array(1) ] to have a length of 2 but got 1
  A5 :: green — `takeBack(history, -1)` is `splice(max(0, 0 - (-1)))` = `splice(1)` on an empty list
Me_takeback_keyHistory_stale                   2 failed | 65 passed
  A3 :: AssertionError: expected { by: 'white', …(1) } to be undefined
  A4 :: AssertionError: expected [ { from: 20, to: 52, …(4) }, …(3) ] to have a length of 2 but got 4
  A5 :: green — nothing removed at ply 0
Mf_messages_dropped_on_takeback_render         1 failed | 66 passed
  A4 :: AssertionError: expected [ '', '' ] to include 'took back 2'
Mg_derive_TWICE_on_takeback                    3 failed | 64 passed
  A3 :: AssertionError: expected 11 to be 10 // Object.is equality
  A4 :: AssertionError: expected 7 to be 6 // Object.is equality
  A5 :: AssertionError: expected 3 to be 2 // Object.is equality
Mh_quit_arm_removed_falls_into_7_8_9           2 failed | 65 passed
  A1 :: TypeError: Cannot read properties of undefined (reading 'map')
  A3 :: TypeError: Cannot read properties of undefined (reading 'map')
        (`quit` carries no `messages`; the 7/8/9 branch hands `undefined` to the render seam)
Mi_QUIT_NOTICE_names_a_result_word ("resigned") 1 failed | 66 passed
  A2 :: AssertionError: expected 'resigned' not to contain 'resign'
Mj_quit_returns_a_chess_result ("draw")        2 failed | 65 passed
  A1 :: AssertionError: expected { result: 'draw', reason: null, …(1) } to deeply equal { result: null, reason: null, …(1) }
  A3 :: (same)
Mk_takeback_plies_ignored_zero                 2 failed | 65 passed
  A3 :: AssertionError: expected { by: 'white', …(1) } to be undefined
  A4 :: AssertionError: expected [ { from: 20, to: 52, …(4) }, …(3) ] to have a length of 2 but got 4
Ml_QUIT_NOTICE_equals_INPUT_ENDED_NOTICE       2 failed | 65 passed
  A1 :: AssertionError: expected 'input ended\n' not to contain 'input ended'
  A2 :: AssertionError: expected 'input ended' not to be 'input ended' // Object.is equality
Mn_quit_swallowed_continue                     2 failed | 65 passed
  A1 :: Error: input seam read past `quit`
  A3 :: AssertionError: expected [ …(11) ] to have a length of 10 but got 11
```

## What was planted, exactly

- `M1`: `continue;` appended after `messages = outcome.messages;` in the `take-back` branch.
- `M2`: `if (outcome.kind === "take-back")` → `if ((outcome.kind as string) === "MUTANT-M2")`.
- `Ma`: `writer(render(history, status, false, []));` before the `QUIT_NOTICE` write.
- `Mb`: `sink.write(\`${QUIT_NOTICE}\n\`)` → `sink.write(\`${INPUT_ENDED_NOTICE}\n\`)`.
- `Mc`: the `quit` return's `exitCode: 0` → `exitCode: 1 as unknown as 0`.
- `Md`: `takeBack(history, outcome.plies)` → `takeBack(history, outcome.plies - 1)`.
- `Me`: `const removed = history.moves.slice(history.moves.length - outcome.plies)` before
  `takeBack`, then `(history.moves as Move[]).push(...removed)` after it — position rewound, list
  (and so `keyHistory` / `repetitionCounts`, which replay the list) stale.
- `Mf`: `messages = outcome.messages;` removed from the `take-back` branch.
- `Mg`: `status = gameStatusOf(history);` appended in the `take-back` branch (a second supplier).
- `Mh`: `if (outcome.kind === "quit")` → `if ((outcome.kind as string) === "MUTANT-Mh")`.
- `Mi`: `QUIT_NOTICE = "quit"` → `"resigned"`. `Ml`: → `INPUT_ENDED_NOTICE`.
- `Mj`: the `quit` return's `result: null` → `result: "draw" as never`.
- `Mk`: `takeBack(history, outcome.plies)` → `takeBack(history, 0)`.
- `Mn`: the `quit` branch body → `messages = []; continue;`.

## After the round

`git status --porcelain -- src` → empty. `grep -rn MUTANT src` → seven pre-existing prose hits in
`line-input.test.ts`, `command-input.test.ts`, `turn-loop.test.ts:1809`, `frame.test.ts`, `cli.test.ts`
(the word in comments about earlier rounds); none in `src/turn-loop.ts`, none planted by this hop.
The Engineer's narrower `grep "MUTANT M"` would have found nothing; the bare word is reported so the
next reader is not surprised by it.
