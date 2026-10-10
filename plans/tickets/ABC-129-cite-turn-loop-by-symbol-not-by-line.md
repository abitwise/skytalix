---
id: ABC-129
title: Fourteen of fifteen `turn-loop.ts:<line>` cites point at the wrong lines — cite by symbol, and fix the "seven tokens" comment
status: in-review
column: In Review
size: XS
priority: P3
epic: —
feature: —
---

# ABC-129 — replace every line-number cite into `src/turn-loop.ts` with the symbol it means

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `cut-followups-2026-10-10`) from
> QE's `ABC-051` gap **QE-051-c** (`…e9262a1c`) and the Engineer's flag (`…0db3513e`), both under
> `.grugops/context/{qe-ABC-051,ticket-to-pr-ABC-051-r2}/notes/` on `grugops/ABC-051-r2` until it
> merges. **QE `ABC-036` G1 is folded in as `A3`** (`.grugops/context/qe-ABC-036/notes/…8c334653`,
> on `grugops/ABC-036-moves-command`). Pre-existing. No ticket made a correct cite wrong. Routing
> note: `.grugops/context/cut-followups-2026-10-10/notes/`.
>
> **ORDERED AFTER `ABC-036` AND `ABC-051` MERGE.** `ABC-036` edits `src/command-input.ts` and
> `src/command-input.test.ts`, which carry 4 of the cites. `ABC-051` edits `src/turn-loop.ts`,
> the file every cite points into.
>
> **Re-scored 2026-10-10 by BA/PM** (subtask `bapm-owed-batch-2026-10-10`) at wave tip `35ad336b`:
> **DoR 10/10.** Both merged, so item 3 is discharged. The table was re-measured and holds. See
> `## Re-score — 2026-10-10`.

## Problem

*User*: anyone who follows a comment's cite into `src/turn-loop.ts`, which is how this codebase
narrates its reasoning.

*Pain*: other `src/` files cite `src/turn-loop.ts` by line 15 times. **14 point at the wrong
lines.** BA/PM measured this at `85d0139` with
`git grep -nE 'turn-loop\.ts:[0-9]' -- src`, and the same 15 hits appear on the `ABC-036`,
`ABC-051` and `ABC-127` tips. QE counted 14 cites (13 stale) and excluded `src/turn-loop.test.ts`.
The 15th is `src/turn-loop.test.ts:1633`, and it is stale too. Only `src/line-input.ts:5`
(`:135`, `PromptOutcome`) is right, and it moves on the next insertion above `:135`. A line cite
rots on any edit to the cited file, so re-numbering would only reset the clock.

