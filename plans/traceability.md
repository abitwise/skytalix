# Traceability Matrix
_Updated: 2026-07-31 by BA/PM (subtask `ba-pm-legality-resequence`) — two rows appended, ABC-020 and ABC-021, cut under the project owner's standing legality-first priority of 2026-07-31 from QE's G-1 conformance gap; ABC-009's Status cell re-read Backlog → Ready with its escalation attributed to the DIRECTIVE and not to its own trigger, which is recorded as unspent. Previously the same day: ADR-0004 ratified — its owed decision row appended, clauses 1 + 3 as proposed and clause 2 as amended; ABC-013's Status Blocked → Ready with the merge block lifted. Previously 2026-07-30: EPIC-002 decomposed — eight ABC-012..ABC-019 rows replace its `pending` row; ABC-011's Status updated to Ready on its own escalation trigger)_

<!--
  FORMAT — read before you append. (clear voice; this is a technical file, not a role prompt.)

  This is the single requirement -> ticket -> code -> test -> UAT -> release matrix for grugops.
  It ships EMPTY: header + separator only, zero data rows. Roles append rows as work is done.

  One row per ticket. The header columns below are fixed — do not rename or reorder them.

  Example row shape (this is a comment, NOT a live table row — the generic `ABC-` prefix
  illustrates the format only):

    | ABC-012 | FX conversion | EPIC-003 | FEAT-007 | NFR-002 | #41 / src/fx/* | fx.spec.ts, e2e/fx | UAT-12 pass | REL-0007 | Done |

  Stable ID scheme (set the ticket prefix in config `id_prefix`, default `ABC`):

    EPIC-xxx     epic
    FEAT-xxx     feature
    <prefix>-xxx ticket (project prefix + number; prefix from config `id_prefix`, default `ABC`)
    ADR-000x     architecture decision
    NFR-xxx      non-functional requirement
    RISK-xxx     risk
    REL-xxxx     release
    INC-xxxx     incident

  Append rules:
    - BA/PM creates the row when a ticket is born.
    - Each role appends its link as it completes work (Architect adds ADR/NFR; Engineer adds
      PR/files; QE adds tests; UAT adds result; Release adds REL id).
    - Definition of Done (enterprise) is not met until the row is complete through the relevant stage.
    - The validator can check for tickets missing rows or rows missing tests.
-->

