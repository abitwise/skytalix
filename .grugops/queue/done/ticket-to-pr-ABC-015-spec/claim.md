---
task: ticket-to-pr-ABC-015
subtask: bapm-abc015-spec-gaps
role: ba-pm
claimed_at: 2026-08-08T19:21:00Z
claimed_by: ba-pm
method: MANUAL-BY-HAND
---

Claimed BY HAND. Checked at the source rather than taken from the subtask file's word: `ls scripts`
returns `No such file or directory`, so there is no `scripts/claim.js` and Workflow 17 step 2's
atomic `claimTask` could not be executed. The claim directory was created with a plain `mkdir` —
still atomic, still `EEXIST` on a second writer — and this registry record written into it. Queue
width is 1 and no contention was possible, so the claim is degenerate. Recorded rather than glossed,
exactly as every prior subtask on this board recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-015/notes/` in the schema's exact shape. **No `finding` is
written — none is admissible without a §14 gate to issue a `§14-gate#<id>` stamp, and
`context.human_admission` is `off`, so no `human:<name>` stamp is available either. Nothing is
self-stamped.** No derived `index.md` / `index.jsonl` was hand-faked, because the renderer that
produces them does not exist here.

## Read before acting

`.grugops/context/ticket-to-pr-ABC-015/notes/` holds SIXTEEN notes and all sixteen were read in
full, in `at` order, before any judgement was formed: three Orchestrator `decision` notes (routing,
the pull, the reversal that put this subtask before the Security/NFR gate), one Orchestrator
`observation` (gates re-run, one flagged defect disproved), this role's own four notes from the
`Backlog` exit earlier today, five Software Engineer notes, and four QE/E2E notes.

Then, deliberately NOT on any of their authority: `plans/tickets/ABC-015-glyph-mode-selection.md`
line by line including both `CORRECTED IN PLACE` blocks, `src/glyph-mode.ts`,
`src/glyph-mode.test.ts`, `plans/board.md`'s `In Security/NFR` column, `plans/traceability.md` row
`ABC-015`, `AGENTS.md`, `.grugops/factory.config.json`,
`agent-factory/checklists/definition-of-ready.md` and `agent-factory/workflows/07`, `16` and `17`.

**Nothing was taken on trust, and this subtask's own instruction said why: this task has already
produced one confirmed miscount (the Orchestrator's, which this role caught) and one flagged
non-defect (the Engineer's traceability flag, disproved twice).** Every claim ruled on below was
re-derived by measurement — see the `observation` note.

---
completed_at: 2026-08-08T19:35:00Z
outcome: |
  FOUR ACCEPTANCE CRITERIA AMENDED ON ABC-015, ELEVEN -> FIFTEEN. NO COLUMN EXIT TAKEN — the
  ticket stays in In Security/NFR, exactly as the subtask required, and the In Security/NFR exit
  remains Security/NFR's alone. No WIP number moved on any column.

  NO CODE CHANGE IS OWED AND NO QE RE-RUN IS OWED. Every one of the four amendments RATIFIES the
  delivered implementation, and each is already pinned by a test that exists and passes today.
  Established by measurement, not by inspection: the delivered rule and session satisfy all four
  new/amended criteria, and each new criterion EXCLUDES the mutant it was written against.

  ITEM 1 (THIS ROLE'S OWN CORRECTED SECTION) — UPHELD, AND IT IS WORSE THAN REPORTED. Criteria 10
  and 11 do not merely happen to be blind to a single-signal session: measured over all 11,232
  instantiations the criterion's own wording admits, criterion 11 kills the hardcoded-isTTY session
  in 2,592 of them and admits it in 8,640 — it is UNDER-DETERMINED, two readings of one criterion,
  the exact defect this role ruled against on this ticket seven hours ago. Worse, TWO real defects
  are excluded by NO reading at all: a session that DROPS THE FLAGS (--ascii silently ignored) and
  a LAZY session. Fixed by ADDING criterion 15 rather than widening 10/11 — widening them would
  repeat the overload that produced this defect.

  ITEM 2 — UPHELD, with QE's characterisation sharpened. No criterion pinned the LC_CTYPE rung, and
  both reordering mutants pass all nine tuples (measured). But criterion 6's job is the spelling
  tolerance and it does that job; the real fault is that the criteria never stated the rung at all,
  plus a silent-variable convention the file used two ways. Fixed with two new tuples and ONE
  sentence in the lead-in — criterion 6's text is untouched.

  ITEM 3 (THE ONE THAT COULD CHANGE CODE) — THE ENGINEER'S RULING IS RATIFIED, NOT OVERTURNED. An
  empty locale variable counts as UNSET. Evidence: (a) this ticket's own row-4 rationale forbids
  turning a content-free variable into a negative signal; (b) POSIX XBD 8.2's "defined and not
  null", VERIFIED ON THIS MACHINE — `env -i LC_ALL= LANG=en_US.UTF-8 locale` reports
  LC_CTYPE="en_US.UTF-8", so the empty LC_ALL fell through, while LC_ALL=C won; (c) the product
  value statement — the literal reading freezes precedence at the first rung and hands ASCII to a
  UTF-8 terminal whenever a CI image or shell wrapper exports LC_ALL=. Now SPECIFIED (one table
  bullet, one tuple) instead of inferred, so it stops being an unmarked judgement call.

  A FOURTH ITEM WAS FOUND AND IS NAMED AS A FOURTH, NOT SMUGGLED INTO THE THREE: no criterion could
  ever exclude a LAZY session, under any reading. Epic acceptance 2b is "decided exactly once,
  BEFORE the first frame" and this role ruled that once-ness onto THIS ticket on 2026-08-08 —
  owning it means stating it. Criterion 11 amended by one clause to pin the decision to session
  begin. It kills the lazy session and nothing else; the delivered code is already eager.

  NOT DONE, DELIBERATELY: src/ untouched (`git diff --stat -- src/` empty against the QE tip), no
  test edited or added, no criterion renumbered (the whole record cites them by number — the four
  new ones are APPENDED as 12-15), no other role's notes edited, no ticket moved, no board WIP
  changed, no other ticket/epic/ADR/NFR row touched, and NO `finding` written. NOTHING MERGED,
  NOTHING DEPLOYED — a human holds both.
moved: pending/ -> claimed/ticket-to-pr-ABC-015-spec/ -> done/ticket-to-pr-ABC-015-spec/ — ALL BY
  HAND (no scripts/claim.js in this install; the claim dir was created with a plain mkdir, still
  atomic and still EEXIST on a second writer). The whole claim directory moves, keeping this
  registry record beside the subtask file — the shape done/ticket-to-pr-ABC-015-qe/ already uses.
