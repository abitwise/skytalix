---
task: ticket-to-pr-ABC-025
subtask: ticket-to-pr-ABC-025-bapm
role: ba-pm
claimed_at: 2026-08-10T14:47:11Z
claimed_by: ba-pm
completed_at: 2026-08-10T15:16:22Z
method: MANUAL-BY-HAND
outcome: |
  ABC-025 CUT and promoted `Backlog` -> `Ready` (Ready 0/8 -> 1/8). File:
  plans/tickets/ABC-025-san-qualifier-minimality-net.md. Six criteria, 23 supplied positions, 63
  supplied strings, size `M`, priority `P2`, DEFINITION OF READY 10 OF 10 — assessed line by line and
  recorded in the ticket. The `Ready` -> `In Development` exit is the Orchestrator's and was NOT
  taken; NOBODY ENQUEUED. NO `src/` FILE TOUCHED (`git status --short -- src/` empty, `src/san.ts`
  md5 `cbcc3be37c21414d16e8e6b4d0c68959` before and after), NO TEST WRITTEN, ABC-013 NOT RE-OPENED
  (no criterion, row, count or verdict edited), ADR-0004 NOT RE-OPENED, EPIC-003's `parseSan`
  contract NOT ALTERED, `plans/nfr-catalog.md` NOT EDITED. NOTHING MERGED, NOTHING DEPLOYED.

  SIX WRONG BUILDS PASS 652/652 ON 20 FILES, NOT FIVE. ABC-013's QE hop proved five; all five were
  RE-DERIVED on this hop's own instrument and a SIXTH was found — `Q28'`, the `x` dropped for a black
  piece capture, which passes the suite, passes injectivity AND passes the minimality property on
  BOTH corpora, and dies only on a hand-typed string. 13 mutants, 0 broken builds (`tsc --noEmit`
  exit 0 on all 13), 0 harness errors, one fresh OS process per tree state, mutants applied to a copy
  of `src/` OUTSIDE the repository, every anchor asserted to occur exactly once and the bytes
  asserted to have changed, `src/san.ts` restored from a pristine byte copy and re-hashed after every
  single mutant and against the repository's own copy at the end.

  THE OBVIOUS FIX WAS MEASURED AND FOUND SHORT, AND THAT IS THE TICKET'S SPINE. The minimality
  property — the shortest ladder qualifier that names exactly one legal move — over the corpus
  `src/san.test.ts` ALREADY HAS closes only THREE of the six: `Q34` (bishops) and `Q38` (black on the
  rank rung) SURVIVE it, because that corpus fills 5 of the 44 reachable (piece type x colour x
  capture-ness x rung) cells. Expanding the same six perft FENs TWO PLIES (6,639 positions, 277,772
  strings) buys FOUR more cells and nothing else — no square rung anywhere, no black bishop, no black
  queen. So the corpus richness is itself a criterion (`A2`), with a numeric discriminating
  requirement, and it is STATED IN THE CRITERION that no wrong build can witness it: its witness is a
  narrowed corpus.

  23 POSITIONS AND 63 STRINGS BUILT AND VERIFIED HERE, and supplied in the ticket so the build is
  transcription. Every FEN round-trips through `toFen` byte-identically; in every one the side not to
  move is not in check; every named (from,to,promotion) triple names EXACTLY ONE legal move; purity
  and the `legal`-argument equivalence hold over every legal move in BOTH call forms. They fill ALL
  44 reachable cells and leave exactly the four `ROOK ... square` cells empty — a GEOMETRIC THEOREM (a
  rook can never need a full-square qualifier), measured as zero two-character rook qualifiers over
  7,314 and over 277,772 renders, and asserted in BOTH directions so the census cannot pass vacuously.

  THE EXTERNAL ORACLE WAS USED AGAIN AND IT IS NOT IN THE REPOSITORY. `chess.js@1.4.0` installed with
  `npm install` in this session's scratchpad OUTSIDE the repo: 23 FENs offered, 0 refused; 63
  hand-typed strings checked, 0 DISPUTED; 677 legal moves compared move-for-move, 0 MISMATCHES;
  `package.json` and `package-lock.json` byte-identical, no dependency added.

  TWO MEASUREMENTS THAT CHANGED WHAT IS OWED. (1) THE INJECTIVITY PROPERTY IS THE SOLE GUARD ON THREE
  WRONG BUILDS AND NO ABC-013 CRITERION REQUIRES IT — `Q13`, `Q14` and `Q36` each fail EXACTLY ONE
  test of the 652 and it is `gives every legal move of a position a DISTINCT string`; A1-A22 never
  name it, so deleting it today turns nothing red. `A4` gives it an owner in this ticket's own rows.
  (2) THE SAN-SHAPE PROPERTY IS BLIND TO ALL SIX wrong builds (all six PASS it over 7,314 strings), so
  it is deliberately NOT promoted to a criterion — refusing a cheap-looking criterion that kills
  nothing is the same job as adding one that does.

  ALL FOUR BEHAVIOUR-EQUIVALENT CONTROLS (`Q22`, `Q24`, `Q29`, `Q40`) SURVIVE EVERY NEW CRITERION,
  KILLED COUNT ZERO — ABC-009's lesson and ABC-024's `A5`, measured rather than hoped for.

  SIZE `M` (3) WITH `S` CONSIDERED AND REJECTED ON THE MEASURED ROW COUNT. 23 positions, 63 strings,
  six property/quantifier tests, one test file, zero production lines, against ABC-023 and ABC-024 at
  `S` with 16-17 rows. Every position and string is supplied verified, which is why this is not `L`;
  rounding a measured table down to fit a precedent is how a ticket hides work. The `L` shape (hand-
  typing all 132 grid rows) is named so nobody grows it into one. PRIORITY `P2` with two escalation
  triggers, BOTH CHECKED AT THE SOURCE AND BOTH NOT FIRED — no ticket that edits `src/san.ts` is in
  `Ready` (EPIC-003 is in `Backlog`, undecomposed), and ABC-016/ABC-017 are still in `Backlog`, though
  their `blocked-until` lists became fully satisfied when ABC-013 merged today, so trigger 2 is one
  refinement pass away.

  ONE CRITERIA CONFLICT FOUND AND WRITTEN DOWN: the new positions must NOT be added to
  `src/san.test.ts`'s `POSITIONS` map, because ABC-013's `A18`/`A19` iterate that map and widening it
  silently redefines two of ABC-013's criteria AND makes ABC-025's own `A5` unfalsifiable. Test notes
  note 1.

  BOARD DISCIPLINE: the outgoing `_Updated:` header (2,441 chars, ABC-013's close) was appended
  VERBATIM to `plans/tickets/history/ABC-013-board-history.md` BEFORE the board header was replaced —
  the board's own rule — and the archive was byte-checked (the script refuses to write unless the
  archived text equals the header on the board). The board row is ONE LINE.

  TRACE: plans/traceability.md ONE ROW APPENDED (ABC-025), NO EXISTING ROW TOUCHED — 33 table lines
  before, 34 after, EVERY pre-existing table line asserted BYTE-IDENTICAL after the write, all ten
  cells asserted pipe-free and newline-free BEFORE writing, the new row asserted at exactly 12 fields
  with an empty lead and tail. `UAT` and `Release` deliberately LEFT EMPTY — nothing has been built,
  gated, UAT-ed or released.

  TWO NOTES PUBLISHED, hand-written in the contract's exact shape: one `observation` (the
  measurements) and one `decision` (the cut and its rulings). NO `finding` — none is admissible on
  this hop (no §14 gate to issue a `§14-gate#<id>` stamp; `context.human_admission` is `off`, so no
  `human:<name>` stamp exists either). Nothing self-stamped; no index.md / index.jsonl hand-faked.

  WHAT I DO NOT CERTIFY: that six is the complete set of wrong builds — the mutants were chosen by
  reading ABC-013's criteria and QE's five, and ABC-023's QE hop found fourteen where its ticket
  predicted two; that the 63 strings match the PGN SPECIFICATION TEXT (chess.js is a widely-used
  implementation, not the standard, and where it and this repo could both be wrong in the same way
  this check is blind); any wall-clock figure on hardware other than Apple M3 / Node v24.12.0 /
  darwin-arm64; and that ABC-025 may be PULLED — `Ready` -> `In Development` is the Orchestrator's
  exit and its DoR re-run is its own.
