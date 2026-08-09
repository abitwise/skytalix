---
id: 20260809T131400Z-security-nfr-decision-b67fabe0
kind: decision
by: security-nfr
at: 2026-08-09T13:14:00Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - ABC-010
  - ABC-022
  - A10
  - NFR-001
  - NFR-005
  - src/moves.ts
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - agent-factory/checklists/security-nfr-checklist.md
  - agent-factory/workflows/04-ticket-to-pr.md
supersedes: 
---

# The `In Security/NFR` exit: **PASS WITH RISKS**. `ABC-009` → `Ready for UAT`.

Gated against `security.asvs_level` **L1** and `security.block_on` **high**. `compliance_regime` is
**`[]`**, so **no Compliance Officer hand-off is owed** — recorded rather than silently omitted.
**No required fix is outstanding and no high-severity item exists to block on.** **Nothing merged and
nothing deployed — a human holds both, and the owner's standing merge authority is not deploy
authority.**

## 1. `NFR-001` / `A10` — MET on both clauses, re-derived, nothing inherited

Floor **6,030,518 / 6,136,238 / 6,117,496 nodes/sec** against ≥ 1,000,000 — MET, ~6.1x. Aggregate
ratio **1.0062 and 0.9967** against ≥ 0.98 on two independent samples — MET, worst single cell 0.9863.
Deep lane **32/32 exact in 38.49 s**. Figures, protocol and the one place this gate reads lower than
the Engineer (a single run 0.16% under the standing band) are in the companion notes.

## 2. THE RULING ON THE ENGINEER'S ±1% REASONING: it HOLDS, the estimate is OPTIMISTIC, and it was not the end of the road

**The reasoning holds.** Calibrating against cells whose true delta is provably zero, plus a
byte-identical twin, is the strongest null control available, and *"no per-cell number is claimable"*
is the correct conclusion from it. An honest "the instrument cannot resolve this" **is** a result and
it is not treated here as a failure.

**Three things are added, and one of them is a correction.**

- **The floor is bigger than reported.** This gate measures **±2.0% per cell** (twin, position-5)
  against their ~±1%, and characterises an **AGGREGATE** floor nobody had: the twin reads **+0.96% /
  +0.87%**, and three of the four aggregate twin readings across both gates sit near **+0.9%** — a
  *systematic*, not scatter, which this gate **cannot attribute**. The bar's margin is 2 points, so
  *"the margin is larger than the resolution"* holds by about **2x**, not comfortably.
- **One wording overshoot, named because it is the difference between a bound and a claim.**
  *"kiwipete's 0.9930 is NOT a regression"* is stronger than a noise-floor argument can license — a
  floor supports only *"the instrument cannot resolve whether it is one."* Their note also states the
  correct form (*"no per-cell regression or improvement is claimed"*), so this is an internal
  inconsistency in phrasing, not a false result.
