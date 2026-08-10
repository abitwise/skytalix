---
id: 20260810T185705Z-software-engineer-decision-f686c711
kind: decision
by: software-engineer
at: 2026-08-10T18:57:05Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-026
  - ABC-013
  - N5
  - A1
  - A5
  - A6
  - EPIC-003
  - src/san.ts
  - src/san.qualifier.hardening.test.ts
  - plans/traceability.md
supersedes: 
---

# The candidate is **REFUSED** on a built mutant, and `N5` stays **NOT MET**: the only compliant change costs coverage. Zero lines shipped

The two `observation` notes beside this one carry the numbers and are not repeated. This note is the
ruling and what I did with it.

```
goal            N5 MET on the re-derived bar with the delivered corpus intact
outcome         NOT REACHED — and the reason is a measurement, not a shortfall of effort
N5, delivered   NET +7.3% / +8.2% CPU on two admissible runs, against <= 5%   NOT MET (1.5-1.6x)
  null control  +0.1% / -0.6% / -0.8%, sign 4/8, 4/10, 3/10        ADMISSIBLE
  fixed floor   +5.0% / +4.7% / +3.6% for two added test files      measured and subtracted
the candidate   A1 assisted-only: REFUSED on coverage, and it reads net +5.2% — AT the bar anyway
shipped         NOTHING. src/ diff unchanged at +823/-0. A6 holds. No criterion weakened.
```

## 1 — the candidate is refused, and it is refused on a build rather than on an opinion

The brief named the one thing that would make dropping `A1`'s unassisted half a coverage cut: a build
whose two call forms **diverge only on the 184 derived positions** — never on `A5`'s 23, never on
`ABC-013`'s 18. **I built it.** It compiles, it is killed by **exactly one test** on the delivered
net, and that test is `A1`'s both-call-forms row; with that half removed it survives **676/676, skip
0**. `A5` cannot see it, `A18`/`A19` cannot see it, `A3`'s 63 unassisted rows cannot see it, `N1`
cannot see it, and purity holds.

**By the brief's own decision rule — *"if that build exists, the candidate is refused"* — it is
refused.** I am not reinterpreting that rule after seeing which way it points; quietly widening a
stated criterion once the answer is inconvenient is the failure this ticket has spent five hops
policing.

**And I am recording the weakness in my own evidence, because a refusal whose weakest point is
hidden is worth less than one whose isn't.** The mutant's gate is `position.halfmoveClock > 0` — a
move counter with no bearing on disambiguation, i.e. a planted trigger rather than a mutation of the
qualifier logic. Taken alone that argument proves too much: for *any* finite corpus there is a build
wrong only outside it, so "constructible" alone would forbid ever narrowing anything.

**What carries the refusal is the structural measurement underneath it, and it points the same way.**
Fourteen predicates counted over the derived half and over every legal move of the 41 hand-built
positions: the **only two** that separate are `halfmoveClock` and `fullmoveNumber`. Every
disambiguation-relevant axis is covered by the 41, and on four of them the derived half is strictly
**poorer** — it never has more than one rival where the 23 go to three, and it fills 5 of 44 census
cells where the 23 fill all 44. Its distinctive contribution is not a *kind* of position; it is
**dense real-play boards that nobody chose**, and that is exactly the property no predicate can name
and no mutant author can be relied on to have thought of. Three natural call-form mutants I built
(reference identity, pseudo-legal rivals, a scan cap) are all killed with the unassisted half
removed — so the loss is not visible in the mutants anyone would write, which is precisely the
situation in which this board has twice ruled that absence of a mutant is not evidence.

**Consistency, since the argument now runs against my own ticket.** QE refuted the Engineer's *"the
counts are identical across all 13 mutants"*; Security/NFR upheld QE; BA/PM refused to accept the
same species of argument for their own bar. *"No mutant we wrote sees the difference"* would be that
argument a fourth time, and I will not take shelter in it just because this time it would let me
close a bar.

## 2 — the second, independent reason the candidate would not have helped

