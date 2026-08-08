---
id: 20260808T193300Z-ba-pm-decision-fe867ecc
kind: decision
by: ba-pm
at: 2026-08-08T19:33:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - ABC-018
  - EPIC-002
  - EPIC-006
  - RISK-005
  - src/glyph-mode.ts
  - src/glyph-mode.test.ts
  - plans/tickets/ABC-015-glyph-mode-selection.md
  - plans/board.md
  - plans/traceability.md
  - 20260808T182200Z-ba-pm-decision-69e00126
  - 20260808T193100Z-ba-pm-observation-84e57d30
supersedes: 
---

# Four criteria amended, ELEVEN → FIFTEEN — including a defect in the section this role itself corrected seven hours ago

The `Backlog` exit's acceptance bar is this role's, and amending a criterion is that exit's act even
when the ticket is not sitting in `Backlog`. **No column was moved and no WIP number changed**;
`ABC-015` stays in `In Security/NFR`, whose exit is Security/NFR's alone.

**No code change is owed and no QE re-run is owed.** All four amendments **ratify** the delivered
implementation, and each is already pinned by a test that exists and passes today.

## Item 1 — criteria 10 and 11 were blind to a single-signal session. UPHELD, and it is worse than reported

**This is the section this role wrote at the `Backlog` exit this morning, and it is ruled on the
measurement rather than defended.** The temptation to grade my own correction generously was real and
the evidence removes the choice.

The two prior reports called the criteria *blind*. Measured, the fault is a different and more
serious class: **criterion 11 never said which ambient values the rewrite uses**, so across the
11,232 instantiations its own wording admits, it excludes a session that hardcodes `isTTY` in **2,592
and admits it in 8,640**. Whether the criterion catches a real production defect depends on which
ambient the test author picks. **Two readings of one criterion is precisely the defect I ruled
against on this ticket seven hours ago** — and my replacement criterion carried it in a new place.

Worse: a session that **drops the flags** — `--ascii` silently ignored, a straight breach of table
rows 1 and 2 — and a **lazy** session are excluded by **no reading at all**, in any of the 11,232.

**Ruled: fixed by ADDING criterion 15, not by widening 10 or 11.** The reasoning matters more than
the fix. Criterion 10's job is that the *rule* reads no ambient global; criterion 11's is that the
*session's value* is decided once. The session's **wiring** — that every signal it is handed or reads
reaches the rule — is a third promise, and this ticket has now produced **four** criteria that passed
for a reason other than the one they were written for. Loading the wiring onto a criterion about the
cache is how a fifth would have been made. Criterion 15 states the wiring directly and is measured by
**six cases, each with exactly one decisive input**; `unicode` is the answer when a signal never
arrives, so an `ascii` expectation can only be produced by a signal that actually travelled.

