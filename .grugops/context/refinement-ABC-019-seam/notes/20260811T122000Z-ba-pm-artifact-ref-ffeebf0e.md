---
id: 20260811T122000Z-ba-pm-artifact-ref-ffeebf0e
kind: artifact-ref
by: ba-pm
at: 2026-08-11T12:20:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - plans/tickets/ABC-019-turn-loop-skeleton.md
supersedes:
---

# What this hop changed on disk, and what QE should build its net against

> **Hand-authored** — `scripts/context-io.ts` absent, `mcp__grugops__propose_note` unavailable.
> **Nothing here is a `finding`.**

## Files written

| File | What |
|---|---|
| `plans/tickets/ABC-019-turn-loop-skeleton.md` | the nine rulings, marked `[D28]`–`[D37]` in place; `A9b` added; test-note row 14 added; third-hop amendment header and DoR re-check |
| `.grugops/context/refinement-ABC-019-seam/notes/` | this note plus the `decision` and `observation` notes |
| `.grugops/queue/claimed/refinement-ABC-019-seam/` | the claim (atomic `mkdir`) and the subtask file, moved from `pending/` |

**No other file was written.** Specifically not: anything under `src/`, `plans/board.md`,
`memory-bank/50-decisions/`, `plans/tickets/ABC-016-status-panel.md`, `plans/tickets/ABC-021-*.md`,
`plans/traceability.md`.

## The nine rulings, and which one changes the code

| # | Ruling | Marker | Code? |
|---|---|---|---|
| 1 | render seam takes a **fourth `messages` argument**; the 3-arg form could not satisfy `A5` | `[D28]` | no |
| 2 | `A3b`: `gameStatus` is **`plies + 1`**, `repetitionCounts` is **0**; `A3`'s order clause clarified | `[D32]` | no |
| 3 | `## Scope`'s *"either seam"* = **repair**; `A9`'s named reason = **engine only** → **`A9b` added** | `[D31]` | **YES** |
| 4 | `A2`'s cadence formula **over-counted on every EOF run** | `[D29]` | no |
| 5 | the **glyph mode is not a loop parameter** | `[D30]` | no |
| 6 | `NFR-002` derivation was **missing `A10`'s `legalMoves` term**; **no bar moves** | `[D36]` | no |
| 7 | `A12` met in **FULL**; enumeration guard now a stated clause | `[D33]` | no |
| 8 | `A17` met in **FULL**; lane half and out-of-tree half stated separately | `[D34]` | no |
| 9 | test-note row 3's obvious fixture is a **trap**; written down | `[D35]` | no |

Plus `[D37]`: the `ABC-016` dependency is cited **by clause content**, not only by criterion number.

## For the Engineer — the one code change owed

`src/turn-loop.ts:209`, inside the `if (humanToMove)` branch. The engine branch already has the shape;
the input branch has no `try`/`catch` at all:

```ts
      const outcome = await input(history);
```

`A9b` requires it to repair and rethrow — `takeBack(history, 0)` then `throw` — so the exception
reaches the caller with the board clean. **No new module, no new import, no new terminal-reason value,
no signature change, no new test FILE.** Test-note **row 14** reuses the mid-bracket throwing stub
shape `A9` already provides (`midBracketThrowingEngine`, `src/turn-loop.test.ts:427-433`), pointed at
the input seam.

## For QE — what moved, so the mutant net is built against the settled text

**`A9b` is the only NEW behaviour.** Six mutants worth naming for it, four of which the delivered build
would currently fail:

1. no handler at all on the input seam — **the delivered build**; fails `A9b` (i);
2. repairs but swallows — returns `{ result: null, reason: null, exitCode: 0 }`; fails (ii) **and is
   indistinguishable from `A8`**, which is the whole reason (iii) exists;
3. repairs and returns a tenth reason value; fails (iii) and `A14`;
4. rethrows without repairing; fails (i) — and note that a stub throwing **before** touching the board
   passes it anyway, which is why the fixture shape is part of the criterion;
5. a frame emitted on end-of-input — passes `A8`, fails the corrected `A2`;
6. a loop that skips the initial evaluation — passes a `plies`-count reading of `A3b`, fails the
   corrected `N + 1`, and plays a phantom ply on an already-dead starting position (`## Test notes`
   row 3).

**The other eight rulings changed no behaviour**, so the existing 715/715 net stands under them —
`A2`, `A3`, `A3b`, `A12` and `A17` now describe what the delivered build already does.

## Gate state at the end of this hop

Unchanged by this hop, because this hop wrote only markdown: **lint / typecheck / build exit 0,
715/715 on 24 files, skip 0, 0 behind `main`** — re-run by me before the edits, and the edits touch no
file any gate reads. **`A9b` is not asserted anywhere yet**, and no note here claims otherwise.
