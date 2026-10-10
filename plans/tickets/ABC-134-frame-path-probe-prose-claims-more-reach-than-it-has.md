---
id: ABC-134
title: The frame-path probe's prose claims more reach than the probe has — four wording gaps in one file, comment-only
status: in-development
column: In Development
size: XS
priority: P3
epic: —
feature: —
---

# ABC-134 — say what the frame-path probe and the composer tripwire do NOT see, and stop counting what is not counted

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-owed-batch-2026-10-10`) at
> wave tip `35ad336b`. The source is QE's gap registers: `QE-053-b`, `-c` and `-d`
> (`.grugops/context/qe-ABC-053/notes/…a4b293d2`) and `QE-057-b`
> (`.grugops/context/qe-ABC-057/notes/…a331f012`). All four are LOW and none fails a criterion. They
> were routed to "the next hop on this file". `ABC-054` and `ABC-057` were those hops, and both merged
> without them. **This is a ticket, not a page repair, because the wrong sentences are in `src/`**,
> and BA/PM does not edit `src/`. Reasoning: `.grugops/context/bapm-owed-batch-2026-10-10/notes/`.

## Problem

*User*: the next hop that opens `src/history-pane.nfr.test.ts` to decide whether a change is covered
by the frame-path probe (`ADR-0029`) or by the composer tripwire. That is how `NFR-002`'s premise is
defended, and the reader trusts the docblock's "WHAT NEITHER PHASE COVERS" list to be complete.

*Pain*: four sentences claim more than the instrument does. Each was measured by QE and **re-measured
here at `35ad336b`**:

| gap | site (at `35ad336b`) | says | measured |
|---|---|---|---|
| `QE-053-b` | `:196` | the per-frame phase misses "a lazy load CONDITIONAL on a **game** state the frames do not reach" | the frames hold **four more** things fixed: `makeRenderSeam("ascii", "white-bottom")` and `seam(history, status, false, [])` (`:680`, `:682`). A load conditional on `unicode`, black-bottom, `thinking = true` or a non-empty message region is GREEN (QE `Q-UNICODE-ONLY` … `Q-MESSAGES-ONLY`) |
| `QE-053-c` | `:198-199` | a derive rebuilt from other modules is seen "only [by] `ABC-041` `A2`'s synchronous spies" | true only for a rebuild that calls `gameStatus`. A rebuild **by replay** (`parseFen` + `makeMove` + `zobristKey`) is seen by **nothing** (QE `Q-REDERIVE-REPLAY` GREEN 23/23) |
| `QE-053-d` | `:659-661` | the settle "is not load-bearing on Node v26.11.0" | false for an import issued from a macrotask: one `setImmediate` deep is RED with the settle and GREEN without it. The settle is **3** turns (`:683`, `turn < 3`). It reaches a chain ≤ 3 deep, not 4, and never a timer |
| `QE-057-b` | `:186-190` (docblock) and `:541-544` (in-test comment) | "**two** static value imports are NOT counted": a comment ahead of the name, and a default binding | at least **four** are uncounted. A string-named specifier `{ "assembleFrame" as compose }` and a comment containing `;` inside the brace after the name are both uncounted too: the tripwire's `[^;]*?` stops and the statement is never read. Re-run here on the tripwire's own expression: all four uncounted, value brace and namespace counted |

`ADR-0029`'s 2026-10-10 pointer under decision 2 (Architect/Design, merged `9525b9bb`) already
lists the same four spellings, so the docblock and the ADR now disagree on the count. The new
prose may point there.

*Value*: the next reader is not told a gap is covered when it is not. In each case the instrument is
correct and its narration is wrong. Every sentence fixed here is one a later hop would otherwise take
as a guarantee.

## Scope

Rewrite **four sentences** in `src/history-pane.nfr.test.ts`, comments only:
- **`QE-053-b`**: the "CONDITIONAL" bullet names every dimension the frames hold fixed: game state,
  glyph mode, orientation, `thinking`, and the message region.
- **`QE-053-c`**: the rebuild bullet says that `A2`'s spies see a rebuild that calls `gameStatus`, and
  that a rebuild by replay is seen by nothing.
- **`QE-053-d`**: the settle comment states what the settle reaches (the turn count) and what it does
  not: a deeper macrotask chain, or a timer.
- **`QE-057-b`**: the composer paragraph and the in-test comment stop giving a closed count. Both name
  the four measured spellings and say the list is not exhaustive.

The wording is the Engineer's. Every other sentence is kept.

## Out of scope

- **Any executable line, and the probe's template string.** No new state is drawn and no turn is added
  to the settle. Covering a glyph/orientation matrix is Architect/Design's call (`QE-053-b`'s second
  option), not this ticket's.
- **Re-pointing the composer tripwire at `bindsAValueFrom`.** That would close `QE-057-b`, but it is
  out by name: `ADR-0029` names the site, and it is Architect/Design's.
- **`QE-053-e`/`-f`/`-g` (INFO, owner "none")** and **`QE-057-a`/`-c`** (routed to Architect/Design,
  subtask `design-owed-rulings-2026-10-10`). *(2026-10-10: `QE-057-a` is now `ABC-136`; `-c` is
  ruled with no follow-up.)*
- **`ABC-030`'s line** in this file (`:115`, a sibling-count cite) and every other file.

## Acceptance (Given/When/Then)

"Collapsed text" means: the file with each line's leading ` * ` / `// ` removed and every whitespace
run collapsed to one space. The instrument and base readings are under
`.grugops/context/bapm-owed-batch-2026-10-10/probe/` (`phrases.mjs`). Each phrase below occurs
**exactly once** in collapsed text at `35ad336b`.

