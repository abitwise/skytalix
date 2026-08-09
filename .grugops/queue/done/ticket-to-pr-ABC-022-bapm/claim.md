---
task: ticket-to-pr-ABC-022
subtask: bapm-abc022-acceptance
role: ba-pm
claimed_at: 2026-08-09T19:31:01Z
claimed_by: ba-pm
method: MANUAL-BY-HAND
outcome: |
  ABC-022's ## Acceptance CORRECTED IN PLACE. NO BOARD MOVE — ABC-022 stays in Ready (2/8). NO src/
  EDIT (moves.ts md5 0e247853ab2c05887c76105ff83d8621 unchanged, git status --short -- src/ empty),
  NO TEST ROW AND NO PRODUCTION LINE WRITTEN, NOBODY ENQUEUED, ABC-023/010/009/011/013 NOT EDITED,
  plans/nfr-catalog.md NOT EDITED, plans/board.md NOT EDITED.

  SEVEN CORRECTIONS. THE PRE-CHECK NAMED TWO; FIVE WERE SEEN BY NO PRE-CHECK; FOUR OF THE SEVEN ARE
  THE SAME RECURRING SHAPE — a criterion narrower than the ticket's own ## Scope. Both pre-checked
  defects were CONFIRMED and both had their STATED MECHANISM corrected by measurement rather than
  inherited.

  DEFECT 2 — THE JUDGMENT CALL. The Orchestrator's hypothesis was TESTED, NOT ACCEPTED, AND IT HOLDS:
  at the en-passant branch an emptiness test and a colour test are behaviour-equivalent, because
  src/moves.ts:177 consumes every enemy occupant and continues at 180. Proved by EXHAUSTION over the
  branch's ENTIRE input domain (all 256 target bytes x both colours = 512 states, byte-identical
  digests) and over ALL 518,474 reachable nodes (six byte-identical per-root move-set digests), two
  full trees, one OS process each, both typechecked clean. So A5's justification is FALSE and NO
  criterion can discriminate the two shapes — AND NO CRITERION WAS MANUFACTURED TO AVOID SAYING SO.
  BUT THE IMPLIED REPAIR ("retire it as a claimless regression guard") IS NOT WHAT THE MEASUREMENT
  SUPPORTS, AND THAT IS THE NEW RESULT: the colour-shaped RESTRUCTURE — reject own-colour occupants
  with a top continue-guard and drop the ordinary-capture branch's own continue — passes A1, A2, A3,
  A4 and A6, passes the full suite 381/381, passes the deep perft lane 32/32 (perft is blind: an
  occupied ep target is unreachable, 0 of 518,474), and A5 IS THE ONLY THING THAT FAILS IT, red on
  both rows, 257 emitting states against a correct fix's 2. A5 therefore KEEPS a claim; it is now a
  true one. A third outcome, not either of the two the brief anticipated.

  DEFECT 1 — CONFIRMED, MECHANISM CORRECTED, EXTENT WIDENED. The pre-check's witness ("the five
  scalars are absent, so a build that corrupts a scalar and no board byte satisfies A4") is FALSE as
  a behavioural claim: toFen renders all five scalars and CATCHES all 15 plausible single-scalar
  corruptions (3 FENs x 5 scalars). What is true is narrower and uglier — toFen is NOT INJECTIVE: 28
  castling bit values are invisible, and epSquare 32 (a3, on-board) renders IDENTICALLY to 40 (0x28,
  OFF-BOARD), the very off-board family Test notes item 2 cites. The narrowings that bite are
  COVERAGE (## Scope demands purity on all TEN reproduction positions; A4 demanded THREE) and
  INSTRUMENT (A4 required toFen, which Test notes item 2 forbids by name).

  THE FIVE NOBODY NAMED. (1) A3 HAD NO BLACK-TO-MOVE ROW — all three FENs were white to move, and a
  mutant implementing the captured-pawn precondition FOR WHITE ONLY passes A1-A6 as written and the
  full suite 381/381 while `4k3/8/8/8/3p4/8/8/4K3 b - e3 0 1` still creates a phantom WHITE pawn on
  e4; half (b) is this ticket's own "worse half" and it was unguarded for black. (2) A2 covered only
  A1's table though the pass-through it pins holds on A3's rows too. (3) A11 cited legal.ts:102-104
  when the false claim is at 102-103 — 104-105 is a SEPARATE TRUE sentence that must not be
  rewritten — and only the claim's CONCLUSION becomes true when this lands, not its mechanism. (4)
  The ## Acceptance preamble mis-described A7-A10 as currently-failing reds. (5) NFR-001's METHOD is
  stale by five days: plans/nfr-catalog.md was updated 2026-08-09 with its tenth instrument-limit
  correction (per-cell floor +/-2.0%), so the per-cell ratio bar sits at about half the instrument's
  resolution; it is DEMOTED and the primary evidence moves OFF THE CLOCK ONTO A COUNT, with the
  denominator measured here — the added preconditions are evaluated 331 times over the 518,474-node
  walk when they sit after the epSquare test, 216,269 times if placed before it, and reject 0. NO
  TARGET MOVED.

  LEAKAGE FIXED TOO, BECAUSE FIXING A5 ALONE WOULD HAVE LEFT THE LIE STANDING: ## Test notes item 1
  carried the SAME false claim as A5's parenthetical and is retired with it; item 2 gains the
  measured toFen aliases and a SELF-MASKING row-selection rule, proved step by step — on
  `4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1` the ep move rewrites e4 from black pawn to white pawn and the
  NEXT move in the same pass heals it, so the call-level purity oracle READS CLEAN on a position the
  generator provably corrupts. ## Reproduction gains a 2026-08-09 re-verification header (all ten
  rows re-measured on today's main AFTER ABC-009 merged — its independence from ABC-009 is now a
  measurement, not an argument), the black-to-move rows, the masking witness, and two factual
  corrections: the pinned control's move is c5d6 NOT e5d6 (no white pawn on e5 in that FEN), and the
  reachability figure is the SEVENTH independent reproduction, not the sixth.

  RE-DERIVED, NOT INHERITED: 518,474 / 81,397 (15.70%) / 0 / 0 / 0 and all six per-root counts
  (206604/99950/46256/9738/63910/92016), roots and fast depths PARSED OUT OF src/perft.test.ts by the
  harness rather than retyped; A7's numbers independently cross-checked as sums of the file's own
  published leaf counts; A8's 32/32 confirmed by construction (20 fast + 8 deep + 3 divide + 1 base)
  and by running. A9 shown SATISFIABLE — no existing test pins the defective behaviour.

  ONE SUSPICION CHECKED AND DROPPED: I suspected NFR-001's "in the same process" collided with this
  board's one-process-per-tree mutation trap. It does not — the catalog's guidance is that the
  harness gets its OWN process, and Security/NFR's own 2026-08-09 re-measure ran three trees in one
  process with a cmp-verified twin. Recorded so nobody re-raises it.

  DISCIPLINE: six mutant trees, ONE FULL TREE COPY AND ONE OS PROCESS PER TREE STATE, every one
  typechecked tsc --noEmit exit 0 BEFORE any red was believed, every anchor replacement asserted
  count==1 before writing, every probe PRINTS THE FEN IT USED AND RE-PARSES IT, and where a byte is
  not FEN-producible the constructed board is printed and read back with the limit stated (63 of 512
  states throw on an invalid piece byte — captured as the observable, not swallowed). ALL
  MEASUREMENTS ON COPIES OUTSIDE THE REPOSITORY.

  ## Scope, ## Out of scope, size S and priority P1 RE-CHECKED AND UNCHANGED — nothing found pushes
  on them, so there was nothing to stop for. The widened criteria bring the acceptance UP TO ## Scope
  rather than widening it. Escalation trigger re-checked clause by clause against its own source and
  STILL NOT FIRED (ABC-010 in Backlog, neither deferred nor descoped; EPIC-003 has one ticket cut;
  walk still 0 of 518,474; ABC-009's merge is not a trigger). ## Definition of Ready amended with the
  re-check and NO TICK FLIPPED.

  TRACE: plans/traceability.md ONE ROW EDITED (ABC-022), FOUR CELLS, 32 table rows before and after,
  the row asserted at exactly 11 unescaped pipes before and after, every added string asserted
  pipe-free and newline-free BEFORE writing. reference-check.js "No findings" on both edited plans
  files. Branch tip: 381/381 on 16 files, skip count 0 by the AGENTS.md command, perft fast 24/24,
  deep 32/32.

  FIVE NOTES PUBLISHED, hand-written in the contract's exact shape: two observation, one decision,
  one artifact-ref, one claim. NO FINDING — none is admissible on this task (no §14 gate to issue a
  §14-gate#<id> stamp; context.human_admission is off, so no human:<name> stamp exists either).
  Nothing self-stamped; no index.md / index.jsonl hand-faked.

  WHAT I DO NOT CERTIFY: that the criteria set is now complete (seven were found where a careful
  pre-check named two, and that sentence has been wrong repeatedly here); that ABC-022 may be pulled
  (the DoR verdict and the Ready -> In Development exit are the Orchestrator's); and any NFR-001
  throughput figure — npm run perft was not run by this role at any hop. NOTHING MERGED, NOTHING
  DEPLOYED.
moved: pending/ -> claimed/ticket-to-pr-ABC-022-bapm/ -> done/ticket-to-pr-ABC-022-bapm/ — ALL BY HAND.
---

# Claim record — the now-running registry entry

Queue claim taken BY HAND, and the deviation is recorded rather than presented as compliance.
Workflow 17's `claimTask` does not exist in this install: **re-checked at the source rather than
trusted from the subtask brief** — `ls scripts/` in the repository returns "No such file or
directory", the repository has no `scripts/` directory at all, and the kit root
`/Users/olgeroeselg/.grugops/agent-factory` has none either (`find` for `claim*` outside `queue/`
returns nothing in either tree). The claim IS the atomic `mkdir(2)` of this directory — the same
primitive `claimTask` relies on — so the exactly-once property is unchanged; it exited 0, so this
claim was the first writer. A second writer would have taken `EEXIST`.

`pending/` held exactly one file and `claimed/` was empty at the start, so queue width was 1 and no
contention was possible: **the claim is degenerate**, recorded rather than glossed. No stale-claim
sweep was owed (`claimed/` was empty), and the sweep is the coordinator's in any case.

Workflow 16's sanctioned writer is likewise absent — `scripts/context-io.ts` does not exist, and the
structured `mcp__grugops__propose_note` tool is **not** in this session's tool set, checked against
the tools actually available rather than assumed. So the notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-022/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`, and **no `finding` is written** — none is admissible on
this task (no §14 gate exists to issue a `§14-gate#<id>` stamp; `context.human_admission` is `off`,
so no `human:<name>` stamp exists either). No `index.md` / `index.jsonl` is hand-faked.

`at` is taken from `date -u`, never from a local clock or a test runner's `Start at` line. This
machine is **UTC+3**: `date -u` read `19:31:01Z` against local `22:31:01 +0300` at the start of this
hop.
