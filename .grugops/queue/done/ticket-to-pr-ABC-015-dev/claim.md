---
task: ticket-to-pr-ABC-015
subtask: engineer-abc015-implement
role: software-engineer
claimed_at: 2026-08-08T18:31:04Z
claimed_by: software-engineer
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
self-stamped.** The gates this role runs are real and their output is recorded verbatim, but a green
`npm test` run by the engineer is not a §14 gate verdict and is not dressed up as one. No derived
`index.md` / `index.jsonl` was hand-faked, because the renderer that produces them does not exist
here.

## Read before acting

`.grugops/context/ticket-to-pr-ABC-015/notes/` holds SIX notes and all six were read in full at the
source before any code was written: the two Orchestrator `decision` notes (the routing and the pull),
the BA/PM `observation` (the source re-check), the two BA/PM `decision` notes (the two acceptance
corrections, and the promotion), and the BA/PM `artifact-ref`.

Then, deliberately NOT on their authority: `plans/tickets/ABC-015-glyph-mode-selection.md` line by
line **including its `CORRECTED IN PLACE 2026-08-08` block**, `src/render.ts` on this branch,
`src/render.test.ts` for the house test style, `plans/board.md`, `plans/traceability.md`,
`plans/nfr-catalog.md` (`NFR-007`), `AGENTS.md`, `.grugops/factory.config.json`, `package.json`,
`tsconfig.json` and `biome.json`.

**The acceptance criteria were RECOUNTED at the source rather than read off the ticket's own
Definition-of-Ready line** — the failure mode this task has already produced twice. The corrected
`## Acceptance` section holds **nine input tuples plus two session criteria = eleven**, which is what
the ticket now claims. The count is right this time; it was checked anyway.

---
completed_at: 2026-08-08T18:46:00Z
outcome: IMPLEMENTED — ABC-015 moved In Development -> In Review, the one board move this role
  owns. In Development 1/3 -> 0/3, In Review 0/3 -> 1/3; no limit approached, no override taken.
  NOTHING MERGED, NOTHING DEPLOYED — a human holds both.

  THREE NEW FILES, NO EXISTING FILE UNDER src/ TOUCHED. src/glyph-mode.ts (122 lines, 32 of them
  code), src/glyph-mode.test.ts (15 tests), src/glyph-mode.nfr.test.ts (3 tests). Verified rather
  than asserted: `git diff --numstat main -- src/` lists only the three, and every pre-existing src/
  file is byte-identical to merged main at f1743a3. A NEW module rather than an addition to
  render.ts, because render.ts's header records that it reads no isTTY and no process.env and epic
  acceptance 4c stands on that.

  THE ONE STRUCTURAL CHOICE THE TICKET LEFT OPEN IS DECIDED: the session's cached value lives in the
  CLOSURE beginGlyphModeSession returns. That is what lets acceptance criterion 10 (the RULE reads no
  ambient global) and NFR-007's bar (the SESSION ACCESSOR may read process.stdout.isTTY and
  process.env) hold at the same time. A module-level memo was rejected — it needs an exported reset,
  and that export is the one thing able to break the session-constant promise. A value the caller
  merely holds was rejected — it pushes the once-ness back to EPIC-006, the seam BA/PM closed onto
  this ticket, and makes criterion 11 unfalsifiable again.

  GATES AS THEY RAN, NOT AS THEY WOULD READ BETTER: lint exit 1 THEN exit 0 after ONE autofix pass
  (FORMATTING ONLY, quality.lint.autofix is true, self-fix attempt 1 of 2 and one attempt unused),
  typecheck exit 0, npm test 271/271 on 13 files, build exit 0. Skip count 0 by the AGENTS.md
  command. src/glyph-mode.ts at 100% on all four coverage axes. The 253-on-11 baseline was re-derived
  by arithmetic on this run rather than inherited from ABC-014's note, and the two agree.

  21 MUTANTS RUN AND ALL 21 DIED, including the ticket's own NAMED mutant (the session re-probing
  the environment on every call — killed ONLY by criterion 11) and the win32 rule smuggled back in
  (killed ONLY by criterion 9, which is why that test stubs process.platform instead of repeating
  row 5). TWO SURVIVED THE SUITE AS FIRST WRITTEN AND THE SUITE WAS FIXED RATHER THAN THE RECORD: a
  session hardcoding isTTY, and one forwarding only LANG. BOTH PASS ALL ELEVEN ACCEPTANCE CRITERIA,
  because criteria 10 and 11 are written over ambients where isTTY and the locale AGREE. The suite
  now isolates each signal; THE CRITERIA STILL CANNOT, and that gap is handed to QE and BA/PM rather
  than closed here — amending acceptance criteria is not this role's. src/glyph-mode.ts was verified
  byte-identical to a pre-campaign copy afterwards.

  ONE BEHAVIOUR THE NINE TUPLES NEVER SPECIFY WAS DECIDED BY THIS ROLE AND IS FLAGGED IN FOUR PLACES:
  an EMPTY locale variable counts as UNSET and precedence falls through. POSIX reads it that way, and
  so does this ticket's own row-4 rationale ("unset ... carries no information; treating it as a
  negative signal would smuggle the platform rule back in through the side door"), which is equally
  true of LANG=. Recorded at `confidence: medium` — it is an inference from an adjacent rationale,
  not a specification.

  NO FINDING WAS WRITTEN. There is no §14 gate in this install to issue a §14-gate#<id> stamp and
  context.human_admission is off, so no human:<name> stamp exists either. The gates above are real
  commands with real output, and they are NOT dressed up as a gate verdict — Security/NFR still owns
  that. Nothing is self-stamped.

  FLAGGED, NOT FIXED — NEITHER IS THIS SUBTASK'S: (1) the tracked coverage/ directory is stale by two
  merged tickets (no render.ts.html from ABC-014, no history.ts.html from ABC-012) and was restored
  byte-identically after a --coverage run touched it; (2) plans/traceability.md's ABC-015 row has
  ELEVEN cells against a TEN-column header, and it did BEFORE this subtask edited it (checked at
  HEAD) — a raw unescaped `|` inside a TypeScript union type in the Status cell. Left as written,
  because escaping it means editing another role's recorded audit text.
moved: pending/ -> claimed/ticket-to-pr-ABC-015-dev/ -> done/ticket-to-pr-ABC-015-dev/ — ALL BY HAND
  (no scripts/claim.js in this install; the claim dir was created with a plain mkdir, still atomic
  and still EEXIST on a second writer).
