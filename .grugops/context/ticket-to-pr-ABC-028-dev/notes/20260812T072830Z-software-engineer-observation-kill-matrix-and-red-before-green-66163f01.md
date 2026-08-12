---
id: 20260812T072830Z-software-engineer-observation-kill-matrix-and-red-before-green-66163f01
kind: observation
by: software-engineer
at: 2026-08-12T07:28:30Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A3
  - ABC-028-A4
  - RISK-ABC028-01
  - ABC-017-A9
  - ABC-017-A14
  - src/history-pane.test.ts
supersedes:
---

# Twelve wrong builds, re-specified from the ticket and RUN — red before green, every one

> **Hand-authored, no stamp.** Every cell below was executed. Nothing is reasoned.

## How the builds were made — from the ticket's prose, not from the reproduction kit

QE's `artifacts/make-mutants.ts` was read (the brief required it) and is **not** the source of these.
Each build is the delivered `src/history-pane.ts` text plus **exactly one anchored edit**, the anchor
asserted **unique** before substitution, md5-checked against `54fd4346dcc1a0060c4e66ae0149265d`
first, written to an out-of-tree replica extracted with `git archive HEAD` and `diff -r`-verified
against the worktree. **Nothing under the repository's `src/` was ever written by the harness.**

**All twelve `tsc --noEmit` exit 0.** All twelve were **output-identity checked FIRST**, because a
build that changes rendered output is not a survivor and proves nothing: **every one renders
byte-identical output at all ten lengths.** The single exception is the one that must differ —
`WLEAD-ODD` at the black-anchored **ODD** window, which is precisely `A3`'s input class, and it is
byte-identical at the EVEN 20-ply window `A6` already covers.

## The delivered suite — the "today" column, re-measured not inherited

```
build         delivered suite (744 tests, 26 files)     ticket says
WCLEAN        744 passed                                744/744          agrees
WFENMID       744 passed                                survives         agrees
WPOSMID       744 passed                                survives         agrees
WBOARDMID     744 passed                                survives         agrees
WMOVESWAP     744 passed                                survives         agrees
WBOARDSET     744 passed                                survives         agrees
WBOARDBUF     744 passed                                survives         agrees
WBOARDBLIND   744 passed                                survives         agrees
WLEAD-ODD     744 passed                                survives         agrees
WSPLICE       1 failed / 743   (A9's freeze)            dies on A9       agrees
WCACHE        3 failed / 741   (A11 x2, A14)            dies             agrees
WCACHE-LEN    2 failed / 742   (A11 x2)                 "744/744"        *** DISAGREES ***
```

The one disagreement is ruled in the sibling `observation` note.

## The kill matrix on MY instrument — every build x every one of `A1`'s ten lengths

```
                 0     1     3    19    20    40    80   120   300  2000
WCLEAN       clean clean clean clean clean clean clean clean clean clean
WFENMID          W     W     W     W     W     W     W     W     W     W
WPOSMID          W     W     W     W     W     W     W     W     W     W
WBOARDMID       WD    WD    WD    WD    WD    WD    WD    WD    WD    WD
WBOARDSET        D     D     D     D     D     D     D     D     D     D
WBOARDBUF        D     D     D     D     D     D     D     D     D     D
WBOARDBLIND  clean clean clean clean clean clean clean clean clean clean
WMOVESWAP        W     W     W     W     W     W     W     W     W     W
WSPLICE          W     W     W     W     W     W     W     W     W     W
```

`W` write trap, `D` board digest, `WD` both, `clean` = no violation **and the instrument looked**.
**This reproduces QE's matrix cell for cell, and the arming counter reproduces digit for digit**
(`0:5 1:40 3:135 19:763 20:832 40:982 80:1485 120:1896 300:3484 2000:18677`) — on an instrument
built from the criterion rather than transcribed. That is corroboration and it is worth having.

**Zero `THROW` cells.** The `Proxy`/TypedArray crash trap of `## Test notes` 10 was tested for
explicitly — `board.set`, `fill`, `copyWithin`, `sort`, `reverse` all mutate for real and are
REPORTED, never crash — because view methods are bound to the raw node.

## The arming controls — eight slots, fresh fixture each, plus the positive control

```
1 initialFen                    FIRED  n=4  [write-trap]
2 position.fullmoveNumber       FIRED  n=2  [write-trap]
3 position.blackToMove          FIRED  n=2  [write-trap]
4 a position.board ELEMENT      FIRED  n=2  [write-trap, board-digest]
5 position.board via .buffer    FIRED  n=1  [board-digest]
6 the moves SLOT                FIRED  n=4  [write-trap]
7 the moves CONTENTS            FIRED  n=83 [write-trap]
8 a Move's own field            FIRED  n=2  [write-trap]
POSITIVE control (no mutation)  DID NOT FIRE, samples=6
```

## RED BEFORE GREEN — the full suite with `ABC-028`'s six `it`s present

Each row is one wrong build against the **delivered 744 tests plus this ticket's 6**, and the named
test is the one that reported.

```
build         result                 killed by
WFENMID       1 failed / 749         ABC-028 A4        "0 plies: expected [ …(4) ] to deeply equal []"
WPOSMID       1 failed / 749         ABC-028 A4        "0 plies: expected [ …(8) ] to deeply equal []"
WBOARDMID     1 failed / 749         ABC-028 A4        "0 plies: expected [ …(3) ] to deeply equal []"
WMOVESWAP     1 failed / 749         ABC-028 A4        "0 plies: expected [ …(4) ] to deeply equal []"
WBOARDSET     1 failed / 749         ABC-028 A4        "[ { detector: 'board-digest', …(2) } ]"
WBOARDBUF     1 failed / 749         ABC-028 A4        "[ { detector: 'board-digest', …(2) } ]"
WSPLICE       2 failed / 748         ABC-017 A9  +  ABC-028 A4   (it must STAY dead — it does)
WLEAD-ODD     1 failed / 749         ABC-028 A3        "expected '' to be 'Nc3'"
WCACHE-LEN    3 failed / 747         ABC-017 A11 x2 (pre-existing)  +  ABC-028 A1
WCACHE        4 failed / 746         ABC-017 A11 x2 + A14 (pre-existing)  +  ABC-028 A1
WBOARDBLIND   750 passed             NOTHING — RISK-ABC028-01, re-run and still open
WCLEAN        750 passed             the delivered pane, green, counter non-zero at all ten
```

**Every build dies at its INTENDED criterion and at no other.** `ABC-028`'s six `it`s add **zero**
failures to any pre-existing test on any build. The whole set was re-run a final time against the
tree as landed in the worktree, and every verdict reproduced.

## Two honest divergences from the ticket's stated lane numbers

1. **The ticket says `1 failed, 747 passed` against `748 passed (748)`.** Those are QE's `A4`-ONLY
   figures. This hop lands `A1` and `A3` as well, so the counts are **`1 failed, 749 passed` against
   `750 passed (750)`** — 6 new `it`s, not 4. The SHAPE the ticket asserts (exactly one failure, and
   it is this criterion, and zero pre-existing tests break) holds unchanged for all six `A4` builds.
2. **`WCACHE-LEN` and `WCACHE` do NOT produce exactly one failure**, because each also trips the two
   pre-existing `A11` `toSan` count assertions. That is a pre-existing property of the delivered
   tree, not something this ticket introduced — it is the same fact the sibling note rules on.