Measured after drafting rather than assumed: the six exclude the hardcoded-`isTTY` session, the
`LANG`-only session and the flag-dropping session, they do **not** exclude the lazy one (that is
criterion 11's job, kept separate on purpose), and the delivered session passes all six.

## Item 2 — the `LC_CTYPE` rung. UPHELD, with QE's characterisation sharpened

QE's finding holds: both reordering implementations satisfy **all nine** original tuples. But QE's
words were *"criterion 6 is itself the one-at-a-time shape the test notes forbid"*, and that is not
quite where the fault lies, so criterion 6's text is **untouched**:

- **Criterion 6's job is the case-insensitive, hyphen-less spelling, and it does that job.** It was
  carrying a precedence it was never asked to carry — the same pattern as the other four.
- **The real faults are two.** No criterion ever stated the middle rung at all. And bullets are
  silent about variables they do not name while the file uses that silence two ways: under
  "silent = any value" criterion 6 *would* have pinned `LC_CTYPE` > `LANG`, and **criterion 8 would
  be false**, since a UTF-8 `LC_ALL` beats an `ISO-8859-1` `LANG`.

**Ruled:** one sentence in the lead-in fixes the convention for every bullet at once ("a locale
variable a bullet does not name is unset"), and **criteria 12 and 13** state the rung against each
neighbour with conflicting values set at once — the shape the `## Test notes` have demanded in
writing since this ticket was cut, and which no criterion delivered.

## Item 3 — the empty-locale ruling. RATIFIED, in its own note

`20260808T193200Z-ba-pm-decision-f32d5667`, kept separate because it is the one item that could have
changed code. Summary only: ratified on this ticket's own row-4 rationale, on POSIX verified on this
machine, and on the product value statement; specified by a `## Scope` bullet and criterion 14 so it
stops being an inference living in a code comment.

## Item 4 — found here, and named as a FOURTH rather than folded into the three

**No criterion could ever exclude a lazy session** — admitted in all 11,232 of criterion 11's
conforming instantiations, because the criterion requests the mode before rewriting anything. QE
reported this as a suite hole and closed it in tests; the Orchestrator listed three items and this
was not one of them. **It is a spec gap and this ticket in particular cannot leave it to a test.**

Epic acceptance `2b` is *"decided exactly once, **before the first frame**"*. On 2026-08-08 this role
found that `ABC-015`'s scope handed the once-ness to `EPIC-006` while `ABC-018` handed it to
`ABC-015`, ruled that **nobody owning a promise means nobody can test it**, and put it on this
ticket. **Owning a promise means stating it.** A lazy accessor moves the decision to whenever the
first frame is drawn, and any ambient change in that window silently wins.

**Ruled: criterion 11 widened by one clause** — the rewrite may happen before the mode has ever been
requested. Measured: it excludes the lazy session and nothing else, and the delivered session is
already eager by construction, which the Engineer chose deliberately and wrote into the module
header.

## The mechanics, decided rather than defaulted

- **No criterion was renumbered.** The entire record cites them by position — *"dies to criterion 11
  alone"*, *"criterion 9 is the regression guard"*, *"criterion 6 sets `LC_CTYPE` alone"*. The four
  new criteria are **appended as 12–15** instead of filed next to their kin, so every existing
  citation in every note, board comment and trace cell stays true. Grouping beats history nowhere
  near enough to justify invalidating the record.
- **Counted at the source, because this task's signature failure is a count that travelled.** The
  amended `## Acceptance` has **15** bullets, verified by machine on the file after editing: 1–9 and
  12–14 are tuples (**twelve**), 10, 11 and 15 are session criteria (**three**). The lead-in, the
  size rationale, the Definition-of-Ready line, the test notes and the trace row all carry the same
  numbers, and no figure was copied from another figure.
- **Size `S` (2) and priority `P1` are unmoved, checked rather than asserted.** The second pass added
  **no implementation work at all** — every one of its four criteria was already satisfied and
  already tested by code that is byte-identical to what QE passed.

## Every new criterion already has a passing test — which is why nothing is owed downstream

Checked by reading `src/glyph-mode.test.ts`, not assumed: criterion 11 (widened) ← *decides EAGERLY
when the session begins*; 12 ← *LC_ALL beats LC_CTYPE*; 13 ← *LC_CTYPE beats LANG*; 14 ← *falls
through an empty variable*; 15 ← *carries EVERY ambient signal to the rule* (4 rows) + *hands the
flags through* (2 rows). Suite unchanged at **277/277 on 13 files**.

**One cosmetic follow-up is flagged and was NOT acted on:** those tests sit under headings calling
them *beyond* the criteria. After this amendment they **are** criteria 11–15's tests, and
re-labelling is one line per heading — **QE's, not this role's, and not a gate blocker.** This
subtask does not touch `src/`, and the assertions already are the criteria.

## Scope discipline, stated because the temptation was real

Three things were considered and **declined as bloat**: a criterion for the absent-`isTTY` shape
(table row 3 already says *falsy*, and `undefined` is falsy — the specification was right and QE's
test pins it), a criterion for the `Boolean()` coercion (a comment defect in another role's
production file, and behaviour-equivalent by QE's proof), and splitting criterion 15's six cases into
six bullets (one promise, six measurements — six bullets would invite the next reader to satisfy one
and call it done).

## What this decision does NOT do

- **It does not take a column exit.** No board move, no WIP change; `In Security/NFR` is
  Security/NFR's.
- **It does not touch `src/`, any test, `ABC-018`, `EPIC-006`, `EPIC-002`, any ADR,
  `plans/nfr-catalog.md`, or any other role's notes.**
- **It does not re-open the both-flags-true ruling, the merge-order constraint, or the pull order.**
  `ABC-015` still merges with or before `ABC-018`.
- **It does not authorize a merge or a deploy.** The gate binds and humans hold both.

## Recorded honestly

This is a `decision`, not a `finding`. There is no §14 gate in this install to issue a
`§14-gate#<id>` stamp and `context.human_admission` is `off`, so no `human:<name>` stamp exists
either — **nothing is self-stamped and no verified result is claimed.**
