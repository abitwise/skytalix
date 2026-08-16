---
id: ABC-068
title: The shared helpers in `src/cli.test.ts` became infrastructure without contracts — `advertisedTextOf` returns garbage where its sibling throws, and the comment above them says TWO where there are FOUR
status: backlog
column: Backlog
size: XS
priority: P2
epic: —
feature: —
---

# ABC-068 — two callers remember an unwritten precondition; the third will not

> **Cut 2026-08-16 by BA/PM** (task `refinement-abc065-wording`, Workflow 07) out of the guard hop's
> `G9` + `G11` and QE's `Q2` / `Q6`, **on the Orchestrator's explicit ruling of 2026-08-16**
> (`.grugops/context/pull-abc065-066-2026-08-16/notes/…-rulings-on-g8-through-g12-…`): *"these are one
> defect — the helpers became shared infrastructure without the documentation that makes shared
> infrastructure safe — and they get ONE ticket, cut by BA/PM. I am not folding a 'tiny comment fix'
> into an unrelated hop."*
>
> **The ruling's second half is the point of this page: NOBODY SNEAKS THE FIX IN.** A one-line comment
> is exactly the size of change that gets waved through as a drive-by, and the last hygiene hop did
> wave one through and confessed it. This ticket exists so the divergence is **decided**, in writing,
> by a hop that was sent to decide it. **`ABC-066`'s and `ABC-065`'s pages are NOT edited and no
> criterion of either is re-opened.**

## Problem

*User*: the next engineer who writes an assertion in `src/cli.test.ts` — the file every CLI guard now
lands in — and reads a helper's doc comment to decide how to call it.

*Pain*: **two sibling helpers have opposite failure contracts and neither says so.**

| helper | on bad input | its own doc comment |
|---|---|---|
| `usageLineOf` (`:180`) | **throws** — *"a build that refused in silence would hand every assertion below an empty string to be satisfied by"* | states the throw, in a shouted comment |
| `advertisedTextOf` (`:193`) | **returns garbage, silently** — `indexOf` yields `-1`, so the expression degrades to `slice(SEPARATOR_FORM.length - 1)` | *"What the usage line offers: everything after the separator the criterion names"* — **which sounds total, and is not** |

It has **two callers today** (`:867` in `ABC-066`'s block, `:923` in `ABC-065`'s), and QE judged both
**SAFE** — each independently asserts `toContain(SEPARATOR_FORM)` on the exact value it then passes.
**That is the whole defect: safety rests on both authors having read the same warning note.** QE's
words, seconded by the guard hop at `MEDIUM`: *"Two callers remembering the same unwritten rule is not
a convention; it is two people who both happened to read the same warning note. A third caller that
trusts the doc comment gets a silent wrong answer, and by then the pattern will look like a
convention rather than a requirement."*

**And the sign that says how many there are is already wrong.** `src/cli.test.ts:165` reads *"THESE
TWO HELPERS ARE THE SHARED ONES"* above a module-scope block that introduces **four** shared names —
`SEPARATOR_FORM`, `usageLineOf`, `advertisedTextOf`, `invocationsAdvertisedBy`. Flagged three times
(QE `Q6`, guard hop `G9`, QE again at the `ABC-065` gate) and **correctly left alone every time**: a
hard limit forbade the one hop that could reach it.

*Value*: **one paragraph of prose, written once, closes a `MEDIUM` that is otherwise closed by the
silent wrong answer it predicts.** The two open tickets that will add the third caller are already
cut and sitting in `Backlog` — `ABC-062` writes usage-line assertions in this same file, and
`ABC-061` writes resolver assertions beside them.

## Scope

- **`src/cli.test.ts`, the module-scope helper block only (`:160`–`:214`), COMMENTS ONLY.**
- **State each helper's failure contract in its own doc comment** — `advertisedTextOf` returns a
  meaningless slice and never throws when the separator is absent; `usageLineOf` throws. **Name the
  precondition `advertisedTextOf` requires: the caller MUST assert `includes(SEPARATOR_FORM)` on the
  value it passes, first.**
