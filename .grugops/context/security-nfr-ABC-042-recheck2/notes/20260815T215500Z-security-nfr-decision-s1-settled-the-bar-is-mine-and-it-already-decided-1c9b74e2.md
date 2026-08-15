---
id: 20260815T215500Z-security-nfr-decision-s1-settled-the-bar-is-mine-and-it-already-decided-1c9b74e2
kind: decision
by: security-nfr
at: 2026-08-15T21:55:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - S1
  - Q5
  - B4
  - BAR-1b
  - V1.2.5
  - src/cli.test.ts
supersedes: 
---

# RULING — `S1`'s reading is settled: **QE is right, the row was writable, and the bar I wrote already decides it**

Two hops have now spent attention on one question about a bar **I wrote**. The `B1` hop declined to
build bar 1b's in-suite row, on the ground that choosing the comment-stripped reading would settle
`Q5`'s open criterion clause **by implementation**. QE judged the row **was** writable, on the ground
that the bar's own bolded *"call sites, NEVER occurrences"* already decides the reading. **I am the
author of that clause. QE is right.** Four grounds, in order of weight, and the third is a
measurement neither hop had.

## 1. "Call site" is not a softer word for "occurrence" — the distinction IS the comment question

The bar reads: *"**Zero CALL SITES of `exec(` and `execSync(`** — `/\bexec\s*\(/` and
`/\bexecSync\s*\(/`, **call sites, NEVER occurrences**"*. A quoted `exec(` inside a docblock is an
**occurrence of the text of a call site**. It is not a call site: nothing is called. The only reading
under which the two words mean different things is the one that excludes comments. **The reading was
decided when the word "call site" was chosen; comment-stripping is what that word means in a
regex-based instrument, not a second decision layered on top of it.**

The clause's stated *reason* — *"the file MUST contain `process.execPath`, and that and
`execFileSync` both contain the substring `exec`"* — addresses substring-versus-call-site. It does
not mention comments. **That is the whole of the `B1` hop's case, and it does not survive point 3.**

## 2. The convention is already this file's own, seven times over

`src/cli.test.ts:45-48` defines `executableCodeOf` — *"the delivered module with its comments
removed, what the structural rows assert over"* — and calls it at **seven** sites: `A2` (twice),
`A6`(i)'s literal scan, `A8`'s call-site count, `A8`'s number transcription and `A9` (twice).
**`A8`'s row already counts CALL SITES over comment-stripped text and nobody called that a criterion
decision.** An eighth use for bar 1b introduces no new idea, no new mechanism and no new judgement.

## 3. The decisive one, and it is measured: under the raw reading, the file's own honest docblock is what reds the bar

The three raw hits are **all on lines 16–17**, and here is what those lines say:

> *"`node:child_process` is reached only in argument-array form; there is no `exec(` or `execSync(`
> call site, no `shell:`, and no spawn argument built by string concatenation. The file MUST contain
> `process.execPath` — **which is why the bar counts call sites and never occurrences.**"*

**Under the raw reading, the file's truthful statement that it complies is the sole thing that breaks
compliance.** A reading in which a correct file is redded *by saying it is correct* — and redded by a
sentence quoting the bar's own disambiguation — is not a reading of a call-site rule. It is the
`RF-9` defect class, which I raised and BA/PM repaired, reappearing one level down.

**And there is a fourth, colder proof.** The `S1` fix is **unwritable over raw text**: `shell:` also
occurs exactly once, in that same docblock, so an in-suite row asserting `shell:` zero over raw
source **cannot be green on the correct file**. The only text the bar's clauses can all be asserted
over is executable code.

## 4. What the `B1` hop got right, said plainly, because I am not grading a person

The **kind** of caution was right for this project, and I would not have blocked either way. An
implementer who resolves an ambiguous criterion by writing its instrument leaves a reviewer unable to
tell implementation from quiet re-wording, and this ticket **deleted two criteria** rather than let
that happen. The hop routed instead of guessing, and it stated its reasoning. **What was wrong is the
premise, not the discipline:** the criterion was not ambiguous on the point it declined to settle.

## The two things that follow, so nothing is left implied

- **`Q5` stays OPEN, LOW, BA/PM.** The *page* still does not name the text its regexes apply to, so a
  reviewer running them naively on raw source measures `1/1/1` and reads a breach where there is
  none. The repair is one clause — *"applied to the file's executable code, comments stripped"* — and
  it is a **clarification of a decided rule**, not a decision. It never blocked the row.
- **`S1` shrinks, on this tree, for a reason nobody planned.** See my bars note: `MS3` / `MS3b` prove
  the `Q6` spawn-pin repair now kills an `execSync` import and call site in this file. **The residual
  is `shell:` and the no-concatenation clause only** — `MS4` (`shell:` added, import list and call
  count unchanged) survives 29/29. The fix I specified at the gate is now smaller than what I
  specified: **two assertions appended to the row that already reads this file**, over
  `executableCodeOf`, not a new `it` block.
