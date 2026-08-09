---
id: 20260809T150310Z-ba-pm-decision-ae3dd4c9
kind: decision
by: ba-pm
at: 2026-08-09T15:03:10Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - ABC-010
  - ABC-018
  - ABC-022
  - A7
  - A11
  - A12
  - NFR-001
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - plans/traceability.md
  - plans/board.md
  - agent-factory/workflows/07-backlog-refinement.md
  - agent-factory/checklists/definition-of-ready.md
supersedes: 
---

# `A11` IS MET. The `⚠️` marker is retired, three further stale statements are corrected, and one new gap is named rather than fixed

The narrow question this hop was given: **is `A11` satisfied, on this role's own instruments?** The answer is
**yes**, and the marker is retired on that basis alone — not on QE's table and not on the Orchestrator's
rebuild. The evidence is in the two companion `observation` notes and is not restated here.

**Why this hop existed at all, since it is the substance of the decision.** QE closed `A11` in tests and left
the marker **byte-identical on purpose**, reasoning that the failure it had just repaired is *a role certifying
its own sample as a dimension*, so the role that wrote the rows must not also stamp the criterion satisfied.
The Orchestrator declined it too, on a limit it had written into this role's first subtask file and with three
verification errors of its own on this ticket arguing against its unchecked judgement being last. **Both were
right, and the seam earned its keep twice over here:** the independent check confirmed the verdict *and* turned
up a fourth open dimension neither role had looked for. A self-certified marker retirement would have shipped
that hole silently.

## 1. `A11` — MET. Marker retired.

Measured, not read: **17 mutants, 12 killed, 4 survived, 0 verdict mismatches, 0 broken builds**, one OS
process per tree state. All **nine** single own-piece-type admissions die, and the three that previously passed
the **entire** net die to `A11`'s rows **alone** (acceptance 33/33, hardening 32/34). The **four**
behaviour-equivalence controls survive **371/371**, so the rows pin behaviour and not implementation shape.
`A11`'s exhaustiveness clause holds on this role's own `parseFen` domain probe — the domain is exactly six
types, both tables are complete with nothing extra, all 22 rows re-derived with **zero labels lying about their
own FEN**, all four rights and both sides to move in each table, every type in at least two configurations. And
the quantifier **fires**: three deliberate corruptions of the suite file all go red.

**What was cleared, and nothing beyond it:**

- the `⚠️ NOT YET SATISFIED BY THE SUITE` marker in `A11`'s own header;
- the `## Acceptance` preamble sentence *"`A11` is NOT YET SATISFIED BY THE SUITE and this ticket may not be
  closed as though it were"*;
- the second correction block's item 8 heading claim (**struck, not deleted** — `~~it is NOT YET MET BY THE
  SUITE~~ — MET since QE's second hop`) with a dated amendment closing the item. **The historical ruling is
  left unedited: it was true when written**, and this ticket's convention is to amend with a date rather than
  rewrite the record. The *"roughly nine rows"* estimate came in at **fourteen**, and QE's reason for the
  difference is measured rather than stylistic;
- the `## Definition of Ready` amendment's live claim that *"every criterion is currently SATISFIED"* is not
  true, by appended dated amendment. **No tick was flipped** — the *acceptance measurable* row was already ✅
  and Definition of Ready never carried "currently satisfied".

**Rejected alternative: clear the two markers and nothing else.** That is the literal instruction and it was
tempting because it is smaller. Rejected because a reader would then meet a retired marker in `A11` and, 600
lines later, a Definition-of-Ready block still asserting the shortfall — the ticket contradicting itself on
the exact question this hop was convened to settle. A stale statement is stale wherever it sits.

## 2. The `## Acceptance` preamble's tense — reframed once, in one place

*"Each criterion below is a currently-failing test that must go green ... the parenthetical is the measured
behaviour on `main` today."* Written before the fix existed, and **"today" stops being true the moment this
branch merges** — which is the next step on this ticket. The parentheticals are now pinned to what they
actually measured: **merged `main` at `aad6d48`, `src/moves.ts` md5 `fb4fa40934e768dffeaeed0b43548842`** (the
pre-fix digest, verified at the source by `git show main:src/moves.ts`), and labelled the defect's record
rather than a claim about the current tree, with the branch-tip state stated beside them (**371/371 on 16
files, skip 0**, re-run by this role). **No criterion, count, FEN or parenthetical was edited.**

