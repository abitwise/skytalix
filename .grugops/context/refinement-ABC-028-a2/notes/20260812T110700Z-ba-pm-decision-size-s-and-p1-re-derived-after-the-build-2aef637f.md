---
id: 20260812T110700Z-ba-pm-decision-size-s-and-p1-re-derived-after-the-build-2aef637f
kind: decision
by: ba-pm
at: 2026-08-12T11:07:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-019
  - ABC-024
  - ABC-026
  - ABC-029
  - RISK-ABC028-02
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# `S` (2) and `P1` RE-DERIVED — both hold, and `P1`'s ORIGINAL BASIS IS DISCHARGED

> **Hand-authored, no stamp.** Nothing here is a `finding`.

**This is the first re-derivation taken AFTER the build**, so for the first time the numbers can be
checked against what the work actually cost instead of against what it was predicted to cost.

## `S` (2) HOLDS — and it is now the easiest of the three re-derivations to defend

The build landed at **zero production lines** in the two files that already existed:
`src/history-pane.test.ts` **+365 / −0, a pure append** (pre-existing 607 lines verified
byte-identical to `HEAD`), `src/history-pane.nfr.test.ts` **+15 / −7, comment-only, one hunk, every
changed line beginning `//`**. Zero new files, modules, imports or dependencies; file count 26;
`package.json` / `package-lock.json` byte-unchanged; `src/history-pane.ts` md5 `54fd4346…`
unchanged. **The predicted shape and the delivered shape match item for item.** `ABC-024` (`S`)
remains the closest calibration.

**This hop's own ruling adds NO build work**, so nothing in the size moves on account of it.

## The counterweight, which was genuinely live and nearly went the other way

**Had I ruled that `A2` needs a standing in-tree guard**, the only closure with real merit is
landing `WCACHE-LEN` in-tree as a mutant fixture — **a mutation-testing harness this project has
never adopted, with unpriced lane cost while `ABC-026` actively disputes the lane total.** **That is
an `M` at least, and it would have routed the ticket BACK to the Engineer rather than forward to
QE.**

**I refused it on VALUE — the property is guarded by `A1` and independent by construction — NOT on
size**, and the refusal is priced in the ticket so a later hop can overturn it on the merits rather
than rediscover it. **Stating this is the anti-smoothing check on my own size field:** the cheap
answer and the correct answer happened to agree here, and that is exactly when it is worth writing
down why.

`SPLIT_REQUIRED` does not fire — it bites at `XL` (8), this is 2.

## `P1` HOLDS AS RECORDED — and its ORIGINAL BASIS IS DISCHARGED, which is the honest part

**The `P1` came from a DATED TRIGGER**: the comment at `src/history-pane.nfr.test.ts:106-112` was a
live, signed, measured-sounding invitation to delete the sole catcher for `WCACHE-LEN`, and the next
hop into that file was named and imminent.

**`A2` has now edited that comment. The trap is defused, `A1` is landed, the sharing genuinely is no
longer load-bearing. THE HAZARD THIS TICKET'S `P1` PRICED IS GONE — because this ticket removed
it.**

- **Not `P0`.** Nothing is broken; the pane is correct on all twelve wrong builds constructed
  against it; md5 unchanged; no consumer observes any of it.
- **The `P0` waiting behind it is STILL not a reason.** `ABC-019` (`P0`) and `ABC-029` (`P1`) both
  sit behind this ticket. **This ticket's own prior hop ruled that queue pressure is not severity**
  — *"Priority ranks the work; it does not rank the queue behind it"* — **and that ruling binds me
  in the direction that inconveniences me. I did not use it to hold `P1`.**
- **On SEVERITY ALONE, a ticket cut TODAY for what remains would be `P2`.** The residual is
  `RISK-ABC028-02`, a latent hazard with **no date**, of exactly the shape `ABC-024` and `ABC-026`
  are the `P2` calibration for. **That is stated as the falsifiable half of this derivation.**
- **`P1` nonetheless holds, because the field no longer ranks anything that is left.** Priority
  ranks **unstarted work for pull order**, and this work is built and green. Re-ranking a built
  ticket downward by what it would be worth unbuilt would mean **every ticket's priority collapses
  the moment it is delivered** — inverting the board's pull order and stranding finished work behind
  unstarted work. The remaining transitions (review, gate) are not priced by priority.

**The falsifiable statement this leaves, which is more use than a bare "P1 holds": if this ticket
were ever returned to `Backlog` unbuilt, it should be re-cut at `P2`, not `P1`** — because the dated
trigger that earned the `P1` would have been discharged by `A2` on the way. **If a reader disagrees,
that is the sentence to dispute.**

## Definition of Ready — ONE item re-checked, NOT a re-score

The DoR is a `Backlog → Ready` gate and this ticket is past it. **The 10-of-10 is not re-opened.**
One item is re-checked because **this hop edited a criterion**, and a criterion edit is what item 4
scores.

**Item 4 (`✅` holds, for a BETTER reason than before).** `A2` previously scored `✅` on a `Given`
**no build could satisfy** — **the score was clean because nobody had tried to discharge it.** That
is the defect class this ticket exists to catch, found in this ticket's own acceptance section, at
the fifth reading, by the hop that built it. As repaired, `A2` names two runnable configurations,
exact verdicts for two named builds in each, an md5 for the comment half, and a home for the
evidence. **It is now testable in the sense the DoR means: somebody can run it and get a verdict.**

**Item 3 (`⚠️`, INVEST *independent*) unchanged in score, improved in fact** — the shared-file touch
has happened, is one comment-only hunk, and is verified mechanically; the `⚠️` stays because the
file is still shared with `ABC-029`.

**No other item was re-assessed, and none is claimed to have been.**
