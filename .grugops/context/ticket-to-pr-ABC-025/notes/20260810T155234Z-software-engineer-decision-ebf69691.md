---
id: 20260810T155234Z-software-engineer-decision-ebf69691
kind: decision
by: software-engineer
at: 2026-08-10T15:52:34Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-013
  - RISK-ABC013-04
  - EPIC-002
  - EPIC-003
  - src/san.ts
  - src/san.test.ts
  - src/san.qualifier.hardening.test.ts
  - plans/tickets/ABC-025-san-qualifier-minimality-net.md
supersedes: 
---

# Implementation decisions — one new test file, `A1`–`A5` in it, `A6` deliberately NOT in it, and the one conflict I did not absorb

`ABC-025` is delivered as **one new file, `src/san.qualifier.hardening.test.ts`, +655/−0, 20 tests,
zero production lines.** Every decision below is one a reviewer could disagree with, so each is
written with its reason rather than its outcome.

## 1 — where the rows live: one new file, and `src/san.test.ts` is not touched at all

`## Test notes` note 1 forbids widening `src/san.test.ts`'s `POSITIONS` map, and that rules out the
tempting shape (new `describe`s inside the existing file), because `A18`/`A19` iterate that map. I
went further than the note requires and did not edit `src/san.test.ts` **at all** — no new
`describe`, no new table, no import from it. Two reasons, both mechanical:

- importing a `*.test.ts` file from another `*.test.ts` file re-executes its `describe` blocks, so
  the six perft FENs and the one-ply corpus builder are **re-derived** in the new file rather than
  shared. That is deliberate duplication and it is written down in the file header;
- lifting them into a shared helper would put a **non-test file under `src/`**, which `A6` forbids.

The consequence is that `git diff -U0 main -- src/` is **empty** — the strongest form of `A6`'s
"additions only", and it is checked mechanically rather than asserted.

## 2 — `A1` is a search, and the qualifier is read back out of the string

`minimalQualifier` collects the origins of the legal moves of the same **piece byte** that reach the
destination, then walks `["", file, rank, square]` and returns the **first** entry that admits
exactly one of them. It never computes `sharesFile`/`sharesRank`. `qualifierOf` strips a trailing
`+`/`#`, drops the piece letter, drops the two-character destination and a preceding `x`. Nothing
asks `src/san.ts` for the qualifier, so `A20`'s one-export surface is not widened to make a test
easier.

I added ONE precondition inside `A1`'s loop: the emitted string must end in the destination it was
asked for. Without it a garbled read would make the criterion green by accident. It is a
setup assertion, not a second criterion, and it kills no equivalent control (measured).

**`A1` is deliberately left blind to `Q28'`.** I considered folding an `x`-presence check into `A1`
and rejected it: `A1` would stop being a qualifier property, and the ticket's whole argument for
`A3` existing as a criterion in its own right rests on the measured fact that `A1` cannot see a
defect outside the rival set. Verified after the fact — `Q28'` leaves `A1` green and turns 12 of
`A3`'s rows red, exactly as the ticket says.

## 3 — `A2` is computed from the legal move list, never from `toSan`

That is what makes the census un-witnessable by a wrong build, and it was checked: **all 13 mutants
leave `A2` green** (44/44 filled, 0 rook-square, 5 derived) — the criterion says no wrong build can
witness it, and now that is measured rather than argued. Both discriminating directions are asserted
in the suite: the derived corpus alone must fill **≤ 9 of 44** (measured 5) and **deleting any one of
the 16 ladder positions must empty a cell** (measured: all 16 are load-bearing). The leave-one-out is
computed from a per-position cell set built in one pass, so it costs no extra render.

## 4 — `A6` is NOT asserted in the suite, and that is a decision, not an omission

An in-suite `md5(src/san.ts) === cbcc3be3…` row would be trivial to write. I refused it. The
ticket's own words are that the pin *"goes stale the moment any ticket changes `src/san.ts`"*, and
`EPIC-003` adds `parseSan` to that exact file. A suite row asserting the hash would turn a
**sanctioned** edit red and teach the next engineer that the way through a guard is to delete it.
`A6` is verified with `git diff -U0`, `md5 -q` and the gate commands, which is what the criterion
itself asks for.

## 5 — the conflict I did not absorb: `A1`'s `when` clause against `N5`

`A1` says the string is checked **in both call forms**. The unassisted form makes `toSan` regenerate
the legal list once per move — 5,524 times over the corpus — and under vitest that costs **~174 ms**,
which alone is ~13% of the 1.36 s default lane against `N5`'s **≤ 5%** bar.

I delivered `A1` **as written** and did not quietly narrow it. The reasons, in order:

1. `A1` is an acceptance criterion of this ticket; `N5` is an NFR bar owned by the Security/NFR gate
   and by BA/PM who set it. Narrowing an acceptance criterion to protect someone else's bar is
   exactly the decision a role is not supposed to take on its own.
2. `N5` is breached **either way**. The cheapest variant that still satisfies `A1`–`A5` measures
   89 ms ≈ 6.5% of the lane. There is no shape of this ticket that fits 5% on this instrument.
3. The evidence that the clause is cheap to lose is real but bounded: across all 13 mutants the
   assisted-only and unassisted-only mismatch counts are **identical**, so the clause changes no
   verdict in this set — and the ticket itself says this set is not complete.

The measurement, its cause, and the exact one-line change that halves the cost are in the
`observation` note beside this one. The ruling is Security/NFR's and BA/PM's, not mine.

## 6 — assertion style: counts, not one `expect` per move

The corpus-wide criteria accumulate mismatches and assert the count with the first five spelled out.
Per-move `expect` calls are ~20 µs each under vitest and would have added tens of milliseconds to a
lane this ticket is already charged for. A count is also the unit BA/PM's mutant table is stated in,
which is what let this hop compare verdict counts row for row.

## What I did NOT do

`ABC-013` is not re-opened — no criterion, row, count or verdict edited, `src/san.test.ts` and
`src/san.nfr.test.ts` untouched. `ADR-0004` and `EPIC-003`'s `parseSan` contract are untouched.
`plans/nfr-catalog.md` is not edited and no catalog target moved. No dependency added: `chess.js`
was installed in a scratchpad outside the repository and `package.json` / `package-lock.json` are
byte-identical to `main`. Nothing merged, nothing deployed.