**Rejected alternative:** chase every *"today"* and *"fail today"* in the file — `## Test notes` shape 1 and
shape 3 both carry the same tense, and shape 3 quotes a *"356 tests"* figure whose vintage has passed.
Rejected as a rewrite masquerading as a correction: one dated statement at the head of `## Acceptance` fixes
the reading of all of them, and `## Test notes` was left **byte-identical** rather than edited on a hop whose
mandate was a verification. **Named here rather than left silent** — that residue is real and it is a judgement
call, not an oversight.

## 3. The new gap — NAMED, and the false clause behind it corrected

`A11`'s enemy-colour **exclusion** is measurably false for two piece types: enemy `KNIGHT` and enemy `PAWN` on
either home square **survive 371/371 with the harm live**, while enemy `KING`/`QUEEN`/`ROOK` are genuinely
masked and enemy `BISHOP` is killed by `A5` row 3 and `A6` row 4. Full map in the companion note.

**No criterion was added, no test row was written, no board move was taken.** What I did do is correct the
clause, because as written it read *"so nobody adds a row for them"* — **a false instruction pointed at exactly
the four rows that are missing**, and it would have survived the merge. Correcting a measurably false statement
in this role's own section is not the same act as adding a criterion, and the distinction is the whole reason
this hop was allowed to touch `## Acceptance` at all.

**Rejected alternative: add `A13` (or four rows to `A11`) here and now.** Refused. It is a fourth hop's work
opened inside a verification hop, the rows are QE's file, and this board's own rule is that the role which
finds a gap does not get to close it in the same breath. **Second rejected alternative: say nothing and clear
the marker anyway.** Refused harder — the ticket is about a documented invariant that was not an invariant, and
ending it by quietly retiring a marker over a measured hole would be the same failure a third time.
**Third rejected alternative: hold the marker hostage to the new gap.** Refused: `A11` is met on its own terms
and holding it would misreport a satisfied criterion as unsatisfied, which is the mirror of the error this
ticket exists to fix.

## 4. What this hop refused to touch

`src/` — **not one file**, production or test: `git status --short -- src/` empty, `src/moves.ts` still
`0e247853ab2c05887c76105ff83d8621`, **0 of 14** pre-existing test files modified (each diffed individually
against `main`, not inspected). `plans/board.md` — **not edited**; `ABC-009` stays in `Ready for UAT` **1/4** and
no board move is this role's. `ABC-022`, `ABC-010`, `ABC-011`, `ABC-018` and `plans/nfr-catalog.md` — **not
edited**. `## Implementation`, `## QE`, `## QE — second hop`, `## Security / NFR`, `## Test notes`,
`## Size and priority rationale`, `## Scope`, `## Out of scope`, `## Reproduction` and the frontmatter — **all
byte-identical**; the seam QE and Security/NFR honoured by not editing `## Acceptance` is honoured back.
`A7`, `A12`, guard ordering and `NFR-001` — **not re-litigated**, as instructed. The `plans/traceability.md`
11-cell report — **stays closed**; this hop's own edit was verified the corrected way, every one of 31 rows at
ten cells counting **unescaped** pipes before and after, exactly one row changed. **Nothing merged, nothing
deployed.** Size `S` and priority `P1` unmoved — nothing here adds a requirement.

**`ABC-018`'s frontmatter defect** (board says `Done`, its own ticket says `ready-for-uat`) — **no ticket cut,
and that is a judgement, not an omission.** It is a one-line data defect in a closed ticket's own frontmatter,
already named in the Orchestrator's routing note as the step to get right when `ABC-009` closes, and this
ticket's close is the next thing that happens. A ticket to carry it would cost more than the fix and would
still be open when the fix landed. **If `ABC-009`'s close also misses the frontmatter step, that is the point
at which it stops being a one-off and deserves a process item** — recorded so the next reader has the trigger
rather than the judgement.

## What this decision does NOT establish

- **That the criteria set is complete.** It is not, and this hop is the fourth consecutive proof of it. `A11`
  is closed over piece type; the occupant's colour is measured **open**; two constants QE named remain
  unpursued by anyone.
- **That `ABC-009` may be closed.** `Ready for UAT` is not `Done`. UAT is deferred to `EPIC-006` and
  explicitly NOT passed on every ticket this project has shipped, and that ruling is not this role's.
- **Any `NFR-001`, perft, coverage or throughput figure.** None measured by this role at any of its three
  hops.
- **A terminal Workflow 05 verdict.** No §14 gate exists in this install; **no `finding` was written and
  nothing is self-stamped**. `context.human_admission` is `off`, so no `human:<name>` stamp exists either. No
  `index.md` / `index.jsonl` was hand-faked — the renderer is absent here.
