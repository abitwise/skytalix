---
id: 20260812T233500Z-ba-pm-decision-f5-the-closing-sentence-is-struck-and-the-residual-is-priced-52727822
kind: decision
by: ba-pm
at: 2026-08-12T23:35:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A5
  - ABC-017-A14
  - RISK-ABC017-01
  - RISK-ABC028-02
  - RISK-ABC028-03
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# `F5` RULED: the ledger's closing sentence **does not stand**. It is struck, and the residual is written as a number — thirteen rows plus a tail nobody has priced

## The sentence

> *"…the axis is infinite, so there is **always** a next class without one. **A ledger that runs out of
> rungs is a ledger that has stopped measuring.**"*

**QE disputed a sentence, not a risk, and drew the distinction exactly:** *"I am not disputing the
refusal to add it here; I am disputing the sentence that makes the refusal look INEVITABLE rather than
CHOSEN."* **I adopt that in full. It is the same defect class as `F4` and as the five occurrences: a
sentence claiming more than what was measured** — and this one claims it in the direction that keeps
the accident load-bearing.

## The replacement, with two corrections to QE's own figure — both in QE's direction

**The axis is infinite in KEYS. What this project can DO about it is finite and priced. The two must
not be run together into one sentence, because the first is what makes the second look pointless.**

1. **Every rung is caught TODAY** — rungs 0–2 by owned criteria (`ABC-017 A14` / `ABC-028 A1`,
   `ABC-028 A5` rows 1 and 2), and **every deeper rung by the accidental `toSan` call count** in
   `src/history-pane.nfr.test.ts`. Measured at rungs 0–3: the ledger's own table shows the nfr file
   contributing **exactly two kills at every rung**. The mechanism is **key-independent** — a cache HIT
   calls `toSan` zero times and `A11` re-renders an already-rendered singleton — so it reaches every
   rung. **Reasoned from a measured mechanism, NOT measured past rung 3: `UNKNOWN - verify`.**
   **Both the struck sentence and *"thirteen rungs with no owned guard"* describe rungs 3–15 as
   uncaught. They are not uncaught; they are un-OWNED.** That distinction is `RISK-ABC017-01`'s whole
   subject.
2. **If the accident is removed**, `ABC-028 A5` re-closes rungs **3–15 at one row of pure data each —
   thirteen rows, at a price this ticket has paid three times** (twice landed, once by QE out of tree).
3. **Rungs 16+ cannot be expressed as a row at all** (`F1`'s domain). Whether an edit of a different
   KIND reaches them is **`UNKNOWN - verify`** and nobody has run one. **QE's *"thirteen rows at a
   known price"* prices 3–15 and is silent here — the one place its correction is itself narrower than
   the measurement it rests on.**

## What follows, and it is the point of striking a sentence rather than a risk

**The refusal to buy the rows inside `ABC-028` is now a CHOICE WITH A NUMBER, made in
`## Size and priority` on three grounds that survive without the struck word:**

1. **It changes what the project OWNS, not what the tree CATCHES** — every rung is caught today, so the
   row buys ownership of one rung, not a new kill.
2. **`WCACHE-LAST3` is the least plausible build measured.** `WCACHE-LEN` is what a competent engineer
   writes; `WCACHE-LAST` is what they write after `A1` fails; **nobody keys a cache on the last three
   moves.**
3. **All five criteria are MET and gated. A text hop that lands a row makes itself a build hop**, and
   the ticket would owe a second full gate for one rung of ownership.

**And the refusal is falsifiable, which the struck sentence made impossible: if the `AT_*` fixtures are
ever rebuilt per test, rungs 3–15 stop being caught at all and the thirteen rows fall due.** That is
now the standing obligation under `RISK-ABC028-02`, **with the count** — and it is labelled NOT
ENFORCED, because nothing enforces it.

## What I did NOT do

- **I did not land QE's `preservedTail: 3` row**, and I am not asking the Engineer for it. It works, it
  is cheap, and it is refused **on the merits above** rather than on the sentence that was struck.
- **I did not re-open `RISK-ABC028-03`** or mint a risk id per rung — that is `## Test notes` 1's defect
  wearing a risk number. The class's home is the closure ledger.
- **I did not touch the ledger's `MAY CLAIM` half.** QE's enumeration verified it exhaustively — all
  eight subset keys of reach ≤ 3 built and run, exactly one survivor — and it is the strongest
  verification on this ticket. **Nothing in it needed a word changed.**
