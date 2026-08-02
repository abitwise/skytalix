---
id: 20260803T125000Z-security-nfr-claim-c48d7f05
kind: claim
by: security-nfr
at: 2026-08-03T12:50:00Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - ABC-012
  - ABC-020
  - EPIC-004
  - EPIC-006
  - NFR-005
  - ADR-0005
  - src/zobrist.ts
  - src/legal.ts
  - src/zobrist.nfr.test.ts
  - plans/nfr-catalog.md
supersedes: 
---

# The three accepted risks, and four things this gate could NOT settle

Recorded as a `claim` at `confidence: UNKNOWN - verify` because none of it is gate-adjudicable here.
**There is no §14 gate on this install, so no `finding` is admissible on this task, none was written,
and nothing is self-stamped.** `context.human_admission` is `off`, so the `human:<name>` escape hatch
is not available either; the severities and owners below are stated in full in the note bodies, and
the degraded note kind changes the admission class only — never the severity, the ownership or the
blocking decision.

## The three ACCEPTED RISKS, each with a named owner

An accepted risk without a named owner is a finding nobody fixes, so each carries one.

**1. Every timing figure on this ticket is one machine. — Owner: `EPIC-004`'s non-M3 spike.**
Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64. My 297.2–298.4 ns, 323.5–330.9 ns and
1.385–1.400x are `UNKNOWN - verify` on any other hardware, exactly as `NFR-005`'s depth-7 level and
`NFR-001`'s µs figures already are. The machine-independent quantity is the **ratio to the baseline
tree measured in the same process**, which is what my table reports; the absolute nanoseconds are not
the claim. This risk is accepted rather than closed because the obligation already has a home:
`EPIC-004`'s timeboxed spike (RISK-002's mitigation) is the named verification that lifts the
PROVISIONAL marker from `NFR-005`'s depth-7 level, and it inherits this too.

**2. `zobristKey` permanently corrupts a position whose ep square is semantically inconsistent.
Severity MEDIUM. — Owners: BA/PM to cut it or fold it into `ABC-010`; Architect/Design to rule the
predicate-vs-oracle divergence.**
Ruled in full in the `decision` note and reproduced in the `observation` note. Accepted rather than
blocking because the trigger class is invalid-FEN only — verified at every write site to `epSquare`
in `src/`, not argued — and because that class is `ABC-010`'s surface and this ticket's
`## Out of scope` carries it explicitly. Two things are genuinely owed to a human and are named
rather than left implicit: the third reproduction FEN is a **real divergence from the ruled oracle**,
which the design hop made "the DEFINITION and the test oracle", so implementation and definition
disagree and only Architect/Design can say which moves; and fixing it by guarding on
`board[target] === EMPTY` would make the predicate return `false` where its ruled oracle returns
`true`, which is a design call and not a dev-hop one. I did not pin it, for QE's reason and I agree
with it: a test asserting the current output would enshrine the defect as intended behaviour.

**3. The amortized per-node figure is measured on a perft-table population, not a search's. — Owner:
`EPIC-004`.**
The 1.014–1.022x (design hop) and 0.9948–1.0218x (dev hop) rows are over pools drawn from the
`src/perft.test.ts` table at its natural en-passant frequency. An alpha-beta search with move
ordering, quiescence and transposition cutoffs visits a different distribution — plausibly more pawn
tension. **I deliberately did not re-derive the amortized row**: the two prior runs agree once
scaled to a common ep frequency, a third derivation buys nothing this gate needed, and `ADR-0002`
clause 3's per-node claim is already discharged by the two anchor positions I did measure. Stated as
a limit of what I verified, not as a doubt about their numbers.

## Four things this gate could NOT settle

