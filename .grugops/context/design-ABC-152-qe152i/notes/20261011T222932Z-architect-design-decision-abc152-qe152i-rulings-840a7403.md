---
id: 20261011T222932Z-architect-design-decision-abc152-qe152i-rulings-840a7403
kind: decision
by: architect-design
at: 2026-10-11T22:29:32Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-030
  - ADR-0042
  - QE-152-i
  - QE-152-j
  - RISK-ABC152-SPY-QUERY
  - src/cli.test.ts
  - memory-bank/50-decisions/ADR-0042-vitest-4-1-with-the-module-runner-off-turns-the-lane-red-beyond-spy-form-rewrites-so-no-runner-off-lever-is-built-and-the-bump-goes-to-the-owner.md
  - 20261011T222155Z-qe-e2e-observation-abc152-delta-gap-register-e0c0d051
  - 20261011T222155Z-qe-e2e-observation-abc152-delta-comments-gates-merge-5cf58584
  - 20261011T222155Z-qe-e2e-observation-abc152-delta-group4-census-9dc4714f
  - 20261011T214847Z-architect-design-decision-abc152-qe-rulings-e50fbbe3
supersedes:
---

# `ABC-152`: `QE-152-i` extends ruling 10 by one comment line, and `QE-152-j` rewords `RISK-ABC152-SPY-QUERY` without widening it (`ADR-0042` addendum 3, rulings 12–13)

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). **Nothing was
measured.** The Architect read QE's three delta notes and `src/cli.test.ts` at the tip `5eafe95c` (read with
`git show`). Addendum 3 is the authority. This note gives the SE's exact edit.

| asked | ruling | ADR-0042 |
|---|---|---|
| `QE-152-i`: a ruling 10 extension, or a follow-up? | **Extend ruling 10.** One comment-only SE commit replaces `src/cli.test.ts` line 6, and only that line | ruling 12 |
| `QE-152-j`: does it change `RISK-ABC152-SPY-QUERY`'s wording? | **Yes, the wording changes:** it now names the stub half. The scope, the trigger, the low severity, the owners and the review tripwire all stay as they were | ruling 13 |

## The SE's edit (`QE-152-i`)

Replace line 6 of `src/cli.test.ts`:

```
 * it is not an `*.nfr.test.ts`: nothing here re-routes the module graph.
```

with exactly:

```
 * it is not an `*.nfr.test.ts`: it re-routes `glyph-mode.ts` for every test here, but calls through.
```

- The new line is 101 bytes, against line 5's 102. Line 5 stays verbatim, so the sentence reads "Its only `vi.mock` is
  `{ spy: true }`, so it is not an `*.nfr.test.ts`: it re-routes `glyph-mode.ts` for every test here, but calls
  through."
- **Bounds (ruling 10's):** comment-only, in its own commit. No line is added or removed. `expect(` stays at 324. No
  other line and no other file. `npm test` must stay at 56 / 1741, and lint must stay green.
- **Why it is true:** `:53` is the file's only `vi.mock`, and its form is `{ spy: true }`, which calls through (ruling 1).
  The re-route is what lets `A5`'s expected-0 guard (`:1150`) see `cli-options.ts`'s call. That is `ABC-030`'s
  mechanism, and it is now stated.
- **The date:** R1 `66aaa39e` made the line false. QE's "since `88009d0b`" is the tip QE graded.

## `RISK-ABC152-SPY-QUERY`, reworded (`QE-152-j`)

> A `{ spy: true }` automock neither counts nor stubs calls made through a query-string import of the same file.
> That import is a separate, unmocked instance. At `PUZZLE_DEEP=weakened` it blinds the red demonstration (54/58,
> A3 red) on 3.2.7 and 4.1.11 alike. The graded reading and A3 catch it; an exit-code reader does not.

- It is low, and the owners are the Architect and QE. The tripwire reads any new `?` import of a production module
  in non-test code against every `{ spy: true }` guard **and stub** on that module.
- It is not a regression: QE's x2 plant is equally blind on base 3.2.7.

## What this does not change

- Addendum 2's rulings 8–11, `V4`'s group 4, ruling 7's count (**0**), and the UAT-waiver measurement (`^src/` over
  the delivered diff is still empty, because the edit is in a `*.test.ts` file).
- `QE-152-k` belongs to the Orchestrator at merge. This hop's trace row is one more tail row on `main`'s side.

## Next

The SE makes the one comment-only commit on `grugops/ABC-152-vitest-4-1-runner-off`. QE confirms that it is comment-only
and matches the text above. No full re-check is owed. Then the ticket goes `In Security/NFR`.
