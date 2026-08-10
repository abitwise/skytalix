---
task: ticket-to-pr-ABC-013
subtask: ticket-to-pr-ABC-013-qe
by: qe-e2e
at: 2026-08-10T12:56:51Z
completed_at: 2026-08-10T13:25:00Z
method: MANUAL-BY-HAND
outcome: |
  QE VERDICT **PASS**. **ZERO defects in `src/san.ts`. FIVE gaps in the CRITERIA.** The two counts
  are reported separately and never conflated: the delivered build is correct, and the acceptance
  net misses a whole defect class. `ABC-013` MOVED `In Review` -> `In Security/NFR` (In Review 1/3
  -> 0/3, In Security/NFR 0/2 -> 1/2); the `In Security/NFR` exit is Security/NFR's and was NOT
  taken. NOTHING MERGED, NOTHING DEPLOYED.

  **THE 52-ROW TABLE HAS AN EXTERNAL ORACLE FOR THE FIRST TIME AND IT DISPUTES NOTHING.** Three hops
  in a row recorded that no external SAN implementation was available here. That premise was wrong:
  this machine has network access. `chess.js@1.4.0` was installed INTO THE SCRATCHPAD, OUTSIDE THE
  REPOSITORY — `package.json` and `package-lock.json` byte-unchanged, `git diff --stat` empty, NO
  REPO DEPENDENCY ADDED. It disputes NONE of the table's expected strings, and `src/san.ts` matched
  it on **649,556 SAN strings over 8,435 positions in BOTH call forms with ZERO mismatches**.

  **A SECOND ORACLE, BUILT TO A DELIBERATELY DIFFERENT SHAPE** (minimal-unique-qualifier SEARCH
  rather than shares-file/shares-rank flags; capture read from the BOARD rather than from
  `move.captured`; castle side from the king's TRAVEL DIRECTION rather than a destination-file
  constant): **323,694 renders, 0 divergences, 0 purity failures**. And an out-of-tree SAN MATCHER
  resolved every emitted string back to EXACTLY ONE legal move and the RIGHT `Move` OBJECT — that is
  `ADR-0004` clause 2b's round-trip identity, run ONE EPIC EARLY and entirely outside `src/`. No
  `parseSan` was written and nothing was proposed for the module.

  **`A7`'s `Ne4` IS UPHELD.** The Engineer named it as the one row where a reader could disagree with
  the RULE rather than the arithmetic. Disambiguation over LEGAL rather than pseudo-legal moves is
  what `## Scope` says, what the external implementation does, and what the PGN text supports. That
  risk is closed and is no longer resting on a grugops reading.

  **40 MUTANTS: 31 KILLED, 9 SURVIVED — 4 provably equivalent CONTROLS and FIVE GENUINELY WRONG
  BUILDS THAT PASS ALL 22 CRITERIA AND ALL 652 TESTS.** All five are ONE class: OVER-QUALIFIED
  (non-minimal) disambiguation — ROOKS (`Ra1b1` for `Rab1`), BISHOPS (`Bc4d5` for `B4d5`), qualified
  CAPTURES (`Nb6xd5` for `Nbxd5`), every BLACK move, and BLACK on the rank rung (`Nc3e4` for
  `N3e4`). Each was confirmed wrong by the EXTERNAL oracle too (2,444 / 100 / 416 / 2,288 / 60
  mismatches). **ROOT CAUSE IN ONE SENTENCE: minimality is asserted ONLY by the acceptance table,
  and the table exercises it on WHITE KNIGHTS and WHITE QUEENS ALONE** — no criterion disambiguates
  a rook or a bishop, no criterion pins a qualified capture, and ALL 18 ACCEPTANCE FENs ARE WHITE TO
  MOVE. The two table-free properties structurally cannot see it: an over-qualified string is still
  DISTINCT and still of the SAN GRAMMAR.

  **FOUR FURTHER MUTANTS PASS EVERY ONE OF `A1`-`A21` AND DIE ONLY ON THE ENGINEER'S INJECTIVITY
  PROPERTY** — black castle side by absolute square, the disambiguator skipped on captures, the `x`
  dropped for black, and rooks under-qualified. That property is FAR MORE LOAD-BEARING than the note
  introducing it claimed (it was reported as killing two mutants the table also killed) and must not
  be removed, narrowed, or have its corpus shrunk. The Engineer's two table-invisible mutants were
  reproduced independently and a third of the same shape was found; `src/san.nfr.test.ts` earns its
  place.

  **ONE COUNTING DEFECT, NO CODE IMPACT: THE TABLE HOLDS 68 EXPECTED STRINGS (63 DISTINCT), NOT 52**
  — 48 rows plus `A1`'s 20-string set, counted mechanically out of `src/san.test.ts` and re-counted
  by hand from the ticket. All 68 appear in the ticket and the transcription is exact. `52` is
  BA/PM's out-of-tree harness count and it travelled into the ticket, four notes, the board and the
  trace. Recorded rather than quietly corrected — the same shape as BA/PM's own "seventeen ->
  eighteen" recount.

  **GATE RE-RUN BY QE ON THE BRANCH TIP:** lint exit 0, typecheck exit 0, build exit 0, `npm test`
  **652/652 on 20 files**, SKIP COUNT **0**. Coverage of `src/san.ts` **100% lines / 100% statements
  / 100% functions / 95% branches** — the two uncovered branches are `noUncheckedIndexedAccess`
  fallbacks, NOT impossible-scenario handling. **TEST-INTEGRITY CHECKER EXIT 2** — the checker exists,
  `.grugops/test-skips.md` does NOT, so it could not run; recorded as an ERROR and never as a pass,
  pre-existing and not introduced here, with the skip count independently measured at 0.

  **`src/san.ts` md5 `cbcc3be37c21414d16e8e6b4d0c68959` BYTE-IDENTICAL before the first mutation and
  after the last**, across three separate mutation passes. **NO TEST WAS ADDED OR CHANGED BY THIS
  HOP** — the `src/` diff is still THREE NEW FILES, +628/-0, exactly as the subtask required, so the
  five criteria gaps are REPORTED AND NOT CLOSED. The recipe is in the verdict note: one property
  asserting no SHORTER qualifier would also be unique closes all five plus three more, and it is
  BA/PM's ticket to cut, not hidden scope for this hop.

  **ONE INSTRUMENT FAULT OF MY OWN, RECORDED:** the first mutation pass called `Q02` (pseudo-legal
  rivals) EQUIVALENT, which is false — my discriminator supplied the `legal` list on every call and
  never entered the branch the mutant lives in. Fixed to compare BOTH call forms and the whole
  40-mutant pass was re-run from scratch; every number reported is from the re-run.

  **WHAT I DO NOT CERTIFY:** that `src/san.ts` conforms to the FIDE/PGN SPECIFICATION TEXT (agreement
  with a widely-used library is not the standard); that the criteria set is complete (five found here,
  fourteen on `ABC-023` — 40 mutants is a floor); that `N1`-`N4` hold on any machine (I measured NOT
  ONE microsecond — that is Security/NFR's step and the reason the ticket moved to that column);
  that over-qualification is harmless as a PRODUCT property for `ABC-016`/`ABC-017`; or that
  `ABC-013` may leave `In Security/NFR` — that exit is Security/NFR's.
moved: pending/ -> claimed/ticket-to-pr-ABC-013-qe/ -> done/ticket-to-pr-ABC-013-qe/ — ALL BY HAND.
---

Queue claim record (CLAIM-01/CLAIM-02). Atomic `mkdir` of this directory returned exit 0, so this
role is the first and only writer; a second writer would have taken `EEXIST`.

`scripts/claim.js` does not exist in this install — re-checked at the source rather than inherited
from the subtask brief or from the claim records already under `done/`: there is no `scripts/`
directory in the repository and none under the kit root. The claim was therefore taken by hand with
a plain atomic `mkdir(2)`, the same primitive `claimTask` relies on, so the exactly-once property is
unchanged. The `pending/ → claimed/` transition was a `git mv` (rename(2)), which is the atomic
rename Workflow 17 step 3 names.

`pending/` held exactly one file and `claimed/` was empty when this hop started, so queue width was
1 and no contention was possible: **the claim is degenerate**, recorded rather than glossed. No
stale-claim sweep was owed (`claimed/` was empty), and the sweep is the coordinator's in any case.

Workflow 16's sanctioned writer `scripts/context-io.ts` is likewise absent, and the structured
`mcp__grugops__propose_note` tool is **not** in this session's tool set — checked against the tools
actually available rather than assumed. Notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-013/notes/` in the established layout. **No `finding` is
written**: none is admissible on this task, because there is no `§14-gate` verdict record under it to
issue a `§14-gate#<id>` stamp (`emitVerdict` lives in the absent `context-io.ts`) and
`context.human_admission` is `off` in `.grugops/factory.config.json`, so no `human:<name>` stamp
exists either. The measured results above are recorded as `observation`, the verdict as `decision`,
and the limits as a `claim` carrying `confidence: UNKNOWN - verify` — the honest degrade Workflow 16
step 4 names. No `index.md` / `index.jsonl` is hand-faked.

`at` and `completed_at` are taken from `date -u`, never from a local clock or a test runner's
`Start at` line. This machine is UTC+3: `date -u` read `12:56:51Z` against local `15:56:51 EEST` at
the start of this hop.
