# ABC-014 — board history

> **Relocated from `plans/board.md` on 2026-08-10 by the Orchestrator.** The board had grown to
> 549,833 characters, 97% of it per-hop transition narrative. This file holds every board entry
> written about `ABC-014`, **verbatim** — only the surrounding `<!--` / `-->` HTML-comment delimiters
> were removed so the text renders. Nothing was rewritten, summarised or dropped, and none of it
> is duplicated back on the board.
>
> Ticket: [`ABC-014-board-frame-renderer.md`](../ABC-014-board-frame-renderer.md)

Entries appear in the order they stood in `board.md` (newest first, as the board was written).

---

## Ready (WIP 1/8) — column note

EMPTIED OF ABC-014 ON 2026-08-06 by the Orchestrator (task `ticket-to-pr-ABC-014`, Workflow 04) —
  the `Ready → In Development` pull this role owns. Ready 4/8 → 3/8, In Development 0/3 → 1/3.
  NO LIMIT APPROACHED, NO OVERRIDE TAKEN, no written reason owed.

  ABC-014 is item 2 of BA/PM's 2026-08-04 pull order and item 1 (ABC-012) is MERGED and Done, so
  this pull takes the order's next item and nothing else. THE ORDER IS NOT RE-OPENED.

  THE TWO PRIOR DECLINES ARE SPENT, NOT OVERTURNED. This role declined ABC-014 on 2026-08-02 and
  again on 2026-08-03 against the ABC-015 / RISK-005 contradiction. BA/PM untied that knot on
  2026-08-04 in four files; the constraint now binds at ABC-018, not here. Re-checked at the pull
  rather than taken on trust: ABC-014's Dependencies, ABC-015's, ABC-018's and EPIC-002's RISK-005
  entry all now name ABC-018, and no two of them disagree. Chain ABC-014 → ABC-015 → ABC-018 is
  acyclic.

  NO DESIGN HOP AND NO UI HOP — In Design stays 0/2, and this is a judgment, not an omission.
  The three cross-ticket contracts this renderer would need a design hop to settle are already
  settled in writing: shading is BY CHARACTER (EPIC-002 scope amendment [A4]), the glyph mode is a
  PARAMETER this module does not choose (amendment [A1] / acceptance 2b, whose selection table is
  ABC-015's), and the frame is a VALUE with constant geometry (acceptance 4a, which states in its
  own words that "the exact split is the engineer's"). Frontend/UI was considered and declined: its
  output is a UI contract — tokens, component inventory, five states, a11y bar — and every one of
  those questions is either already answered above or does not exist for a function that returns an
  array of strings. Inventing a hop to re-state settled decisions is waste, not caution. The trigger
  that WOULD earn a Frontend/UI hop is named so it is not missed: ABC-018, where the board, status
  panel, history pane and message region compose into one frame under acceptance 4a/4b/4c.

  PREMISES RE-VERIFIED AGAINST MERGED `main` (ed42d26) AT THE PULL, not read off the ticket:
  src/render.ts does not exist; fileOf, rankOf, squareAt, pieceType, isBlack and Position are all
  exported from merged src/position.ts; the standing perft FEN table the geometry criterion is
  written over is in src/perft.test.ts (7 FENs). NO UNBUILT DEPENDENCY.

  ONE TICKET, NOT THREE, against a limit of 3 — the same reasoning recorded for ABC-020, ABC-011 and
  ABC-012. ABC-009, ABC-013 and ABC-022 are all pullable; a second concurrent ticket buys throughput
  this project has no way to spend and costs review attention it does. Width for this task is 1
  regardless: ticket-to-pr is a chain (engineer → QE → Security/NFR), each stage reading what the
  last one published.

  NOTHING WAS MERGED AND NOTHING WAS DEPLOYED. Full reasoning, the Definition-of-Ready re-check and
  what this pull does NOT authorize are in the pull decision note, not summarised here:
  .grugops/context/ticket-to-pr-ABC-014/notes/20260806T090000Z-orchestrator-decision-3b7c1d24.md

  ---
  ENTERED 2026-08-04 by BA/PM (task `refinement-2026-08-04`, subtask
  `ba-pm-generator-defect-and-abc014-knot`, Workflow 07) — the `Backlog -> Ready` exit this role
  owns. Two items were routed here by the Orchestrator; both are closed. Ready 4/8 -> 5/8.
  NO LIMIT APPROACHED AND NO OVERRIDE TAKEN; no written reason is owed for the count.

  ITEM 1 — ABC-022 CUT (S, P1, EPIC-001, straight to Ready). `generateMoves` offers en-passant
  captures its own stated preconditions forbid. Routed to BA/PM by THREE roles across ABC-011 and
  cut by none; it is now owned.

  REPRODUCED BY BA/PM BEFORE CUTTING, on a script that copied none of theirs. What the three prior
  descriptions said holds. THREE THINGS THEY DID NOT SAY, each of which changed the ticket:

  a) THE SHAPE IS PIECE-AGNOSTIC. Both FENs on record put a KNIGHT on the ep target. A ROOK
     reproduces identically (`4k3/8/8/8/3pP3/4r3/8/4K3 b - e3 0 1`) — line 177 reads only the
     occupant's COLOUR. An acceptance criterion naming the two recorded FENs would have been
     satisfiable by a knight-shaped fix. AC A1 is written over the class instead.
  b) THERE ARE TWO DEFECTS IN THAT BRANCH, NOT ONE, AND THE UNROUTED ONE IS WORSE. The routed half
     (a) — no empty-target check — is pure and gives a wrong answer. Half (b) — no check that the
     captured pawn EXISTS — makes `legalMoves` PERMANENTLY CORRUPT the position it is handed
     (`4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1` gains a phantom black pawn on a2). That is ABC-009's
     symptom by the en-passant route. Both are the same four lines, so they are ONE ticket; splitting
     them would give two tickets editing the same `if`.
  c) ONE TRAP IN THE ROUTING NOTE IS HALF WRONG, AND CORRECTING IT STRENGTHENS THE CONCLUSION. The
     note says perft cannot clear this because the legality filter later rejects the over-offered
     move. MEASURED: THE FILTER DOES NOT REJECT IT — `legalMoves` returns it on both reproductions.
     Perft is silent because the TRIGGER POPULATION IS EMPTY: 0 of 518,474 reachable nodes carry an
     occupied ep target. So no perft depth and no added perft position can EVER reach this defect,
     which is why the ticket's test notes forbid adding one. Conclusion unchanged and stronger:
     32/32 exact does not clear this class.

  THE OTHER TRAP IS CONFIRMED AND STRENGTHENED. ABC-011's guard (a) is NOT a deletable workaround.
  QE's correction to the Engineer was that it covers two classes and only one is this defect.
  Re-derived here by DELETING guard (a): the predicate answers `true` on BOTH classes, including the
  own-piece one. `hasLegalEnPassant` SYNTHESISES its probe move and never consults `generateMoves`,
  so guard (a) is a precondition of the PREDICATE, not compensation for the generator. Fixing
  ABC-022 changes neither row. "Deletable" is not over-stated, it is FALSE. The ticket carries QE's
  correction rather than the Engineer's original framing, as instructed, and goes past it.

  PRIORITY P1, NOT P0 — and this is the ranking the Orchestrator's note left open, answered rather
  than dodged. Applying THIS BOARD'S OWN P0 test, written here on 2026-07-31 under the owner's
  legality-first directive and never overturned: "P0 means the owner's directive applies AND the
  fault is reachable". The directive applies — it is a move-legality defect in the query that defines
  legal moves. It is NOT reachable — 0 of 518,474 nodes, invalid FEN only, and EPIC-003 is
  undecomposed. ABC-009 is the identical shape and was ruled P1 on this same test on the same day;
  ruling ABC-022 P0 would rank it ABOVE ABC-009, which is not defensible (ABC-009 is reached by
  `gameStatus` on its first line, every ply — a strictly wider surface).

  SO ABC-022 DOES NOT GO AHEAD OF ABC-012. Said plainly because the routing note made that the open
  question and "no" is the honest answer. An escalation trigger is on the ticket: it rises to P0 if
  EPIC-003 accepts an outside position, if ABC-010 is deferred/descoped, or if any position reachable
  by legal play is shown to carry an occupied ep target.

  ITEM 2 — THE ABC-015 / ABC-014 / RISK-005 KNOT IS UNTIED, and ABC-014 IS PULLABLE.

  THE CONTRADICTION: ABC-015 said it "merges with or before ABC-014 reaches Done, never after", while
  needing ABC-014 first (ABC-014 declares the `GlyphMode` type it returns) and sitting
  `blocked-until: ABC-014`. In this project Done MEANS MERGED (mode=lean), so that required ABC-015
  to merge no later than the ticket it cannot be written without. Jointly satisfiable only if both
  merge in one act — i.e. only if they are one ticket, which ABC-014's own size rationale rejects
  ("folding all three gives an 8-point XL and an automatic SPLIT_REQUIRED").

  WHICH DOCUMENT WAS WRONG: ABC-015's. ABC-014's Dependencies already said the right thing —
  "with or before this ticket's FIRST USER-VISIBLE USE" — and ABC-015 mis-copied it as ABC-014
  reaching Done. ABC-014 reaching Done is not a user-visible use of anything: ABC-014 "returns a
  frame as a value and writes nothing" and takes the glyph mode as a PARAMETER it does not choose, so
  merging it cannot produce the hardcoded-mode build RISK-005's "built in from the start rather than
  retrofitted" rules out.

  THE REAL CONSTRAINT: ABC-015 merges with or before ABC-018 — the ticket that makes the frame a
  DISPLAY rather than a value, and the first thing in EPIC-002 a player can see. Corrected IN PLACE
  in four files so no two documents disagree: ABC-015 (Dependencies + priority rationale + DoR),
  ABC-014 (clarified, naming ABC-018), ABC-018 (gains the constraint and the obligation not to
  hardcode or re-derive the mode), and EPIC-002's RISK-005 entry (which had propagated the wrong
  wording). Chain is now ABC-014 -> ABC-015 -> ABC-018, acyclic.

  WHAT DID NOT CHANGE, DELIBERATELY: RISK-005's severity and its MITIGATION STRATEGY (only the event
  the sequencing binds to moved — if anyone reads it as changing the mitigation, that is
  Security/NFR's call, not BA/PM's); ABC-015's size, priority, scope, acceptance and Backlog
  position; and its `blocked-until: ABC-014`, which was always correct. ABC-015 is NOT promoted to
  Ready: untying the merge order did not remove the build dependency, ABC-014 is still unbuilt, and
  this board's own Ready test is "no unbuilt dependency".

  PULL ORDER FOR READY (guidance; the pull is the Orchestrator's), with a reason per ticket:

    1. ABC-012 (M, P0) — unchanged from the 2026-07-31 order, and its blocker is gone: ABC-011 is
       merged, so its repetition tests can be written against a key that means what FIDE means. No
       design hop. ABC-022 does NOT displace it (P1 vs P0, latent vs reachable).
    2. ABC-014 (M, P0) — the other P0 the product's existence rests on, and it is pullable for the
       first time: the knot that stopped it twice is untied and it never blocked on ABC-015.
    3. ABC-009 (S, P1) — first of the two rules-core defects. Ahead of ABC-022 on standing rank (in
       Ready since 2026-07-31) and on the marginally wider reachable surface (`gameStatus` reaches
       it every ply). DELIBERATELY NOT REORDERED against ABC-022.
    4. ABC-022 (S, P1) — beside ABC-009, same class, same trigger (invalid FEN), same gate
       (ABC-010). Different function (`addPawnMoves` vs `addCastlingMoves`), so the two do not
       conflict and either may ship first.
    5. ABC-013 (M, P1) — renderer work, below every P0 and below the rules-core defects. Unchanged;
       the 2026-07-31 rule that rules-core beats renderer inside one priority still holds.

  WHAT WAS RE-READ AND DELIBERATELY NOT MOVED. A re-prioritisation that moves everything is a reflex,
  not a judgment, so each carries its reason:

  - THE 2026-07-31 RE-SEQUENCING IS NOT RE-OPENED. Its comment above stands unamended. The pull order
    here is that order with the two Done tickets removed and one new P1 inserted at its rank.
  - ABC-012, ABC-014 stay P0; ABC-009, ABC-013 stay P1; ABC-010 stays P1 in Backlog. Nothing this
    task found bears on any of them. ABC-022 is a NEW defect in the same latent class as ABC-009/010,
    not evidence about them.
  - ABC-015's size (S) and priority (P1) are untouched. The knot was a sequencing error, not a
    mis-sizing.
  - ABC-016/017/019/021 untouched — none is named by either item.
  - NO EPIC PRIORITY CHANGED.
  - ABC-010 IS NOT EDITED, though this task found a real gap in it: its scope rejects "an ep square
    with no pawn that could have made the double push", which closes ABC-022's half (b) trigger but
    NOT half (a) — on `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` the double-push pawn IS present and
    ABC-010 as written accepts the FEN. FLAGGED on ABC-022's Dependencies and in memory-bank's known
    issues, for ABC-010's own refinement. Editing it here would be the board sweep this task was
    told not to do.
  - ABC-009's Scope/Acceptance mismatch is NAMED, NOT FIXED: its Scope bullet 1 promises byte-identical
    return "for every position it accepts", but every one of its acceptance criteria is a castling
    FEN, so building it to its acceptance leaves ABC-022's half (b) live with a green gate. Recorded
    on ABC-022 so the two tickets do not silently overlap. Amending ABC-009's acceptance is a third
    item and was not taken.

  NOTHING WAS MERGED AND NOTHING WAS DEPLOYED — a human holds both. No column other than Ready moved,
  and Ready -> In Development is the Orchestrator's pull, deliberately not taken here.

  ---
  RE-SEQUENCED 2026-07-31 by BA/PM (subtask `ba-pm-legality-resequence`) against the project owner's
  standing priority, quoted verbatim from Olger Oeselg on 2026-07-31:

    "The most important thing is that chess moves are legal according to game rules, everything else
     comes after that. Game has to be played according to it's rules."

  This is a priority directive, not a feature request, and it outranks the sequencing set on
  2026-07-30. The input is QE's four notes of 2026-07-31 under task `epic-to-tickets-EPIC-002`
  (ranked gaps G-1..G-6, six refutations, the test artifact-ref, and five unsettled items).

  WHAT MOVED — three things, and only three.

  1. ABC-020 CUT and promoted straight to Ready (M, P0, EPIC-001). QE's G-1: the code applies FIDE
     9.2 (threefold) and 9.3 (fifty-move) automatically where the Laws make both a claim by the
     player HAVING THE MOVE. Reproduced with a FEN — 6k1/5ppp/8/b7/8/8/5PPP/4R1K1 — where this code
     declares 1/2-1/2 and FIDE says White mates with Re8. The deviation runs systematically against
     the human, because the engine is the side that repeats when it is losing. It REVERSES rulings
     made twice (ABC-007 and ABC-019 `## Out of scope`, the latter reading "Settled ... not open");
     both predate the directive and both `## Out of scope` blocks were amended in place the same day,
     so no two documents disagree. THE FIDE 9.6 BACKSTOPS (fivefold, 75-move) ARE IN THE SAME TICKET
     AND MUST NOT BE SPLIT OUT: the automatic fifty-move rule is currently the only thing that ends
     a locked position — QE drove one for 117 plies to prove it — so claims without 9.6 ship a game
     that never terminates. Acceptance A5 is the criterion that fails if anyone separates them.
  2. ABC-021 CUT (S, P1, EPIC-002, Backlog behind ABC-020 + ABC-019). The claim interaction: the
     human claims by command, the engine does NOT claim (it has no evaluation until EPIC-004, and
     "always claim" is strictly worse chess), no offer prompt (it would break epic acceptance 4a's
     constant row count), and the status panel states availability attributed to the side to move.
  3. ABC-009 ESCALATED P2 -> P1 and promoted Backlog -> Ready. `legalMoves` offers a FLAG_CASTLE move
     that is not a legal chess move and corrupts the board taking it back — the query that DEFINES
     legality returning an illegal move is exactly the class the directive names. Note carefully:
     the ticket's OWN escalation trigger has NOT fired and is recorded as unspent. This is a
     directive escalation. Not P0 — it still needs a semantically-invalid position, and no path in
     the product produces one today.

  WHAT WAS RE-READ AND DELIBERATELY NOT MOVED. A re-prioritisation that moves everything is a reflex,
  not a judgment, so each of these carries its reason:

  - ABC-010 (M, P1) stays P1. Already ranked as a legality defect on 2026-07-29 and its reachability
    is unchanged by the directive — it goes live when EPIC-003 accepts a user FEN, which is still
    unbuilt. Raising it to P0 would put an EPIC-003 ticket ahead of the tickets that make the game
    exist at all.
  - ABC-011 (S, P1) stays P1. ABC-020 gives it a second and now AUTOMATIC consumer (fivefold, FIDE
    9.6.1). That does not raise it, because a repetition loop can contain no capture and no pawn
    move, so the clock climbs and the CLOCK-BASED 75-move backstop terminates every game regardless
    of what the key does. Under-detection costs a late draw, never a hung game.
  - ABC-012 (M, P0), ABC-014 (M, P0), ABC-018 (S, P0), ABC-019 (L, P0) all stay P0. The directive
    re-ranks CORRECTNESS AGAINST FEATURES, not feature against feature. These four are not renderer
    polish — they are whether the product exists. Demoting them would model the directive as "stop
    building the game", which it does not say. What the directive DOES set is the pull order INSIDE
    P0: ABC-020 first.
  - ABC-013 (M, P1) stays P1. Renderer work, already below every P0.
  - ABC-015 (S, P1) stays P1. Its priority is a SEQUENCING constraint — RISK-005 requires it to merge
    with or before ABC-014 — not a claim about user value. Lowering it would rank it behind the
    ticket it must precede.
  - ABC-016 (M, P1) stays P1. The directive argues both ways and they cancel: its new item 7 is a
    rules affordance (without it no player learns a claim exists), items 1-6 are renderer work.
  - ABC-017 (S, P2) stays P2. Already the drop-first tier; P3 is "someday" and this is in the epic's
    scope line.
  - Every EPIC priority is unchanged (EPIC-002/003/004 P0, EPIC-005 P1, EPIC-006 P2). The directive
    lands on tickets, and the two epics that own rule conformance are already P0.

  WIP AND THE LIMIT. Ready 4/8 -> 6/8 against a configured limit of 8 (`.grugops/factory.config.json`
  `wip_limits.Ready`). NO LIMIT APPROACHED AND NO OVERRIDE TAKEN; no written reason is owed. Both
  promotions qualify on this board's own Ready test rather than on their priority — ABC-020 and
  ABC-009 each have NO unbuilt dependency, standing on merged src/ alone, which is the exact
  criterion that keeps ABC-015..ABC-019 and ABC-021 in Backlog. Six is still under the ceiling and
  Ready remains a buffer feeding In Development (WIP 3), not a target.

  SUGGESTED PULL ORDER (guidance; the pull is the Orchestrator's). ABC-020 first — P0 correctness,
  and it is a merge-order dependency for ABC-019 and ABC-016, whose acceptance criteria were amended
  today to match it. Then ABC-012 and ABC-014, the P0 tickets the product's existence rests on. Then
  ABC-009 and ABC-011, the P1 rules-core defects. Then ABC-013, the P1 renderer ticket. Within a
  single priority the directive ranks rules-core work ahead of renderer work; that ordering is stated
  here rather than encoded by inflating the P0-P3 scheme.

  As written 2026-07-31 by Architect/Design, before this re-sequencing:
  ABC-013 joined Ready 2026-07-31, moved out of Blocked by Architect/Design when ADR-0004 was
  ratified. Ready 3/8 -> 4/8, well under the limit; no override needed and none taken. Ready is the
  right column and not a conservative Backlog hold: ABC-013's only remaining dependencies are
  ABC-003 and ABC-005, both merged on main, so it has NO unbuilt predecessor — the one thing that
  keeps ABC-015..ABC-019 in Backlog. It does not depend on ABC-012 or ABC-014, and the two tickets
  that depend on IT (ABC-016, ABC-017) stay in Backlog behind it, unchanged.

  Read ADR-0004's Status section before citing this move: that ADR was ratified by the ORCHESTRATOR
  under a named, quoted delegation from Olger Oeselg dated 2026-07-31 — NOT by a human directly. It
  is the first ADR in this project ratified that way and it is explicitly NOT precedent; the standing
  rule that no agent may mark an ADR accepted is unchanged for every other ADR. The sentence in the
  Blocked comment below that reads "this is the same ruling on the same kind of artifact" was written
  on 2026-07-30 and is CORRECTED by this paragraph: it was the same kind of artifact, and it was not
  the same kind of ruling.

  As written 2026-07-30, before that ruling: Ready holds 3 of a permitted 8, and 3 is the honest
  number rather than a conservative one:
  ABC-012 and ABC-014 are the ONLY two EPIC-002 tickets with no unbuilt dependency at all — both
  stand on merged src/ alone. ABC-013 would have been the third and is in Blocked instead, on a
  decision only a human can make. The limit is a ceiling, not a target; Ready is a buffer feeding
  In Development (WIP 3), and flooding it would move the queue rather than shorten it. Same
  reasoning recorded when EPIC-001 put 3 of its 7 into Ready.

  ABC-011 joins them because its OWN escalation trigger fired: it rises to P1 and must be Ready
  "before whichever consumer of the key list lands first", and ABC-012 is that consumer. Both are
  in Ready together; the pull order is the Orchestrator's. ABC-011's size is unchanged at S.

  Emptied 2026-07-23: ABC-003 was pulled into In Development for ticket-to-pr. Its deps
  (ABC-001, ABC-002) are satisfied on main, so it was pulled straight from Ready — no
  analysis or design hop was needed (it arrived meeting the Definition of Ready in full).

---

## In Development (WIP 0/3) — column note

EXITED 2026-08-06 by the Software Engineer (task `ticket-to-pr-ABC-014`, subtask
  `engineer-abc014-implement`, Workflow 04): ABC-014 implemented with tests and a green mandatory
  gate, moved In Development -> In Review. In Development 1/3 -> 0/3, In Review 0/3 -> 1/3; no limit
  approached, no override taken, no written reason owed. The In Development -> In Review exit is the
  one board move this role owns. Nothing was merged and nothing was deployed -- a human holds both.

  THREE NEW FILES UNDER src/ AND NOTHING ELSE. src/render.ts (150 lines, 65 of them code),
  src/render.test.ts (353 lines, 17 tests) and src/__snapshots__/render.test.ts.snap (24 snapshots,
  the first snapshot file in this repo). ALL 20 PRE-EXISTING FILES UNDER src/ ARE md5-IDENTICAL TO
  MERGED `main` ed42d26, checked file by file against the tree rather than inferred, and
  `git diff --numstat ed42d26 -- src/` is EMPTY.

  THE LAYOUT IS THE ONE DECISION THIS TICKET HAD LEFT TO MAKE, and epic acceptance 4a hands it over
  in its own words ("the invariant is the criterion; the exact split is the engineer's"). The frame
  is 9 rows x 18 characters -- 8 board rows + 1 file-label row, matching 4a's reference split
  exactly. EVERY SQUARE IS TWO CHARACTERS: its shading character, then its piece glyph, or the
  shading character again when the square is empty. That is not cosmetic. It is what makes
  "adjacent squares on a rank are shaded differently" ASSERTABLE ON A FULL BACK RANK -- a one-
  character cell where the piece replaces the shading leaves the criterion vacuous exactly where the
  pieces are -- and the two-character pitch is what puts the file labels under the piece column with
  one space between them, so the label row reads `a b c d e f g h` AND measures the same 18
  characters as a board row, with no trailing padding anywhere in the frame.

  THE THREE EPIC-002 CONTRACTS WERE IMPLEMENTED, NOT RE-OPENED: shading by CHARACTER and no ANSI
  ([A4]); the glyph mode is a PARAMETER this module does not choose ([A1] / 2b -- it declares
  `GlyphMode` and consumes it, and ABC-015 still owns the five-row selection table); the frame is a
  VALUE with constant geometry (4a). Nothing in src/render.ts reads isTTY, process.env or a terminal
  size, so epic acceptance 4c and EPIC-006's pipe-driven test can both assert against it.

  EVERY ACCEPTANCE CRITERION HAS ITS OWN TEST AND EVERY TEST WAS PROVEN ABLE TO FAIL: 18 mutants of
  the shipped module, all 18 killed, restored md5-identical afterwards. THE CAMPAIGN CHANGED THE
  SUITE RATHER THAN DECORATING IT, and that is the part worth reading: TWO MUTANTS SURVIVED THE
  SHADING TEST -- taking the shade from the SCREEN position instead of the square, and swapping the
  dark and light characters. Both invert the whole colouring, and every property that does not NAME
  a character (corners equal, adjacent differ, two characters in all) is symmetric under that
  inversion, so criterion 6's "a1 and h8 are both DARK" was being carried only by the two hand-
  written frames. One assertion naming the character closed it; both mutants now die to the
  criterion's own test. Reported because it was measured, not because it reads well.

  NFR-002's BOARD-FRAME BAR IS MET WITH 242x HEADROOM AND IS RECORDED WITH ITS MACHINE. Worst cell
  across two independent samples: 2.070 us per frame against the 500 us bar, over all 24 cells of
  (6 standing perft FENs x 2 glyph modes x 2 orientations), on Apple M3 (Mac15,13) / Node v24.12.0 /
  Darwin 25.5.0 arm64 -- `UNKNOWN - verify` on any other hardware. Out of tree in its own process,
  11 rounds plus a discarded warm-up, 2,000 iterations per timed region, cell order rotated every
  round, medians of per-round means, parseFen OUTSIDE the timed region, checksum accumulated so
  nothing could be optimised away. Unicode costs about 2x ASCII (0.95-1.13 us vs 1.42-2.07 us) and
  both are ~250x under the bar. NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE, this project's
  standing rule, and plans/nfr-catalog.md was deliberately NOT edited -- that file's rows are
  Architect/Design's and Security/NFR's, the same division ABC-011 and ABC-012 kept.

  GATES: 243 passed / 11 files / 0 failed (was 226 / 10), skip count 0 captured with the AGENTS.md
  command and not eyeballed; lint, typecheck and build all exit 0 (the same 2 pre-existing biome
  config-schema infos); src/render.ts at 100% statements / branches / functions / lines.

  HANDED TO QE RATHER THAN ABSORBED, each with its reason: the purity criterion (byte-identical
  repeat + toFen unchanged) has exactly ONE killer in the suite -- the mutant that clears each
  square as it reads it dies to that test and to nothing else; "a1 and h8 are dark" is now pinned by
  NAMING the character, which is the only way a character-shaded board can assert it, so a reviewer
  who dislikes `:` and `.` is disagreeing with a test rather than with a comment; the 24 generated
  snapshots are a REGRESSION net, not a correctness proof, and two of them (kiwipete and position-3,
  both orientations) were hand-checked square by square against their FENs while 22 were not; and
  nothing imports src/render.ts yet, so no test in this suite exercises it through a caller.

  THREE THINGS FLAGGED, NOT FIXED. (1) The standing perft FEN TABLE HOLDS 6 POSITIONS, NOT 7 -- the
  pull note and this ticket's traceability row both say 7. The 7th literal in src/perft.test.ts is
  `7k/4P3/8/8/8/8/8/4K3 w - - 0 1`, an ad-hoc promotion position inside a perftDivide test, not a
  row of the table. All 6 are transcribed into src/render.test.ts and machine-compared to the
  originals; nothing about the criterion changes. (2) THE UNICODE FIGURINES ARE EAST-ASIAN-WIDTH
  AMBIGUOUS: U+2654-U+265F render double-width in some terminals, which would break the visual
  alignment of a frame whose STRING width is provably constant. It is invisible to every criterion
  here, because all of them are written against the frame as a value, and it lands on ABC-018 where
  the frame meets a real terminal. (3) coverage/ IS A STALE TRACKED ARTIFACT, last updated at
  ABC-007 (76ca714) and not maintained by ABC-011 or ABC-012; a --coverage run dirtied it and it was
  restored with `git checkout` rather than regenerated or deleted.

  ABC-009, ABC-010 and ABC-022 are carried, not fixed. The start FEN is now literal in SIX files
  rather than five, and the six perft FENs are literal in a second file -- a test file cannot import
  another test file's private const, and a new shared fixture module is an unrequested file
  (AGENTS.md rules 5 and 9); every FEN was machine-compared to its original. SUBSTRATE DEGRADATION
  CARRIED FORWARD: no scripts/claim.js and no scripts/context-io.ts, so the queue file moved
  pending -> claimed -> done BY HAND (with a claim.md registry record written into the claim
  directory) and the context notes are hand-written in the schema's exact shape; `finding` is
  inadmissible with no §14 gate to issue a stamp and NOTHING WAS SELF-STAMPED -- the kinds used are
  decision, observation, claim and artifact-ref. NO PR -- this repo has no git remote, so there is
  nowhere to push and none was invented.

  ---
  ENTERED 2026-08-06 by the Orchestrator (task `ticket-to-pr-ABC-014`, Workflow 04) — the
  `Ready → In Development` pull this role owns. 0/3 → 1/3, no limit approached, no override taken.
  The reason for the pull, the Definition-of-Ready re-check and the no-design-hop ruling are in the
  Ready comment above and in full in the pull decision note; not restated here.

  THE EXIT FROM THIS COLUMN IS THE SOFTWARE ENGINEER'S (In Development → In Review), then QE/E2E
  owns the In Review exit, then Security/NFR gates NFR-002 (board-frame compute ≤ 500 µs/frame,
  recorded with its machine). ABC-014 has NO security trigger — it renders bytes from
  position.board and no user-supplied string reaches it; the escape-sequence trigger belongs to
  ABC-018's message region.

  ---
  EMPTIED 2026-08-04 by the Software Engineer (task `ticket-to-pr-ABC-012`, subtask
  `engineer-abc012-implement`, Workflow 04): ABC-012 implemented with tests and a green mandatory
  gate, moved In Development -> In Review. In Development 1/3 -> 0/3, In Review 0/3 -> 1/3; no limit
  approached, no override taken, no written reason owed. The In Development -> In Review exit is the
  one board move this role owns.

  ONE NEW MODULE AND NOTHING ELSE UNDER src/. src/history.ts (154 lines, 51 executable) and
  src/history.test.ts (213 lines, 7 tests). EVERY TRACKED FILE UNDER src/ IS md5-IDENTICAL TO MERGED
  `main` 39e260d and `git diff --numstat 39e260d -- src/` IS EMPTY -- a byte-level result, stronger
  than the line-level check the last acceptance criterion asks for. Recorded with its instrument
  failure, because this board has learned that lesson four times: a `grep -vxF -f` line-presence
  check was tried FIRST and reported 13 to 81 "absent" lines per file, and it fails its own null
  control by identity -- comparing src/fen.test.ts with ITSELF it reports 13 absent lines. It is
  unsound on this input class and NO number is claimed from it; the md5 and git-diff results are the
  record.

  THE TWO SEAMS WERE IMPLEMENTED, NOT RE-OPENED. Six functions with SEAM 1's exact signatures, three
  fields, and NO cache / version counter / invalidation (SEAM 2). The one thing the language cannot
  express is named in the code rather than hidden: `GameHistory.moves` is `readonly Move[]` to
  callers and the module's own two mutators reach through it via a single named helper, because
  TypeScript has no "writable inside this module" modifier.

  THE DEPENDENCY CLAIM WAS MEASURED, NOT ASSERTED. Graph rebuilt from src/*.ts: 10 modules, zero
  cycles, max depth 6 -> 7, history.ts alone at level 7, all six edges downward (fen, apply, zobrist,
  gameend, plus the Move / Position types), NO import of legal.ts and none of san.ts, and it is the
  ONE MODULE WITH ZERO IMPORTERS -- which is what keeps the rules core ignorant of the session.
  memory-bank/30-architecture.md updated accordingly, including the bullet that read "who owns game
  history is an open decision, not a recorded one", which this ticket falsifies.

  EVERY ACCEPTANCE CRITERION HAS ITS OWN TEST AND EVERY TEST WAS PROVEN ABLE TO FAIL. Seven tests
  (the six the ticket names, plus one for the clamp criterion the six do not cover) against seven
  mutants of the shipped module, all seven killed: repetitionCounts dropping the CURRENT position
  (2 tests), keyHistory dropping the initial key (5), takeBack truncating but never replaying (2),
  takeBack's zero clamp removed (1), playMove not appending (6), playMove not applying (6),
  keyHistory off-by-one (1). The deep-equal INSTRUMENT was controlled rather than trusted: `toEqual`
  on a Map<bigint, number> proved to reject a differing count, a missing entry and an empty map while
  accepting a reordered equal map.

  GATES: 221 passed / 10 files / 0 failed (was 214 / 9), skip count 0 captured with the AGENTS.md
  command and not eyeballed; lint, typecheck and build all exit 0 (the same 2 pre-existing biome
  config-schema infos); src/history.ts at 100% statements / branches / functions / lines.

  ALL FIVE NFR BARS MEASURED AND MET, on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64
  and `UNKNOWN - verify` on any other hardware. Out of tree in its own process, 11 rounds plus a
  discarded warm-up, cell order rotated every round, medians of per-round means, two independent
  samples; NO wall-clock assertion was added to the suite, which is this project's standing rule.
  At 120 plies: takeBack(2) 2.45 / 2.45 us against a 5 us bar (an UPPER BOUND -- the two restoring
  playMove calls sit inside the timed region and contribute ~0.025 us), keyHistory 40.66 / 40.51 us
  against 60, repetitionCounts 45.72 / 45.78 us against 75, gameStatusOf 49.33 / 48.99 us against 75,
  playMove 12.4 / 12.7 ns against 100 ns; and the growth check repetitionCounts @300 plies
  99.62 / 99.07 us against 150. Growth shape 18.06 / 17.99 us @ 40 plies -- linear with a constant
  offset, and at 300 plies still 10x under ADR-0002's own ~1 ms reopening threshold. Every figure
  reproduces SEAM 1's wave-1 numbers, which is a CHECK rather than a coincidence, since this is the
  first time the code being measured exists. plans/nfr-catalog.md was deliberately NOT edited -- that
  file's rows are Architect/Design's and Security/NFR's, the same division the ABC-011 Engineer kept.

  ONE ACCEPTANCE CRITERION CANNOT BE SATISFIED AS WORDED, AND IT IS HANDED TO BA/PM RATHER THAN
  QUIETLY REWRITTEN OR QUIETLY IGNORED. Criterion 2's first half asks gameStatusOf to return
  `result: "draw", reason: "threefold-repetition"`. src/gameend.ts cannot return that and its TYPE
  cannot express it: `threefold-repetition` is a `ClaimableDraw`, not an `EndReason`, because ABC-020
  ruled on FIDE 9.2.1 that the third occurrence is a draw the side to move MAY CLAIM and may just as
  well decline -- src/gameend.test.ts:68-92 pins the real shape. The only change that would satisfy
  the literal wording is a change to merged, Done, 100%-covered gameend.ts, which this ticket's
  `## Out of scope` forbids, and SEAM 1 fixes gameStatusOf as a one-line delegate. The criterion's
  INTENT is tested in full and green, and its second half is satisfied exactly as written. This is a
  second stale line on this ticket, of the same class as the trap-1 correction the Orchestrator made
  at the pull, and it is BA/PM's to fix.

  HANDED TO QE RATHER THAN ABSORBED, each with the reason: criterion 2's own test does NOT pin the
  BOARD half of takeBack (the truncate-but-never-replay mutant survives it and is killed by the
  criterion-5 and criterion-7 tests instead); the keyHistory off-by-one is killed by exactly ONE
  assertion; the double-push repetition test is still not written and was deliberately not added
  here, being in no acceptance criterion; playMove validates nothing, by SEAM 1's priced decision;
  and the `position` borrow is untypeable and untested, with takeBack rebuilding the borrowed object
  IN PLACE so a held reference stays valid.

  ABC-009, ABC-010 and ABC-022 are carried, not fixed. The start FEN is now literal in FIVE files
  rather than four -- `## Out of scope` forbids the shared constant and every test file here already
  declares its own. SUBSTRATE DEGRADATION CARRIED FORWARD: no scripts/claim.js and no
  scripts/context-io.ts, so the queue file moved pending -> claimed -> done BY HAND and the four
  context notes are hand-written in the schema's exact shape; `finding` is inadmissible with no §14
  gate to issue a stamp and NOTHING WAS SELF-STAMPED -- the kinds used are decision, observation,
  claim and artifact-ref. NO PR -- this repo has no git remote, so there is nowhere to push and none
  was invented. Nothing was merged and nothing was deployed; a human holds both.

  ---
  ENTERED 2026-08-04 by the Orchestrator (task `ticket-to-pr-ABC-012`, Workflow 04): ABC-012 pulled
  `Ready` -> `In Development`, the one board move this role owns on the way in. Ready 5/8 -> 4/8,
  In Development 0/3 -> 1/3. Both under limit; no override needed and none taken.

  PULLED DIRECT FROM `Ready`, WITH NO DESIGN HOP, AND THAT IS A DECISION WITH A REASON RATHER THAN A
  SHORTCUT. The two prior occupants of `In Design` -- ABC-020 and ABC-011 -- were each pulled there
  for a written reason quoted from the ticket itself (`### Open design question -- hand to
  Architect/Design at the design hop, do not decide in dev`). ABC-012 carries no such line, and it
  carries none because its two seams were already closed by Architect/Design AT DECOMPOSITION on
  2026-07-30: SEAM 1, the history module's exact API (note
  `20260730T143500Z-architect-design-decision-d7a42f7a`), and SEAM 2, that the derived counts are NOT
  memoized (note `20260730T143800Z-architect-design-decision-38b772b6`), both in the
  `epic-to-tickets-EPIC-002` context folder. The ticket's own `## Source` section says it implements
  those decisions and does not re-open them. `In Design` stays 0/2.

  DEFINITION OF READY RE-CHECKED AT THE PULL AGAINST MERGED `main`, not assumed from the 2026-07-30
  promotion -- the ABC-020 / ABC-011 precedent. The ticket's central premise was VERIFIED rather than
  read off the ticket: `gameStatus`'s `positionCounts` is still optional (src/gameend.ts:135,
  `positionCounts?: ReadonlyMap<bigint, number>`) and still has NO SUPPLIER anywhere in src/, and
  src/history.ts does not exist. Problem, scope/out-of-scope, INVEST (independent -- parseFen/toFen,
  makeMove, gameStatus and zobristKey are all merged on main), acceptance measurable (byte-identical
  FEN strings, an exact array length of N + 1, an exact count of 3 rather than 2, an exact prefix
  property, a no-throw clamp on an over-large takeBack, five numeric microsecond bars each recorded
  with its ply count and its machine class), dependencies (none blocking), NFR triggers with numbers
  and an explicit "no security trigger" with its reason, test notes naming six tests and three traps,
  size M, priority P0, no blocker. ADR-0002 (all four clauses) and ADR-0004 are both RATIFIED, so the
  unratified-ADR situation that held ABC-013 in Blocked on 2026-07-30 does not repeat here.

  THE ABC-011 SEQUENCING CONSTRAINT IS DISCHARGED, NOT PENDING. ABC-011 was deliberately pulled ahead
  of this ticket on 2026-08-02 because ABC-012's own Dependencies section says "the two must not be
  built in the order that bakes the defect into this module's tests". ABC-011 merged to main on
  2026-08-04. The order held; this is the consumer it was held for.

  ONE LINE OF THE TICKET IS NOW STALE AND IS CORRECTED IN THE CONTEXT NOTE, NOT IN THE TICKET --
  ticket text is BA/PM's and this role does not edit it. `## Test notes` trap 1 requires test 1 to use
  a repeated line that never sets an en-passant square, BECAUSE src/zobrist.ts hashes the ep file
  whenever epSquare is set, and adds that this makes the test "blind to ABC-011". That rationale
  describes the PRE-ABC-011 tree. On merged main, src/zobrist.ts:85 reads
  `epSquare !== NO_SQUARE && hasLegalEnPassant(position)`, so a repeated line containing a double push
  with no available capture now hashes EQUAL. Three things follow and none of them is a gate: the
  instruction is still correct and still cheap to follow (src/gameend.test.ts:27-58 already holds the
  knight cycle it names); the "blind to ABC-011" sentence must not be carried forward as current; and
  whether to ADD a double-push repetition test is DELIBERATELY NOT ORDERED here, being in no
  acceptance criterion -- it is named for the QE gate, which owns adversarial coverage.

  ONE TICKET, NOT SEVERAL, against a limit of 3. ABC-014 is pullable for the first time since the
  ABC-015/RISK-005 knot was untied, and ABC-009 and ABC-022 are unblocked -- but ABC-019 blocks on
  ABC-012, four epics rest on this module, and a second concurrent ticket buys throughput this
  project has no way to spend while costing review attention it does. Full reasoning:
  .grugops/context/ticket-to-pr-ABC-012/notes/20260804T120000Z-orchestrator-decision-f066a9d0.md

  Nothing was merged from this branch and nothing was deployed -- a human holds both. The merge that
  DID happen today was BA/PM's refinement branch to main on explicit human instruction, recorded in
  the header comment above, and it is not standing authorization.

---

## In Security/NFR (WIP 0/2) — column note

LEFT 2026-08-07 by Security/NFR (task `ticket-to-pr-ABC-014`, subtask `security-nfr-abc014-gate`,
  Workflow 04) on a PASS_WITH_RISKS verdict (board verdict PASS). ABC-014 moved
  In Security/NFR -> Ready for UAT, the one exit this role owns. In Security/NFR 1/2 -> 0/2,
  Ready for UAT 0/4 -> 1/4; no limit approached, no override taken. The full gate record is in the
  Ready for UAT comment below and in the context notes under
  `.grugops/context/ticket-to-pr-ABC-014/notes/`; it is not restated here.

  WHAT THIS COLUMN OWED IS NOW PAID. The bar was RE-MEASURED, not inherited -- 2.092 / 2.056 us
  against the 500 us bar, ~240x headroom, two independent samples that BRACKET the Engineer's
  2.070 us. `plans/nfr-catalog.md`'s `UNKNOWN - verify` on the board-scan compute half is
  discharged, in exactly 3 lines of that file, with no target moved.

---

## In Security/NFR (WIP 0/2) — column note

ENTERED 2026-08-07 by QE/E2E (task `ticket-to-pr-ABC-014`, subtask `qe-abc014-break`, Workflow 04)
  on a PASS verdict. In Security/NFR 0/2 -> 1/2; no limit approached, no override taken. The full QE
  record -- the one surviving mutant, the two assertions measured blind, the FEN-text oracle that
  closes 22 unverified snapshots, and the five Engineer hand-offs adjudicated -- is in the In Review
  comment above and in the context notes under `.grugops/context/ticket-to-pr-ABC-014/notes/`; it is
  not restated here.

  WHAT THIS COLUMN OWES, stated so it is not re-derived: NFR-002's board-frame compute bar is the
  ONE trigger. The Engineer's figure is 2.070 µs worst against 500 µs on Apple M3 / Node v24.12.0 /
  Darwin 25.5.0 arm64, `UNKNOWN - verify` elsewhere, measured out of tree with parseFen outside the
  timed region. This board's standing practice is that this gate re-measures on its own harness
  rather than inheriting -- the ABC-011 and ABC-012 precedent. NFR-002's WRITE half stays
  `UNKNOWN - verify` and is ABC-018's. plans/nfr-catalog.md's NFR-002 row is owed the compute half
  and is this column's file, not QE's.

  ---
  EXITED 2026-08-04 by Security/NFR (task `ticket-to-pr-ABC-012`, subtask `security-nfr-abc012-gate`,
  Workflow 04). ABC-012 moved In Security/NFR -> Ready for UAT. In Security/NFR 1/2 -> 0/2,
  Ready for UAT 0/4 -> 1/4; no limit approached, no override taken, no written reason owed.

  VERDICT: PASS_WITH_RISKS (result PASS, NO required fix outstanding, FIVE accepted risks each with
  a named owner and a place). Gated against `security.asvs_level: L1` and `security.block_on: high`.
  Nothing sits at `high`, so nothing blocks. `compliance_regime` is [], so no Compliance Officer
  hand-off is owed.

  IT WAS NOT EARNED BY READING THE ENGINEER'S NUMBERS OR QE'S VERDICT. Those were re-run only as a
  control on this gate's own instruments and they reproduce: 226 passed / 10 files / 0 failed, skip
  count 0 by the AGENTS.md command, lint / typecheck / build all exit 0, and src/history.ts md5
  12f8c562d46286e68383f8e2cab407fa -- identical to the Engineer's feat commit 47cad31, which is the
  independent confirmation that QE changed no production code.

  (A) THE FIVE NUMERIC BARS WERE RE-MEASURED ON THIS GATE'S OWN HARNESS -- the standard this column
  set on ABC-011's NFR-005, where inheriting a design hop's figures was explicitly refused. Own
  harness outside the repository, its own process doing nothing else, a discarded warm-up round, 11
  rounds with the CELL ORDER ROTATED EVERY ROUND, medians of per-round means, TWO fully independent
  samples, on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 and `UNKNOWN - verify` on any
  other hardware. Population stated: the SAME deterministic LCG game src/history.test.ts:81-89 plays,
  so a ply count means the same thing in the harness and in the suite.

  ALL SIX MET, EVERY ONE WITH ROOM:
    takeBack(h,2) @120 [upper bound]  2.46 / 2.45 us   vs <= 5 us     0.49x  MET
    keyHistory(h) @120                40.16 / 40.20 us vs <= 60 us    0.67x  MET
    repetitionCounts(h) @120          44.35 / 44.45 us vs <= 75 us    0.59x  MET
    gameStatusOf(h) @120              47.75 / 47.59 us vs <= 75 us    0.64x  MET
    playMove(h,move) @120             8.6 / 8.2 ns     vs <= 100 ns   0.09x  MET
    repetitionCounts(h) @300 plies    91.93 / 92.15 us vs <= 150 us   0.61x  MET
    repetitionCounts(h) @40 plies     17.57 / 17.48 us  (shape only, no bar)
  Growth is linear with a constant offset -- 17.5 / 44.4 / 92.0 us at 40 / 120 / 300 plies -- so at
  300 plies the derive is still ~10x under ADR-0002's own ~1 ms threshold for re-opening clause 2,
  and SEAM 2's no-memoization decision is under no pressure from anything measured here.

  (B) BOTH FENCES QE HANDED THIS COLUMN WERE TESTED RATHER THAN PASSED ON A THIRD TIME.

  FENCE 1 -- gameStatusOf's margin is POSITION-DEPENDENT. Discharged with the fence's own
  measurement: the margin over repetitionCounts is 3.40 / 3.14 us on the startpos-anchored line and
  4.55 / 4.49 us on a kiwipete-anchored line, against bare legalMoves of 2.74 us and 3.89-3.96 us at
  those positions. So the margin IS the one legalMoves call inside gameStatus plus ~0.6 us of that
  function's other work, and it swings 1.4x on position alone. The fence is real.
  AND THE RESULT NOBODY PREDICTED: the expensive-legalMoves anchor is CHEAPER OVERALL -- kiwipete
  41.89 / 42.25 us against startpos 47.75 / 47.59 us -- because on this module the O(plies) derive
  dominates and that line's replay is cheaper by more than its generator call is dearer. The bar
  survives the worst legalMoves position this repository benchmarks. Arithmetic worst case over the
  observed extremes (worst derive 44.45 + worst legalMoves 3.96 + ~0.6 gameStatus overhead) is
  ~49.0 us = 0.65x of the bar -- labelled as arithmetic, not as a measurement.

  FENCE 2 -- the takeBack figure is an UPPER BOUND. Tested by moving the two restoring playMove
  calls OUTSIDE the timed region. It reads HIGHER, not lower: 2.92-2.93 us against 2.45-2.46 us,
  because the clean variant builds a fresh 120-ply history per iteration and pays cold-object cost.
  The restore's arithmetic contribution is 2 x ~8.4 ns = ~0.017 us, BELOW what this instrument can
  resolve. So the bound is confirmed as a bound, is tight to within less than the instrument can
  see, and THE BAR IS MET ON EITHER FRAMING (0.49x and 0.59x). No claim is made that either framing
  resolves the other.

  (C) ONE INSTRUMENT WAS BUILT, MEASURED, AND DISCARDED BEFORE IT PRODUCED A FALSE MISS. The first
  takeBack cell called legalMoves twice INSIDE the timed region and read 10.38 us against the 5 us
  bar -- 2.08x, a MISS. Two generator calls at 2.7 us each account for ~5.4 us of it. The restoring
  moves are fixed across iterations, so they are now computed once outside the clock and the cell
  reads 2.46 us. NO NUMBER IS CLAIMED FROM THE DISCARDED INSTRUMENT and it is recorded rather than
  buried: a gate that reports a MISS it manufactured itself is worse than one that reports nothing.
  Seventh instrument-limit correction this project has recorded, caught by the caution
  plans/nfr-catalog.md already carries.

  (D) THE TICKET'S "NO SECURITY TRIGGER" ASSERTION WAS TESTED, NOT INHERITED -- AND IT HOLDS.
  Verified structurally rather than by reading the ticket: the transitive import closure of
  src/history.ts was rebuilt (8 modules -- history, apply, fen, gameend, legal, moves, position,
  zobrist), EVERY import in it is relative and inside src/, and across the whole closure there is
  ZERO node: builtin, child_process, require(, eval(, new Function, process.env, globalThis or
  __proto__. No filesystem, no network, no environment, no serialization sink, no logger, no secret,
  no privilege check. ZERO RUNTIME DEPENDENCIES (package.json has no `dependencies` key at all) and
  package.json + package-lock.json are byte-identical to merged main 39e260d.
  HOSTILE INPUT ACTUALLY FED TO THE MODULE -- 12 payloads at newGame(initialFen), its only external
  string input: prototype-pollution keys, __proto__ and constructor/prototype placements, a
  10,000-char string, control bytes, `; rm -rf /`, ../../../../etc/passwd, ' OR 1=1 --, <script>.
  EVERY ONE REJECTED with a typed FenError. ZERO prototype pollution (Object.prototype unmodified),
  zero hang, zero crash.
  ASVS L1 JUDGED, NOT PADDED: 12 of the 70 L1 requirements are reachable at all and each was judged
  from evidence; 58 are structurally N/A with the reason stated per block (45 across V3/V4/V6/V7/V8/
  V9/V10/V12 -- no HTTP, no browser, no user, no account, no session, no token, no socket; V5 -- no
  file handling; V14 -- there is NO sensitive data in this system, the entire data content is a chess
  position and a move list, zero PII and zero secrets; V11.3.x -- no encryption; the V1 output-encoding
  half -- no HTML, XML, URL, JSON or template anywhere). V1.2.4 / V1.2.5 / V1.3.2 PASS by absence of
  sink, verified structurally. V11.4.1 is N/A WITH ITS REASON: zobristKey is a NON-cryptographic
  position-identity hash that signs nothing and derives no key -- a collision is a wrong draw verdict,
  a correctness risk and not a security one. A judged subset with its delta stated beats a re-run of
  70 rows, which is the ABC-011 gate's precedent.

  (E) THE takeBack(NaN) RULING, WHICH THIS COLUMN WAS ASKED FOR. REPRODUCED AND EXTENDED PAST QE'S
  TABLE: NaN, undefined, the RAW STRING "abc" and {} each silently discard the ENTIRE game; null, [],
  -1 and -Infinity are safe no-ops; "2" and [3] are correct by coercion; 1.5 takes back 2 and 0.5
  takes back 1; Infinity and 1e21 clamp to 0 correctly. THE STRING CASE IS NEW HERE AND IT IS THE ONE
  THAT MATTERS -- ABC-019 parses a ply count from user input and BOTH plausible implementations reach
  the defect (Number.parseInt("abc") is NaN; handing the raw token through is worse still).
  SEVERITY MEDIUM. IT DOES NOT BLOCK against security.block_on: high, and the reasoning is written out
  rather than asserted because the convenient answer here would have been the easy one. It is a
  CORRECTNESS and DATA-INTEGRITY defect, not a security finding. Under ASVS V2.2.1 an unvalidated
  input used for a business decision is an L1 requirement, and this role's own rule makes an L1 fail
  HIGH by default -- which would block. IT IS NOT AN L1 FAILURE TODAY, and the reason is a fact this
  gate MEASURED rather than an opinion: THE INPUT SURFACE DOES NOT EXIST. src/history.ts has ZERO
  production importers, and there is NO call to takeBack or playMove anywhere outside
  src/history.test.ts. Nothing untrusted reaches it and there is no trust boundary for a validation
  control to sit on. The requirement is not FAILED -- it is NOT YET ENGAGED.
  AND THE COUNTERFACTUAL IS STATED PLAINLY RATHER THAN BANKING THE CONVENIENT HALF: the moment
  ABC-019 wires a parsed ply count to this function, V2.2.1 IS engaged, the default severity is HIGH,
  and IT BLOCKS. That is not a deferred security control -- it is a named trigger with a named owner,
  recorded so ABC-019's gate cannot claim it was not told. Owner: BA/PM to rule the guard; place:
  ABC-019. Not fixed, and deliberately not pinned by a test (a test asserting today's output would
  enshrine it and make the eventual fix look like a regression) -- QE's reason, which this gate shares.

  (F) playMove's UNGUARDED PRECONDITION -- the consequence is worse than "a corrupt board", and this
  is new. Feeding a start-position move to a history anchored at 8/8/8/8/8/8/8/K6k w - - 0 1 is
  accepted without error, materialises a knight, and gameStatusOf then returns
  {"result":"draw","reason":"insufficient-material"} -- a well-typed, CONFIDENT, WRONG terminal
  verdict. ASVS V2.3.1 PARTIAL, not engaged today for the same zero-caller reason. SEAM 1 priced the
  guard at ~2-5 us and declined it; NOT re-opened here, but now on the record with its real
  consequence. Owner: Architect/Design; place: ABC-019 / EPIC-003.

  (G) THE COVERAGE HAZARD WAS READ BEFORE COVERAGE WAS RUN, exactly as QE asked. coverage/ is tracked
  (22 files, confirmed) and is NOT in .gitignore (confirmed). QE's mitigation was used and then
  VERIFIED rather than trusted: --coverage.reportsDirectory pointed outside the repository gave
  src/history.ts 100 / 100 / 100 / 100 against a 0.8 threshold, with `git status --porcelain -uall
  coverage` EMPTY and `git diff --numstat 3a44b3f -- coverage` EMPTY. coverage/ is byte-identical
  after this gate's run. The hazard was NOT reproduced here -- QE reproduced it twice already under a
  controlled restore and this gate had nothing to add by damaging tracked files a third time.

  (H) THE TEST-INTEGRITY CHECKER WAS RE-RUN AND RECORDED AS AN ERROR, NEVER AS A PASS. Run exactly as
  Workflow 05 step 3 specifies: `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0` -> "Error: cannot read the registry file", exit=2. The registry does not exist
  (confirmed with ls). Exit 2 is "the checker could not run" and is NOT the exit-1 short-circuit and
  NOT a pass. Three roles have now run it independently on this ticket and all three recorded the
  same. The suite's skip count is 0, captured here with the AGENTS.md command, so there is nothing
  for the registry to justify; the registry is human-owned and NO FILE WAS CREATED -- an agent may not
  self-author a justification to clear its own gate. The standing gap QE named (no board entry or
  trace row in this project has ever mentioned this checker) is closed FOR THIS TICKET by this comment
  and the trace row, and remains open for the project.

  (I) src/history.ts:42's DOC CONTRADICTION CONFIRMED ON THIS GATE'S OWN INSTRUMENTS, BOTH HALVES.
  "documented and tested" is FALSE -- no test in src/history.test.ts touches position.board (searched;
  seven other test files do, none about history.position). And the comment tells callers not to hold
  the reference across a takeBack, which the shipped resetTo makes SAFE: measured, a held reference is
  === h.position after takeBack, is not stale, and reads the correctly rewound position. The comment
  errs in the SAFE direction so it is not a defect and not a blocker, but ABC-019 is the first caller
  and will read one of two documents that disagree. Named, not fixed -- it is production-code text.

  FIVE ACCEPTED RISKS, EACH WITH A NAMED OWNER AND A PLACE (no unowned accepted risk):
    1. takeBack(NaN)/"abc"/{}/undefined destroys the game -- MEDIUM -- owner BA/PM, place ABC-019.
    2. playMove validates nothing; a foreign move yields a confident WRONG verdict -- MEDIUM --
       owner Architect/Design (SEAM 1), place ABC-019 / EPIC-003.
    3. src/fen.ts accepts out-of-range move counters: 999999999999999999999 is ACCEPTED, becomes
       1e+21, breaks FEN round-trip byte-identity, and makes gameStatusOf report a seventy-five-move
       draw before the game starts. Negative / non-numeric / exponential / hex are all correctly
       rejected, so this is a RANGE gap in a control that exists, not a missing control. ABC-001's
       merged Done code, out of scope here (AGENTS.md rules 9 and 12) -- recorded because THIS ticket
       makes it reachable through a new door, newGame(initialFen). LOW -- owner BA/PM to cut it or
       fold it into the ABC-009 / ABC-010 invalid-FEN family, place EPIC-001.
    4. coverage/ tracked, unignored and stale -- LOW -- owner a human (repository hygiene, not an
       agent's cleanup). THREE ROLES HAVE NOW FLAGGED IT AND NO TICKET EXISTS FOR IT; three flags with
       no ticket is how a flagged item evaporates, so the missing artefact is named rather than a
       fourth flag added. BA/PM to cut it.
    5. Every NFR figure is one machine and one Node version -- LOW -- owner Security/NFR, place
       EPIC-004's already-scheduled non-M3 spike (RISK-002's mitigation), the same instrument that
       lifts NFR-005's PROVISIONAL marker. The two samples agree to ~1% and the margins are 1.5x-11x,
       so a 3x slower machine still clears every bar -- but that is ARITHMETIC, not a measurement.

  WHAT THIS GATE COULD NOT SETTLE, named rather than smoothed: why this gate's playMove figure
  (8.2-8.6 ns) is 1.5x the Engineer's (12.4-12.7 ns) -- both are >7x under the bar so it does not move
  the verdict, but the Engineer's harness shape is not recorded in enough detail to reproduce and "we
  do not know why these differ" is the honest sentence; whether the two takeBack framings resolve each
  other (they do not -- the delta is below instrument resolution); the true worst case for gameStatusOf
  across all positions (two anchors measured, the rest is arithmetic); and whether EPIC-006 will ever
  let a user type a FEN, which is the scope question risk 3's LOW severity rests on.

  NO PRODUCTION CODE WAS CHANGED AND NO TEST WAS ADDED. src/history.ts and src/history.test.ts are
  byte-identical to what QE handed over; this gate names required fixes rather than making them, and
  both defects it found need GUARDS, which are production logic this column does not write.
  NO NFR TARGET MOVED -- not one. plans/nfr-catalog.md gains ABC-012's real-code measurements on the
  two rows that already name this module's derives (NFR-002's boundary condition, NFR-003's turn
  budget); NFR-001, NFR-004, NFR-005, NFR-006 and NFR-007 are byte-identical.
  No acceptance criterion, `## Out of scope` line, NFR bar or test note was edited -- including
  criterion 2, whose wording remains BA/PM's and is upheld as unsatisfiable by two gates now.
  The double-push repetition test stays DECLINED on QE's routing reason; this gate has no evidence
  that changes it and does not re-open it. ABC-009, ABC-010 and ABC-022 are carried, not fixed.
  NO PR -- this repository has no git remote and none was invented. NOTHING MERGED, NOTHING DEPLOYED;
  a human holds both.

---

## Ready for UAT (WIP 0/4) — column note

EMPTIED 2026-08-08 by the Orchestrator (task `ticket-to-pr-ABC-014`, Workflow 04): **ABC-014
  MERGED to `main` and moved Ready for UAT → Done — the `… → Done` exit this role owns.** Fast-forward
  `ed42d26` → `c1d694f`, 6 commits, **no merge commit** (`git log --merges` empty; the branch was
  linear and nothing had diverged). Ready for UAT 1/4 → 0/4; no limit approached, no override taken.

  GATES RUN BY THIS ROLE ON THE TIP BEFORE THE MERGE AND AGAIN ON `main` AFTER IT, both recorded, as
  the standing directive requires — and NOT inherited from any of the three agents that worked this
  ticket: **253/253 on 11 files, skip count 0** (captured with the `AGENTS.md` command, not
  eyeballed), lint + typecheck + build exit 0 on both sides. `git branch --no-merged main` is empty.

  THE MERGE WAS AUTHORIZED TWICE OVER, AND THE SECOND TIME IS THE ONE THAT MATTERS HERE. The owner's
  standing directive of 2026-08-06 covers it (`memory-bank/60-progress.md` § "Standing directive —
  the branching model, and who turns the merge key"). **But the first attempt was DENIED by the host's
  permission classifier, and it was not worked around** — a merge is a governance surface, so it went
  back to the human rather than to a different command. Project owner Olger Oeselg then said
  *"merge it"* in session on 2026-08-08. **Recorded because the honest sequence is part of the trail:
  the block was environmental, not a project rule, and the resolution was a human, not a workaround.**

  THE THREE LIMITS ON THE STANDING GRANT ARE UNCHANGED AND WERE ALL HONORED. (1) **DEPLOY IS NOT
  INCLUDED** — none was attempted or contemplated; `production_requires_human_confirmation` stays
  `true` and `ADR-0007` says there is nowhere to deploy. (2) **THE GATE STILL BINDS** — it was run
  green on both sides of the merge, never skipped or self-certified; `quality.gate_enforcement` is
  `blocking`. (3) **THE AUTHORITY IS STILL THE OWNER'S AND REVOCABLE.**

  **UAT IS DEFERRED TO `EPIC-006`, EXPLICITLY NOT PASSED** — Security/NFR's ruling, kept verbatim
  through this move rather than quietly rounded to a pass. Zero importers, no CLI entry point, no
  surface a human can exercise; a UAT pass would be a fabrication. This is the same posture every
  ticket in this project has carried, and `60-progress.md` already records the consequence the owner
  should see: with the merge checkpoint delegated there is now no human checkpoint between an agent's
  work and `main` until `EPIC-006` produces something a human can actually drive.

  **NOTHING WAS DEPLOYED AND NOTHING WAS PUSHED** — this repo has no remote and never had one. The
  branch was NOT deleted; that call has always been the owner's.

  TWO ITEMS ARE OPEN AND OWNED, named here so they are not lost with the ticket:
  1. **The self-healing snapshot net** — `npm test` is `vitest run` with no `--ci`, no
     `vitest.config.*` exists, and this project has no CI, so a missing snapshot cannot fail the
     gate. Routed to the AGENTS.md Scribe; NOT fixed on the ticket branch (wrong scope, wrong diff,
     and two agents must not write one working tree). Note
     `20260807T113000Z-orchestrator-decision-8f5a2b60`.
  2. **`ABC-012`'s ticket frontmatter is a column behind the board** — flagged 2026-08-06, still
     open, belongs to the board sweep. Note `20260806T090500Z-orchestrator-observation-6d02ae91`.

  ---
  Prior occupancy, retained:
  ENTERED 2026-08-07 from Security/NFR's PASS_WITH_RISKS verdict (task `ticket-to-pr-ABC-014`,
  subtask `security-nfr-abc014-gate`, Workflow 04). In Security/NFR 1/2 -> 0/2, Ready for UAT
  0/4 -> 1/4; no limit approached, no override taken. Gated against `security.asvs_level: L1` and
  `security.block_on: high`. `compliance_regime` is [], so no Compliance Officer hand-off is owed.

  THE NFR BAR WAS RE-MEASURED ON THIS GATE'S OWN HARNESS, NOT INHERITED -- the standard this column
  set on ABC-011's NFR-005 and kept on ABC-012. Harness outside the repository, its own process
  doing nothing else, a discarded warm-up round, 11 rounds with the CELL ORDER ROTATED EVERY ROUND,
  medians of per-round means, TWO fully independent samples, parseFen OUTSIDE the timed region, a
  checksum kept against elision, on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 and
  `UNKNOWN - verify` on any other hardware. Population: all 24 cells of 6 standing perft FENs x 2
  glyph modes x 2 orientations.
    worst bar cell   2.092 / 2.056 us   vs <= 500 us   0.0042x   MET  (kiwipete|unicode|black-bottom)
    best bar cell    0.955 / 0.980 us                                 (position-3|ascii|white-bottom)
    unicode          1.80-1.83x the cost of ascii
  The two samples agree to 1.7% and select the same worst and best cell. THE ENGINEER'S 2.070 us IS
  BRACKETED BY THIS GATE'S TWO SAMPLES -- reproduced, not carried forward, and said that way rather
  than smoothed into one number.

  THE BAR'S OWN POPULATION DOES NOT CONTAIN THIS MODULE'S WORST CASE, and the worst case was
  measured anyway rather than banked: a FULLY-OCCUPIED 64-PIECE BOARD (no empty-square short-circuit
  on any of the 64 squares, and unreachable through parseFen, which requires one king per side)
  reads 2.322 / 2.342 us = 0.0047x of the bar. The empty board, the true best case, reads
  0.910-1.051 us. Both are fences, not the result.

  THE 40/120/300 PLY COUNTS plans/nfr-catalog.md MANDATES ON AN NFR-002 MEASUREMENT DO NOT APPLY TO
  THIS MODULE, AND NO PLY FIGURE WAS INVENTED TO LOOK COMPLIANT. The absence is structural and was
  MEASURED, not assumed: renderBoard takes a Position, which carries no move list at all, and this
  gate verified that castling, the en-passant square, both clocks and the side to move influence
  ZERO frame bytes. A frame is a pure projection of the 64 on-board squares.

  ONE STRUCTURE IN THE NUMBERS IS ATTRIBUTED RATHER THAN LEFT AS NOISE: black-bottom costs
  ~0.10-0.13 us more than white-bottom on EVERY cell. Measured in isolation, src/render.ts:146's
  `[...FILE_LETTERS].reverse().join("")` on the black-bottom path costs +0.112 us/frame against the
  bare constant -- essentially the whole delta. It is 0.02% of the bar, NO CHANGE IS ASKED FOR, and
  it is recorded only so a later reader does not read it as a regression.

  THE TICKET'S "NO SECURITY TRIGGER" RULING WAS RE-DERIVED AGAINST WHAT WAS ACTUALLY BUILT AND IT
  HOLDS -- BUT ITS STATED REASON IS INCOMPLETE, AND THIS GATE REPORTS THAT RATHER THAN RATIFYING THE
  TICKET'S WORDING. The ticket says "no user-supplied string reaches this module". Two of
  renderBoard's three parameters ARE strings -- GlyphMode and Orientation -- and their TypeScript
  unions are ERASED AT RUNTIME; EPIC-006's --ascii/--unicode flags are the plausible path by which a
  user-controlled string becomes one. What actually holds the property is stronger and was proven
  here: THE FRAME'S OUTPUT ALPHABET IS CLOSED. Every emitted byte comes from a module constant; the
  board bytes and the mode string are used only as lookup KEYS and are never emitted. Measured over
  32 frames spanning the 6 standing FENs, the empty board and a fully-occupied board in both modes
  and both orientations: 42 distinct code points, 0 outside the fixed tables, 0 control bytes, 0 ESC
  -- no ANSI sequence is constructible from this module's output. 27 hostile mode values (prototype
  keys, a raw ESC sequence, a 10,000-char string, <script>, `; rm -rf /`, non-strings) injected ZERO
  bytes: 26 threw, 1 returned a clean frame.

  ONE REAL PROPERTY WAS FOUND AND IT IS A GADGET, NOT A VULNERABILITY -- reported plainly rather
  than either inflated or buried. GLYPHS[mode] (src/render.ts:118) and glyphs[pieceType(piece)]
  (:139) are unguarded prototype-chain lookups. Under an ALREADY-POLLUTED Object.prototype, a
  non-union mode ("constructor", "__proto__", "toString", "valueOf") or a board byte with
  (b & 7) === 7 injects attacker-controlled data straight into the frame INCLUDING ESC, and breaks
  the constant 18-character geometry (rows of 98 and 28 observed). BOTH REAL MODES ARE IMMUNE --
  own properties 1..6 shadow the polluted prototype, verified against a live-pollution control so
  the negative is not vacuous -- and THERE IS NO PROTOTYPE-POLLUTION SINK ANYWHERE IN src/, so the
  precondition cannot be created from inside this project. LOW, does not block.

  ASVS L1 JUDGED, NOT PADDED. Of the 70 active L1 requirements, 4 are reachable and pass on
  evidence (V1.3.2 no eval or dynamic execution; V2.1.1 the module documents its input contract in
  its own header, including that it validates nothing and why; V15.3.1 the frame returns only the
  required subset -- a board-only projection, measured; V1.2.x by analogue, via the closed output
  alphabet, ASVS 5.0 having no terminal-output-encoding requirement). 66 are structurally N/A with
  the reason stated per chapter: no HTTP, browser, cookie, session, token, OAuth, TLS, file,
  database or crypto surface exists anywhere in the closure. V16 and V17 carry NO L1 requirements
  at all. The import closure was re-verified with comments stripped -- render.ts -> position.ts ->
  nothing, 114 code lines, ZERO sinks (no node:, child_process, require(, eval(, new Function,
  process., globalThis, fs., fetch(, Buffer, console., stdout, isTTY, timers, crypto). The three
  process./stdout/isTTY matches in the file are all in the doc comment saying it reads none of them.

  FOUR ACCEPTED RISKS, NONE UNOWNED: (1) the prototype-chain gadget above -- LOW -- Architect/Design,
  place ABC-018/EPIC-006. (2) An out-of-domain board byte throws an uncaught TypeError with no
  context (verified on bytes 7, 8, 15, 16, 63, 127, 200, 255) -- LOW -- the DECISION is right and is
  not re-opened (the ticket's Out of scope and AGENTS.md rule 8), but ABC-018 is where an uncaught
  throw from a render call meets a half-drawn terminal; owner Architect/Design, place ABC-018.
  (3) A non-"white-bottom" orientation value silently renders BLACK-bottom rather than throwing --
  LOW -- owner ABC-015/EPIC-006, which owns the value. (4) Every figure is one machine and one Node
  version -- LOW -- Security/NFR, at EPIC-004's already-scheduled non-M3 spike.

  NO REQUIRED FIX. NO PRODUCTION CODE AND NO TEST WAS CHANGED BY THIS GATE: src/render.ts md5
  733bc67fec523a7f41016bea2b026e1d, identical to the Engineer's and QE's published figure, and
  `git diff HEAD -- src/` is empty. Gates re-run here rather than inherited: 253 passed / 11 files /
  0 failed, skip count 0 by the AGENTS.md command, lint 0 errors (the same 2 pre-existing biome
  config-schema infos), typecheck and build exit 0.

  CARRIED FORWARD UNCHANGED, NOT CLOSED HERE: the U+2654-U+265F East-Asian-Width ambiguity is
  `UNKNOWN - verify` on this gate's instruments too -- a string width and a terminal COLUMN width
  are different things and no in-process test reads the second; it lands on ABC-018 and RISK-005.
  The self-healing snapshot net is already routed to the AGENTS.md Scribe by the Orchestrator and is
  NOT re-routed here. NFR-002's WRITE half remains the half nobody has measured and stays ABC-018's.

  FLAGGED FOR THE THIRD TIME AND DELIBERATELY NOT FIXED: the ABC-014 ticket file's frontmatter still
  reads `status: in-development` / `column: In Development`. Ticket frontmatter is board state and
  the Orchestrator moves it; this board is the state of record. The Engineer and QE each flagged it
  before this. Three flags and no fix is itself the signal -- owner Orchestrator, next board-touching
  task. plans/metrics.md is likewise still stale (its own header names the daily sweep and the retro
  as its update owners) and this move makes it staler again. coverage/ remains a stale tracked
  artifact last written at ABC-007; flagged, not deleted (AGENTS.md rule 12).

  NOTHING MERGED AND NOTHING DEPLOYED. The owner's standing merge authority is approval to merge
  work that PASSED, and it is not deploy approval; per ADR-0007 this project deploys nowhere at all.
  ABC-009, ABC-010 and ABC-022 are carried, not fixed.

---
