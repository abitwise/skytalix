# ABC-018 — board history

> **Relocated from `plans/board.md` on 2026-08-10 by the Orchestrator.** The board had grown to
> 549,833 characters, 97% of it per-hop transition narrative. This file holds every board entry
> written about `ABC-018`, **verbatim** — only the surrounding `<!--` / `-->` HTML-comment delimiters
> were removed so the text renders. Nothing was rewritten, summarised or dropped, and none of it
> is duplicated back on the board.
>
> Ticket: [`ABC-018-frame-output-and-redraw.md`](../ABC-018-frame-output-and-redraw.md)

Entries appear in the order they stood in `board.md` (newest first, as the board was written).

---

## board header — _Updated: entry

_Updated: 2026-08-09 by the Software Engineer (task `ticket-to-pr-ABC-018`, subtask `engineer-abc018-implement`, Workflow 04): **`ABC-018` IMPLEMENTED AND MOVED `In Development` → `In Review`** — the one board move this role owns. `In Development` **1/3 → 0/3**, `In Review` **0/3 → 1/3**; no limit approached, no override taken, no written reason owed. **TWO NEW FILES UNDER `src/` AND NOT ONE EXISTING FILE TOUCHED**, verified rather than asserted: `git diff --numstat main -- src/` is **empty**. `src/frame.ts` (222 lines, 94 of them code) holds the VALUE (`assembleFrame`), the SESSION (`beginFrameSession`, which reads the sink's two signals once) and `frameHeight`, the one place the `+3` lives so `H` is never hardcoded; `src/frame.test.ts` holds the twelve criteria one test each, eight further pins, and the in-memory screen model the `## Test notes` require. **`RISK-005`'s BUILD OBLIGATION IS DISCHARGED AND CHECKED MECHANICALLY:** the mode is a required parameter with no default, and `src/frame.ts` imports exactly one thing — `import type { GlyphMode }`, erased at runtime — so it cannot default, hardcode or re-derive a mode; its only `isTTY`/`rows` reads are of the INJECTED SINK. **`NFR-002`'s WRITE HALF IS MEASURED FOR THE FIRST TIME AND BOTH HALVES ARE RECORDED SEPARATELY**, out of tree, two independent samples, on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 and `UNKNOWN - verify` elsewhere: compute (`renderBoard` + `assembleFrame`) **5.97–6.07 µs**, write **0.64–0.65 µs** in-memory / **1.66–1.67 µs** to `/dev/null` / **2.43–2.48 µs** to a file, at 40/120/300 plies on a 23-row 18-column 418-character frame — **SUM 0.0084–0.0092 ms against the 16 ms bar, MET with room; NO NUMBER QUOTED FROM ANY EXISTING NOTE** and the compute half is labelled a LOWER BOUND because two panels are stubs. **GATES AS THEY RAN:** lint exit 0 after ONE autofix pass (import order + formatting, self-fix 1 of 2), typecheck exit 0, `npm test` **297/297 on 14 files** (277 on 13 before, measured not subtracted), build exit 0, skip count **0**, `src/frame.ts` **100% on all four axes**; E2E `UNKNOWN - verify`, test-integrity checker **exit 2** (registry absent — an error, NOT a pass, and no file was created), auto-UAT oracles `UNKNOWN - verify` (script absent). **18 MUTANTS RUN, ALL 18 KILLED** — including both mutants the `23/23` correction was written for and the live "re-decides the strategy on every write" one — **but TWO SURVIVED THE SUITE AS FIRST WRITTEN and the SUITE was fixed, not the record: no acceptance criterion constructs a sink whose `isTTY` or `rows` is ABSENT, which is the real shape Node presents on a pipe.** That is a gap in the CRITERIA and it is handed to QE and BA/PM. **NOTHING MERGED, NOTHING DEPLOYED — a human holds both.** Full record in the ticket's `## Implementation` section and in `.grugops/context/ticket-to-pr-ABC-018/notes/`._

---

## board header — _Updated: entry

_Updated: 2026-08-09 by BA/PM (task `ticket-to-pr-ABC-018`, subtask `bapm-abc018-promote`, Workflow 07): **`ABC-018` PROMOTED `Backlog` → `Ready` — the one board move this role owns — AND IT WAS NOT PROMOTED AS IT STOOD.** `Ready` **3/8 → 4/8**, `Backlog` loses one row; no limit approached, no override taken, no written reason owed. **The Definition of Ready's "acceptance criteria clear, testable and measurable" check FAILED** — the ticket's own DoR block ticked that row green on 2026-07-30 and nothing re-checked it since, and the Orchestrator's pre-check left it AMBER with three named specifics rather than green. **FIVE acceptance defects were fixed IN PLACE before the move: the three flagged (`(+N more)` with no defined `N` — agreed, and worse than described, since six 4-character SANs FIT a 2-row region at `W = 18` and a correct implementation therefore emits no marker and fails the criterion as written; the `23`-row frame — substance agreed but the DIAGNOSIS CORRECTED, `23` is `EPIC-002` `4a`'s reference layout and the real fault is a PROMPT ROW no ticket owned, which left "at least as many rows as the frame" short by exactly the row the player types into; the untested `R = H` equality boundary) PLUS TWO NAMED BY NO PRE-CHECK (`NFR-002`'s "each total is < 16 ms", ambiguous by 2x against its own ticket and traceability row, rewritten to the SUM with no target moved; and a criterion that could not fail — the `ABC-015` defect-2 shape again — restated against the injected sink).** A sixth collision (ASCII mode's zero-above-`U+007F` promise versus a sanitizer that stripped only C0) was folded into the Security bar. **SIZE `S`, PRIORITY `P0`, SCOPE, DEPENDENCIES AND `RISK-005`'s CONSTRAINT ALL UNCHANGED**; `EPIC-002`, `ABC-016`, `ABC-017` and `ABC-019` were NOT edited and are NOT vouched for. Both constraints on the Backlog row re-verified at the source (`ABC-014` merged, `renderBoard` on `main`; `ABC-015` merged `f1743a3 → f4d5d31`, so the merge-order constraint is satisfied **before** this ticket starts). **This is not the pull gate** — the Orchestrator applies the Definition of Ready again at `Ready → In Development`. Nothing implemented, `src/` untouched, nothing merged, nothing deployed._