**1. Whether the guard I added is the *right* guard for a search that does not exist yet.**
`src/zobrist.nfr.test.ts` pins zero predicate calls on no-ep nodes and exactly one on ep-set nodes.
That is the sub-bar as this ticket words it. It is **not** a statement about `EPIC-004`'s
transposition table, which may call `zobristKey` under a different distribution or from a hot loop
where even the guarded branch matters. The assertions will still be true then; whether they are still
the *interesting* assertions is `UNKNOWN - verify` until a search exists. Owner: `EPIC-004`.

**2. Whether the predicate's geometry can drift from `generateMoves` — still open, and I did not
close it.** Both the design hop and the dev hop flagged this, QE confirmed it is still open, and it
survives this gate too. The predicate re-derives the two candidate from-squares rather than calling
the generator; it disagreed with `legalMoves` zero times over 81,397 ep-set nodes across three
independent sweeps. That is strong evidence, not proof, and every one of those sweeps walks
*reachable* positions from six roots. **My own third reproduction FEN is an existence proof that the
duplication CAN diverge** — `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` is exactly a shape where
`generateMoves` and `hasLegalEnPassant` disagree — so this is no longer purely hypothetical, it is a
demonstrated divergence confined (so far) to unreachable inputs. Naming the residual, not implying
the property test is total.

**3. Whether `L11` alone deserved a guard, or only in combination.** I pinned it. The argument
against: `L11` alone changes no key and does no damage, because the caller's guard prevents entry —
it is only dangerous once `Z1` or `Z4` joins it, and my first two assertions already kill those. The
argument I acted on: the combination is an ordinary two-step tidy-up rather than a contrived mutant,
each step is individually invisible to 189 tests, and the predicate's own doc comment promises the
position comes back byte-identical — a promise worth one assertion on its own terms. A reviewer who
thinks the third and fourth assertions are redundant has a cheap deletion available and I would not
argue hard against it, though I would point at probe 2 first.

**4. Whether `zobristKey`'s and `hasLegalEnPassant`'s doc comments should have been corrected here.**
`src/legal.ts` says the predicate "leaves the position exactly as it found it" and `src/zobrist.ts`
says the function "transiently mutates". On the invalid-FEN class both sentences are false — the
mutation is permanent. I did **not** edit them: it is a production-file change at a gate that changed
no production code, the defect it would describe is BA/PM's to cut, and a comment that hedges a
guarantee before anyone has ruled on whether the behaviour is intended would prejudge Architect/
Design's call. Flagged here so it is not lost. The honest one-line qualifier is available to whoever
owns the fix.

## Carried, not fixed — each deliberate

- **`ABC-009`** (`legalMoves` mutating its argument) untouched and still reproduces. Independently
  re-confirmed at this gate that the shipped predicate does **not** inherit it.
- **`ABC-010`** (FEN semantic validation) untouched, and it is now the named owner of the input-
  validation row (ASVS V2.1.1 / V2.2.1) and the home this gate points defect 2 at.
- **`ADR-0005` is still `proposed`.** No agent may mark it `accepted` and this gate did not. The code
  it describes is merged on this branch, which means it now describes the tree rather than a proposal
  about it — carried for a human's attention, exactly as the Engineer and QE both carried it, rather
  than treated as self-resolving.
- **`memory-bank/30-architecture.md`'s `Hashing` row** — QE named a content imprecision (the row
  still reads as a self-contained leaf and says nothing about the `legal.ts` edge). I agree with both
  prior roles that the table's *ordering* should not change, and I did not take the one-cell content
  edit either: it is documentation, not risk, and annexing it here would be the scope creep this
  role's own limits forbid. Still named, still unowned by this ticket.
- **The dependency-remediation policy gap** (ASVS V15.1.1 / V15.2.1) is left open with its severity
  deliberately overridden down and its reason stated. Owner: Architect/Design at `EPIC-006`. It would
  have been dishonest to score it as a pass and absurd to let it block this ticket.
- **UAT is DEFERRED, not passed.** No runnable game exists, so there is no surface a human can
  exercise. Marking a UAT passed would be a fabrication; the traceability cell says "deferred" so the
  gap stays visible.