- **`A1` (`QE-053-b`).** **Then** collapsed text contains "CONDITIONAL on a game state the frames do
  not reach" **0** times. **And** the "WHAT NEITHER PHASE COVERS" bullet about a conditional lazy load
  contains each of `unicode`, `black-bottom`, `thinking` and `message`.
- **`A2` (`QE-053-c`).** **Then** "only `ABC-041` `A2`'s synchronous spies see that" occurs **0**
  times. **And** the rebuild bullet contains `gameStatus` and `replay`, and states that a rebuild by
  replay is seen by no instrument.
- **`A3` (`QE-053-d`).** **Then** "so it is not load-bearing on Node v26.11.0" occurs **0** times.
  **And** the settle comment states a turn count equal to the probe's `turn < N` literal (**3** at
  the base), and names a timer and a deeper `setImmediate` chain as unseen.
- **`A4` (`QE-057-b`).** **Then** "so two static value imports are NOT counted" and "A comment ahead
  of the name inside the brace, and a default binding, are value imports it does not count" each
  occur **0** times. **And** the composer docblock paragraph and the in-test comment each name the
  string-named specifier and the comment containing `;`, and each says the list is not exhaustive
  ("at least" or equivalent).
- **`A5` (comment-only, one path).** `git diff --name-only <base>..<delivered>` lists exactly
  `src/history-pane.nfr.test.ts` under `src/`. **And** this prints nothing:
  `git diff -U0 <base>..<delivered> -- src | grep -E '^[+-][^+-]' | grep -vE '^[+-][[:space:]]*(\*|/\*\*|\*/|//)'`.
  The test count equals the base's. Lint, typecheck, build and `npm test` exit 0, the skip count is
  0, and integrity prints `No findings.`

## Dependencies

- **None open.** `ABC-053`, `ABC-054` and `ABC-057` are `Done`, and every site above is measured at
  `35ad336b`. **Pullable now.**
