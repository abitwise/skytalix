---
id: ABC-059
title: `AGENTS.md`'s runnability guard pins one spelling, so the file contradicted itself for a day while the guard was green — assert the fact instead
status: ready
column: Ready
size: XS
priority: P2
epic: —
feature: —
---

# ABC-059 — the guard bars one sentence; the claim can be written a dozen ways, and one of them shipped

> **Cut 2026-08-16 by BA/PM** (task `abc042-followups-2026-08-16`, subtask
> `refinement-ABC-042-followups`, Workflow 07) out of the **`AGENTS.md` Scribe's `S6`**
> (`agents-md-ABC-042-dev-run`), which was raised after QE found the symptom as `Q13`. **Recorded by
> the Scribe, not taken — it said so explicitly, because `A1` is another role's criterion.**
> **`ABC-042`'s page is not edited by this ticket, and neither is its `A1` row.**
>
> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-batch-2-2026-10-10`)
> against wave tip `f76e041`. **The premise holds, and a later ticket declined it by name.**
> `ABC-065`'s block guards the `- Dev / run:` SLOT only (`src/cli.test.ts:1948-2132`), and its
> docblock calls this ticket's blindness "declined one file over" (`:1956-1958`). The counts have
> moved. `AGENTS.md` has **3** `Dev / run` occurrences, not 2. One is a section pointer that states
> no command (`:75`), so `A1` as cut would have redded the correct file; it is re-worded. The third
> is a prose runnability claim, **split across a line break**. `ABC-109` rewrote it on 2026-09-25
> (`b9a6861`, `:282-283`), which is this page's own `P2` trigger. **P3 → P2. DoR 10/10 → `Ready`.**

## Problem

*User*: every agent on this project. `AGENTS.md` is the substrate each one reads first.

*Pain*: **`AGENTS.md` spent a day contradicting itself about whether a CLI entry point exists, and
the guard written to prevent exactly that was GREEN the entire time.**

- The guard is `ABC-042`'s `A1` row, `src/cli.test.ts:1035-1045` at `f76e041` (`:193-204` at the
  cut). At the cut it was the only automated reader of `AGENTS.md`. *(2026-10-10: there are now
  three more readers in the same file. `ABC-065`'s block, with `ABC-067`/`ABC-071`'s rows, guards
  the slot's text, and `ABC-109`'s row guards the byte count. **None of them reads `AGENTS.md`
  prose outside the slot.**)*
- Its negative assertion is a **literal substring test for one rendering**:
  `expect(agents).not.toContain("- Dev / run: \`UNKNOWN - verify\`")` — the **list-item form**,
  leading hyphen and colon included.
- `Q13`'s contradicting sentence said the same thing in **prose**, in § Deployment posture, **split
  across a line break**: *"…which is why `Dev / run` above is / `UNKNOWN - verify` and stays that
  way."* It contains neither `- Dev / run: ` nor the two tokens adjacently on one line.

**The blindness is not distance between sections. It is that the guard pins one rendering of the
claim while the claim can be written a dozen ways** — including, as measured, the same tokens with a
newline between them.

*Value*: the contradiction `Q13` found is fixed. **This ticket is about the next one.** A
self-contradicting substrate file is the kind of defect that gets absorbed as background noise and
then cited by a future hop as licence — and the file is currently guarded against exactly one
sentence.

## Scope

- **One new `it` block in `src/cli.test.ts`**, named for this ticket, asserting the **fact**: every
  claim `AGENTS.md` makes about the `Dev / run` slot agrees with the delivered command.
- **The check runs over whitespace-normalized text, not per line** — that is the specific mechanism
  that made the existing guard blind, and a per-line check would reproduce it.
- **A short comment at the site** recording what the guard is for and why it is not a substring test,
  so the next hop does not "simplify" it back into one.

## Out of scope

- **`ABC-042`'s page, its `A1` criterion, and its `A1` row.** The row's three existing assertions
  stay **byte-identical**, so `ABC-042`'s `A1` is neither weakened, widened nor re-interpreted. The
  new assertions live in their own block with their own name, so a reader can tell which ticket each
  serves.
- **Barring the phrase `UNKNOWN - verify` from the file.** It occurs **8** times legitimately
  (re-measured 2026-10-10): genuinely unknown command slots plus the surrounding guidance. A guard
  that bars the phrase outright is wrong and would red a correct file.
- **Any other `AGENTS.md` claim.** Deployment posture, `ADR-0007`, the deploy fence and the four
  remaining `UNKNOWN - verify` slots are untouched. This is one claim: whether the project is
  runnable and by what command.
- **Adopting a criterion-authoring process rule.** The Orchestrator recorded four instances of this
  defect class across two tickets
  (`.grugops/context/ticket-to-pr-ABC-042/notes/…-one-defect-class-four-times-…`) and **deliberately
  declined** to turn it into a rule — that is the project owner's call via the Factory Coach, and
  `mode` is `lean`. **This ticket repairs one guard and claims nothing about the class.**
- **The Scribe's own `S4` / `S5`** (§ E2E's justification comment; `ADR-0007` `D2`'s headline vs its
  check). Different findings, different owners (BA/PM+Security/NFR, and Architect/Design), and **not
  the same `S4`/`S5` as Security/NFR's** — see `ABC-058`.

## Acceptance (Given/When/Then)

- **`A1` (the claim is checked, not one spelling; re-worded 2026-10-10).** **Given** `AGENTS.md` with
  all whitespace collapsed to single spaces, **when** every occurrence of the token `Dev / run` is
  located and its span is taken (from the occurrence to the next sentence terminator), **then**
  (i) **no** span contains `UNKNOWN - verify`, and (ii) every span that contains `npm run ` names
  `npm run <name>`, where `<name>` is the `package.json` script whose value runs `src/cli.ts`.
  **At `f76e041`: 3 occurrences; (i) 0 of 3 spans state `UNKNOWN - verify`; (ii) 2 of 3 spans name
  a command, and both name `npm run chess`.** The third is the receipts pointer `§ "Dev / run".`
  (`:75`), which names no command. Under the cut's wording ("each span states the command") that
  pointer would red a correct file. The pre-repair file had 1 span with `UNKNOWN - verify`.
- **`A2` (the historical failure reds it).** **Given** the exact `Q13` sentence re-inserted anywhere
  in `AGENTS.md`, **including with its original line break between `Dev / run` and
  `UNKNOWN - verify`**, **then** the suite is **RED**. *(Today: green. This is the falsifying test
  and it is the whole point of the ticket.)*
- **`A3` (the correct file stays green).** **Given** `AGENTS.md` at the pull base, with its
  legitimate `UNKNOWN - verify` occurrences (**8** at `f76e041`), **then** the suite is **GREEN** —
  the guard bars a claim about one slot, never the phrase.
- **`A4` (the delivered command is read, not transcribed).** **Given** the assertion, **then** the
  command it compares against is read from `package.json` at run time. **No second literal spelling
  of the command is introduced** — a guard that hardcodes it is the same defect one level down.
- **`A5` (`ABC-042`'s row is untouched).** **Given** the diff, **then** `ABC-042`'s `A1` block
  (`:1035-1045` at `f76e041`) and `ABC-065`'s `describe` block (`:1948-2132`) are **byte-identical**,
  and the new assertions are in a separate, differently-named block.
- **`A6` (nothing else changed).** `git diff --name-only <the delivered commit>~1 <the delivered
  commit>` shows **exactly** `src/cli.test.ts` — **one path**, **zero production lines**, **zero new
  child processes**. Suite green, skip **0**.

## Dependencies

- ~~**`ABC-042`'s line must merge first — OPEN and HELD.**~~ **`ABC-042` — `Done`** (`dbaf972`,
  2026-08-15).
- **Independent of `ABC-057` and `ABC-058`.** `ABC-058` touches the same file at two other sites
  and states its own "no new `it` block" as a delta, so the two cannot red each other. **Build them
  one after the other, not in parallel**; either order works.
- **`AGENTS.md` is being edited by in-flight work (2026-10-10):** the Scribe's `ABC-119` lane line
  (`scribe-ABC-119-lane`) and `ABC-127` (+169 B, Ready for UAT). Neither touches `Dev / run` or
  `UNKNOWN - verify`: `ABC-127`'s diff was measured, and the Scribe's line goes under `### Test`.
  **Pull after both merge**, so that `A1`/`A3`'s counts are taken on a settled file. This is
  sequencing, not a blocker. **Met:** both merged at `14a1d2a` (`c8a0614`, `d45a026`), and the
  counts were re-measured there unchanged (3 occurrences, 0/3, 2/2, 8).

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **0 new test files, 0 new files under `src/`,
  0 new child processes.** The added work is two `readFileSync` calls the file already makes in the
  neighbouring rows, plus a whitespace collapse over a 24,433-byte markdown file (at `14a1d2a`). The spawn pin
  (`N8_SPAWN`, 27) must not move.
