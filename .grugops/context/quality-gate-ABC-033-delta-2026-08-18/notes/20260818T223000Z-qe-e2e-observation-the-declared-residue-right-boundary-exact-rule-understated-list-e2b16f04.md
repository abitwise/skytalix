---
id: 20260818T223000Z-qe-e2e-observation-the-declared-residue-right-boundary-exact-rule-understated-list-e2b16f04
kind: observation
by: qe-e2e
at: 2026-08-18T22:30:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-032
  - src/move-input.ts
  - src/san.ts
  - repair-ABC-033-2026-08-18
  - 20260818T201500Z-software-engineer-decision-g2-a-fourth-blind-variant-and-what-it-deliberately-does-not-reach-4a1c88e2
supersedes:
---

# The residue: the BOUNDARY is right, the RULE is exact, the enumerated LIST understates it

Measured on the promotion-capture fixture `3q1k2/4P3/8/8/8/8/8/4K3 w - - 0 1`: **every case
permutation of every legal move's SAN**, bare and with a `+` and a `#` — 468 lines.

| | count |
|---|---|
| spellings rejected | **264** |
| of those, carrying a trailing `+` or `#` | **264** |
| **of those, carrying NO check suffix** | **0** |
| non-promotion spellings rejected | **0** |

## Three answers to the three questions asked

**1. Is it the right boundary? Yes — and for a better reason than "the fence forbids it".** Reaching
the suffixed forms needs the transform to know `+`/`#` is trailing decoration. That knowledge already
exists, once, in `parseSan` (`CHECK_SUFFIX`, `src/san.ts:204`), and duplicating it into
`CASE_VARIANTS` would put a second copy of a grammar fact in the module whose whole stated identity
is *"there is no grammar here"*. The rejected alternative — *"uppercase the last character that has a
case distinction"* — I agree with rejecting, and for the reason given: it turns `bxc4` into `bxC4`
and hands a meaningless string to both readers on the majority of lines. **Leaving it to `ABC-032`'s
grammar owner is right, and so is not pinning it with a characterisation test**, which would make the
correct fix there go red. I would make the same two calls.

**2. Is the residue no larger than declared? The RULE is exact; the LIST is not.** *"Once a check
marker follows the piece letter, the case-significant character is no longer last"* is **exactly
right and exactly complete** — 264 of 264 rejected spellings carry a suffix, and **zero** unsuffixed
promotion spelling is rejected. There is no residue outside the suffix family, on this fixture or
anywhere in the 122,094-line corpus.

But the residue's **extension** is bigger than the enumerated lists suggest. The `G2` note lists 14
strings and the brief 5; the fixture alone has **264**, because the note enumerated only the queen
and rook families (*"the ones that give check in that fixture"*) and only the `+` spelling. It also
holds for:

- **`#` throughout** — `E8=Q#`, `EXD8=R#` and every sibling, identical mechanism, entirely unlisted;
- **moves that give no check at all** — `e8=b+`, `E8=N#`, `exf8=q+`. `parseSan` strips a trailing
  `+`/`#` as decoration whether or not the move checks, so a player who types a spurious suffix hits
  the residue too, on a bishop or knight underpromotion.

`e8=Q+` resolving while `E8=Q+` does not is confirmed exactly as declared — the exact-SAN path needs
no variant.

**3. So is anything wrong?** No behaviour is wrong and I am asking for no fix. The declaration is
**correct as a rule and unrepresentative as a list**, and a reader who takes the 14 strings for the
whole residue will under-estimate what `ABC-032`'s grammar fix has to cover. Read the rule, not the
enumeration.
