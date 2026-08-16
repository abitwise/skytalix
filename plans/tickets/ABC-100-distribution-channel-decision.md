---
id: ABC-100
title: The distribution channel — a superseding ADR on the owner's word, not a packaging build
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-006
feature: —
---

# ABC-100 — decide HOW this CLI is distributed, and record it where `ADR-0007` clause 5 says to

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-006-packaging`, Workflow 03) at
> `EPIC-006`'s SECOND decomposition — the packaging/difficulty/`undo` half.
>
> **THIS TICKET IS THE DECISION, NOT THE ANSWER.** Its deliverable is a **superseding ADR**
> authored by **Architect/Design** on the **owner's word**, with the options laid out and the
> consequences of each priced. **No packaging ticket exists and none was cut**, because the scope of
> the packaging work is a *function of* the answer: npm publish, a compiled binary and a documented
> `git clone` share almost no work with each other. Cutting them now would be inventing scope for a
> channel nobody chose.

## Problem

*User*: the owner, who has to choose; and every later reader who would otherwise find the choice
made by inference in a ticket.

*Pain, read from three independent sources that agree — none of them argued here:*

- `AGENTS.md` § Deployment posture: *"**How the CLI will eventually be distributed — npm, a binary, a
  `git clone` — is undecided, and `EPIC-006` decides it. Do not fill that in.**"*
- `ADR-0007` **clause 5**: *"How the CLI will eventually be distributed is UNDECIDED, and this ADR
  does not decide it. npm, a standalone binary, a `git clone` and `npm start` — all open. That is
  `EPIC-006`'s question. **Recording "undecided" is the correct answer today; inventing one to fill a
  slot is not.**"*
- `ADR-0007` detection row **`D5`**: *"the owner revises the posture, or `EPIC-006` selects a
  distribution mechanism … Handled by a **superseding** ADR, not a revert."* The board row for this
  epic states the same in four words: *"distribution stays with a human."*

**And a fourth source names this hop by name.** `plans/nfr-catalog.md`'s `NFR-007` row carries an
open **TWO-DOCUMENTS-DISAGREE** item recorded 2026-08-06: *"`EPIC-006` states `npx` in four places
while `ADR-0007` clause 5 records the distribution mechanism as UNDECIDED … owners BA/PM and
Architect/Design at `EPIC-006`'s decomposition."* That is this decomposition. **The disagreement is
recorded here and is deliberately NOT resolved by editing the epic** — see `## The epic text is
wrong in four places and this ticket does not repair it`.

*Value*: **one decision unblocks the only acceptance criterion of this epic that no ticket can
currently meet** (criterion 1, `npx <package>`), and it is the named revisit trigger for the whole
deployment posture. Until it lands, every packaging ticket anyone writes is fiction.

## Scope

- **A superseding ADR** in `memory-bank/50-decisions/`, authored by **Architect/Design**, that
  records the channel the **owner** chose, supersedes `ADR-0007` **clause 5 only**, and carries its
  own falsifier table in that ADR's established shape.
- **The options laid out and each consequence priced** — at minimum the four already named in
  `ADR-0007` clause 5 (npm publish, standalone binary, `git clone` + `npm start`, `npx` off a
  registry), each with: what `package.json` must gain or lose, what `npm run build` must actually
  emit, whether a git remote becomes a precondition, whether a release record is cut, and what
  `NFR-007`'s *"< 2 s with a warm npm cache"* window even means under it.
- **The owner's word, recorded the way this project records owner directives**: verbatim, dated and
  attributed, in `memory-bank/`. `ADR-0007`'s `D7` block states the convention and its honest limit
  (`context.human_admission` is `off`; there is no un-forgeable owner signal here, only an auditable
  quotation).
- **A statement of what the chosen channel does NOT change** — specifically that
  `production_requires_human_confirmation` stays `true` unless the owner names *that flag*.

## Out of scope — and these are fences, not omissions

- **Choosing the channel.** An agent may not. Three sources say so and they agree.
- **Any edit to `package.json`.** Not `bin`, not `main`, not `exports`, not `files`, not
  `publishConfig`, not `private`. `ABC-042` `A10` asserts that fence key by key today and **this
  ticket does not relax it**.
- **Any packaging build.** No publish, no binary, no `dist/`, no CI, no release record.
- **Flipping `production_requires_human_confirmation`, or arguing it obsolete because nothing
  deploys today.** `ADR-0007` `D7` fires on exactly that, from any document, dial or grant.
- **Editing `ADR-0007`.** It is superseded on clause 5, not amended, and that is Architect/Design's
  act, not BA/PM's.
- **Editing `plans/epics/EPIC-006-*.md`** — see below.

## The epic text is wrong in four places and this ticket does not repair it

`EPIC-006` states `npx` as settled in four places — `## Scope`'s last bullet (*"Packaging: runs via
`npx`"*), acceptance criterion 1 (*"Given `npx <package>`"*), the `NFR-007` trigger, and
`## Test notes` (*"drives a scripted game from `npx` invocation"*). **Each presupposes the channel
this ticket exists to decide.** That is the `NFR-007` row's recorded disagreement, and it is
**reported to the Orchestrator rather than edited**: at this hop the epic page was out of BA/PM's
write scope, and more importantly the correct repair is not *"delete `npx`"* — it is *"say what the
owner chose"*, which cannot be written until this ticket closes. **Whoever closes this ticket owns
the epic-text correction as part of it.**

