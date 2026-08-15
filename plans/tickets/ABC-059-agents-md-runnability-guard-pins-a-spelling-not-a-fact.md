---
id: ABC-059
title: `AGENTS.md`'s runnability guard pins one spelling, so the file contradicted itself for a day while the guard was green — assert the fact instead
status: backlog
column: Backlog
size: XS
priority: P3
epic: —
feature: —
---

# ABC-059 — the guard bars one sentence; the claim can be written a dozen ways, and one of them shipped

> **Cut 2026-08-16 by BA/PM** (task `abc042-followups-2026-08-16`, subtask
> `refinement-ABC-042-followups`, Workflow 07) out of the **`AGENTS.md` Scribe's `S6`**
> (`agents-md-ABC-042-dev-run`), which was raised after QE found the symptom as `Q13`. **Recorded by
> the Scribe, not taken — it said so explicitly, because `A1` is another role's criterion.**
> **`ABC-042`'s page is not edited by this ticket, and neither is its `A1` row.**

## Problem

*User*: every agent on this project. `AGENTS.md` is the substrate each one reads first.

*Pain*: **`AGENTS.md` spent a day contradicting itself about whether a CLI entry point exists, and
the guard written to prevent exactly that was GREEN the entire time.**

- The guard is `src/cli.test.ts:193-204` — the only automated reader of `AGENTS.md` in this
  repository (the Scribe grepped the whole tree for `readFileSync` / `import` / `require` /
  `resolve` against it: **one hit**, and no other test reads any repository markdown).
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
- **Barring the phrase `UNKNOWN - verify` from the file.** It occurs **8** times legitimately on the
  repaired tree — four genuinely unknown command slots plus the surrounding guidance. A guard that
  bars the phrase outright is wrong and would red a correct file.
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

- **`A1` (the claim is checked, not one spelling).** **Given** `AGENTS.md` with all whitespace
  collapsed to single spaces, **when** every occurrence of the token `Dev / run` is located, **then**
  each one's surrounding span states the delivered command (`package.json`'s `scripts.chess`) and
  **none** states `UNKNOWN - verify`. **Today's repaired file has exactly 2 occurrences and 2 of 2
  agree; the pre-repair file had 2 and 1 of 2 disagreed** — both measured.
- **`A2` (the historical failure reds it).** **Given** the exact `Q13` sentence re-inserted anywhere
  in `AGENTS.md`, **including with its original line break between `Dev / run` and
  `UNKNOWN - verify`**, **then** the suite is **RED**. *(Today: green. This is the falsifying test
  and it is the whole point of the ticket.)*
- **`A3` (the correct file stays green).** **Given** the repaired `AGENTS.md` with its **8**
  legitimate occurrences of `UNKNOWN - verify`, **then** the suite is **GREEN** — the guard bars a
  claim about one slot, never the phrase.
- **`A4` (the delivered command is read, not transcribed).** **Given** the assertion, **then** the
  command it compares against is read from `package.json` at run time. **No second literal spelling
  of the command is introduced** — a guard that hardcodes it is the same defect one level down.
