---
id: 20260818T232000Z-software-engineer-observation-g2-widened-the-rejection-arm-too-a-one-way-reason-code-flip-my-sentence-hid-3d7b6015
kind: observation
by: software-engineer
at: 2026-08-18T23:20:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-034
  - src/move-input.ts
  - repair-ABC-033-2026-08-18
  - quality-gate-ABC-033-delta-2026-08-18
  - 20260818T201500Z-software-engineer-decision-g2-a-fourth-blind-variant-and-what-it-deliberately-does-not-reach-4a1c88e2
  - 20260818T222000Z-qe-e2e-observation-a-second-changed-class-no-note-names-the-rejection-reason-code-flips-b7d3e611
supersedes:
---

# Correcting my `G2` sentence: *"widens what is asked, never what is accepted"* is true and **incomplete** — variant 4 also changes a rejection's reason code

Second append-only correction. The sentence is quoted in the record as though the rejection arm were
untouched by variant 4. It is not.

## The class that went unnamed

Variant 4 (lowercase the line, uppercase its last character) hands `parseSan` a **well-formed**
promotion string for lines the first three variants could only mangle. A line like `E8=q` folds to
`e8=Q`, which now matches `PAWN_MOVE` and filters to no legal move, so the attempt reports
**`no-such-move`** — the more specific code, which outranks `unreadable` at the reject arm of
`resolveMoveInput`. Before variant 4 every variant of that line was `unreadable`.

So there are **three** changed classes, not one:

| class | direction | verdict |
|---|---|---|
| `rejected` → `move` | one-way, promotion spellings only | the widening, already recorded |
| `rejected: unreadable` → `rejected: no-such-move` | **one-way; the reverse never occurs** | correct, and was unrecorded |
| `move` → anything, `ambiguous` → anything | did not occur | unchanged |

The line was rejected before and is rejected now. **What changed is which machine-readable reason
the player's message is rendered from**, and `ABC-034` owns that copy — so this is a production
behaviour change that reaches `ABC-034`'s input, which is exactly why it belongs in a note.

**The honest sentence, replacing mine:** *variant 4 widens what is asked; the set of lines that
resolve to a move grows only by promotion spellings; and some lines that stay rejected now carry a
different — more specific — reason code, never a less specific one.*

## Deliberately not quoting a blast radius

QE measured this class on its own corpus and reported a large count. **That count is a property of
QE's corpus construction — it sweeps the whole promotion space in every case permutation — and not a
property of this module.** I am not repeating it here and it should not be quoted as a blast radius.
The three reportable facts are that the class is **non-empty**, **one-way**, and **was unnamed in
the record**.

## Why my own corpus could not see it, which is the reusable lesson

Both repair-side corpora were built from **legal moves** — every base string named a move that
exists — plus a handful of junk lines. A reason-code flip needs a string that is *well-formed
promotion SAN naming no legal move*, and that family was essentially absent by construction. A
differential built only from valid inputs cannot observe a change in how invalid ones are refused.
Comparing only the outcome `kind` and not its payload would have hidden it a second time.

## Not a defect, and nothing pinned by this hop

`no-such-move` is the truer answer for a string the module can now read. No test in
`src/move-input.test.ts` pins a reason code for a folded-only line and this hop did not add one —
the brief is zero behaviour change and adding a characterisation test here would fence `ABC-034`'s
copy owner for no gain. Recorded, not repaired.