- **`NFR-002` not triggered.** No frame path, no production module opened.
- **Security: not triggered.** `ABC-041`'s four clauses: **(a)** no manifest touch; `package.json`
  is **read**, not written. **(b)** The reading is unruled (`ABC-072`). Under STATE it fires: 3
  production files read `process.` in code, unchanged here. Under DELTA it does not: no non-test
  file is touched. **(c)** The one test file adds no network, no write and **no spawn**; read-only
  `node:fs` over the repo's own files is precedent (`ABC-065`, `ABC-109`). **(d)** The blast
  radius is one path. **On a disputed reading it fires and the gate resolves it.**

## Test notes

1. **Write `A2` first and watch it RED before writing the guard.** The historical sentence, with its
   line break, is the only witness that distinguishes this instrument from the one it replaces. A
   guard that passes `A2` only because the sentence was pasted onto a single line has not been
   tested.
2. **The span rule needs stating in the test, not left to the reader.** "Surrounding span" must be
   defined mechanically (for example: from the occurrence to the next sentence terminator in the
   normalized string) and the definition asserted against both measured cases — 2/2 agreeing today,
   1/2 disagreeing on the pre-repair text.
3. **`AGENTS.md`'s readers are all in `src/cli.test.ts`** (four blocks at `f76e041`). Put the new
   block directly after `ABC-065`'s `describe` (ends `:2132`), whose docblock already names this
   ticket, so that a hop editing one finds the other. Reuse nothing from that block's slot locator:
   it is pinned to the slot, which is the rendering this ticket must not depend on.
