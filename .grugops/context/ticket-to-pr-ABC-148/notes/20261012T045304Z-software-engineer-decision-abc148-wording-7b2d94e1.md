---
id: 20261012T045304Z-software-engineer-decision-abc148-wording-7b2d94e1
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-148
at: 2026-10-12T04:53:04Z
verified_by:
confidence: high
refs:
  - ABC-148
  - ABC-113
supersedes:
---

# SE `ABC-148`: how the two passages were corrected

1. **The comment (`src/cli.test.ts`).** I replaced only the sentence that listed four forms as open.
   The new sentences name two open forms (`for…of`, and a parenthesised `(history) =>`), the bare
   arrow as counted, and `for…in` / `catch (history)` as closed by the typecheck. The regex quote
   `/\bhistory\s*[:=]/g` in the preceding sentence and the `D4` / control sentences after it are
   byte-unchanged. That includes "Every row … stays green" and the `cc037b3e^` control; I did not
   re-run the control. The comment does not mention that `for…in` reds the spawn rows: `A2` asks
   what is open and closed, and the extra fact is in the observation note.
2. **The `ABC-113` page.** I struck the parenthesised four-form list inside the `ABC-114` correction
   with `~~` and kept it. A new italic `ABC-148` correction, dated 2026-10-12, follows it. Line 64
   is untouched (`cmp` against `main`).
3. **Nothing was copied from QE-114-c.** Every count in both passages comes from this hop's `A1`.
