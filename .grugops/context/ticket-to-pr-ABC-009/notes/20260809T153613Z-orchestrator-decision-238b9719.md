---
id: 20260809T153613Z-orchestrator-decision-238b9719
kind: decision
by: orchestrator
at: 2026-08-09T15:36:13Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - src/moves.ts
  - src/fen.ts
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - agent-factory/workflows/04-ticket-to-pr.md
supersedes: 
---

# `A13` accepted, my accounting corrected twice, my fourth error — and it is the one BA/PM warned me about

BA/PM added **`A13`** rather than widening `A11`, and its reason is right: widening would have flipped a
criterion the board certified one hop earlier from MET back to NOT MET, destroying the record of the
independent verification that existed *precisely because* QE refused to certify its own rows, and making
`A11`'s retirement note contradict itself in one file on one day. `A13` **subsumes** `A11` with a
value-by-value discharge map, so it costs two values' worth of rows instead of twelve, and it carries the
one open marker so QE discharges exactly one. Accepted.

## My fourth error, and it is the worst-shaped one

I built a probe to re-derive the 13-value count and **my probe said 11.** The rest of my probe board
pinned both kings elsewhere (`K3…` puts a white king on a1, `4k3` a black king on e8), so `K` and `k` on
the target square were rejected as duplicate kings — **a limit of my own probe board reported as a fact
about the domain.**

That is *verbatim* the error BA/PM had just disclosed against itself in the hand-back I was checking:
*"my first instrument said 11. Its single probe board already held a white king…"* It warned me, in the
document I was verifying, and I walked into the identical trap ten minutes later.

Rebuilt with one witness board per character, the other pieces placed so the king count holds:

```
e1: 12 piece values [KQRBNPkqrbnp] + EMPTY = 13
h1: 12 piece values [KQRBNPkqrbnp] + EMPTY = 13
a1: 12 piece values [KQRBNPkqrbnp] + EMPTY = 13     identical on all three, as BA/PM measured
```

**Four errors of mine on this task**, all one shape — the queen-instance conclusion, the traceability
miscount, the `pieceTypeOf` broken build, and now this. Every one was believing an instrument's output
without checking the instrument. BA/PM's stated fix is the right one and I am recording it as the lesson
of this task: **print the input, not the verdict.** My probes printed pass/fail; they never printed the
board they were asking about, which is the one thing that would have shown the king already sitting there.

## BA/PM's two corrections to my accounting — both verified, both mine to own

**1. `NOT CONSTRUCTIBLE` needs its own sixth bucket.** Own `KING` on the rook's home square: `parseFen`
refuses every construction. Verified:

```
4k3/8/8/8/8/8/8/K3K3 w Q - 0 1  → REJECTED: position must have exactly one white king, found 2
4k3/8/8/8/8/8/8/4K2K w K - 0 1  → REJECTED: position must have exactly one white king, found 2
```

BA/PM's reason for refusing to fold it into the equivalence bucket is the important half: doing so
*"would be the same silent omission that produced four misses."* A value excluded because it cannot exist
and a value excluded because its admission is unobservable are different exclusions, and collapsing them
hides one.

**2. The two squares partition differently, which my accounting assumed away.** On the rook's square own
`ROOK` is the *required* value and own `KING` is a wrong one — so the sums are `1+5+1+2+3` and
`1+4+1+1+2+3`, both **12**. My five-bucket symmetric accounting reached the right total by luck of
cancellation. Conclusion unchanged, argument now actually sound.

BA/PM also strengthened the equivalence exclusion I had explicitly left unverified: it now rests on **two
instruments agreeing 12/12** — mutation survival plus `isSquareAttackedBy` asked directly, polarity-checked
before any verdict was read. My previous note recorded that I had re-derived none of those three; that gap
is closed by BA/PM rather than by me.

## Exhaustiveness: agreed, with the three outside regions named rather than hidden

Exhausted for the dimension `A13` quantifies over — no thirteenth region inside it. BA/PM names three
regions **outside** it and I accept all three placements:

- **The 243 `Uint8Array` bytes `parseFen` never writes** (`7`, `8`, `15`, `≥16`). Unreachable by any
  `Given` clause, therefore unfalsifiable. This is what a naive "one byte = 256 values" reading would
  mistake for a thirteenth region, and it is not one.
- **The joint 13×13 pair space** — inert for the delivered code, because `src/moves.ts:326-327` are two
  *independent* byte compares. Follow-up ticket.
- **The constants no criterion varies.** Follow-up ticket.

The last two go to the follow-up hardening ticket for `src/moves.ts` under the stopping rule, which BA/PM
explicitly supports. **The stopping rule stands: this QE hop is the last hardening pass on `ABC-009`.**

## The collision warning is real and QE must have it

Verified on the delivered code — every row pure with 0 castles, so the *count* is the only other signal:

```
king's square:  enemy BISHOP 13 · enemy KNIGHT 13 · enemy PAWN 13   ← three values, one count
rook's square:  enemy BISHOP  5 · enemy PAWN     5 · EMPTY      5   ← three values, one count
                (enemy KNIGHT 4 is the one that differs)
```

So a count-only row is **interchangeable with two other byte values**, and the occupant-byte setup
assertion is load-bearing rather than belt-and-braces. QE's `expectImpostorSetup` pattern already exists
and already caught one lying label; this is the case that makes it mandatory rather than prudent.

## Scheduling

Enqueued: `ticket-to-pr-ABC-009-qe3` → QE/E2E. **Eight rows, zero production lines** — enemy `KNIGHT` and
enemy `PAWN`, both squares, at `A11`'s doubling. BA/PM measured all eight with setups asserted (0/8 labels
lie) and non-inert (0/8 masked or blocked): `13, 14, 17, 19` on the king's square, `4, 5, 4, 5` on the
rook's. Width 1. `pending/` and `claimed/` empty at this decision; no stale-claim sweep owed.

`src/moves.ts` still `0e247853ab2c05887c76105ff83d8621` after **five** hops. Suite 371/371 at skip 0.
Nothing merged, nothing deployed.

**After QE:** UAT ruling (deferred → `EPIC-006`, explicitly NOT passed), merge under the owner's standing
directive of 2026-08-06 with gates recorded on the branch tip before and on `main` after, close to `Done`
**including the ticket frontmatter** — the step `ABC-018`'s close missed, and the trigger BA/PM wrote
fires on this close.

## What this note does NOT establish

- **That BA/PM's eight row counts are right.** I verified the four single-config values I could reach
  cheaply and the collision structure; I did not re-derive `14`, `17`, `19` or the rook-square doubling.
  QE measures them when it writes the rows, and a discrepancy is to be raised, not adjusted.
- **Any `NFR-001`, perft or deep-lane figure of mine.** None, across the whole task.
