---
task: ticket-to-pr-ABC-009
subtask: bapm-abc009-criteria-text
role: ba-pm
claimed_at: 2026-08-09T13:33:08Z
claimed_by: ba-pm
method: MANUAL-BY-HAND
---

Claimed BY HAND. The reason was re-checked at the source rather than taken from the subtask file's
word or from any of the twenty-eight prior notes: `ls scripts` → `No such file or directory` in the
repo, `ls /Users/olgeroeselg/.grugops/agent-factory/scripts` → the same in the kit (whose top level
is `_commit-convention.md`, `checklists/`, `config/`, `contracts/`, `examples/`, `handoffs/`,
`packaging/`, `README.md`, `roles/`, `seed/`, `VERSION`, `workflows/` — no `scripts/`), and a `find`
for `claim*.js` / `context-io*` across both trees returned **nothing**. `tools/grugops/` holds only
`reference-check.js` and `test-skip-integrity.js`. So Workflow 17 step 2's atomic `claimTask` could
not be executed.

The claim directory was created with a plain `mkdir` — still atomic, still `EEXIST` on a second
writer; `mkdir` exited **0**, so this claim is the first — and this registry record was written into
it. `pending/…md` → `claimed/…/…md` was a plain `mv` (the atomic rename Workflow 17 step 3
specifies). `pending/` held exactly one file and `claimed/` was empty at the start, so queue width is
1 and no contention was possible: **the claim is degenerate**. Recorded rather than glossed, exactly
as every prior subtask on this board recorded it.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent — the MCP tool is not in this session's tool set either, checked against the tools actually
available rather than assumed. So this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-009/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`. **No `finding` is written — none is admissible on this
task, because there is no §14 gate here to issue a `§14-gate#<id>` stamp and
`context.human_admission` is `off`, so no `human:<name>` stamp is available either. Nothing is
self-stamped.** No derived `index.md` / `index.jsonl` was hand-faked, because the renderer that
produces them does not exist here.

DEPENDENCY CHECKED AT THE SOURCE, not taken from the activating prompt:
`.grugops/queue/done/ticket-to-pr-ABC-009-bapm/`, `…-dev/`, `…-qe/` and `…-sec/` all exist and each
carries its own `claim.md`. The chain into this second BA/PM hop is satisfied.

TIMESTAMP: every `at` in this record and in this role's notes came from `date -u`
(`2026-08-09T13:33:08Z`), never from a test runner's `Start at` line. The trap was confirmed live in
this hop: `date` reads `16:33:26 EEST` against `date -u`'s `13:33:26Z` — **UTC+3**. This is the
standing instruction from `20260809T114649Z-orchestrator-decision-700d4a44` §1, which supersedes
`20260809T141500Z-orchestrator-decision-865b06ae` (that note carries LOCAL time labelled `Z`).
Replay order in `at` terms: 10:32:47Z → 11:01–11:07Z → 11:39–11:43Z → 11:46:49Z → 12:32–12:37Z →
12:48:39Z → 13:11–13:16Z → 13:28:47Z → this hop.

## Read before acting

All **twenty-eight** prior notes in `.grugops/context/ticket-to-pr-ABC-009/notes/` were read in
full, at the source, in `at` order, before any ruling was formed and before a single edit was made:
the Orchestrator's five (routing + AMBER DoR; the superseded local-time note; the timestamp
correction + implementation verification; the QE acceptance with the `A7` "carry it loudest"
instruction and the traceability-defect flag; the Security/NFR acceptance and this hop's brief),
this role's own five from the first hop, the Engineer's six, QE's six, and Security/NFR's six.

Then, and deliberately NOT on their authority: the full ticket
`plans/tickets/ABC-009-legalmoves-position-mutation.md` including `## Acceptance` `A1`–`A10`, the
correction block, `## Scope`, `## Out of scope`, `## Test notes`, `## Implementation`, `## QE` and
`## Security / NFR`; the two castling test files; `plans/board.md`; `plans/traceability.md`;
`AGENTS.md`; `.grugops/factory.config.json`; and the kit's `roles/ba-pm.md`,
`workflows/07-backlog-refinement.md`, `16-context-read-write.md`, `17-task-claim.md`,
`checklists/definition-of-ready.md`, `contracts/context-note.md` and `_commit-convention.md`.

