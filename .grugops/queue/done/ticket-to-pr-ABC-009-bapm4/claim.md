---
task: ticket-to-pr-ABC-009
subtask: bapm-abc009-bytespace
role: ba-pm
claimed_at: 2026-08-09T15:18:03Z
claimed_by: ba-pm
method: MANUAL-BY-HAND
outcome: |
  A13 ADDED AS A FULL-BYTE-SPACE QUANTIFIER. A11 NOT WIDENED, NOT REOPENED. The sample-class
  sequence is ended by an argument written into the ticket, not by hope that no fifth class exists.

  WHY A13 RATHER THAN WIDENING A11 IN PLACE: widening it would flip a criterion the board certified
  one hop ago from MET back to NOT MET, destroying the record of the independent verification that
  existed precisely because QE refused to certify its own rows — and making A11's own retirement
  note self-contradictory, marker off and back on in one file on one day. The subjects also differ:
  A11's is piece TYPE over the mover's OWN pieces; A13's is the occupant BYTE (type x colour, plus
  EMPTY). A13 SUBSUMES A11 and carries a value-by-value DISCHARGE MAP, which is why it costs two
  values' worth of rows instead of twelve. A11 keeps its domain, its rows and its MET verdict; A13
  carries the one open ⚠️ marker, so QE's next hop discharges exactly one.

  THE EXHAUSTIVENESS ARGUMENT, STATED IN THE TICKET SO IT CAN BE CHECKED RATHER THAN INHERITED: a
  home square holds ONE BYTE; parseFen can put exactly 13 values in it; 1 is correct; so 12 wrong
  values per square IS THE ENTIRE SPACE, and each of the twelve falls in EXACTLY ONE of six buckets
  — absence row (A3/A4), A11's own-type quantifier, an existing enemy row (A5 row 3 / A6 row 4),
  NEWLY REQUIRED (enemy KNIGHT, enemy PAWN), measured-behaviour-equivalent-and-EXCLUDED (enemy
  KING/QUEEN/ROOK), or NOT CONSTRUCTIBLE (own KING on the rook's square). There cannot be a fifth
  region inside this dimension because the space was counted, not sampled.

  THE 13 IS MEASURED, NOT ASSERTED — AND MY FIRST INSTRUMENT SAID 11. A probe over every code point
  0x00-0x2FF as a placement character on e1, h1 and a1 returns exactly 13 distinct bytes per square,
  THE SAME 13 ON ALL THREE, each with a named witness character. The first version returned 11
  because its single probe board already held a white king, so K on e1 raised "exactly one white
  king, found 2": a limit of the probe board reported as a fact about the domain. Had I written the
  criterion on that reading it would have quantified over 11 values and dropped both KING bytes, one
  of which is the REQUIRED value on the king's square.

  I CORRECTED THE ROUTED ACCOUNTING FROM FIVE BUCKETS TO SIX, and this is the substantive finding
  of the hop rather than a quibble. NOT CONSTRUCTIBLE needs its own named slot: the mover's own KING
  on the ROOK's home square while the king is also home needs two kings of one colour and parseFen
  refuses it on all FOUR constructions (both colours, both sides; hop 3 measured three). It is
  neither behaviour-equivalent nor covered by any row, and folding it into the equivalence bucket
  would have been a silent omission of exactly the shape that produced four consecutive misses. The
  two squares also PARTITION DIFFERENTLY — on the rook's square own ROOK is the REQUIRED value, not
  a wrong one, and own KING is a wrong value the king's square does not have — so the sums are
  1+5+1+2+3 and 1+4+1+1+2+3, both 12. The conclusion is unchanged; the correction strengthens it.

  THE EQUIVALENCE EXCLUSION IS NOW MEASURED ON TWO INDEPENDENT INSTRUMENTS THAT AGREE 12/12. The
  Orchestrator recorded that it re-derived none of those three values, and mutation survival is an
  ABSENCE of signal — the weakest evidence. So I asked the MECHANISM directly: isSquareAttackedBy
  over the kingside kingPath ([4,5,6], read verbatim from src/moves.ts:283), POLARITY-CHECKED BEFORE
  ANY VERDICT WAS READ (a black rook on h1 must report g1 attacked; a position with no black
  attacker must report it not attacked). MASKED for exactly KING/QUEEN/ROOK and not masked for
  exactly BISHOP/KNIGHT/PAWN, in precise agreement with hop 3's mutation verdicts, with the
  mechanism now named per row (enemy KING masks via f1 on e1 and via g1 on h1; QUEEN/ROOK rake the
  rank). The exclusion is written down WITH ITS REASON, which is what separates an exclusion from an
  omission.

  QE OWES EIGHT ROWS AND ZERO PRODUCTION LINES: enemy KNIGHT and enemy PAWN, both home squares, at
  A11's established doubling (every type in >=2 configurations, both sides to move, all four
  rights). All eight measured here on the delivered tree with each row's SETUP ASSERTED rather than
  trusted from its label (0/8 lie about their own FEN) and each checked NOT INERT (0/8 masked or
  blocked, so the identity guard is the only thing refusing each): 13, 14, 17, 19 on the king's
  square and 4, 5, 4, 5 on the rook's. PLUS A MEASURED WARNING PASSED TO QE RATHER THAN LEFT FOR IT
  TO DISCOVER: on the king's square enemy BISHOP, KNIGHT and PAWN ALL answer 13 moves, and on the
  rook's square enemy PAWN, enemy BISHOP AND THE EMPTY SQUARE all answer 5 — so a row asserting only
  its count is interchangeable with rows for two other byte values and a mislabelled row would pass
  green. The occupant-byte setup assertion is load-bearing on exactly these values.

  DO I AGREE THE SPACE IS EXHAUSTED? YES for the dimension A13 quantifies over — the occupant byte
  of one home square under that square's own precondition — and THERE IS NO THIRTEENTH REGION INSIDE
  IT. I explicitly DO NOT claim the criteria set is complete, because that blanket reading is this
  ticket's signature defect and I will not add a fifth instance of it. THREE REGIONS OUTSIDE THE
  DIMENSION ARE NAMED RATHER THAN OMITTED: (i) Position.board is a Uint8Array, so a square physically
  holds 256 values and 243 of them are NEVER WRITTEN BY parseFen (7, 8, 15 and everything >=16) — no
  FEN produces them, so no Given clause in this ticket's language can reach them and a criterion
  would be unfalsifiable for the same structural reason as the equivalence set; this is the region a
  naive "one byte = 256 values" reading would call a thirteenth, and it is not one; (ii) the JOINT
  13x13 pair space, inert for the delivered code because addCastlingMoves tests the two squares with
  two INDEPENDENT byte compares (src/moves.ts:326-327) so per-square correctness implies joint
  correctness by construction, though a pair-conditional mutant could survive any finite net;
  (iii) the constants no criterion varies (non-moving king always e8/a8, empty en-passant square,
  halfmoveClock 0) and the empty-set squares. UNDER THE STOPPING RULE (ii) AND (iii) BELONG TO A
  FOLLOW-UP HARDENING TICKET FOR src/moves.ts, NOT ANOTHER ABC-009 HOP, and I support that rule.

  TWO INSTRUMENT FAILURES AT THIS HOP, BOTH CAUGHT, BOTH BY PRINTING THE INPUT. (1) The byte-domain
  probe returning 11 instead of 13. (2) The accounting probe reporting own KING on the rook's square
  as "constructible" via 4k3/8/8/8/8/8/8/7K w K - 0 1 — a FEN that puts the king ON h1 WITH e1 EMPTY,
  which is A4's shape, NOT the excluded configuration. Both are the trap this ticket has now recorded
  in four different costumes: an instrument answered a question adjacent to the one asked and its
  output was plausible. The defence that worked both times was cheap — print the input, not just the
  verdict. NO MUTATION WAS RUN AT THIS HOP, so the one-process-per-tree trap did not arise and none
  of my numbers are mutation results; the mutation evidence A13 cites is hop 3's and the
  Orchestrator's, attributed to them.

  STALE STATEMENTS MY OWN EDIT CREATED, ALL CORRECTED IN PLACE WITH A DATE rather than shipped: the
  ## Acceptance preamble's "every criterion A1-A12 is green" and its "A11 was the one criterion this
  ticket ever carried unsatisfied"; A11's pointer to an unrouted gap; the retirement note's "this one
  is no more the last than any before it" (LEFT AS WRITTEN AND EXPLICITLY FALSIFIED BESIDE IT,
  because it was true when written and its falsification is the whole point); and the
  Definition-of-Ready block's "every criterion A1-A12 is now green". NO TICK WAS FLIPPED — acceptance
  measurable stays ✅, since DoR asks whether the ticket was PULLABLE and "measurable" is a property
  of how criteria are written, not a claim that all are currently green. DELIBERATELY NOT CORRECTED
  AND NAMED AS A JUDGEMENT: the "survives all twelve criteria" phrases in ## Implementation, ## QE
  and ## Security / NFR are other roles' sections and historical records of the set as it stood when
  they ran; the seam those roles honoured by not editing ## Acceptance is honoured back, and one
  dated statement at the head of ## Acceptance fixes the reading of all of them.

  NO src/ EDIT: git status --short -- src/ empty, src/moves.ts still
  0e247853ab2c05887c76105ff83d8621 — unchanged across FIVE hops now. NO TEST ROW WRITTEN (QE's file,
  QE's hop). NO BOARD MOVE — ABC-009 stays Ready for UAT 1/4, plans/board.md not edited. ABC-022,
  ABC-010, ABC-011, ABC-018 and plans/nfr-catalog.md NOT edited. A7, A12, guard ordering and NFR-001
  NOT re-litigated. A11's own-type rows and MET verdict UNTOUCHED. The traceability 11-cell report
  stays closed. Size S and priority P1 unmoved — A13 adds no requirement and asks for no production
  change. NOTHING MERGED, NOTHING DEPLOYED.

  TRACEABILITY: ONE ROW (ABC-009), ONE CELL (Status), verified the corrected way — 31 table rows at
  ten cells counting UNESCAPED pipes before and after, exactly one row LINE changed, exactly one CELL
  changed (index 10 = Status), one non-table header line added, and every added string asserted
  pipe-free BEFORE writing. reference-check.js reports No findings on both edited plans files.

  GATES ON THE TIP, RE-RUN BY THIS ROLE AND NEVER INHERITED: npx vitest run 371 passed (371) on 16
  files; skip count 0 by the AGENTS.md command. Twelve of thirteen criteria green — A13 is the
  thirteenth and it owes test rows, not production lines. No perft, deep-lane, coverage or throughput
  figure is this role's at any of its four hops.

  FIVE NOTES PUBLISHED, hand-written in the contract's exact shape (task total now 51):
  20260809T152740Z-ba-pm-observation-22f5359e (the 13 measured, and the probe that said 11),
  20260809T152810Z-ba-pm-observation-da1be0db (equivalence on a second instrument 12/12; the eight
  configurations; the interchangeable-count warning),
  20260809T152840Z-ba-pm-decision-71ce381e (A13 not a widened A11; the exhaustiveness argument; the
  five-to-six bucket correction; the three regions outside the dimension),
  20260809T152910Z-ba-pm-claim-edebf200 (soft results at UNKNOWN - verify, both instrument failures),
  20260809T152940Z-ba-pm-artifact-ref-7c6ef27a (artifacts). NO FINDING — none is admissible on this
  task (no §14 gate to issue a §14-gate#<id> stamp; context.human_admission is off). Nothing
  self-stamped; no index.md / index.jsonl hand-faked.

  THIS ROLE DID NOT ENQUEUE and does not certify its own output. Next is QE's hop (the eight rows),
  then the Orchestrator's: the UAT ruling (deferred to EPIC-006, explicitly NOT passed), merge under
  the owner's standing directive with gates recorded on the branch tip before and on main after, and
  the close to Done INCLUDING THE TICKET FRONTMATTER — the ABC-018 drift trigger fires on that step.
moved: pending/ -> claimed/ticket-to-pr-ABC-009-bapm4/ -> done/ticket-to-pr-ABC-009-bapm4/ — ALL BY
  HAND (no scripts/claim.js in this install or in the kit, re-checked at the source: the repository has
  no scripts/ directory at all. The claim dir was created with a plain mkdir, still atomic and still
  EEXIST on a second writer, and it exited 0 so this claim was the first; both transitions were `mv`,
  the atomic rename Workflow 17 steps 3 and 5 specify). The whole claim directory moves, keeping this
  registry record beside the subtask file — the shape every prior done/ subtask on this board uses.
---

# Claim record — the now-running registry entry

Queue claim taken BY HAND. `scripts/claim.js` does not exist — **re-checked at the source this hop
rather than trusted from the subtask brief**, which is what the brief asked for: the repository has
no `scripts/` directory at all (`ls` of the repo root lists `AGENTS.md`, `biome.json`, `CLAUDE.md`,
`coverage`, `memory-bank`, `node_modules`, `package-lock.json`, `package.json`, `plans`, `spike`,
`src`, `tools`, `tsconfig.json` — no `scripts`), and a `find` for `claim.js` / `context-io*` across
the repository returns no hits. The kit root `/Users/olgeroeselg/.grugops/agent-factory` exists and
holds no `scripts/` either.

The claim is the atomic `mkdir(2)` of this directory — the same primitive Workflow 17's `claimTask`
relies on — so the exactly-once property is unchanged; the missing script is the deviation, recorded
rather than presented as compliance. `pending -> claimed -> done` by plain `mv`, the atomic rename
Workflow 17 steps 3 and 5 specify.

`pending/` held exactly one file and `claimed/` was empty at the start, so queue width was 1 and no
contention was possible: **the claim is degenerate**, recorded rather than glossed. `queue.wip_limit`
3 and `claim_cap` 2 are both respected at 1. No stale-claim sweep was owed (`claimed/` empty), and
the sweep is the coordinator's in any case.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent — the MCP tool is **not** in this session's tool set, checked against the tools actually
available rather than assumed. So this role's notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-009/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`, and **no `finding` is written** — none is admissible on
this task (no §14 gate exists in this install to issue a `§14-gate#<id>` stamp, and
`context.human_admission` is `off`, so no `human:<name>` stamp exists either).

`at` was taken from `date -u`, never from a test runner's `Start at` line. This machine is **UTC+3**:
`date -u` read `15:18:03Z` against local `18:18:03 EEST`. The ordering warning in the subtask brief
is confirmed at the source — `20260809T141500Z-orchestrator-decision-865b06ae` has an mtime of
`14:12` local, i.e. `11:12Z`, so its `Z` label carries local time and it is superseded by
`20260809T114649Z-orchestrator-decision-700d4a44` exactly as the brief says.
