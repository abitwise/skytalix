---
task: ticket-to-pr-ABC-018
subtask: security-nfr-abc018-gate
role: security-nfr
claimed_at: 2026-08-09T10:00:00Z
claimed_by: security-nfr
method: MANUAL-BY-HAND
---

Claimed BY HAND, and the reason was re-checked at the source rather than taken from the subtask
file's word or from any prior note: `ls scripts` → `No such file or directory` in the repo, and
`ls /Users/olgeroeselg/.grugops/agent-factory/scripts` → the same in the kit (whose top level is
`_commit-convention.md`, `checklists/`, `config/`, `contracts/`, `examples/`, `handoffs/`,
`packaging/`, `README.md`, `roles/`, `seed/`, `VERSION`, `workflows/` — no `scripts/`). So
Workflow 17 step 2's atomic `claimTask` could not be executed. The claim directory was created with
a plain `mkdir` — still atomic, still `EEXIST` on a second writer; `mkdir` exited **0**, so this
claim is the first — and this registry record was written into it. `pending/…md` →
`claimed/…/…md` was a plain `mv` (the atomic rename Workflow 17 step 3 specifies). `pending/` held
exactly one file and `claimed/` was empty at the start, so queue width is 1 and no contention was
possible: the claim is degenerate. Recorded rather than glossed, exactly as every prior subtask on
this board recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-018/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`. **No `finding` is written — none is admissible on this
task, because there is no §14 gate here to issue a `§14-gate#<id>` stamp and
`context.human_admission` is `off`, so no `human:<name>` stamp is available either. Nothing is
self-stamped.** No derived `index.md` / `index.jsonl` was hand-faked, because the renderer that
produces them does not exist here.

DEPENDENCY CHECKED AT THE SOURCE, not taken from the activating prompt:
`.grugops/queue/done/ticket-to-pr-ABC-018-promote/`, `.grugops/queue/done/ticket-to-pr-ABC-018-dev/`
and `.grugops/queue/done/ticket-to-pr-ABC-018-qe/` all exist and each carries its own `claim.md`.
The chain into this gate is satisfied.

## Read before acting

All **fifteen** prior notes in `.grugops/context/ticket-to-pr-ABC-018/notes/` were read in full, at
the source, in `at` order, before any gating judgement was formed and before a single command was
run: the two Orchestrator decisions (routing + the `NFR-002` quoting rule; the Definition-of-Ready
gate at the pull), BA/PM's observation, decision and claim (the five acceptance corrections), the
Engineer's five (files + gates, the five structural choices, `NFR-002` both halves, the 18-mutant
campaign, and what the implementation does NOT establish), and QE's five (every gate re-run, the
56-mutant campaign with the six holes, the PASS verdict with what it routes, the seven added tests,
and what the QE gate does NOT establish).

**The two questions routed to this gate BY NAME were found in the notes rather than in the
activating prompt**: the C1 block's disposition
(`20260809T094600Z-qe-e2e-observation-f9b3a54c` hole 6, restated in
`20260809T094700Z-qe-e2e-decision-67ac270a` item 5) and which of three "write" definitions is
`NFR-002`'s row (`20260809T090700Z-software-engineer-observation-6b72e200` limit 2 — *"the gate
should re-derive whichever it considers the row's definition"*).

Then, and deliberately NOT on their authority:
`plans/tickets/ABC-018-frame-output-and-redraw.md` in full including the `CORRECTED IN PLACE` block
and the `## Implementation` / `## QE` sections; `src/frame.ts` and `src/frame.test.ts` line by line;
`src/render.ts` and `src/glyph-mode.ts`; `AGENTS.md`; `.grugops/factory.config.json`
(`security.asvs_level` `L1`, `security.block_on` `high`, `compliance_regime` `[]`, WIP limits,
`quality.*`); `plans/board.md`'s `In Security/NFR` column; `plans/traceability.md`'s `ABC-018` row;
`plans/nfr-catalog.md`'s `NFR-002` row and section; `memory-bank/00-index.md`; and the kit's
`roles/security-nfr.md`, `checklists/security-nfr-checklist.md` filtered to `L1`,
`workflows/16-context-read-write.md`, `workflows/17-task-claim.md`, `contracts/context-note.md`
and `_commit-convention.md`.

**Nothing measured by an earlier role is inherited.** The escape-stripping bar and both halves of
`NFR-002` are re-derived on this gate's own instruments; the Engineer's figures were read only so
this gate could say where it agrees and where it does not, and QE's coarse sanity check is treated
as what QE labelled it — not a measurement.