- **The question is resolvable, and it is now resolved — in the change's favour.** Moving it off the
  clock and onto a **count** (the move this catalog already made for `NFR-005`'s call-count sub-bar):
  the two added lines execute **396,350 times** over the whole sweep and **reject nothing, ever**
  (0 failures in 198,175 executions each); isolated on `addCastlingMoves` they cost **+1.30 / +1.73 ns
  per call** on startpos against a **±0.22 ns** null floor. The arithmetic — labelled arithmetic —
  puts the whole change at **0.0070%–0.0091%** of the sweep, a true ratio of **≈ 0.9999**, and
  **kiwipete's true ratio at ≈ 0.9998**. Robust to a 10x error in the multiplier.

**So the Engineer's conclusion is not merely unrefuted; it is positively established.** kiwipete did
not regress. **Rejected alternative:** report "unresolvable" and stop, as the hand-off invited. It
was the honest floor, not the ceiling — and a gate that can convert a noise-limited question into an
exact one owes that work rather than inheriting the limitation.

## 3. THE RULING ON GUARD ORDERING, routed here by QE as gate-unverifiable

**The behaviour half is DISCHARGED, not carried. The ordering of the five guards is NOT load-bearing,
and no later reorder can silently break the equivalence QE's `G-1`/`G-2` analysis relied on.**

- **Structurally:** the five guards are a **conjunction of side-effect-free predicates over an
  unmutated position**, ANDed by `continue`. Verified rather than assumed — `isSquareAttackedBy` and
  `raySliderAttacks` perform **no writes** (checked at the source), `board` is a `readonly
  Uint8Array(128)`, and every index the frozen `CastleOption` table names (0, 7, 112, 119 and the
  `empty`/`kingPath` members) is in bounds, so **no guard depends on an earlier one for safety**. A
  conjunction's value is permutation-invariant, so the emitted move set is identical under **any** of
  the 120 orderings.
- **Measured, not merely argued:** three reorderings × **33 FENs** (all twelve leaking rows across the
  three families, the four legal castles, both over-rejection controls, QE's `G-1` queen FEN and
  `G-2` two-rights FEN, all six perft roots) = **99 comparisons, ZERO divergence** at `generateMoves`,
  at `legalMoves`, and on purity — plus **all six exact perft counts hold for every variant**.
- **QE's mechanism is sound but stronger than its conclusion needs.** *"`option.empty` is tested
  before the through-check"* is true; the conclusion only needs *"an option is emitted only if all
  five hold, so `empty` has passed whenever a castle is emitted."* **Restated as a conjunction the
  argument is reorder-proof**, and that restatement is the durable form. It costs nothing and it is
  the answer to *"could a later reorder break this."* No.

**The cost half is real, and it lives entirely on the class this ticket exists for.** Measured: on
the invalid position `4k3/8/8/8/8/8/8/K7 w KQ - 0 1`, `addCastlingMoves` costs **522–526 ns** pre-fix
and **27.9–28.1 ns** delivered — the byte compare rejects before the attack scan, an **~18x** saving;
moving the guards below the through-check gives **all of it back (+481 ns)**. So the Engineer's
rationale is correct and is now measured rather than resting on reading.

**But its stated reason is inverted for the population `NFR-001` measures, and this is the one place
this gate disagrees with the Engineer.** The comment reasons from **per-test cost** (*"a byte compare
is cheaper than an emptiness scan"*). The right criterion for ordering a conjunction is **cost against
selectivity**, and measured over the perft sweep the two added guards are **0.0% selective** (0
rejects in 198,175 executions each) while `empty` rejects **17.6%** and the through-check **14.1%** of
what reaches them. A 0%-selective test can never save work; it can only add. In exact executions the
delivered order is the **second-most-expensive of the four**: above-right 1,284,772 > **delivered
396,350** > below-empty 326,476 > below-through 280,302.

**NO CHANGE IS ASKED FOR.** The penalty is ~116,048 executions ≈ **0.003%** of the sweep — far below
resolution — the invalid-class benefit is real and points the other way, and churning a correct guard
for it is the refactor coding rules 5, 9 and 10 forbid. **The sharper reason is recorded so the next
reader inherits it:** the placement earns its keep not because a byte compare is cheap, but because
sitting **above the attack scan** it avoids an 18x cost on exactly the malformed input it exists to
reject.

**Residual, and it is genuinely low:** nothing pins the ordering and **nothing can** — invariance means
no test could ever fail on a reorder. It rests on the code comment, which is the honest place for it.

## 4. SECURITY CLASSIFICATION — **RELIABILITY, NOT SECURITY.** Re-asked at the source; no trigger manufactured.

The 2026-07-29 audit and `ABC-022` both classed this class reliability. That answer was **re-derived
here rather than carried**, with evidence rather than a reading:

- **No injection sink.** Zero `eval` / `new Function` / `vm` / `require`, zero `child_process` /
  `exec` / `spawn`, zero HTML / XML / SQL / URL / `fetch` sinks, zero `node:net|tls|http|https|dgram`
  imports anywhere in non-test `src/` — each grepped, not assumed. So V1.2.1–V1.2.5, V1.3.1, V1.3.2
  and V1.5.1 are **not engaged**, on evidence.
- **No trust boundary.** `addCastlingMoves` is **module-private** (not in `moves.ts`'s export list);
  its only caller is `generateMoves`; `generateMoves`'s only non-test caller is `legalMoves`
  (`src/legal.ts:46`). **No `process.argv`, `process.stdin`, `readFileSync` or `process.env` appears
  in `src/moves.ts` at all.** Positions enter only through `parseFen`, whose non-test callers are
  `history.ts` (`newGame` / `resetTo` / replay) and `perft-bench.ts` (hardcoded FENs). **No
  user-supplied string reaches `src/moves.ts`**, and there is no CLI entry point (`AGENTS.md`
  *Dev / run* is `UNKNOWN - verify`).
- **No privilege, no data exposure, no secrets, no personal data, no authn/authz, no network, no
  crypto used as a security control** (Zobrist keys are a transposition-table device, not a
  primitive; `node:crypto` is not imported in non-test `src/`).
- **QE's queen-destroying result does not change the class.** It is a worse **reliability**
  consequence — silent material loss and a piece-type change — and it is a consequence of a **mutant**
  that was never shipped, not of the delivered code. Same call the correction block made for family 2.
- **The one security-adjacent question this change genuinely touches was asked and it comes out in the
  change's favour:** a DoS-shaped cost on malformed input. Measured — the delivered guard order makes
  an invalid position **~18x CHEAPER** in this function. The change **strictly improves** the only
  such property it touches. Recorded so nobody has to wonder whether it was asked.

**ASVS L1 counted at the source: 70 active requirements, and V16 and V17 carry NO L1 requirement at
all** (29 rows between them, zero at L1) — checked, not assumed. Engaged: **V2.1.1 PASS** (`## Scope`
and `## Security / NFR triggers` are the documented validation rule, now with a measurable bar and the
rule stated as *"the moving side's `KING` byte and no other"*); **V2.2.1 PASS on this module** — the
two guards are positive validation against an expected structure, an allow-list of exactly one byte
value per square, and identity-over-occupancy is precisely that requirement's shape — **with the
boundary half still open and owned** (`ABC-010` still accepts the invalid FEN; this ticket makes the
query honest, it does not make the input legal, and that is by design); **V2.2.2 PASS by analogue** —
the guard sits in the rules core at the generator layer, so no caller is trusted to pre-validate,
which is exactly why the `legalMoves`-layer filter was rejected; **V2.3.1 PASS by analogue**, the
closest row to the routed ordering question — the five steps cannot be skipped by reordering, proved
above; **V5.2.1 PASS by analogue** — a `Position` is a fixed 128 bytes with no length dimension, and
the malformed-input cost moved 18x in the safe direction; **V15.3.1 PASS by analogue**.
**V15.1.1 / V15.2.1 NOT MET**, carried with the standing high→low override and its evidence re-checked
here (runtime `dependencies` is `{}`, and `package.json` / `package-lock.json` are byte-identical to
`main` on this branch), owner Architect/Design at `EPIC-006`. **V13.4.1 DEFERRED**, unchanged and not
relaxed. **V7 session management is N/A and is named rather than skipped** because the keyword matches
the queue's "claim/session" vocabulary. Everything else is structurally N/A.

## 5. Logging and failure modes — looked for, and the honest finding is that there is nothing to log

`src/moves.ts` logs nothing, and the **only** logging anywhere in non-test `src/` is
`perft-bench.ts`'s `console.log` (the CLI harness). A failure mode with no log is normally exactly
what this gate flags. **It does not apply here, and the reason is the ticket's whole point:** this
defect was silent by construction, and the fix **eliminates the failure** rather than instrumenting
it — the illegal move is no longer offered, so there is no later incident to diagnose. **No logging is
asked for** (coding rules 5 and 8), and adding a warn on an impossible branch would be the
impossible-scenario handling rule 8 forbids.

## 6. The risks carried, each with a severity and a NAMED OWNER

None is high, so none blocks under `security.block_on: high`.

1. **`G-1` and `G-2` are closed in TESTS but not in the criteria — owner BA/PM, MEDIUM.** Carried from
   QE unchanged and **deliberately not discharged here**: `## Acceptance` is BA/PM's and this gate did
   not touch it. Behaviour is pinned so a regression is caught; the *specification* still is not.
2. **`A7` discriminated nothing across 62 mutants — owner BA/PM, LOW.** Carried.
3. **The pre-existing castling-right test is guarded in the default lane only by QE's new rows, and
   otherwise by a 40-second opt-in lane — owner BA/PM or Architect, LOW.** Carried; not charged
   against `ABC-009`.
4. **Guard ordering — owner Architect/Design at `ABC-010` / `EPIC-003`, LOW. RESHAPED, not carried
   as received.** The behaviour half is discharged (permutation-invariant, measured). What remains is
   that nothing pins the ordering and nothing can, and that **if user FENs are ever admitted**, a
   reorder below the through-check restores an 18x cost on malformed input. No fix asked for.
5. **`NFR-001` per-cell figures are noise and must never be quoted — owner Security/NFR, LOW.** The
   floor is ±2% per cell and ~±1% aggregate, worse than the record said; the **tenth**
   instrument-limit correction on this project. Only the aggregate against 0.98 is load-bearing, and
   the true value is now known by count.
6. **`NFR-001` has no guard in the suite — owner Security/NFR at `EPIC-004`, LOW.** No wall-clock
   assertion belongs in the suite (standing rule, `src/zobrist.nfr.test.ts:112`), so this bar rests on
   the catalog and these notes. Standing and unchanged; a call-count assertion of the kind
   `zobrist.nfr.test.ts` carries would be possible here but is **not asked for** — the measured cost
   is 0.01% and there is no budget an assertion could defend.
7. **`ABC-010` is unbuilt, so the invalid FEN is still ACCEPTED at the boundary — owner `ABC-010`,
   LOW.** By design and stated in `## Out of scope`. V2.2.1's boundary half.
8. **`ABC-022` half (b) is live BY DESIGN — severity NONE.** Fenced, not tested here, not a miss.
9. **`A1`–`A10` plus QE's rows is still not PROVEN complete — owner QE/BA-PM.** Nine equivalent
   survivors stand on an enumerated corpus, not the position space. Carried open.
10. **Test-integrity checker exit 2 is an ERROR, not a pass; E2E and the auto-UAT oracles are
    `UNKNOWN - verify` — human-owned.** None of the three is reported as green.

## 7. The board move — the one this role owns

`ABC-009` moves **`In Security/NFR` → `Ready for UAT`**. `In Security/NFR` **1/2 → 0/2**,
`Ready for UAT` **0/4 → 1/4**. No limit approached, no override taken, no written reason owed.

**UAT is recorded as DEFERRED and explicitly NOT passed**, ruled on this ticket's own evidence: there
is no CLI entry point and no runnable game until `EPIC-006`, so there is no surface a human can
exercise and a UAT pass would be a fabrication. What a human must eventually check is named in the
UAT cell rather than left implicit.

## What this decision does NOT establish

- **That the criteria are complete.** Not this gate's, and not discharged here.
- **A terminal Workflow 05 verdict.** `READY_FOR_HUMAN_REVIEW` is the gate's to emit and no §14 gate
  exists in this install. **No `finding` was written and nothing is self-stamped.**
- **Anything about `ABC-010` or `ABC-022`.** Neither was edited; neither was run.
- **That non-M3 hardware behaves the same.** `UNKNOWN - verify`.
