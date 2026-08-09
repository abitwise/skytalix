---
task: ticket-to-pr-ABC-009
subtask: sec-abc009-nfr
role: security-nfr
claimed_at: 2026-08-09T12:52:40Z
claimed_by: security-nfr
method: MANUAL-BY-HAND
---

Claimed BY HAND. The reason was re-checked at the source rather than taken from the subtask file's
word or from any of the twenty-one prior notes: `ls scripts` → `No such file or directory` in the
repo, `ls /Users/olgeroeselg/.grugops/agent-factory/scripts` → the same in the kit (whose top level
is `_commit-convention.md`, `checklists/`, `config/`, `contracts/`, `examples/`, `handoffs/`,
`packaging/`, `README.md`, `roles/`, `seed/`, `VERSION`, `workflows/` — no `scripts/`), and a `find`
for `claim*` / `context-io*` across both trees returned only this queue's own `claim.md` records and
nothing executable. So Workflow 17 step 2's atomic `claimTask` could not be executed.

The claim directory was created with a plain `mkdir` — still atomic, still `EEXIST` on a second
writer; `mkdir` exited **0**, so this claim is the first — and this registry record was written into
it. `pending/…md` → `claimed/…/…md` was a plain `mv` (the atomic rename Workflow 17 step 3
specifies). `pending/` held exactly one file and `claimed/` was empty at the start, so queue width is
1 and no contention was possible: the claim is degenerate. Recorded rather than glossed, exactly as
every prior subtask on this board recorded.

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
`.grugops/queue/done/ticket-to-pr-ABC-009-bapm/`, `.grugops/queue/done/ticket-to-pr-ABC-009-dev/` and
`.grugops/queue/done/ticket-to-pr-ABC-009-qe/` all exist and each carries its own `claim.md`. The
chain into this gate is satisfied.

TIMESTAMP: every `at` in this record and in this role's notes came from `date -u`
(`2026-08-09T12:52:40Z`), never from a test runner's `Start at` line. The trap was confirmed live in
this hop: `date` reads `15:52:40 EEST` against `date -u`'s `12:52:40Z` — **UTC+3**. This is the
standing instruction from `20260809T114649Z-orchestrator-decision-700d4a44` §1, which supersedes
`20260809T141500Z-orchestrator-decision-865b06ae` (that note carries LOCAL time labelled `Z`; the
superseding note's §1 explains it, and the replay order in `at` terms is 10:32:47Z → 11:01–11:07Z →
11:39–11:43Z → 11:46:49Z → 12:32–12:37Z → 12:48:39Z → this hop).

## Read before acting

All **twenty-one** prior notes in `.grugops/context/ticket-to-pr-ABC-009/notes/` were read in full,
at the source, in `at` order, before any gating judgement was formed and before a single command was
run: the Orchestrator's four (routing + the AMBER Definition-of-Ready pass; the superseded local-time
note; the timestamp correction + implementation verification; the QE acceptance + Security/NFR
routing), BA/PM's five (the three leaking families and twelve rows, the seven-build mutant campaign,
the seven acceptance defects, the soft results, the artifact ref), the Engineer's six (the fix site
and three rejected alternatives, the gates as they ran with all fifteen counts, the five mutants with
the colour-blind equivalence over 9,604 boards, `NFR-001`/`A10` with the null-control twin, the soft
results, the artifact ref), and QE's six (62 mutants / 47 killed / 15 survived, the fifth mutant
adjudicated, the five defects surviving all of `A1`–`A10`, the PASS-WITH-RISKS decision with seven
risks, the soft results, the artifact ref).

