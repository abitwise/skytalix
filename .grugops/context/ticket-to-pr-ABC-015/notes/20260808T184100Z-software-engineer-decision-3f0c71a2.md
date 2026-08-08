---
id: 20260808T184100Z-software-engineer-decision-3f0c71a2
kind: decision
by: software-engineer
at: 2026-08-08T18:41:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - ABC-018
  - EPIC-002
  - EPIC-006
  - NFR-007
  - src/glyph-mode.ts
  - src/render.ts
  - plans/tickets/ABC-015-glyph-mode-selection.md
  - 20260808T182200Z-ba-pm-decision-69e00126
  - 20260808T182900Z-orchestrator-decision-5dad0435
supersedes: 
---

# The session's cached value lives in a CLOSURE — the one structural choice this ticket left open

BA/PM left this open in those words (*"a memoised accessor, a closure, or a value the caller holds —
that is structure and it belongs to the engineer"*) and the Orchestrator's pull note declined to
close it. It is closed here, with the reasoning, because the next role should be able to check the
choice rather than inherit it.

## The two constraints that had to hold AT THE SAME TIME

This is the whole of the problem, and it is why the answer is not simply "read the environment where
you need it":

- **Acceptance criterion 10** requires the **rule** to read **no ambient global** — the same tuple
  must answer the same across a rewrite of `process.env` and `process.stdout.isTTY`.
- **`NFR-007`'s bar** explicitly permits the **session** to read `process.stdout.isTTY` and
  `process.env` — that is how the answer is reached at all, and the bar is that it reaches it with
  zero filesystem and zero process operations.

So the ambient read has to exist and has to sit somewhere the rule is not. Two functions, one seam:

- `selectGlyphMode(signals: GlyphSignals): GlyphMode` — the five-row table, evaluated in order,
  reading only its argument. Nine tuples in one run.
- `beginGlyphModeSession(flags: GlyphFlags): GlyphModeSession` — reads the two ambient signals once,
  hands them to the rule, closes over the answer, returns the accessor.

## Why the closure, and what was rejected

**A module-level memo (`let cached` + `sessionGlyphMode()`) — rejected.** It cannot be tested for
more than one session without an exported reset, and that export is precisely the thing able to
break the session-constant promise this ticket exists to keep: anything in the process could call it
and change the mode mid-session. Adding production API whose only consumer is the test suite also
runs straight into coding rules 5 and 7. A closure needs no reset — a new session is a new closure.

**A plain value the caller holds — rejected, and this one was the tempting option** because
`renderBoard` already takes `mode` as a parameter, so "call it once at startup and pass the value
down" is the shape the codebase is already in. It fails on two counts. It pushes the once-ness back
to `EPIC-006`, which is the exact ownership seam BA/PM closed **onto this ticket** on 2026-08-08.
And it makes acceptance criterion 11 unfalsifiable again — the only test a bare `const` admits is
that a `const` does not mutate, which is the defect BA/PM removed. Re-introducing it through the
structure would have been the same bug wearing different clothes.

**So the accessor is a function ON PURPOSE, and `() => mode` is not a wrapper to be inlined.** Its
job is to be callable a second time, so the named mutant — the implementation that re-probes the
environment on every call — has somewhere to fail. The module header says so, because a future
reader tidying this away would silently retire criterion 11.

**Eager, not lazy.** The ambient read happens when the session begins, not on first request, so
epic acceptance `2b`'s *"decided exactly once, before the first frame"* is true by construction and
the module carries no mutable state at all.

## A new module, not an addition to `render.ts`

`src/render.ts`'s own header records that *"nothing here reads `isTTY`, `process.env` or the terminal
size"*, and epic acceptance `4c` and `EPIC-006`'s pipe-driven end-to-end test both stand on that.
Putting the ambient reads there would have broken a documented contract to save a file. `ABC-014`'s
module is byte-identical to merged `main`.

`src/glyph-mode.ts` imports **one type** (`GlyphMode`) and nothing else.