**Nothing measured by an earlier role is inherited without re-derivation at the source.** The
routed items were re-checked against the artifacts they describe — the criteria text, the test
files, and the mutant results the notes report — rather than accepted from the brief.

---
completed_at: 2026-08-09T13:58:00Z
outcome: |
  DONE. ABC-009's criteria text closed at a SECOND BA/PM hop. NO BOARD MOVE — ABC-009 STAYS IN
  `Ready for UAT` 1/4 and plans/board.md was NOT edited. ZERO production lines and ZERO test lines:
  git status --short -- src/ is empty and src/moves.ts still hashes
  0e247853ab2c05887c76105ff83d8621. ABC-022, ABC-010, ABC-011, plans/nfr-catalog.md, AGENTS.md and
  both castling test files NOT edited. NOTHING MERGED, NOTHING DEPLOYED.

  TWO STATE FILES EDITED. (1) plans/tickets/ABC-009-...md — FOUR sections changed, ELEVEN
  byte-identical, verified by hashing each section before and after: ## Acceptance (277 -> 521 lines),
  ## Test notes (48 -> 78), ## Size and priority rationale (+9), ## Definition of Ready (+10).
  ## Implementation, ## QE and ## Security / NFR are BYTE-IDENTICAL — the seam QE and Security/NFR
  honoured by not editing the criteria is honoured back. (2) plans/traceability.md — ONE ROW
  (ABC-009), TWO CELLS (Tests, Status) plus one prepended _Updated: line, edited at FIELD level with
  every added string asserted to contain no unescaped pipe; THAT ASSERTION FIRED ONCE on a bare pipe
  in my own draft. 31 table rows, all at 10 cells counting UNESCAPED pipes before and after, zero
  rows whose count changed.

  RULINGS, each with the alternative it rejected, on ten mutants of the DELIVERED diff run in a copy
  outside the repository (anchors asserted unique, bytes asserted changed, typecheck per mutant,
  re-hash after every restore):

  G-1 (piece type) — AGREED AND THE GAP IS WIDER THAN IT WAS ROUTED. A11 added, QUANTIFIED over every
  own piece type on both home squares. QE's queen rows closed the QUEEN INSTANCE, not the dimension:
  reading the KING's square as "own KING or own ROOK", or as "own KING or own PAWN", or the ROOK's
  square as "own ROOK or own PAWN" each passes 33/33 acceptance, 19/19 hardening AND 356/356 full
  suite at skip 0, and the first also passes PERFT_DEEP=1 at 32/32 exact. Only the own-KNIGHT
  admission dies (32/33, to A6's knight row). The DELIVERED CODE satisfies every A11 row — measured
  over the full own-piece-type space, parseFen accepting all of it — so A11 asks for NO behaviour
  change, only ~9 test rows in QE's existing table-driven file. A11 IS THEREFORE NOT YET SATISFIED
  AND THIS TICKET IS NOT CLOSEABLE TODAY; that is stated in the ticket, the trace row and the notes
  in the same words. REJECTED: scope A11 down to the three covered types and carry the hole as a
  risk — it would perform this ticket's own defect on itself, with three live counter-examples in
  hand. REJECTED: write the rows myself — BA/PM writes no test.

  G-2 (rights held) — AGREED. A12 added, AND WITH AN ORDERING CLAUSE THE ROUTED STATEMENT DID NOT
  HAVE. continue -> break on the rook guard deletes a legal castle ONLY when the loop meets the
  INVALID option FIRST: R3K3 w KQ goes 16/[e1c1] -> 15/[] while the mirror row 4K2R w KQ is
  indistinguishable from correct, so exactly THREE of QE's six rows discriminate anything. A
  criterion saying only "one right valid, one bogus" is HALF INERT. A12 requires the invalid option
  earlier in generation order and the survivor asserted BY NAME. QE's rows satisfy it; NO new
  coverage owed for G-2. REJECTED: pin the king-guard break for symmetry — measured equivalent
  (shared kingFrom), passes all 33 + all 19, so a criterion would be unfalsifiable.

  A7 — KEPT, RECLASSIFIED, AND ITS JUSTIFICATION RETIRED AS FALSE. Re-measured at 0 kills of 10
  further mutants (0 of QE's 62), inert BY CONSTRUCTION: its population is legally reachable and the
  two guards never fire there (198,175 executions each, 0 rejections). REJECTED: delete it — taken
  seriously, refused because the measurement says inert against THIS class, it is the suite's only
  purity walk over LEGAL positions, and it was ABSENT rather than failing before this ticket. What IS
  deleted is the claim: ## Test notes 2's "the guard that would have caught the defect originally" is
  WITHDRAWN AS FALSE — the original defect also needed a semantically-invalid position, and the
  Engineer's own red-before-green record (10 of 33 green on the UNFIXED tree = 4 controls + 6 A7 rows)
  already proved A7 green on the broken code. Nobody had connected that figure to the claim. Recorded
  as the SECOND criterion on this project whose protective value was assumed rather than measured,
  tied to the 100%-coverage precedent in ## Problem.

  RIGHT-TEST LANE — no criterion (not one of the two BOARD preconditions this ticket owns), no
  ticket; one ## Test notes line so QE's two no-right rows are not deleted as "not in the acceptance".
  GUARD ORDERING — no criteria text and none is POSSIBLE: permutation invariance means no test could
  ever fail on a reorder, so a criterion would be unfalsifiable (third such refusal on this ticket),
  and the cost half is ~0.003%, below the instrument's floor. REJECTED: write the 18x
  invalid-input figure in as an NFR bar.

  THE TRACEABILITY "RENDERING DEFECT" IS WITHDRAWN AND NO TICKET WAS CUT, because it does not exist.
  Counting UNESCAPED pipes, every row of plans/traceability.md has exactly 10 cells in ALL EIGHT
  commits that ever touched the file; the ABC-011 and ABC-015 rows carry one correctly ESCAPED \|
  inside a quoted shell pipeline, and the row's own author documented it on 2026-08-08 as "TEN cells
  (12 raw pipes, one escaped)". The 11-vs-10 report is an artefact of counting RAW pipe characters.
  NEITHER ROW WAS EDITED — removing that escape is the one change that WOULD corrupt them. Third
  instance on this ticket of a number believed rather than re-derived.

  SIZE AND PRIORITY RE-CHECKED AT THE SOURCE AND BOTH UNMOVED: S (2) — the two new criteria add no
  production requirement and nine test rows do not move a size that already carried thirty-three;
  P1 on the owner's legality-first directive. ESCALATION TRIGGER STILL UNFIRED ON BOTH CLAUSES:
  ABC-010 reads status backlog / column Backlog / size M / priority P1 and sits in Backlog on the
  board, neither deferred nor descoped, and there is still no CLI entry point.

  GATES RE-DERIVED ON THE TIP BY THIS ROLE RATHER THAN INHERITED: npm test 356 passed (356) on 16
  files, skip count 0 by the AGENTS.md command. Fifteen A1-A6 counts re-derived a SIXTH time, no
  discrepancy, nothing adjusted.

  FIVE NOTES PUBLISHED, hand-written in the contract's exact shape (task total now 33):
  20260809T135300Z-ba-pm-observation-ce4c1916 (ten mutants; A7 inert; G-1 wider; G-2 order-dependent),
  20260809T135400Z-ba-pm-observation-264b83fa (the trace defect withdrawn on measurement),
  20260809T135500Z-ba-pm-decision-0dabbcb7 (the six rulings with rejected alternatives),
  20260809T135600Z-ba-pm-claim-aa1e4fc2 (soft results, UNKNOWN - verify, including a probe of my own
  that was WRONG and how it was caught), 20260809T135700Z-ba-pm-artifact-ref-25da8404 (this hop's
  artifacts). NO FINDING — none is admissible on this task (no §14 gate to issue a §14-gate#<id>
  stamp; context.human_admission is off). Nothing self-stamped; no index.md / index.jsonl hand-faked.

  NEXT HOP IS THE ORCHESTRATOR'S: ~9 test rows for A11 in QE's file before ABC-009 closes, or a
  ruling otherwise with the measurement in front of it. THIS ROLE DID NOT ENQUEUE and does not
  certify its own output.
moved: pending/ -> claimed/ticket-to-pr-ABC-009-bapm2/ -> done/ticket-to-pr-ABC-009-bapm2/ — ALL BY
  HAND (no scripts/claim.js in this install or in the kit, re-checked at the source; the claim dir was
  created with a plain mkdir, still atomic and still EEXIST on a second writer, and it exited 0 so this
  claim was the first; both transitions were `mv`, the atomic rename Workflow 17 steps 3 and 5
  specify). The whole claim directory moves, keeping this registry record beside the subtask file —
  the shape every prior done/ subtask on this board uses.
