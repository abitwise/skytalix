---
id: ABC-148
title: "The binder-count comment and the `ABC-113` page call four `[:=]`-free forms the open remainder, but `tsc` already closes two of them"
status: backlog
column: Backlog
size: XS
priority: P3
epic: EPIC-006
feature: —
---

# ABC-148 — narrow two remainder lists to the forms that really pass both `tsc` and the lane: ZERO assertions changed, ZERO production lines

> **Cut 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-fold-qe114-2026-10-11`, Workflow 07),
> from `QE-114-c` part 1 (MEDIUM, owner BA/PM; QE `…168698b8`, readings `…94a87a28`). **The over-broad list
> was BA/PM's own wording**, in `ABC-114` `A2`. That criterion is corrected on its page. This ticket corrects
> the two places that met it as written. **This hop ran nothing.**

## Problem

*User*: the next reader of `ABC-043` `A1`'s binder-count row in `src/cli.test.ts`, deciding what the row still
misses.

*Pain*: the comment's "WHAT THIS COUNT CANNOT SEE" paragraph says *"The open remainder is the `[:=]`-free
binder forms: `for…of`, `for…in`, `catch (history)`, and a contextually-typed callback parameter."* The
`ABC-113` page's correction under line 64 gives the same four forms as binders the regex "does not see".
That is true of the regex, except for a bare `history =>`, but it never says which forms the typecheck
closes. QE measured (`…94a87a28`, § A2):

| form | `tsc` | the file at the tip |
|---|---|---|
| `for (const history of [spare])` (`D4`) | 0 | 67 / 67 green: **open** |
| `(history) =>`, a parenthesised contextually-typed parameter | 0 | 67 / 67 green: **open** |
| bare `history =>` | 0 | **red** on the count row: the regex counts the `=` of `=>` |
| `for (const history in { spare })` | **2** | closed by the typecheck |
| `catch (history)` | **2** | closed by the typecheck |

So two of the comment's four "open" forms are closed by the typecheck, and "a contextually-typed callback
parameter" is open only when parenthesised. The comment's sentence is false for two forms. It undersells
the guard, and a reader acting on it would build an assertion for two forms that are already closed. The
page note is imprecise rather than false: it should say which of its forms the typecheck closes.

*Value*: the comment says exactly what is open. That is the standard `ABC-114` set for this block.

## Scope

- **Comment prose only, in `src/cli.test.ts`**, in that one paragraph.
- **The correction note under line 64 of `plans/tickets/ABC-113-two-instrument-residuals-in-epic-006s-own-test-files.md`**
  (`:67–70` at `117c1c8e`), corrected in place with the struck words kept. **Line 64's own narrowing ("the
  annotated-rebind spelling of `D3`") is correct and stays.**
- Each corrected sentence is **earned by a re-measurement at the repair hop**, never copied from QE's note.

## Out of scope

- **Closing `D4` or `(history) =>`.** That is a new assertion and its own ticket (`ABC-114` § Out of scope).
- Every other sentence in the block, which `ABC-114`'s second QE validated.
- `ABC-114`'s page and status. It stays delivered.
- Any file under `src/` that is not `src/cli.test.ts`; any line in it that is not `//`.

## Acceptance (Given/When/Then)

- **`A1` (re-measured, five forms).** **Given** each of the five forms in the table planted at the branch tip,
  one at a time, **when** `tsc --noEmit` and `npx vitest run src/cli.test.ts` run, **then** the `tsc` exit
  code and the file's result (failed / passed, and the failing row) are recorded for each. Every build is
  reverted, and `git status --porcelain` is empty after each.
- **`A2` (the comment says what `A1` showed).** **Then** the paragraph names as open **exactly the forms that
  were `tsc` 0 and green in `A1`**. It names the forms `tsc` rejected as closed by the typecheck, and it quotes
  the regex `/\bhistory\s*[:=]/g` as the reason the open forms are unseen. If `A1` disagrees with QE's table,
  `A1` wins and the disagreement is written in the delivery note.
