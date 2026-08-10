---
task: ticket-to-pr-ABC-013
subtask: ticket-to-pr-ABC-013-bapm
role: ba-pm
claimed_at: 2026-08-10T11:41:33Z
claimed_by: ba-pm
completed_at: 2026-08-10T12:10:00Z
method: MANUAL-BY-HAND
outcome: |
  ABC-013's ## Acceptance REPAIRED IN PLACE and the ticket PROMOTED `Ready` -> `Ready for Dev`
  (Ready 1/8 -> 0/8, Ready for Dev 0/6 -> 1/6). The `Ready for Dev` -> `In Development` exit is the
  Orchestrator's and was NOT taken; NOBODY ENQUEUED. NO `src/` FILE TOUCHED (`git status --short --
  src/` empty), NO `src/san.ts`, NO TEST WRITTEN, ADR-0004 NOT RE-OPENED, EPIC-003's `parseSan`
  contract NOT ALTERED, `plans/nfr-catalog.md` NOT EDITED and NO CATALOG TARGET MOVED, ABC-016 /
  ABC-017 / ABC-024 / ABC-010 NOT EDITED. NOTHING MERGED, NOTHING DEPLOYED.

  EIGHTEEN CORRECTIONS. THE PRE-CHECK NAMED FOUR AND DECLINED TO ASSERT A FIFTH; the fifth (A
  CASTLE CAN GIVE CHECK AND NOTHING PINNED `O-O+`) IS CONFIRMED BY CONSTRUCTION. Fifth consecutive
  ticket on this board where the opening count was low.

  THE LOAD-BEARING NUMBER IS NINE, AND IT IS MEASURED, NOT ARGUED. Nine deliberately wrong builds of
  `toSan` PASS ALL THIRTEEN CRITERIA AS WRITTEN and die only on the repaired table: rank-before-file;
  rivals drawn from the PSEUDO-legal list so a PINNED knight still forces a qualifier; rivals not
  filtered by piece type (12 rows red); `#` emitted on a STALEMATE; the `x` lost on an EN-PASSANT
  capture; `x` for pawn captures only; a castle returning before its suffix; a wrong `K` letter; and
  `P` on a quiet pawn push. FIVE MORE wrong builds were already killed by the ticket as written and
  that is recorded too, not only the failures. Fifteen builds scored in total, each against BOTH
  criteria sets, the thirteen instantiated CHARITABLY — every prose criterion handed the best FEN
  that can be built for it, which is strictly MORE than an engineer holding only the ticket had.

  THE PRE-CHECK'S OWN `Pe4` LEAD: CONFIRMED, MECHANISM WRONG, AND SAID SO RATHER THAN ABSORBED. The
  build it described (an explicit `P` on every quiet pawn move) FAILS the promotion criterion,
  because it also emits `Pe8=Q`. The survivor is the narrower build whose promotion branch is written
  separately and correctly. The gap is real; the predicted witness was not.

  ONE OF THIRTEEN CRITERIA WAS EXECUTABLE AS WRITTEN, against a section that opened "Every criterion
  is a hand-built FEN with an exact expected string" — five named a position in prose, three named
  none at all, two were unbounded universals. NOW 22 CRITERIA OVER 18 NAMED FENS AND 52 HAND-TYPED
  ROWS. All 18 FENs parse, round-trip through `toFen` BYTE-IDENTICALLY, and were proved LEGAL
  positions on merged `main` (side not to move not attacked) with every named move present in
  `legalMoves`. THE ORACLE WAS TYPED FIRST AND STAMPED BEFORE ANY IMPLEMENTATION EXISTED — md5
  `56d56506fcf89de10d79c5774e2a630c` at 2026-08-10T11:51:22Z — so nothing computed an expected value;
  the reference build written afterwards agrees on all 52, which is CORROBORATION, NOT DERIVATION.

  A HOLE IN MY OWN REPAIRED TABLE, FOUND BY MUTANT AND RECORDED: the first version did NOT kill a
  rank-before-file build, because the ticket's knight pair (`b1`+`d1`) stands on ONE RANK so the rank
  could never have separated them either way. `P-FILE-PREC` (`b1`+`d5`) exists for exactly that.

  BOTH NFR BARS WERE NOT MERELY STALE — THEY WERE UNSATISFIABLE UNDER THE PER-CALL READING. A
  CORRECT reference build misses `6.5 µs` by 1.42x (9.34 / 9.25 µs) and `0.20 µs` by 22.5x (4.50 /
  4.49 µs) on a checking piece move, because deciding `+` versus `#` costs a second `legalMoves` —
  ADR-0004's OWN definition of the mate suffix. Re-derived as N1-N4 with the AGGREGATION and the MOVE
  POPULATION STATED and the benchmark position PINNED AS A LITERAL FEN. N1 (supplied-list mean <= 1/5
  of the unassisted mean; measured 8.62x / 8.65x) is a RATIO and the only machine-independent bar.
  N3 IS THE TICKET'S ORIGINAL 6.5 µs FIGURE RE-MEASURED AND CONFIRMED, NOT MOVED. Two runs agreeing
  to within 1%, null floor 0.18-0.20% of the smallest figure, Apple M3 / Node v24.12.0 /
  darwin-arm64 — the SAME machine class the bars name.

  NO REGRESSION FROM ABC-009 / ABC-022 IS CLAIMED OR REFUTED, and that is the honest answer rather
  than the convenient one: `legalMoves` measures 4.58 µs against wave 1's published 3.18 µs, but wave
  1 recorded a METHOD ("a deterministic random-legal game, ply-60") AND NEVER THE SEED, so its
  position cannot be reconstructed and 4.58 sits inside ADR-0003's published 1.8-5.4 µs range.
  Position variance covers the gap entirely; the guard cost is below this instrument's ability to
  attribute. THAT UNRECONSTRUCTABILITY IS THE ROOT CAUSE OF THE WHOLE DEFECT and is why the position
  is now a literal FEN in the ticket.

  ALSO: NFR-003's parenthetical was wrong by ~5x (41 moves ~20 µs, ~5,000x under budget, not ~4 µs /
  ~25,000x); NFR-002's frame headroom RE-MEASURED AND CONFIRMED at 2.5% of a 16 ms frame for a
  120-ply render (ADR-0004 published 3.3%); a ## Test notes sentence describing ABC-009 as open was
  corrected (it merged 2026-08-09, 10 commits on main) WITH what the merge actually means for A18 —
  that guard is why A18 is passable at all, so this ticket must not RE-BREAK it; and `toSan`'s
  precondition on `move` is now stated, with behaviour on an illegal move DECLARED UNDEFINED rather
  than invented by a role with no authority to choose it.

  SIZE `M` AND PRIORITY `P1` RE-CHECKED AND UNCHANGED — every added criterion is a ROW IN A TABLE
  `## Scope` ALREADY REQUIRED, not new behaviour, and handing the engineer 18 FENs and 52 strings
  moves work OUT of the build. ## Scope and ## Out of scope re-read and NOT WIDENED; every new
  criterion cites the Scope bullet it enforces.

  BOARD DISCIPLINE: the outgoing `_Updated:` header (2,513 chars, ABC-023's close) was appended
  VERBATIM to `plans/tickets/history/ABC-023-board-history.md` BEFORE the board header was replaced —
  the board's own rule, violated twice on 2026-08-09 — and the archive was BYTE-CHECKED (the file
  grew by exactly the heading plus 2,513 chars). Board carries exactly one `_Updated:` line and
  exactly one ABC-013 row.

  TRACE: plans/traceability.md ONE ROW (ABC-013), TWO CELLS (`NFRs`, `Status`); 33 table lines before
  and after; the row asserted at exactly 11 unescaped pipes before and after; every added string
  asserted pipe-free and newline-free BEFORE writing.

  TRANSCRIPTION CHECKED MECHANICALLY, because the live risk once the evidence is right is a typo: all
  18 FENs read back OUT of the ticket, all parse and round-trip byte-identically, all 49 distinct
  expected strings present, and A1's 20-string set re-extracted from the ticket and compared against
  `legalMoves(startpos)` — 20 members, exact match, none missing, none extra.

  EIGHT NOTES PUBLISHED, hand-written in the contract's exact shape: three observation, three
  decision, two claim, one artifact-ref. NO FINDING — none is admissible on this task (no §14 gate on
  this hop to issue a `§14-gate#<id>` stamp; `context.human_admission` is `off`, so no `human:<name>`
  stamp exists either). Nothing self-stamped; no index.md / index.jsonl hand-faked.

  WHAT I DO NOT CERTIFY: that the criteria set is now COMPLETE (nine wrong builds passed a table a
  careful pre-check had just reviewed, one hole was in my own repair, and the instrument that scored
  the nine was written by the role that wrote the rows — QE's independent mutation hop found FOURTEEN
  more on ABC-023); that the 52 expected strings match the SAN standard (hand-derived, corroborated
  by a same-author reference, checked against NO external implementation or specification text); any
  figure on hardware other than Apple M3 / Node v24.12.0 / darwin-arm64; and that ABC-013 may be
  PULLED — `Ready for Dev` -> `In Development` is the Orchestrator's exit.
