---
id: 20260818T005500Z-ba-pm-decision-every-hand-written-fen-is-executed-before-the-ticket-is-cut-4e61a2ad
kind: decision
by: ba-pm
at: 2026-08-18T00:55:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - ABC-031
  - G8
  - A4
  - A2
  - src/fen.ts
  - src/legal.ts
supersedes:
---

# The practice: a hand-written FEN is EXECUTED before the ticket carrying it is cut. It costs 57 ms.

`G8` is a process gap, and this is the practice that closes it. **No tooling is built and none is
recommended** — the repo already has everything needed, on `main`, merged: `parseFen` (`src/fen.ts`)
and `legalMoves` (`src/legal.ts`).

## The practice, in one paragraph

**Before a criterion that names a FEN leaves BA/PM's hands, run that exact string through `parseFen`
and `legalMoves` and read the move list back.** Then check the criterion against the list you got,
not against the position you pictured. If the criterion says "exactly 4 candidates", the list must
contain those 4. **Paste the resulting move list into the criterion or its note**, so the next reader
is checking a transcription rather than repeating the derivation. A FEN that has not been executed is
an unverified claim in a document whose whole purpose is to be verifiable, and `AGENTS.md` says to
mark those `UNKNOWN - verify` — a FEN nobody can execute at cutting time is exactly that, and should
be labelled rather than printed as fact.

## The cost, measured rather than estimated

A throwaway script in the scratchpad that imports both functions and prints the SAN move list for two
FENs and resolves fourteen input strings: **`real 0m0.057s`** on this machine, this hop. Writing it
is a handful of lines. **Against that: `ABC-031` and `ABC-032` have each now paid an engineer's
discovery, a QE confirmation and a BA/PM repair hop for one unexecuted line — three hops, twice.**

## Why the defect propagated, and the specific habit that stops it

Neither ticket derived the FEN independently. **The string was copied from one ticket page to
another**, and a copied FEN inherits its author's confidence without inheriting any evidence. The
position is subtle in exactly the way that survives reading: `4k3/4K3` looks like "the two kings, out
of the way", and adjacent kings are illegal — a rule the reader knows and the eye does not check.

So, two habits, in this order:

1. **Execute every FEN you write.** Cost above.
2. **Executing is what transfers, not the string.** If you copy a FEN from another page, you have
   copied a claim, not a verification — run it again on the page you are cutting. Had that been done
   at `ABC-032`'s cut, `ABC-031`'s already-known defect would have been caught by a second reader
   instead of by a second engineer.

## Deliberately not proposed

- **A validator, a lint rule, or a CI step over ticket FENs.** It would be a new tool, a new file and
  a new gate for a defect that a 57 ms habit prevents; the practice binds the role that writes the
  string, which is where the error is made.
- **Removing `src/coordinate-move.test.ts:17`'s `A2_FEN_AS_WRITTEN` pin.** It is the executable
  record of the known-bad input and it stays. See the `A4` repair decision.
