---
id: 20260812T120500Z-qe-e2e-observation-wcache-last-the-sharing-is-still-load-bearing-7c42f6dc
kind: observation
by: qe-e2e
at: 2026-08-12T12:05:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - RISK-ABC017-01
  - RISK-ABC028-02
  - ABC-017-A11
  - ABC-017-A14
  - EPIC-006
  - src/history-pane.nfr.test.ts
  - src/history-pane.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# `WCACHE-LAST`: the incidental fixture sharing is STILL the only guard in the project — for the NEXT cache in the family, and three places in the tree now say otherwise

> **Hand-authored, no stamp** — see the sibling baseline note. Nothing here is a `finding`. Every
> cell below was RUN, out of tree, on the replica whose `src/` is `diff -r`-identical to this
> worktree's.

**This is the most useful thing this hop found and it is written first for that reason.**

## The build

**`WCACHE-LAST`** — a pane memoising rows per `GameHistory`, invalidated when **either**
`moves.length` **or the identity of the last move** changes. It is not exotic: **it is the fix an
engineer writes the moment `A1` catches `WCACHE-LEN`.** `A1` teaches exactly this lesson — *"the
caller took a move back and played a different one"* — and *"key on the last move as well"* is the
obvious response to it.

Constructed from the ticket's own cache prose plus that one extra key, `tsc --noEmit` **0**, and
**output-identity checked FIRST** at twelve fixtures (`A1`'s ten lengths plus the 20- and 21-ply
black-anchored windows): **byte-identical to the delivered pane**, render digest
`c9faa3ec869bc4d272ca9eff0403e078`. A build that changes output is not a survivor and proves nothing.

## The verdicts — three configurations, all run

```
configuration                                          WCACHE-LEN      WCACHE (naive)   WCACHE-LAST
delivered tree, fixtures SHARED (26 files)             3 failed/750    4 failed/750     2 failed/750
   the killers                                         A11 x2 + A1     A11 x2+A14+A1    A11 x2  <- ONLY
(a) src/history-pane.test.ts ALONE, nfr NOT loaded     1 failed/24     2 failed/24      24 passed  ***
(b) FULL suite, nfr :121+ fixtures REBUILT PER TEST    1 failed/750    2 failed/750     750 passed ***
```

**`WCACHE-LAST` is caught by NOTHING in `src/history-pane.test.ts`.** Neither `ABC-017` `A14` nor
`ABC-028` `A1` fails on it: `A14`'s key moves because it appends, and `A1`'s key moves because a
take-back-and-play-a-different-move produces a **fresh `Move` object**. **Its only catcher in the
whole project is `A11`'s `toSan` CALL COUNT in `src/history-pane.nfr.test.ts` — the incidental
fixture sharing, by the same accident, through the same instrument, in the same file.**

## It is a WRONG build, and the path is the public API — measured, not argued

`playMove` pushes the caller's `Move` object verbatim (`src/history.ts:85-88`), so **a redo stack
that keeps the popped move re-pushes the SAME object.** That is the ordinary way to build redo, and
`EPIC-006` owns undo — the same consumer `A1`'s own `## Dependencies` bullet names.

Played through the public API only, on a 21-ply black-anchored game: save `moves[20]` (`Nb8-c6`),
`takeBack(history, 2)`, play a **different** ply 19 (`Nc3-e4` instead of `Nc3-b1`), then redo the
**saved** last move, which is still legal.

```
                                   delivered pane        WCACHE-LAST
moves.length      before / after   21 / 21               21 / 21
last move identity preserved       true                  true
render 1 last row                  "  37. Nb1     Nc6 "  "  37. Nb1     Nc6 "
render 2 last row                  "  37. Ne4     Nc6 "  "  37. Nb1     Nc6 "   <- STALE
panes differ                       true                  FALSE
```

**The player is shown the move they took back** — word for word the pain `ABC-028`'s `## Problem`
states, on the consumer it names, one cache-key refinement later.

## What this falsifies, at three sites — and all three are the CURRENT text, not superseded text

1. **`src/history-pane.nfr.test.ts:118-120`, the comment `A2` REQUIRED and this ticket wrote:**
   *"With `A1` landed the cache dies in `src/history-pane.test.ts` either way, so rebuilding these
   per test would no longer lose a guard."* Read narrowly — *the `moves.length`-keyed cache* — it is
   TRUE. **Read as the next reader reads it, it is FALSE**: rebuild those fixtures and `WCACHE-LAST`
   goes from `2 failed` to **`750 passed`**, which is a guard lost.
2. **`A2`'s ruling**, which certifies that configuration (b) is safe because *"`A1` is in a different
   file … so rebuilding those fixtures **cannot** reach `A1`'s verdict."* True of `A1`'s verdict, and
   `A1`'s verdict is not the whole exposure.
3. **The `P1` re-derivation:** *"The trap is defused, `A1` is landed, and **the sharing genuinely is
   no longer load-bearing.** The hazard this ticket's `P1` priced is GONE — because this ticket
   removed it."* **Measured: the sharing is still the sole load-bearing guard for `WCACHE-LAST`.**

**This is `RISK-ABC017-01` re-armed for a neighbouring build, with the tree's own comment now
inviting the deletion that arms it** — the same shape, the same file, the same call-count mechanism
that hid it from six roles, and this time with a *measured-sounding* sentence standing where the last
measured-sounding sentence stood.

## The pattern, named, because this ticket has named it twice already

**`## Test notes` 1:** *"a hole described per node instead of over the class is a hole that gets
re-found once per mechanism."* `A9` paid it four times. `RISK-ABC028-01` was widened for it one hop
ago. **`A1`/`A2` have it too: they close a WITNESS (`WCACHE-LEN`) and the tree then asserts the CLASS
(*"the cache dies either way"*) is closed.** Third occurrence, same ticket family.

## What I am NOT claiming

- **Not a code defect.** `src/history-pane.ts` is md5 `54fd4346…`, unchanged, and is CORRECT on this
  input: the delivered pane renders `37. Ne4 Nc6`. **This is a gap in what a criterion ASKS.**
- **Not that `A1` is wrong or should move.** `A1` does exactly what it says and kills the build it
  names. `## Test notes` 2 forbids folding it into `A14` and nothing here disturbs that.
- **Not that `A2` as written is UNMET.** `A2` names `WCACHE-LEN` and naive `WCACHE`; both die in both
  configurations. `A2` is MET. **The gap is in the generalisation the tree draws from it.**
- **Not that `WCACHE-LAST` is the last member of the family.** I did not certify the set as complete,
  for the same reason the build hop declined to certify twelve.
