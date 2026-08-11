---
id: 20260811T130000Z-software-engineer-decision-f33b88f5
kind: decision
by: software-engineer
at: 2026-08-11T13:00:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - A2
  - D19b
  - src/status-panel.test.ts
supersedes:
---

# How `A2`'s `D19b` case was written, and the one edit I deliberately did NOT make

> **Hand-authored.** `scripts/context-io.ts` — the sanctioned writer Workflow 16 names — does not
> exist in this repo or in the kit, and `mcp__grugops__propose_note` is not among this session's
> tools. Same gap, and the same plain statement of it, as
> `.grugops/queue/done/refinement-ABC-016-a13/claim.md` and my own prior hop's notes. **Nothing at
> this hop is a `finding`** — no verification stamp is issuable to me, so no note here claims one.

## The edit I did not make, stated first because it is the load-bearing one

**`src/status-panel.ts` was not opened for edit and `git diff -- src/status-panel.ts` is EMPTY.**
BA/PM measured that the delivered panel already renders this case correctly; the brief said that if I
found myself editing the panel I should stop and say why. I did not find myself there. The case went
green on the first run against delivered code, so the measurement holds and there is nothing to flag
on that axis. `src/status-panel.nfr.test.ts` also came back untouched, as BA/PM asked — see this
hop's `claim` note for two things I noticed *in* that file and flagged rather than fixed.

## Four small choices the criterion left open

**1. The ply list is a named `const`, not an inline literal.** `PLAYED_CHECK` sits beside `SHUFFLE`,
which is the file's existing shape for a ply list used in more than one place (`CASES` plus the
criterion's own test). Rule 11, match existing style. Its doc comment carries the *why played, not
loaded* instruction from `## Test notes` so the next reader cannot "simplify" it into the loaded FEN
— which is exactly the fifteenth empty-move-list case this defect is about.

**2. The assertions were appended to the existing `A2` test rather than given a new `it`.** The
file's stated shape is one test per criterion and `A2` is one criterion; a separate `it` would have
made `A2` the only criterion with two. The test's *name* was extended (`… on a check reached by
play …`) so a failure still says which case broke. Cost of the choice, recorded honestly: the file's
test count moves 26 → 27 from the **snapshot** entry only, not from the assertion block.

**3. All five cells are asserted on ONE render, held in one `const played`.** Five separate
`textOf(...)` calls would have been five separate renders and would not have asserted that the cells
**agree with each other**, which is the entire point — the wrong build's failure is that its check
indicator and its balance come from a different board than its move number and side to move.

**4. The `CASES` entry sits immediately after `checkmated`.** That groups `A2`'s three in-check cases
together. It is safe to insert mid-list because vitest keys snapshots by test NAME
(`matches its snapshot — played check 3.Qxe5+ 1`), never by index, so no existing snapshot key moved
— verified by reading the snapshot diff, which is **six added lines and zero changed lines**.

## What I did not add, and why not

I did **not** assert "3 legal replies" or `{result:"in-progress"}` on the fixture. The criterion
states those as measured *characterisations* of the position, in the same parenthetical form it uses
for the first FEN's "4 legal replies, game in progress" — which the delivered test likewise records
as a comment and does not assert. Asserting them would pin `legalMoves`' count inside `ABC-016`'s
suite, which is the `ADR-0009` clause 1 fault BA/PM has just rejected twice on this ticket. What
guards the fixture instead is structural: `gameFrom` **throws** on an illegal ply, and
`last: Qxe5+` pins the capture (`x`) and the check suffix (`+`) in one string, so the fixture cannot
silently decay into a quiet move or a different line.

## The width question stayed untouched, as instructed

I reserved no width, changed no string, and added no width clause. One datum for whoever holds the
routed decision, offered as a datum and not as an argument: this new case's widest row is **26**
columns (`Black to move  3...  CHECK`), measured from the generated snapshot. It sits inside the
already-flagged 17 → 67 swing and moves nothing about that flag. Recorded here only so the
Architect/Design hop is not surprised that the `CASES` list gained a fifteenth width sample.
