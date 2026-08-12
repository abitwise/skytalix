---
id: 20260812T124500Z-ba-pm-observation-g1-reproduces-on-this-tip-and-there-are-two-false-sentences-5ab10fa3
kind: observation
by: ba-pm
at: 2026-08-12T12:45:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-02
  - ABC-017-A11
  - ABC-017-A14
  - EPIC-006
  - src/history.ts
  - src/history-pane.nfr.test.ts
  - src/history-pane.test.ts
supersedes:
---

# `G1` reproduces exactly on this branch tip — and the comment carries TWO false sentences, not one

> **Hand-authored, no stamp** — see the sibling note. Nothing here is a `finding`. Every cell was RUN,
> out of tree, on a replica extracted from the object database (`git archive HEAD`) and
> `/usr/bin/diff -r`-verified identical to this worktree's `src/`. The replica's own baseline is
> `750 passed (750)` on 26 files.

## The verdicts — re-measured on the tree `ABC-029`'s build actually left behind

```
configuration                                        WCACHE-LAST   what kills it
delivered tree (26 files)                            2 failed/750  A11 x2 — the SHARING, and NOTHING else
(a) src/history-pane.test.ts ALONE, nfr not loaded   24 passed     NOTHING — A1, A3, A4 all silent
(b) nfr :121+ fixtures rebuilt per test              750 passed    NOTHING — the guard is GONE
src/history-pane.nfr.test.ts alone                   2 failed/8    A11 x2 — locates them
render digest, 12 fixtures                           c9faa3ec869bc4d272ca9eff0403e078 — IDENTICAL
control: CLEAN pane, same harness                    750 passed/750 + same digest
```

**Output identity was checked FIRST.** A build that changes rendered output is not a survivor and
proves nothing; this one is byte-identical to the delivered pane at all twelve fixtures.

## It is a genuinely WRONG build, on the public API, and I ran the consumer path

```
                                   delivered pane        WCACHE-LAST
moves.length      before / after   21 / 21               21 / 21
last move identity preserved       true                  true
render 1 last row                  "  37. Nb1     Nc6 "  "  37. Nb1     Nc6 "
render 2 last row                  "  37. Ne4     Nc6 "  "  37. Nb1     Nc6 "   <- STALE
panes differ                       TRUE                  FALSE
```

`newGame` / `legalMoves` / `playMove` / `takeBack` only — **no redo stack, no `EPIC-006` code.** The
identity is preserved because **`playMove` pushes the caller's object VERBATIM**:
`moveListOf(history).push(move)` at `src/history.ts:85-88`, read at source at this hop.

**The player is shown the move they took back** — word for word the pain `ABC-028`'s `## Problem`
states, on the consumer it names, one cache-key refinement past `A1`.

## Why `A1` and `A14` are structurally incapable of catching it

Read at source, not inferred: `A1` (`src/history-pane.test.ts:785-806`) does
`takeBack(history, 1)` then plays a **different** move `g8f6` — which produces a **fresh `Move`
object**, so a key on last-move identity moves and the cache misses. `A14` mutates by **append**, so
the length key moves. **`A5`'s edit moves neither key**: it preserves the last move's identity by
re-playing the saved object and changes an **earlier** ply.

## The part QE did not name: there are TWO false sentences in that comment

QE named `:118-120`. Read at source at this hop, `:106-108` does the same job twelve lines above:

| line | text | measured |
|---|---|---|
| `:118-120` | *"With `A1` landed the cache dies in `src/history-pane.test.ts` **either way**, so rebuilding these per test would **no longer lose a guard**"* | **FALSE for the class** — rebuild → `750 passed` |
| `:106-108` | *"a reader looking for the guard against **a memoising pane** finds it there, with this file not loaded at all"* | **FALSE for the class** — with the file not loaded, `WCACHE-LAST` passes `24 / 24` |
| `:112` | *"passes the whole suite **744/744**"* | **STALE** — the tree runs 750; the `A2` ruling corrected `744`→`750` everywhere else on that page and missed it here; QE re-derived the cell at `749` |

**QE's proposed fix — one sentence — would have left `:106-108` standing, doing exactly the same job.**
That is the difference between repairing the witness and repairing the class, inside the repair itself.

## The line map, verified at source

**Line 102 is BLANK.** The comment block is **`:103-120`**; the `AT_*` module-scope fixtures begin at
**`:121`**, which was always right. The ticket's live `:102-120` references are off by one at the
start. **Second time this block's start line has been wrong in the record, and both errors were written
by a BA/PM hop** — the first stale by eight lines, this one by one.

## What I am NOT claiming

- **Not a code defect.** The delivered pane is CORRECT on this input — it renders `37. Ne4 Nc6`.
- **Not that `A1` is wrong or should move.** It kills the build it names. `## Test notes` 2 stands.
- **Not that `A2`'s measurement half is unmet.** It is met. **`A2`'s COMMENT half is not.**
- **Not that `WCACHE-LAST` is the last member of the family.** `WCACHE-LAST2` — keyed on the last
  **two** identities — would survive `A5`. **I did not measure it**; it is recorded as
  `RISK-ABC028-03` with `UNKNOWN - verify` on its verdict.
