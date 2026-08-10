---
task: ticket-to-pr-ABC-025
subtask: ticket-to-pr-ABC-025-dev
role: software-engineer
by: software-engineer
at: 2026-08-10T15:23:39Z
method: MANUAL-BY-HAND
completed_at: 2026-08-10T15:56:00Z
outcome: |
  `ABC-025` IMPLEMENTED. ONE NEW FILE `src/san.qualifier.hardening.test.ts` (+655/-0, 20 tests,
  `A1`-`A5`), **ZERO PRODUCTION LINES** — exactly what a HARDENING ticket owes. `ABC-025` MOVED
  `In Development` -> `In Review` (In Development 1/3 -> 0/3, In Review 0/3 -> 1/3); the `In Review`
  exit is QE/E2E's and was NOT taken. NOTHING MERGED, NOTHING DEPLOYED.

  `A6` HOLDS ON ALL FOUR CLAUSES AND IS VERIFIED AT LINE LEVEL, NOT BY INSPECTION. `src/san.ts` md5
  `cbcc3be37c21414d16e8e6b4d0c68959` unchanged; `git diff --numstat main -- src/` is ONE file at
  655/0 with ZERO deletion lines; the same diff restricted to every pre-existing `src/` file is
  EMPTY, so no existing test row was modified or deleted anywhere; `package.json` and
  `package-lock.json` byte-unchanged. `src/san.test.ts` is NOT TOUCHED AT ALL — not even a new
  `describe` — so `ABC-013`'s `A18`/`A19` keep their meaning (`## Test notes` note 1), and the six
  perft FENs are re-derived in the new file rather than shared, because a shared helper would put a
  NON-TEST file under `src/`.

  GATES on the branch tip: 672/672 on 21 files (652 -> 672, +20, every pre-existing test still
  green), SKIP COUNT 0, lint exit 0 (after `npx biome check --write` on the ONE new file only;
  `quality.lint.autofix` is true, and the 2 remaining infos were measured PRE-EXISTING by stashing
  the file), typecheck exit 0, build exit 0, `PERFT_DEEP=1` **32/32 EXACT in 37.93 s**.

  ALL 13 OF THE TICKET'S MUTANTS RE-RUN AGAINST THE DELIVERED ROWS ON THIS HOP'S OWN INSTRUMENT —
  re-specified from the ticket's descriptions, not inherited — AND EVERY VERDICT AND EVERY COUNT
  REPRODUCES BA/PM's TABLE EXACTLY: `Q33` A1 red 412 + 12 rows, `Q34` 24 + 8, `Q35` 110 + 18, `Q27`
  536 + 18, `Q38` 30 + 10, `Q28'` **A1 GREEN** + 12 rows (blind by construction — the measured reason
  `A3` is its own criterion), `Q13` 1 row + injectivity 44 positions, `Q14` 116 + 24 + 53, `Q36` 412
  + 12 + 50. **ALL FOUR BEHAVIOUR-EQUIVALENT CONTROLS (`Q22` `Q24` `Q29` `Q40`) GREEN ON EVERY LANE,
  KILLED COUNT ZERO** — no delivered row pins implementation shape. `A2` and `A5` are red for NO
  mutant, which is what the ticket says of them and is now measured over 13 builds. 13/13 `tsc
  --noEmit` exit 0, one fresh OS process per tree state, anchors asserted unique and bytes asserted
  changed, mutants applied to a copy of `src/` OUTSIDE the repository, `src/san.ts` re-hashed after
  every one and against the repository's copy at the end. The whole sweep was RE-RUN after `biome`
  reformatted the file, so the verdicts are the delivered file's and not a draft's.

  THE 63 STRINGS WERE RE-DERIVED BY HAND FROM BOARD GEOMETRY AND THEN RE-CONFIRMED EXTERNALLY.
  `chess.js@1.4.0` installed OUTSIDE the repo: 23 positions offered / 0 refused, 63 strings / 0
  DISPUTED, 677 moves compared / 0 MISMATCHES, 23 `toFen` round-trips / 0 failures, `package.json`
  and `package-lock.json` md5-identical before and after. The hand derivation is CORROBORATION AND
  NOT PROOF — it was done by a reader who had already seen the table.

  ONE DEFECT FOUND IN THE TICKET, AND IT IS `N5`, REPORTED RATHER THAN ABSORBED: the added tests cost
  **+171 ms wall clock (12.5%) and 263 ms of the file's own test time (19.3%)** against a **<= 5%**
  bar and a predicted 0.4-1.2%. Cause measured: `A1`'s own `when` clause requires BOTH call forms and
  the unassisted form regenerates the legal list 5,524 times at ~28 us under vitest (~5x its
  plain-node cost) = ~174 ms of the 263. BA/PM's 6.3-16.8 ms figure is ARITHMETICALLY A SINGLE-CALL-
  FORM NUMBER (7,314 renders is one render per legal move; 5,524 unassisted renders alone cost >= 27
  ms even in plain node) taken in a harness that is not the lane the ratio is against. `A1` WAS
  DELIVERED AS WRITTEN and NOT quietly narrowed; `plans/nfr-catalog.md` was NOT edited and no target
  moved. The alternative is measured for whoever rules: dropping `A1`'s unassisted half changes NO
  verdict across all 13 mutants and costs 89 ms instead of 263 — but even that is ~6.5%, so `N5` is
  not reachable at this corpus size on this instrument.

  BOARD DISCIPLINE: the outgoing `_Updated:` header (2,560 chars, the Orchestrator's DoR/pull hop)
  was appended VERBATIM to `plans/tickets/history/ABC-025-board-history.md` BEFORE the board header
  was replaced, and the archive was byte-checked (file grew by exactly the entry length and the
  header text was asserted present). The board carries exactly one `_Updated:` line and exactly one
  `ABC-025` row. TRACE: ONE ROW EDITED IN PLACE, THREE CELLS (`Code`, `Tests`, `Status`), 34 table
  lines before and after, EVERY pre-existing table line asserted BYTE-IDENTICAL, the row at exactly
  12 fields, all three added strings asserted pipe-free and newline-free before writing; `UAT` and
  `Release` deliberately LEFT EMPTY.

  FIVE NOTES PUBLISHED, hand-written in `agent-factory/contracts/context-note.md` shape: one
  `decision`, two `observation`, one `artifact-ref`, one `claim`. NO `finding` — none is admissible
  on this hop (no §14 gate verdict record under this task to issue a `§14-gate#<id>` stamp, and
  `context.human_admission` is `off`). Nothing self-stamped, no `index.md` / `index.jsonl` faked.

  WHAT I DO NOT CERTIFY: that 13 is the complete set of wrong builds (the mutants were re-specified
  from the ticket's own descriptions, and `ABC-023`'s QE hop found fourteen where its ticket
  predicted two); that the 63 strings match the PGN SPECIFICATION TEXT; that `A1`'s unassisted call
  form is dispensable (it changes no verdict across THESE 13 and nothing more); that `A2`'s 44-cell
  grid is the right partition; any wall-clock figure on other hardware or another runner; and that
  `ABC-025` may leave `In Review` — that exit is QE/E2E's.
moved: pending/ -> claimed/ticket-to-pr-ABC-025-dev/ -> done/ticket-to-pr-ABC-025-dev/ — ALL BY HAND.
---

# Claim record — the now-running registry entry

Queue claim taken BY HAND, and the deviation is recorded rather than presented as compliance.

`scripts/claim.js` does not exist in this install, **re-checked at the source rather than inherited
from the subtask brief or from the two prior claim records under `done/`**: there is no `scripts/`
directory in the repository (`ls scripts/` → "No such file or directory"), and a `find` for `claim*`
and `context-io*` across the repository (excluding `node_modules` and `.git`) and across the kit root
`/Users/olgeroeselg/.grugops/agent-factory` returns only this queue's own `claim.md` registry records
— no script, anywhere.

The claim IS the atomic `mkdir(2)` of this directory — the same primitive `claimTask` relies on — so
the exactly-once property is unchanged. It exited **0**, so this claim was the first writer; a second
writer would have taken `EEXIST`. The `pending/ → claimed/` transition was a `git mv` (rename(2)),
which is the atomic rename Workflow 17 step 3 names.

`pending/` held exactly one file and `claimed/` was empty when this hop started, so queue width was 1
and no contention was possible: **the claim is degenerate**, recorded rather than glossed. No
stale-claim sweep was owed (`claimed/` was empty), and the sweep is the coordinator's in any case.

Workflow 16's sanctioned writer `scripts/context-io.ts` is likewise absent, and the structured
`mcp__grugops__propose_note` tool is **not** in this session's tool set — checked against the tools
actually available rather than assumed. Notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-025/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`, as every prior note on this task and on
`ticket-to-pr-ABC-013` was. **No `finding` is written**: none is admissible on this hop — there is no
`§14-gate` verdict record under this task to issue a `§14-gate#<id>` stamp, and
`context.human_admission` is `off` in `.grugops/factory.config.json`, so no `human:<name>` stamp
exists either. No `index.md` / `index.jsonl` is hand-faked. The gate results are therefore recorded as
`observation`, never as a `finding` — the honest degrade Workflow 16 step 4 names.

`at` is taken from `date -u`, never from a local clock or a test runner's `Start at` line. This
machine is UTC+3: `date -u` read `15:23:39Z` against local `18:23:39 EEST` when the claim was taken.
**That is EARLIER than this subtask's own `enqueued_at: 2026-08-10T15:35:00Z`** — the brief's
front-matter clock runs ~11 minutes ahead of this machine's `date -u`. Recorded rather than smoothed;
`at` is the real reading, not one adjusted to look monotonic.