The arithmetic on the record — `gross +7.4% − floor +5.8% = net ~1.6%` — **subtracts a two-file
floor from a one-file gross.** Security/NFR's variant was the delivered file alone (21 files);
BA/PM's floor was two files. Measured at matching file counts under the re-derived protocol, the
candidate reads **gross +9.9%, net +5.2%** — on the wrong side of `≤5%`, and inside the instrument's
own between-run spread of the bar either way. **The trade on offer was never 1.6%.** Security/NFR
reached *"it breaches the bar too"* for their variant; that conclusion survives the floor correction.

So the candidate is refused twice over: it costs coverage, **and** it does not buy the number.

## 3 — what I built to close the gap without touching coverage, and why I did not ship it

The remaining space is making the same assertions cost less. `A1`, `A2` and `A4` each parsed all 207
corpus FENs and generated all 207 legal lists for themselves; `A1` and `A2` each ran the ladder
search over the same 5,524 qualifiable moves; and `A1`'s 5,524 assisted renders were a subset of
`A4`'s 7,314. I collapsed all of that into one module-level pass — the same move the file already
makes for `CORPUS` and `CORPUS_CELLS`, citing `N5` in both places.

It is **net-preserving, measured**: 17 mutants (this ticket's 13 re-specified, QE's call-form three,
and the new one) scored against both files — **0 verdict mismatches**, and all four
behaviour-equivalent controls still alive, killed count zero. Nothing quantified over changes: same
207 positions, same 7,314 assisted renders, same 5,524 **unassisted** renders, `A2` still computed
from the legal move list and never from `toSan`.

**And it buys nothing.** Paired against the delivered file in the same rounds it measures **−0.6
points in one admissible run and +0.7 points in another** — the sign flips. It costs **+38 lines**,
taking `src/` from +823 to +861 and cutting Security/NFR's risk #8 margin from 77 lines to 39, and it
would send a file QE and Security have already gated back through both. **A change whose measured
benefit does not survive its own instrument is not an improvement, it is churn**, and shipping it to
have something to show would be this board's oldest error — believing an instrument without testing
it. It stays in the scratchpad with its numbers.

## 4 — the legitimate failure outcome, stated as the brief asked for it

**The only compliant change costs coverage.** The lane's cost under this bar is per-file overhead
(two empty files ≈ the whole budget) plus `A1`'s unassisted half, and the unassisted half is the
coverage. There is no arrangement of `A1`–`A5` I could find that meets `≤5%` net while still
rendering the unassisted call form over the 184 derived positions.

This goes back to the Orchestrator and the owner. **The trade is now priced on both sides**: keeping
`A1` as written costs ~2.3–3.2 points of lane CPU over the bar, roughly **150–210 ms of CPU on a
~6.5 s lane**; giving it up loses the sole guard on a class of wrong build that has been demonstrated
to exist, and does not reliably buy compliance anyway.

## 5 — what I did NOT do

**No production line, and no test line.** `src/san.ts` still hashes `cbcc3be37c21414d16e8e6b4d0c68959`;
`git diff --numstat main -- src/` is unchanged at `655/0 + 168/0`; both hardening files are
byte-identical to the hashes QE and Security/NFR recorded. **`A1`–`A6` are not re-opened and no
criterion is weakened**; the corpus is not narrowed; `A5` is untouched. **The bar was not moved** —
it was applied, including its admissibility clause, which cost me one whole harness run. `ABC-013`,
`ADR-0004` and `EPIC-003`'s `parseSan` contract are not re-opened. `plans/nfr-catalog.md` is not
edited and no catalog target moved. No dependency added. `plans/board.md` is left to the Orchestrator.
Nothing merged, nothing deployed — a human holds both.

## 6 — one thing the next hop should not inherit as fine

**`A5`'s evidence line is false and this hop confirms it a third time.** It reads *"this criterion is
corroboration, not a mutant-killer … no mutant in this hop's set turns it red."* `A5` is red for
`CF2`, `CF3` and `CF4` on my own instrument, as QE first measured and Security/NFR upheld. The
criterion's normative clause is correct; its parenthetical is not, and `A1`'s parenthetical
(*"7,314 renders in 6.3–16.8 ms"*) is a single-call-form plain-node figure for a criterion that makes
11,048 renders under vitest. **Neither is mine to edit** — the criteria are BA/PM's — and neither
disagreement was created by this hop, which changed no code. Named here because a stale evidence line
in a criterion is how a later reader concludes a guard is decorative and deletes it, and `A5` is one
of only three rows in the repository that catch `CF1`.
