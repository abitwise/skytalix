---
id: 20260815T142500Z-ba-pm-decision-e1-ruled-the-near-miss-set-becomes-complete-over-position-3f1a7c04
kind: decision
by: ba-pm
at: 2026-08-15T14:25:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - E1
  - Q1
  - A6
  - ASVS-V2.2.1
  - N8-LANE
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
supersedes: 
---

# `E1` ruled: the near-miss set stops being a list of transformations and becomes COMPLETE OVER POSITION

## The ruling in one sentence

**`A6`(i)'s near-miss set stays an enumeration, but the thing enumerated changes from *transformations*
to *positions*** — and that is what makes it un-under-coverable by the class of defect this ticket keeps
producing.

## The exact clause the engineer should implement

The phrase *"each spelling's upper-case form, `+"x"` extension and one-character truncation is rejected
**in its legal argv position**"* is **replaced** by:

> each spelling's **near-miss family, complete over POSITION**, is rejected **in its legal argv
> position**: its upper-case form, and one character from `{"x", " "}` **inserted at every index** or
> **deleted at every index**; the row **pins the derived count**.

That is the whole change to the page. The row it describes:

```ts
const nearMisses = (s: string): readonly string[] => {
  const out = [s.toUpperCase()];
  for (let i = 0; i <= s.length; i++) for (const c of ["x", " "]) out.push(s.slice(0, i) + c + s.slice(i));
  for (let i = 0; i < s.length; i++) out.push(s.slice(0, i) + s.slice(i + 1));
  return out;
};
```

Everything else in that test stays: the same three loops over `TABLE_FLAGS` / `TABLE_COLOUR` /
`TABLE_VALUES`, `--colour` still tested in its **two-token** position (QE's `Q1` fix is untouched and
must not be undone), and the existing false-RED guard
`expect(derived.filter(m => ACCEPTED_ARGUMENTS.includes(m))).toEqual([])` stays and becomes more
load-bearing.

**One number the engineer must not trip on: the family yields 138 cases but only 134 DISTINCT strings.**
The four duplicates are deletions at repeated characters (deleting either `-` of `--` gives the same
token; likewise the `ii` in `--ascii`). Pin **138** as the case count, or de-duplicate and pin **134** —
either is defensible, but the two numbers differ and an engineer who asserts uniqueness against 138 will
red a correct build. Measured, in the companion observation note.

## Why an enumeration at all — the option the subtask told me to price, priced

**The pure property — *"a token that is not exactly an accepted form is rejected"* — is already the
criterion's stated intent and is already instrumented, twice, and both instruments are samples.** `A6`(ii)
is an explicit random sample of the complement; `A6`(iii) is four literals. The complement is infinite, so
no assertion can be exhaustive over it. **The choice is therefore not "list vs property" — it is *which
dimension the finite instrument is complete in*.** I priced three:

| option | what it closes | cost | verdict |
|---|---|---|---|
| **(A)** add a fourth derivation (a prefixed form) | `MX5`/`MX4` exactly | ~1 line | **REFUSED** — it closes today's two mutants and leaves the shape that produced them. This ticket has now had this defect three times (`RF-7`, `Q1`, `E1`); a fourth item on a list of four is the fourth instance queued up |
| **(B)** complete over POSITION — insert/delete at every index | every single-character perturbation of every accepted spelling, at every position | +2 lines of page, ~120 extra pure calls, **+0.049 ms**, **zero spawns** | **ADOPTED** |
| **(C)** assert the MECHANISM textually (membership is `===`; no method call on the token) | every weakening, in principle | 1 line, zero runtime | **REFUSED** — see below |

**Why (C) is refused, since it is the closest analogue to the `A9` move the fix hop made and I want the
reasoning on the record rather than looking like I missed it.** Counting the `process` identifier worked
for `A9` because `process` is a *fixed global name* the criterion can legitimately fence. The analogue
here would be `expect(resolver).not.toMatch(/\btoken\s*[.\[]/)` — which binds the criterion to the
resolver's **local variable being named `token`**. `## Scope` says *"layout is the engineer's"*, and a
criterion that reds a rename from `token` to `arg` is a criterion that forbids a correct refactor. The
alternative spelling of (C) — a denylist of `startsWith|endsWith|toLowerCase|trim|includes|…` — **is
literally the defect under repair**, one level up: a finite list of spellings that is only as long as the
last census. I will not close a short-list defect with a short list.

## Why "complete over POSITION" is the right dimension, and not just a bigger list

**The three old derivations all touch the END of the spelling or the whole of it** — upper-case (whole),
`+"x"` (end), truncation (end). **Not one of them touches the front or the middle.** `endsWith` and
`trim` are precisely the front-of-string weakenings, so the set did not miss a *transformation* someone
failed to think of — it missed an entire **half of the string**. A family that walks every index cannot
have that hole again, because a weakening that is invisible to it must accept only tokens that differ from
an accepted spelling by **two or more** edits.

**The alphabet `{"x", " "}` is two characters and each earns its place, measured:** the space is the only
member a `trim()` weakening cannot survive, and `"x"` is a printable non-space character that keeps the old
`+"x"` case inside the new family. The old 18 are a strict subset of the new 138, so **nothing QE and the
fix hop armed is weakened** — `startsWith` and `toLowerCase` still red.

## The residual, stated so nobody reads this as more than it is

**A weakening that accepts only tokens at edit distance ≥ 2 from every accepted spelling still survives**
(a contrived `token.replace("xx","") === COLOUR` is the shape). No finite instrument closes that, and I am
not claiming it is closed. What changed is that the instrument's completeness now has a **stated
dimension** — every position, one edit — instead of a list of three transformations with no stated
principle at all.

## Stop conditions checked, one by one

- **Does this require changing what the product does?** **No, and I measured it rather than assuming:**
  all 138 cases are already rejected by the delivered resolver at `73d3b36`, zero accepted. The build is
  correct; only the instrument's reach moves. (The Orchestrator established the same for the three probes
  it ran; I extended it to the full family I am ruling in.)
- **Does this add a child spawn?** **No.** `A6`(i) is a unit row calling `resolveOptions` in-process. The
  spawn count stays at **ten** and is pinned there. Measured lane cost of the whole family: **+0.049 ms**
  against a **650 ms** bar — 0.008% of the bar, three orders of magnitude below the lane instrument's own
  resolution. **`G1`'s escalation is not made worse by this ruling in any measurable way.**
- **Is the criterion unsatisfiable as literally worded (→ delete, do not re-word)?** **No.** `A6`(i) is
  satisfiable and satisfied; its near-miss clause under-reaches. The delete precedent (`A10`'s two halves,
  bar 1's sanitizer disjunct) applies to clauses that are **false on a correct build**, which is the
  opposite defect. No criterion was deleted this hop and no property was re-homed.
