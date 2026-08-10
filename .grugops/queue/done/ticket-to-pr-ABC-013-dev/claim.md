---
task: ticket-to-pr-ABC-013
subtask: ticket-to-pr-ABC-013-dev
by: software-engineer
at: 2026-08-10T12:24:21Z
completed_at: 2026-08-10T12:47:00Z
method: MANUAL-BY-HAND
outcome: |
  `src/san.ts` BUILT with `toSan` ONLY — one export, importing exactly `position.ts` / `moves.ts` /
  `apply.ts` / `legal.ts`, no `parseSan` and nothing that forecloses it. THREE NEW FILES and NO
  EXISTING FILE UNDER `src/` MODIFIED. `ABC-013` MOVED `In Development` -> `In Review` (In Development
  1/3 -> 0/3, In Review 0/3 -> 1/3); the `In Review` exit is QE/E2E's and was NOT taken. NOTHING
  MERGED, NOTHING DEPLOYED.

  GATE (Workflow 05), branch tip: lint exit 0 (after the sanctioned safe autofix, `quality.lint.
  autofix` is true), typecheck exit 0, build exit 0, 652/652 on 20 files, SKIP COUNT 0. `A22` holds on
  all three clauses — green, skip 0, and NO EXISTING TEST MODIFIED (`git diff --name-only --
  'src/*.test.ts'` empty). 625 -> 652 is 27 ADDED tests; the 625 baseline are all still green.

  ALL 20 IN-SUITE CRITERIA A1-A20 PASS AND NOT ONE OF THE 52 EXPECTED STRINGS WAS DISPUTED. Every row
  was re-derived by hand from its FEN against the SAN rules BEFORE any implementation existed, and all
  52 agreed — including the four BA/PM named as most attackable (`Qee1`, `Q1e1`, `Ne4`, `exd6`). NO
  ROW EDITED, NO CODE BENT TO A ROW. THE AGREEMENT IS CORROBORATION AND EXPLICITLY NOT PROOF: it is a
  second hand-derivation by a reader who had already SEEN the table, against no external
  implementation, PGN corpus or specification text, so "the 52 strings match the standard" is still
  `UNKNOWN - verify`.

  RED-BEFORE-GREEN REPORTED WITH ITS ALREADY-GREENS. Six staged inner-loop steps; stage 0 was the
  whole file red on a missing module. A7 and A8 WERE GREEN AT STAGE 1, on a build with NO
  DISAMBIGUATION CODE AT ALL — they kill a WRONG disambiguation, not a missing one, and A4/A5/A6 kill
  the missing one. A18/A19 WERE GREEN VACUOUSLY until stages 6 and 5 respectively. Four of twenty
  claimed as already-green rather than as kills.

  TEN SELF-MUTATIONS OF `src/san.ts` RUN, ALL TEN DEAD — AND TWO ARE INVISIBLE TO THE ENTIRE 52-ROW
  TABLE: a build that IGNORES the supplied `legal` list, and one that runs the mate test on EVERY
  move. Both return byte-identical strings for all 52 rows and die only in `src/san.nfr.test.ts`,
  which is why that file exists. That mutant set is the author's own and is NOT QE's independent hop.

  A21 MEASURED AT `P60` ON THE DELIVERED BUILD, ALL FOUR BARS HOLD: N1 8.76x / 8.73x (bar >= 5x), N2
  0.483 / 0.483 us (<= 0.75), N3 4.228 / 4.220 us (<= 6.5), N4 worst single 10.24 / 10.37 us
  unassisted and 5.82 / 5.70 us supplied (<= 14). Two runs in separate processes agreeing to 0.4%,
  null floor 0.001 us, Apple M3 / Node v24.12.0 / darwin-arm64. N4's unassisted worst is ABOVE the
  reference build's 9.34 us and that is an INSTRUMENT difference (per-move tight loop vs worst of a
  42-move sweep), NOT a slower build — said so rather than letting it read as a regression. The
  in-suite half of A21 is CALL COUNTS, never microseconds, per this project's standing rule.

  TWO TABLE-FREE PROPERTIES ADDED BENEATH THE TABLE over 184 positions (six perft positions + every
  position one legal move away): every legal move of a position renders to a DISTINCT string, and
  every string is of the SAN grammar. Both were green when written — reported as already-green — and
  their non-vacuity was demonstrated by mutation instead.

  BOARD DISCIPLINE: the outgoing `_Updated:` header (5,098 chars) was appended VERBATIM to
  `plans/tickets/history/ABC-013-board-history.md` BEFORE the board header was replaced, byte-checked
  (file grew by exactly the entry + 5,098 + 1) and the `in` test confirmed. Board carries exactly one
  `_Updated:` line and exactly one ABC-013 row. TRACE: one row, four cells (`NFRs`, `Code`, `Tests`,
  `Status`), 33 table lines and 11 unescaped pipes before and after, every added string asserted
  pipe-free and newline-free before writing.

  SEVEN NOTES PUBLISHED: three observation, two decision, one artifact-ref, one claim. NO FINDING —
  none is admissible (no §14-gate verdict record under this task to issue a stamp, and
  `context.human_admission` is `off`). Nothing self-stamped, no index.md / index.jsonl hand-faked.

  NOT CHANGED: ADR-0004 not re-opened, `plans/nfr-catalog.md` not edited and no catalog target moved,
  `src/legal.ts` and the rules core untouched, no ticket criterion / FEN / expected string / bar
  edited, ABC-016 / ABC-017 / ABC-024 / EPIC-002 / EPIC-003 not edited. `memory-bank/30-architecture.
  md` NOT updated and FLAGGED rather than absorbed — ADR-0004 owes it `san.ts` AND `history.ts`, the
  debt predates this ticket, and covering only my half would leave the map half-true.

  WHAT I DO NOT CERTIFY: that the 52 strings match the FIDE/PGN standard; that disambiguating over
  LEGAL rather than pseudo-legal moves is the right rule (it is what ## Scope says, and it is the one
  row where a reader could disagree with the RULE rather than the arithmetic); that the criteria set
  is complete; that N2/N3/N4 hold on other hardware; that `toSan` behaves sanely on an illegal `move`
  (declared undefined, asserted by nothing); and that ABC-013 may leave `In Review` — that exit is
  QE/E2E's.
