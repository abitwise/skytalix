---
id: 20260818T160520Z-software-engineer-observation-4e07
kind: observation
by: software-engineer
at: 2026-08-18T16:05:20Z
verified_by: 
confidence: high
refs:
  - ABC-103
  - src/cli.test.ts
  - src/render-seam.test.ts
  - src/history-pane.nfr.test.ts
supersedes: 
---

# The evidence: what was RUN for `A1` and `A2`, and the sweep result for `A3`

Every figure below was produced by running the command on the branch
`grugops/abc103-production-module-count`. Nothing here is inferred from reading.

## `A1` — a new module no longer reds it, in BOTH directions

1. **Placeholder added.** `printf '' > src/abc103-placeholder.ts`. Flat production-module count
   became **24** (`ls src/*.ts | grep -v '\.test\.ts$' | wc -l`). `npm test` → **999 passed, 35
   files**, exit 0. GREEN.
2. **The pre-change row RUN against that same tree, as a control.** The repaired `src/cli.test.ts`
   was stashed so the `main` version was on disk with the placeholder still present, and
   `npx vitest run src/cli.test.ts` was run. It **FAILED**, exactly once, on this row:
   `AssertionError: expected [ 'abc103-placeholder.ts', …(23) ] to have a length of 23 but got 24`.
   This is the arming control: it shows direction 1's green is the repair's doing, not an accident
   of the tree.
3. **Placeholder removed**, repair restored. `npm test` → **999 passed, 35 files**, exit 0. GREEN.

No assertion in the file now names a module total; the only surviving `toHaveLength` calls in
`src/cli.test.ts` are over unrelated corpora (argument tables, generated tokens, `process.*`
spellings), none of which is a production-module listing.

## `A2` — the purpose still has teeth. Proven twice, two different wrong builds

1. **The build the ticket names.** `git mv src/cli.ts src/cli/main.ts`, then
   `npx vitest run src/cli.test.ts`. The `A3` row went **RED**:
   `AssertionError: expected [ 'apply.ts', 'cli-options.ts', …(20) ] to include 'cli.ts'` at
   `src/cli.test.ts:731`. (Four other rows in the file also red with `ENOENT … src/cli.ts` — they
   read the entry point by name. Not this row's business, but recorded so the `qe-e2e` hop is not
   surprised.) Reverted with `git mv` back; tree byte-clean.
2. **The nesting ISOLATED from the move**, because vitest stops an `it` at its first failing
   `expect` and probe 1 therefore never reached the `nested` equality. A nested
   `src/cli/main.ts` was added while `src/cli.ts` stayed flat. The `A3` row went **RED** on the
   equality — `AssertionError: expected [ 'cli/main.ts' ] to deeply equal []` — and it was the
   **only** failing test in the file. **On this same build the deleted `toHaveLength(23)` would have
   been GREEN** (the flat count is unchanged at 23), which is the measurement behind the `decision`
   note's claim that the count added no discrimination. Removed; tree byte-clean.

## `A3` — the sweep, reported even though it is empty

- **`src/render-seam.test.ts`** — defines `productionModules()` at `:88` and consumes it only
  inside `runtimeImportersOf` at `:100`. Every `toHaveLength` / `.length` / `.size` in the file was
  enumerated (`:149`, `:151`, `:157`, `:204`, `:208`, `:212`, `:237`, `:241`, `:242`, `:277`,
  `:280`) and **none is an assertion on a production-module listing** — they are move counts, frame
  writes, row heights and glyph counts. **No total. No change needed.**
- **`src/history-pane.nfr.test.ts`** — defines `productionModulesIn(directory)` at `:163` and
  consumes it at `:322` and `:546`. Both consumers assert SET relations, not sizes: `:329`
  `expect(production).toContain("history-pane.ts")` and `:335` an equality between the runtime
  importers and the licensed drivers; `:546`'s listing is filtered to the declared frame producers at `:554`. The file's two
  `toHaveLength` calls (`:297` mock-call arity, `:304` `HISTORY_ROWS`) are unrelated. **No total. No
  change needed.**

So of the three files `A3` names, **exactly one needed a change and two did not.**
