---
id: 20260807T101000Z-qe-e2e-observation-eadbdf99
kind: observation
by: qe-e2e
at: 2026-08-07T10:10:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - EPIC-002
  - src/render.test.ts
  - src/__snapshots__/render.test.ts.snap
supersedes: 
---

# Two delivered assertions were blind, and it was MEASURED rather than argued

Both belong to acceptance criteria that were reported green. Both were green. Neither assertion was
doing the work its criterion describes, and in one case the assertion cannot fail at all.

## 1. Criterion 2's last clause is UNFALSIFIABLE as written

The ticket's second criterion ends: *"and the frame is **not** equal to the white-at-bottom frame
with its rows simply reversed"*, with the reason spelled out — a one-axis flip produces a board
that looks plausible and is wrong. The delivered assertion is:

```ts
expect(black).not.toEqual([...white].reverse());
```

`[...white].reverse()` reverses **all nine rows**, which moves the file-label row to index 0. The
black-bottom frame has a **board row** at index 0. The two arrays therefore differ at index 0 no
matter what the renderer did, and the assertion passes unconditionally.

**Demonstrated, not reasoned:** the exact defect the clause exists to catch was applied to
`src/render.ts` (`const file = whiteBottom ? column : 7 - column;` → `const file = column;`, files
never mirrored, a rank-only flip) and both forms of the clause were evaluated against it —

| form | on the pristine module | on the rank-only-flip mutant |
|---|---|---|
| delivered: whole frame vs whole frame reversed | passes | **still passes** |
| the eight BOARD rows vs the board rows reversed | passes | **fails** |

**The criterion's INTENT was already green.** The assertion beside it —
`expect(glyphsAcrossRow(black, 0)).toBe("RNBKQBNR")`, the king before the queen — is a real killer
and catches a one-axis flip on its own. Only this clause was empty. The falsifiable form is now in
the suite alongside it; the delivered line is left in place and is named here rather than quietly
deleted, so the record shows which assertion was carrying the criterion.

## 2. Criterion 1's file-label assertion is trimmed

```ts
expect(fileLabelRowOf(frame).trim(), mode).toBe("a b c d e f g h");
```

`.trim()` removes exactly the property the label row exists to have. A mutant that shifts every
letter one column left — `` ` ${letter}` `` → `` `${letter} ` `` — yields `"  a b c d e f g h "`:
still 18 characters, so the geometry test passes; still `"a b c d e f g h"` after trimming, so this
assertion passes. What actually changed is that **no label sits over its file any more** and the
frame now carries **trailing whitespace**, which the Engineer's own layout decision called out as
fragile in exactly the snapshot diffs this ticket asks for.

That mutant is killed by 8 tests and **not one of them is an acceptance-criterion test** — two
hand-written frames and six snapshots. The same is true of a shading inversion confined to rank 5,
which no corner assertion touches.

The suite now asserts the label row **untrimmed and exact**, checks that each letter's column index
equals its file's glyph column, and asserts `row === row.trimEnd()` for every row of every frame.

## Why this matters more than it looks: what a generated snapshot is worth here

For those two defect classes the snapshots were half the defence. **Measured on this install:**

| run | result |
|---|---|
| snapshot file deleted, no `CI` in the environment | **17/17 pass, 24 snapshots WRITTEN** — and the rewritten file is byte-identical to the committed one, which is a nice confirmation the renderer is deterministic and a bad one for the net |
| snapshot file deleted, `CI=true` | **6 tests fail**, nothing written |

This project has **no CI** (`AGENTS.md` `## Deployment posture`), so the gate is always run without
that variable. A snapshot net that rewrites itself on a missing file is a regression net against
accidental change and **not** a check that survives a `-u` or a deleted file.

**Not fixed here.** The remedy is one word in `AGENTS.md`'s test command, and that command table is
not this role's file. The exposure is reduced instead by the property tests above, which kill both
defect classes without a snapshot being involved.