| Ticket | Title | Epic | Feature | NFRs | Code (PR/files) | Tests | UAT | Release | Status |
|--------|-------|------|---------|------|-----------------|-------|-----|---------|--------|
| ABC-001 | Position state and FEN round-trip | EPIC-001 | — | NFR-001, ADR-0001 | src/position.ts, src/fen.ts (merged to main) | src/fen.test.ts — 27 pass, coverage 100% stmt / 98.73% branch | | | Done |
| ABC-002 | Pseudo-legal move generation for all piece types | EPIC-001 | — | NFR-001 | src/moves.ts, src/position.ts (merged to main) | src/moves.test.ts — 22 pass, suite 49 pass, src coverage 100% stmt / 99.15% branch | | | Done |
| ABC-003 | Apply and undo a move with full state restoration | EPIC-001 | — | NFR-001 | src/apply.ts (merged to main) | src/apply.test.ts — 15 pass (5 acceptance, 5 unit, 5 QE), suite 64 pass; src/apply.ts 100% stmt/branch/func/line | | | Done |
| ABC-004 | Special moves — castling, en passant, promotion | EPIC-001 | — | NFR-001 (sec/NFR PASS) | src/moves.ts, src/apply.ts (merged to main) | src/moves.test.ts + src/apply.test.ts — suite 84 pass, src 100% stmt/branch/func/line; EPIC-001 review gate PASS 2026-07-24 | UAT deferred — EPIC-006 | | Done |
| ABC-005 | Legal move filtering and attack detection | EPIC-001 | — | NFR-001 (sec/NFR PASS) | src/legal.ts (merged to main) | src/legal.test.ts — 12 tests, suite 96 pass, src 100% coverage; EPIC-001 review gate PASS 2026-07-24 | UAT deferred — EPIC-006 | | Done |
| ABC-006 | Perft verification harness | EPIC-001 | — | NFR-001 (~6.2M nps ≥ 1M MET; sec/NFR PASS_WITH_RISKS — nfr-catalog empty, owner Architect/Design), RISK-001 retired | src/perft.ts, src/perft-bench.ts, package.json (merged to main) | src/perft.test.ts — 24 fast + 8 deep (PERFT_DEEP), all 6 positions match published perft; suite 120 pass; EPIC-001 review gate deep perft 32/32 exact 2026-07-24 | UAT deferred — EPIC-006 | | Done |
| ABC-007 | Game-end detection | EPIC-001 | — | NFR-001 (sec/NFR PASS) | src/gameend.ts, src/zobrist.ts (merged to main) | src/gameend.test.ts + src/zobrist.test.ts — 23 tests, suite 143 pass, library 100% coverage; EPIC-001 review gate PASS 2026-07-24 (7/7 acceptance + precedence probes, skip-count 0) | UAT deferred — EPIC-006 | | Done |
| ABC-008 | SPIKE — Node search throughput | EPIC-004 | — | NFR-001, NFR-005 | spike/perft-bench.ts, package.json, tsconfig.json, biome.json | n/a — spike (see note) | | | Done |
| ABC-009 | legalMoves mutates the position it documents as unchanged | EPIC-001 | — | NFR-001 (no regression: perft ≥ 1M nps, deep perft 32/32) | not started — defect in merged src/legal.ts, src/moves.ts | not started — repro is the acceptance test. QE gap G-6 adds the frequency fact: gameStatus calls legalMoves on its FIRST line, so ABC-019's loop reaches this defect once per ply — the highest-frequency route in the built product | | | Ready — escalated P2→P1 2026-07-31 by the owner's legality-first directive, NOT by this ticket's own trigger, which is recorded as unspent (ABC-010 is neither deferred nor descoped and no epic accepts an outside position yet) |
| ABC-010 | FEN semantic validation | EPIC-003 | — | NFR-003 (parse+validate < 1 ms/call) | not started — defect in merged src/fen.ts | not started — repro table is the acceptance test | | | Backlog |
| ABC-011 | Zobrist key hashes en passant when no capture is available | EPIC-001 | — | NFR-005 (depth-in-budget as ratified 2026-07-30 — EPIC-004's transposition table computes a key per node, so per-call cost buys depth; bar: zobristKey within 1.5x of the audit's 288–306 ns at kiwipete, no-ep path not slower), NFR-001 (**not** at risk and `npm run perft` is not the oracle — src/perft.ts never imports zobrist; the module's only production consumer is src/gameend.ts), ADR-0002 (clause 2, accepted 2026-07-30, makes the derived key list the substrate for every repetition verdict) | not started — defect in merged src/zobrist.ts:71 | not started — repro is the acceptance test; note src/gameend.test.ts:27-58 (threefold) CANNOT catch it — its knight cycle never sets an ep square, and ABC-012's own threefold test must reuse that same ep-free shape for the same reason | | | Ready — escalated P2→P1 2026-07-30, its own trigger fired when ABC-012 (the ADR-0002 clause 2 history module) was decomposed |
| ADR-0002 | Game history ownership | EPIC-002, EPIC-004, EPIC-005, EPIC-006 | — | NFR-005 (per-node cost argued against a ~5,000 ns search node; catalog row NOT changed by this ADR), NFR-003 (replay 41 µs = 0.089% of the 50 ms keystroke budget), ADR-0003 (stated dependency, answered by measurement), ADR-0001 (mutable never-copied Position inherited) | no src/** change — decision only; memory-bank/50-decisions/ADR-0002-game-history-ownership.md | no test owed — no code change. The ADR states plainly that **no existing test would catch getting this wrong**: the history module's own tests and EPIC-006's "undo rewinds repetition history too" test are the only safety net, and both are owed at EPIC-002 decomposition | | | Accepted — ratified by Olger Oeselg 2026-07-30, **all four clauses as proposed** (two factual refreshes on ratification, no clause amended) |
| ADR-0003 | Legality strategy — make / test / unmake | EPIC-004 | — | NFR-005 (target re-derived to depth-in-budget; catalog row rewritten 2026-07-30, old ≥ 500,000 nodes/sec RETIRED; depth-7 level PROVISIONAL), NFR-004 (the requirement underneath), NFR-003 (legalMoves ~19,000x under the 100 ms `moves` budget), RISK-002 (GO WITH CONSTRAINT unchanged) | no src/** change — clause 1 is precisely that src/legal.ts is not changed; memory-bank/50-decisions/ADR-0003-legality-strategy.md, plans/nfr-catalog.md (NFR-005 row) | no test owed — suite 143/143 green and deep perft 32/32 exact, both unchanged. EPIC-004's timeboxed spike (RISK-002's mitigation) owns the depth-in-budget measurement on non-M3 hardware that lifts the PROVISIONAL marker | | | Accepted — ratified by Olger Oeselg 2026-07-30, clauses 1 + 3 as proposed, **clause 2 as amended** |
| ABC-012 | Game history module — the move list is the authoritative state | EPIC-002 | — | NFR-003 (derives sit in the 50 ms turn, not the frame: takeBack(2) ≤ 5 µs, keyHistory ≤ 60 µs, repetitionCounts ≤ 75 µs, all @ 120 plies M3), NFR-002 (contributes nothing measurable to a frame), ADR-0002 (ratified — clause 2 is what this module IS; clause 4's single supplier is `gameStatusOf`) | not started — new module src/history.ts | not started — six named tests are this module's ONLY safety net; ADR-0002 states plainly that no existing test would catch getting it wrong. Test 1 = EPIC-006's "undo rewinds the repetition history too" | | | Ready |
| ABC-013 | SAN rendering — src/san.ts with toSan only | EPIC-002 | — | NFR-002 (toSan with supplied legal list ≤ 0.20 µs, unassisted ≤ 6.5 µs, M3 @ ply-60; SAN is ~97% legalMoves), ADR-0004 (**accepted 2026-07-31** — the merge block is lifted; clause 2 amended, which changes EPIC-003's `parseSan`, not this ticket's `toSan`) | not started — new module src/san.ts, `toSan` only. EPIC-003 adds `parseSan` to the SAME file, under the AMENDED clause 2 (discriminated `SanParseResult`, and every returned Move an element of the generated legal list); this epic ships no parser and EPIC-003 ships no second formatter | not started — hand-built (fen, move, expected) table, written so EPIC-003 extends rather than replaces it. **The real safety net, the round-trip over perft positions, belongs to EPIC-003** and does not exist until then; as amended it asserts REFERENCE identity against one shared legal list, which is the only form that can falsify ADR-0004 clause 2b | | | Ready — unblocked 2026-07-31 when ADR-0004 was ratified; deps ABC-003 + ABC-005 are merged on main |
| ABC-014 | Board frame renderer — grid, labels, shading, orientation, both glyph modes | EPIC-002 | — | NFR-002 (board-frame compute ≤ 500 µs/frame, recorded with its machine; one of the two unmeasured halves) | not started — merged src/ only (position.board, squareAt, squareName) | not started — snapshot matrix of (perft FENs x 2 glyph modes x 2 orientations), plus a code-point-count assertion for epic acceptance 2a and a file-label-order assertion for the both-axes orientation rule | | | Ready |
| ABC-015 | Glyph mode selection — precedence, signal set, --unicode override | EPIC-002 | — | NFR-007 (inside the < 2 s cold start: zero filesystem and zero process operations — reads `process.stdout.isTTY` and `process.env` only), RISK-005 (this ticket IS the named mitigation, and "built in from the start rather than retrofitted" is why it carries a merge-with-or-before-ABC-014 constraint) | not started — implements epic acceptance 2b's five-row selection table | not started — nine table-driven unit tests with the environment injected, no TTY required; includes a win32 REGRESSION GUARD on the deliberate decision not to use `process.platform` as a signal | | | Backlog |
| ABC-016 | Status panel — side to move, check, material, move number, last move, thinking row | EPIC-002 | — | NFR-002 (panel compute ≤ 250 µs/frame, derivation shown on the ticket) | not started — carries epic acceptance #3 (check indicator) | not started — material-balance FEN table INCLUDING the post-promotion case (the one a board-diff gets wrong), move number from a LOADED FEN (the one history.length gets wrong), row count asserted identical in both thinking states | | | Backlog |
| ABC-017 | Bounded move-history pane — two-column SAN, constant height | EPIC-002 | — | NFR-002 (pane compute ≤ 150 µs at ANY game length, and the 40/120/300-ply figures within 2x of each other — the O(window) proof), ADR-0004 clause 3 (derived per frame, never stored) | not started — pre-adopts ADR-0004's own first response to its clause-3 trigger: render only the visible window | not started — row count asserted at 0 / 1 / 80 / 300 plies, move NUMBERS asserted (33–40 for a 40-move game, not 1–8), cost asserted as a RATIO as well as an absolute | | | Backlog |
| ABC-018 | Frame output and redraw — in-place on a TTY, append otherwise | EPIC-002 | — | NFR-002 (**this ticket closes the half the catalog row calls "the half nobody has measured"** — frame compute + write < 16 ms at 40/120/300 plies against a non-TTY sink, recorded with its machine), NFR-007 (first frame is inside the < 2 s cold start), **SECURITY: terminal escape-sequence injection** via the frame's message region — the epic's one real security trigger, ASVS L1 output encoding applied to a terminal sink | not started — carries epic acceptance #4 in full (4a/4b/4c) | not started — assertions run against a captured sink and an in-memory screen model, never a real TTY; zero `\x1b` bytes in append mode; zero rows from frame N after frame N+1 | | | Backlog |
| ABC-019 | Turn loop skeleton — ply dispatch, both seams stubbed, clean termination | EPIC-002 | — | NFR-002 (loop overhead ≤ 100 µs/ply at 120 plies, excluding render/input/engine), NFR-004 (**EPIC-004's target, not this ticket's** — what binds here is that the engine seam is asynchronous BY CONTRACT), ADR-0002 (clause 4: gameStatus is never called bare) | not started — 8 states, 15 transitions, two stub seams built from merged src/ alone. Carries ABC-009 (legalMoves called once per frame) and ABC-011 (every repetition verdict) as INHERITED exposure, not as new defects | not started — scripted games through the stub seams, one table row per terminal reason; asserts call ORDER inside a ply (append-then-evaluate, the only case a happy path misses) and frame COUNT (one render per ply) | | | Backlog |
| ADR-0004 | SAN ownership — one module, both directions, derived per frame | EPIC-002, EPIC-003, EPIC-006 | — | NFR-002 (SAN is the most expensive single item in a frame and ~97% of it is inside legal.ts: toSan 4.31–4.45 µs unassisted, 0.10–0.11 µs with the legal list supplied, M3 @ ply-60; clause 3's derive-per-frame is what the NFR-002 row is written against, and the catalog row is NOT changed by this ratification), NFR-003 (EPIC-003's `moves` command formats ~41 moves at the supplied-list cost, ~25,000x under the 100 ms budget), ADR-0002 (clause 2 kept whole — clause 3 adds no exception to derive-don't-maintain; history.ts does not import san.ts), ADR-0003 (clause 1 is what the 4.31 µs was measured under; if clause 3's (c2) is ever spent this module gets ~3-4x cheaper for free) | no src/** change — decision only; memory-bank/50-decisions/ADR-0004-san-ownership.md. Owed at build time: ABC-013 creates src/san.ts with `toSan`; EPIC-003 adds `parseSan` to the SAME file under the amended clause 2 | no test owed by the ratification — nothing measured, no number changed. **The named verification is EPIC-003's round-trip property test**, amended to its exact form on ratification: for every legal move, `parseSan(position, toSan(position, move, legal), legal)` returns `outcome: "move"` with the move IDENTICAL BY REFERENCE (field equality cannot falsify clause 2b). It cannot run until both directions exist, and this ADR states plainly that **no existing test covers any of this** | | | Accepted — ratified 2026-07-31 by the **Orchestrator under a named, quoted delegation from Olger Oeselg** dated 2026-07-31, NOT by a human directly — the first such ADR in this project and explicitly NOT precedent; clauses 1 + 3 as proposed, **clause 2 as amended** (2a `parseSan` returns a discriminated `SanParseResult` — `move` / `ambiguous` / `rejected`, total, never a bare `null`; 2b move identity written in as normative) |
| ABC-020 | FIDE 9.2/9.3 draws become claimable, and FIDE 9.6 automatic backstops land with them | EPIC-001 | — | NFR-001 (leaf cheapness, three numeric bars: legalMoves calls per gameStatus stays EXACTLY 1, zobristKey calls at most 1, gameStatus within 1.5x of its measured 2.52 µs — Apple M3 / Node v24.12.0 / darwin-arm64, `UNKNOWN - verify` elsewhere), ADR-0002 (clause 1 — no new state on Position; clause 4 — positionCounts stays optional and keeps its single supplier, and the RETURN-SHAPE question is flagged to Architect/Design as an open design-hop item, not decided in dev) | not started — conformance change to merged src/gameend.ts. NOT a defect: the module does exactly what ABC-007 specified and a human accepted at merge; what changed is the specification, under the owner's standing priority of 2026-07-31 | not started — QE's reproductions ARE the tests (observation 20260731T151500Z-qe-e2e-observation-36373ca4, gap G-1): the 6k1/5ppp/8/b7/8/8/5PPP/4R1K1 shuffle line, the clock-100 twin, the 8/8/8/p1p1p1p1/P1P1P1P1/8/8/K6k locked wall driven to a 150-ply bound (acceptance A5 — the criterion that fails if the claim half and the 9.6 half are split apart). **FIRST ticket in this project whose acceptance PERMITS modifying existing tests** — five in src/gameend.test.ts, named on the ticket (lines 27, 69, 191, 195, 199); line 142 deliberately does NOT change | | | Ready — cut and promoted 2026-07-31 |
| ABC-021 | Draw-claim interaction — the player having the move claims, the loop ends the game, the engine does not | EPIC-002 | — | NFR-002 (ABC-019's ≤ 100 µs/ply bar UNCHANGED — availability is read from the single gameStatusOf call the ply already makes; a second repetitionCounts would cost 46–50 µs at 120 plies, half the per-ply budget for a value already in hand), NFR-003 (no work the prompt did not already do), SECURITY: the rejection message reaches the frame's message region, which ABC-018 sanitizes — no second path to the sink | not started — one outcome added to ABC-019's eight-state machine. Built against ABC-019's STUB input seam, which matches a literal token; the real verb is EPIC-003's | not started — the A1 line driven TWICE from one fixture, once ending in `claim` and once in `Re8`: same position, two legal continuations, two correct results. Asserts by spy that the engine seam is never asked to claim, and that gameStatusOf is called exactly ONCE per ply. Repetition fixtures reuse the ep-free knight-cycle shape for ABC-011's reason | | | Backlog — behind ABC-020 and ABC-019 |
| pending | Move input and controls | EPIC-003 | pending | NFR-003 | | | | | Backlog |
| pending | Engine and AI opponent | EPIC-004 | pending | NFR-004, NFR-005 | | | | | Backlog |
| pending | Opening book | EPIC-005 | pending | NFR-006 | | | | | Backlog |
| pending | Game session and packaging | EPIC-006 | pending | NFR-007 | | | | | Backlog |

<!--
  EPIC-001 is decomposed: its seven ABC-xxx ticket rows are live. EPIC-002..EPIC-006 still
  read `pending` — Workflow 02 landed them as epics only, and `/grugops:plan` epic-to-tickets
  (Workflow 03) replaces each `pending` with real ticket ids as each epic is decomposed.

  The Feature cell reads `—` for the EPIC-001 tickets, not `pending`: that epic maps directly
  to tickets with no intermediate feature. A single FEAT-xxx wrapping all seven would be a
  one-use grouping that adds a hop to the trace and explains nothing (AGENTS.md coding rule 6).
  Later epics may genuinely need features; this one does not.

  Every NFR id above is a BA/PM trigger with a measurable target stated in its epic;
  Architect/Design seeds the matching rows in plans/nfr-catalog.md at design time.

  ABC-011 is a DEFECT row appended 2026-07-30 by BA/PM, cut from the same architecture audit on the
  recommendation in ADR-0002's out-of-scope en-passant section. It traces backwards exactly like
  ABC-009/ABC-010 — the code it names (src/zobrist.ts, merged under ABC-007) is Done, and Code/Tests
  read "not started" because the FIX has not been written. Its NFR cell names NFR-005 rather than
  NFR-001 because the key is on EPIC-004's per-node transposition-table path and NOT on the perft
  path, and it says so explicitly so nobody runs the deep perft lane believing it proves something
  here. It sits under EPIC-001 (the rules core whose module and whose documented intent it breaks),
  and is independent of ABC-009 and ABC-010.

  ABC-011 was ESCALATED P2 -> P1 and promoted Backlog -> Ready on 2026-07-30 by BA/PM, and its
  Status cell above now reads Ready. This was not a judgment call made fresh: the ticket's own
  escalation trigger names condition (a) as "the history module of ADR-0002 clause 2 is decomposed
  or implemented under EPIC-002", and ABC-012 is that module. The trigger also required ABC-011 to
  be Ready BEFORE that consumer lands, "otherwise that consumer's own tests are written against a
  key that under-detects and the defect stops being a bug and becomes an encoded assumption".
  Size, acceptance criteria, reproduction, the open design question and the NFR-005 bar are all
  unchanged; only sequencing moved, which is what the trigger encodes.

  EPIC-002's eight ABC-012..ABC-019 rows were appended 2026-07-30 by BA/PM (task
  `epic-to-tickets-EPIC-002`, Workflow 03), replacing the `pending` row that stood for the whole
  epic. Feature reads `—` rather than `pending` for the same reason EPIC-001's tickets do: this epic
  maps directly to tickets and a single FEAT-xxx wrapping all eight would be a one-use grouping that
  adds a hop to the trace and explains nothing (AGENTS.md coding rule 6).

  Every Code and Tests cell reads "not started" because nothing under src/ was touched by the
  decomposition — deliberately, and it is the subtask's stated constraint. The cells are not left
  blank: a blank reads as "no evidence gathered yet", whereas these name the module a later
  ticket-to-pr run must create and the test shape that must exist. Several Tests cells name what
  a naive test would MISS rather than only what it must cover, because in this epic the misses are
  the expensive part (a threefold test whose repeated line sets an en-passant square would fail on
  ABC-011 rather than on the code under test; a history-pane test that only counts rows passes on
  an implementation showing the FIRST eight move pairs instead of the last eight).

  ABC-020 and ABC-021 were appended 2026-07-31 by BA/PM under the project owner's standing priority
  ("chess moves must be legal according to game rules, everything else comes after that"). They trace
  differently from every defect row in this file and the difference is deliberate:

  ABC-020 is a CONFORMANCE row, not a defect row. src/gameend.ts does exactly what ABC-007 specified,
  passed a review gate and a security/NFR gate, and was merged on explicit human instruction. Nothing
  escaped a gate. What changed is the SPECIFICATION — the directive reopened a ruling that ABC-007
  and ABC-019 had each closed, and both `## Out of scope` blocks were amended in place the same day
  so the record does not contain two documents disagreeing. Its Code cell says "conformance change"
  rather than "defect in merged src/" for exactly that reason.

  ABC-020's NFR cell names ADR-0002 twice and this is the load-bearing part of the row: clause 1 (no
  new state on Position) and clause 4 (positionCounts stays optional, single supplier unchanged) both
  bind it, and the ONE question it cannot answer for itself — how a claimable set reaches the caller,
  which brushes clause 4's "the signature does not change" sentence — is flagged to Architect/Design
  as a design-hop item. No agent may amend a ratified clause; if that shape decision turns out to be
  an amendment rather than an extension, it goes to a named human.

  The two rows are a MERGE-ORDER pair with ABC-019 and ABC-016, whose acceptance criteria were
  amended on the same day to match ABC-020. Build either against today's automatic semantics and the
  deviation stops being a bug and becomes an encoded assumption — the identical failure mode
  ABC-011's escalation trigger was written to prevent, and the reason that trigger's wording is
  quoted on ABC-020's Dependencies.

  PAID 2026-07-31 — the ADR-0004 row below the ABC-019 row is the one the paragraph that follows
  said was owed, and ABC-013's Status cell was re-read with it (Blocked -> Ready). Read the ADR-0004
  Status cell before citing it: this ADR was ratified by the ORCHESTRATOR under a named, quoted
  delegation from Olger Oeselg dated 2026-07-31 — the first ADR in this project not ratified by a
  human directly, and explicitly NOT precedent for agents self-ratifying. The row says so in the
  cell rather than reading a bare "Accepted", because a reader scanning this column must not
  mistake it for the two rows above it, which a human did rule on in session. Clauses 1 and 3 landed
  as proposed; clause 2 was AMENDED and its amendment changes EPIC-003's parseSan contract, not
  ABC-013's toSan — which is why ABC-013's own Code/Tests cells moved but its scope did not.

  As written on 2026-07-30, before the ruling: ABC-013's Status reads Blocked, not Backlog. ADR-0004
  is `proposed` and blocks the merge of the first line of src/san.ts; no agent may mark an ADR
  accepted, so this needs the same named-human ratification ADR-0002 and ADR-0003 each received. NO
  ADR-0004 ROW WAS APPENDED to this file — the convention recorded below is that ADR rows land AFTER
  ratification, and a row for a proposed decision would read as settled. The row is owed on
  ratification, together with a re-read of ABC-013's Status cell.

  The NFR cells here name measurable targets rather than NFR ids alone, because two of this epic's
  four acceptance criteria were amended on 2026-07-30 for being untestable as written, and the
  amendment's whole point was that a target you cannot fail is not a target. Both amendments and
  the two promise reductions they carry are recorded in place in
  plans/epics/EPIC-002-terminal-board-and-game-loop.md.

  ABC-009 and ABC-010 are DEFECT rows, cut 2026-07-29 from the architecture audit
  (task `architecture-audit-2026-07-29`), and they trace backwards rather than forwards: the
  code they name is already merged and Done, and the Code/Tests cells read "not started"
  because the FIX has not been written. They are deliberately not left blank — a blank cell
  reads as "no evidence yet gathered", whereas these carry a known defective file that a
  later ticket-to-pr run must change. UAT and Release stay empty (Backlog, nothing gated).
  ABC-009 sits under EPIC-001 (the rules core whose documented contract it breaks); ABC-010
  under EPIC-003 (the input epic that makes it live).

  ADR-0002 and ADR-0003 are DECISION rows, appended 2026-07-30 by Architect/Design after a human
  ratified both (task `architecture-audit-2026-07-29`). They are rows rather than only NFR-column
  references — the way ADR-0001 appears on ABC-001 — because neither ADR hangs off a single ticket:
  ADR-0002 constrains four epics at once and ADR-0003 was ratified with no ticket owed by it at all,
  so a ticket row would have had nowhere to sit. Both trace FORWARD to the epics they constrain, not
  back to a ticket, and the Epic cell carries every epic bound by the decision.

  Code cells say "no src/** change" because that is the decision in both cases (ADR-0003's clause 1
  is literally "src/legal.ts is not changed"), and they name the decision record plus, for ADR-0003,
  the plans/nfr-catalog.md row its ratification rewrote. Tests cells name who owes the verification
  rather than inventing evidence: EPIC-002's decomposition for ADR-0002, EPIC-004's spike for
  ADR-0003's provisional depth-7 level. UAT and Release stay empty — a decision is not released, and
  nothing here is gated.
-->