---

## Ready (WIP 1/8) — column note

ABC-018 ENTERED AND LEFT THIS COLUMN ON 2026-08-09 — promoted here by BA/PM and pulled to
  In Development by the Orchestrator the same day, so its row now sits below. Ready 3/8 -> 4/8
  -> 3/8, the same shape ABC-015 traced on 2026-08-08. ABC-009, ABC-013 and ABC-022 stay, unmoved
  and unchanged.

  ABC-009 AND ABC-022 HAVE NOW BEEN DISPLACED TWICE. Both are P1 rules-core defects, in Ready since
  2026-07-31 and 2026-08-04, and this is the SECOND consecutive owner pull-order call putting
  renderer work in front of them (ABC-015 was the first). The owner may re-order their own queue and
  this is not an argument against it — it is recorded so the pattern is visible on the board rather
  than re-derived later. NEITHER is cancelled, re-sized or de-prioritised.

---

## Ready (WIP 1/8) — column note

ENTERED 2026-08-09 by BA/PM (task `ticket-to-pr-ABC-018`, subtask `bapm-abc018-promote`,
  Workflow 07) — the `Backlog -> Ready` exit this role owns. Ready 3/8 -> 4/8, Backlog loses one
  row. NO LIMIT APPROACHED, NO OVERRIDE TAKEN, no written reason owed for the count.

  BOTH CONSTRAINTS ON THE BACKLOG ROW ARE DISCHARGED, verified at the source rather than read off a
  close-out note or off the Orchestrator's pre-check: ABC-014 is in Done and `git show
  main:src/render.ts` returns the merged 150-line module with `renderBoard` in it; ABC-015 merged
  (f1743a3 -> f4d5d31) and is in Done, so RISK-005's merge-order constraint ("ABC-015 merges with or
  before ABC-018") is SATISFIED BEFORE THIS TICKET STARTS and cannot be violated by it. What survives
  it is a BUILD obligation, not a sequencing one, and it is on the ticket: the writer takes the glyph
  mode as an argument from ABC-015's selection function and must not default, hardcode or re-derive
  it. The Blocked column is empty.

  IT WAS NOT PROMOTED AS IT STOOD. The Definition of Ready's "acceptance criteria clear, testable and
  measurable" check FAILED. The ticket's own DoR block ticked that row green on 2026-07-30 and
  nothing re-checked it until today; the Orchestrator's pre-check left it AMBER with three named
  specifics. FIVE defects were fixed IN PLACE first — the three flagged, plus TWO NAMED BY NO
  PRE-CHECK — and the promotion is of the corrected ticket:

    1) `(+N more)` HAD NO DEFINED N (flagged item 1, AGREED and worse than described). "As many
       candidates as fit" needs a width; `git grep -E "columns|COLUMNS|width"` over non-test src/ on
       merged main returns ZERO, and in append mode there is no width at all. Carried one step
       further: six 4-character SANs (29 chars) FIT a 2-row region (36 chars at W=18), so a correct
       implementation shows all six, emits NO marker and FAILS the criterion as written, while a
       one-per-row implementation answers N=5. RULED: one session-constant frame width W; the region
       takes a LIST of items placed whole or not at all; N is the count of supplied items not shown
       in full. Split into a fits case and a does-not-fit case. Packing stays the engineer's.

    2) A FRAME ROW NO TICKET OWNED (flagged item 2 — substance agreed, DIAGNOSIS CORRECTED). 23 is
       NOT unsourced: it is EPIC-002 4a's reference layout, 9+3+8+2+1 PROMPT = 23. This ticket's
       Scope assembled four of those five regions and sums to 22. Grepped across ABC-014/016/017/019/
       021 and EPIC-003: NO ticket owned the prompt row, and ABC-016 records that ABC-018 owns "all
       writing". The row the player types into was inside the epic's frame, outside this ticket's,
       and owned by nobody — so "at least as many rows as the frame" was short by one and the first
       keystroke scrolls the frame origin off the top, which is the exact failure 4b names. RULED:
       the frame RESERVES a 1-row prompt row inside H; the in-place write leaves the cursor at its
       start with no trailing newline; EPIC-003 keeps the prompt surface. The alternative (frame
       stays 22, in-place needs R >= H+1) is recorded with its reason for rejection: it would amend
       the EPIC's rule to fix this TICKET's omission.

    3) THE EQUALITY BOUNDARY WAS UNTESTED (flagged item 3, AGREED). 24/23 and 10/23 were covered;
       23/23 was not. Added, asserted on the screen model. Kills TWO mutants: `>` where the rule says
       `>=`, and a trailing newline after the frame's last row.

    4) THE NFR-002 BAR WAS AMBIGUOUS BY 2x (NO PRE-CHECK NAMED THIS). "Each total is < 16 ms" reads
       as each HALF < 16 ms and passes a 31 ms frame against a 16 ms bar, contradicting this ticket's
       own Security/NFR section and plans/traceability.md's ABC-018 row, which both say
       "compute + write < 16 ms". Rewritten to the SUM. NO TARGET MOVED — the 16 ms is EPIC-002's.

    5) A CRITERION THAT COULD NOT FAIL (NO PRE-CHECK NAMED THIS) — the ABC-015 defect-2 shape again.
       "When `process.stdout.isTTY` changes afterwards, the strategy in use is unchanged" names an
       ambient global the captured-sink design this ticket's own Test notes MANDATE never reads, so
       it passes for every implementation including one that re-decides on every write. Restated
       against the injected sink, which kills that mutant — and unlike ABC-015 the mutant is live
       here, because the signals sit on a stateful object the writer holds.

  ONE COLLISION CLOSED WHILE THERE, folded into the Security bar rather than counted as a sixth:
  acceptance 2a asserts ZERO code points above U+007F over the WHOLE stream in ASCII mode while the
  sanitizer removed only C0 and U+007F, so a player typing `é` made two of this ticket's own criteria
  contradict each other. RULED: in ASCII mode the sanitizer removes above-U+007F from supplied
  strings too; in Unicode mode they survive.

  SIZE, PRIORITY, SCOPE BOUNDARY, OUT-OF-SCOPE LIST, DEPENDENCIES AND THE SECURITY DISPOSITION ARE
  UNCHANGED — S (2), P0. EPIC-002 was NOT edited (the corrections match the epic's own layout;
  nothing there had to change), and ABC-016/ABC-017/ABC-019 were NOT re-checked here — this subtask
  promoted ONE ticket and does not vouch for the other three.

---

## In Review (WIP 1/3) — column note

EMPTIED 2026-08-09 by QE/E2E (task `ticket-to-pr-ABC-018`, subtask `qe-abc018-review`,
  Workflow 04) on a PASS verdict. ABC-018 moved In Review -> In Security/NFR, the one exit this
  role owns. In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; no limit approached, no override
  taken, no written reason owed. NOTHING MERGED AND NOTHING DEPLOYED -- a human holds both.
  The full QE record is in the In Security/NFR comment below, in the ticket's `## QE` section and
  in `.grugops/context/ticket-to-pr-ABC-018/notes/`; it is not restated here.

  WHAT THIS COLUMN OWED IS PAID, AND IT WAS NOT PAID BY RE-READING THE MODULE. 56 mutants, 75
  mutate-and-restore cycles, SIX of which passed all twelve acceptance criteria AND all 297
  delivered tests. All six are now dead. The production module was NOT changed -- src/frame.ts is
  byte-identical to the Engineer's commit d88a1f0 (md5 bb827f52fe537817e40020a29dfa0e6d, the
  digest they published) and `git diff --stat d88a1f0 -- src/frame.ts` is EMPTY.

