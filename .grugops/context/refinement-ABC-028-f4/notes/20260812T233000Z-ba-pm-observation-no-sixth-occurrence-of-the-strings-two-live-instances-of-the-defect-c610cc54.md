---
id: 20260812T233000Z-ba-pm-observation-no-sixth-occurrence-of-the-strings-two-live-instances-of-the-defect-c610cc54
kind: observation
by: ba-pm
at: 2026-08-12T23:30:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-02
  - src/history-pane.nfr.test.ts
  - src/history-pane.test.ts
supersedes:
---

# NO sixth occurrence of the four banned strings — and TWO live instances of the defect they were banned for, both in `src/`, both invisible to the ban

**QE's positive finding reproduces on my tip and I am not weakening it:** `src/` contains **zero**
occurrences of *"freely"*, *"nothing is lost"*, *"no longer load-bearing"* or *"the class is closed"*,
and all **15** occurrences on the ticket page are quotations, strikes, the rule itself, explicit
negations, or a different subject.

**So I searched for the DEFECT instead of for the STRINGS** — *a sentence claiming more than what was
measured* — and found two live instances. **Both are in `src/`, the region the census calls clean.**

## Instance 1 — three suite totals that went stale ONE HOP after being discharged

`grep -n 'fails exactly 2 of' src/history-pane.nfr.test.ts` → **`:115`**

> *"…fails exactly 2 of **752** … while `src/history-pane.test.ts` ALONE passes **26/26** on it, and
> rebuilding these fixtures per test takes the whole suite to **752/752** GREEN."*

- **Measured here: the suite is `755 passed (755)` on 26 files.** The three `752`s are stale.
- **Moved by `ABC-029`'s `7084c5e`** (`+153 / −0` in this same file, `+3 it`), landed **after** QE's
  gate. **Nothing `ABC-028` did.**
- **`26/26` is still exact** — re-measured here.
- **The numerator — *"fails exactly 2"* — was NOT re-measured at this hop. I built no mutant.
  `UNKNOWN - verify`.**

**Why it matters more than an off-by-three:** these three numbers were *"re-run rather than
transcribed"* at `refinement-ABC-028-anchors` and re-verified by QE at the gate. **The most carefully
measured sentence on this ticket went stale in one hop, without anybody writing anything untrue.**
That is `F2`'s case in `src/` rather than in a criterion, and it is why the repair is *state the
SHAPE*, not *refresh the total*.

## Instance 2 — a reassurance that outruns its own measurement

`grep -n 'it is the axis being infinite' src/history-pane.test.ts` → **`:1014`**

> *"And the class is infinite: a cache keyed on the last THREE identities survives both rows below.
> **That is not a hole to be alarmed by, it is the axis being infinite; what matters is that the next
> member costs a row.**"*

- ***"The next member costs a row"* is TRUE** — QE built that row (`preservedTail: 3`), ran it, and
  killed `WCACHE-LAST3` with it.
- **The reassurance it carries is false past `preservedTail` 15**, which is exactly `A5`'s domain
  (`F1`). At 16 the row is not merely weak; it goes **RED on the delivered pane**.
- **It is the same shape as the five occurrences: a measurement that is real, and a generalisation
  drawn from it that is wider.** Stated in the vocabulary of the struck ledger sentence, one file away
  from it.

## What this pair decides

**Neither instance contains any of the four banned strings.** A `grep`-based gate on those strings
would return **117 false positives and both of these as false negatives**. That is the whole case for
demoting the blacklist to an example list and keeping the enumerating half as the rule — see the
`decision` note on `F4`.

## What I did with them: nothing, and here is why

- **`src/` is fenced for this hop — I may read it and write nothing there.** Both instances are in
  `src/`. **Neither is repaired.**
- **Neither is a criterion gap.** Instance 1 is a discharged one-time obligation whose subject moved
  under it; instance 2 is a design comment, not an assertion. **`A5` is MET on both readings.**
- **Both are recorded on the ticket page with the `grep` that re-finds them**, and instance 1 carries a
  forward instruction rather than a repair order: *whoever next edits that block replaces the totals
  with the SHAPE rather than refreshing them.* **Refreshing `752` to `755` buys one hop of accuracy and
  re-arms the same defect.**
- **Owner: whoever next opens either block under a criterion that reaches it.** No date: latent, and
  recorded as latent.
