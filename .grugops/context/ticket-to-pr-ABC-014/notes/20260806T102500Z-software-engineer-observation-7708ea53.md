---
id: 20260806T102500Z-software-engineer-observation-7708ea53
kind: observation
by: software-engineer
at: 2026-08-06T10:25:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - src/render.ts
  - src/render.test.ts
supersedes: 
---

# The mutation campaign, and the two mutants that changed the suite

18 mutants of the shipped `src/render.ts`, each one edit, each run against the delivered tests, the
module restored between every one and **md5-identical afterwards**
(`733bc67fec523a7f41016bea2b026e1d`). **All 18 were killed.** The harness ran outside the repo and
is not committed.

The bare score is the least interesting part. Two results are worth carrying forward.

## Two mutants SURVIVED the shading test, and the suite was strengthened because of it

`M1` takes the shading character from the **screen position** instead of the square; `M12` **swaps
the dark and light characters**. Both invert the entire colouring — `a1` comes out light, which is
wrong chess — and **both passed the criterion-6 test as originally written**.

The reason is a property of the criterion, not an oversight in the code: *every* assertion that does
not NAME a character is symmetric under swapping the two. "Adjacent squares differ" holds under
inversion. "`a1` and `h8` share a character" holds under inversion. "The board uses exactly two
shading characters" holds under inversion. Criterion 6 says the two corners are **dark**, and on a
character-shaded board "dark" has no content until a character is named.

They were dying only to the two hand-written frames. One assertion naming `:` at `a1`/`h8` and `.`
at `a8` closed it, and **both mutants now die to criterion 6's own test** (re-run and confirmed, 9
killers each instead of 8). The consequence for a reviewer is stated plainly: a reviewer who dislikes
`:` and `.` is now disagreeing with a test, which is the correct place for that disagreement to be.

## One criterion has exactly ONE killer

`M15` — the renderer clears each square as it reads it — dies to **one** test, *"renders
byte-identically on a repeat and leaves the position untouched"*, and to nothing else. The 24
snapshots do not catch it because every render in this suite parses its own fresh position.

This is handed to QE rather than closed here: this project's QE has twice ruled that a
single-assertion killer is a suite gap worth a second independent test, and breaking the module is
QE's job, not this role's.

## The full table

| Mutant | Killed by |
|---|---|
| M1 shading from the screen position, not the square | 9 (after the fix; 8 before, criterion 6 not among them) |
| M2 files never mirrored (one-axis flip) | 8 |
| M3 ranks never mirrored (one-axis flip) | 8 |
| M4 empty square blanked to spaces | 10 |
| M5 glyph before the shading character | 12 |
| M6 ASCII pawn loses its case marker | 9 |
| M7 Unicode king: one code point for both colours | 8 |
| M8 rank labels counted the wrong way | 10 |
| M9 file labels never mirrored | 8 |
| M10 label row one column short | 9 |
| M11 colour ignored — every piece drawn white | 10 |
| M12 dark and light characters swapped | 9 (after the fix; 8 before) |
| M13 a Unicode glyph leaks into the ASCII table | 11 |
| M14 the file-label row is never emitted | 11 |
| M15 the renderer clears each square as it reads it | **1** |
| M16 only seven files are drawn | 15 |

The ASCII code-point criterion (`2a`) is proven to bite by `M13` specifically — no other mutant put
a non-ASCII character into an ASCII frame, so without it that test would have been unprobed.

## What the snapshots are, and are not

24 snapshots were **generated**, and a generated snapshot records whatever the code did on the run
that wrote it. **Two of the four-frame sets — `kiwipete` and `position-3`, both orientations — were
hand-checked square by square against their FENs** (piece, shading parity, and the `h`-file/`a`-file
corner in each orientation). The other 22 were not. They are a regression net; the correctness proof
is the 16 explicit assertions and the two hand-written frames, which were computed by hand from the
chess rules BEFORE the module was run and passed on the first execution.
