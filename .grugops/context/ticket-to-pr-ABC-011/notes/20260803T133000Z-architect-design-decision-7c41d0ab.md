---
id: 20260803T133000Z-architect-design-decision-7c41d0ab
kind: decision
by: architect-design
at: 2026-08-03T13:30:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - ABC-012
  - ABC-020
  - EPIC-004
  - NFR-005
  - ADR-0002
  - ADR-0005
  - ADR-0006
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
  - plans/board.md
  - plans/traceability.md
  - memory-bank/50-decisions/ADR-0005-en-passant-availability-and-the-hash-layer.md
  - memory-bank/50-decisions/ADR-0006-castling-rights-stay-rights-in-the-hash.md
  - memory-bank/60-progress.md
  - src/legal.ts
  - src/zobrist.ts
  - src/moves.ts
  - src/apply.ts
  - .grugops/context/refinement-fide-9-6-1/sources/E012023-laws-of-chess-2023.html
  - .grugops/context/ticket-to-pr-ABC-011/sources/FIDE-CURRENCY-2026-08-03.txt
  - 20260803T113000Z-orchestrator-decision-913e6028
  - 20260803T104000Z-qe-e2e-claim-faefac9a
  - 20260803T124000Z-security-nfr-decision-7b3ac914
  - 20260802T214500Z-architect-design-decision-501d774b
supersedes: 
---

# RULED, three things: purity is unconditional; castling is NOT the en-passant case; ADR-0005 accepted with an amendment and ADR-0006 written

Second design hop on `ABC-011` — the first ticket in this project's history to enter `In Design`
twice. The ticket moved backward `Ready for UAT → In Design` on the project owner's instruction to
fix the MEDIUM defect before merge. **This hop rules; it does not implement. No file under `src/`
was changed.** The first hop's `### ANSWERED` block stands unamended; a second, dated block was
added beside it rather than over it.

I ran the first hop and its trajectory is gone, so I re-read my own four notes of 2026-08-02 rather
than assuming what I had decided. Everything below was re-derived at this hop against copies of the
shipped tree; nothing is transcribed from the notes it agrees with.

---

## 1. THE DEFINITION QUESTION — purity is unconditional, the answer is domain-restricted

QE reproduced the shipped `hasLegalEnPassant` and its own ruled oracle disagreeing on
`4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` and declined to call it — *"needs an Architect ruling not a dev
fix"*. Security/NFR agreed, sized it MEDIUM and non-blocking, and named the exact reason it could
not be a dev fix: guarding on `board[target] === EMPTY` makes the predicate answer `false` where its
ruled oracle answers `true`. **Both were right to refuse it.**

### The ruling

**Purity is unconditional. The answer is domain-restricted. Buy the first with a precondition, not
with a change to what the predicate means.**

The mechanism, re-derived from the source rather than from QE's summary of it: `hasLegalEnPassant`
synthesises a `Move` instead of taking one from the generator, and `undoSpecial`
(`src/apply.ts:106-110`) writes `move.captured` back onto the capture square **unconditionally**.
`makeMove`'s `applySpecial` clears that square just as unconditionally. So the pair is an exact
inverse only for a move that is *well-formed for this board*; when the board never held the piece the
move claims to capture, the "restore" is a creation, and it is permanent. Nothing else in the call
chain establishes that precondition, because normally `generateMoves` does.

So the predicate must establish it itself, before calling `makeMove`:

- **(a)** the en-passant target square is empty;
- **(b)** the square immediately behind it, on the mover's advance, holds exactly the enemy pawn the
  probe claims to capture.

Both are loop-invariant and belong above the `EP_CAPTURE_SIDES` loop. (b) costs one read of a square
the function already computes — `rank` in `hasLegalEnPassant` and `enPassantCaptureSquare` in
`src/apply.ts:78` are the same value, which is a symmetry the current code already relies on without
saying so.

### The part that could not be delegated: they are two guards, not one

Security/NFR's sketch was *"guarding on `board[target] === EMPTY`"*. **That guard alone is neither
sufficient nor the one that fixes the corruption**, and I only know that because I built both
separately and mutated each:

- **(b) is the PURITY guard.** It closes all three of QE's reproductions **and a fourth that no prior
  role named**: `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1`, an ep square on the wrong rank for the side to
  move, which drops a phantom **black** pawn on a2. **(a) does not catch it** — a3 is empty, so (a)
  passes cleanly.
