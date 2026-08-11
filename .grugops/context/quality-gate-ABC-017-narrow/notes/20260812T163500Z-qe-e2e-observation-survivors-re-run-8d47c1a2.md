---
id: 20260812T163500Z-qe-e2e-observation-survivors-re-run-8d47c1a2
kind: observation
by: qe-e2e
at: 2026-08-12T16:35:00Z
verified_by:
confidence: high
refs:
  - quality-gate-ABC-017-narrow
  - ABC-017
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - 20260812T100500Z-qe-e2e-observation-mutants-9f2b41c7
  - 20260812T101000Z-qe-e2e-observation-criteria-gaps-3d81f6a4
  - 20260812T152500Z-software-engineer-observation-red-before-green-3f9c8a17
supersedes:
---

# My own nine survivors re-run against the delivered suite: NINE FOR NINE DEAD, and every one dies on the fixture written for it

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp. Every verdict is `vitest --reporter=json`'s, per test, from the out-of-tree
> patch-run-revert harness with a uniqueness check on every anchor and the pane's md5 re-asserted
> after each revert.

**This is the one measurement nobody else could make for me: I built these builds, so I know what
each one is supposed to look like when it dies.** The Engineer reported all nine dead. I did not
inherit that — I rebuilt all nine from my own definitions and ran them against the delivered tree.

## The score: 9 constructed, 9 KILLED, 0 survivors

| build | what it does | verdict | the test that kills it | the message |
|---|---|---|---|---|
| `WLEAD-A` | `rowsInGame = Math.ceil(plies / 2)` | **KILLED ×2** (742/744) | `A6` 4th anchor | *expected [ '  29. Nb1     Nc6    ', …(8) ] to have a length of 8 but got 9* |
| `WLEAD-B` | `return Math.max(0, hiddenRows * 2)` | **KILLED ×1** (743/744) | `A6` 4th anchor | *expected '' to be 'Nc3'* |
| `WLEAD-C` | both terms dropped | **KILLED ×2** (742/744) | `A6` 4th anchor | *expected [ '  29.         Nc6    ', …(8) ] to have a length of 8 but got 9* |
| `WFENSET` | rewrites `history.initialFen` per render | **KILLED ×1** (743/744) | `A9` anchor clause | *0 plies anchor: expected 'rnbqkbnr/…' to be 'rnbqkbnr/…'* |
| `WSPLICE` | splices caller's `moves` to the window, `unshift`s it back | **KILLED ×1** (743/744) | `A9` during-render | *0 plies first render: expected [Function] to not throw … 'TypeError: Cannot assign to read only…'* |
| `WFREEZE` | `Object.freeze(history.moves)` per render | **KILLED ×1** (743/744) | `A14` | *playMove after a render: expected [Function] to not throw … 'TypeError: Cannot add property 20…'* |
| `WCACHE` | memoises rows per `GameHistory` in a `WeakMap` | **KILLED ×3** (741/744) | `A14` + 2 incidental `A11` | *expected [ '  30. Nc3     Nb8    ', …(7) ] to not deeply equal […]* |
| `WDYNIMP` | `void import("./history.ts")` in the pane | **KILLED ×1** (743/744) | `RF-1` load probe | *history.ts was evaluated in a production closure* |
| `WBAREIMP` | bare `import "./history.ts";` in the pane | **KILLED ×1** (743/744) | `RF-1` load probe | *history.ts was evaluated in a production closure* |

**The Engineer's red-before-green table reproduces EXACTLY** — same kill counts, same catchers, same
first messages, on builds I re-derived rather than copied. His collateral note is confirmed too:
`WLEAD-A` and `WLEAD-C` also fail `A14`, which builds the same 20-ply black-anchored fixture and pins
its last row as a precondition; `A6` is the message that names the cause.

## They DISCRIMINATE — which is the question the brief actually asked

*"Not 'is there a test named for them' — does the test discriminate?"* Three things were checked
rather than assumed, and all three hold:

