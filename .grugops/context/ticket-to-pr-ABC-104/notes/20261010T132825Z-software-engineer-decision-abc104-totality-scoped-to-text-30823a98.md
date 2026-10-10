---
id: 20261010T132825Z-software-engineer-decision-abc104-totality-scoped-to-text-30823a98
kind: decision
by: software-engineer
at: 2026-10-10T13:28:25Z
verified_by:
confidence: high
refs:
  - ABC-104
  - ABC-031
  - ADR-0004
  - EPIC-003
  - src/coordinate-move.ts
  - 20261010T132825Z-software-engineer-observation-abc104-gates-and-throws-a2addac5
supersedes:
---

# `ABC-104`: the totality sentence names `text`, and `position` / `legal` are a caller obligation

This note is hand-authored and unsealed.

**Decision.** The sentence at `src/coordinate-move.ts:30` (base `b7cffc52`) was "It is a TOTAL function
and does not throw". It is replaced in place, inside the header docblock, by "It is TOTAL OVER `text`".
The new text says totality is over `text` ONLY. It states that `position` and `legal` are "a caller
obligation, in the same terms `ADR-0004` clause 2 states for `toSan` and `parseSan`", which are a real
`Position` and, when supplied, that position's legal move array. It names the two measured throws as
the contract.

**Why this wording.**
- `A1` asks for the domain, the absence of an unqualified claim, and the caller obligation. All three
  are in one paragraph, so a reader who copies the paragraph copies the qualification with it.
- The phrase "caller obligation" is `ADR-0004`:201's own term. I reused it rather than coin a new one.
- The two calls are quoted literally, so the next reader can re-run them (ticket test note 2 asks for
  the measurement in the commit; it is in both the commit and the comment).
- The existing "ONE CALLER OBLIGATION" paragraph at `:25-28` is untouched. It covers `legal`'s
  *semantic* obligation (the right position's list). The new text covers the *type* obligation on
  both arguments. They do not contradict each other, and "ONE" in that heading stays accurate, because
  the new sentence describes an obligation that is not validated rather than a second validated rule.
  A maintainer might read it as two obligations. Fixing that is outside this ticket's scope, so the
  wording is left as it is.

**Rejected.** Adding a guard so that the old sentence becomes true. That is fenced out as an
`ADR-0004` question (ticket § Out of scope).