- **(a) is the ANSWER guard, and purity does not need it.** On `4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1`
  and its mirror `4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1` the captured pawn *is* correctly present, so
  make/unmake round-trips **byte-exactly** — and the shipped predicate still answers `true` where the
  oracle answers `false`, because `generateMoves` treats an occupied ep target as an ordinary capture
  and never offers the ep move. **A pure divergence.** Constructed at this hop; no prior hop had one.

That separation is the whole content of the ruling. "Corrupts" and "disagrees with the oracle" are
two different failures that QE's three FENs happen to conflate, and a fix aimed at either one alone
leaves the other live.

### Why the oracle is not the authority off-domain, and why that is forced rather than convenient

`legalMoves(position).some(m => m.flags === FLAG_EN_PASSANT)` stays the DEFINITION and the test
oracle **on positions whose en-passant square the board does not contradict** — a domain that
contains everything `makeMove` can produce, hence everything reachable by play, hence the entire
population `## Scope`'s *"exactly when FIDE calls them the same position"* is a meaningful claim
about.

Outside it the oracle is **unsound**, and this is measured, not conceded:

- on `4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` and `4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1` it **corrupts
  identically** to the shipped predicate (QE established this; re-derived here);
- on `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` and `4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1`,
  `generateMoves` offers a pawn **capturing onto a square occupied by the mover's own piece**.

So "make the predicate agree with the oracle everywhere" is not merely expensive — it would require
the hash to reproduce two generator defects. The predicate is therefore **specified** off-domain
rather than derived: it returns `false` and touches nothing. `false` is the truthful answer about a
board on which the named en-passant capture cannot be performed — the pawn is absent, or the
destination is occupied.

**Rule 5 of the first `### ANSWERED` block is the contract and it gains no domain qualifier.** A
query that damages its argument is broken whatever the argument means. `## Out of scope`'s
invalid-FEN line governs what the predicate must *answer*, not whether it may corrupt what it was
handed — which is the Orchestrator's reading of the owner's instruction and I reach it independently
from the mechanism.

---

## 2. THE OWNER'S FOLLOW-ON — castling is NOT the same case. Ruled in `ADR-0006`.

*"Any legal move, even the special ones still need to be checked"* endorses the strict-FIDE reading
for en passant. The Orchestrator deliberately did not answer whether castling follows, and told me
to answer it from the retained Laws text rather than from memory.

**Answered from the text, and the text's currency was re-verified rather than inherited.** A fresh
fetch today returned bytes **identical** to the copy BA/PM retained (sha256 `e0c8bee2…`), and FIDE's
own handbook index still publishes exactly four Laws chapters with nothing after `E012023`;
`E012024`/`2025`/`2026` return the same soft-404 shell as a nonsense chapter id. Manifest at
`.grugops/context/ticket-to-pr-ABC-011/sources/FIDE-CURRENCY-2026-08-03.txt`. A one-day-old currency
claim is still an inherited claim, and the 9.6.1 episode is what taught this project that.

**The ruling: `zobristKey` keeps hashing castling RIGHTS, and must not be changed to hash
availability.** Three reasons, ascending:

1. **The clauses are written in different moods, and the difference has survived every edition.**
   9.2.3.1 is capability — *"could have been captured"*. 9.2.3.2 is entitlement — *"had castling
   rights"*, *"forfeited these"* — and carries a sentence with no counterpart in 9.2.3.1: *"The
   castling rights are lost **only** after the king or rook is moved."* The "only" is exclusive: it
   rules out losing the right to a transient blocker. Present in all four published editions,
   2014–2023.
2. **The determinacy argument — the one that settles it, and it is a verified property of this
   codebase.** `addCastlingMoves` (`src/moves.ts:299-319`) reads exactly `position.castling`,
   `position.board` and the side to move. Every blocker it applies is read off the board, which
   9.2.3 already requires identical. **So two positions with the same placement and the same side to
   move can differ in castling legality only if their rights differ.** That is precisely what was
   *not* true of en passant: the ep square is an extra bit not determined by placement, and it can be
   set while the capability is absent (862 divergences over 19,667 ep-setting moves). Same Laws
   sentence, opposite consequence, because the two components sit differently against the placement
   the Laws already fix.
3. **The residual over-discrimination is real, reproduced, and in the safe direction.** Four pairs
   with identical placement, identical side to move and identical legal-move sets hash differently
   (startpos; a knight still on g1; the king in check; f1 attacked). Missing a draw, never inventing
   one — the direction `ABC-020` exists to protect and the one `ABC-011`'s priority argument rests
   on. "Fixing" it would put `isSquareAttackedBy` on a component carried by **71.0%** of nodes rather
   than the 15.70% carrying an ep square: the `legalMoves` profile, at the wrong end of the
   distribution, to buy a repetition the Laws do not clearly grant.