1. **Each build dies on the fixture written FOR it**, not on collateral damage elsewhere. Every kill
   above is in `src/history-pane.test.ts` or `src/history-pane.nfr.test.ts`, on one of the five new
   assertions, and **no build fails a pre-existing test** — which is what "survivor" meant when I
   scored them and is now independently confirmed on this tree.
2. **The diagnosis names the right subsystem.** `WLEAD-A` reports a row count of 9 from a pane whose
   reason for existing is a constant height; `WLEAD-B` reports the empty white cell; `WFREEZE`
   reports the `playMove` that would stop `ABC-019`'s loop; `WDYNIMP`/`WBAREIMP` report the module
   evaluation. Not one of them reports a symptom in another module's name.
3. **No new assertion masks another.** `A6`'s three assertions split cleanly (`WLEAD-A` on the row
   count, `WLEAD-B` on the white cell) and `A14`'s two do too (`WFREEZE` at the `playMove`,
   `WCACHE` at the comparison) — verified by the differing first messages, not taken from the note.

## All five new assertions are FALSIFIABLE, and each is the primary catcher for at least one build

Recorded because a test that cannot fail is the defect this ticket has now paid for four times
(`D22`, `D23`, `A3`'s clause, `A9`'s snapshot):

| new assertion | falsified by | sole acceptance-table catcher? |
|---|---|---|
| `A6` 4th anchor — row count | `WLEAD-A`, `WLEAD-C` | yes |
| `A6` 4th anchor — row 1 white cell | `WLEAD-B` | yes |
| `A9` — `initialFen` snapshot | `WFENSET` | yes |
| `A9` — during-render freeze | `WSPLICE` | yes |
| `A14` — `playMove` succeeds / pane is fresh | `WFREEZE`, `WCACHE` | yes for `WFREEZE`; `WCACHE` also caught incidentally by `A11` |
| `RF-1` load probe | `WDYNIMP`, `WBAREIMP`, and three more I added (see the probe note) | yes |

## ONE assertion that cannot fail today, named rather than counted

`A9`'s during-render test asserts `expect(Object.isFrozen(history.moves)).toBe(true)` on the line
**after** `Object.freeze(history.moves)`. On the delivered `GameHistory` that cannot fail — `moves`
is a real array on the object (`src/history.ts:34-46`), which the Engineer read at source and said
so. **It is correctly placed and I am not asking for it to move:** it guards the INSTRUMENT against a
future `GameHistory` whose `moves` became a getter handing out a copy, which would silently turn the
freeze into a no-op. That is a tripwire on the test's own apparatus, not a vacuous requirement, and
the Engineer's reasoning for adding it is right.

**One consequence worth naming, because the ticket has a rule about exactly this shape.**
`## Test notes`' ONE RULE — *"a clause that states the REQUIREMENT and a clause that acts as a
TRIPWIRE do not go in the same `it`"* — is technically breached here: the armed-instrument tripwire
and the `not.toThrow()` requirement share one `it`. **It is benign and I do not request a split.** If
the tripwire ever fires, the requirement is genuinely unevaluable (a disarmed instrument cannot
report on the pane), so there is no second verdict being lost — which is the only thing the rule
protects. Recorded so a later sweep that applies the rule mechanically does not "fix" it and does not
mistake the omission for an oversight.

## Verdict per gap

| gap | closed? | the measurement |
|---|---|---|
| **`G1`** (black anchor + slid window) | **CLOSED for all three named builds** | `WLEAD-A`/`B`/`C` all dead on `A6`'s fourth anchor |
| **`G2`** (caller usable / pane fresh) | **CLOSED for both named builds** | `WFREEZE` and `WCACHE` dead on `A14` |
| **`G3`** (`A9`'s third field, during-render) | **CLOSED for both named builds** | `WFENSET` on the anchor clause, `WSPLICE` on the freeze |
| **`G4`/`RF-1` reach** | **CLOSED, and wider than specified** | `WDYNIMP`/`WBAREIMP` dead; three further forms I added also die |

**What is closed is every build that was NAMED. What is not closed is the input CLASS behind three of
the four** — and that is the subject of the separate criteria-gap note, because it routes to BA/PM
rather than to the Engineer.
