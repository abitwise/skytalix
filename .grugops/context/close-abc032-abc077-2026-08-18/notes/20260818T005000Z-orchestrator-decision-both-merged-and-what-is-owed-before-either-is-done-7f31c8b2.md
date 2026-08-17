---
id: 20260818T005000Z-orchestrator-decision-both-merged-and-what-is-owed-before-either-is-done-7f31c8b2
kind: decision
by: orchestrator
at: 2026-08-18T00:50:00Z
refs:
  - ABC-032
  - ABC-077
  - ABC-106
  - plans/board.md
confidence: high
verified_by:
supersedes:
---

# `ABC-032` and `ABC-077` merged to `main`. Neither is `Done`, and nobody has accepted either.

## The merge, and the check I ran that was not asked for

Three branches integrated: the Orchestrator's board state, `ABC-032` (engineer → QE → BA/PM
rulings), `ABC-077` (engineer → QE). **One conflict, in `plans/traceability.md`, and it was in the
stacked `_Updated:` headers only — the table rows merged clean. Resolved by KEEPING ALL THREE
headers** in the file's newest-first convention, not by choosing a side; no role's record was
dropped to make a merge easy.

**Full gate re-run on `main` AFTER the merge:** lint 62 files exit 0 · typecheck 0 · build 0 ·
**999/999 on 35 files** · skip **0** · `No findings.` exit 0 · `PERFT_DEEP=1` **32/32** ·
`SEARCH_DEEP=1` **47/47**.

**The check nobody asked for: the merge arithmetic.** 935 on `main` before + 30 from `ABC-032` + 34
from `ABC-077` = **999**. It matches exactly, which is the evidence that **no test was silently lost
integrating two branches developed concurrently against the same base.** Two concurrent engineers is
new here (2026-08-17), and a lost test is the failure mode that would not announce itself.

**One false alarm I raised and cleared myself:** a crude duplicate-row scan flagged `ABC-032` twice
in traceability. **Not a merge artifact** — the file's convention carries a ticket row and a
separately labelled `(QE)` evidence row, exactly as the pre-existing `ABC-031 (evidence)` pair does.
`ABC-028`/`ABC-029` remain the genuine duplicates, which is `ABC-040`'s subject and untouched here.

## Why both QE hops justified the 2026-08-17 directive

**`ABC-032`: 17 mutants, 5 survivors — five guards that could not fail.** The sharpest: `A7`, the
criterion enforcing `ADR-0004` clause 2's ONE table, was **blind to a second grammar spelled as a
regex literal** — and a regex literal is the first shape this module's own style reaches for.

**`ABC-077`: QE BROKE `A6`, the guard on ratified `RISK-002`.** `depth ?? 4` passes exports-set
equality, `Function.length === 2`, **both** source regexes, `tsc`, `biome`, and leaves the suite
28/28 green — while `search(position)` with no depth returns a move at a fixed depth 4. **That is
precisely the fixed-depth per-move budget `RISK-002` forbids, with its guard green.** Closed by
`QE-G1`, asserting behaviour instead of source text.

**Neither is a defect in delivered code. Both are defects in the instruments that were supposed to
prove the code.** That distinction is the whole argument for the directive, and it would have been
invisible without an independent hop: both engineers' own suites were green and both were honest.

**Both QE hops changed ZERO production lines** — verified by diff, not taken on report.

## What is owed before either can be `Done` — and it is NOT mine to supply

**The owner's word, and it is not assumed.**

- **The 2026-08-17 zero-production-lines waiver is UNAVAILABLE to both** — `ABC-032` and `ABC-077`
  each ship real production code. Measured, not asserted.
- **Neither is human-exercisable.** `npm run chess` still only prints a board; **no move can be
  typed until `ABC-043`.** A `parseSan` and a search core have no user surface.

**So a conducted UAT is not being skipped — it is again NOT AVAILABLE**, the same wall `ABC-031` and
`ABC-076` hit on 2026-08-17. **This is the THIRD consecutive occurrence, and it is now demonstrably
the binding constraint on every remaining `EPIC-003` and `EPIC-004` ticket, not a theoretical gap.**

**I did not resolve it and did not apply either existing ruling by analogy.** The 2026-08-16 ruling
says who signs a UAT **that is conducted**; the 2026-08-17 waiver covers **zero-production-line**
tickets. **Neither covers this case, and stretching one to fit would be inventing authority the
owner never gave** — the exact error the `slot-guard-anchor` note warns the next hop against. The
alpha/beta phasing proposal is the owner's own and remains unwritten.

## Not actioned by this hop, listed so nothing is quietly dropped

Carried: retroactive QE for `ABC-067`/`ABC-071`/`ABC-008`/`ABC-001`; escalation #2; `ABC-031`'s
`N8-LANE`; `ABC-083`'s anti-fork clause. **New:** whether rule 1's control counts guard-sensitivity
gaps separately; the unexplained `N8-LANE` null; **`ABC-077`'s page still says `ABC-076` is `OPEN`**
(QE gap 7, and I recorded the same thing at the `Ready for Dev` exit — it survived the whole ticket);
`src/search.test.ts:20`'s comment still reads **204** where the measured figure is **184**. The last
two are one-line page repairs owned by BA/PM and the Engineer respectively; **cut as work, not
patched silently by me at a close-out.**