- **`ABC-030` (Backlog)** edits `:115` of this file. Merge-order only; the second one rebases.
- **No unmerged branch touches this file** (checked at `35ad336b` over every `grugops/*` branch).
- **`ABC-135` touches `src/render-seam.test.ts` only.** Disjoint, so it can run in parallel.
- **`ABC-136` (`ADR-0011` `R5b`, cut 2026-10-10 at `bapm-followups-2026-10-10`) touches this same
  file. SEQUENCE, do not fold: `ABC-136` first, then this ticket. Never in parallel.**
  - **Why not fold.** This ticket's `A5` is a comment-only filter. `ABC-136` adds executable pins
    and is proven by a mutant ledger.
  - **Why `ABC-136` first.** `R5`'s trigger is "the next hop that opens the file". If this ticket
    is already pulled when `ABC-136` reaches `Ready`, this one finishes first. The order serves the
    file; it is not a blocker.

## Security / NFR triggers

- **`N8-LANE` — ≤ 650 ms CPU net.** No file and no executable line, so ≈ 0 ms.
- **`NFR-002` — not triggered.** No instrument changes (`A5`). This ticket only narrates the reach
  `NFR-002`'s guard already has.
- **Security — not triggered.** No executable line, no spawn, no manifest.
- **UAT: WAIVED by the standing 2026-08-17 rule** (`.test.ts` only, so 0 production lines). The QE
  hop applies.

## Test notes

1. **Three readers take this file RAW, comments included. Do not quote their targets in new prose.**
   - `src/render-seam.test.ts` `A9` (`:357`) and `src/cli.test.ts` `A12` (`:1692`) read the FIRST
     `const LICENSED_DRIVERS: readonly string[] = [ … ]` and `^const COMPOSITION_ROOT = …$`. A comment
     spelling either declaration ahead of the real one hijacks the match.
   - The licence pin (`:478-488`) uses `toContain` on this file's own text. A comment that quotes the
     guard's `expect(runtimeImporters)…` line, or the witnessed expression, would keep it green after
     the code changed (`QE-057-f`).
   - *(2026-10-10)* Once `ABC-136` lands, the guard's `const production = …` line and its
     `runtimeImporters` statement are pinned the same way. Do not quote either one in new prose.
2. **The composer tripwire's expression and the licence guard's lines stay byte-identical.** Keep
   new words out of the tripwire span except in its `//` comment.
3. **Spell the `QE-057-b` examples in backticks inside a comment.** The tripwire reads production
   modules only, so a ` * import { "assembleFrame" as compose } …` line here is inert. Run the suite
   anyway.

## Size and priority rationale

**Size `XS` (1).** Four comment sentences in one file, checked by five greps and a comment-only
filter. **Not `XL`. No split.** The four are one ticket because they are one file and one docblock.
Four tickets would be four QE hops that conflict on adjacent lines.

**Priority `P3`.** QE graded each LOW, nothing is red, and no user sees it. It is worth cutting
because the list it corrects is the one a future hop reads to decide whether its change is covered.

## Definition of Ready

Assessed by BA/PM at the cutting hop, **2026-10-10**, wave tip `35ad336b`. **Result: 10 of 10, 0 ⚠️
— MET → `Ready`.** The board move is the Orchestrator's.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** four sentences, each quoted at a line, each with QE's measurement re-run or re-read at the tip |
| 2 | scope and out-of-scope clear | **✅** four sentences; fences on executable lines, the tripwire re-point, a state matrix, the Architect's two gaps and `ABC-030` |
| 3 | INVEST-shaped | **✅** independent (no open predecessor), small, testable; `ABC-030` is merge-order only |
| 4 | acceptance testable and measurable | **✅** five phrases that must read 0 (each 1 at the base), named words present, a turn count tied to a code literal, and a one-path comment-only filter |
| 5 | dependencies known | **✅** none open; `ABC-030` and `ABC-135` named |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≈ 0; `NFR-002` not triggered (`A5`); security not triggered; UAT waived by rule |
| 7 | test notes present | **✅** three (three raw readers, byte-identical spans, inert examples) |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P3`, with the reason |
| 10 | no major unresolved blocker | **✅** none |

*2026-10-10, BA/PM (`bapm-followups-2026-10-10`, `71418879`):* **DoR stays 10/10.** Items 5 and 10
stay ✅: `ABC-136` is a merge-order predecessor on the same file with no open design question, so it
sets a pull order, not a dependency on a decision (`ABC-083`/`ABC-131` precedent). Test note 1 gains
one line. No criterion, size, priority or column moved.

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-134`).
- Branch `grugops/ABC-134-frame-probe-prose`, from `7f7e6b84`. The code is `a42b59e3`
  (`src/history-pane.nfr.test.ts` +26/−13, comment lines only).
