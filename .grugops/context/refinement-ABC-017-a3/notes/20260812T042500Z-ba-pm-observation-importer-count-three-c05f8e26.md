---
id: 20260812T042500Z-ba-pm-observation-importer-count-three-c05f8e26
kind: observation
by: ba-pm
at: 2026-08-12T04:25:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-a3
  - ABC-017
  - ABC-012
  - NFR-002
  - src/history.ts
  - src/history-pane.nfr.test.ts
  - 20260812T010400Z-software-engineer-observation-7f1ac06d
supersedes:
---

# `src/history.ts` has THREE test runtime importers, not two — and the third is the one a `grep` misses

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`.**
> Counted with a statement-scoped parse rather than a line `grep`, because a line `grep` is what
> produces the wrong answer here.

## The count

| file | how it pulls `src/history.ts` into the runtime graph | whose |
|---|---|---|
| `src/history.test.ts` | static value import | pre-existing |
| `src/history-pane.test.ts` | static value import — `newGame` / `playMove` / **`takeBack`**, which `A7` requires by name | **`ABC-017`** |
| `src/history-pane.nfr.test.ts` | **its static import is `type`-only**; the runtime pull is `vi.mock("./history.ts")` + `await importOriginal()` + a dynamic `await import("./history.ts")` | **`ABC-017`** |

**This ticket takes the count from one to three, not from one to two.** The Engineer's note names two
and misses its own `*.nfr.test.ts` file.

## Why the miss matters, which is the whole reason the flag exists

The Security/NFR block instructs the gate to *"`grep` for importers of `src/history.ts`"*. A `grep`
for `^import .* from "./history.ts"` classifies `src/history-pane.nfr.test.ts` as **type-only** and
misses it. **A gate counting by line `grep` reports two, agrees with the note it was handed, and both
are wrong** — the flag was written precisely so the gate would not be surprised, and as written it
would have confirmed the wrong number.

## `NFR-002`'s claim is intact and was re-verified, not inherited

**PRODUCTION runtime importers: ZERO.** `src/history-pane.ts` imports `GameHistory` as `import type`,
erased by `verbatimModuleSyntax`. Asserted in-suite against delivered source, so it cannot rot. The
`O(window)` structural fact is unchanged.

## Where it is recorded, and why not in `## Dependencies`

**In the Security/NFR block, at the bullet that instructs the gate to grep.** A `## Dependencies` line
records an **edge between tickets**; this is a **measurement the gate makes**. Putting it in
`## Dependencies` would file it where the reader who needs it does not look. **That is the ruling on
the question the brief asked.**

## One narrowness in the in-suite guard, for QE, and NOT a criterion change

The structural assertion matches **static value imports** only. Measured: a production module carrying
`void import("./history.ts")` — a genuine runtime pull — **passes it**. `A11`'s clause says *"zero
runtime importers"*; the guard implements *"zero static value importers"*.

The realistic regression the clause exists to catch — someone writing
`import { repetitionCounts } from "./history.ts"` — **is** caught. The dynamic form is not.
**The criterion is right and stays as it is;** the gap is in the guard's reach, and QE can decide
whether closing it is worth the line.