- **`A3` (the `ABC-113` page).** **Then** the correction note under line 64 gives the same list as `A2`, with
  the struck words kept and the correction dated. Line 64 is byte-unchanged.
- **`A4` (the fence, from git).** **Then** `git diff --name-only <base> -- src/` lists exactly
  `src/cli.test.ts`; every added or removed line under `src/` matches `^[-+]\s*//`; the `it(` and `expect(`
  counts in the file are unchanged; `npm test` file and test counts equal the base, with 0 skips.
- **`A5` (author ≠ validator, as `ABC-114` `A7`).** **Then** the delivery note names the author, and the QE
  verdict comes from a different agent that re-plants all five forms itself. A verdict that quotes the
  delivery note's numbers FAILS this criterion.

## Dependencies

- **None blocking.** `ABC-114` is merged.
- **Fold rule:** if any ticket rewrites this paragraph first (for example one that closes `D4`), it carries
  this correction, and `ABC-148` is DROPPED as folded.
- **Shared file:** `src/cli.test.ts` is also edited by `ABC-143` (the `A10` literal) and `ABC-144` (the `A7`
  pin, its own `describe`). Disjoint regions; whichever lands second rebases.

## Security / NFR triggers

- **`N8-LANE`:** comment-only, so the count is the pin: 0 files, 0 tests, 0 spawns.
- **Security: not triggered.** A comment and a page.

## Test notes

