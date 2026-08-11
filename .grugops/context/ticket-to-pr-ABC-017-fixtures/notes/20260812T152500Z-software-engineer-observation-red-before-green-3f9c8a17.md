---
id: 20260812T152500Z-software-engineer-observation-red-before-green-3f9c8a17
kind: observation
by: software-engineer
at: 2026-08-12T15:25:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-017-fixtures
  - ABC-017
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - 20260812T100500Z-qe-e2e-observation-mutants-9f2b41c7
  - 20260812T125000Z-security-nfr-observation-importer-rule-and-count-8c40be92
  - 20260812T143500Z-ba-pm-decision-five-gap-rulings-8d2f4b61
supersedes:
---

# Red before green: NINE wrong builds run, NINE killed, and every one failed ZERO pre-existing tests

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp.

## Method, stated so the numbers are attributable

Each build was applied to `src/history-pane.ts` by a patch-run-revert harness out of tree, run
against the **FULL** suite with `vitest --reporter=json`, then reverted with the md5 re-asserted. The
harness **refuses to run** if the md5 is not the baseline before it starts, and it refuses if the
patch's anchor text did not match — so a mutation that silently failed to apply cannot be scored as a
survivor or as a kill. **`src/history-pane.ts` md5 was `54fd4346dcc1a0060c4e66ae0149265d` after every
one of the nine reverts.**

Because the suite now contains my four new tests, ONE run yields both facts at once: which
pre-existing tests the build fails (its survivor status) and which of mine kill it.

## The nine builds

Total suite is **744** tests with my edits in (740 baseline + 4).

| build | what was injected | pre-existing tests failed | killed by | the failure message |
|---|---|---|---|---|
| `WLEAD-A` | `rowsInGame = Math.ceil(plies / 2)` | **0** | `A6` 4th anchor | *expected [ '  29. Nb1     Nc6    ', …(8) ] to have a length of 8 but got 9* |
| `WLEAD-B` | `return Math.max(0, hiddenRows * 2)` | **0** | `A6` 4th anchor | *expected '' to be 'Nc3'* |
| `WLEAD-C` | both terms dropped | **0** | `A6` 4th anchor | *expected [ '  29.         Nc6    ', …(8) ] to have a length of 8 but got 9* |
| `WFENSET` | rewrites `history.initialFen` per render | **0** | `A9` anchor clause | *0 plies anchor: expected 'rnbqkbnr/…' to be 'rnbqkbnr/…'* |
| `WSPLICE` | splices caller's `moves` to the window, `unshift`s it back | **0** | `A9` during-render | *0 plies first render: expected [Function] to not throw an error but 'TypeError: Cannot assign to read only…' was thrown* |
| `WFREEZE` | `Object.freeze(history.moves)` per render | **0** | `A14` | *playMove after a render: expected [Function] to not throw an error but 'TypeError: Cannot add property 20, ob…' was thrown* |
| `WCACHE` | memoises rows per `GameHistory` in a `WeakMap` | **2** (`A11`, incidental) | `A14` | *expected [ '  30. Nc3     Nb8    ', …(7) ] to not deeply equal [ '  30. Nc3     Nb8    ', …(7) ]* |
| `WDYNIMP` | `void import("./history.ts")` in the pane | **0** | `RF-1` load probe | *history.ts was evaluated in a production closure: expected [ 'apply.ts', 'moves.ts', …(13) ] to not include 'history.ts'* |
| `WBAREIMP` | bare `import "./history.ts";` in the pane | **0** | `RF-1` load probe | same message |

**NINE for nine.** No build turned out to be already dead, and **no fixture failed to discriminate the
build it was written for** — the two outcomes the brief explicitly asked me to report plainly if they
occurred. They did not occur, and this table is the evidence rather than the assertion.

**Every survivor claim of QE's and Security/NFR's is now independently confirmed** rather than
inherited: each of the eight builds with a "0" above passes all 740 pre-existing tests on this tree,
which is what "survivor" means. `WCACHE`'s two pre-existing failures are the **incidental** `A11`
kills QE identified and are discussed in the `A11` judgment note.

## Two builds whose exact form is mine and should be attributable

QE described these classes; the concrete injection was my choice, so it is written down rather than
implied.

- **`WFENSET`.** For a rewrite of the caller's anchor to be a *survivor*, it must change the string
  without changing the rendered bytes. I injected
  `history.initialFen.replace(/ \d+ (\d+)$/, " 1 $1")` — the halfmove clock 0 → 1, which every one of
  this ticket's anchors carries as 0. It is semantically inert for this pane (nothing in SAN, the move
  number or the column reads `halfmoveClock`), so output is byte-identical and every before/after
  clause `A9` had agreed. It survived 740/740 exactly as QE reported for the class.
- **`WSPLICE`.** Splices `moves` down to the window before the pair loop and `unshift`s the removed
  head back before the rows are built, so the array is perfectly restored by the time the call
  returns. Output byte-identical; `A11`'s `takeBack`/`playMove` spies see nothing, because raw array
  operations are neither.

## The `A6` fourth anchor was MEASURED, not transcribed

The brief said to re-measure BA/PM's rows rather than copy them. Rendered from the delivered pane out
of tree, before any expected value was written into a test:

```
[  30. Nc3     Nb8    ]      rows: 8      widths: [ 21 ]
[  31. Nb1     Nc6    ]      numbers: 30..37
[  32. Nc3     Nb8    ]      row 1 white cell: "Nc3    "
[  33. Nb1     Nc6    ]      row 1 black cell: "Nb8    "
[  34. Nc3     Nb8    ]      row 8 normalised: "37. Nb1"
[  35. Nb1     Nc6    ]      moves.length: 20
[  36. Nc3     Nb8    ]
[  37. Nb1            ]
```

**BA/PM's witnessed figures are exact on every count.** Moves 27, 28 and 29 have slid out — three
whole rows, so an off-by-one in either correction term is still visible, which is why 20 plies rather
than the minimum 16.

`A14`'s two panes, same object, measured the same way: last row `[  37. Nb1            ]` → one
`playMove` → `[  37. Nb1     Nc6    ]`; the panes differ; `moves.length` is **21**. Also exact.

## Where each build is homed, and what is deliberately NOT caught

`WSPLICE` is **not** `A14`'s to catch and was not made so: it restores what it breaks, so
render → play → render sees a perfectly intact array. It is homed in `A9`'s during-render clause,
exactly as BA/PM ruled. `A14`'s two assertions report separately — `WFREEZE` fails at the `playMove`
and `WCACHE` at the comparison — so neither masks the other, and `A6`'s three assertions likewise
split cleanly (`WLEAD-A` on the row count, `WLEAD-B` on the white cell).

## One collateral effect, reported rather than left to be discovered

`A14` also fails on `WLEAD-A`/`WLEAD-C`, because it builds the same 20-ply black-anchored fixture and
asserts its last row as a precondition before playing. That is a second test reporting on a build
`A6` already diagnoses correctly — additional noise, not masking, and the same shape as `WROWS9`
failing ten tests. `A6`'s message is the one that names the cause.
