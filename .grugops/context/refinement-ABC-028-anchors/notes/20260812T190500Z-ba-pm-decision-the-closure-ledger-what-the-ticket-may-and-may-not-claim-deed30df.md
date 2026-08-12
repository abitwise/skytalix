---
id: 20260812T190500Z-ba-pm-decision-the-closure-ledger-what-the-ticket-may-and-may-not-claim-deed30df
kind: decision
by: ba-pm
at: 2026-08-12T19:05:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-017
  - ABC-028-A2
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-02
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/tickets/ABC-017-bounded-move-history-pane.md
supersedes:
---

# THE CLOSURE LEDGER — and the two live false sites nobody reported, both on this ticket's own page

> Hand-authored `decision`, deliberately **not** a `finding` — see the sibling `observation` for why
> nothing on this hop can carry a stamp.

## The ruling, in the form the ticket now carries it

**`RISK-ABC017-01` is CLOSED for the four keys `A1` and `A5` own, and OPEN for the class.** The ledger
lives in the ticket at `RISK-ABC028-02` because that is where the bound lives, and every other sentence
on the page about *"the sharing"* is now subordinate to it.

**MAY claim:** the three cache keys named by criteria (`length`, `+ last 1`, `+ last 2`) die in the
file that owns the property, with the nfr file **not loaded at all**; for those keys the rebuild is
genuinely free (`3 / 2 / 1` failures, every one in `src/history-pane.test.ts`); the accident is no
longer the sole guard for any key any criterion names.

**MAY NOT claim:** that the class is closed; that the sharing is free to remove **in any wording, tense
or implicature**; that the risk is *"small and bounded"*. The bound's own form says why — *unbounded
for every class without an owned guard* — and the axis is infinite, so there is **always** a next class
without one. **A ledger that runs out of rungs has stopped measuring.**

## The rule that is meant to stop the sixth occurrence

**Any sentence — on the ticket page, in the file comment, or in a context note — that says the sharing
may be removed MUST NAME THE KEYS IT IS TRUE OF.** *"Freely"*, *"nothing is lost"*, *"no longer
load-bearing"* and *"the class is closed"* are **forbidden formulations** on this subject.

That is not a style preference. **All five prior occurrences took the identical shape — a measurement
that was real but narrower than the generalisation drawn from it** — and four of the five were written
by someone who had just measured something true. A rule about *evidence* would not have caught any of
them, because the evidence was fine every time. **A rule about the SENTENCE is the only one that
bites**, and it is checkable by grep, which is what let me find the two sites below.

## The two live sites nobody reported — found by grepping the page for the SHAPE

I was sent to fix six stale line numbers. I grepped for the pattern instead and found two live
statements of it, neither dated, neither attributed, both now corrected:

- **`## Out of scope`** — *"Tidying `A11`'s fixtures to per-test. **`A2` establishes that it *may* be
  done**; it does not ask for it."* **`A2` establishes no such thing.** The fence itself does not move
  — the tidy-up is still forbidden — but its REASON was false, and **a fence standing on a false
  reason falls the moment somebody checks the reason.** It now stands on the measurement.
- **The header's `RISK-ABC017-01` text-half ruling** — *"That sentence is FALSE today — and `A2` below
  **makes it TRUE** rather than correcting it."* **It does not.** `ABC-017`'s sentence is *"`A11` may
  be tidied to per-test fixtures **freely** and **nothing** is lost"*, a statement about the class;
  the gap is closed for four keys of an infinite axis. **This is the ticket's whole strategy sentence
  — *close the gap instead of editing the merged text* — and it was the eighth instance of the defect
  it was written to avoid.**

**What the strategy DID buy, and it is most of the win:** the **file-comment** site — the one a later
engineer actually reads before tidying — was made true by construction and then repaired to say only
what is true. **That site is closed.**

## The residual this leaves, re-homed rather than absorbed

`ABC-017` is `Done`. Its two sites (`plans/tickets/ABC-017-bounded-move-history-pane.md:45` and
`:941-942`, read at source at this hop) are **still FALSE** and **this ticket may not edit them** —
`## Out of scope`'s first bullet forbids it and that fence is upheld, not weakened. The obligation is
re-homed in `## Dependencies`'s standing conditional, whose trigger did **not** fire (this ticket did
land first) but whose consequent is owed anyway, **for a reason the conditional did not anticipate**:
it assumed closing the gap would make the sentence true. **Owner: BA/PM, at whatever hop is licensed
to edit merged text, or a ticket cut for it. No date — latent, and recorded as latent.**

## What I refused, each for a stated reason

- **Adding a row to `A5`'s table for `WCACHE-LAST3`.** It is cheap — one row of data, the mechanism
  exists, well inside `S`. **Refused on principle rather than on cost:** the ticket is built and green
  with all five criteria met, and **re-opening it to chase an infinite axis one rung at a time is the
  per-witness defect `## Test notes` 1 forbids, committed in the extension mechanism instead of in the
  criterion.** Recorded so a later hop can take it on the merits.
- **Minting `RISK-ABC028-04` for `WCACHE-LAST3`.** A risk id per rung is the same defect wearing a
  number. The class's home is `RISK-ABC028-02`; `WCACHE-LAST3` is recorded there as its deepest known
  live witness.
- **Editing `ABC-017`, `ABC-029`, `ABC-019`, any ADR, `plans/nfr-catalog.md` or `plans/board.md`.**
  Not opened.
- **Rewriting dated, attributed blocks to carry the new line numbers.** Falsifying a dated measurement
  is the one thing this page has consistently got right; I did not start.
