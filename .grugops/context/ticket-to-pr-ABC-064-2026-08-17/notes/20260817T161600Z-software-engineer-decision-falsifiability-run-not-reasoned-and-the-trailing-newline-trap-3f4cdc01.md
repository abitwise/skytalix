---
id: 20260817T161600Z-software-engineer-decision-falsifiability-run-not-reasoned-and-the-trailing-newline-trap-3f4cdc01
kind: decision
by: software-engineer
at: 2026-08-17T16:16:00Z
verified_by:
confidence: high
refs:
  - ABC-064
  - ABC-063
  - src/cli.test.ts
  - src/frame.ts
supersedes:
---

# Falsifiability was RUN, not reasoned — eight mutations, eight reds; and the trailing-newline trap that would have shipped a wrong assertion

`ABC-063`'s `A3` nearly shipped **unfalsifiable**, and it was caught by running the mutation rather
than reasoning about it. The Orchestrator's brief made that the standing instruction for this ticket.
So every criterion here was mutated and observed, before the delivery commit.

## The mutation table — each perturbs the OBSERVED value, i.e. simulates a defective build

| # | mutation | criterion | verdict |
| --- | --- | --- | --- |
| `M1` | a frame one row short | `A1` | **RED** — `white row count: expected [ 23 ] to include 22` |
| `M2` | a SECOND trailing newline | `A1` | **RED** — `white row count: expected [ 23 ] to include 24` |
| `M3` | a CSI written to stdout | `A2` | **RED** — `white CSI introducers: expected 1 to be +0` |
| `M4` | the coloured child's status row says `Black to move` | `A3` | **RED** — `black status rows, sliced for black-bottom: expected [ 'Black to move  1.    ', …(2) ] to deeply equal [ 'White to move  1.    ', …(2) ]` |
| `M5` | **vacuous-pass mode**: status panel blank on BOTH sides | `A3` | **RED** — `the default child's status rows are blank: expected '' not to be ''` |
| `M6` | the pair silently drops `random` | `A3` | **RED** — `the children A3 names: expected [ 'black' ] to deeply equal [ 'black', 'random' ]` |
| `M7` | the word `random` survives into a status row | `A4` | **RED** — `occurrences of \`random\` on the random child's stdout: expected 1 to be +0` |
| `M8` | **vacuous-pass mode**: an empty capture carries no word | `A4` | **RED** — `the random child printed no frame row: expected 0 to be greater than 0` |

**8 mutations, 8 reds, each redding the criterion it targeted and no other.** Every failure message
names the child (and for `A3` the orientation it sliced for), which is `## Test notes` 4's requirement
read back off a real failure rather than asserted about the code. The file was restored from the
in-memory original after each run and the suite re-verified green.

`M5` and `M8` are the ones worth keeping: both are the *vacuous* failure mode — the criterion
satisfied by an absence — and both are the shape `ABC-063` was nearly caught by. Neither passes.

## The trap this ticket actually contained: "exactly one trailing newline" is NOT `endsWith("\n\n") === false`

This is the decision most likely to be second-guessed, so it is recorded with its evidence.

`assembleFrame` pushes a **reserved, deliberately unpadded, EMPTY prompt row** as the frame's last row
(`src/frame.ts:205`), and the append writer emits `frame.join("\n") + "\n"`
(`src/frame.ts:244`). A correct stream therefore genuinely **ends in two newline characters** — one
from the join before the empty prompt row, one from the writer. The obvious assertion

```ts
expect(stdout.endsWith("\n\n")).toBe(false);   // WRONG — reds on a correct build
```

would have been red on a correct build and would then have been "fixed" by weakening it. `:308`
already avoids this by comparing the whole byte-exact tail, but `:308`'s instrument is fenced
byte-identical and is `npmRun`'s.

**What was written instead**, deriving the count and needing no literal:

```ts
expect(rows[rows.length - 1], `${name} does not end with a newline`).toBe("");
expect(heights, `${name} row count`).toContain(rows.length - 1);
```

The stream splits into the frame's rows plus **exactly one** empty tail element. A missing newline
reds the first row; a second newline pushes the count to 24 and reds the second (`M2` proves it); a
short frame reds it the other way (`M1`). Row count and "exactly one newline after the last row" are
both carried, and neither is a literal — `heights` comes from `frameOf(mode, orientation).length`.

## Two smaller decisions

- **`A3` compares against the DEFAULT CHILD's delivered rows, not against a reference frame.** The
  criterion says "byte-identical to the default child's status rows", and comparing both sides to a
  reference would let a build that broke the status panel on *every* child pass. The default child's
  rows are located as the frame TAIL of `npmRun` (npm banners first), the way `:263` locates it.
- **`random` is sliced under BOTH admissible orientations.** Its draw is not knowable from outside the
  child. Both ascii board regions are the same height today, so asserting under both costs nothing and
  reds honestly if that ever stops being true — rather than silently picking one slice and comparing
  the wrong rows.

## What was deliberately NOT done

No production line, no new child (`spawned` is still `10`), no pty, no row-count literal, no edit to
`:244`/`:308`/`:356`, and no assertion of *which* colour `random` drew — `:356` owns that and it is
not re-opened. `ABC-042`, `ABC-061`, `ABC-062`, `ABC-063` and `ABC-066` were not re-opened.