- Not merged, not pushed.
- Decisions, readings and raw files are in `.grugops/context/ticket-to-pr-ABC-134/` (`…1f2b70bf`,
  `…d5b9d74c`, `probe/`) and are not restated here.

**`A1`–`A5` are met.**
- The premise held at `7f7e6b84`: all five phrases counted 1, and only the in-test sites had moved
  (because of `ABC-136`).
- `ABC-136`'s four pinned literals and six of `ABC-057`'s seven spans are byte-identical.
- **One fence reading to note:** the `probe-it` span contains the settle comment (`A3`'s site), so its
  raw hash moves. With its `//` lines dropped it is identical.

## QE 2026-10-10 (QE/E2E, `qe-ABC-134`, Workflow 04 review exit): PASS_WITH_GAPS

Reviewed `7f7e6b84..4d6b019a` (code `a42b59e3`). Each new sentence was judged against the code it describes by
planting what it names, in an out-of-worktree `git archive` tree. Decision `…5ec48998`, readings `…048ac24a`, gaps
`…5761436a`, raw files in `.grugops/context/qe-ABC-134/probe/`.

**`A1`–`A5` are MET at `4cac6911`. No test was added. QE made one comment-only fix inside `A3`'s site.**

- **`A1`**: the phrase goes 1 → 0 and the four words are present. The five dimensions named are the seam's whole input.
  Loads conditional on `unicode`, `black-bottom`, `thinking`, a message, more than 40 plies or an ended game are GREEN 3/3,
  and the `ascii` / `white-bottom` controls are RED.
- **`A2`**: the phrase goes 1 → 0. A `gameStatus` rebuild reds `ABC-041` `A2`. A replay rebuild that rides the pane's
  walk, or sits in the seam, is GREEN on the full lane (1608/1608). Other placements are caught only incidentally
  (`QE-134-b`, INFO).
- **`A3`**: the phrase goes 1 → 0, and "3 turns" equals `turn < 3`. A `setImmediate` chain 3 deep is RED 10/10 and
  4 deep is GREEN 10/10.
  - **"a timer of any delay, is NOT seen" was false**: 0 and 1 ms timers are RED 10/10, 5 ms 1/10, 50 ms 0/10.
  - **Fixed in `4cac6911`, comment only (`QE-134-a`, LOW).** The comment now says a timer is NOT reliably seen and
    is a race with the clock. The criterion's premise ("never a timer", from `QE-053-d`) was wrong for short timers.
- **`A4`**: both phrases go 1 → 0, and both sites name the two spellings, "AT LEAST" and "not exhaustive". The four
  named spellings are uncounted and lint-clean. Five more are also uncounted, so the list is truly not exhaustive
  (`QE-134-c`, INFO). The count agrees with `ADR-0029`'s pointer.
- **`A5`**: `7f7e6b84..4cac6911` touches one `src/` path (+28/−13) and the filter prints nothing.
  - The comment-free AST is identical at base and at both tips. 1608 tests, equal to base.
  - `ABC-136`'s four pins count 1. Six of `ABC-057`'s spans are identical; `probe-it` is identical with its `//` lines
    dropped.
- **Gates** at `4d6b019a` and `4cac6911`: lint, typecheck and build exit 0; `npm test` 52 files / 1608 passed; skip
  count 0; integrity `No findings.`; `lane-inventory.js` no findings.
- **Next.** The board move is the Orchestrator's. UAT is WAIVED by rule (0 production lines, measured). A second reader on
  `QE-134-a`'s sentence is optional (`QE-134-d`). Not merged, not pushed.