---
completed_at: 2026-08-09T10:26:00Z
outcome: |
  VERDICT PASS_WITH_RISKS on ABC-018. In Security/NFR -> Ready for UAT, the one board move this
  role owns. In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4; no limit approached, no override
  taken, no written reason owed. Gated against security.asvs_level L1 and security.block_on high.
  compliance_regime is [], so NO Compliance Officer hand-off is owed - recorded rather than
  silently omitted. NO REQUIRED FIX IS OUTSTANDING and NO HIGH-SEVERITY ITEM EXISTS TO BLOCK ON.
  FIVE ACCEPTED RISKS, each with a severity, a NAMED OWNER and a place.
  NOTHING MERGED, NOTHING DEPLOYED - a human holds both.

  NOT ONE FIGURE IS INHERITED. The Engineer measured and QE explicitly declined to re-derive, so
  both bars were re-derived here on instruments written OUTSIDE the repository.

  THE FOUR MANDATORY GATES WERE RE-RUN ON THE TIP a446297 BY THIS ROLE: npm run lint exit 0 (2
  pre-existing biome.json infos), npm run typecheck exit 0, npm run build exit 0, npm test exit 0 at
  304/304 on 14 files, skip count 0 by the AGENTS.md command. Test-integrity checker exit 2
  (.grugops/test-skips.md absent) - the checker COULD NOT RUN, recorded as an ERROR and NOT as a
  pass, no registry file created. E2E and auto-UAT oracles UNKNOWN - verify. No --coverage run was
  made, so the tracked coverage/ hazard never arose and the 100% figure stays QE's.

  THE SECURITY BAR RE-DERIVED ON THE EMITTED STREAM AT BYTE LEVEL AND MET. 21 adversarial strings
  (every C0 code point in one string, U+007F, ESC[2J, OSC-0 and OSC-8, DCS, DSR - the sequence that
  makes a terminal WRITE BACK - alternate screen, 8-bit CSI and OSC, both ends of C1, a NUL run, CR
  overstrike, an RTL override, ZWSP/BOM, combining marks, an astral pair, the epic's own rejection
  text) x 2 glyph modes x 2 strategies, in the MESSAGE region AND in a PANEL row: 0 ESC bytes from
  supplied data, 0 C0, 0 U+007F, 0 code points above U+007F in ASCII mode, row count CONSTANT at 23,
  ONE write call per frame (84/84), exactly the module's own two sequences in place and ZERO in
  append. Re-run in full under NODE'S PERMISSION MODEL, proved ARMED FIRST by three positive
  controls (fs write, fs read outside the allowlist, child process - all ERR_ACCESS_DENIED), so
  V1.2.5 and V1.3.2 pass ON EVIDENCE rather than on a grep.

  TWO INSTRUMENT FAULTS RECORDED BECAUSE EITHER WOULD HAVE PRODUCED A FALSE RESULT, AND BOTH WERE IN
  THE INSTRUMENT: a FALSE MISS (42 "surviving C0 bytes" over 21 in-place frames were the module's
  own two ESC bytes per frame - ESC is itself C0; append read 0 and gave it away) and a FALSE PASS
  (a retyped C1 payload lost its C1 code point in the editor and measured "2J"; the corpus is now
  referenced by INDEX). Ninth instrument-limit correction on this project's record.

  THE TWO QUESTIONS ROUTED HERE BY NAME ARE DECIDED, NOT RATIFIED.
  (1) THE C1 BLOCK, routed by QE: the bar STAYS AS WRITTEN and NO C1 STRIP IS REQUIRED - it would be
      THEATRE. A clean unicode frame with NO SUPPLIED TEXT AT ALL already carries 64 C1-RANGE BYTES,
      all from the module's own glyph table, and THE ONE 8-BIT CSI BYTE 0x9B IS THE BLACK QUEEN
      (U+265B = E2 99 9B). The whole adversarial C1 payload adds 5 more, so a strip removes 5 of 69
      and leaves 64. The control that makes unicode mode safe is THE TERMINAL BEING UTF-8 - a
      property of MODE SELECTION (ABC-015), not of sanitization. ASCII mode carries ZERO bytes above
      0x7F, measured.
  (2) WHICH "WRITE" IS NFR-002's ROW, routed by the Engineer, whose note said the gate should pick:
      RULED - `serialize + exactly ONE write(2) to a real non-TTY fd`, judged against the MOST
      EXPENSIVE HONEST READING (a regular file). In-memory omits the syscall the row's words require
      and is a FLOOR. A FOURTH sink the Engineer did not measure was added - a FIFO with a live
      reader, EPIC-006's shape - and is recorded BESIDE the row, not as it, because a pipe write's
      cost includes the READER's scheduling.

  NFR-002 BOTH HALVES RE-DERIVED AND THE WRITE HALF'S UNKNOWN - verify DISCHARGED IN
  plans/nfr-catalog.md. Own harness outside the repo, own process, replay/parseFen AND THE WRITER
  hoisted out of every clock, discarded warm-up, 11 rounds x 2,000 iterations, order rotated,
  medians of per-round means, checksum, TWO FULLY INDEPENDENT SAMPLES, Apple M3 (Mac15,13) / Node
  v24.12.0 / Darwin 25.5.0 arm64, UNKNOWN - verify elsewhere. Denominator re-derived: 23 rows at
  W = 18, 418 characters serialized, 419 chars / 483 BYTES on the wire in unicode, 419 bytes in
  ASCII, 425 chars in place - the BYTE figure is new. compute 5.998/6.031, 5.978/6.015, 6.137/6.046
  us; write in-memory 0.638/0.644, 0.636/0.635, 0.648/0.644; /dev/null 1.670/1.666, 1.660/1.650,
  1.674/1.672; A REGULAR FILE 2.733/2.772, 2.714/2.733, 2.711/2.768; a FIFO 2.317/2.294,
  2.285/2.285, 2.302. SUM 0.0087-0.0088 ms against 16 ms - 0.055%, ~1,800x headroom, MET AT EVERY
  PLY COUNT ON EVERY DEFINITION, BOTH HALVES FLAT across 40/120/300.

  WHERE THIS GATE DIFFERS FROM THE ENGINEER IT IS STATED, NOT SMOOTHED: compute, the in-memory sink
  and /dev/null all REPRODUCE inside this gate's two samples; THE REGULAR-FILE CELL READS ~11%
  HIGHER (2.711-2.772 against 2.43-2.48 us) AND THIS GATE CANNOT ATTRIBUTE IT. QE's coarse sanity
  check was treated as what QE labelled it and was NOT quoted as a measurement.

  THE IN-PLACE PATH, WHICH THE ENGINEER RECORDED AS NOT TIMED, IS NOW TIMED AND COSTS THE SAME:
  1.650-1.690 us against append's 1.643-1.671 us to the same fd - the 7 escape characters are BELOW
  INSTRUMENT RESOLUTION. What a real TERMINAL does with them is still UNKNOWN - verify.

  THE ONE WAY THIS BAR CAN BE BUSTED TODAY IS MEASURED RATHER THAN LEFT AS A WORRY: an UNBOUNDED
  supplied string. COLD, first frame, own process (the shape of a frame assembled once per ply):
  a short message 0.16-0.20 ms, 100,000 chars 3.6-4.3 ms, 400,000 chars 14.1-15.8 ms - THE WHOLE
  16 ms BUDGET - and 1,000,000 chars 28.4-41.9 ms, 1.8x-2.6x OVER. The item COUNT crosses at ~13,000
  (an ambiguity list is bounded by the ~218 legal moves and costs 0.13 ms). The warm median-of-9
  instrument reads ~5x lower and is the WRONG instrument for this question; no number is claimed
  from it. NO BOUND IS ASKED FOR HERE - nothing supplies this input until EPIC-003 - but the NUMBER
  is handed forward so that ticket has a bar rather than a feeling.

  THE FIVE ACCEPTED RISKS, NONE UNOWNED, NONE HIGH:
   1. THE CONTROL SITS IN THE ASSEMBLER, NOT IN THE WRITER - a raw row handed to the writer emits 1
      ESC byte; the same payload through assembleFrame emits 0. LOW (no untrusted consumer
      in-process, ZERO runtime importers). NO CHANGE ASKED FOR - the VALUE/SESSION split is the
      ticket's own design. Owner ABC-019.
   2. NO BOUND ON A SUPPLIED ITEM'S LENGTH - the 400,000-character measurement above. MEDIUM
      (V2.2.1 by analogue; not a live L1 failure, nothing supplies this input yet). Owner BA/PM at
      EPIC-003.
   3. mode IS AN UNCHECKED ERASED UNION AND IT FAILS OPEN - "ascii" gives 0 code points above
      U+007F; "unicode", "ASCII", "", undefined, null, 0 and a plain object ALL give 34.
      selectGlyphMode fails SAFE to ascii (RISK-005's whole mitigation direction); assembleFrame
      fails OPEN. THIRD APPEARANCE OF THIS CLASS ON THIS BOARD. LOW. Owner EPIC-006.
   4. A FORCED --unicode ON A TERMINAL THAT IS NOT UTF-8 - ABC-015's rule row 2 lets the flag beat
      the locale, so the mismatch is constructible and the board's own glyphs put 64 C1-range bytes
      per frame on the wire. LOW, and NOT FIXABLE IN THIS MODULE. Owner EPIC-006.
   5. THE MESSAGE REGION CANNOT DISPLAY THE EPIC'S OWN EXAMPLE REJECTION TEXT - at the real W = 18,
      ["no piece on that square"] renders as ["", "(+1 more)"]: the player is told something was
      withheld and NEVER WHAT. "illegal move" and "e2e4 is illegal" do fit. It conforms to every
      criterion and to ## Scope, so it is a DESIGN gap and not a defect - and it is the
      diagnosability shape a risk gate is required to look for. MEDIUM, and THE SEVERITY IS
      EXPLICITLY NOT ASVS-DERIVED. NO ASVS DEFAULT SEVERITY WAS OVERRIDDEN IN EITHER DIRECTION.
      Owner BA/PM, place ABC-016/ABC-017 (which set W) and EPIC-003 (which writes the text).

  ASVS L1 COUNTED AT THE SOURCE: 70 active requirements, and V16 and V17 carry NO L1 requirement at
  all - checked, not assumed. V1.2.1 PASS BY ANALOGUE ON EVIDENCE (this change's one real
  engagement) - V1.2.5, V1.3.2 PASS ON EVIDENCE under the permission model - V2.1.1 PASS (the
  ticket's ## Scope and ## Security triggers ARE the documented input-validation rule, with a
  measurable bar) - V2.2.1 PASS on the message text with risks 2 and 3 recorded rather than waived -
  V2.2.2 PASS BY ANALOGUE with risk 1 named - V15.3.1 PASS by analogue - V1.2.2/1.2.3/1.2.4/1.3.1/
  1.5.1 NOT ENGAGED - V13.4.1 DEFERRED, unchanged and NOT relaxed - V15.1.1/V15.2.1 NOT MET with the
  carried high -> low override restated and its evidence RE-CHECKED HERE (dependencies is {},
  package.json untouched on this branch), owner Architect/Design at EPIC-006 - the rest structurally
  N/A. V7 SESSION MANAGEMENT IS N/A AND IS NAMED RATHER THAN SKIPPED BECAUSE THE KEYWORD MATCHES.

  TWO PROBES PRODUCED BOUNDS RATHER THAN RISKS. The PROTOTYPE-CHAIN GADGET with a LIVE NULL CONTROL
  IN BOTH DIRECTIONS (third on this board): unpolluted with `messages` absent -> THROWS TypeError;
  Object.prototype.messages polluted -> assembles and DISPLAYS the attacker's text with ZERO ESC
  bytes emitted; pollution deleted -> throws again. Pollution turns a loud crash into a silent
  success and can inject TEXT, NEVER AN ESCAPE - and there is NO SINK: every computed-key write in
  non-test src/ is a numeric array index, with no __proto__, Object.assign, JSON.parse or merge
  anywhere. And A BOUNDARY WAS FOUND, LOCATED EXACTLY AND SHOWN UNREACHABLE: the (+N more) marker is
  padEnd'd but never truncated, so at W <= 8 the region row EXCEEDS W - impossible while the merged
  renderBoard (always 18 wide) is in the frame, since the marker reaches 19 characters only at
  N >= 10^10 items. A FENCE, NOT A RISK; no change asked for.

  FAILURE MODES AND LOGGING: this module logs NOTHING and there is no logging anywhere in this
  project. TypeError on a missing panel, a non-array messages, a non-string row or item; a sink
  whose write() throws (EPIPE - a reader that closed early, EXACTLY EPIC-006's pipe shape)
  propagates uncaught. NO ERROR HANDLING ASKED FOR (rule 8), but the frame write is a THROW SITE and
  ABC-019/EPIC-006 own the loop. ONE FAIL DIRECTION IS A POSITIVE: a nonsense height makes
  (sink.rows ?? 0) >= h false, so the writer APPENDS and emits zero cursor control - the strategy
  choice fails SAFE; only the glyph mode fails open.

  NO PRODUCTION CODE AND NO TEST WAS CHANGED. git diff --stat -- src/ is EMPTY and src/frame.ts
  still hashes bb827f52fe537817e40020a29dfa0e6d - the Engineer's FIRST-COMMIT digest this board's
  merge record checks. REPAIRING THE IMPLEMENTATION TO MAKE THIS GATE'S OWN VERDICT COME OUT GREEN
  IS NOT THIS ROLE'S, AND THERE WAS NOTHING TO REPAIR.

  plans/nfr-catalog.md: NFR-002's WRITE half DISCHARGED. EXACTLY 2 LINES CHANGED of 545 (the header
  and that row); NFR-001 and NFR-003..NFR-007 BYTE-IDENTICAL and NFR-002's ID, Category, TARGET and
  Applies-to cells BYTE-IDENTICAL - NO TARGET MOVED, verified by hashing the cells before and after
  rather than asserted; 7 raw fields per table line before and after.
  plans/traceability.md: exactly one row (ABC-018), three cells - NFRs, UAT, Status. Twelve raw
  fields / ten cells verified before and after; ABC-011 and ABC-015 carry THIRTEEN and that is
  PRE-EXISTING AT HEAD - flagged, NOT repaired (rule 9).
  plans/board.md: the column move with both headings' counts updated, an EMPTIED record in the
  column left and the full gate record in the column entered.
  plans/tickets/ABC-018-...: a new ## Security / NFR section and the frontmatter move; NOTHING above
  it edited - no criterion amended, the CORRECTED IN PLACE block untouched.

  UAT RECORDED AS DEFERRED TO EPIC-006 AND EXPLICITLY NOT PASSED, ruled on this ticket's own
  evidence rather than inherited from ABC-015: zero runtime importers (verified here), no bin/main/
  exports/start, no CLI entry point, so there is NO SURFACE A HUMAN CAN EXERCISE and a UAT pass
  would be a fabrication. THIS GATE ATTACHED NO TERMINAL AND CLAIMS NONE - what a human must
  eventually check (ONLCR/staircase, the two escape sequences, the 64 C1-range bytes) is named in
  the UAT cell rather than left implicit.

  CARRIED FORWARD UNCHANGED: QE's two criteria-level items for BA/PM (the absent-signal shape, third
  consecutive ticket; criterion 2 weaker than ruled); the per-frame W for ABC-016/ABC-017; criterion
  1's integration obligation; the reserved prompt row's one-sided contract; the EPIC-006/ADR-0007
  npx disagreement; the two ASVS deferrals; coverage/ tracked and stale; ABC-009 and ABC-022.
  NO ACCEPTANCE CRITERION WAS AMENDED - that is the Backlog exit. NO PR - this repo has no git
  remote and none was invented.

  NO FINDING WAS WRITTEN - none is admissible on this task (no §14 gate here to issue a
  §14-gate#<id> stamp, context.human_admission is off). Nothing is self-stamped and no index.md /
  index.jsonl was hand-faked. SIX NOTES PUBLISHED, hand-written in the contract's exact shape:
  20260809T102000Z-security-nfr-observation-8f4ab4f6 (every gate re-run, with exit codes),
  20260809T102100Z-security-nfr-observation-3dcd09a5 (the security bar and the C1 measurement),
  20260809T102200Z-security-nfr-observation-3269919d (NFR-002, both halves, four sinks),
  20260809T102300Z-security-nfr-decision-0bf12840 (the verdict, the two rulings, the five risks),
  20260809T102400Z-security-nfr-artifact-ref-0a7692f3 (what this gate produced),
  20260809T102500Z-security-nfr-claim-5c22a87e (what this gate does NOT establish).
moved: pending/ -> claimed/ticket-to-pr-ABC-018-sec/ -> done/ticket-to-pr-ABC-018-sec/ - ALL BY HAND
  (no scripts/claim.js in this install or in the kit; the claim dir was created with a plain mkdir,
  still atomic and still EEXIST on a second writer, and it exited 0 so this claim was the first; the
  two transitions were `mv`, the atomic rename Workflow 17 steps 3 and 5 specify). The whole claim
  directory moves, keeping this registry record beside the subtask file - the shape every prior
  done/ subtask on this board uses.
