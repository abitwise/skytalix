---
id: 20260811T214500Z-orchestrator-observation-d7e41f09
kind: observation
by: orchestrator
at: 2026-08-11T21:45:00Z
verified_by: orchestrator (ran every command in this note against the branch's own object database)
confidence: high
refs:
  - ABC-019
  - plans/tickets/ABC-019-turn-loop-skeleton.md
supersedes:
---

# Verification of the seventh hop: substance holds, ONE integrity claim is overstated and is corrected here

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository. **No `finding`** — the
> lane is RED, so there is no gate id to stamp against.

## What I re-ran rather than accepted

| claim | verdict |
|---|---|
| `src/` never opened for edit | **holds** — `git diff HEAD~1 HEAD -- src/` is empty |
| `src/turn-loop.ts` md5 `bd793612…` | **holds** |
| `src/history-pane.nfr.test.ts` md5 `e27a8387…` — the trap file | **holds**, unchanged |
| lint / typecheck | **0 / 0** |
| suite unchanged | **holds** — 2 failed / 794 passed (796) on 28 files, skip 0 |
| branch 0 behind `main`, tree clean | **holds** |

## The one claim that does not survive as worded

The hop reported **"`## Acceptance` byte-identical to `HEAD`"**. **It is not.** Measured on the
section between `## Acceptance` and the next `## `:

- md5 `22ba0d1f…` before → `231dc391…` after
- **+51 lines inserted, 0 deleted**

**The SUBSTANCE of the claim is nevertheless true, and that is the point of writing this down rather
than just contradicting it.** The insertion is the hop's own `> **AMENDED …**` banner — the same form
every prior hop on this ticket used — and the machine check that matters comes out clean:

- **every pre-existing line of `## Acceptance` survives byte-identical** (checked line by line, not by
  hashing the whole section)
- **zero deletions**, so no criterion could have been renumbered or removed
- the count is still **27** and the table still **18 rows**, exactly as the banner itself states

**So: no criterion was added, amended, renumbered or deleted — but *"byte-identical"* was the wrong
instrument to assert it with, because the hop's own banner lives inside the section it was measuring.**
The right assertion is the one above: pre-existing lines identical, deletions zero.

This is the recurring shape on this project — **believing an instrument without checking the
instrument** — and it is recorded as a small overclaim, **not** as a defect in the ruling. `[D53]`,
`[D54]` and `[D55]` are unaffected.

## Housekeeping

`.grugops/queue/claimed/` was left behind as an **empty untracked directory** after the claim was
released. Git does not track empty directories, so nothing was committed and nothing is lost; removed.
