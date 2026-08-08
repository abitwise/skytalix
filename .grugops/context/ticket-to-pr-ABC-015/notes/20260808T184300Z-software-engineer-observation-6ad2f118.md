---
id: 20260808T184300Z-software-engineer-observation-6ad2f118
kind: observation
by: software-engineer
at: 2026-08-08T18:43:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - ABC-014
  - src/glyph-mode.ts
  - src/glyph-mode.test.ts
  - plans/tickets/ABC-015-glyph-mode-selection.md
  - 20260808T182200Z-ba-pm-decision-69e00126
supersedes: 
---

# Acceptance criteria 10 and 11 are BLIND to a session that reads only one of the two ambient signals

A third defect of the same family BA/PM already corrected twice on this ticket. It was found by
mutation, not by reading, and it is recorded here because **the suite was fixed and the CRITERIA were
not** — closing them is BA/PM's, not this role's.

## What was measured

A mutation campaign was run against `src/glyph-mode.ts` (21 mutants, apply → run → restore). Two
mutants **passed every one of the eleven acceptance criteria**:

- `beginGlyphModeSession` hardcoding `isTTY: true` instead of reading `process.stdout.isTTY`;
- `beginGlyphModeSession` forwarding only `LANG`, dropping `LC_ALL` and `LC_CTYPE`.

Both are real production defects. The second in particular silently breaks the `LC_ALL` precedence
that criterion 5 exists to protect — criterion 5 tests the **rule**, and the rule is fine; it is the
**session** that never hands `LC_ALL` over.

## Why no criterion can see them

**Criteria 10 and 11 are both written over ambients in which `isTTY` and the locale AGREE.** They
say "rewrite the ambient signals to values that would produce the other answer", and the natural —
and, as written, the only — reading is to move both signals together: `(TTY, UTF-8)` → `(no TTY,
LANG=C)`. When both signals point the same way, a session that reads either one alone still lands on
the right answer. The criteria are testing the CACHE, correctly and falsifiably; they simply never
put weight on the WIRING.

This is the same shape as the two defects already on this ticket's record and as `ABC-014`'s *"not
the white frame with its rows simply reversed"*: **a criterion that passes for a reason other than
the one it was written for.** It is worth naming that the criteria are not wrong — they do their own
job — they are merely load-bearing for something they were never asked to carry.

## What was done about it

The suite now carries one test with four rows, each isolating a single ambient signal so that the
signal is the ONLY thing that can produce the expected answer (`LANG` alone, `LC_ALL` beating `LANG`,
`LC_CTYPE` alone, `isTTY` alone). Every row expects `ascii` by design: `unicode` is what this module
answers when a signal never arrives, so only a signal that actually travelled can produce `ascii`.
All four wiring mutants — and two further ones written afterwards — now die.

**The ticket's acceptance criteria are unchanged.** Amending them is a `Backlog`/refinement act and
this role does not own it. QE/E2E is the next reader; BA/PM owns whether criterion 11 should be
widened to require the two ambient signals to be moved independently.

## The rest of the campaign, for the record

All 21 mutants are now killed, including the two the ticket names by hand: the session re-probing the
environment on every call (killed **only** by criterion 11, which is exactly what BA/PM rewrote it to
do) and `if (process.platform === "win32") return "ascii"` (killed **only** by criterion 9, which is
why that test stubs `process.platform` rather than merely repeating row 5). `src/glyph-mode.ts` was
verified byte-identical to a pre-campaign copy afterwards.