4. **Do not generalise the mechanism to other claims in the file.** § E2E's comment already names a
   different ticket for runnability (`ABC-043` vs `EPIC-006`, the Scribe's own `S4`), and that
   disagreement is BA/PM's scheduling fact to settle — **not something this guard should decide by
   asserting one side.**

## Lane cost — how many test FILES this ticket implies

**Zero.** One block added to an existing file; no child process.

## Size and priority rationale

**Size `XS` (1).** One `it` block, two files read, one normalization, one loop — plus the mutant that
is already written down as `A2`. **The history behind it is a day long; the work is a few lines.**

**Priority `P2` — PROMOTED 2026-10-10 from `P3`, on this page's own trigger.** The trigger was
"promote the moment any hop writes a runnability claim into `AGENTS.md` prose again". `ABC-109`
rewrote § Deployment posture on 2026-09-25 (`b9a6861`), and its runnability claim now breaks a line
inside `` (`Dev / run` = `npm run chess`) ``. That is `Q13`'s exact shape, correct this time and
unguarded. Two in-flight hops are editing `AGENTS.md` today. **Not `P1`:** the file is correct on
this claim now.

## Definition of Ready

**Re-scored 2026-10-10 by BA/PM at `f76e041`. Result: 10 of 10 — MET → `Ready`.** Was 9/10; the ⚠️
(`ABC-042` held on `G1`) is discharged.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the only guard over the prose is still one rendering; `ABC-065` declined it by name; a split-line claim is live at `:282-283` |
| 2 | scope and out-of-scope clear | **✅** one block in one file; six fences, and `ABC-065`'s block is added to the byte-identical set |
| 3 | INVEST-shaped | **✅** independent; serial with `ABC-058` on the same file, but neither depends on the other |
| 4 | acceptance testable and measurable | **✅** `A1` re-worded so the correct file is green: **3** occurrences, **0/3** spans with `UNKNOWN - verify`, **2/2** command spans naming `npm run chess`; the `Q13` sentence RED with its line break; **1** path |
| 5 | dependencies known | **✅** `ABC-042` `Done`; sequencing after the Scribe's `ABC-119` line and `ABC-127` named |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms, 0 files, 0 spawns; four clauses, (b) under both readings |
| 7 | test notes present | **✅** four, with the placement re-pointed |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P2`, promoted on the page's own trigger, with the evidence |
| 10 | no major unresolved blocker | **✅** none |