Separately, `src/command-input.ts:91` (at `ABC-036`'s tip `06b03dc`) says *"the seven tokens do
NOT share one arm. Three are `command`"*. `COMMAND_TABLE` has **eight** tokens, and **four** are
`command` (`help`, `board`, `quit`, `moves`). This is QE `ABC-036` G1, the same defect class: a
comment that the code moved under.

*Value*: each cite lands on what it names, and it keeps landing there when `src/turn-loop.ts`
changes.

## Scope

Replace each cite with the symbol or labelled anchor it means. Line numbers below are at
`ABC-051`'s tip `a9ed126`. The anchor is the contract and the line number is not.

| # | site | cites | means | anchor |
|---|---|---|---|---|
| 1 | `src/cli.test.ts:588` | `:191` | `wasGenerated` (`:212`) | `wasGenerated` |
| 2 | `src/cli.test.ts:744` | `:191-200` | `wasGenerated` | `wasGenerated` |
| 3 | `src/cli.ts:30` | `:293-309` | the `A9b` repair arm (`:329`) | `runTurnLoop`'s `` `A9b` `` arm |
| 4 | `src/cli.ts:181` | `:312` | `INPUT_ENDED_NOTICE` (`:189`) | `INPUT_ENDED_NOTICE` |
| 5 | `src/command-input.test.ts:412` | `:246` | render-cadence paragraph (`:279`) | `runTurnLoop`'s docblock, "The render cadence" |
| 6 | `src/command-input.test.ts:540` | `:269` | "Transition 1 → 2" (`:303`) | `runTurnLoop`'s "Transition 1 → 2" |
| 7 | `src/command-input.ts:58` | `:319-341` | transition 16's branch (`:361`) | `runTurnLoop`'s "TRANSITION 16" branch |
| 8 | `src/command-input.ts:59` | `:234` | `claimShortfall` (`:255`) | `claimShortfall` |
| 9 | `src/engine.ts:507` | `:138` | `EngineSeam` (`:150`) | `EngineSeam` |
| 10 | `src/line-input.ts:5` | `:135` | `PromptOutcome` (`:135`, right today) | `PromptOutcome` |
| 11 | `src/line-input.ts:21` | `:291-309` | the `A9b` repair arm | as #3 |
| 12 | `src/line-input.ts:49` | `:176` | `INPUT_ENDED_NOTICE` | `INPUT_ENDED_NOTICE` |
| 13 | `src/move-input.ts:7` | `:125` | `PromptOutcome` | `PromptOutcome` |
| 14 | `src/result-screen.ts:12` | `:312` | `INPUT_ENDED_NOTICE` | `INPUT_ENDED_NOTICE` |
| 15 | `src/turn-loop.test.ts:1633` | `:114-116` | `PromptOutcome`'s `game-over` paragraph (`:124`) | `PromptOutcome`'s docblock, "OWNS ONLY THAT THE TRANSITION EXISTS" |

On `ABC-036`'s tip, #7/#8 sit at `:59`/`:60` and #6 at `:533`. Re-read the table at the
`Ready for Dev` exit (process rule 1).

- **`A3`'s comment:** in `CommandSpec`'s docblock, make the token count and the `command`-arm count
  match `COMMAND_TABLE`.

## Out of scope

- **Line cites into any other file.** At `85d0139`, 97 lines under `src/` carry a `<file>.ts:<n>`
  cite, and 15 of them are this ticket's. The cited files include `frame.ts` (17), `history.ts`
  (11), `san.ts` (8) and `gameend.ts` (8). How many of the other 82 are stale is
  `UNKNOWN - verify`. They were not measured and are not homed here.
- **A guard against new line cites** (a lint rule or a grep row). It is negotiable, and it is left
  out. One 15-cite cleanup does not yet show that the pattern returns faster than a re-run of
  `A1`'s grep would find it.
- **Any wording change beyond the cite token,** apart from `A3`'s count. Re-wrapping a comment line
  to keep its width is allowed.
- **`src/turn-loop.ts` itself.** It holds no line cite to itself.

## Acceptance (Given/When/Then)

- **`A1` (no line cite into the loop).** **Given** the tip, **when**
  `git grep -nE 'turn-loop\.ts:[0-9]' -- src` runs, **then** it prints **0 lines**. It printed 15 on
  the base. The PR note shows both.
- **`A2` (every anchor resolves).** **Then** for each of the 15 sites, the PR note lists the anchor
  written and `grep -cF '<anchor>' src/turn-loop.ts` at the tip. Each count is **≥ 1**. A quoted
  phrase (#5, #6, #7, #15) must match **exactly 1** line. The anchor names what the table's "means"
  column names.
- **`A3` (G1).** **Then** `grep -c 'the seven tokens' src/command-input.ts` prints **0**. The
  `CommandSpec` docblock's token count equals `COMMAND_TABLE.length`, and its `command` count equals
  the number of rows with `outcome: "command"`: **8 and 4** at `06b03dc`, and read again on the base.
  *If `ABC-036` merges with this already fixed, `A3` is met at the `Ready for Dev` re-read and is
  struck, not redone.*
- **`A4` (comments only).** **Then** `git diff --numstat <base>...<tip> -- src` lists only files
  from the 15 sites (at most 9 files). Over those files the non-comment pipeline is **empty**:

  ```
  git diff -U0 <base> -- src | grep -E '^[+-][^+-]' \
    | grep -vE '^[+-][[:space:]]*(\*|/\*\*|\*/|//)'   -> empty
  ```

  The test-file count and the suite total equal the base's. Lint, typecheck, build and `npm test`
  exit 0, the skip count is 0, and integrity prints `No findings.`

## Dependencies

- **⚠️ `ABC-036` must merge first.** It is in Ready for UAT, and the owner's acceptance is owed.
  It edits `src/command-input.ts` and its test (sites #5–#8, and `A3`'s line).
  *(2026-10-10: **merged** `4a745a77`, owner word. Discharged.)*
- **⚠️ `ABC-051` must merge first.** It is in Ready for UAT, and the owner's acceptance is owed. It
  re-numbers `src/turn-loop.ts` after `:271`, and `A2` resolves anchors in that file.
  *(2026-10-10: **merged** `a154d306`, owner word. Discharged.)*
- **`ABC-128`** edits `src/turn-loop.test.ts` (other lines). Prefer it first. The second one rebases.
  *(2026-10-10: **merged** `34d9ea70`. Discharged.)*
- **`ABC-132` (Ready) — PAIRED, NEVER IN PARALLEL.** It edits `src/result-screen.ts:13-15` and
  `src/cli.ts:7-8`, adjacent to sites #14, #3 and #4. Either order works, and the second one rebases.
  *(Added 2026-10-10.)*
- **`ABC-059` merged** (`4c33b72b`) and added 76 lines to `src/cli.test.ts` at `:2138`. Sites #1/#2
  did not move (`:588`, `:747`, re-read at `9128e7a3`). **`ABC-133` is now `In Development`** on the
  same file. Do not build `ABC-129` while `ABC-133` is open on `src/cli.test.ts`; whichever lands
  second rebases. *(Added 2026-10-10.)*
- **`ABC-126`, `ABC-127`: no overlap.** They touch puzzle files and `src/quiescence.test.ts`.
- **Merge-order only, all in `Backlog`, comment lines:** ~~`ABC-038` (`src/line-input.ts`, one
  attach line)~~ *(dropped 2026-10-10 on the owner's word; no longer a merge-order neighbour)*,
  `ABC-114` (`src/cli.test.ts`), `ABC-087`/`ABC-119` (`src/engine.ts`, `src/cli.ts`).
  Whichever lands second rebases.

## Security / NFR triggers

- **`N8-LANE` — ≤ 650 ms CPU net.** Comments only, no new file. 0 ms.
- **`NFR-002` and the other runtime NFRs — not triggered.** `A4` proves zero non-comment lines.
- **UAT is OWED under the literal standing rule.** `git diff --name-only … | grep -v '\.test\.ts$'
  | grep '^src/'` prints up to 6 production files (comment lines only). This is QE-051-d's question.
  Whether a comment-only diff counts as "zero production lines" is the **owner's word** (pending on
  `ABC-051`). If he rules yes, the waiver applies here too. This does not block `Ready`.
- **Security — not triggered.** No executable line.

## Test notes

1. **Run `A1`'s grep first, on the base, and paste the 15 lines.** If the count is not 15, the base
   moved. Re-read the table, do not guess.
2. **Name the symbol, not a new line.** `(`src/turn-loop.ts` `INPUT_ENDED_NOTICE`)` is the shape.
   Do not cite `turn-loop.ts:189`.
3. **#3/#11 and #7.** The arms are comments inside `runTurnLoop` and are not exported symbols. Cite
   the label the comment carries (`` `A9b` ``, `TRANSITION 16`) with `runTurnLoop`, so that
   `grep -F` finds it.
4. **`src/cli.ts` is read RAW, comments included** (added 2026-10-10). `src/cli.test.ts`
   "bar 1" (`:1703`) bars `eval`, `Function(`, `child_process`, `import(`, `fetch`, `WebSocket` and
   `XMLHttpRequest` anywhere in `cli.ts`, so a new word in sites #3/#4 can red it ("evaluated"
   contains `eval`). The anchors in the table contain none of these. Run the whole suite.

## Size and priority rationale

**Size `XS` (1).** 15 one-token comment edits that are already mapped, plus one count, in at most
9 files. No logic. **Not `XL`. No split.**

**Priority `P3`.** QE graded it LOW. No behaviour changes. It fixes misdirection for readers. The
UAT question (above) costs a turn of the owner's attention, which is one more reason not to rush it.

## Definition of Ready

Assessed by BA/PM, **2026-10-10**, against the wave tip `85d0139` and the tips of `ABC-036`
(`06b03dc`) and `ABC-051` (`a9ed126`). **Result: 9 of 10, 1 ⚠️. NOT met. Stays `Backlog`.** The ⚠️
is an ordering hold with a named release: when `ABC-036` and `ABC-051` have both merged, item 3
becomes ✅ by that fact, and the page meets the bar after the table is re-read.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 15 cites, 14 stale, each mapped. One stale count, measured |
| 2 | scope and out-of-scope clear | **✅** turn-loop cites and one comment. The other 97 cites, a guard and wording are fenced out |
| 3 | INVEST-shaped | **⚠️** small and testable, but **not independent until `ABC-036` and `ABC-051` merge** (Orchestrator, after the owner's acceptance of both) |
| 4 | acceptance testable and measurable | **✅** a grep of 0, anchor counts ≥ 1 or = 1, `grep -c` 0 plus 8/4, an empty non-comment pipeline |
| 5 | dependencies known | **✅** `ABC-036`, `ABC-051` (first), `ABC-128` (same file), Backlog overlaps named |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` 0 ms; runtime NFRs not triggered and proven by `A4`; the UAT path is stated |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P3`, with the reason |
| 10 | no major unresolved blocker | **✅** the owner's comment-only ruling decides whether UAT is waived, and it does not block the build |

## Re-score — 2026-10-10

BA/PM, subtask `bapm-owed-batch-2026-10-10`, at wave tip `35ad336b`, re-read at `9128e7a3`
(after `ABC-059` merged; all 15 sites unmoved). **Result: 10 of 10, 0 ⚠️ — MET.** The cut table above is history and is left standing.

**This hop does not change the page's `status`/`column`.** Its fence forbids column changes on
existing tickets. `Backlog → Ready` is the Orchestrator's to make with the board row.

**Re-measured, not inherited:**
- `A1`'s grep prints **15** lines, the same 15 sites. `src/turn-loop.ts` last changed at `54513238`
  (`ABC-051`).
- **Every anchor resolves on the line the "means" column names**: `wasGenerated` `:212`,
  `INPUT_ENDED_NOTICE` `:189`, `claimShortfall` `:255`, `EngineSeam` `:150`, `PromptOutcome`
  `:135`, `` `A9b` `` `:329`.
- The four quoted phrases each match exactly 1 line: "TRANSITION 16" `:361`, "The render cadence"
  `:279`, "Transition 1 → 2" `:303`, "OWNS ONLY THAT THE TRANSITION EXISTS" `:125`.
- **Two site lines moved, and the anchors did not:** #2 is now `src/cli.test.ts:747` (was `:744`), and
  #6 is `src/command-input.test.ts:533`. #7/#8 are at `src/command-input.ts:59`/`:60`. The test
  note 1 instruction stands: re-read the table at the `Ready for Dev` exit.
- **`A3` is NOT met by `ABC-036`'s merge.** `src/command-input.ts:91` still says "the seven tokens …
  Three are `command`". `COMMAND_TABLE` has **8** rows, and **4** have `outcome: "command"`.
  `A3` stands as written.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** unchanged; 15 cites re-measured, `A3`'s comment re-read |
| 2 | scope and out-of-scope clear | **✅** unchanged |
| 3 | INVEST-shaped | **✅** independent now: `ABC-036` and `ABC-051` merged. `ABC-132` is a pairing and `ABC-133` (in development, `src/cli.test.ts`) an ordering. Neither is built in parallel with this one |
| 4 | acceptance testable and measurable | **✅** unchanged; every anchor resolves today |
| 5 | dependencies known | **✅** the three predecessors are discharged with their SHAs; `ABC-132` and `ABC-133` are added, and `ABC-059` is merged |
| 6 | security/NFR triggers with a measurable target | **✅** unchanged |
| 7 | test notes present | **✅** four (note 4 added: `cli.ts` bar 1 reads comments) |
| 8 | size assigned | **✅** `XS` (1), kept |
| 9 | priority assigned | **✅** `P3`, kept |
| 10 | no major unresolved blocker | **✅** the owner's comment-only ruling decides the exit, not the start |

**Which way the owner's open ruling moves this ticket.** The question is whether a comment-only
production diff counts as "zero production lines" (`QE-051-d`).
- **It moves the EXIT only.** In both cases DoR stays 10/10, size `XS`, priority `P3`, and the QE hop
  applies.
- **If he rules YES:** after QE, `Ready for UAT → Done`, UAT WAIVED. This holds only if the ruling
  names a measurement. The 2026-08-17 git test lists **6 production files** for this diff and cannot
  tell a comment from code. `A4`'s pipeline is one candidate measurement. The stripped-compile
  identity `ABC-104` used is the stronger one.
- **If he rules NO (or has not ruled):** `Ready for UAT` waits for his word. One word can cover this
  ticket and `ABC-132`, which owes the same.

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-129`).
- Branch `grugops/ABC-129-turn-loop-cites-by-symbol`, from `dc90f42d`. The code is `ed402c1e`.
- Not merged, not pushed.
- The decision and readings are in `.grugops/context/ticket-to-pr-ABC-129/notes/` (`…0ec65506`
  decision, `…7c970961` readings) and are not restated here.

**The premise held at `dc90f42d`.** `A1`'s grep printed 15 lines. #1 and #2 had moved to
`src/cli.test.ts:590`/`:749` (`ABC-133`), and every anchor resolved. `A3`'s line still said "the seven
tokens … Three are `command`" against 8 rows and 4 `command`. **No stop condition fired.**

| # | verdict | reading |
|---|---|---|
| `A1` | MET | `git grep -nE 'turn-loop\.ts:[0-9]' -- src`: 15 on base, **0** at `ed402c1e` |
| `A2` | MET, ONE DEVIATION | `grep -cF` in `src/turn-loop.ts`: `wasGenerated` 3, `INPUT_ENDED_NOTICE` 3, `claimShortfall` 2, `EngineSeam` 2, `PromptOutcome` 3, `` `A9b` `` 2, and the quoted phrases "TRANSITION 16", "The render cadence", "Transition 1 → 2" and "OWNS ONLY THAT THE TRANSITION EXISTS" 1 each. **#10 names `InputSeam` (3), not the table's `PromptOutcome`.** At the commit that wrote the cite (`69bb1e38`), `:135` was `InputSeam`, and the sentence quotes `InputSeam`'s own comment. Decision note `…0ec65506` §3 holds the evidence. QE/BA/PM rule on it |
| `A3` | MET | `grep -c 'the seven tokens' src/command-input.ts` = 0. The docblock says "eight … Four are `command`", and importing the module gives `COMMAND_TABLE.length` 8 and 4 `command` rows |
| `A4` | MET | numstat lists 9 files, all of them site files. The non-comment pipeline is **empty**. Base and tip both run 52 files / 1608 passed. lint, typecheck and build exit 0; skips 0; integrity `No findings.` |

**Exit (owner Q4 ruling, `…5c8e2a17`): both measurements hold for all 6 production files.**
- Every changed line is a comment line.
- `transpileModule` with `removeComments: true` emits byte-identical output at `dc90f42d` and
  `ed402c1e` for `src/cli.ts`, `command-input.ts`, `engine.ts`, `line-input.ts`, `move-input.ts` and
  `result-screen.ts`. The three test files are identical too.
- **On that ruling, UAT is WAIVED** (waived is not accepted). The waiver is applied at `Done` by the
  Orchestrator and is not self-applied here.

## QE 2026-10-10 (QE/E2E, `qe-ABC-129`, Workflow 04 review exit): PASS_WITH_GAPS

Reviewed `dc90f42d..0ee6424e`, with code at `ed402c1e`. Every reading is QE's own, taken in QE's
worktree. The SE's notes served only as pointers. **`A1`–`A4` are MET. QE added no test and made
no comment fix, because no cite was wrong.** Readings are in
`.grugops/context/qe-ABC-129/notes/` (`…20af9428` decision, `…1d84da40` readings, `…83afd95b` gaps)
and are not restated here.

- **`A1`**: 15 at base, **0** at the tip. Other line-cite shapes also read 0.
- **`A2`**: every anchor is ≥ 1, and each quoted phrase is exactly 1. Each cite was traced to the
  commit that wrote it, and each anchor carries its sentence's claim.
- **`A3`**: `grep -c` reads 0. The docblock says "eight … Four". The imported `COMMAND_TABLE` has 8
  rows, 4 of them `command`.
- **`A4`**: 9 site files. The non-comment pipeline is empty. Base and tip both run 52 files / 1608.
  The added `cli.ts` words contain 0 barred tokens.
- **Gates**: lint, typecheck and build exit 0. `npm test` runs 52 / 1608 with skip 0. Integrity reads
  `No findings.` and `lane-inventory.js` reports no findings. `CLI_DEEP` passes 7, and `PUZZLE_DEEP`
  passes 17 at 58/62 (= baseline).

**Site #10: ACCEPTED as `InputSeam`. This is a table erratum.** At `69bb1e38`, which wrote the cite,
`:135` was `export type InputSeam`. The sentence also quotes `InputSeam`'s own comment ("`EPIC-003`
replaces it", `src/turn-loop.ts:146`). The table's "`PromptOutcome` (`:135`, right today)" was a
drift coincidence, so all 15 cites were stale, not 14. Read row #10's "means" column as
`InputSeam`.

**Exit (owner Q4): the measurement HOLDS on all 6 production files.** Every changed line is a
comment, by the regex and by the TS AST. The `transpileModule` `removeComments` emit is
byte-identical at base and tip, and so is the comment-stripped TS print. The negative controls go
red. UAT is therefore WAIVED (waived is not accepted), applied by the Orchestrator at `Done`.

**Gaps (none blocks):**
- **`QE-129-a` LOW**: #5's quoted formula `1 + one per non-advancing outcome` is the
  count-every-outcome form that its anchor paragraph disowns. This is pre-existing wording and is
  fenced out here. BA/PM may cut a one-line follow-up.
- **`QE-129-b` INFO**: each Q4 measure has a blind spot. The emit identity misses type-only edits,
  and the regex misses a `//` line inside a template literal. Keep the conjunction.
- **`QE-129-c` INFO**: `plans/traceability.md` has an append conflict with the wave tip. Keep both
  sides.
- **`QE-129-d` INFO**: `` `A9b` `` hits 2 lines, and #6's anchor carries half of its sentence. Both
  are unchanged from the original reach.
- **`QE-129-e` INFO**: AGENTS.md's `ENGINE_DEEP` count is stale (45 recorded, 46 collected). This
  ticket did not cause it.
