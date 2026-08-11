---
id: 20260812T102000Z-qe-e2e-decision-flags-and-verdict-8e47b3d5
kind: decision
by: qe-e2e
at: 2026-08-12T10:20:00Z
verified_by:
confidence: high
refs:
  - quality-gate-ABC-017-qe
  - ABC-017
  - ABC-019
  - ABC-027
  - plans/board.md
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - 20260812T082000Z-software-engineer-observation-test-notes-judged-6b40df95
  - 20260812T082500Z-software-engineer-artifact-ref-diff-and-gates-2ea9c7f3
supersedes:
---

# The three flagged judgment calls, each MEASURED not argued — and the verdict

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, and no
> self-attested stamp. The §14 gate machinery does not exist in this repo.

## FLAG 1 — `A9` split into two `it`s. **KEEP IT. Do not revert.**

The Engineer flagged this as his own judgment, not the ticket's, and offered a two-line revert. I
built the merged form out of tree and ran a build that corrupts the caller's `moves` on **every**
render (`WPOP`), which is the shape the masking argument is about — the two renders differ, so the
byte-identical clause fires:

| suite | failures | what `A9` REPORTS |
|---|---|---|
| **delivered (split in two)** | **10** | *"3 plies: expected [ '   1. e4             ', …] to deeply equal [ '   1. e4      e5     ', …]"* **AND** *"1 plies move count: expected +0 to be 1"* |
| split reverted into one `it` | 9 | *"1 plies move count: expected +0 to be 1"* — **only** |

**The merged form loses the byte-identical evidence entirely.** Not delayed — lost: a failing
assertion ends the test, and at the `1 plies` case the two renders happen to agree while the move
count does not, so the loop throws there and the `3 plies` divergence is never reached. A reader of
the merged output cannot tell "the pane is non-deterministic" from "the pane eats the caller's
moves", and on this build those are two different diagnoses of the same bug.

**It is also not really the Engineer's own rule.** `## Test notes` states it as ONE RULE for this
round — *"a clause that states the REQUIREMENT and a clause that acts as a TRIPWIRE do not go in the
same `it`"* — and the ticket **mandates** the split for `A1` and `A13`. Applying it to `A9`, the
third criterion with the same shape, is consistency, and the sweep note names `A9` as having *"the
same silent-precedence shape"* in those words. Cost: two lines and one extra `buildAllCases()` call,
inside the ~35 ms the Engineer already measured against a 650 ms allowance.

**Verdict: correct call, keep as delivered.** No change requested.

## FLAG 2 — `A6`'s `not.toContain(1)`, KEPT against `## Test notes`. **KEEP IT. The Engineer is right, and I can prove it.**

The Engineer's argument was that only the **third** anchor's instance is implied (its `numbersOf` is
pinned exactly two lines above), so the clause is live on the other two. I tested that instead of
accepting it.

First, the cheap checks. Removing the clause from the delivered suite: **734/734, green** — so it is
not load-bearing on the correct build. Re-running `W2` (index-derived move numbers) with and without
it: **killed identically both times, 2 failures, same first message** — so it was not the
discriminator for the one build the acceptance table says `A6` alone catches.

That is where I would have stopped if the Engineer's claim were "it kills something today". It is
not — his claim is that it is **falsifiable in isolation on anchors 1 and 2**. So I built the
build that isolates it: `WPHANTOM`, which emits a stray row numbered `1.` into the blank region
**only** for a white-to-move anchor past fullmove 1, which by construction excludes every other
fixture in the suite.

| suite | `A6`'s verdict on `WPHANTOM` |
|---|---|
| clause **present** (delivered) | **FAILS** — *"expected [ 27, 28, 29, 1 ] to not include 1"* |
| clause **removed** | **PASSES** — no acceptance-table assertion sees it at all |

**`A6`'s `not.toContain(1)` is the sole acceptance-table catcher for at least one wrong build, and
it fired on the SECOND anchor — precisely where the Engineer said it was live.** The reason is
structural: `A6` pins `fromWhite`'s rows 0–2 by text and never pins its `numbersOf`, and rows 3–7 of
that fixture are asserted by nothing else in the project (`A1`/`A2`'s ten lengths do not include it;
only `A10` reads it, for ASCII).

**Verdict: the Engineer judged this correctly and the ticket's `## Test notes` are wrong on this one
item.** `## Test notes` lists it among assertions that *"can never be the discriminator"* and says
*"delete them or move them; do not count them."* Measured, that is true of `A3`'s and `A4`'s
`numbersOf` (deleted, correctly) and of the third anchor's instance — but **not of the loop**, which
covers all three. Keeping it as delivered also keeps the test matching the criterion, which says *"in
none of the three"*. **A one-line correction to `## Test notes` is owed to BA/PM; no criterion
changes and no test changes.**

## FLAG 3 — `HISTORY_COLS` held at 21. **The restraint is RIGHT. The exposure is bigger than recorded.**

