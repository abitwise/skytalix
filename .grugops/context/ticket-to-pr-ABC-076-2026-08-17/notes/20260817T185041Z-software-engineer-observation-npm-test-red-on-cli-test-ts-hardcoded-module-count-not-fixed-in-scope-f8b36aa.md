---
id: 20260817T185041Z-software-engineer-observation-npm-test-red-on-cli-test-ts-hardcoded-module-count-not-fixed-in-scope-f8b36aa
kind: observation
by: software-engineer
at: 2026-08-17T18:50:41Z
verified_by:
confidence: high
refs:
  - src/cli.test.ts
  - src/evaluate.ts
  - plans/tickets/ABC-076-evaluation-material-and-piece-square-tables.md
  - plans/tickets/ABC-031-coordinate-move-input.md
supersedes:
---

# `npm test` is RED on a file `ABC-076` may not touch: `src/cli.test.ts` counts production modules and the count is hard-coded. `ABC-031` collides with it too.

## The failure, exactly

```
FAIL src/cli.test.ts > ABC-042 — the shape of what was delivered
     > A3 — the entry point is flat in src/, where the licence guard can see it
AssertionError: expected [ 'apply.ts', 'cli-options.ts', …(19) ] to have a length of 20 but got 21
```

`src/cli.test.ts:733` is `expect(productionModules()).toHaveLength(20)`. **Any new production module
in `src/` reds it.** `src/evaluate.ts` is the 21st. Nothing about the evaluator is wrong and nothing
about `ABC-042`'s intent — the entry point is flat, and the row's other three assertions (`cli.ts`
present, `cli-options.ts` present, no nested `.ts`) still pass.

## Measured, not assumed

With `src/evaluate.ts` and `src/evaluate.test.ts` moved out of the tree and put back afterwards,
`npx vitest run src/cli.test.ts` on this branch is **42 passed (42)**. So the branch baseline is
green and the red is caused solely by the module count going 20 → 21.

## Why I did not fix it, though the fix is one token

- **`ABC-076`'s own security firing threshold is "the diff touches any file outside the new
  evaluation module and its test file"**, and the Orchestrator's dispatch repeated it. Editing
  `src/cli.test.ts` fires it.
- **The correct value depends on merge order and I cannot know it.** `ABC-031` is in flight on
  `grugops/ticket-to-pr-ABC-031-2026-08-17` adding `src/coordinate-move.ts`, and its branch already
  carries a `3/1` edit to `src/cli.test.ts` — the same line, bumped to 21. **After BOTH tickets land
  on `main` the number must be 22.** Whichever branch writes 21 is wrong for the other's merge, so
  the value belongs to the hop that integrates them, not to either engineer working alone.
- It is not a soften-the-test situation and it was not treated as one: no assertion was weakened,
  skipped or relaxed anywhere. Skip count is still 0.

## What the next hop needs to do — stated so it costs nothing to pick up

Set `src/cli.test.ts:733` to the true count at merge time — **22 if `ABC-031` and `ABC-076` both
land, 21 if only one does**. Separately worth a ticket, not taken here (coding rule 5): the
assertion counts modules by hand, so it will red on every future production module and will keep
charging this tax to whoever adds one. Deriving the count, or asserting the flatness property
without the magic number, would end that; that is a decision for BA/PM and the Orchestrator, not a
drive-by refactor of working code.

## One constraint that bit the ticket's own test note, recorded for `ABC-082`

Test note 1 says the mirror helper is reused by `ABC-082` and `ABC-083`. It cannot be reused as
delivered: **Biome's `lint/suspicious/noExportsInTest` forbids exporting from a `*.test.ts` file**
(it failed `npm run lint` when `mirrorPosition` was exported), and the security threshold forbids
adding a third, non-test helper file. The two rules leave no in-scope way to share it, so
`mirrorPosition`, `buildCorpus` and `clonePosition` are module-private in `src/evaluate.test.ts`
with a header comment telling whoever takes `ABC-082` to lift them into a plain helper module (e.g.
`src/eval-corpus.ts`) and import them from both suites rather than retype them. **The corpus must
not fork — that is the whole point of BA/PM's 2026-08-17 widening decision.**
