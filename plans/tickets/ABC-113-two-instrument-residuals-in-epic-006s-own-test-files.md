---
id: ABC-113
title: Two instrument residuals in `EPIC-006`'s own test files — one row that a wrong build passes, and two rows that cannot fail
status: in-development
column: In Development
size: XS
priority: P2
epic: EPIC-006
feature: —
---

# ABC-113 — close `ABC-043` `A1`'s binder blind spot and `ABC-044` `A2`'s dead rows: TWO TEST ROWS, ZERO PRODUCTION LINES

> **Cut 2026-08-20 by BA/PM** (task `cut-epic006-instrument-residuals-2026-08-20`, Workflow 07), out
> of QE/E2E's own recommendation at `qe-ABC-044-recheck-2026-08-20`
> (`.grugops/context/ticket-to-pr-ABC-044-2026-08-20/notes/`).
>
> **NEITHER RESIDUAL IS A DEFECT IN SHIPPED BEHAVIOUR.** The delivered `src/cli.ts` and
> `src/result-screen.ts` are correct and are **not touched by this ticket**. Both residuals are in
> TEST files: one instrument is blind to a wrong build, one pair of rows cannot fail at all.
>
> **`ABC-043` AND `ABC-044` ARE NOT RE-OPENED, NOT RE-SCORED AND NOT AMENDED.** `ABC-044` is in UAT
> as this is cut. This ticket edits two of their delivered ASSERTIONS and neither of their pages.
>
> **QE DECLINED TO AUTHOR EITHER CLOSE AND THAT REFUSAL IS WHY THIS IS A TICKET.** Authoring and
> adjudicating the same instrument is a conflict; QE measured the closes and left them for whoever
> owns these files next. That is the correct call and this page records it rather than quietly
> undoing it.

## Problem

*User*: the next engineer or QE agent who reads these two test files and believes what they say.

*Pain — two residuals, both measured, both in `EPIC-006`'s own test files.*

**(1) `ABC-043` `A1` — a green suite on a build the criterion forbids** (`src/cli.test.ts:2051-2054`).
The criterion's stated intent is *"every option is the merged factory's own return value"*. The
`history` option is pinned by an initializer row plus a window-anchored shorthand row, and a regex
over source text cannot do scope analysis: a **shadowing-parameter rebind** hands the loop a
different object and the whole suite stays green. QE measured it (`tsc` 0, **1207/1207 green**); BA/PM
re-planted it independently at this cut and got the same result.

**(2) `ABC-044` `A2` — two rows that can only fail by being unequal**
(`src/result-screen.test.ts:168-177`). They compare **whole screens** — headline plus the *identical*
move list — so one can contain the other only by being equal to it, which `ABC-044` `A1`'s set-of-8
row already buys. The ticket's own named wrong build (`"by repetition"` / `"by repetition (claimed)"`)
turned the naming and word rows red and left **these two green**. They are dead weight, and a dead row
is a small lie the next reader inherits.

*Value*: a merged acceptance criterion that cannot fail its own wrong build is worse than no
criterion, because the next hop reads it and stops looking. Both closes are **one expression each**,
both are already measured, and neither costs a production line.

## The reading this page rules, so a future reader does not misread it as a regression

**BA/PM, 2026-08-20: `ABC-043` `A1`'s pre-repair and post-repair instruments are INCOMPARABLE, not
strictly ordered — and the ticket carries that sentence into the test file.**

- The **old** single row `/history:\s*newGame\(START_FEN\)/` was blind to `M10` — a *second*
  `newGame(START_FEN)` in the entry point.
- The **new** triple kills `M10` and is blind to `D3` — a shadowing-parameter rebind.

**Neither dominates.** "Strictly stronger" was false when it was claimed and "strictly weaker" is
false too. `A1` below closes `D3` while keeping the once-only pin, so after this ticket the
instrument is stronger than **both** — which is the first time an ordering can honestly be asserted.

## Scope

- **One expression added** to `ABC-043` `A1` in `src/cli.test.ts`: a count of `history` binders in
  the executable view of the entry point.
- **Two expressions retargeted** in `ABC-044` `A2` in `src/result-screen.test.ts`: from the joined
  screen to the headline row.
- **One comment sentence** beside the `A1` rows recording the incomparability above by mutant name.

## Out of scope — say no on the page

- **ZERO PRODUCTION LINES. If this ticket grows a non-test file under `src/`, it is the wrong
  ticket** and must be stopped, not extended. `A3` makes that checkable.