- Plant each form inside an async IIFE at the `runTurnLoop(` call, as QE did, so only the binder differs.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`.
- UAT: 0 production lines, so the waiver is expected, measured at the exit.

## Size and priority

**`XS`.** One paragraph and one page note, five planted builds.

**`P3`.** One sentence, and it errs in the safe direction: it calls two closed forms open, so it undersells the
guard. Every assertion under it is sound, and no hop has acted on it. Contrast `ABC-114` (`P2`): four sentences
found by three QE hops, two of them overselling. **`P2` PROMOTION TRIGGER:** any hop plans or cuts work to close
`for…in` or `catch (history)`.

## Definition of Ready

BA/PM, 2026-10-11. **Result: 10 of 10.** Recommended placement: `Ready`.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** QE's five-form table; two forms called open are closed by `tsc` |
| 2 | scope and out-of-scope clear | **✅** one paragraph, one page note; `D4`'s close fenced off |
| 3 | INVEST-shaped | **✅** independent; a fold rule if another ticket gets there first |
| 4 | acceptance testable and measurable | **✅** `tsc` exit codes, per-form results, a comment-only diff predicate |
| 5 | dependencies known | **✅** none blocking; shared file named |
| 6 | security/NFR triggers with a measurable target | **✅** count pin 0 / 0 / 0 |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, with a `P2` trigger |
| 10 | no major unresolved blocker | **✅** |

Column moves are the Orchestrator's.

## Delivery

Software Engineer (Claude Opus 5.5, subagent of the Orchestrator), 2026-10-12. **This agent is the
author of both corrected passages (`A5`). It has not validated them.** The `In Review` verdict belongs
to a separate QE hop that re-plants all five forms itself. Branch `grugops/ABC-148-binder-comment`,
code commit `7acd8db2`, base `main` @ `3537fe48`. Readings: `.grugops/context/ticket-to-pr-ABC-148/notes/`.

- **`A1`, re-measured at this hop.** Each form was planted alone in `src/cli.ts`, inside an async IIFE
  at the `runTurnLoop(` call. The scaffold was the same for all five (`const spare = { ...history }`,
  the binder, then `throw new Error("unreachable")`), so only the binder differs. After each build,
  `git checkout -- src/cli.ts` ran and `git status --porcelain` was empty. Base file: 69 / 69.

  | form | `tsc --noEmit` | `npx vitest run src/cli.test.ts` |
  |---|---|---|
  | `for (const history of [spare])` (`D4`) | 0 | 69 / 69 passed: **open** |
  | `(history) =>` (`[spare].map(…)`) | 0 | 69 / 69 passed: **open** |
  | bare `history =>` | 0 | 1 failed / 68: `ABC-043` `A1`, the count row, `[ 'history =', 'history =' ]` |
  | `for (const history in { spare })` | **2** (TS2322, `string`) | 26 failed / 43: spawn rows, child exits 70; the count row is green |
  | `catch (history)` | **2** (TS2322, `unknown`) | 69 / 69 passed: closed by the typecheck **only** |

- **Against QE's table (`…94a87a28`).** The five `tsc` exits agree, and so does the bare-arrow red row.
  Where QE recorded only "closed by the typecheck", this hop also ran the file. `for…in` reds 26
  behavioural rows, because the child really receives the string `"spare"`. `catch (history)` passes
  every row, so the typecheck is its **only** guard. Neither result changes the open list. The file's
  totals are 69, not 67, because the file has grown since QE measured.
- **`A2`/`A3`.** The comment paragraph and the `ABC-113` note both name exactly `for…of` and a
  parenthesised `(history) =>` as open. They name `for…in` and `catch (history)` as closed by the
  typecheck and the bare `history =>` as counted. On the page, the struck four-form list is kept and
  a dated correction follows it. Line 64 is byte-identical to `main` (`cmp`).
- **`A4`.** `git diff --name-only main -- src/` lists `src/cli.test.ts` only. There are 0 non-`//`
  lines added or removed under `src/`. `it(` occurs 101 times and `expect(` 324 times, both at base
  and at the tip. `npm test` gives 56 files / 1741 tests / 0 pending / 0 todo, both at base (the
  base's `src/cli.test.ts` in place) and at the tip.
- **Gates at the tip.** `npm run -s lint` 0, `typecheck` 0, `build` 0, `npm test` 0, and
  `.test-results/last-run.json` reads `success: true`. Skip-integrity at skip count 0: `No findings.`
  This hop took no timing readings.

## QE

**2026-10-12, QE/E2E** (subtask `qe-ABC-148`; a separate dispatch from the author).
- Range: base `3537fe48`, code `7acd8db2`, reviewed tip `94ca6c7e`.
- Every reading is QE's own. QE wrote its own plant generator with a different callback host, and read
  the SE's note only afterwards. The detail is in `.grugops/context/qe-ABC-148/notes/`:
  - `…79919cce`, the verdict;
  - `…cb622f01`, the readings;
  - `…ceabe8d9`, the comparison and gaps;
  - `…119b9d8a`, the commands.

  It is not restated here.

**PASS_WITH_GAPS.**
- **`A1`–`A5` are MET.**
  - QE's five-form readings agree with the SE's and with `QE-114-c` on every `tsc` exit and every
    open / counted / closed call.
  - The comment and the page note say exactly what those readings show.
  - Line 64 is byte-unchanged.
  - The struck words are kept.
  - The `src/` fence holds: comment lines only, and the counts equal base.
  - The UAT waiver applies on QE's measurement.
- **`QE-148-a` MEDIUM (criterion scope, BA/PM).** Six more `[:=]`-free binders are `tsc`-clean and
  green on every row: array and object destructuring, renamed destructuring in a parameter and in a
  `for…of`, and a `function (history)` callback. The paragraph's "the open remainder … is the two"
  therefore understates the hole, which errs the unsafe way. `A2` is met as written because it binds
  the list to `A1`'s five forms. The Orchestrator decides: either a one-sentence repair on this branch
  before merge, or a follow-up. Any ticket that closes `D4` must take all eight open forms.
- **`QE-148-b` LOW.** The bare `history =>` is labelled `[:=]`-free in the paragraph that says it is
  counted.
- **`QE-148-c` INFO.** Two SE transcription points, neither verdict-changing.
- **`QE-148-d` INFO.** Host-protection exited 2 (`UNKNOWN - verify`).

QE made no board move, did not merge and did not push.