- **`A5` (`ABC-042`'s row is untouched).** **Given** the diff, **then** the `it` block at `:193-204`
  is **byte-identical**, and the new assertions are in a separate, differently-named block.
- **`A6` (nothing else changed).** `git diff --name-only <the delivered commit>~1 <the delivered
  commit>` shows **exactly** `src/cli.test.ts` — **one path**, **zero production lines**, **zero new
  child processes**. Suite green, skip **0**.

## Dependencies

- **`ABC-042`'s line must merge first — OPEN and HELD.** `src/cli.test.ts` **does not exist on
  `main`** (verified), and the repaired § Deployment posture prose is on the same line
  (`agents-md-ABC-042-dev-run`). **The hold is `G1`, with the project owner**, and is not this
  ticket's to move.
- **Independent of `ABC-057` and `ABC-058`.** `ABC-058` touches the same file at three other sites
  and states its own "no new `it` block" as a delta so the two cannot red each other; either order
  works.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **0 new test files, 0 new files under `src/`,
  0 new child processes.** The added work is two `readFileSync` calls the file already makes in the
  neighbouring row, plus a whitespace collapse over a ~270-line markdown file. **`N8-LANE` is
  currently NOT MET at 2.00× and is with the owner; this ticket must not move it.**
- **`NFR-002` not triggered.** No frame path, no production module opened.
- **Security: not triggered.** `ABC-041`'s four clauses: **(a)** no manifest touch — `package.json`
  is **read**, not written, **(b)** no non-`.test.ts` file under `src/` touched at all, **(c)** the
  one test file adds no network, no write, and **no spawn** — read-only `node:fs` over the repo's own
  source is explicit precedent, **(d)** blast radius is one path. **On a disputed reading it fires
  and the gate resolves it.**

## Test notes

1. **Write `A2` first and watch it RED before writing the guard.** The historical sentence, with its
   line break, is the only witness that distinguishes this instrument from the one it replaces. A
   guard that passes `A2` only because the sentence was pasted onto a single line has not been
   tested.
2. **The span rule needs stating in the test, not left to the reader.** "Surrounding span" must be
   defined mechanically (for example: from the occurrence to the next sentence terminator in the
   normalized string) and the definition asserted against both measured cases — 2/2 agreeing today,
   1/2 disagreeing on the pre-repair text.
3. **`AGENTS.md` has exactly one automated reader** and this ticket makes it two blocks in one file.
   Keep them adjacent, so a hop editing the file finds both.
4. **Do not generalise the mechanism to other claims in the file.** § E2E's comment already names a
   different ticket for runnability (`ABC-043` vs `EPIC-006`, the Scribe's own `S4`), and that
   disagreement is BA/PM's scheduling fact to settle — **not something this guard should decide by
   asserting one side.**

## Lane cost — how many test FILES this ticket implies

**Zero.** One block added to an existing file; no child process.

## Size and priority rationale

**Size `XS` (1).** One `it` block, two files read, one normalization, one loop — plus the mutant that
is already written down as `A2`. **The history behind it is a day long; the work is a few lines.**

**Priority `P3`.** The contradiction it let through is **already fixed**, no live defect exists, and
the file is correct on this claim today. It is a guard against a recurrence, and the recurrence has a
cheap detector — the next reader. **Promote to `P2` the moment any hop writes a runnability claim
into `AGENTS.md` prose again, or the moment `EPIC-006` starts changing what the entry point is** —
packaging is precisely when the `Dev / run` claim moves and the prose around it is most likely to
lag.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 9 of 10 — NOT MET.** ⚠️×1, and the ⚠️ is an ordering, not an unknown.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** one guard, one measured blindness, one shipped contradiction, and the exact mechanism (rendering vs claim, split across a line break) |
| 2 | scope and out-of-scope clear | **✅** one block in one file; six fences, including "no process rule is adopted here" and "the phrase is not barred" |
| 3 | INVEST-shaped | **✅** independent of both siblings, small, testable by re-inserting a sentence that exists in git history |
| 4 | acceptance testable and measurable | **✅** **2** occurrences of `Dev / run` with **2/2** agreeing, the `Q13` sentence RED **with its line break**, **8** legitimate `UNKNOWN - verify` still green, `ABC-042`'s row byte-identical, **1** path in the diff |
| 5 | dependencies known | **✅** `ABC-042`'s line first, with the reason and the holder of the hold; explicitly independent of `ABC-057`/`ABC-058` |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms with **0** new files and **0** spawns, `NFR-002` untriggered, four security clauses each answered |
| 7 | test notes present | **✅** four, including "write the failing witness first" and the span definition |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P3`, lowest of the four cut this hop, with two named promotion triggers |
| 10 | no major unresolved blocker | **⚠️** `ABC-042` must merge first and is **held on `G1`, with the project owner**. External, real, and scored rather than written off |