- **The `ABC-044` `A1` set-row softness** (two reasons sharing a phrase whose `result` differs) —
  **QE ruled it NOISE with measurements**: the naming row covers it, six of the eight carry `draw`,
  and combined the criterion is fully instrumented. **NOT CUT.**
- **The `ABC-044` `A3` word-boundary reading** (`drawn`/`winner` would slip a `\b`-anchored list) —
  **QE ruled it NOISE**: the criterion says *words*, the instrument tests words, and no build in that
  diff produces those tokens. **NOT CUT.**
- **The zero-ply trailing blank row** on a fault screen — reported by QE, not raised, no criterion
  forbids it. **NOT CUT.**
- **Re-opening, re-scoring or amending `ABC-043` or `ABC-044`.** Their assertions are edited; their
  pages, DoR scores and columns are untouched. `ABC-044` is in UAT.
- **The three coverage limits QE disclosed** (`resignation` unreachable through the entry point, the
  two claimed draws never driven end to end, the TTY path) — those are UAT's disclosure and belong to
  `EPIC-006`'s later command set, not to a test-hygiene ticket.

## Acceptance (Given/When/Then)

- **`A1` (the binder count — kills `D3` and `M9`).** **Given** the executable view
  `executableCodeOf("cli.ts")`, **then** `entry.match(/\bhistory\s*[:=]/g)` has length **exactly 1**.
  *Measured at this cut on the branch tip: delivered → `["history ="]`, **1** (GREEN); the
  shadowing-parameter decoy `D3` → **2** (RED); the flat-copy decoy `M9` (`history: decoy,`) → **2**
  (RED).* The existing three rows stay — this ADDS a row, it replaces nothing.
- **`A2` (the headline rows — kills `M11b`).** **Given** each of the two claimed/automatic pairs,
  **when** the non-substring assertions run, **then** they compare `screen.split("\n")[1]` — the
  headline — in both directions, not the joined screen. *Measured at this cut: on mutant `M11b`
  (`fivefold-repetition` → `"by repetition"`, `threefold-repetition` → `"by repetition. it was
  claimed by the player to move under FIDE 9.2"`) the **whole-screen rows are GREEN and the headline
  rows are RED**.* **Disclosed rather than oversold: `M11b` also reddens the sibling `automatic` word
  row, and a mutant that the headline rows kill ALONE is unconstructible while those word rows stand**
  — a substring relation forces the forbidden word into the other screen. This half buys
  **non-vacuity and the criterion's own words**, not new coverage, and it must not be sold as more.
- **`A3` (zero production lines — the fence, checkable).** **Then** `git diff --name-only main...HEAD
  -- src/` lists **exactly** `src/cli.test.ts` and `src/result-screen.test.ts` and nothing else; every
  non-test file under `src/` is byte-identical, `src/cli.ts` and `src/result-screen.ts` named
  explicitly.
- **`A4` (the lane does not move).** **Then** `npx vitest run --dir src` reports **40 files / 1207
  tests / skip 0** — unchanged. Both closes live inside existing `it` blocks: **0 new test files, 0
  new `it`s, 0 new spawns.**
- **`A5` (every close is WATCHED RED before it ships).** **Given** each of `D3`, `M9` and `M11b`
  re-planted at the branch tip, **then** the corresponding row is observed **RED** and the failing
  test is named in the delivery note; each decoy reverted, `git status --porcelain` **empty**
  afterwards. *(A close nobody watched fail is the exact species of row this ticket exists to
  remove.)*
- **`A6` (the incomparability is written where it will be read).** **Then** the comment beside
  `ABC-043` `A1`'s rows states in one sentence that the pre- and post-repair instruments are
  incomparable, naming **`M10`** and **`D3`**, and that this ticket's row is what makes the current
  instrument stronger than both.

## Dependencies

- **`ABC-044` MUST MERGE TO `main` FIRST.** Both files this ticket edits live on
  `grugops/abc044-the-result-screen`; `src/result-screen.test.ts` does not exist on `main` at all.
  **This is a sequencing blocker, not an open question** — it needs a merge, not a decision, and it is
  the one ⚠️ below.
- **`ABC-043` is MERGED** and supplies `executableCodeOf` and the `A1` rows.
- **No design decision is open.** Both expressions are written above and both are measured.
- **Cancellation condition, pre-registered:** if `ABC-044` is returned from UAT and its
  `src/result-screen.test.ts` is rewritten, re-cut `A2` against whatever ships instead of delivering
  this half blind. `A1` is unaffected either way.

## Security / NFR triggers

