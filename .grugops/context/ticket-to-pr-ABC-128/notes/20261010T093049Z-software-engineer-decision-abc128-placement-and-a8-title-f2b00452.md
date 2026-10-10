---
id: 20261010T093049Z-software-engineer-decision-abc128-placement-and-a8-title-f2b00452
kind: decision
by: software-engineer
at: 2026-10-10T09:30:49Z
verified_by:
confidence: high
refs:
  - ABC-128
  - ABC-120
  - ABC-021
  - QE-051-b
  - M9
  - plans/tickets/ABC-128-the-take-back-edge-has-no-keyhistory-guard.md
  - src/turn-loop.test.ts
  - .grugops/context/cut-followups-2026-10-10/notes/20261010T092515Z-ba-pm-decision-8ba05150.md
supersedes:
---

# `ABC-128`: where the three spy reads sit, and the words of `A8`'s new title

Hand-authored, no seal (degraded posture per `AGENTS.md`; no `finding` admissible).

1. **Placement follows test note 1, measured on the shipped file at `fcbf06b`.** `A3`: the new
   `expect(vi.mocked(keyHistory)).toHaveBeenCalledTimes(0)` sits directly before the row's own
   `expect(keyHistory(history)).toHaveLength(1)` (base line 1946; the ticket's `:1948` was 2 lines
   off at this base, the probe's 1946 was right). `A4`: directly after `derivesMade()` (base 1974).
   `A5`: directly before the row's own `keyHistory(history)` read (base 1989). A two-line comment
   sits on `A3`'s line only, saying why it must precede the row's own read. `A4`/`A5` carry none,
   because the same reason applies and repeating it three times adds lines, not information.
2. **`A8`'s title, the words chosen:** "`keyHistory` fires on the REFUSED claim, and on no advancing
   ply, allowed claim or take-back (`ABC-120` `A3`-`A5`)". This is the ticket's example wording with
   an ASCII hyphen in `A3`-`A5`. Each named edge has a row: refused claim = `A8` (ii)/(iii);
   advancing ply = `A8` (i); allowed claim = `A8` (iv); take-back = `ABC-120` `A3`/`A4`/`A5`.
   It does not name `quit`, `command`, `rejected`, `ambiguous`, `game-over` or `eof`, and so no
   longer claims them (out of scope, `UNKNOWN - verify` per the ticket).
3. **No new mock, no new `it`.** The spy is `vi.fn(actual.keyHistory)` and `beforeEach` clears it.
   No production file opened for edit. The mutant was planted only in a `git archive` copy in a
   private scratchpad, never in the worktree.
