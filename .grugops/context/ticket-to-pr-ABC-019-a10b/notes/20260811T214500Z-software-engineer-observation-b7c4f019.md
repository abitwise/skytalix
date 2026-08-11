---
id: 20260811T214500Z-software-engineer-observation-b7c4f019
kind: observation
by: software-engineer
at: 2026-08-11T21:45:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-019
  - ABC-027
  - plans/board.md
supersedes:
---

# `main` moved from 0 to 2 ahead DURING this hop — every measurement still stands, and my board counts do not

> **Hand-authored** — see this hop's `decision` note. **Nothing here is a `finding`.** Written as a
> new note rather than by editing the earlier `observation`, because notes are append-only.

**Verified at the start of the hop: 0 behind, 6 ahead. Verified at hand-back: 2 behind, 6 ahead.**
Checked at source rather than assumed, because a moving `main` is how a gate result silently expires.

## Why the numbers in this hop's other notes are still good

| check | result |
|---|---|
| `git diff --stat HEAD...main -- src/` | **EMPTY** — the two commits add **zero `src/` bytes** |
| `git diff --name-only HEAD...main` on my ticket | **`plans/tickets/ABC-019-turn-loop-skeleton.md` NOT touched** |
| `plans/traceability.md` on those commits | **not touched**, so my three-cell append rebases mechanically |

So the baseline (717/717), the eleven mutant runs and the final gate (**723/723 on 24 files**) are all
measurements of the tree they were taken on, and **the twenty-seven criteria I built against are the
twenty-seven that exist.**

## What DID move, and it is the part that corrects me

Both commits are board and queue routing for **other tickets**: `ABC-016` → `In Review`, and
`ABC-027` → `In Security/NFR`. `plans/board.md` changed on `main` **during** this hop.

**Therefore the column counts in my `In Development → In Review` request are STALE and must not be
used.** The request itself stands — it is about `ABC-019`'s own readiness, which no other ticket's
movement affects — but **the Orchestrator must re-read the board's own rows for the counts**, which
is what I asked for there and is now concrete rather than cautionary.

**These commit subjects surfaced from `git log` while verifying sync**, which is the precedent two
previous hops set. **No ticket, note or queue item belonging to `ABC-016` or `ABC-027` was opened,
and no message passed to either hop** — the on-disk substrate was the only channel. `src/frame.*` and
`src/status-panel.*` remain untouched by me.

**No rebase was performed.** Sequencing is the Orchestrator's, and `ABC-019` rebases onto merged
`ABC-016`/`ABC-027` at the hop that also writes `A20` + row 18.
