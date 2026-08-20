---
id: 20260821T000000Z-uat-planner-observation-one-of-the-eight-endings-was-seen-not-eight-and-one-cannot-be-reached-at-all-57ae69bc
kind: observation
by: uat-planner
role: uat-planner
task: uat-ABC-044-2026-08-20
at: 2026-08-21T00:00:00Z
verified_by:
confidence: high
refs:
  - ABC-044
  - ABC-044/A1
  - ABC-044/A2
  - ABC-044/A3
  - ABC-021
  - EPIC-006
  - src/command-input.ts
  - src/gameend.ts
supersedes:
---

# ONE of the eight endings was seen by a player. Not eight. And one of them cannot be reached at all

QE established this and asked in writing that it reach the owner unsoftened. **It is carried here in
QE's terms, and this role weakened none of it.**

## The row that must not be rounded up

| of the eight endings the screen names | reachable by a player today? | **seen in this UAT?** |
|---|---|---|
| checkmate | yes | **YES** — on a 24×80 pty, on a 20×80 pty, and on a pipe |
| stalemate | in principle, by playing to it | no |
| insufficient material | in principle, by playing to it | no |
| fivefold repetition (automatic, FIDE 9.6.1) | in principle | no |
| seventy-five-move (automatic, FIDE 9.6.2) | in principle | no |
| threefold repetition (claimed, FIDE 9.2) | by construction; never driven | no |
| fifty-move (claimed, FIDE 9.3) | by construction; never driven | no |
| **resignation** | **NO — no path exists** | **no, and none can exist until `EPIC-006` cuts `resign`** |

**`resignation` cannot be produced by any sequence of player input.** `COMMAND_TABLE`
(`src/command-input.ts:74-79`) is `help`, `board`, `quit`, `claim`, and its own header says `resign`
belongs to `EPIC-006`'s later command set. No production module in this tree constructs a
`resignation` outcome. **That ending renders correctly from a value nothing but a test can supply.**

QE's sentence, quoted because it is the one most likely to be lost in a summary:

> *"a path that does not exist yet is not this ticket's hole and no test can close it. **What WOULD be
> a failure is UAT reporting 'eight reasons seen'.**"*

**This UAT reports one.**

The two fault screens (`engine-failure`, `engine-threw`) are likewise **not player-reachable** — they
need the engine substituted, which is a test harness and not an act available to a person. They are
outside business acceptance entirely, and no scenario was invented to pretend otherwise.

## The claimed draws: no UAT step was written that would fail to execute

QE could not force a threefold (the engine does not repeat, so shuffling one side does not produce
one) and said a human at UAT would be in the same position. **A UAT script that cannot be run is worse
than an admitted gap**, so `S6` in the pack grades the *wordings* — which are unambiguous and cite the
FIDE articles — and records what a player would actually see as **`UNKNOWN - verify`**.

What *was* measured on a real terminal is that the `claim` path is live and honest: after `1. e4 Nc6`
it reported `repetition 1 of 3` and `50-move 1 of 100`, awarded nothing, and the game continued. The
adjudication behind it is `src/gameend.ts`, which is `Done`, mutation-tested and **byte-identical** in
this diff.

## Standing

Unstamped `observation`, hand-authored. The reachability facts are reads of merged code and of QE's
recorded measurements; the "seen" column is this hop's own runs. Not a human's acceptance of anything.