moved: pending/ -> claimed/ticket-to-pr-ABC-025-bapm/ -> done/ticket-to-pr-ABC-025-bapm/ — ALL BY HAND.
---

# Claim record — the now-running registry entry

Queue claim taken BY HAND, and the deviation is recorded rather than presented as compliance.
Workflow 17's `claimTask` does not exist in this install — **re-checked at the source rather than
inherited from the subtask brief**: there is no `scripts/` directory in the repository, and a `find`
for `claim.*` and `context-io.*` across the repository (excluding `node_modules`) and across the kit
root `/Users/olgeroeselg/.grugops/agent-factory` returns nothing at all.

The claim IS the atomic `mkdir(2)` of this directory — the same primitive `claimTask` relies on — so
the exactly-once property is unchanged. It exited **0**, so this claim was the first writer; a second
writer would have taken `EEXIST`. The subtask file was then moved `pending/` → `claimed/` and, at
completion, `claimed/` → `done/` by atomic rename.

`pending/` held exactly one file and `claimed/` was empty at the start, so queue width was 1 and no
contention was possible: **the claim is degenerate**, recorded rather than glossed. No stale-claim
sweep was owed (`claimed/` was empty), and the sweep is the coordinator's in any case.

Workflow 16's sanctioned writer is likewise absent — `scripts/context-io.ts` does not exist — and the
structured `mcp__grugops__propose_note` tool is **not** in this session's tool set, checked against
the tools actually available rather than assumed. So the notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-025/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`, and **no `finding` is written** — none is admissible on
this hop. No `index.md` / `index.jsonl` is hand-faked.

`at` is taken from `date -u`, never from a local clock or a test runner's `Start at` line. This
machine is **UTC+3**: `date -u` read `14:47:11Z` against local `17:47:11 EEST` when the claim was
taken.
