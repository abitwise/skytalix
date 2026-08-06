---
task: ticket-to-pr-ABC-014
subtask: security-nfr-abc014-gate
role: security-nfr
claimed_at: 2026-08-07T12:00:00Z
claimed_by: security-nfr
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has **no `scripts/` directory at all** — no `scripts/claim.js`, so
Workflow 17 step 2's atomic `claimTask` could not be executed. The claim directory was created with
a plain `mkdir` (still atomic, still `EEXIST` on a second writer) and this registry record written
into it. Queue width is 1 and no contention was possible, so the claim is degenerate. Recorded
rather than glossed, exactly as the queued subtask instructed and as every prior subtask on this
board recorded.

DEPENDENCY CHECKED AT THE SOURCE, not taken from the activating prompt:
`.grugops/queue/done/ticket-to-pr-ABC-014-qe/` exists and carries its own `claim.md` with
`done_at: 2026-08-07T10:30:00Z`. The chain is satisfied.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-014/notes/` in the schema's exact shape. **No `finding` is
written — none is admissible without a §14 gate to issue a `§14-gate#<id>` stamp, and
`context.human_admission` is `off`, so no `human:<name>` stamp is available either. Nothing is
self-stamped.** No derived `index.md` / `index.jsonl` was hand-faked, because the renderer that
produces them does not exist here.

## Read before acting

All eleven prior notes in `.grugops/context/ticket-to-pr-ABC-014/notes/` read AT SOURCE and IN `at`
ORDER before any gating judgement was formed — including
`20260806T110000Z-orchestrator-observation-c41e9b07`, which CORRECTS one sentence of the pull note
(the standing perft FEN table holds SIX positions, not seven), and
`20260807T113000Z-orchestrator-decision-8f5a2b60`, which routes the self-healing snapshot net to the
Scribe. Then `plans/tickets/ABC-014-board-frame-renderer.md` in full, `plans/nfr-catalog.md`,
`AGENTS.md`, `.grugops/factory.config.json`, and the shipped `src/render.ts` and
`src/render.test.ts` line by line.

**Nothing measured by an earlier role is inherited.** The NFR bar is re-measured on this gate's own
harness — the standard this column set on `ABC-011`'s `NFR-005` and kept on `ABC-012` — and the
ticket's "no security trigger" ruling is RE-DERIVED against what was actually built rather than
accepted from the ticket's framing.

