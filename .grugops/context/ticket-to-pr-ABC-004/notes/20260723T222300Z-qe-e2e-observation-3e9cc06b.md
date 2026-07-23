---
id: 20260723T222300Z-qe-e2e-observation-3e9cc06b
kind: observation
by: qe-e2e
at: 2026-07-23T22:23:00Z
verified_by: 
confidence: high
refs:
  - ABC-004
  - ABC-005
  - ABC-006
  - src/moves.test.ts
  - src/apply.test.ts
supersedes: 
---

QE break-it pass on ABC-004. No defects found; the nine acceptance criteria pass on exact hand-built FENs, and the make/unmake property test round-trips every generated castle/promotion/ep on Kiwipete and position-4. Recording the gaps I probed and where the real acceptance still lies.

**Colour-mirror probes added and green.** The acceptance table pins mostly White. I broke the White-only assumption with Black kingside castle, Black en passant (exd3), and Black promotion (b1=q) round-trips, plus a capture-promotion (bxa8=Q) that also clears the opponent's queenside right. All reverse to the exact starting FEN. Colour asymmetry — the classic hiding place for a one-sided pawn-direction bug — is closed.

**Through-check evaluated in the pre-castle position — correct.** Castling checks the king's origin/pass/land squares as attacked with the board unchanged (king still home, rook still home). I confirmed the two rules the ep/rook cases get wrong elsewhere: queenside requires b1 EMPTY but not UNATTACKED (the king never crosses b1), and a king in check yields zero castles because the origin square is in the king-path set. Both verified by explicit tests.

**Known deferred gap, correctly NOT fixed here: en-passant discovered check.** `generateMoves` will still emit an ep capture that exposes its own king along a rank (two pawns leaving the rank at once). That is pseudo-legal by design — ABC-005 filters it, and ABC-005's acceptance FEN `8/8/8/K2pP2r/8/8/8/8 w - d6` plus perft position 3 are exactly the oracle for it. Flagging it so "ABC-004 done" is not misread as "ep is fully legal".

**The real acceptance gate is still ahead (ABC-006).** Unit tests on hand-built positions cannot prove the *combinations* (castle + ep + promotion interacting across a tree). Per the ticket's own test note, ABC-004 is not finally "right" until perft passes exact node counts. This gate is green on everything ABC-004 can prove by itself; ABC-006 is where RISK-001 is actually retired.

**One trust boundary noted (not a defect):** castling generation trusts that a set castling right implies the king and rook are on their home squares — true for any position reached via make from a legal start, and for all six perft positions. A hand-built FEN with inconsistent rights could emit a bogus castle; parseFen does not cross-validate rights against rook placement. Left unhandled per coding-rule 8 (no impossible-scenario handling in legal play).