## Acceptance (Given/When/Then)

Testable by inspection of files; nothing here needs a build.

- **`A1` (the ADR exists and supersedes rather than reverts).** **Given** the owner has named a
  channel, **when** the ADR is written, **then** a file
  `memory-bank/50-decisions/ADR-00NN-<channel>.md` exists with `status: accepted`, names **exactly
  one** channel, and states in its own text that it **supersedes `ADR-0007` clause 5** and nothing
  else in `ADR-0007`. **`ADR-0007` itself is byte-identical except for a status/superseded-by
  pointer** (`git diff --numstat` shows ≤ 2 changed lines in that file).
- **`A2` (the owner's word is quoted, not paraphrased).** **Then** `grep -rn` over `memory-bank/`
  returns a **dated, attributed, verbatim** owner quotation naming the chosen channel, and
  `git log -S` on that quotation names the commit that introduced it. *(The `D7` convention, applied
  to this decision. A paraphrase fails this criterion.)*
- **`A3` (every option is priced, including the ones not chosen).** **Then** the ADR contains an
  alternatives section covering **at least** npm publish, standalone binary, and `git clone` +
  `npm start`, and for each names: the `package.json` keys it requires, what `npm run build` must
  emit, whether a git remote becomes a precondition, and its effect on `NFR-007`'s window.
  **A rejected option with no cost written against it fails this criterion.**
- **`A4` (the falsifier table is carried forward).** **Then** the new ADR carries falsifier rows in
  `ADR-0007`'s shape, and **`D2` and `D7` appear in it explicitly** — `D2` because the chosen
  channel is what will legitimately flip `package.json`'s publishability, and `D7` because the
  ticket that finally makes something deployable is the one most likely to argue the
  human-confirmation flag obsolete.
- **`A5` (the flag did not move).** **Then**
  `grep production_requires_human_confirmation .grugops/factory.config.json` reads **`true`**, and no
  document produced by this ticket argues it obsolete. *(Asserted because this ticket is exactly
  where `ADR-0007`'s clause 4 block predicts the inference will be drawn.)*
- **`A6` (nothing was built).** **Then** `git diff --numstat` for this ticket shows **zero** files
  under `src/`, **zero** changes to `package.json`, and no new file under `plans/releases/`.
- **`A7` (the epic text is repaired against the answer).** **Then** `EPIC-006`'s four `npx`
  mentions and the `NFR-007` row's TWO-DOCUMENTS-DISAGREE item are updated to the channel the ADR
  names — **or**, if the owner's choice is *"not yet"*, the item is re-recorded as still open with a
  date. **Either outcome closes it; leaving it unread does not.**

## Dependencies

- **THE BLOCKER IS THE OWNER'S WORD, and it is an ESCALATION, not a ticket.** Nothing an agent can
  do advances this ticket past `Ready`. It is cut so that the escalation has an address.
- **Architect/Design authors the ADR** — `ADR-0007` is theirs to supersede under the owner's
  standing directive of 2026-08-03 (`memory-bank/60-progress.md` § "Standing directive — who
  decides").
- **`ADR-0007` is `accepted` and MERGED**; `AGENTS.md` § Deployment posture and the `NFR-007` row
  are read as-is. **None of the three is re-decided here.**
- **Nothing in `EPIC-006`'s runnable half (`ABC-041`…`ABC-046`) blocks this**, and this blocks none
  of them. It is genuinely independent — the one INVEST property this epic's other tickets do not
  have.

## Security / NFR triggers

- **`NFR-007` — TRIGGERED AND UNMEASURABLE UNTIL THIS LANDS.** *"`npx` invocation to first rendered
  board in **< 2 s** with a warm npm cache"* names an invocation that may not exist. **This ticket's
  obligation is to say what the window is measured on under the chosen channel, not to measure it.**
  Measuring it is the packaging ticket that cannot be cut yet.
- **Security — TRIGGERED at the decision, not at this document.** Whichever channel is chosen adds a
  supply-chain surface this project has never had (a registry account, a signing key, or a
  documented clone-and-trust path). **The ADR must name the surface it opens**; ASVS assessment of
  it belongs to the packaging ticket. **Firing threshold for this ticket itself: it fires if the
  diff touches any file under `src/` or `package.json` — expected zero of both (`A6`).**
- **`N8-LANE` — not triggered.** Zero test files, zero production files.

## Test notes

1. **`A2` is the criterion that catches the most likely failure mode**: an ADR that records a
   channel the *agent* found obvious, with the owner's name attached by summary. Assert on a
   quotation, and date it with `git log -S`.
2. **`A3` fails quietly if written last.** An alternatives section produced after the choice tends
   to price only the loser. Price all three before the choice is recorded.
3. **`A5` and `A6` are cheap greps.** Run them; do not reason about them.
4. **Do not treat `npm run build` as a build.** It is `tsc --noEmit` today (`AGENTS.md`) — a
   typecheck wearing the build slot's name. Any option whose pricing assumes an emitting build must
   say so.

## Lane cost — how many test FILES this ticket implies

**Zero.** It writes markdown. No new test file, no `vi.mock`, no `*.nfr.test.ts`, and **weight
nil**.

## Size and priority rationale

**Size `S` (2).** One ADR in an established shape, three options priced, one quotation recorded, one
epic-text repair. It is not `XS` because `A3`'s pricing is genuine research (what each channel costs
this repo, measured against a `private: true` package with no remote and no emitting build).
**Not `XL`; no split line.**

**Priority `P1`.** It is the sole blocker on `EPIC-006`'s first acceptance criterion and on **every**
packaging ticket that does not yet exist, and it is `ADR-0007`'s named revisit trigger. **Not `P0`:**
nothing is broken and nobody is waiting — the product runs from source today, and `ADR-0007`
records that as a deliberate, owner-stated posture rather than a defect.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 8 of 10 clean, 2 recorded ⚠️ — NOT MET, and it cannot be met by any agent.
Stays in `Backlog` as a standing escalation.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** four independent sources quoted, none argued; the user is the owner and the pain is that every downstream ticket is fiction without this |
| 2 | scope and out-of-scope clear | **✅** one ADR, one quotation, one epic-text repair; six fences, including "an agent may not choose" and the `package.json` fence restated key by key |
| 3 | INVEST-shaped | **✅** **independent** (the only ticket in this epic that is), negotiable, valuable, estimable, small, testable by inspection |
| 4 | acceptance testable and measurable | **✅** seven criteria: file exists with `status: accepted`, ≤ 2 changed lines in `ADR-0007`, a `git log -S`-datable verbatim quotation, ≥ 3 options each with four named costs, `D2`+`D7` present, `grep` reads `true`, zero `src/` and zero `package.json` lines |
| 5 | dependencies known | **✅** the blocker is named as an escalation with its holder (the owner) and its author (Architect/Design); nothing else blocks or is blocked |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-007` triggered and explicitly stated as *unmeasurable until this lands*, with the obligation narrowed to defining the window; security triggered at the decision with a falsifiable threshold for this ticket's own diff |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P1`, with the reason it is not `P0` stated |
| 10 | no major unresolved blocker | **⚠️⚠️ TWO, and both are the point of the ticket.** **(a) THE OWNER HAS NOT NAMED A CHANNEL.** No agent may name one on his behalf. **(b) The epic's own text asserts `npx` in four places**, so the epic and `ADR-0007` currently disagree in writing — recorded on the `NFR-007` row since 2026-08-06 and still open |

**Why this ticket is not inflated to look ready.** Items 1–9 are genuinely clean because the *work*
is fully specified; item 10 fails on a fact no amount of ticket-writing changes. **A `10/10` here
would be a lie about who holds the decision.**