---

## In Review (WIP 1/3) — column note

ENTERED 2026-08-09 from In Development, by the Software Engineer (task `ticket-to-pr-ABC-018`,
  subtask `engineer-abc018-implement`). In Review 0/3 -> 1/3. QE/E2E owns this column's exit.
  The implementation record is in the In Development block above and in the ticket's
  `## Implementation` section; it is not restated here.

  THREE THINGS ARE HANDED OVER NAMED RATHER THAN LEFT TO BE DISCOVERED:

  (1) THE ACCEPTANCE CRITERIA ARE BLIND TO A SINK WHOSE isTTY OR rows IS ABSENT, WHICH IS THE REAL
      SHAPE NODE PRESENTS ON A PIPE. Every one of the twelve criteria names a row count, so a
      writer reading an absent row count as UNLIMITED, and one reading an absent isTTY as a
      TERMINAL, pass all twelve. Both were found by mutation while implementing; the SUITE now
      covers them with a test that writes to three sinks with missing signals, but the CRITERIA
      still do not. This is ABC-015's QE finding a second time, on the same class of gap, and it
      is BA/PM's to close if they want it closed. It is NOT a defect in the delivered code.

  (2) ACCEPTANCE CRITERION 1 IS NEAR-VACUOUS UNDER THE STUB PANELS, EXACTLY AS BA/PM RULED. It is
      implemented as strongly as stubs allow -- a frame is assembled at EVERY ply of a real 300-ply
      game (a legal knight shuffle, so the ply count is real rather than a position that merely
      looks like one) and every row count must be identical -- but a fixed-height stub makes any
      assembler pass. QE should treat it as an integration obligation for ABC-019 / EPIC-006, not
      as evidence delivered here. The falsifiable weight sits in the criterion beneath it, which
      varies message content and thinking state in one run.

  (3) W = 18 IS A STUB FIXTURE AND THE SUITE DERIVES IT RATHER THAN ASSERTING IT INTO EXISTENCE.
      It falls out of the merged renderBoard, the widest real panel that exists. When ABC-016 and
      ABC-017 ship, W becomes whatever the widest of the three emits; one test already pins that
      by handing in a 24-wide status stub. The reserved prompt row's contract likewise still has
      only ONE SIDE written down -- this ticket reserves the row and leaves the cursor at its
      start; EPIC-003 and ABC-019 have not been told. That is the Orchestrator's open item.

---

## In Security/NFR (WIP 0/2) — column note