- **NO `N8-LANE` LINE IS CLAIMED, deliberately.** `ABC-108` is open and `NFR-008` is **BREACHED on the
  CPU clause / UNRULED on wall**, so a 5% slice of a spent total is not a slice and quoting 650 ms
  here would be arithmetic over a number nobody has. **Falsifiable zeroes instead: 0 new test files,
  0 new `it`s, 0 new spawns, 0 production lines**, three added/retargeted expressions inside existing
  blocks. `N8-SPAWN` **0 ms** — nothing is spawned.
- **`NFR-002` — not triggered.** No frame is composed; `src/frame.ts` and every other production file
  are byte-identical (`A3`).
- **Security — not triggered.** No production byte changes, no player input path is touched, no
  dependency added. **Falsifiable firing threshold: it fires if the diff touches any file under
  `src/` other than `src/cli.test.ts` and `src/result-screen.test.ts`.**
- **UAT waiver candidacy — NOTED, NOT APPLIED.** With `A3` holding, this ticket changes zero
  production lines and is a candidate for the zero-production-lines UAT waiver. **BA/PM does not apply
  it; that is the Orchestrator's at the `Ready for UAT` exit.**

## Test notes

1. **Assert over the executable view, never the raw file.** `executableCodeOf` strips comments; a
   count run over raw source is reddened by the word `history` in a comment.
2. **`A1` is a COUNT, not a `not.toContain`.** A negative row on the literal `decoy` passes on every
   build that spells its decoy differently.
3. **`A2` must keep BOTH directions and BOTH pairs.** Dropping a direction re-creates the dominated
   row in a shorter form.
4. **Do not delete `ABC-044` `A2`'s four word rows.** They are the rows that carry the criterion's
   substance and they are strictly stronger than the criterion asked for.
5. **Run the contained lane, not the repo root:** `npx vitest run --dir src`. The root lane sweeps
   leftover agent worktrees (`ABC-050`).

## Size and priority rationale

**Size `XS`.** Three expressions, two existing files, no new file, no new module, no production line,
no async, no I/O, and no open decision — both closes are written on this page and both are measured.
Calibrated against `ABC-112` (`XS`), and **smaller than it**: `ABC-112` changes production code.

**Priority `P2`.** **Not `P1`:** no user is affected, nothing on the board is blocked, and `ABC-044`
already left `In Review` with this residual disclosed rather than hidden. **Not `P3`:** a MERGED
criterion currently cannot fail its own wrong build, and today that fact lives only in a context
note — the next reader of `src/cli.test.ts` will not find it. **Promotion trigger, pre-registered:**
`P1` if any build reaching `In Review` is found to have relied on the blind spot. **Demotion trigger:**
`P3` if `ABC-044` is returned from UAT and `src/result-screen.test.ts` is rewritten, since half the
ticket would then be re-cut rather than delivered.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-20**. **Result: 9 of 10 clean, 1 ⚠️. NOT PULLABLE TODAY — the ⚠️ is a merge, not a
decision.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the next reader of two test files; both residuals reproduced at this hop, not restated — binder count measured at **1 / 2 / 2**, `M11b` measured green-on-whole-screens and red-on-headlines |
| 2 | scope and out-of-scope clear | **✅** three expressions in; six fences out, including the two items QE ruled NOISE and the zero-production-lines fence |
| 3 | INVEST-shaped | **✅** negotiable (the two halves are separable), valuable, estimable, small, testable. *Independent only after `ABC-044` merges — carried at item 10, not double-counted here* |
| 4 | acceptance testable and measurable | **✅** six criteria, each naming the mutant it kills (`D3`, `M9`, `M11b`) or the number it pins (2 files, 40/1207/0), plus a watched-red obligation and an explicit statement of what `A2` does NOT buy |
| 5 | dependencies known | **✅** one, named with its cancellation condition; no open design decision |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` deliberately NOT claimed while `ABC-108` is open, with falsifiable zeroes in its place and the clause state stated so it cannot read as a pass; `NFR-002` not triggered; security not triggered with a falsifiable firing threshold |
| 7 | test notes present | **✅** five, including the two lazy assertions that would pass on the wrong build |
| 8 | size assigned | **✅** `XS`, calibrated against `ABC-112` with the reason it is smaller |
| 9 | priority assigned | **✅** `P2`, argued in both directions with a promotion and a demotion trigger |
| 10 | no major unresolved blocker | **⚠️ ONE, AND IT IS A MERGE, NOT A QUESTION: `ABC-044` is in UAT and both files this ticket edits exist only on its branch** — `src/result-screen.test.ts` is not on `main`. Nothing needs deciding; the ticket becomes pullable the moment `ABC-044` merges. Marked rather than smoothed so nobody pulls it into a tree where one of the two files does not exist. |