**And a fact the ruling would be weaker without:** a castling right in this codebase is never stale.
`src/apply.ts:142` clears it when the king or rook moves **and** when the rook is captured on its
home square. Checked exhaustively, not argued: **368,344 nodes carry at least one right, 0 are
stale.** The bit means what the Laws mean — the sentence that was *not* true of `epSquare` before
`ABC-011`.

---

## 3. `ADR-0005` — ACCEPTED, with an amendment. `ADR-0006` — NEW, accepted.

Under the owner's standing directive of 2026-08-03, read in full in `memory-bank/60-progress.md`.
Ratifying carries owning, so both ADRs now carry per-clause falsifier tables, each checkable without
trusting the file.

**`ADR-0005` is not rubber-stamped: one of its statements was FALSE as written.** Its Consequences
described a predicate that "plays a move and takes it back" — implying restoration — and the shipped
implementation does not restore on the class above. Accepting it unchanged would have ratified a
false sentence. Disposition:

- **Clauses 1–5 accepted unchanged.** The reading (endorsed by the owner and supported by the
  retained text), the home in `src/legal.ts` (graph acyclic at depth 6, rebuilt a fourth time), not
  `legalMoves(...).some(...)` (1.979x and it corrupts — **and now a second, independent ground: the
  oracle is unsound on the invalid class**), not `src/moves.ts` (cycle), and the short-circuit first
  (pinned by `src/zobrist.nfr.test.ts`).
- **Decision clause 6 is NEW** — the precondition — and is **decided but not yet built**, the
  `ADR-0002`-clause-2 precedent. `ABC-011` carries the build.
- **Scope bound added.** The ADR is about en passant and says so, because it was read wider than it
  is — by the owner, in writing, one day after it was written.

**`ADR-0006` is separate rather than a sixth clause of `ADR-0005`, and I say so because the board
asked.** It is a different decision about a different key component, from a differently-worded clause,
landing the opposite way; and `ADR-0005` was ratified in the same session on evidence three gates had
examined, while this ruling has been through none — mixing gated and ungated content under one
`accepted` dilutes the word. **The honest counter-argument is recorded in `ADR-0006`'s own Status
section:** this is a no-change conformance ruling, and BA/PM's 9.6.1 ruling set a precedent that
those get a note and a `60-progress.md` line, not an ADR. What overrode it: the wrong inference was
already drawn from `ADR-0005` once, in writing, within a day. Deleting `ADR-0006` and keeping the
note is a cheap remedy for anyone who disagrees.

---

## Scope discipline — what I did not do

**No production code changed.** **No acceptance criterion, reproduction FEN, `NFR-005` bar or
`## Out of scope` line re-opened or edited.**

**Size stays `M` and no re-size is owed.** Two conditions in the one function `ABC-011` already
changes, six test cases, two doc-comment corrections — smaller than the delta that took it `S` → `M`.
Not a split candidate. I agree independently with the Orchestrator that this is not scope growth: the
fix does not answer the invalid-FEN question, which stays `ABC-010`'s; it restores a precondition the
predicate always needed.

**One item is ROUTED TO BA/PM rather than cut here:** `generateMoves` offers an en-passant capture
onto a square occupied by the **mover's own** piece (`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` and
`4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1`, both verified). A generator defect on the invalid-FEN class, a
sibling of `ABC-009`. This fix makes the *hash* immune to it; it does not clean the generator, and
cutting a ticket is not this role's call.

**Cost, because the task asked and because this sits in a per-node function.** Zero on the no-ep path
and at both `NFR-005` anchors — structurally, since the caller's short-circuit never enters the
predicate. **+0.9 to +3.0 ns per call** on the 15.70% of nodes with an ep square, i.e. **≤ +0.5 ns
amortized per node**, under 0.15% of a ~317 ns key. **20–27x cheaper** on the invalid class. No bar
and no catalog target moves; Security/NFR re-gates and owns the verdict.

## Board move I own

`plans/board.md`: **ABC-011 `In Design` → `Ready for Dev`.** In Design 1/2 → 0/2, Ready for Dev
0/6 → 1/6. No limit approached, no override taken, no written reason owed. **`Ready for Dev` →
`In Development` is the Orchestrator's pull and was deliberately NOT taken.** Nothing was merged and
nothing was deployed — a human holds both.
