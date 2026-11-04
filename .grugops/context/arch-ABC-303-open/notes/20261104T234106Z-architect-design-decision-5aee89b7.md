---
id: 20261104T234106Z-architect-design-decision-5aee89b7
kind: decision
by: architect-design
at: 2026-11-04T23:41:06Z
verified_by: 
confidence: high on items 4, 5 and 6: the records and the arithmetic decide them; medium on item 3: a ruling on a gap, its weak point stated; UNKNOWN - verify on P4's reach over a fitted evaluation
refs:
  - ABC-303
  - ABC-301
  - ABC-282
  - ABC-289
  - ADR-0056
  - ADR-0072
  - ADR-0073
  - ADR-0063
  - ADR-0028
  - NFR-009
  - R-BUNDLE-1
  - orch-2026-10-30a/20261104T222400Z-orchestrator-decision-3c67d3c4
  - arch-owner-answers-1104b/20261104T220311Z-architect-design-decision-d776c0f0
supersedes: 
seal: sha256:3a90d02c5938e4a38d6822ad4cb851327e392de5454a61ed886c118d74aaa4d9
---

# arch-ABC-303-open items 3–6: a candidate fault voids the read and one new C2′ follows only if the fault could have decided it; S′'s E is the E in force at the seal; the order stands; `NFR-009`'s sum owes two terms in two places

Lines of record: `ADR-0056` § the dated block of this task, and dated lines in `ADR-0073` d7 and `ADR-0063` § Consequences. Nothing was run for these items. A correction first: `…84f9bae1` says "a door four changes old". The door is six switches behind the shipped path: the skip, history, SEE ordering, aspiration, P4 and the countermove. Nothing else in that note changes.

**Item 3, `ABC-303` § Open 1. The records did not settle it; this ruling does, with its weak point stated.**
- **What the texts give.** C-1 and C-2: no pass with a candidate fault or a candidate loss on time. The block: "a defect", beside NOT MET. B4: never re-played. `…d776c0f0` § 6: no such line.
- **The principle.** "Never re-played" stops a second draw after a score is seen. So nothing here may depend on liking the score.
- **The rule, C2′ and S′.** A faulted read has no pass at any score, and its score is not kept. Verdict test first: count each game lost by fault or on time as a win. Still under the bar: NOT MET, final. Otherwise: a defect, no verdict; cause named and reproduced, fix, no form moved, tables 1 and 2 again, one new C2′ under a new PREREG, final. A second candidate fault: NOT MET. A cause nobody can reproduce: a STOP, no new read.
- **Does a C2′ already played stand after a fix for an S′ fault or a Levels red?** Only if the fix is value-identical: test or fixture only, or it reads no clock and nodes, score and move stay equal on S1, S2 and R7. Then C2′ stands. Any other fix means C2′ read another engine, so a new one is owed, final even if lower. The clock clause is there because every exact row runs on a frozen clock and is blind to a time fix. A Levels red is read by `ADR-0028` first.
- **Rejected:** (a) a fault as NOT MET outright. The block separates the two, and one crash in a rare path would end a bundle over a bug that says nothing of its strength. (b) A free re-read after any fault. It reopens the second draw: a 40 with a crash would play again.
- **Weak point.** B6 says "the same parts with the same forms count as the same bundle", and a fixed build has the same forms. The reading rests on that sentence sitting under "on a miss". **If the Orchestrator reads the new C2′ as crossing B4, it is the owner's question, and the strict reading holds until he answers.**
- **For QE:** `…d776c0f0` § 6 says QE changes no line outside a blank. These lines are the Architect's supplement to that shape; QE copies them from `ADR-0056`. They add no bar.

**Item 4, `ABC-303` § Open 2.** E is a setting, not a bar. QE fills the blank with the E in force at the seal, 1 810 today. A step before the seal is a dated line in `ADR-0056`, which governs, plus a dated line on the page (BA/PM). A step after the seal does not reach this read.
- **New on the record:** the pool at E 1 810 stands at 30 games, 18.5 / 30 = 61.7 % (7.0 `ABC-269`, 5.5 `ABC-279`, 6.0 `ABC-283`). No record had added it. No step fires. X = +82.6, for scale.
- **Watch:** one more merged S′ below 5.5 / 10 leaves the band downward; 5.0 gives 58.8 % and E′ 1 700. That is the owner's question by S′'s rule. **This is the only way E moves before the seal, and it has not fired.** `ABC-282`'s QE read played no S′ on its record, so the next one is likely `ABC-301`'s.

**Item 5, the moved base.** The owner's order stands: no cause is shown. A fit lands under `ABC-289`'s read too, so it favours neither order. Reason 1's "on the tree it was measured on" and reason 2's "comparable" no longer hold literally after a fit. What survives is narrower: P4 read with no other pruning rule over it, and R1 and R2 differing by one named merge, not two. Reason 3 reads no base. § Open 4 and the block name two reasons; the block has three.
- **What changes:** the two sentences' reading, and one practice: the hop that brings R1 and R2 on the new base brings P3 and P4 too.
- **What does not settle:** whether reach +0.116 against +0.10 survives a fitted evaluation. No probe has read it. A red is a STOP, and a lift is the owner's. "Materially worse" in `…3c67d3c4` 4 stays the Orchestrator's, and no figure is set for it here, since the block says there is no ceiling.

**Item 6, `NFR-009`'s sum row.** The row is `NFR-009` (a)'s, and `ADR-0063` d6 and `ADR-0073` d7 each name their byte function for it, so both tables belong in it. It is green and understates by 35 840 bytes, about 4.6 MiB of 16 MiB in all.
- **The countermove's term: owed in `ABC-303`,** by Scope 2's "exactly as its ADR states", at `main`'s merge, before QE seals. It is no row of tables 1 or 2, and P5 is met, so it gates nothing.
- **The history term: owed on `main`, elsewhere,** in the test-only hop of `…e28552ac`. It is `ABC-283`'s gap, and a bundle that misses its read would leave it unwritten.