moved: pending/ -> claimed/ticket-to-pr-ABC-013-bapm/ -> done/ticket-to-pr-ABC-013-bapm/ — ALL BY HAND.
---

# Claim record — the now-running registry entry

Queue claim taken BY HAND, and the deviation is recorded rather than presented as compliance.
Workflow 17's `claimTask` does not exist in this install — re-checked at the source rather than
inherited from the subtask brief or from `ABC-022`'s claim record: `ls scripts/` in the repository
returns "No such file or directory" (the repository has no `scripts/` directory at all), and the kit
root `/Users/olgeroeselg/.grugops/agent-factory` has no `scripts/` either — a `find` for `claim*` and
`context-io*` across the kit tree returns nothing.

The claim IS the atomic `mkdir(2)` of this directory — the same primitive `claimTask` relies on — so
the exactly-once property is unchanged. It exited **0**, so this claim was the first writer; a second
writer would have taken `EEXIST`.

`pending/` held exactly one file and `claimed/` was empty at the start, so queue width was 1 and no
contention was possible: **the claim is degenerate**, recorded rather than glossed. No stale-claim
sweep was owed (`claimed/` was empty), and the sweep is the coordinator's in any case.

Workflow 16's sanctioned writer is likewise absent — `scripts/context-io.ts` does not exist — and the
structured `mcp__grugops__propose_note` tool is **not** in this session's tool set, checked against the
tools actually available rather than assumed. So the notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-013/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`, and **no `finding` is written** — none is admissible on
this task (there is no §14 gate on this hop to issue a `§14-gate#<id>` stamp, and
`context.human_admission` is `off` in `.grugops/factory.config.json`, so no `human:<name>` stamp
exists either). No `index.md` / `index.jsonl` is hand-faked.

`at` is taken from `date -u`, never from a local clock or a test runner's `Start at` line. This
machine is **UTC+3**: `date -u` read `11:41:33Z` against local `14:41:33 EEST` at the start of this
hop.
