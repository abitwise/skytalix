---
id: 20260818T003400Z-qe-e2e-claim-n8-lane-instrument-which-method-is-sound-1d6f30ab
kind: claim
by: qe-e2e
at: 2026-08-18T00:34:00Z
verified_by:
confidence: medium
refs:
  - ABC-077
  - ABC-032
  - N8-LANE
  - NFR-008
supersedes:
---

# Which `N8-LANE` method is sound? **The rule is. The two hops disagreed about the machine, not about the instrument.**

Asked because `ABC-077`'s hop read a **−0.04%** null control and was admissible, while `ABC-032`'s hop read **2.8%** on the same bar and was inadmissible. Recorded as a `claim` at `medium` confidence: I re-ran the instrument here but I did not re-run either of their harnesses, and one number below I cannot account for.

## The rule already decides it, and it decided both cases correctly

`plans/nfr-catalog.md` § the standing per-ticket lane bar: *"Admissible only with an identity null control … reading ≤ 1.5% CPU with its sign at chance."* That is a **self-check on the measurement session**, not a property of the ticket.

- `ABC-032`'s 2.8% is **above 1.5%** → inadmissible. The rule worked: it refused a reading taken on too noisy a machine.
- `ABC-077`'s −0.04% at 4/8 is **inside 1.5% with the sign at chance** → admissible. The rule worked again.

**So neither method is unsound and the instrument is not broken.** It is load-sensitive by construction — a 5% question asked of a 12-second quantity — and the null control is precisely the device that tells you when the machine is too noisy to ask it. Two hops, one rule, two different machines, two correct outcomes. **There is no contradiction to resolve, and the live question about the instrument should be closed rather than re-litigated per ticket.**

## Three caveats, and the third is the one worth chasing

1. **The catalog specifies TREE-pairing** — *"a `cmp`-verified byte-identical second tree, run as its own condition in the same interleaved harness"*. The `ABC-077` hop used **run-pairing** and disclosed it; so did I. That deviation is not ruled on anywhere I can find, and it is Architect/Design's to accept or refuse. If it is refused, **both** this hop's reading and the delivery hop's fall, and they fall together.
2. **The catalog's own recorded null floors are −0.43%, −0.52%, −1.26% at 3/8** and BA/PM's quieter session read ±0.1% at 4/8. **My null here was −0.72% at 3/8** — squarely in that documented band, on a machine at load 2.5–5.0.
3. **`ABC-077`'s −0.04% null, taken at load average 24.77 on 8 cores, is anomalously clean** — an order of magnitude better than every other null on the record, including the ones taken on quiet machines. A heavily loaded machine producing the best null ever recorded on this instrument is the wrong direction for noise to move. **I am not calling it wrong; I could not reproduce it and I did not re-run his harness.** I am flagging it as the one number in the `ABC-077` lane package that does not sit with the others, and recommending that whoever rules on caveat 1 look at it at the same time.

**None of this changes the conclusion for `ABC-077`.** His 465 ms net and my 155 ms net for QE's file both sit far inside the 650 ms bar, and the bar would still be met at several times the plausible measurement error.
