---
id: ABC-092
title: Decide and record the opening-book source and its licence — before one byte of book data is copied into this repository
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-005
feature: —
---

# ABC-092 — the licence gate `RISK-004` has been asking for since 2026-07-24

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-005`, Workflow 03) from
> `plans/epics/EPIC-005-opening-book.md` § Scope bullet 1 and § Risks (`RISK-004`).
> **This ticket does NOT pick a source, and no candidate source is named anywhere on this page —
> that is deliberate, not an omission.** Picking one is an owner + Architect/Design decision
> (`plans/nfr-catalog.md` § "Risk table", `RISK-004` row: *"the licence must permit redistribution …
> resolve BEFORE copying any data"*), and my subtask's stop condition sends it there. What this
> ticket owns is the **shape of the decision and the evidence it must leave behind**, so that
> whoever makes it cannot make it informally. Measurements and rejected framings live in
> `.grugops/context/epic-to-tickets-EPIC-005/notes/`.

## Problem

*User*: the maintainer who will one day be asked "where did this data come from and were you allowed
to ship it?" — and, immediately, the engineer holding `ABC-093`, who cannot legally start.

*Pain*: **`RISK-004` is the only risk on this project's register that can make merged work
unshippable rather than merely wrong.** `plans/nfr-catalog.md` rules it **"No — distribution-
dependent"** and adds the sentence that removes the easy escape: *"This is NOT made moot by 'we
deploy nowhere': redistribution is triggered by the data reaching anyone at all, and a `git clone`
distribution is still redistribution."* So the local-only posture of `ADR-0007` buys this epic
**nothing**. Today the register carries the risk, `EPIC-005` § Scope says the source must be recorded
"in the epic's first ticket", and no such ticket has ever existed.

*Value*: this is the cheapest ticket in the epic and it is the one that makes the other four legal to
build. It ships **zero book data** and therefore cannot itself create the exposure it exists to
prevent.

## Scope

- **Research**: identify candidate sources of opening theory whose licence terms are *published and
  readable*, and record for each: the licence identifier, the exact clause governing
  redistribution, the attribution the licence requires, and where the data physically comes from.
- **Record the decision as an ADR** in `memory-bank/50-decisions/`, ratified by the project owner —
  the same route `ADR-0003` clause 2 took when a target needed a human's name on it.
- **Record the attribution artifact** the chosen licence requires (a `NOTICE`/attribution file, or
  the equivalent this repository agrees on), so `ABC-093` has somewhere to write it.
- **Record the size implication for `NFR-006`**: the expected compiled size of the theory depth
  `EPIC-005` targets (8–10 plies of mainline), from the candidate's own published figures.

## Out of scope

- **Copying any opening data into this repository. Zero bytes.** That is `ABC-093`, and it is
  blocked on this ticket's ADR being ratified.
- **Choosing the file format, the key, or the compiler.** `ABC-093`'s, with Architect/Design.
- **Any runtime network call.** `EPIC-005` § Out of scope declines online explorers permanently;
  this ticket does not re-open that and must not be read as doing so.
- **Re-opening `ADR-0007`'s deployment posture** or the `V13.4.1` / `V15.1.1` ASVS deferrals. This
  ticket *feeds* them; it does not discharge them.

## Acceptance (Given/When/Then)

- **`A1` (a ratified decision exists).** **Given** this ticket is delivered, **when**
  `memory-bank/50-decisions/` is read, **then** it contains an ADR naming exactly **one** chosen
  source, its **licence identifier**, and the project owner as ratifier by name — with a status of
  `accepted`, not `proposed`.
- **`A2` (the redistribution clause is quoted, not summarised).** **Given** that ADR, **then** it
  quotes the licence's redistribution clause **verbatim** and states in one sentence how it applies
  to a `git clone` of this repository. *(A summary is what `RISK-004` says is not enough.)*
- **`A3` (rejected candidates are on the record).** **Given** that ADR, **then** it lists **≥ 2**
  candidates that were considered and **not** chosen, each with the reason. A decision with no
  rejected alternative is a preference.
- **`A4` (the attribution obligation is discharged in advance).** **Given** the chosen licence
  requires attribution, **when** the ticket is delivered, **then** the attribution text exists in
  the repository and the ADR names **the exact path** `ABC-093` must keep it at. If the licence
  requires none, the ADR says so explicitly — **"none required" is a finding, not silence**.
- **`A5` (`RISK-004` moves).** **Given** delivery, **then** `RISK-004`'s row records **resolved**
  with a pointer to the ADR, and the resolution is dated. *(Editing `plans/nfr-catalog.md` is
  Architect/Design's or Security/NFR's — this criterion says the row must move, not who moves it.)*
- **`A6` (nothing was copied).** **Given** the delivered diff, **then** it contains **0** files of
  opening-book data, **0** files under `src/`, and **0** test files. Only markdown.

## Dependencies

- **The project owner's ratification is on the critical path and cannot be produced by an agent.**
  `.grugops/factory.config.json` has `context.human_admission: "off"` and this install can emit no
  `§14-gate#<id>` stamp, so an agent's research is recorded as `claim` / `observation` and the
  *choice* is the owner's. **This is the ticket's real duration risk, and it is a person's calendar,
  not an engineering estimate.**