---
completed_at: 2026-08-07T12:30:00Z
outcome: PASS_WITH_RISKS (board verdict PASS) - ABC-014 moved In Security/NFR -> Ready for UAT.
  In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4; no limit approached, no override taken.
  Gated against `security.asvs_level: L1` and `security.block_on: high`. NO required fix outstanding.
  FOUR accepted risks, each with a named owner AND a place. `compliance_regime` is [], so no
  Compliance Officer hand-off is owed.

  THE NFR BAR WAS RE-MEASURED ON THIS GATE'S OWN HARNESS, NOT INHERITED - the standard this column
  set on ABC-011's NFR-005 and kept on ABC-012. Harness outside the repository, its own process
  doing nothing else, a discarded warm-up round, 11 rounds with the CELL ORDER ROTATED EVERY ROUND,
  medians of per-round means, TWO fully independent samples, parseFen OUTSIDE the timed region, a
  checksum against elision, on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 and
  `UNKNOWN - verify` on any other hardware. Population: all 24 cells of 6 standing perft FENs x
  2 glyph modes x 2 orientations - SIX FENs, re-counted at the source rather than taken from the
  Orchestrator's own correction note.
    worst bar cell     2.092 / 2.056 us   vs <= 500 us   0.0042x   MET
    best bar cell      0.955 / 0.980 us
    unicode vs ascii   1.80-1.83x
  The samples agree to 1.7% and pick the same worst and best cell. THE ENGINEER'S 2.070 us IS
  BRACKETED BY THIS GATE'S TWO SAMPLES - reproduced, not carried forward.

  THE BAR'S POPULATION DOES NOT CONTAIN THE MODULE'S WORST CASE, and it was measured anyway rather
  than banked: a fully-occupied 64-piece board (unreachable through parseFen, which requires one
  king per side) reads 2.322 / 2.342 us = 0.0047x; the empty board 0.910-1.051 us. THE 40/120/300
  PLY COUNTS DO NOT APPLY AND NONE WAS INVENTED - structural and MEASURED: a Position carries no
  move list, and castling, the ep square, both clocks and the side to move influence ZERO frame
  bytes. ONE STRUCTURE ATTRIBUTED RATHER THAN LEFT AS NOISE: black-bottom costs ~0.10-0.13 us more
  on every cell, and src/render.ts:146's `[...FILE_LETTERS].reverse().join("")` measures
  +0.112 us/frame in isolation - essentially the whole delta. 0.02% of the bar; no change asked for.

  THE "NO SECURITY TRIGGER" RULING WAS RE-DERIVED AND IT HOLDS - BUT ITS STATED REASON IS INCOMPLETE
  AND THIS GATE REPORTS THAT RATHER THAN RATIFYING THE TICKET'S WORDING. "No user-supplied string
  reaches this module" is false as written: two of renderBoard's three parameters ARE strings whose
  TypeScript unions are ERASED at runtime, and EPIC-006's --ascii/--unicode flags are the plausible
  path by which a user string becomes one. What actually holds the property is stronger and was
  proven: THE OUTPUT ALPHABET IS CLOSED - board bytes and the mode string are used only as lookup
  KEYS and are never emitted. Measured over 32 frames spanning the 6 standing FENs, the empty board
  and a fully-occupied board in both modes and both orientations: 42 distinct code points, 0 outside
  the fixed tables, 0 control bytes, 0 ESC - no ANSI sequence is constructible. 27 hostile mode
  values injected ZERO bytes (26 threw, 1 clean frame); 27 hostile orientation values likewise.

  ONE REAL PROPERTY FOUND AND IT IS A GADGET, NOT A VULNERABILITY: GLYPHS[mode] (src/render.ts:118)
  and glyphs[pieceType(piece)] (:139) are unguarded prototype-chain lookups. Under an ALREADY-
  POLLUTED Object.prototype, a non-union mode ("constructor"/"__proto__"/"toString"/"valueOf") or a
  board byte with (b & 7) === 7 injects attacker data into the frame INCLUDING ESC and breaks the
  constant 18-character geometry (rows of 98 and 28 observed). BOTH REAL MODES ARE IMMUNE - own
  properties 1..6 shadow the pollution, verified against a LIVE-POLLUTION CONTROL so the negative is
  not vacuous - and NO PROTOTYPE-POLLUTION SINK EXISTS ANYWHERE IN src/, so the precondition cannot
  be created from inside this project. LOW, does not block.

  ASVS L1 JUDGED NOT PADDED: of the 70 active L1 requirements, 4 are reachable and pass on evidence
  (V1.3.2 no dynamic execution; V2.1.1 the module documents its input contract including that it
  validates nothing and why; V15.3.1 the frame is a board-only projection, measured; V1.2.x by
  analogue via the closed alphabet, ASVS 5.0 having no terminal-output requirement), and 66 are
  structurally N/A with the reason stated per chapter. V16 and V17 carry NO L1 requirements at all -
  checked, not assumed. V2.2.1 is NOT ENGAGED rather than failed - an L1 fail defaults to HIGH and
  WOULD block, but the input surface does not exist (zero importers, no CLI entry point); THE
  COUNTERFACTUAL IS STATED RATHER THAN BANKED: the moment EPIC-006 wires an unvalidated flag string
  to `mode`, V2.2.1 IS engaged. Import closure re-verified with comments stripped: render.ts ->
  position.ts -> nothing, 114 code lines, ZERO sinks; the three process./stdout/isTTY matches are
  all inside the doc comment that says it reads none of them.

  FOUR ACCEPTED RISKS, NONE UNOWNED: (1) the prototype-chain gadget - LOW - Architect/Design /
  ABC-018 / EPIC-006. (2) An out-of-domain board byte throws an uncaught TypeError with no context
  (verified on bytes 7, 8, 15, 16, 63, 127, 200, 255); the DECISION is right and is NOT re-opened,
  but ABC-018 is where an uncaught throw meets a half-drawn terminal - LOW - Architect/Design /
  ABC-018. (3) A non-"white-bottom" orientation SILENTLY renders black-bottom rather than throwing,
  which is the "looks plausible and is wrong" class criterion 2 exists against - LOW - ABC-015 /
  EPIC-006, which own the value. (4) Every figure is one machine and one Node version - LOW -
  Security/NFR / EPIC-004's already-scheduled non-M3 spike. NO DEFAULT SEVERITY WAS OVERRIDDEN in
  either direction - nothing demoted to keep the gate green, nothing inflated to look thorough.

  Gates re-run at this gate rather than inherited: 253 passed / 11 files / 0 failed, skip count 0 by
  the AGENTS.md command, lint exit 0 with 0 errors (2 pre-existing infos), typecheck and build exit
  0. src/render.ts md5 733bc67fec523a7f41016bea2b026e1d - IDENTICAL to the Engineer's and QE's
  published figure - and `git diff HEAD -- src/` is EMPTY. NO PRODUCTION CODE AND NO TEST WAS
  CHANGED BY THIS GATE. No command went RED at any point. No --coverage run was made, so the
  coverage/ hazard never arose.

  plans/nfr-catalog.md: NFR-002's row gains the measured board-scan compute half and the section's
  unknowns table closes that row - the debt both the Engineer and QE flagged as owed to this role.
  EXACTLY 3 LINES CHANGED; NFR-001 and NFR-003..NFR-007 BYTE-IDENTICAL and NFR-002's target cell
  BYTE-IDENTICAL - NO TARGET MOVED, verified by hashing the cells before and after.
  plans/traceability.md: exactly one row (ABC-014), three cells - NFRs, UAT, Status.

  UAT RECORDED AS DEFERRED TO EPIC-006, NOT PASSED - zero importers, no CLI entry point, nothing
  written and nothing prompted, so there is no surface a human can exercise and a UAT pass would be
  a fabrication. CARRIED FORWARD UNCHANGED: NFR-002's WRITE half (ABC-018, still the half nobody has
  measured), the U+2654-U+265F East-Asian-Width ambiguity (UNKNOWN - verify on this gate's
  instruments too - no in-process test reads a terminal COLUMN width), and no E2E, which could not
  be written. THIRD FLAG, NOT FIXED: the ABC-014 ticket frontmatter still reads in-development;
  three flags and no fix is itself the signal - owner Orchestrator. The snapshot-net hole is already
  routed to the AGENTS.md Scribe and is NOT re-routed here; QE's destructive experiment was
  deliberately NOT reproduced. plans/metrics.md still stale; coverage/ flagged, not deleted.
  ABC-009, ABC-010 and ABC-022 carried, not fixed. NO PR - this repo has no git remote and none was
  invented. NOTHING MERGED, NOTHING DEPLOYED - a human holds both.
moved: pending/ -> claimed/ticket-to-pr-ABC-014-sec/ -> done/ticket-to-pr-ABC-014-sec/ - ALL BY HAND
  (no scripts/claim.js in this install; the claim dir was created with a plain mkdir, still atomic
  and still EEXIST on a second writer).