**The two questions routed to this gate BY NAME were found in the notes rather than in the activating
prompt**: guard ordering as gate-unverifiable (`20260809T123500Z-qe-e2e-decision-634cb408` risk 4,
with its mechanism in `20260809T123310Z-qe-e2e-observation-02259098`'s eight-equivalent-survivor
table) and the `NFR-001` discharge with the ±1% instrument-floor caveat to adjudicate
(`20260809T114130Z-software-engineer-observation-9879d731`, restated as QE's risk 5).

Then, and deliberately NOT on their authority:
`plans/tickets/ABC-009-legalmoves-position-mutation.md` in full including `## Acceptance` `A1`–`A10`,
BA/PM's correction block, `## Security / NFR triggers`, `## Test notes`, `## Implementation` and
`## QE`; `src/moves.ts` and both castling test files line by line; `src/apply.ts`, `src/legal.ts`,
`src/fen.ts`, `src/perft.ts`, `src/gameend.ts`; `AGENTS.md`; `.grugops/factory.config.json`
(`security.asvs_level` `L1`, `security.block_on` `high`, `compliance_regime` `[]`, WIP limits,
`quality.*`, `context.human_admission` `off`); `plans/board.md`'s `In Security/NFR` column;
`plans/traceability.md`'s `ABC-009` row; `plans/nfr-catalog.md`'s `NFR-001` row and section, its
standing benchmarking caution and its 97.3%-free-leaves denominator fence; `memory-bank/00-index.md`;
and the kit's `roles/security-nfr.md`, `checklists/security-nfr-checklist.md` filtered to `L1`,
`workflows/04-ticket-to-pr.md`, `workflows/05-pr-quality-gate.md`,
`workflows/16-context-read-write.md`, `workflows/17-task-claim.md`, `contracts/context-note.md` and
`_commit-convention.md`.

**Nothing measured by an earlier role is inherited.** `NFR-001` is re-derived on this gate's own
instruments; the Engineer's figures were read only so this gate could say where it agrees and where
it does not, and QE's explicit refusal to re-measure is treated as what QE labelled it — not a
measurement.

---
completed_at: 2026-08-09T13:17:00Z
outcome: |
  VERDICT PASS_WITH_RISKS on ABC-009. In Security/NFR -> Ready for UAT, the one board move this role
  owns. In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4; no limit approached, no override taken,
  no written reason owed, and all 12 board columns had header counts re-verified against line-item
  counts (0 wrong). Gated against security.asvs_level L1 and security.block_on high.
  compliance_regime is [], so NO Compliance Officer hand-off is owed - recorded rather than silently
  omitted. NO REQUIRED FIX IS OUTSTANDING AND NO HIGH-SEVERITY ITEM EXISTS TO BLOCK ON. TEN ACCEPTED
  RISKS, each with a severity and a NAMED OWNER. NOTHING MERGED, NOTHING DEPLOYED - a human holds
  both, and the owner's standing merge authority is NOT deploy authority.

  NOT ONE FIGURE IS INHERITED. The Engineer measured and QE explicitly declined to re-derive, so
  NFR-001 was re-derived here on instruments written OUTSIDE the repository.

  THE FOUR MANDATORY GATES RE-RUN ON THE TIP cff45ee: npm run lint exit 0 (2 pre-existing biome.json
  infos), npm run typecheck exit 0, npm run build exit 0, npm test 356/356 on 16 files, skip count 0
  by the AGENTS.md command, deep lane 32/32 EXACT in 38.49 s - a THIRD independent run agreeing with
  36.93 s (Engineer) and 38.35 s (QE). Test-integrity checker exit 2 (.grugops/test-skips.md absent,
  checked with ls) recorded as an ERROR and NOT a pass, no registry file created. E2E and auto-UAT
  oracles UNKNOWN - verify. NO PRODUCTION CODE AND NO TEST WAS CHANGED: src/moves.ts still hashes
  0e247853ab2c05887c76105ff83d8621 and git diff 8f540cf -- src/moves.ts is empty.

  NFR-001 / A10 MET ON BOTH CLAUSES. FLOOR 6,030,518 / 6,136,238 / 6,117,496 nodes/sec against
  >= 1,000,000 (~6.1x). RATIO aggregate 1.0062 and 0.9967 against >= 0.98 on two fully independent
  samples, worst single cell 0.9863. Three trees in ONE process - pre-fix, delivered, and a
  BYTE-IDENTICAL TWIN as a null control by identity, the twin cmp-verified on all thirteen non-test
  files and `pre` verified to differ from `post` in moves.ts AND NOTHING ELSE - 12 rounds (round 0
  discarded), tree AND cell order rotated, parseFen outside every clock, checksum 409,605,192 nodes
  per sample. ONE HONEST DIFFERENCE FROM THE ENGINEER, STATED NOT SMOOTHED: this gate's lowest floor
  run (6,030,518) sits 0.16% UNDER the catalog's standing 6.04M-6.21M band. Scatter on one run; NO
  BASELINE MOVED.

  THE ENGINEER'S +/-1% INSTRUMENT-FLOOR REASONING: IT HOLDS, THE ESTIMATE IS OPTIMISTIC, AND IT WAS
  NOT THE END OF THE ROAD. Calibrating against provably-zero cells plus an identity twin is the right
  move and "no per-cell number is claimable" is the right conclusion - an honest "the instrument
  cannot resolve this" IS a result. But this gate measures +/-2.0% per cell (twin, position-5) and
  characterises an AGGREGATE floor nobody had (twin 1.0096 / 1.0087; three of four aggregate twin
  readings across two gates near +0.9%, a SYSTEMATIC this gate CANNOT ATTRIBUTE), so the bar's
  2-point margin exceeds resolution by about 2x, not comfortably. Per-cell instability shown the hard
  way: kiwipete reads 0.9930 / 0.9967 (Engineer) against 1.0228 / 1.0052 (here). ONE WORDING
  OVERSHOOT NAMED: "kiwipete's 0.9930 is NOT a regression" is stronger than a noise floor can license
  (it licenses only "cannot resolve whether it is"); their note states the correct form elsewhere, so
  it is a phrasing inconsistency and not a false result.

  THE QUESTION IS RESOLVED BY MOVING IT OFF THE CLOCK AND ONTO A COUNT - the same move the catalog
  already made for NFR-005's call-count sub-bar. Over the exact perft population the two added lines
  execute 198,175 times EACH = 396,350 total across 11,377,922 counted nodes and REJECT NOTHING IN
  ANY CELL (0 failures of 198,175 each), confirming EMPIRICALLY over 11.4M nodes the structural fact
  that makeMove only ever CLEARS a right (src/apply.ts:142); position-3 and position-6 execute them
  ZERO times. Isolated on an exported addCastlingMoves (removing perft's ~35x dilution) the pair
  costs +1.30 / +1.73 ns per call on startpos against a +/-0.22 ns null floor - RESOLVED, ~0.33-0.43
  ns per execution. ARITHMETIC over the measured count and the measured cost, LABELLED ARITHMETIC AND
  NOT A MEASUREMENT: 0.131-0.170 ms on a 1.854-1.887 s sweep = 0.0070%-0.0091%; TRUE ratio ~0.9999
  and KIWIPETE'S TRUE RATIO ~0.9998, making the 0.9930 reading ~35x the true deviation. Robust to a
  10x error in the multiplier (0.085%, still 20x inside the bar). SO THE ENGINEER'S CONCLUSION IS
  POSITIVELY ESTABLISHED, NOT MERELY UNREFUTED. Denominator fence RE-DERIVED INDEPENDENTLY at 97.18%
  free leaves against the catalog's 97.3%.

  GUARD ORDERING, ROUTED HERE BY QE AS GATE-UNVERIFIABLE: THE BEHAVIOUR HALF IS DISCHARGED, NOT
  CARRIED. The five guards are a CONJUNCTION of side-effect-free predicates over an unmutated
  position (isSquareAttackedBy and raySliderAttacks perform NO writes - checked at the source; board
  is a readonly Uint8Array(128) and every frozen-table index is in bounds, so no guard depends on an
  earlier one for safety), therefore the emitted move set is PERMUTATION-INVARIANT under all 120
  orderings. Measured: 3 reorderings x 33 FENs = 99 comparisons, ZERO divergence at generateMoves, at
  legalMoves and on purity, with all six exact perft counts holding for every variant. SO NO LATER
  REORDER CAN SILENTLY BREAK THE EQUIVALENCE QE RELIED ON. QE's mechanism ("option.empty is tested
  before the through-check") is sound but stronger than needed; restated as a CONJUNCTION it is
  reorder-proof, and that is the durable form.
  THE COST HALF IS REAL AND LIVES ON THE INVALID CLASS: an invalid FEN costs 522-526 ns pre-fix
  against 27.9-28.1 ns delivered (~18x) because the byte compare sits ABOVE THE ATTACK SCAN; below
  the through-check gives all of it back (+481 ns). BUT THE STATED REASON IS INVERTED FOR THE
  POPULATION NFR-001 MEASURES, and this is where this gate DISAGREES with the Engineer: measured
  selectivity is 0.0% for both added guards (0 rejects in 198,175 each) against 17.6% for the empty
  test and 14.1% for the through-check, so in exact executions the delivered order is the
  SECOND-MOST-EXPENSIVE of four (above-right 1,284,772 > delivered 396,350 > below-empty 326,476 >
  below-through 280,302) - about 0.003%, far below resolution. NO CHANGE IS ASKED FOR (rules 5, 9,
  10); the sharper reason is recorded instead. Nothing pins the ordering and NOTHING CAN.

  SECURITY CLASSIFICATION RE-ASKED AT THE SOURCE WITH EVIDENCE AND UNCHANGED - RELIABILITY, NOT
  SECURITY, AND NO TRIGGER MANUFACTURED. Zero eval/new Function/vm/require, zero child_process, zero
  HTML/XML/SQL/URL/fetch sinks, zero node:net|tls|http|https|dgram imports in non-test src/ - each
  GREPPED, not assumed. addCastlingMoves is MODULE-PRIVATE; its only caller is generateMoves, whose
  only non-test caller is legalMoves (src/legal.ts:46). No process.argv/stdin/env/readFileSync in
  src/moves.ts at all; positions enter only via parseFen, called from history.ts and perft-bench.ts
  (hardcoded FENs). NO USER-SUPPLIED STRING REACHES src/moves.ts. QE's queen-destroying result is a
  worse RELIABILITY consequence OF A MUTANT THAT WAS NEVER SHIPPED, not a security one. The one
  security-adjacent property this change touches - a DoS-shaped cost on malformed input - was asked
  and comes out IN THE CHANGE'S FAVOUR (18x cheaper). ASVS L1 COUNTED AT THE SOURCE: 70 active
  requirements, and V16 and V17 carry NO L1 requirement at all (29 rows, zero at L1) - checked, not
  assumed. V2.1.1 PASS, V2.2.1 PASS on this module with the BOUNDARY HALF still owned by ABC-010,
  V2.2.2 / V2.3.1 / V5.2.1 / V15.3.1 PASS BY ANALOGUE (each labelled by analogue, not as a literal
  pass), V15.1.1 and V15.2.1 NOT MET with the carried high->low override and its evidence RE-CHECKED
  HERE (runtime dependencies is {}, package.json and package-lock.json byte-identical to main on this
  branch) owner Architect/Design at EPIC-006, V13.4.1 DEFERRED and NOT relaxed, V7 session management
  N/A and NAMED rather than skipped.

  LOGGING LOOKED FOR AND THE HONEST FINDING IS THAT THERE IS NOTHING TO LOG: this module logs nothing
  and the only logging in non-test src/ is perft-bench.ts's console.log. A failure mode with no log
  is normally what this gate flags; it does not apply because the fix ELIMINATES the failure rather
  than instrumenting it. No logging asked for (rules 5 and 8).

  TEN ACCEPTED RISKS, NONE HIGH, NONE UNOWNED: (1) G-1/G-2 closed in TESTS but not in the criteria -
  BA/PM, MEDIUM, DELIBERATELY NOT DISCHARGED HERE since ## Acceptance is BA/PM's; (2) A7 killed
  nothing across 62 mutants - BA/PM, low; (3) the castling-right test guarded in the default lane
  only by QE's rows - BA/PM or Architect, low; (4) guard ordering RESHAPED not carried -
  Architect/Design at ABC-010/EPIC-003, low; (5) NFR-001 per-cell figures are noise and must never be
  quoted - Security/NFR, low, the TENTH instrument-limit correction on this project's record;
  (6) NFR-001 has no guard in the suite - Security/NFR at EPIC-004, low; (7) ABC-010 unbuilt so the
  invalid FEN is still ACCEPTED at the boundary - ABC-010, low, by design; (8) ABC-022 half (b) live
  BY DESIGN - severity none; (9) A1-A10 plus QE's rows still not PROVEN complete, nine equivalent
  survivors - QE/BA-PM; (10) test-integrity exit 2, E2E and auto-UAT oracles UNKNOWN - verify -
  human-owned.

  UAT RECORDED AS DEFERRED TO EPIC-006 AND EXPLICITLY NOT PASSED, ruled on this ticket's own evidence:
  no CLI entry point and no runnable game, so there is NO SURFACE A HUMAN CAN EXERCISE and a UAT pass
  would be a fabrication. What a human must eventually check is NAMED in the UAT cell.

  STATE EDITS, EACH VERIFIED RATHER THAN ASSERTED. plans/nfr-catalog.md: the NFR-001 row, EXACTLY 2
  LINES CHANGED of 545 (header + that row); NO TARGET MOVED - the Target and Applies-to cells hash
  IDENTICALLY before and after and NFR-002..NFR-007 are byte-identical line for line; 7 raw fields
  per row before and after. plans/traceability.md: ONE ROW (ABC-009), THREE CELLS (NFRs, UAT,
  Status), edited at FIELD level with every added string asserted to contain NO literal pipe; 30
  table lines, ABC-009 at 12 raw fields, ZERO rows whose field count changed; the ABC-011/ABC-015
  13-field defect FLAGGED and NOT fixed. plans/board.md: the column move with both headers updated,
  an EMPTIED record and an ENTERED record; all 12 columns re-verified. plans/tickets/ABC-009-...:
  a new ## Security / NFR section and the frontmatter move - 237 insertions and EXACTLY 2 DELETIONS,
  both frontmatter lines, with ## Acceptance BYTE-IDENTICAL (md5 c62bd47a25cdb498253dbd1d4f89c5d6
  before and after).

  NO FINDING WAS WRITTEN - none is admissible on this task (no §14 gate here to issue a §14-gate#<id>
  stamp, context.human_admission is off). Nothing is self-stamped and no index.md / index.jsonl was
  hand-faked. SIX NOTES PUBLISHED, hand-written in the contract's exact shape:
  20260809T131100Z-security-nfr-observation-896727a9 (every gate re-run, with exit codes),
  20260809T131200Z-security-nfr-observation-8d8cf32e (NFR-001 both clauses, the null controls),
  20260809T131300Z-security-nfr-observation-b95cd581 (the resolving instrument; ordering cost),
  20260809T131400Z-security-nfr-decision-b67fabe0 (the verdict, three rulings, ten risks),
  20260809T131500Z-security-nfr-artifact-ref-0e2d4354 (what this gate produced),
  20260809T131600Z-security-nfr-claim-0d0fff8f (what this gate does NOT establish).
moved: pending/ -> claimed/ticket-to-pr-ABC-009-sec/ -> done/ticket-to-pr-ABC-009-sec/ - ALL BY HAND
  (no scripts/claim.js in this install or in the kit, re-checked at the source; the claim dir was
  created with a plain mkdir, still atomic and still EEXIST on a second writer, and it exited 0 so
  this claim was the first; the two transitions were `mv`, the atomic rename Workflow 17 steps 3 and
  5 specify). The whole claim directory moves, keeping this registry record beside the subtask file -
  the shape every prior done/ subtask on this board uses.