- **`ABC-057` (licence-guard comparator) is open and is adjacent, not blocking.** That ticket
  repairs the guard over `src/history-pane.nfr.test.ts`'s `LICENSED_DRIVERS`, which is an
  *internal import* licence, not a *data redistribution* licence. **Two different senses of the
  word — recorded here so a later hop does not fold them.** Whether this repository's licence
  guard should also witness a data-attribution file is an open question and **not decided here**.
- **No product dependency.** Nothing under `src/` is read or written; `EPIC-001` and `EPIC-004` are
  irrelevant to this ticket. **This is the one ticket in `EPIC-005` that is pullable today.**

## Security / NFR triggers

- **`NFR-006` (≤ 1 MB compiled book) — informed, not verified here.** `A4`'s research records the
  candidate's own size figures so `ABC-093` starts with a budget rather than a surprise.
  **`NFR-006`'s stated instrument does not exist**: `plans/nfr-catalog.md` records that
  `npm run build` is `tsc --noEmit`, emits nothing, and there is no `dist/`. Flagged to
  Security/NFR; `ABC-093` `A5` supplies an instrument that exists today.
- **ASVS `V15.1.1` / `V15.2.1` (third-party component remediation) — this ticket adds the
  project's FIRST third-party *content* dependency**, in a project whose `dependencies` is `{}`.
  The `high` → `low` severity override on record was justified by *"zero runtime dependencies"*;
  **that justification is weakened by this epic and the ADR must say whether it still holds.**
  Owner: Architect/Design at `EPIC-006`, informed here.
- **`NFR-008` (test lane): 0 test files, 0 lines. Not charged.**
- **`NFR-002`, `NFR-004`, `NFR-007`: not triggered** — no frame, no search, no startup path.

## Test notes

1. **There is nothing to unit-test and no test file should be written.** The deliverable is a
   ratified decision; a test asserting an ADR exists would be a spelling guard of the kind
   `ABC-059` was cut for.
2. **Verify the licence text against the licensor's own published page, not against a summary
   site.** Record where it was read and when — licences are re-versioned.
3. **`A3`'s rejected candidates must be rejected for a stated *licence or provenance* reason where
   that is the true reason.** "Too big" and "too shallow" are legitimate reasons too; what is not
   legitimate is a rejected list assembled to make one candidate look inevitable.

## Size and priority rationale

**Size `S`.** Research plus an ADR plus one attribution file. **Not `XS`**: reading real licence
terms carefully is the entire value, and the owner round-trip is real elapsed work. **Not `M`**: no
code, no artifact, no test.

**Priority `P1`.** It inherits `EPIC-005`'s `P1` and is the epic's only unblocked entry point;
every other ticket in the epic is illegal to start until it lands. **Not `P0`**: nothing is broken
today and `EPIC-004` — a `P0` epic — is the real critical path.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 9 of 10 — item 10 carries a ⚠️ (the owner's decision is a person, not a
task); the other nine are MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** user, pain and value stated; `RISK-004`'s "a `git clone` is still redistribution" ruling quoted from `plans/nfr-catalog.md` |
| 2 | scope and out-of-scope clear | **✅** four in, four out; "zero bytes of data" is the boundary |
| 3 | INVEST-shaped | **✅** independent of every other ticket in the epic and of `EPIC-004`; small; testable by inspection of the delivered ADR |
| 4 | acceptance testable and measurable | **✅** six criteria on counts and states: exactly 1 source, ≥ 2 rejected, a verbatim clause, a named path, 0 data files, 0 `src/` files |
| 5 | dependencies known | **✅** three named; the owner-ratification dependency is stated as the duration risk it is |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-006` ≤ 1 MB informed; the `V15.1.1`/`V15.2.1` override challenged by name; `NFR-008` 0 files |
| 7 | test notes present | **✅** three, including "do not write a test for this" and why |
| 8 | size assigned | **✅** `S`, with both re-size boundaries named |
| 9 | priority assigned | **✅** `P1`, with the reason it is not `P0` |
| 10 | no major unresolved blocker | **⚠️ ONE, and it is the ticket's subject.** The choice of source is the **owner's and Architect/Design's**, not an agent's. That does not block *pulling* this ticket — the research is the agent's — but it blocks *closing* it. **Named, not resolved.** |
