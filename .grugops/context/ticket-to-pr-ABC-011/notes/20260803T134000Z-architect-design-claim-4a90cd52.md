---
id: 20260803T134000Z-architect-design-claim-4a90cd52
kind: claim
by: architect-design
at: 2026-08-03T13:40:00Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - ABC-012
  - EPIC-004
  - NFR-005
  - ADR-0005
  - ADR-0006
  - src/legal.ts
  - src/moves.ts
supersedes: 
---

# What this hop could NOT settle — six items, and one thing I would rather have been asked to do differently

Recorded as a `claim` at `confidence: UNKNOWN - verify` because none of it is gate-adjudicable here
and none is load-bearing for the ruling. **There is no §14 gate on this install, so no `finding` is
admissible on this task, none was written, and nothing is self-stamped.** `context.human_admission`
is `off`, so the `human:<name>` escape hatch is unavailable too.

**1. `ADR-0006` rests on the Laws text alone. Arbiter commentary was NOT retrieved.**
Its falsifier **G2** — an arbiter-level ruling that two positions differing only in an unusable
castling right are the *same* position for 9.2/9.6 — is `UNKNOWN - verify`, not "checked and clear".
I retrieved and re-verified the Laws (all four published editions, sha256 and currency) and stopped
there, because the Laws are FIDE's own authoritative publication and commentary is not. A reader who
wants that gap closed should retrieve the Arbiters' Manual and retain it the way
`refinement-fide-9-6-1` retained the Laws. **I did not assert what it says.**

**2. Every timing figure is one machine.** Apple M3 / Node v24.12.0 / darwin-arm64. The
+0.9…+3.0 ns per call, the ≤ +0.5 ns amortized and the 20–27x on the invalid class are
`UNKNOWN - verify` on any other hardware, exactly as `NFR-005`'s depth-7 level already is. Owner:
`EPIC-004`'s non-M3 spike, which carries the identical obligation.

**3. My whole-key benchmark cannot resolve the guard's cost, and I say so rather than pick the
flattering run.** Two full runs of the same script put the amortized ratio at 0.9815–0.9948 and
1.0383–1.0454 — bracketing 1.0 from both sides, i.e. a resolution of roughly ±4% on a delta that the
isolated measurement puts at under 0.15%. **The isolated predicate figures are the claim; the
whole-key ratios are reported only to show the delta is below what a whole-key run can see.** The
same limit Security/NFR hit on the "not slower at all" sub-bar, for the same reason.

**4. The domain restriction is a specification, not a theorem, and I want that visible.** The ruling
says the predicate answers exactly on positions whose ep square the board does not contradict, and is
*specified* to answer `false` outside it. What I verified is that the two populations do not overlap
on anything reachable (0 guard firings in 81,397 ep-set nodes). What I did **not** and cannot verify
is that no future caller constructs a `Position` by hand that lands off-domain and reads the `false`
as FIDE's answer rather than as "this board contradicts itself". The mitigation is a doc comment,
which is weaker than a type. Naming it because a later reader deserves to know it is a soft edge.

**5. `generateMoves`' unsoundness on the invalid class is named, reproduced, and NOT fixed.** It
offers a pawn capturing onto the mover's own piece
(`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1`, `4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1`). I routed it to BA/PM
rather than cutting a ticket, which is the correct routing and also means it is currently owned by
nobody until BA/PM acts. Its severity is unassessed by me — Security/NFR owns severity, and I did not
borrow their vocabulary. It is a sibling of `ABC-009` and plausibly folds into `ABC-010`.

**6. Whether `ADR-0006` should exist at all.** I judged that it should, and the counter-argument is
strong enough that I wrote it into the ADR's own Status section rather than into a footnote: it
changes no code, and this project already ruled (BA/PM, FIDE 9.6.1, 2026-08-02) that a no-change
conformance ruling gets a decision note and a `60-progress.md` line, **not** an ADR. What decided it
for me is that the wrong inference was already drawn from `ADR-0005` in writing within a day of it
being written, by the project owner. A reader who thinks this is gold-plating against my own "keep
design just enough" limit has a fair case and a one-file remedy.

## One process note, offered rather than smuggled into a ruling

I was asked to rule on the definition, and the ruling I reached says the *predicate* must check a
precondition that `makeMove`/`unmakeMove` assume and do not state. There is a defensible alternative
I rejected for scope reasons rather than technical ones: **state that precondition on `makeMove`
itself** — either in its doc comment (free) or by having `UndoRecord` carry the capture square's
actual prior content (not free: it is per-move allocation on the hottest function in the project, and
`src/apply.ts` is out of `ABC-011`'s scope). Every current caller except this predicate takes its
moves from `generateMoves` and so satisfies the precondition already, which is why the cheap
half — one sentence in `makeMove`'s doc comment naming what a well-formed move is — is the version I
would put in front of BA/PM. **I did not take it here**, because it edits a file this ticket puts out
of scope and because it prejudges nothing that blocks the fix. Owner: BA/PM, alongside item 5.

## Carried, not fixed — each deliberate

- **`ABC-009` and `ABC-010`** untouched and still reproduce. Independently re-confirmed that the
  guarded predicate does not inherit `ABC-009`.
- **`memory-bank/30-architecture.md`'s `Hashing` row** — QE and Security/NFR both named the same
  one-cell content imprecision (the row still reads as a self-contained leaf and says nothing about
  the `legal.ts` edge). **I did not take it either**, and I want to be honest about why: it is a
  documentation edit, it is now the third role in a row to decline it, and "everyone agrees and
  nobody does it" is how a small correction becomes permanent. Flagged for the dev hop, which is
  already editing two doc comments and can absorb a third cell.
- **UAT stays DEFERRED to `EPIC-006`, not passed.** Nothing built renders or prompts.
