---
id: 20260813T230500Z-qe-e2e-decision-the-gate-deletes-its-own-row-and-here-is-the-mutant-that-earned-it-7de3c9b3
kind: decision
by: qe-e2e
at: 2026-08-13T23:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - src/render-seam.test.ts
  - 20260813T223012Z-software-engineer-decision-four-instrument-choices-and-the-row-i-did-not-delete-d5f95e4b
  - 20260813T215008Z-qe-e2e-artifact-ref-789230d8
supersedes: 
---

# The overlap disposed of: I DELETED my own `A4 (width)` row. A mutant the Engineer had not run says it was strictly weaker than the clause it duplicated.

The Engineer kept this row and flagged the overlap rather than resolving it, on the reasoning that
deleting a gate row on the hop answering that gate looks like softening. **The instinct was right and
the disposal was left to me. I am deleting it, and the reason is measured, not aesthetic.**

## What the row was, and what it is now

It was written at the first gate while `A4` read its width off `frame[0]`. `A4` now derives the width
from the three panels **for both orientations**, and `fixture()` defaults to `("unicode",
"white-bottom")` — which is precisely `A4`'s first loop iteration. The row is a white-bottom-only
restatement of a clause that is now asserted twice over, once per orientation, thirty lines above it.

## The mutant that decided it: `X2b`

`X2` pads every board row in both orientations. **`X2b` pads only in `black-bottom`** — same nine
blanks, still digit-free:

```ts
board: renderBoard(history.position, mode, orientation).map((row) =>
  orientation === "black-bottom" ? row + "         " : row),
```

```
X2b  ->  1 failed | 11 passed (12)
   x A4 — the board region is the merged renderer's, and the two orientations differ   (:241)
     A4 (width) — GREEN
```

**The standalone row is blind to a padding bug the repaired `A4` catches.** It is not a second guard;
it is a strictly weaker copy of half of one, and a row that looks like independent coverage while
missing a variant of the very mutant it was written for misleads the next reader about what is
guarded.

## Deleting it loses no kill — measured on every mutant this ticket owns

| mutant | with the row | with the row DROPPED |
|---|---|---|
| `X2` (self-padding, both orientations) | `A4` + `A4 (width)` red | **`A4` red** |
| `X1` (orientation ignored) | `A4` red | **`A4` red** |
| `X2b` (self-padding, black-bottom only) | `A4` red, row **green** | **`A4` red** |
| `X3b` (second board implementation) | `A11` red | **`A11` red** |

**And it does not even guard the regression it was kept for.** With `A4`'s width deliberately
regressed to `(frame[0] as string).length` and the whole-frame equality left in place — the realistic
one-edit decay — `X2` still reds `A4`: the row adds a second, narrower red, never the only one. It is
the sole guard only if a future hop regresses the width line **and** deletes the whole-frame equality
in the same edit, which is two deliberate acts, not an accident.

The last argument for keeping it — *"when it reds it names the width property alone"* — is already
served by the runner: run A reports `src/render-seam.test.ts:241` with the 27-column against
21-column diff, which names the width and nothing else.

## Why this is not softening, stated plainly so nobody has to take it on trust

- **Nothing was deleted to make anything pass.** The suite was green before the deletion and is green
  after it. `A4` reds on `X2` **on its own**, with the whole-frame equality removed (run B).
- **The three rows the gate added that still discriminate all stay**: `A11` (kills `X3b`),
  `A1 (messages)` (kills `X11`), `A2 (thinking)` (kills `X12`). Only the one row that stopped
  discriminating went.
- **`AGENTS.md` rule 12** — flag, don't delete — governs *pre-existing* code an agent was not asked
  about. This row is the gate's own, written six commits ago, and the subtask assigns its disposal
  here explicitly. The rule is honoured in substance anyway: the reason, the measurement and the
  mutant that earned the deletion are recorded **in the file itself**, in the block comment above the
  three surviving rows, so a reader who wants it back has the evidence and one revert.

## The cost, recorded honestly

`src/render-seam.test.ts` **+10/−19**; the file goes **12 → 11** tests and the lane **828 → 827** on
29 files. **No file was added or removed**, so `ADR-0008`'s lane allotment is untouched and stays
spent at one. `src/render-seam.ts` md5 `bc18d083…` unmoved. `plans/traceability.md`'s `Tests` cell was
appended to, because the Engineer's entry recorded "12 in the file, 828/828" and "the standalone
`A4 (width)` row is KEPT" — leaving that standing would have put a statement in the trace that this
hop made false.
