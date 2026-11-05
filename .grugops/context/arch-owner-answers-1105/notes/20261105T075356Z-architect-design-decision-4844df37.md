---
id: 20261105T075356Z-architect-design-decision-4844df37
kind: decision
by: architect-design
at: 2026-11-05T07:53:56Z
verified_by: 
confidence: high on the form, copied from b836b85c and the block with every line's source stated; medium on the reach, a reading of his words; the text of the question put to him is not on the records: UNKNOWN - verify; nothing run
refs:
  - arch-owner-answers-1105
  - ABC-303
  - ABC-289
  - ABC-282
  - ADR-0056
  - ADR-0028
  - ADR-0064
  - R-BUNDLE-1
  - orch-2026-10-30a/20261105T074310Z-orchestrator-decision-b836b85c
  - orch-2026-10-30a/20261104T234244Z-orchestrator-decision-681c6363
  - arch-ABC-303-open/20261104T234106Z-architect-design-decision-5aee89b7
  - arch-owner-answers-1104b/20261104T220311Z-architect-design-decision-d776c0f0
  - bapm-K0-cut/20261104T235052Z-ba-pm-observation-4843d1f2
supersedes: 
seal: sha256:a5d15575b8d0a9ae332ded86256caf53c08d2d2fc69bceac1e4006e36340da33
---

# arch-owner-answers-1105 item 1: the new C2′ is written in the strict reading's place, as CF1–CF10, and QE's § 6 copies them. It binds `ABC-303` only: the owner's words do not reach every bundle read

Architect/Design, task `arch-owner-answers-1105`, records only, on `grugops/arch-owner-answers-1105` from `main` `a44aa057`. Nothing was run. Source: the owner's word `orch-2026-10-30a` `…b836b85c` item 2. Line of record: `ADR-0056`'s dated block of this task, with one-line pointers at B4, B6 and the weak point of `arch-ABC-303-open`'s block. If this note and the block differ, the block governs.

**The form.** CF1–CF10 in that block. QE copies them word for word into § 6 of `…d776c0f0`'s shape, after § 6 item 3, in every `ABC-303` PREREG. They hold no blank. In short:
- A candidate fault or loss on time ends the read with no pass.
- The verdict test comes first. Under the bar with each such game counted as a win: NOT MET, final.
- Otherwise a defect, fixed with nothing tuned, then one new read on the fixed tree, final.
- A clean low score stays final.
- **The clean-C2′ case (CF6):** a clean, met C2′ stands after a value-identical fix, and only the faulted S′ is replayed. Any other fix takes the one new read.
- A second candidate fault is NOT MET.
- A case the lines do not name is a STOP to Architect/Design, so no brief judges.

**What is his and what is not.** The block sorts every line into three groups: in `…b836b85c`; carried from `arch-ABC-303-open`'s block; new here as a reading. The new readings are games not finished in the count, S-4 read whole for its two stages, several faults in one read as one event, the S′ addendum, and CF10. CF7, the Levels red, is carried: the note names S′ alone. If the Orchestrator reads CF7 as past what he accepted, that line is the one to take back to him.

**BA/PM's two points (`…4843d1f2` 1 and 2).** Both close for `ABC-303`. The clean C2′ line stands. An answer reaches any read not yet sealed, and no `ABC-303` PREREG is sealed: no `qe-ABC-303` context exists on any local branch at this hop.

**The reach, and why it stops at `ABC-303`.**
- His verbatim word is "2. yes". The restatement names no B4, no bundle rule and no "every".
- "Any read not yet sealed" answers BA/PM's timing question about "this read". I do not read it as a widening across tickets.
- Everything that sent the question to him is `ABC-303`'s: § Open 1, `…681c6363` 2, and rows S1, S2, R7 and P2.
- B4 is a rule he accepted, and silence is not his word on changing it. A too-narrow reading costs one question. A too-wide one amends his rule without him.

**Not settled by the records.** The text of the question is not on the records, only "as put to him". The Orchestrator holds it. If it named every bundle read, one dated line widens this. If not, one question to him is owed before the next PREREG that is not `ABC-303`'s, which is `ABC-289`'s. That question should also say whether plain C2′ reads are meant.

**It does not reach `ABC-282`'s A4,** which QE seals now. A4 is neither a C2′ nor a bundle read, and it has its own miss rule (F5).