**I do not propose widening it, I propose no criterion for it, and I do not re-open `ADR-0010`.**
Every reason on the ticket holds and I checked each: 24 masks the status panel's swing (0/20 stale
frames against 8/20), masking `ABC-027`'s defect is not fixing it, epic `4a` gives the split to the
engineer, and a restraint taken for another ticket's benefit cannot be guarded by a criterion here.
The Engineer's added point — that `A2`'s width clause is a self-comparison of the same shape as
`A11`'s `<= 2 × HISTORY_ROWS` — is correct and is a useful framing for whoever homes the invariant.

**What I measured that changes the size of the problem:** the recorded catcher — the hardcoded slice
offsets in the wide-cell test — covers only the case where the extra columns are inserted **before**
the cells. `WCOLS24M` (number field widened to 7) is **KILLED ×7**, exactly as recorded.
`WCOLS24R` (each row padded on the **right**) leaves the cells at `[6,13)` and `[14,21)` and
**SURVIVES 734/734**. So the exposure is not *narrowly* caught; in the right-padding direction it is
**uncaught, and the failure is silent**.

**Verdict: hold `HISTORY_COLS` at 21 exactly as delivered.** The measurement is carried to the
Orchestrator as evidence for the unhomed Architect question, and to nowhere else. **No
constant-FRAME-width criterion is proposed on this ticket or any other.**

---

# VERDICT: **PASS_WITH_RISKS**

**All 13 criteria are met as written**, on the delivered tree (734/734, lint/typecheck 0, skip 0)
**and on the prospective merge with `ABC-027` (740/740, typecheck 0)**. `A13` is met in full — all
three terms read delivered geometry, the `= 23` tripwire and the `<= 24` requirement are in separate
tests, `src/render.ts` gains no export. D22 and D23 are genuinely closed: I re-ran `WPOS` and
`W9ONCE` rather than trusting the note, and both now die.

**Not `PASS`**, because nine wrong builds survive the whole project and one of them returns **nine
rows** from a pane whose single reason for existing is a constant height. **Not `FAIL`**, because
every survivor is a gap in what the criteria ASK, not a defect in what the Engineer BUILT — the
delivered pane is correct on all of them — and because a `FAIL` here would route to the Engineer,
who has nothing to fix.

**The risks, in the order I would spend on them:**

1. **G1 — the black-to-move anchor with a slid window** (3 survivors, one of them a nine-row pane).
   The only one with a downstream blast radius: it breaks the frame height contract and `A13`
   cannot see it. One fixture and three assertions on `A6` close all three.
2. **G2 — nothing requires the caller to be usable, or the pane to be fresh, after a render**
   (2 survivors + 1 whose only catcher is accidental). Live consumer: `ABC-019`'s loop hands the
   same mutated `GameHistory` object to the pane every frame.
3. **G3 — `A9` guards two of `GameHistory`'s three fields**; `initialFen` is the unguarded one and
   is the field this pane's correctness rests on.
4. **G4 — the importer guard's reach** (2 survivors; one confirms BA/PM, one is new). Criterion is
   right; I would leave it and record the choice.
5. **G5 — the `HISTORY_COLS` self-comparison**, uncaught in the right-padding direction. Unhomed,
   and it stays unhomed.

Plus two record corrections: the **importer count the gate finds is FOUR, not three**, and the
`HISTORY_COLS` exposure's recorded catcher covers one of two directions.

# BOARD MOVE REQUESTED — NOT TAKEN

**`ABC-017`: `In Review` → `In Security/NFR`.** `plans/board.md` is the Orchestrator's and was
**not** written; the ticket frontmatter `column` was not written either, for the same reason.

The QE exit is earned: the ticket is broken-tested, the result and the gaps are reported, and the
criteria gaps are recorded for BA/PM rather than blocking the gate. The Security/NFR gate has real
work waiting for it and it is named on the ticket — `A12`'s three parts on delivered code with the
machine stated, the replay coefficient, and the `src/history.ts` importer re-verification, **whose
answer is FOUR test-file importers and ZERO production importers**.

Consequence if taken, stated not assumed: In Review 2/3 → 1/3 (`ABC-019`), In Security/NFR 0/2 → 1/2
(`ABC-027` having merged at `ca0b448`). **Both inside their WIP limits.**

**Two sequencing facts the Orchestrator needs and could not have had at brief time:**

- **`main` moved during this pass — `ABC-027` merged at `ca0b448`, eight commits past this branch's
  merge base.** A rebase is owed before merge. I measured it: `src/frame.test.ts` **auto-merges
  clean** (the disjoint-range claim holds), `plans/traceability.md` **conflicts** on appended rows,
  and the merged tree is **740/740 with typecheck 0**.
- **The five criteria gaps route to BA/PM, not to the Engineer.** If BA/PM takes G1 and G2, the
  ticket comes back to the Engineer for fixtures only — the pane itself needs no line. **Whether to
  spend that hop before merging third, or to merge and carry the gaps, is the Orchestrator's call
  and I do not make it.**
