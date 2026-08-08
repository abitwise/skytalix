---
task: ticket-to-pr-ABC-015
subtask: qe-abc015-review
role: qe-e2e
claimed_at: 2026-08-08T18:56:00Z
claimed_by: qe-e2e
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
self-stamped.**

## Read before acting

`.grugops/context/ticket-to-pr-ABC-015/notes/` holds TWELVE notes and all twelve were read in full,
in `at` order, at the source before any test was run: two Orchestrator `decision` notes (routing,
pull), one Orchestrator `observation` (gates re-run + the disproof of one flagged defect), one BA/PM
`observation` (the source re-check), two BA/PM `decision` notes (the two acceptance corrections; the
promotion), one BA/PM `artifact-ref`, two Software Engineer `decision` notes (the closure; the
empty-locale reading), two Software Engineer `observation` notes (the mutation blind spot; the gates
and the NFR bar) and one Software Engineer `artifact-ref`.

Then, deliberately NOT on their authority: `plans/tickets/ABC-015-glyph-mode-selection.md` line by
line including both `CORRECTED IN PLACE` blocks, `src/glyph-mode.ts`, `src/glyph-mode.test.ts`,
`src/glyph-mode.nfr.test.ts`, `src/render.ts`, `plans/board.md`, `plans/traceability.md`,
`plans/nfr-catalog.md`, `AGENTS.md` and `.grugops/factory.config.json`.

---
completed_at: 2026-08-08T19:14:00Z
outcome: |
  VERDICT PASS on ABC-015. In Review -> In Security/NFR, the one board move this role owns.
  In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; no limit approached, no override taken.
  NOTHING MERGED, NOTHING DEPLOYED — a human holds both.

  THE FOUR MANDATORY GATES WERE RE-RUN ON THE TIP BY THIS ROLE, BEFORE AND AFTER THE ADDED TESTS,
  rather than inherited: lint exit 0 (the 2 infos are the pre-existing biome.json notices),
  typecheck exit 0, build exit 0, npm test 271/271 THEN 277/277 on 13 files, skip count 0 both
  times by the AGENTS.md command. src/glyph-mode.ts 100% on all four coverage axes against the 0.8
  threshold. THE ENGINEER'S AND THE ORCHESTRATOR'S FIGURES REPRODUCE EXACTLY, including the
  253-on-11 baseline re-derived by arithmetic on this run.

  THE ORCHESTRATOR'S DISPROOF OF THE ENGINEER'S FLAGGED DEFECT WAS ITSELF CHECKED AND IT HOLDS.
  plans/traceability.md's ABC-015 row: 12 raw pipes, ONE escaped, 11 unescaped, TEN cells — the
  same as the header and every other row, counted by machine on pipes not preceded by a backslash.
  The Engineer's flag is not a defect and the "fix" would remove a correct GFM escape.

  THE MUTANT THE TICKET NAMES BY HAND WAS BUILT AND RUN AND IT DIES — to criterion 11 alone,
  exactly what BA/PM rewrote that criterion to do. The unfalsifiable-criterion correction at the
  Backlog exit was not ceremony.

  A 29-MUTANT CAMPAIGN KILLED 28. THREE MUTANTS PASSED ALL ELEVEN ACCEPTANCE CRITERIA AND ALL 271
  DELIVERED TESTS AND ALL THREE ARE REAL PRODUCTION DEFECTS: (1) the LC_CTYPE rung of the locale
  precedence was never pinned against either neighbour — criterion 6 sets LC_CTYPE ALONE, which is
  THE EXACT ONE-AT-A-TIME SHAPE THIS TICKET'S OWN ## Test notes FORBID IN WRITING; (2) a MISSING
  isTTY property was never constructed, and it is the ONLY shape a non-TTY process presents, so a
  session reading it as a terminal sent Unicode into a pipe while passing everything; (3) a LAZY
  session that memoises on first call satisfied criterion 11 while moving the decision after the
  first frame epic acceptance 2b puts it before. A FOURTH HOLE was in the NFR-007 guard itself —
  node:fs/promises was unspied, so the async twin of a /etc/locale.conf read went green while the
  sync one died.

  CLOSED IN TESTS ONLY. Six tests added (4 conflicting-value precedence rows, 1 absent-isTTY
  session, 1 eager-not-lazy session) and node:fs/promises added to the NFR guard's spied table.
  NO PRODUCTION CODE WAS CHANGED AND NONE NEEDED CHANGING: src/glyph-mode.ts is byte-identical to
  the Engineer's (md5 9c1f4f4e957d4faf3c9cccc49a545185) after 58 mutate-and-restore cycles.

  ONE MUTANT SURVIVES AND IS REPORTED, NOT HIDDEN: dropping the Boolean() coercion on
  process.stdout.isTTY. PROVEN EQUIVALENT — !undefined and !false are both true, so row 3 fires
  identically, and the new absent-property test exercises that exact input and passes either way.
  Not a coverage gap. But the module comment claiming that coercion "is doing real work and is not
  decoration" is FALSE at runtime; flagged as a comment defect and NOT edited (coding rule 9).

  NO E2E WAS WRITTEN AND NONE COULD BE — no CLI entry point until EPIC-006, zero runtime importers,
  AGENTS.md E2E slot UNKNOWN - verify. Reported as a gap rather than filled with a fake; the first
  end-to-end exercise arrives with ABC-018.

  THREE SPEC-LEVEL ITEMS ARE BA/PM's AND ARE NOT DISCHARGED HERE — criteria 10/11 blind to a
  single-signal session, the empty-locale ruling (QE CONCURS with the POSIX reading and did not
  disturb it), and NEW FROM THIS PASS: criterion 6 is itself the one-at-a-time shape the test notes
  forbid, so the CRITERIA under-specify the LC_CTYPE rung. The suite now covers all three; the
  criteria still do not. Amending a criterion is the Backlog exit, not this role's.

  FLAKINESS CHECKED RATHER THAN ASSUMED: five shuffled full-suite runs clean. NO FINDING WAS
  WRITTEN — no §14 gate exists here to issue a stamp and context.human_admission is off. Nothing is
  self-stamped. The kinds used are observation (x2), decision and artifact-ref.
moved: pending/ -> claimed/ticket-to-pr-ABC-015-qe/ -> done/ticket-to-pr-ABC-015-qe/ — ALL BY HAND
  (no scripts/claim.js in this install; the claim dir was created with a plain mkdir, still atomic
  and still EEXIST on a second writer). The whole claim directory moves, keeping this registry
  record beside the subtask file — the shape done/ticket-to-pr-ABC-015-dev/ already uses.
