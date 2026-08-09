---
task: ticket-to-pr-ABC-009
subtask: bapm-abc009-a13-verify
role: ba-pm
claimed_at: 2026-08-09T16:17:00Z
claimed_by: ba-pm
method: MANUAL-BY-HAND
outcome: |
  A13 IS MET. Its ⚠️ NOT YET SATISFIED marker is RETIRED, all thirteen criteria A1-A13 are green on
  the branch tip, and the follow-up hardening ticket is cut as ABC-023 (Backlog, S, P2). NO BOARD
  MOVE — ABC-009 stays Ready for UAT 1/4. NO src/ EDIT, NO TEST ROW WRITTEN, NO SIXTH HARDENING PASS.

  HOW A13 WAS ESTABLISHED INDEPENDENTLY — THE MUTANT SET COMES FROM A13's OWN ACCOUNTING, NOT QE's
  TABLE. A13 is a quantifier, so the honest test is not "did the eight rows land" but "does every
  wrong value in the space now fail a row". One mutant per wrong byte value per home square: 24
  mutants with a DIFFERENT predicted split from QE's 24 (17 must die / 7 must survive, against QE's
  7 / 17). Measured: 17 KILLED, 7 SURVIVED, 0 VERDICT DISAGREEMENTS WITH A13's OWN BUCKETS, 0 broken
  builds, 0 harness errors. Every mutant asserted its anchor unique and its bytes changed, typechecked
  under tsc --noEmit so a broken build could never be scored a survivor, ran in ONE FRESH OS PROCESS
  PER TREE STATE, and restored src/moves.ts to 0e247853ab2c05887c76105ff83d8621 afterwards; verdicts
  read from the JSON reporter so each kill names its failing test.

  THE TWO HALVES THAT MATTER. (a) The four newly-required admissions — enemy KNIGHT and enemy PAWN on
  both home squares — DIE TO A13's ROWS ALONE: acceptance 33/33 on every one of the four, and the
  failing tests name themselves as the A13 rows, two per mutant. (b) The seven survivors are EXACTLY
  the seven values A13 names unfalsifiable (enemy KING/QUEEN/ROOK on both squares, own KING on the
  rook's square) and no more — a kill among them would have been a bug in a row, not a win. That is
  what makes the rows pin observable behaviour rather than implementation shape.

  THE DOMAIN, WITH THE 11-vs-13 TRAP DESIGNED OUT RATHER THAN REMEMBERED. My fourth-hop probe said 11
  because its board already held a white king, and the Orchestrator's rebuild said the same wrong 11.
  QE designed the trap out; that is the standard now, so my probe carries THREE defences: king parking
  varies per attempt (both kings d4/e6, then white only, then black only, then c5/g7), the parking
  squares are ASSERTED never to be the square under test, and every discovered byte PRINTS THE EXACT
  FEN that produced it, which is re-parsed before the byte is recorded. Result: 13 distinct bytes on
  all SIX home squares, identical sets, sweeping every code point 0x00-0x2FF. Both KING bytes print
  their witnesses (byte 6 on e1 via "K" with only the black king parked; byte 14 via "k" with only the
  white king parked).

  THE ACCOUNTING IS ENFORCED, NOT NARRATED — FIVE SUITE-FILE CORRUPTIONS, production source pristine,
  all RED at tsc 0 (so each red is an assertion and not a transform error), each restored and the tree
  re-run green: drop ONE enemy-PAWN row; drop BOTH; RELABEL the enemy-KNIGHT row as PAWN at a
  coinciding count of 13 so every outcome assertion still passes; make a row INERT with an own bishop
  on f1; and SILENTLY OMIT one value from the discharge map. THE LAST IS THE ONE NOBODY HAD RUN and it
  is the failure mode that produced four consecutive misses on this ticket — it is caught mechanically
  ("a bucket for every value and no value without one"). ONE HONEST CORRECTION TO MY OWN PREDICTION,
  recorded in the ticket: the first corruption fails on the all-four-rights clause, one assertion
  earlier than the doubling clause I predicted. The measured message is published, not the expected
  one.

  STRUCTURAL, RE-CHECKED AT THE SOURCE: src/moves.ts md5 0e247853ab2c05887c76105ff83d8621 unchanged
  across six hops; git status --short -- src/ empty; ALL 14 pre-existing main test files diffed
  INDIVIDUALLY, 0 modified; npm test 381 passed (381) on 16 files, skip count 0 by the AGENTS.md
  command, re-run on the tip by this role. The eight rows in the hardening file are, FEN for FEN and
  count for count, the eight in A13's own table, and each asserts the occupant byte in TYPE AND
  COLOUR, the other precondition, exactly one right, non-inertness, both exported layers and full
  purity over 128 bytes and five scalars.

  WHAT I CLEARED, AND IT IS ## Acceptance AND NOTHING ELSE IN THAT TICKET. A13's ⚠️ marker replaced by
  a SATISFIED BY THE SUITE header naming the hop, with a retirement note at the foot of A13 carrying
  the measurements — the same shape A11's took. THREE STALE STATEMENTS AMENDED IN PLACE WITH A DATE
  AND NEVER SILENTLY REWRITTEN: the preamble's "every criterion A1-A12 is green ... 371 passed"; the
  "second criterion this ticket has carried unsatisfied" paragraph; and A13's own "no row in this
  suite exercises that". The ## Definition of Ready block amended for the same reason its two previous
  amendments exist ("twelve of thirteen criteria green"), with NO TICK FLIPPED. A13's reserved regions
  (ii)/(iii) now name ABC-023 instead of pointing at a note. NOT TOUCHED: A7, A11, A12, guard ordering,
  NFR-001, the ## Implementation / ## QE / ## Security / NFR / ## Test notes sections, ABC-022,
  ABC-010, ABC-011, ABC-018, plans/nfr-catalog.md, and everything under src/.

  ABC-023 CUT — Backlog, S (2), P2, EPIC-001, blocked-until ABC-009 merged. A HARDENING TICKET, NOT A
  DEFECT TICKET: the delivered code is correct on every item and the expected production diff is ZERO
  LINES; if a row proves otherwise, its A4 FAILS BY DESIGN and the defect gets its own ticket. Five
  criteria, each NAMING THE DISCRIMINATING MUTANT that must die, because on this ticket "the rows
  exist" is not a requirement worth writing. SIZED ON MEASUREMENT: 4 rows for the joint pair + 4 for
  the destination square + 9 for the doubling (one added configuration per gapped type/table pair,
  counted, not guessed) + two quantifier tests = 17 rows / 19 tests in ONE existing table-driven file.
  S because there is no new module, no new export, no new dependency edge and no design decision — the
  same test ABC-009 applied to its own S — with the one thing that would make it L named so nobody
  does it (writing the pair criterion as an enumeration of the 169 combinations instead of the class).
  P2: not P1 because nothing is wrong today and there is no user surface until EPIC-006; not P3
  because one class is legally reachable and EPIC-004 is a planned rewrite of exactly this code with
  no net under it. ESCALATION TRIGGER, EXPLICITLY NOT FIRED: promote to P1 the moment any ticket
  proposes to change addCastlingMoves, the CastleOption tables or the through-check loop. It stays in
  Backlog — its ordering dependency is unsatisfied, and a P2 hardening ticket should compete for Ready
  at a refinement pass against ABC-019/020/021 rather than be slipped in by the hop that wrote it.

  THE STOPPING RULE WAS TESTED AND IT HELD — A FIFTH CLASS, NAMED AND ROUTED, NOT FIXED. Sizing the
  ticket found it: THE CASTLE'S DESTINATION SQUARE IS PINNED BY NOTHING. Dropping the landing square
  from an option's kingPath SURVIVES the full suite 381/381 AND the standing PERFT_DEEP=1 32/32 lane
  on both white options, while dropping the ORIGIN (379/381, 380/381) or the CROSSED square (378/381,
  379/381) dies to moves.test.ts and perft.test.ts. Why nothing catches it is the point: legalMoves
  filters any move leaving the mover's king in check, and a castle landing on an attacked square is
  exactly that, so the outer layer removes it and EVERY COUNT-BASED ORACLE INCLUDING PERFT IS BLIND;
  the origin and crossed squares are not masked that way. What breaks is the exported generateMoves
  and its own documented invariant (src/moves.ts:306-308, "a castle never appears when the king would
  start, cross, or land in check"), which ABC-009's ## Scope bullet 4 already rules on. Witness with
  the FEN printed, one fresh process per tree: delivered 4k1r1/8/8/8/8/8/8/4K2R w K - 0 1 offers 0
  castles from both layers at 14 moves; the mutant offers e1g1 from generateMoves only. IT IS THE ONLY
  CLASS FOUND ACROSS SIX HOPS WHOSE POSITION IS LEGALLY REACHABLE — everything else here needs a
  semantically-invalid FEN — AND THE DELIVERED CODE IS CORRECT ON IT. Routed to ABC-023's A2. Honest
  limit: the two BLACK options were not mutated, UNKNOWN - verify, which is why A2 requires rows for
  both colours rather than inheriting the white result.

  TWO MORE MEASURED RESULTS THAT SHAPED ABC-023 RATHER THAN ABC-009. (1) The joint pair now has a
  witness instead of an argument: admitting the castle only when BOTH squares hold an enemy KNIGHT, or
  both an own QUEEN, survives 381/381, and on 4k3/8/8/8/8/8/8/K3n2n w K - 0 1 the mutant leaves
  4k3/8/8/8/8/8/8/K3K2n w K - 0 1 — the black knight destroyed and a second white king written over
  it. (2) QE's side-conditional residual is reproduced on my own instrument INCLUDING its inheritance
  claim on A11's own rows, and THE GAP IS SYMMETRIC, which nobody had stated: 9 of 13 type/table pairs
  vary only one of (colour to move, castling side), so a type doubled on COLOUR alone is blind to a
  SIDE-conditional admission (enemy KNIGHT only queenside, own ROOK/BISHOP only queenside) and a type
  doubled on SIDE alone is blind to a COLOUR-conditional one (own KNIGHT only when black, both
  squares) — six such mutants survive 381/381 and the two controls whose rows do vary that axis DIE.
  Of eight CastleOption constant mutants, six die (mostly to perft) and only the destination pair
  survives, which is why A2 is four rows rather than a sweep of every field.

  A RECORDED NEAR-MISS, because the discipline is what makes the numbers usable: my first colour-axis
  probe asserted the condition in the wrong direction (only when WHITE, which the white rows DO
  exercise) and returned three kills. The instrument was fine and the prediction was wrong; inverting
  to the uncovered direction produced the two survivors. A verdict that contradicts a prediction is a
  reason to check the probe, not to publish either number.

  BOARD AND TRACE. NO COLUMN MOVED: the only plans/board.md change is an ADDITION to Backlog (ABC-023)
  plus a comment recording why it was cut and why it is not promoted, and all 10 counted columns were
  re-verified against their line-item counts, 0 wrong. plans/traceability.md: ONE ROW EDITED (ABC-009,
  the Status cell) and ONE ROW APPENDED (ABC-023) — every added string ASSERTED PIPE-FREE BEFORE
  WRITING by the edit script, the new row asserted to carry exactly 11 unescaped pipes, and all 31 row
  lines re-counted at 11 unescaped pipes after. tools/grugops/reference-check.js reports "No findings"
  on all four edited plans files. NOBODY WAS ENQUEUED — decompose->enqueue is the Orchestrator's.
  NOTHING MERGED, NOTHING DEPLOYED.

  FIVE NOTES PUBLISHED, hand-written in the contract's exact shape (task total now 63):
  20260809T164200Z-ba-pm-observation-2d5190f4 (the 24-mutant campaign, the six-square domain, the five
  corruptions), 20260809T164300Z-ba-pm-observation-71c9408f (the destination-square hole, the pair
  witnesses, the symmetric doubling gap, the near-miss),
  20260809T164400Z-ba-pm-decision-6661a0e1 (A13 MET, what was cleared, ABC-023's shape, the stopping
  rule), 20260809T164500Z-ba-pm-artifact-ref-a4d903f1 (artifacts),
  20260809T164600Z-ba-pm-claim-59224c78 (nine soft edges at UNKNOWN - verify). NO FINDING — none is
  admissible on this task (no §14 gate exists to issue a §14-gate#<id> stamp; context.human_admission
  is off). Nothing self-stamped; no index.md / index.jsonl hand-faked.

  ABC-018's frontmatter drift LEFT ALONE as instructed — the trigger fires on ABC-009's close, the
  next event after this hop.

  WHAT I DO NOT CERTIFY: that ABC-009 may be closed (the UAT ruling is the Orchestrator's; I record
  only that these rows add no human-exercisable surface, so a UAT pass would be a fabrication); that
  the criteria set is complete (A13 exhausts one dimension and ABC-023 carries three regions beyond
  it, and I am not claiming those are the last — that sentence has been wrong four times here); and
  any NFR-001, perft-throughput or coverage figure, of which I have measured none across five hops.
  The two PERFT_DEEP=1 runs at this hop are mutant-survival checks reported as 32/32, not timings.
moved: pending/ -> claimed/ticket-to-pr-ABC-009-bapm5/ -> done/ticket-to-pr-ABC-009-bapm5/ — ALL BY
  HAND. scripts/claim.js does not exist in this install; re-checked at the source rather than trusted
  from the subtask brief (`ls scripts/` -> "No such file or directory"; the repository has no scripts/
  directory at all, and the kit root /Users/olgeroeselg/.grugops/agent-factory has none either). The
  claim directory was created with a plain mkdir — still atomic, still EEXIST on a second writer — and
  it exited 0, so this claim was the first. Both transitions are `mv`, the atomic rename Workflow 17
  steps 3 and 5 specify. The whole claim directory moves, keeping this registry record beside the
  subtask file, which is the shape every prior done/ subtask on this board uses.
---

# Claim record — the now-running registry entry

Queue claim taken BY HAND, and the deviation is recorded rather than presented as compliance.
Workflow 17's `claimTask` does not exist here: there is no `scripts/` directory in the repository and
none in the kit root. The claim IS the atomic `mkdir(2)` of this directory — the same primitive
`claimTask` relies on — so the exactly-once property is unchanged.

`pending/` held exactly one file and `claimed/` was empty at the start, so queue width was 1 and no
contention was possible: **the claim is degenerate**, recorded rather than glossed. `queue.wip_limit`
3 and `claim_cap` 2 are both respected at 1. No stale-claim sweep was owed (`claimed/` was empty), and
the sweep is the coordinator's in any case.

Workflow 16's sanctioned writer is likewise absent — `scripts/context-io.ts` does not exist, and the
structured `mcp__grugops__propose_note` tool is **not** in this session's tool set, checked against
the tools actually available rather than assumed. So the notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-009/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`, and **no `finding` is written** — none is admissible on
this task (no §14 gate to issue a `§14-gate#<id>` stamp; `context.human_admission` is `off`, so no
`human:<name>` stamp exists either). No `index.md` / `index.jsonl` was hand-faked.

`at` was taken from `date -u`, never from a test runner's `Start at` line. This machine is **UTC+3**:
`date -u` read `16:13:01Z` against local `19:13:01 EEST` at the start of this hop. The ordering
warning in the subtask brief is therefore live — `20260809T141500Z-orchestrator-decision-865b06ae`
carries local time labelled `Z` and is superseded by
`20260809T114649Z-orchestrator-decision-700d4a44`.
