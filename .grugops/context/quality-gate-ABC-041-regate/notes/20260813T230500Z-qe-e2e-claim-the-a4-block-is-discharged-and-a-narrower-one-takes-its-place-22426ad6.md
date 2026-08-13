---
id: 20260813T230500Z-qe-e2e-claim-the-a4-block-is-discharged-and-a-narrower-one-takes-its-place-22426ad6
kind: claim
by: qe-e2e
at: 2026-08-13T23:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - plans/tickets/ABC-041-render-seam-closure.md
  - agent-factory/workflows/05-pr-quality-gate.md
  - src/render-seam.test.ts
  - src/render-seam.ts
  - 20260813T215008Z-qe-e2e-claim-89a31e1f
supersedes: 
---

# VERDICT: `BLOCKED_NEEDS_FIX` — but on `A6`, not on `A4`. The `A4` block I raised is DISCHARGED on evidence; one narrower criterion has the same defect and it is a three-line fix.

Recorded as a `claim` because **no `finding` is admissible on this install** — `AGENTS.md`
§ Role/workflow files states why and it is not re-derived here. No `§14-gate#<id>` stamp was
invented, and no could-not-run is recorded as a pass. **Confidence is `high` because every statement
below is a mutant that was built and run on this branch's tree, not a report that was read.**

## The block that opened this loop is CLEARED, and it is cleared by measurement

The four questions were put to the repaired instrument and it answers all four. The measurements are
in the sibling `observation` note; the short form:

1. **Runs B and C reproduce.** Same `X2`, whole-frame equality removed in both, only the width source
   differing — panel-derived **RED at `src/render-seam.test.ts:241`**, `frame[0]`-derived **GREEN**.
   The circularity is closed **on evidence**, not on a rewrite.
2. **The repaired `A4` still bites.** `X1` (bound orientation ignored) and `X2` (self-padding seam)
   each red `A4` **alone**, with the whole-frame equality removed. It was not softened to fit.
3. **`A11` is a rename and the property survived it.** All 12 body lines byte-identical; only the
   title moved. `X3b` — a genuine second board implementation, `tsc` **0** — reds **`A11` and nothing
   else**, with `A4` and `A8` green. That is exactly the property `A4` provably cannot hold.
4. **The overlap is disposed of** — I deleted my own `A4 (width)` row, with the subsumption measured
   rather than argued. See the `decision` note.

**This is not "two hops did work, so the block lifts."** The Engineer's own account was checked
against a rebuilt mutant at every step, and one of its statements — that the standalone row was worth
keeping — I overruled with a mutant it had not run.

## Why the gate is still red, and it is a small red

**`A6` now has the same defect `A4` had**: the ticket says the criterion is *"asserted textually, not
by inspection"* and names four spellings — `process.`, the bare word `process`, `globalThis`,
`import.meta`. **The instrument asserts one of them** (`expect(source).not.toContain("process.")`,
`src/render-seam.test.ts:287`), and nothing else in the repository asserts the other three over this
module — checked, not assumed.

Measured with mutant `X8` (typecheck-clean, lint-clean): an ambient read of `process.env` reached
through `globalThis["process"]` ships **827/827, `tsc` exit 0, `npm run lint` exit 0** — and it is not
decorative, because with the variable set the seam silently overrides its bound glyph mode and three
criteria red. Detail in the `observation` note.

**Neither prior hop is at fault.** BA/PM widened the wording precisely because I measured that grep
one keystroke wide, and it does not write instruments. The Engineer's subtask was scoped to `A4` and
`A11` and it stayed in scope. The gap fell **between** the two hops, which is exactly the seam a gate
exists to look at.

## The gap, homed

**To the Software Engineer** — one item, and it needs no new file and no new test row:

- **Add the three missing spellings to the existing `A6 / A7` row** (`src/render-seam.test.ts:283`):
  `expect(source).not.toContain("process")` (which subsumes the existing `process.` check),
  `expect(source).not.toContain("globalThis")`, `expect(source).not.toContain("import.meta")`. **Arm
  them the way this ticket has armed everything else** — `X8` is described byte-for-byte in the
  `observation` note; watch it go RED before believing the fix. The delivered module contains **zero**
  occurrences of all four spellings today (counted at my hand), so the additions are green on the
  pristine tree.

**Not homed to BA/PM.** The wording is right and should not be shrunk back to what the instrument
happens to assert — that would be fitting the criterion to the build, which is the move this whole
loop exists to stop.

## What is NOT claimed

- **Not that the delivered module is wrong.** `src/render-seam.ts` is byte-untouched by this hop and
  by every hop since it was written: git blob `51e50a38…` is identical at `ac17fe2`, `8dbe2b4`,
  `78a3db8` and at my tip, and md5 `bc18d083…` never moved during mutation.
- **Not that `A6` is FALSE of the delivered build.** It is true today and I verified it by counting.
  What is missing is the guard for three of its four clauses tomorrow.
- **Not that the earlier survivors `X7` / `X9` are still open as gaps.** `A3`'s wording now matches
  its instrument exactly and states its blind spot; `A3`/`A6` now scope themselves to *this module's
  source* and name `A10` as the fence, which I verified by reading the diff. Both are addressed.
- **Not that `X5b` or `A8`'s import-statement blind spot are cleared.** They are not — they are homed
  to `ABC-053` and `ABC-054`, both cut and both real. They do not block `ABC-041`.
- **Not that `SPLIT_REQUIRED` applies.** `S` (2) is right and nothing here is a sizing problem.

## Board and hand-off

`ABC-041` stays in **`In Review`**. I did not move the board, I did not open the ticket page, and I
did not touch `src/render-seam.ts`. **Do not merge. Do not deploy.** A human holds both.