moved: pending/ -> claimed/ticket-to-pr-ABC-013-dev/ -> done/ticket-to-pr-ABC-013-dev/ — ALL BY HAND.
---

Queue claim record (CLAIM-01/CLAIM-02). Atomic `mkdir` of this directory returned exit 0, so this
role is the first and only writer; a second writer would have taken `EEXIST`.

`scripts/claim.js` does not exist in this install, and that was re-checked at the source rather than
inherited from the subtask brief or from the two prior claim records under `done/`: `ls scripts` in
the repository exits "No such file or directory" (there is no `scripts/` directory at all), `ls` of
`/Users/olgeroeselg/.grugops/agent-factory/scripts` does the same, and a `find` for `claim*` and
`context-io*` across the kit root returns nothing. The claim was therefore taken by hand with a
plain atomic `mkdir(2)` — the same primitive `claimTask` relies on — so the exactly-once property
is unchanged. The `pending/ → claimed/` transition was a `git mv` (rename(2)), which is the atomic
rename Workflow 17 step 3 names.

`pending/` held exactly one file and `claimed/` was empty when this hop started, so queue width was
1 and no contention was possible: **the claim is degenerate**, recorded rather than glossed. No
stale-claim sweep was owed (`claimed/` was empty), and the sweep is the coordinator's in any case.

Workflow 16's sanctioned writer `scripts/context-io.ts` is likewise absent, and the structured
`mcp__grugops__propose_note` tool is **not** in this session's tool set — checked against the tools
actually available rather than assumed. Notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-013/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`. **No `finding` is written**: none is admissible on this
task, because there is no `§14-gate` verdict record under this task to issue a `§14-gate#<id>` stamp
(`emitVerdict` lives in the absent `context-io.ts`) and `context.human_admission` is `off` in
`.grugops/factory.config.json`, so no `human:<name>` stamp exists either. No `index.md` /
`index.jsonl` is hand-faked. The gate results below are therefore recorded as `observation`, not as
a `finding` — the honest degrade Workflow 16 step 4 names.

`at` is taken from `date -u`, never from a local clock or a test runner's `Start at` line. This
machine is UTC+3: `date -u` read `12:24:21Z` against local `15:24:21 EEST` at the start of this hop.
