---
id: 20261010T152348Z-architect-design-decision-qe104d-adr0004-2a-every-input-scoped-to-text-9afbc4bb
kind: decision
by: architect-design
at: 2026-10-10T15:23:48Z
verified_by:
confidence: high
refs:
  - QE-104-d
  - ABC-104
  - ADR-0004
  - src/san.ts
  - src/coordinate-move.ts
  - memory-bank/50-decisions/ADR-0004-san-ownership.md
  - .grugops/context/design-F-072-1/probe/qe104d-parsesan.mts
  - .grugops/context/design-F-072-1/probe/qe104d-parsesan.out.txt
  - 20261010T133349Z-qe-e2e-observation-abc104-gap-register-df369a19
  - 20261010T152348Z-architect-design-observation-f0721-readings-fixtures-plants-qe136-qe104d-gates-f8dee48b
supersedes:
---

# `QE-104-d`: `ADR-0004` (2a) over-claims. A dated pointer scopes "every input" to the `text` domain, under clause 2's caller obligation. No clause, outcome or verdict moves

This note is hand-authored and unsealed. The claim was **re-measured first**: `…f8dee48b` O4 and
`probe/qe104d-parsesan.out.txt`, at `7f7e6b84`.

## Ruling: it over-claims; amended with a pointer, not rewritten

**The sentence.** `ADR-0004` (2a), at `:206`–`:207` before this hop, says `parseSan` "is a
**total function**: every input produces one of the three arms and none of them throws".

**What was measured:**
- **Hostile `text`, valid position: 156 calls, 0 throws.** That is 39 values × 4 calls (two
  positions, with and without `legal`). The values include strings, a 20 000-character string,
  `null`, `undefined`, a number, an object, a symbol and a function.
- **Wrong-typed `position` or `legal`: 7 of 11 calls throw `TypeError`.** Examples:
  `parseSan(null, "e4")`, `parseSan(p, "e4", 42)`, `parseSan(p, "e4", [null])`, and
  `parseSan(null, "O-O", LC)` on the castle path.
- **Another position's list returns silently.** The clause already says so.

**So "every input" is false; "every `text`" is true.** The scoped reading is the one already
ratified: the ratification record says `parseSan` "does not throw for ordinary bad input" (`:69`–`:70`).
`src/san.ts:220`–`:221` says the same ("TOTAL against whatever a loop actually hands over", about
`text`). (2a)'s sentence was wider than both. **It is the over-reach `ABC-104` fixed in
`src/coordinate-move.ts`.**

**Recorded in `ADR-0004`:**
- a Status sub-section, `### Pointer 2026-10-10 — (2a)'s "every input" is scoped to the text
  (QE-104-d)`;
- a bracketed POINTER block directly under (2a)'s outcome table, with the measurement. It also says
  the "It does not throw, and that is deliberately unlike `src/fen.ts`" bullet below is the same
  sentence about the same domain.

**Why this needs no ratification.**
- No ruled word changes; the outcome set and every verdict stand.
- The pointer brings (2a)'s description into line with the ratified record. It does not move the
  record.
- `ADR-0004`'s "NOT A PRECEDENT" section is about acceptance, and nothing is accepted here.

## Follow-ups

None. There is no runtime effect, and no test is owed. `QE-104-e` (no test pins the documented
throws) was accepted by the page and is not re-opened.
