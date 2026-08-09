---
task: ticket-to-pr-ABC-009
subtask: bapm-abc009-a11-verify
role: ba-pm
claimed_at: 2026-08-09T14:42:57Z
claimed_by: ba-pm
method: MANUAL-BY-HAND
outcome: |
  A11 IS MET, AND THE MARKER IS RETIRED ON THIS ROLE'S OWN INSTRUMENTS — not on QE's table and not
  on the Orchestrator's rebuild. The mutant set was derived from A11's own TEXT (every own non-KING
  type on the king's home square, every own non-ROOK type on the rook's), so agreement with QE is
  evidence rather than an echo.

  17 mutants of the delivered diff, ONE OS PROCESS PER TREE STATE: 12 killed, 4 survived, 0 verdict
  mismatches, 0 broken builds, plus one deliberate no-op HARNESS-ERROR control that fired as
  required. All NINE single own-piece-type admissions die, and the three that previously passed the
  ENTIRE net die to A11's rows ALONE (acceptance 33/33, hardening 32/34, two rows each). Two
  colour/side-conditional admissions die. FOUR behaviour-equivalence controls (colour-blind king,
  rook, both, and king-guard continue->break) SURVIVE 371/371 — so the rows pin observable
  behaviour, not implementation shape.

  A11's EXHAUSTIVENESS CLAUSE re-derived on this role's own parseFen domain probe rather than on the
  suite's: 26 letters x 2 cases x 4 probe boards gives exactly six piece types; the king's-square
  table covers all five non-KING types and the rook's all four non-KING/non-ROOK types, nothing
  missing and nothing extra; all four rights and both sides to move in each table; every type in at
  least two configurations; and all 22 rows re-derived independently of expectImpostorSetup with
  ZERO labels lying about their own FEN. THE QUANTIFIER ITSELF WAS FALSIFIED, not trusted: three
  deliberate corruptions of the suite file in a scratch copy (drop both rows of a type, drop one,
  relabel one) all go red. A11's own excluded shape re-measured: parseFen refuses two same-colour
  kings on all three constructions.

  BOTH MEASUREMENT TRAPS DISCHARGED. One process per tree, and the tell is that the harm output
  DIFFERS per tree (this role's second-hop probe ran four trees in one process and the module cache
  served pristine moves.ts to all four). And the instrument verified before a red is believed: this
  hop's first three equivalence controls DID NOT COMPILE under noUncheckedIndexedAccess, and the
  harness scored them BROKEN-BUILD instead of letting me report three dead controls and conclude
  A11's rows over-fit.

  CLEARED: A11's ⚠️ NOT YET SATISFIED marker; the ## Acceptance preamble's A11-shortfall sentence;
  the preamble's "currently-failing / today" framing, pinned instead to main at aad6d48 (pre-fix md5
  fb4fa40934e768dffeaeed0b43548842) with the branch-tip state beside it; correction-block item 8's
  stale heading clause, STRUCK not deleted and closed with a dated amendment; and the
  Definition-of-Ready amendment's live "not every criterion is satisfied" claim, by appended dated
  amendment. No tick was flipped. No criterion, count, FEN or parenthetical was edited.

  ONE NEW GAP FOUND, NAMED, AND NOT ACTED ON — the fourth class QE told this board to expect, on the
  occupant's COLOUR rather than its type. A11's enemy-colour EXCLUSION is measurably FALSE for two
  types: 12 enemy-occupant mutants show enemy KING/QUEEN/ROOK genuinely masked by the through-check
  test and enemy BISHOP killed by A5 row 3 and A6 row 4, but ENEMY KNIGHT and ENEMY PAWN on either
  home square SURVIVE 371/371 WITH THE HARM LIVE — one legalMoves call on
  4k3/8/8/8/8/8/8/K3n2R w K - 0 1 destroys the BLACK knight and writes a WHITE king over it, and on
  4k3/8/8/8/8/8/8/4K2n w K - 0 1 the position is byte-identical so only the illegal offer witnesses
  it. The ticket's own A5/A6 enemy-bishop rows already contradicted the masking claim and nobody had
  read them that way. NO CRITERION WAS ADDED and NO TEST ROW WAS WRITTEN; the false clause was
  corrected because as written it instructed the next reader NOT to add the four missing rows. Four
  rows in QE's existing table would close it at zero production lines (A11's own doubling logic
  implies eight) — THE ROUTING IS THE ORCHESTRATOR'S.

  NO src/ EDIT: git status --short -- src/ empty, src/moves.ts still
  0e247853ab2c05887c76105ff83d8621, 0 of 14 pre-existing test files modified (each diffed
  individually against main). NO BOARD MOVE — ABC-009 stays in Ready for UAT 1/4 and plans/board.md
  was not edited. ABC-022, ABC-010, ABC-011, ABC-018 and plans/nfr-catalog.md NOT edited. A7, A12,
  guard ordering and NFR-001 NOT re-litigated. The traceability 11-cell report stays withdrawn, and
  this hop's own trace edit was verified the corrected way: all 31 rows at ten cells counting
  UNESCAPED pipes before and after, exactly one row line changed. NOTHING MERGED, NOTHING DEPLOYED.

  GATES ON THE TIP, RE-RUN BY THIS ROLE RATHER THAN INHERITED: npm test 371 passed (371) on 16
  files, skip count 0 by the AGENTS.md command. No perft, deep-lane or throughput figure is this
  role's — none was run, at any of its three hops.

  NO TICKET CUT for ABC-018's frontmatter drift, and that is a judgement with a written trigger: it
  is a one-line defect already named in the routing note, ABC-009's close is the next event, and if
  that close ALSO misses the frontmatter step it stops being a one-off and deserves a process item.

  FIVE NOTES PUBLISHED, hand-written in the contract's exact shape (task total now 45):
  20260809T150110Z-ba-pm-observation-99f3d5f3 (A11 verified independently),
  20260809T150210Z-ba-pm-observation-cf01de8b (the fourth class: the occupant's colour),
  20260809T150310Z-ba-pm-decision-ae3dd4c9 (A11 MET, what was cleared, what was refused),
  20260809T150410Z-ba-pm-claim-20ace988 (soft results, UNKNOWN - verify, including my own
  non-compiling controls), 20260809T150510Z-ba-pm-artifact-ref-a1e31e61 (this hop's artifacts).
  NO FINDING — none is admissible on this task (no §14 gate to issue a §14-gate#<id> stamp;
  context.human_admission is off). Nothing self-stamped; no index.md / index.jsonl hand-faked.

  THIS ROLE DID NOT ENQUEUE and does not certify its own output. Next is the Orchestrator's: the UAT
  ruling (deferred to EPIC-006, explicitly NOT passed), merge under the owner's standing directive
  with gates recorded on the branch tip before and on main after, close to Done INCLUDING the ticket
  frontmatter — and a routing decision on the named enemy-colour gap.
moved: pending/ -> claimed/ticket-to-pr-ABC-009-bapm3/ -> done/ticket-to-pr-ABC-009-bapm3/ — ALL BY
  HAND (no scripts/claim.js in this install or in the kit, re-checked at the source; the claim dir was
  created with a plain mkdir, still atomic and still EEXIST on a second writer, and it exited 0 so this
  claim was the first; both transitions were `mv`, the atomic rename Workflow 17 steps 3 and 5
  specify). The whole claim directory moves, keeping this registry record beside the subtask file —
  the shape every prior done/ subtask on this board uses.
---

# Claim record — the now-running registry entry

Queue claim taken BY HAND. `scripts/claim.js` does not exist in this repository or in the kit
root — re-checked at the source this hop, not trusted from the subtask brief: `ls scripts` and
`ls /Users/olgeroeselg/.grugops/agent-factory/scripts` both absent, and a `find` for
`claim*.js` / `claim*.ts` / `context-io*` across the repository and the kit returns no hits.
`tools/grugops/` holds only `reference-check.js` and `test-skip-integrity.js`.

The claim is the atomic `mkdir(2)` of this directory — the same primitive Workflow 17's
`claimTask` relies on — so the exactly-once property is unchanged; the missing script is the
deviation, recorded rather than presented as compliance. `pending -> claimed -> done` by plain
`mv`. `pending/` held exactly one file and `claimed/` was empty at the start, so queue width was 1
and no contention was possible: **the claim is degenerate**, recorded rather than glossed, as every
prior subtask on this board recorded it.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent — the MCP tool is not in this session's tool set either, checked against the tools actually
available rather than assumed. So this role's notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-009/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`, and **no `finding` is written** — none is admissible on
this task.

`at` was taken from `date -u`, never from a test runner's `Start at` line. This machine is UTC+3
(`date -u` read `14:42:57Z` against local `17:42:57+0300`).
