---
id: 20260818T222000Z-qe-e2e-observation-a-second-changed-class-no-note-names-the-rejection-reason-code-flips-b7d3e611
kind: observation
by: qe-e2e
at: 2026-08-18T22:20:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-034
  - src/move-input.ts
  - repair-ABC-033-2026-08-18
  - 20260818T201500Z-software-engineer-decision-g2-a-fourth-blind-variant-and-what-it-deliberately-does-not-reach-4a1c88e2
supersedes:
---

# `G2` changed a SECOND observable class, and no note in the record names it: the rejection reason code

Both repair-side corpora report the same headline — *"52 of 52 / 90 of 90 changed lines are
`rejected` → `move`, and they are all promotion spellings"*. On my corpus the same headline holds
(**684** of them). But my differential compared the **whole outcome**, including a rejection's
`messages` payload, and found a second changed class:

| changed class | count on my 122,094 lines |
|---|---|
| `rejected` → `move` | 684 |
| **`rejected: unreadable` → `rejected: no-such-move`** | **97,716** |
| `rejected: no-such-move` → `rejected: unreadable` | **0** |

**The mechanism, and it is not a bug.** Variant 4 hands `parseSan` a **well-formed** promotion string
for lines the other three variants can only mangle. `E8=q` at the start position folds to `e8=Q`,
which matches `PAWN_MOVE` and filters to nothing, so the attempt reports `no-such-move` — the more
specific code, which outranks `unreadable` at `src/move-input.ts:190`. Before the repair every
variant of that line was unreadable. The line was rejected before and is rejected now; **what
changed is which machine-readable reason the player's message is rendered from**, and `ABC-034` owns
that copy.

**Why neither earlier corpus could see it.** Both were built from **legal moves** — every base
string named a move that exists — plus nine junk lines. A reason-code flip needs a string that is
*well-formed promotion SAN naming no legal move*, and that family was essentially absent. My corpus
sweeps the whole `[a-h]?x?[a-h][1-8]=[QRBN...]` space in every case permutation, which is why the
class is large here. **The absolute count is a property of my corpus, not of the module** — do not
quote 97,716 as a blast radius. The reportable facts are that the class is **non-empty, one-way, and
unnamed in the record**.

**Is the invariant still true?** Yes, on the reading that matters: *accepted* = "resolves to a move",
and that set grew only by promotion spellings. But *"widens what is asked, never what is accepted"*
is quoted in the record as if the rejection arm were untouched, and it is not. The honest sentence
is: **variant 4 widens what is asked; the set of lines that resolve to a move grows only by
promotion spellings; and some lines that stay rejected now carry a different — more specific —
reason code.**

**Not a defect and I am not asking for a fix.** `no-such-move` is the truer answer for a string the
module can now read. This is a **recording gap**: a production behaviour change reached `ABC-034`'s
input without appearing in any note or test. No test in `src/move-input.test.ts` pins a reason code
for a folded-only line, so nothing would have gone red either way.
