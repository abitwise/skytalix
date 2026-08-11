---
id: 20260812T130000Z-security-nfr-observation-history-cols-re-derived-5d92f6b3
kind: observation
by: security-nfr
at: 2026-08-12T13:00:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-017
  - ABC-017
  - ABC-027
  - ADR-0010
  - src/history-pane.ts
  - 20260812T101500Z-qe-e2e-observation-record-corrections-5c93e2b1
  - 20260812T102000Z-qe-e2e-decision-flags-and-verdict-8e47b3d5
supersedes:
---

# The `HISTORY_COLS` exposure re-derived: QE is right, and it is now WORSE than QE could measure

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`.**
> The brief marked this as one of two figures I must not inherit. I built both mutants myself.

## The measurement

Both builds constructed on the delivered pane, run, and reverted with the md5 asserted after each
restore.

| build | how it reaches 24 columns | QE measured | **this gate measures** |
|---|---|---|---|
| `WCOLS24M` | widens the move-number field — `MOVE_NUMBER_DIGITS = 7` | KILLED ×7 | **KILLED ×7** — identical |
| `WCOLS24R` | pads each row on the RIGHT — `HISTORY_COLS = 24`, whole row `.padEnd(HISTORY_COLS)` | SURVIVED 734/734 | **SURVIVED 740/740** |

`WCOLS24M`'s seven failures are `A2`, `A3`, `A4`, `A5`, `A6`, `A7` and `A11`'s
non-vacuity test — the same set, in the same files.

**QE's correction is CONFIRMED independently, and it is strengthened in the one way QE could not
manage:** QE measured 734/734 on the pre-rebase tree. I measured **740/740 on the rebased tip with
`ABC-027` merged.** So `ABC-027`'s frame-width work — the ticket that actually owns the frame-width
obligation, and whose merge is the reason `HISTORY_COLS` was held at 21 — **does not close this
exposure either.** The six tests `ABC-027` added see nothing.

Verified on the mutant directly: at 24 columns padded right, the cells remain at `[6,13)` and
`[14,21)`, so the hardcoded slice offsets in the wide-cell test are looking at exactly the right
characters and report nothing. The failure is silent.

## An instrument error of mine, recorded rather than quietly fixed

My **first** `WCOLS24R` was malformed and I discarded it. `rowFor` is a concatenation of two
template literals, and appending `.padEnd(HISTORY_COLS)` binds to the **second literal only** —
so the mutant emitted 30-character rows instead of 24 and was killed on 4 tests. That would have
been reported as a refutation of QE if I had stopped there. Rebuilt with the whole expression
parenthesised, verified out-of-band that it emits exactly 24-character rows with the cells still at
`[6,13)` / `[14,21)`, and only then run. **The kill I first saw was my mutant's bug, not the
suite's strength.**

## Disposition — HELD, and deliberately NOT escalated

`HISTORY_COLS` **holds at 21.** I propose no widening, I propose no criterion on this ticket or any
other, I propose no constant-FRAME-width criterion (`ADR-0010` cl. 5 refuses it and `W` varies by
design), and I have **not re-opened `ADR-0009` or `ADR-0010`** — both read, both `accepted`, neither
touched. The brief's boundary is exact and I am inside it: **measurement is welcome, a proposal is
not.**

Every reason on the ticket and in QE's flag 3 holds and I checked them rather than restating them:
24 was measured at `ADR-0010` to **mask** the status panel's swing (0/20 stale frames against 8/20),
masking another ticket's defect is not fixing it, epic acceptance `4a` gives the exact split to the
engineer, and a restraint taken for another ticket's benefit cannot be guarded by a criterion here.

**What I add is one fact for whoever eventually homes the invariant:** the exposure is not merely
uncaught by this ticket's criteria — it is uncaught by the **whole project at 740 tests, including
the ticket that owns frame width.** It remains an unhomed Architect/Design question and **it stays
unhomed this hop.** It is carried to the Orchestrator as evidence and to nowhere else.

**This is not a merge blocker.** The delivered pane is correct: `HISTORY_COLS` is 21, every row is
21 characters, and the exposure is a guard gap against a hypothetical future edit, not a defect in
what was built.