EMPTIED 2026-08-09 by Security/NFR (task `ticket-to-pr-ABC-018`, subtask
  `security-nfr-abc018-gate`, ABC-018's gate): **ABC-018 PASSES WITH RISKS and moved
  In Security/NFR -> Ready for UAT — the one exit this column owns.** In Security/NFR 1/2 -> 0/2,
  Ready for UAT 0/4 -> 1/4. No limit approached, no override taken, no written reason owed.
  NOTHING MERGED AND NOTHING DEPLOYED — a human holds both.

  security.asvs_level L1, security.block_on high, compliance_regime [] — so NO Compliance Officer
  hand-off is owed, recorded rather than silently omitted. NO REQUIRED FIX IS OUTSTANDING and NO
  HIGH-SEVERITY ITEM EXISTS TO BLOCK ON. Five accepted risks, each with a severity, a NAMED OWNER
  and a place.

  NOT ONE FIGURE IS INHERITED. The Engineer measured and QE explicitly declined to re-derive, so
  both bars were re-derived here on this gate's own instruments, written outside the repository.

  THE SECURITY BAR — asserted on the EMITTED STREAM at BYTE level, which is what a terminal reads.
  21 adversarial strings (every C0 code point in one string, U+007F, ESC[2J, OSC-0 and OSC-8, DCS
  passthrough, DSR — the sequence that makes a terminal WRITE BACK — alternate screen, 8-bit CSI
  and OSC, both ends of the C1 block, a NUL run, CR overstrike, an RTL override, ZWSP and BOM,
  combining marks, an astral pair, and the epic's own example rejection text) x 2 glyph modes x 2
  strategies, placed in the MESSAGE region AND in a PANEL row:
    0 ESC bytes from supplied data · 0 C0 bytes · 0 U+007F · 0 code points above U+007F in ASCII
    mode · row count CONSTANT at 23 · exactly ONE write call per frame (84 frames, 84 writes) ·
    exactly the module's own two sequences in place (ESC[H, ESC[0J) and ZERO in append.
  Re-run in full under NODE'S PERMISSION MODEL, proved ARMED FIRST by three positive controls (fs
  write, fs read outside the allowlist, child process — all ERR_ACCESS_DENIED): the campaign still
  completes, so the module performs no filesystem operation and spawns no process while assembling
  and emitting. V1.2.5 and V1.3.2 therefore pass ON EVIDENCE rather than on a grep.

  ONE INSTRUMENT-LIMIT CORRECTION, RECORDED BECAUSE IT WOULD HAVE PRODUCED A FALSE MISS: this
  gate's first run read 42 surviving C0 bytes over 21 in-place frames. ESC is itself a C0 byte and
  those 42 are exactly 2 per frame — the module's OWN cursor-home and erase. Append mode read 0 and
  gave it away. Subtracted, the count is 0. A second instrument fault is recorded too: a retyped
  C1 payload lost its C1 code point in the editor and measured "2J"; the corpus is now referenced
  by INDEX, and both faults were in the INSTRUMENT, never in the module.

  THE C1 QUESTION QE ROUTED TO THIS GATE IS DECIDED, NOT RATIFIED — AND STRIPPING C1 WOULD BE
  THEATRE. Measured: a clean unicode frame with NO SUPPLIED TEXT AT ALL already carries 64
  C1-RANGE BYTES, and every one of them comes from the module's own glyph table (the board alone
  accounts for all 64). The single 8-bit CSI byte 0x9B IS THE BLACK QUEEN — U+265B encodes as
  E2 99 9B. The whole adversarial C1 payload adds 5 more. So stripping C1 from supplied strings
  would remove 5 of 69 and leave 64: the control that makes unicode mode safe is THE TERMINAL
  BEING UTF-8, which is a property of MODE SELECTION (ABC-015), not of sanitization. The bar stays
  exactly as written; the residual is accepted risk 4 below, owner EPIC-006.

  NFR-002 — BOTH HALVES RE-DERIVED, AND THE WRITE HALF'S UNKNOWN - verify IS DISCHARGED IN
  plans/nfr-catalog.md. Own harness outside the repository, own process, replay and parseFen
  hoisted out of every clock, the writer built once outside it, discarded warm-up, 11 rounds x
  2,000 iterations per cell, cell order ROTATED every round, medians of per-round means, checksum
  against elision, TWO FULLY INDEPENDENT SAMPLES, on Apple M3 (Mac15,13) / Node v24.12.0 /
  Darwin 25.5.0 arm64 and UNKNOWN - verify on any other hardware. Denominator re-derived: a 23-row
  frame at W = 18, 418 characters serialized, 419 characters / 483 BYTES on the wire in unicode
  and 419 bytes in ASCII, 425 characters in place.
    compute            5.998/6.031 · 5.978/6.015 · 6.137/6.046 us  (40 / 120 / 300 plies)
    write, in memory   0.638/0.644 · 0.636/0.635 · 0.648/0.644 us
    write, /dev/null   1.670/1.666 · 1.660/1.650 · 1.674/1.672 us
    write, a file      2.733/2.772 · 2.714/2.733 · 2.711/2.768 us  <- the reading the row carries
    write, a FIFO      2.317/2.294 · 2.285/2.285 · 2.302 us        <- EPIC-006's pipe shape
  SUM 0.0087-0.0088 ms against 16 ms — 0.055% of the budget, ~1,800x headroom, MET AT EVERY PLY
  COUNT ON EVERY DEFINITION, and BOTH HALVES FLAT across 40/120/300, which is this row's O(window)
  claim measured rather than inferred.

  THE ENGINEER'S SECOND ROUTED QUESTION IS ANSWERED: which of three "write" definitions the row
  takes. RULED — the row's quantity is `serialize + exactly ONE write(2) to a real non-TTY fd`,
  and the bar is judged against the MOST EXPENSIVE HONEST READING, the regular file. In-memory
  omits the syscall the row's own words require and is a floor. The FIFO is EPIC-006's shape and is
  recorded BESIDE the row rather than as it, because a pipe write's cost includes the READER's
  scheduling and is a property of the pair, not of this module.

  WHERE THIS GATE DIFFERS FROM THE ENGINEER IT IS STATED, NOT SMOOTHED: compute, the in-memory sink
  and /dev/null all reproduce inside this gate's two samples; the REGULAR-FILE cell reads ~11%
  HIGHER (2.711-2.772 against 2.43-2.48 us) and THIS GATE CANNOT ATTRIBUTE IT. Both are >1,800x
  under the bar. THE IN-PLACE PATH, WHICH THE ENGINEER RECORDED AS NOT TIMED, IS NOW TIMED AND
  COSTS THE SAME: 1.650-1.690 us against append's 1.643-1.671 us to the same fd, so the 7 extra
  escape characters are BELOW INSTRUMENT RESOLUTION. What a real TERMINAL does with them is still
  UNKNOWN - verify and is not claimed.

  THE ONE WAY THIS BAR CAN BE BUSTED TODAY IS MEASURED RATHER THAN LEFT AS A WORRY. assembleFrame
  places no bound on a supplied item's LENGTH. Cold, first frame, own process — the shape of a
  frame assembled once per ply — a short message costs 0.16-0.20 ms, 100,000 characters 3.6-4.3 ms,
  400,000 characters 14.1-15.8 ms (THE WHOLE 16 ms BUDGET) and 1,000,000 characters 28.4-41.9 ms
  (1.8x-2.6x OVER). The item COUNT crosses at about 13,000; an ambiguity list is bounded by the
  ~218 legal moves of a position and costs 0.13 ms. NINTH INSTRUMENT-LIMIT CORRECTION ON THIS
  PROJECT'S RECORD: a warm micro-benchmark median reads ~5x lower on that cell and is the WRONG
  instrument for a once-per-ply frame; no number is claimed from it.

  A BOUNDARY WAS FOUND, LOCATED EXACTLY, AND SHOWN TO BE UNREACHABLE — recorded so nobody has to
  rediscover it. "No emitted row exceeds W" is a DISPLAY invariant (a wider row wraps and adds a
  screen row, which is the one way content breaks 4a). The (+N more) marker is emitted unpadded and
  untruncated, so at W <= 8 the region row EXCEEDS W. It cannot fire while the merged renderBoard
  is in the frame: W = max over the panel rows and renderBoard is always 18 wide, and the marker
  reaches 19 characters only at N >= 10^10 supplied items. Structurally unreachable — a fence, not
  a risk, and NO CHANGE IS ASKED FOR.

  THE FIVE ACCEPTED RISKS, NONE UNOWNED, NONE HIGH:
    1. THE CONTROL SITS IN THE ASSEMBLER, NOT IN THE WRITER. Measured: a raw row handed straight to
       beginFrameSession's writer emits 1 ESC byte; the same payload through assembleFrame emits 0.
       The writer's parameter is readonly string[] and cannot express "sanitized". LOW — there is
       no untrusted consumer in-process and src/frame.ts has ZERO runtime importers. NO CHANGE
       ASKED FOR: the split is the ticket's own VALUE/SESSION design. Owner ABC-019, the render
       trigger that will own the only call site.
    2. NO BOUND ON A SUPPLIED ITEM'S LENGTH — the 400,000-character measurement above. MEDIUM
       (V2.2.1 by analogue; not a live L1 failure, because nothing supplies this input yet). Owner
       BA/PM at EPIC-003, which owns the input surface and will decide what a rejection message may
       quote back. Inventing a bound here is the unrequested flexibility rule 7 forbids.
    3. THE mode PARAMETER IS AN UNCHECKED ERASED UNION AND IT FAILS OPEN. Measured: "ascii" gives 0
       code points above U+007F; "unicode", "ASCII", "", undefined, null, 0 and a plain object ALL
       give 34 — every non-"ascii" value selects unicode. selectGlyphMode fails SAFE to ascii on
       ambiguity (RISK-005's whole mitigation direction); assembleFrame fails OPEN. THIRD
       APPEARANCE OF THIS CLASS ON THIS BOARD (ABC-014's GLYPHS[mode] gadget, ABC-015's flags
       half). LOW — the only producer is ABC-015's closed two-literal domain and there is no
       runtime caller. Owner EPIC-006, where ABC-015's gate already placed the flags half.
    4. A FORCED --unicode ON A TERMINAL THAT IS NOT UTF-8. ABC-015's rule row 2 lets the flag beat
       the locale, so the mismatch is constructible; the frame then puts 64 C1-range bytes per
       frame on the wire from its own glyph table, one of them 8-bit CSI. LOW, and NOT fixable in
       this module — see the C1 ruling above. Owner EPIC-006, which owns the flag.
    5. THE MESSAGE REGION CANNOT DISPLAY THE EPIC'S OWN EXAMPLE REJECTION TEXT. Measured at the
       real W = 18: ["no piece on that square"] renders as ["", "(+1 more)"] — 23 characters do not
       fit 18, each item is placed whole or not at all, so the player is told that something was
       withheld and NEVER WHAT. "illegal move" and "e2e4 is illegal" do fit. This conforms to every
       criterion and to ## Scope, so it is a DESIGN gap and not a defect; it is the diagnosability
       shape this gate is required to look for — the failure message that explains a rejection is
       the one thing the player cannot read. MEDIUM, and the severity is explicitly NOT an
       ASVS-derived one; NO ASVS DEFAULT SEVERITY WAS OVERRIDDEN BY THIS GATE IN EITHER DIRECTION.
       Owner BA/PM, place ABC-016 / ABC-017 (which set W) and EPIC-003 (which writes the text).

  ASVS L1 COUNTED AT THE SOURCE RATHER THAN INHERITED: 70 active requirements, and V16 and V17
  carry NO L1 requirement at all — checked, not assumed. Judged individually: V1.2.1 PASS BY
  ANALOGUE ON EVIDENCE (the terminal-sink output-encoding bar above, this change's one real
  engagement) · V1.2.5 and V1.3.2 PASS ON EVIDENCE under the permission model · V2.1.1 PASS (the
  ticket's ## Scope and ## Security triggers ARE the documented input-validation rule, with a
  measurable bar) · V2.2.1 PASS on the message text, with risks 2 and 3 recorded rather than
  waived · V2.2.2 PASS BY ANALOGUE with risk 1 named · V15.3.1 PASS by analogue · V1.2.2/V1.2.3/
  V1.2.4/V1.3.1/V1.5.1 NOT ENGAGED (no HTML, JSON, SQL, WYSIWYG or XML anywhere) · V13.4.1
  DEFERRED, unchanged and NOT relaxed · V15.1.1/V15.2.1 NOT MET with the carried high -> low
  override restated and its evidence RE-CHECKED HERE (dependencies is {}, package.json untouched on
  this branch), owner Architect/Design at EPIC-006 · the remaining chapters STRUCTURALLY N/A. V7
  SESSION MANAGEMENT IS N/A AND IS NAMED RATHER THAN SKIPPED BECAUSE THE KEYWORD MATCHES:
  beginFrameSession is a process-lifetime strategy constant, and ASVS "session" means an
  authentication session with a token.

  THE PROTOTYPE-CHAIN GADGET WAS PROBED WITH A LIVE NULL CONTROL IN BOTH DIRECTIONS, the third time
  on this board. Unpolluted with `messages` genuinely absent, assembleFrame THROWS a TypeError;
  with Object.prototype.messages polluted it assembles and DISPLAYS the attacker's text; with the
  pollution deleted it throws again. So pollution turns a loud crash into a silent success — and it
  is BOUNDED: the sanitizer runs over whatever the property yields, so the emitted stream still
  carries ZERO ESC bytes. Pollution can inject TEXT, never an ESCAPE. And there is no sink: every
  computed-key write in non-test src/ is a numeric array index, with no __proto__, no Object.assign,
  no JSON.parse and no merge anywhere. NOT a risk, recorded as a measured bound.

  FAILURE MODES AND LOGGING, because a failure mode with no log is the incident nobody can diagnose
  later. This module logs NOTHING and there is no logging anywhere in this project. It throws
  TypeError on a missing panel, a non-array `messages` and a non-string row or item; a sink whose
  write() throws (EPIPE — a reader that closed early, which is exactly EPIC-006's pipe shape)
  propagates uncaught. NO ERROR HANDLING IS ASKED FOR HERE — guarding calls that cannot fail
  through the only future caller is the impossible-scenario handling rule 8 forbids — but ABC-019
  and EPIC-006 own the enclosing loop and should know that the frame write is a throw site. ONE
  FAIL DIRECTION IS WORTH RECORDING AS A POSITIVE: a nonsense height makes (sink.rows ?? 0) >= h
  false, so the writer APPENDS and emits zero cursor control. The strategy choice fails SAFE.

  THE FOUR MANDATORY GATES WERE RE-RUN ON THE TIP a446297 BY THIS ROLE, NOT INHERITED: npm run lint
  exit 0 (the 2 infos are the pre-existing biome.json schema-version and recommended-deprecation
  notices, untouched), npm run typecheck exit 0, npm run build exit 0, npm test exit 0 at 304/304
  on 14 files, skip count 0 by the AGENTS.md command. Test-integrity checker exit 2
  (.grugops/test-skips.md absent) — the checker COULD NOT RUN, recorded as an ERROR and NOT as a
  pass, and NO registry file was created: an agent may not self-author a justification to clear its
  own gate. E2E and auto-UAT oracles UNKNOWN - verify. NO --coverage RUN WAS MADE, so the tracked
  coverage/ hazard never arose and the 100% figure stays QE's rather than being restated as this
  gate's.

  NO PRODUCTION CODE AND NO TEST WAS CHANGED. git diff --stat -- src/ is EMPTY and src/frame.ts
  still hashes bb827f52fe537817e40020a29dfa0e6d — the Engineer's FIRST-COMMIT digest this board's
  merge record checks, and the digest QE published. Repairing the implementation to make this
  gate's own verdict come out green is not this role's, and there was nothing to repair.

  CARRIED FORWARD UNCHANGED AND NOT DISCHARGED HERE: QE's two criteria-level items for BA/PM (no
  criterion constructs a sink whose isTTY or rows is ABSENT — the third consecutive ticket; and
  criterion 2 is weaker than it was ruled to be); the per-frame W handed to ABC-016/ABC-017;
  criterion 1's integration obligation at ABC-019/EPIC-006; the reserved prompt row's one-sided
  contract, still the Orchestrator's; the EPIC-006/ADR-0007 npx disagreement; the two ASVS
  deferrals; coverage/ tracked and stale. NO ACCEPTANCE CRITERION WAS AMENDED — that is the
  Backlog exit — and no ticket other than ABC-018 was touched.

---

## In Security/NFR (WIP 0/2) — column note

ENTERED 2026-08-09 from In Review, by QE/E2E (task `ticket-to-pr-ABC-018`, subtask
  `qe-abc018-review`, Workflow 04) on a PASS verdict. In Security/NFR 0/2 -> 1/2. Security/NFR owns
  this column's exit. NOTHING MERGED, NOTHING DEPLOYED -- a human holds both.

  VERDICT: PASS, reached by BREAKING the module rather than by reading it. ALL TWELVE TESTABLE
  ACCEPTANCE CRITERIA ARE COVERED AND NON-VACUOUS except the two BA/PM already ruled on. NO
  PRODUCTION DEFECT WAS FOUND, and no production line was changed.

  THE FOUR MANDATORY GATES WERE RE-RUN ON THE TIP BY THIS ROLE, before and after the added tests,
  rather than inherited: lint exit 0 (the 2 infos are the pre-existing biome.json notices),
  typecheck exit 0, build exit 0, npm test 297/297 THEN 304/304 on 14 files, skip count 0 both
  times by the AGENTS.md command, src/frame.ts 100% on all four coverage axes against the 0.8
  threshold. The 277-on-13 baseline was RE-DERIVED by running the suite without this file, not
  subtracted. Test-integrity checker exit 2 (.grugops/test-skips.md absent) -- recorded as an
  ERROR and NOT as a pass; no registry file was created. E2E UNKNOWN - verify. Five shuffled
  full-suite runs clean.

  BOTH FAKES THE TICKET'S OWN ## Test notes NAME WERE CHECKED BY CONSTRUCTION AND NEITHER IS
  PRESENT. A byte-only rewrite of criteria 5 and 6 PASSES the no-padding mutant that the DELIVERED
  forms kill -- the screen model is load-bearing. And the mutant that IS the second fake (sanitize()
  left correct, the writer bypassing it) dies to criteria 11 and 12, which assert on the captured
  stream.

  BA/PM'S THREE CORRECTED CRITERIA EACH KILL THEIR MUTANT ALONE: the 23/23 boundary kills `>` for
  `>=`; the injected-sink restatement kills the per-write re-decide; the relational N kills an
  invented N. The corrections were not ceremony.

  SIX MUTANTS PASSED ALL TWELVE CRITERIA AND ALL 297 DELIVERED TESTS, AND NOT ONE WAS A DEFECT IN
  THE DELIVERED CODE. All six are now dead, each to exactly one added test:
    (1) SEPARATOR = "" -- items run together into one unreadable token while both region criteria
        still pass; the separator is load-bearing in the ticket's OWN arithmetic (6x4 + 5).
    (2) the sanitizer skipped over the PANEL rows -- the Engineer said the narrower reading "would
        pass every test in this suite", and it did.
    (3) no (+N more) when NOT ONE supplied item fits -- the region goes SILENTLY BLANK and the
        player is never told anything was withheld.
    (4) a TTY exactly ONE ROW SHORT still redrawing in place -- the OTHER side of the >= boundary.
        The criteria's only "too short" case is 13 rows short, which a `>= H - 1` slip clears.
        This is the exact failure 4b exists to prevent.
    (5) U+0000 surviving the C0 strip -- the bar is a RANGE and the range was never asserted.
    (6) the C1 block stripped in unicode mode -- CHARACTERIZED, NOT DECIDED, and ROUTED TO THIS
        GATE: the module matches the bar exactly (C0 and U+007F only), U+009B is 8-bit CSI, and a
        UTF-8 terminal does not honour it. The disposition is Security/NFR's.

  FOUR MUTANTS SURVIVE AND ALL FOUR ARE REPORTED. Three are PROVEN EQUIVALENT (`?? -1` for `?? 0`
  since H >= 3 on every reachable input; `sink.isTTY === true` for `Boolean(sink.isTTY)` over the
  declared type -- ABC-015's surviving mutant a SECOND TIME on the same coercion; `+ 1` for
  `+ SEPARATOR.length`). The fourth reserves marker room on every region row: it shows fewer items
  with a larger N, N stays a count of the input, so it is a CONFORMING ALTERNATIVE PACKING and not
  a defect -- which is what this ticket intends by leaving packing to the engineer.

  ONE PRODUCTION-SHAPED RISK IS NAMED AND IT IS STILL A PASS: W IS RECOMPUTED PER FRAME while the
  ticket calls it "a session constant". beginFrameSession takes H and not W. Demonstrated on the
  screen model -- a 24-wide frame followed by an 18-wide one leaves the wider frame's TAIL on
  screen, the same class the padding decision prevents one level up. It breaks NO criterion, it
  CANNOT FIRE TODAY (renderBoard is always 9x18, the other two panels are fixed-height stubs, and
  there is no runtime importer), and the fix is an API change whose shape depends on ABC-016 and
  ABC-017. Pinned by a CHARACTERIZATION test and handed to those tickets.

  TWO CRITERIA-LEVEL ITEMS ARE BA/PM's AND ARE NOT DISCHARGED HERE:
    (a) NO CRITERION CONSTRUCTS A SINK WHOSE isTTY OR rows IS ABSENT -- the Engineer's handed-over
        gap, CONFIRMED INDEPENDENTLY: both mutants die to their own added pin and to nothing else.
        THIRD CONSECUTIVE TICKET whose acceptance set is written over signals that agree.
    (b) CRITERION 2 IS WEAKER THAN IT WAS RULED TO BE. BA/PM left criterion 1 near-vacuous
        knowingly, on the reasoning that criterion 2 carries the falsifiable weight. MEASURED, it
        does NOT kill the grown-message-region mutant its own rationale names -- its two-item
        rejection never needs a third row. A third item fixes it. Amending a criterion is the
        Backlog exit, not this role's.

  NFR-002 WAS NOT RE-DERIVED HERE and no figure of QE's may be quoted as a measurement -- this
  gate owns it. One coarse single-sample sanity check agreed with the Engineer's in-memory pair
  (0.0071 ms vs 0.0067 ms per frame) so that a four-orders-of-magnitude claim was not relayed
  unlooked-at. plans/nfr-catalog.md is untouched and undischarged.

  NO E2E WAS WRITTEN AND NONE COULD BE: no CLI entry point until EPIC-006, zero runtime importers
  of src/frame.ts, AGENTS.md E2E slot UNKNOWN - verify. Reported as a gap, not filled with a fake.

---

## Ready for UAT (WIP 0/4) — column note

EMPTIED 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-018`, Workflow 04): **ABC-018 MERGED
  to main and CLOSED, Ready for UAT -> Done — the second exit this role owns.** Ready for UAT 1/4 ->
  0/4. Fast-forward 7e0923c -> 364928b, 5 COMMITS, NO MERGE COMMIT: `git rev-list --count
  branch..main` was 0 and `git log --merges main..branch` was empty, BOTH CHECKED BEFORE the merge
  rather than assumed. `git branch --no-merged main` is now empty — all eleven branches contained.

  GATES RUN BY THIS ROLE ON THE TIP BEFORE AND ON MAIN AFTER, BOTH RECORDED, NEITHER INHERITED from
  the four agents that worked this ticket: lint / typecheck / build exit 0 on both sides, 304/304 on
  14 files on both sides, skip count 0 by the AGENTS.md command on both sides.

  src/frame.ts md5 bb827f52fe537817e40020a29dfa0e6d is IDENTICAL to the Engineer's first commit
  d88a1f0, checked ON MAIN. QE changed src/frame.test.ts only (+148/-0) and Security/NFR changed no
  source at all — NEITHER GATE REPAIRED THE MODULE TO MAKE ITS OWN VERDICT GREEN, which is the
  specific failure this board checks on every merge.

  MERGED UNDER THE OWNER'S STANDING DIRECTIVE OF 2026-08-06, read at its authority in
  memory-bank/60-progress.md rather than from AGENTS.md's pointer. All three of its limits honored:
  deploy not included and not attempted, the gate still binds and was run both sides, the authority
  stays the owner's. UNLIKE THE PREVIOUS TWO MERGES THE HOST PERMISSION CLASSIFIER DID NOT DENY THIS
  ONE — ABC-014 and ABC-015 were each blocked first and each returned to the owner rather than worked
  around. Recorded because two denials had started to look like a rule; this is the counter-example.

  NFR-002's WRITE HALF IS NOW MEASURED — the row plans/nfr-catalog.md carried as UNKNOWN - verify.
  Re-derived at the gate on its own instruments: compute + write 0.0087-0.0088 ms against a 16 ms
  bar, flat across 40/120/300 plies, Apple M3 / Node v24.12.0 / Darwin arm64. The gate's regular-file
  cell reads ~11% above the Engineer's and THAT DISCREPANCY WAS STATED RATHER THAN SMOOTHED.

  UAT DEFERRED TO EPIC-006 AND EXPLICITLY NOT PASSED — zero runtime importers, no CLI entry point, so
  a pass would be a fabrication. Same disposition as every ticket this project has shipped.

  RISK-005 IS FULLY DISCHARGED. Its merge-order half was satisfied before this ticket started
  (ABC-015 merged 2026-08-08); its BUILD half was checked mechanically at the merge — the glyph mode
  is a required parameter with no default, frame.ts's only import is an erased `import type
  { GlyphMode }`, and the only isTTY/rows reads are of the INJECTED sink.

  SIX ITEMS ARE RECORDED OPEN RATHER THAN DISCHARGED, in full in the close-out note: the prompt-row
  contract has only one side written down (ABC-019 and EPIC-003 must carry it); six mutants passed
  all twelve acceptance criteria at QE (gaps in the CRITERIA, not defects in the code, all pinned);
  no criterion constructs an absent isTTY/rows sink for the third consecutive ticket; W is recomputed
  per frame while Scope calls it a session constant; tools/grugops/test-skip-integrity.js exited 2 on
  all three agent runs and has never run successfully in this project; and ABC-009 + ABC-022 have now
  been displaced twice.

  DEPLOY WAS NOT ATTEMPTED OR CONTEMPLATED — not in the standing grant,
  production_requires_human_confirmation stays true, and ADR-0007 records there is nowhere to deploy.

  Previously ENTERED 2026-08-09 by Security/NFR:

---

## Ready for UAT (WIP 0/4) — column note

ENTERED 2026-08-09 by Security/NFR (task `ticket-to-pr-ABC-018`, subtask
  `security-nfr-abc018-gate`, ABC-018's gate): **ABC-018 In Security/NFR -> Ready for UAT on a
  PASS_WITH_RISKS verdict.** Ready for UAT 0/4 -> 1/4; no limit approached, no override taken.
  The full gate record — the byte-level escape campaign under Node's permission model, NFR-002's
  two halves on four sinks with two independent samples, the two routed questions decided, the
  ASVS L1 walkthrough, and the five accepted risks with their owners — is in the In Security/NFR
  column above and in the Security/NFR notes under
  .grugops/context/ticket-to-pr-ABC-018/notes/. It is NOT restated here.

  WHAT THIS COLUMN IS BEING ASKED FOR, STATED PLAINLY: nothing a human can do yet. UAT IS DEFERRED
  TO EPIC-006 AND IS EXPLICITLY NOT PASSED. Ruled on THIS ticket's evidence rather than inherited
  from ABC-015's identical ruling: src/frame.ts has ZERO RUNTIME IMPORTERS (git grep in non-test
  src/ returns nothing — checked here, not taken from QE's note), package.json has no bin, no main,
  no exports and no start, and AGENTS.md's Dev / run is UNKNOWN - verify because there is no CLI
  entry point until EPIC-006. assembleFrame returns a value and beginFrameSession writes only to a
  sink a caller injects, so NOTHING REACHES A HUMAN'S TERMINAL and a UAT pass would be a fabrication.

  WHAT A HUMAN MUST EVENTUALLY CHECK IS NAMED RATHER THAN LEFT IMPLICIT, because this gate could
  not check it in-process: that a real terminal draws the frame without a staircase (this module
  emits no carriage return and relies on ONLCR, which QE flagged as UNKNOWN - verify under the raw
  mode EPIC-003's input surface may set); that the two escape sequences behave as the screen model
  assumes; and that the 64 C1-range bytes a unicode frame carries are harmless on the terminal
  actually in use. EPIC-006 is the first place all three are observable.

  THIS GATE ATTACHED NO TERMINAL AND CLAIMS NONE. Unlike ABC-015's gate, which drove a real pty,
  every reading here is of a captured sink or of a file descriptor — recorded as a limit rather
  than glossed.

  NOTHING MERGED AND NOTHING DEPLOYED — a human holds both. Merge is the Orchestrator's under the
  owner's standing authority, and it is approval to merge work that PASSED, never to skip a gate.

---
