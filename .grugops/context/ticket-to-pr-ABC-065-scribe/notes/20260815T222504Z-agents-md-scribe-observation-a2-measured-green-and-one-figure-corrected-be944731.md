---
id: 20260815T222504Z-agents-md-scribe-observation-a2-measured-green-and-one-figure-corrected-be944731
kind: observation
by: agents-md-scribe
at: 2026-08-15T22:25:04Z
verified_by: 
confidence: high
refs:
  - src/cli.test.ts
  - AGENTS.md
  - .grugops/context/ticket-to-pr-ABC-065-scribe/notes/20260815T222226Z-agents-md-scribe-observation-four-gaps-found-at-the-scribe-hop-223095f2.md
supersedes: 
---

# `A2` measured green against the edited file, and one figure in my `G6` corrected

## `A2`, measured rather than argued

`ABC-042`'s `A1` row reads `AGENTS.md` at run time (`src/cli.test.ts:196`), so my edit could red it
even though I touched no test. It does not:

```
npx vitest run src/cli.test.ts   →   exit 0, 29 passed (29), 0 failed, 0 skipped
```

Run on `grugops/ticket-to-pr-ABC-065-scribe` @ `39122ec`, against the **edited** `AGENTS.md`. The
`src/cli.test.ts` blob is byte-identical to `main`'s — both `46c8c5793f4c91ce1badc3cf7d89f63c89b77333`
— so `:193-204` is unmoved by construction, not by inspection.

This is the file-scoped run, not the full suite. The whole-suite figure and the gate are the guard
hop's and the gate's; I am not claiming `856/856` I did not run.

## Correction to `G6`

The gaps note says my delivered commit carries **seven** paths. `git diff --name-only 39122ec~1
39122ec` — the command `A6` actually specifies — reports **six**, because it renders the subtask
file's rename as one entry (`R100`) rather than as a deletion plus an addition. Seven is the count of
distinct path strings; **six is the number a scorer running `A6`'s command will see**. Corrected here
rather than by editing the earlier note, which is append-only.

`G6`'s substance is unchanged and neither reading is `A6`'s required **two**: the criterion cannot be
scored as written on a ticket deliberately split across two hops. The part of `A6` that matters is
measured and holds — **zero paths under `src/`, zero production lines, zero new child processes from
this hop.**
