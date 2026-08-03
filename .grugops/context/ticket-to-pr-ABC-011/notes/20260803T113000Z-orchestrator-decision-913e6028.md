---
id: 20260803T113000Z-orchestrator-decision-913e6028
kind: decision
by: orchestrator
at: 2026-08-03T11:30:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-010
  - ADR-0004
  - ADR-0005
  - memory-bank/60-progress.md
  - memory-bank/50-decisions/ADR-0005-en-passant-availability-and-the-hash-layer.md
  - plans/board.md
  - src/legal.ts
  - src/zobrist.ts
  - 20260803T110000Z-orchestrator-observation-39a99b26
supersedes: 
---

# OWNER RULING 2026-08-03: fix the MEDIUM defect before merge, and decisions go to the role that can verify them

## The owner's words, verbatim and unedited

> *"fix the medium defect before merging. regarding ADR-0005, any legal move, even the special ones
> still need to be checked. I can see ADR-0005 contains a lot of info that human in this project is
> unable to correctly verify. Thus in most cases send decision to correct role. If it is architecture
> question then to architect to make the decision."*

Quoted rather than paraphrased because two of the three parts change standing rules, and a
paraphrase of a governance change is how a project loses one.

## Part 1 — the MEDIUM defect is fixed before merge

`ABC-011` moved **`Ready for UAT` → `In Design`**, a backward move from a gates-passed ticket. The
owner declined to merge carrying the defect, which is precisely the decision `autonomy=pr` reserves
for them.

**The gates were not wrong to pass it.** QE found and named it; Security/NFR ruled it MEDIUM and
not-blocking on reachability (unreachable by play — `apply.ts:139` derives `epSquare` as the
double-push midpoint — and reachable only through `parseFen`, which is `ABC-010`'s surface). Both
recorded it in the open as an accepted risk with a named owner. **The owner is the one who accepts
an accepted risk, and this one they declined.** That is the mechanism working, not failing.

**No new ticket is cut, and this is not scope growth.** The first design hop's `### ANSWERED` block,
rule 5, requires the predicate to "leave the position byte-identical on return". On this input class
it does not. `## Out of scope`'s invalid-FEN line governs what the predicate must **answer**, not
whether it may corrupt what it was handed. Anything that turns out to be genuinely `ABC-010`'s stays
routed to BA/PM as Security/NFR left it.

## Part 2 — "any legal move, even the special ones still need to be checked"

Recorded as a **technical ruling**, not as preamble. It endorses `ADR-0005`'s strict-FIDE reading: a
special move is still a move, so en-passant availability is a legality question and not a
board-geometry one. The design hop reached that independently from the Laws text; the owner now
affirms it.

It also raises a follow-on the Architect must **answer rather than assume**, and this note
deliberately does not answer it: **is castling the same case?** `zobristKey` hashes castling
**rights**. FIDE 9.2.3.1 (en passant — "could have been captured") and 9.2.3.2 (castling — rights
"forfeited") are worded differently, so the answer is not automatic in either direction, and both
readings are defensible from the sentence alone. The retrieved Laws text is already in this repo's
shared context under task `refinement-fide-9-6-1`; answer it from that, not from memory. The 9.6.1
episode is exactly what that rule was learned from — a remembered sentence was verbatim correct and
two editions stale.

## Part 3 — the governance change, and its limits

**The standing rule "no agent may mark an ADR `accepted`; a human must" is RETIRED by the owner.**
`ADR-0004`'s delegated ratification, recorded in three places as *explicitly not precedent*, stops
being an exception and becomes the ordinary case. The owner's stated reason is **verifiability**:
they decline to rubber-stamp technical content they cannot check, which is a more honest position
than a signature that means nothing.

**Architect/Design may now move an ADR to `accepted`, and `ADR-0005` is the first.** Ratifying
carries owning: an ADR accepted under this delegation must record what would falsify it.

The reading, its boundaries, and what was **not** delegated — merge and deploy, still human-held,
still never standing authorization — are written in full in `memory-bank/60-progress.md` under
**"Standing directive — who decides"**. That file is the durable home; this note records the
instance. The owner's own hedge, *"in most cases"*, is honoured rather than rounded up to "all": a
decision that changes what the product promises a user still goes to the owner, and a role unsure
which side of that line it is on asks.

## Why this went to Architect/Design and not straight to an engineer

Three things are owed and all three are architecture: the definition question under the defect
(QE reproduced the shipped predicate and the ruled oracle disagreeing on
`4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` and explicitly declined to call it — "needs an Architect ruling
not a dev fix"), the castling question, and the ratification. An engineer who guesses the definition
writes a fix against a contract that can be rejected. Same reason this ticket entered `In Design`
the first time, and the first hop is why the implementation avoided two traps instead of walking
into them.

## Next action

Architect/Design settles all three, then the fix goes to an engineer and re-enters the gates. The
merge stays the owner's.