- **Record WHY the two contracts differ, as a decision rather than a discrepancy** — one sentence
  saying the divergence is deliberate and what it rests on (making `advertisedTextOf` throw would
  change `ABC-066`'s merged semantics; both prior hops refused it for that reason).
- **Repair the count above the block**: either name the shared names it introduces or carry no count
  at all. **A number that has to be maintained is what failed here.**
- **One line at each of the two existing call sites** pointing at the precondition, so the third
  caller meets it where it will copy from rather than only where it will not look.

## Out of scope

- **Any behaviour change. Not one executable line.** Making `advertisedTextOf` throw is the obvious
  "improvement" and it is **forbidden here**: it changes the semantics of a merged, gated block
  (`ABC-066`) whose UAT has not run. If a later hop wants that change it is a new ticket with its own
  gate — say so, do not do it.
- **`ABC-065`'s and `ABC-066`'s ticket pages, and every criterion on them.** Both merged; both gated.
- **`invocationsAdvertisedBy`'s `G10` mismatch** — the expander genuinely cannot serve an `AGENTS.md`
  slot, the guard hop reported it instead of forcing it, and the Orchestrator **discharged it**. It
  needs no repair and gets no sentence beyond the count above the block.
- **Extracting the helpers into a shared module.** Nobody asked, `ADR-0011` clause 4 constrains what
  may be exported from `src/cli.ts`, and a four-function block in one test file is not a module.
- **Any guard, assertion or lint rule that checks a comment.** This ticket writes prose; it does not
  build an instrument to watch prose.

## Acceptance (Given/When/Then)

- **`A1` (both contracts written).** **Given** the delivered helper block, **then** each of
  `usageLineOf` and `advertisedTextOf` states in its own doc comment what it does on bad input —
  **2 of 2**, one saying *throws*, one saying *returns a meaningless value and never throws*.
  *(Today: 1 of 2.)*
- **`A2` (the precondition is named at three sites).** **Given** the diff, **then** the required
  precondition — the caller asserts `includes(SEPARATOR_FORM)` on the value it passes — appears in
  `advertisedTextOf`'s doc comment **and** at both existing call sites (`ABC-066`'s block and
  `ABC-065`'s `A1` row): **3 of 3.** *(Today: 0 of 3 — it exists only in context notes.)*
- **`A3` (the divergence is a decision).** **Given** the helper block, **then** it carries one
  sentence stating that the differing contracts are deliberate and naming what forbids unifying them
  (a merged block's semantics). *(Today: the two contracts differ and nothing says whether that is
  intent or accident.)*
- **`A4` (no count that can go stale).** **Given** the comment at `:165`, **then** it either names
  each shared name it introduces or states no number, and **no numeral describing the block's
  contents disagrees with the block** — **0** disagreements. *(Today: 1 — "TWO" above four names.)*
- **`A5` (zero behaviour change, measured two ways).** **Given** the delivered commit, **then**
  `npm test` reports the **same total it reported before the change** (859 at `ABC-065`'s merge; the
  hop records the number it measured on `main` immediately before, and the two are equal), skip **0**,
  **and** every changed line in `src/cli.test.ts` is inside a comment — **0 changed executable
  lines**, confirmed by reading the diff, not by the suite staying green.
- **`A6` (`ABC-065`'s `A5` property is not broken by this ticket's own prose).** **Given** the added
  comment text, **then** it spells **0** members of `ACCEPTED_ARGUMENTS` and **0** second spellings of
  `SEPARATOR_FORM` — the file-wide count of the literal `npm run chess -- ` stays at **1**. *(The
  merged guard asserts this property about the file; a doc comment naming `--ascii` as an example
  would breach a merged criterion with a comment.)*
- **`A7` (nothing else moved).** **Given** `git diff --name-only <delivered commit>~1 <delivered
  commit>` — excluding `.grugops/`, which is the hop's own process artifact — **then** exactly
  **`src/cli.test.ts`**, one path, **0** files under `src/` other than that test file, **0** new child
  processes (`spawned` still **10**). Suite green, skip **0**.

## Dependencies

- **`src/cli.test.ts` is the busiest file in the repository and two `Backlog` tickets will edit it** —
  `ABC-061` (`P1`) and `ABC-062` (`P1`). **Ordering, not blocking**: this ticket is comments-only and
  cannot conflict semantically, but it must not run *concurrently* with either in the shared working
  tree. **One hop at a time in this file** — that hazard has bitten this session (`G5`).
- **`ABC-062` is the ticket that would have written these helpers.** It has not merged, so `ABC-066`
  wrote them first. If `ABC-062` is pulled before this ticket, **it inherits `A1`–`A3` as its own
  obligation** and this page should be re-scoped to whatever it left undone rather than run twice.
- **Do not harden a helper under a hop that is mid-flight** (`G4`-class, twice-applied). `ABC-065` and
  `ABC-066` are both in `Ready for UAT`; **UAT does not read comments**, so this ticket may run while
  they wait — but it must not run while a *build* hop holds the file.
- **No blocker.** Every input is on disk: both notes, the ruling, and the source.

## Security / NFR triggers

- **`N8-LANE` NOT triggered** — **0 new test files, 0 new files under `src/`, 0 new child processes,
  0 executable lines.** Comments do not run.
- **`NFR-002` not triggered.** No frame path; no production module opened.
- **Security: not triggered.** `ABC-041`'s four clauses: **(a)** no manifest touch; **(b)** the only
  file touched is a `.test.ts`, and its capability surface is byte-identical because no executable
  line changes; **(c)** no network, no write, no spawn added; **(d)** blast radius is one test file's
  comments.

## Test notes

1. **Write the precondition sentence in the negative, from the failure.** *"Returns garbage, not a
   throw, when the separator is absent"* survives a careless reader; *"assumes the separator is
   present"* does not.
2. **The trap `A6` names is real and it is easy to walk into.** The natural way to document a helper
   is with an example, and an example here means an option name. **Use no option name.** The merged
   guards assert the file's vocabulary, so a helpful example reds the suite — and it would red on a
   comment, which is the most confusing red available.
3. **Read the two call sites before writing the doc comment.** They differ: `ABC-066`'s asserts over
   six lines then proves them identical; `ABC-065`'s asserts on the same `const` three lines above the
   call. **The precondition sentence must be true of both**, so state it as *"the value you pass"*,
   never *"the variable"*.
4. **Do not renumber or re-flow the block.** `A5` is checked by reading the diff, and a re-flowed
   comment block makes an honest zero-behaviour-change diff unreadable — which is how a behaviour
   change would get through.
5. **Record the pre-change suite total before touching anything.** `A5` compares two numbers; a hop
   that measures only the after has measured nothing.

## Lane cost — how many test FILES this ticket implies

**Zero**, and zero new assertions. Comments only, in a file that already exists.

## Size and priority rationale

**Size `XS` (1).** Four comment sites in one file, with every word of the analysis already written by
two hops and quotable. **The measurement cost was paid; the writing is a paragraph.** It is not `S`
because nothing has to be located, derived or run beyond one suite invocation.

**Priority `P2`.** Nothing is broken today and both callers are proved safe — this is `MEDIUM` debt,
not a defect. It is `P2` rather than `P3` because it is **time-boxed by its own failure mode**: the
value is entirely in landing before a third caller exists, and the two tickets that add one
(`ABC-061`, `ABC-062`) are both `P1`. **Promote to `P1` the moment either is pulled toward
`Ready for Dev`** — after that, this ticket is documenting a convention instead of preventing a
silent wrong answer.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 10 of 10 — MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the user is the next assertion-writer; both contracts quoted from source; two callers judged SAFE and the reason they are safe named as the defect |
| 2 | scope and out-of-scope clear | **✅** one comment block plus two call-site lines; five fences, first of which is **not one executable line** |
| 3 | INVEST-shaped | **✅** independent of every merge in flight, small, and testable by reading four sites plus one suite total |
| 4 | acceptance testable and measurable | **✅** 2 of 2 contracts, 3 of 3 precondition sites, **0** stale numerals, **0** changed executable lines, **0** accepted-argument spellings, **1** path |
| 5 | dependencies known | **✅** the two `P1` tickets that touch this file, the one-hop-at-a-time rule, the `ABC-062` re-scope instruction, and the `G4` mid-flight lesson |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` untriggered at **0** files / **0** spawns / **0** executable lines; four security clauses answered on the byte-identical capability surface |
| 7 | test notes present | **✅** five, including the `A6` example trap and "measure the before, not only the after" |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P2` with the promotion trigger named and dated to a specific event |
| 10 | no major unresolved blocker | **✅** the one question a hop could stall on — *should `advertisedTextOf` throw?* — is **answered in `## Out of scope`: no, and not here.** Nothing waits on anybody |
