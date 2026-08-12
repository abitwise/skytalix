---
id: 20260812T131500Z-ba-pm-decision-g4-is-vacuous-not-false-and-the-shape-census-holds-at-45-files-b83f7d21
kind: decision
by: ba-pm
at: 2026-08-12T13:15:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A5
  - RISK-ABC028-02
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - src/turn-loop.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# `G4` is **VACUOUS, not false** — so it is recorded and the page is not re-opened; and the shape census is re-run at **45** files with the string score now standing beside it

> **Hand-authored, no stamp.** Every measurement below was RUN on this tip through `/usr/bin/grep`,
> `git`, and the vitest JSON reporter. **No `src/` byte was written and no criterion's text was
> changed at this hop.**

## `G4` — agree, and the ruling is sharper than "inaccurate"

QE reported that `A5`'s domain clause says *"a future row that changes the builder changes the
bound"*, and that **a row cannot change the builder**. **Verified at source rather than taken from
the note:**

```
EditShape                        src/history-pane.test.ts:1017-1024
  preservedTail, replacement, changes  — THREE fields, NONE of them a fixture
blackAnchorTo(21)  in A5's it body     :1063   (one hit inside A5; :822 is A3's)
toHaveLength(21)   in A5's it body     :1084
```

**QE's premise is exact.** Its measured consequence — the `R22` row's data appended as a row and
nothing else dies with *"no legal move a2a3"* — follows from that structure and I did not re-run it.

**THE RULING: the clause is a conditional whose antecedent cannot occur, so it is VACUOUSLY TRUE — not
false.** That distinction decides the disposition and is why it is worth stating:

| | `G1` (`:493`) | `G4` (`A5`'s clause) |
|---|---|---|
| what it does | **asserts** something untrue about the tree | asserts **nothing**; warns against a bare *"≤ 15"* that WOULD be false if the builder moved |
| direction of error | understates the tree's guards | **conservative** — removes a bigger trap than it creates |
| disposition | **repaired**, routed to the Engineer | **recorded, page not re-opened** |

**I checked the one real argument for riding it along.** The `:493` repair sends this ticket through a
gate anyway, so a parenthesis here would cost almost no gate time. **Refused anyway:** the cost is not
gate time, it is that **every criterion-TEXT edit on this page has cost a scoping argument about what
the previous verdict still covers** — *"a verdict does not cover text written after it"*, which is why
the last re-gate had to be narrowed by hand. Paying that for a sentence that is not false is a bad
trade, and `AGENTS.md` rule 9 says the same about text nobody asked me to touch.

**The exact replacement is recorded on the page** so the next hop pastes it instead of re-deriving it:
*"changing the builder changes the bound — and that is an `it`-body edit, not a row: `EditShape`
carries no fixture field."* **Owner: whoever next opens `A5`'s domain block for a reason of its own.**

**And I used the same 0-for-2 disposition here that I just refused for `G2`/`G3`, on purpose.** A
disposition is only as good as the harm it holds back. There, a miss leaves a reader trusting a false
number. Here, a miss costs a reader one row that fails loudly with *"no legal move a2a3"* — a
confusing five minutes.

## `G5` — the number the page was missing, re-measured on a bigger tree

The page carries *"`src/` scores 0"* (strings) and was silent that it scores 5 (shape). QE measured
both over **42** `src/*.ts`. **The tree is 45 now, so I re-ran the parts that could have moved rather
than transcribing the pair.**

```
src/ occurrences of the four banned STRINGS       0    (45 files, /usr/bin/grep, per-string AND union)
src/ live instances of the SHAPE                  5    (1 inside the region the convention binds)
the 3 files QE's census never saw
  src/turn-loop.ts / .test.ts / .nfr.test.ts      0 new instances
```

**The three new files were checked mechanically, not skimmed:** four source citations in
`turn-loop.ts` and seven in `turn-loop.test.ts` (all of the resolvable kind), and every
suite-total-shaped number in a comment. **The two candidates — `:1138` and `:1210`, both *"green on
all 717 tests"* — are PAST-TENSE witnesses describing a past mutant campaign, and are excluded on
QE's own stated rule**, the same rule that excluded ~40 lines elsewhere and `san.qualifier.hardening`
/ `san.suffix.hardening`'s dated tables, which I read at source to confirm.

**One honest wrinkle, recorded rather than smoothed:** those two are past-tense but **not dated** —
unlike `zobrist.nfr.test.ts:12`'s *"Measured at the `ABC-011` QE gate"*, which names its hop. A bare
past tense is a weaker witness than a dated one. **It is still not a live claim, so it is still not an
instance, and I did not report it as one.**

**Both numbers are now on the page together, and the reason is stated there:** *"`src/` scores 0"* is
true of strings and invites the conclusion that the merged tree is clean. **It is not — five live
instances sit in it and one of them is FALSE rather than stale.** The string score is not wrong; it is
**the wrong instrument reported without its denominator**, which is this page's own defect one level
up, at the level of a measurement instead of a sentence.

## `:115`'s numerator, and the figure that survived

QE closed the numerator BA/PM left `UNKNOWN - verify`: `WCACHE-LAST3` fails exactly 2 of 755, both
`toSan` call-count assertions, owned lane `26/26` exact. **It closes in this page's favour — only the
totals were ever stale.**

**And within that one comment, the split is visible:** `:116`'s owned-lane figure *"26/26"* is **still
exact on my tip**, re-run here; `:115`/`:117`'s suite figures of `752` are now stale by **55**. **A
figure scoped to the file you own survived a neighbouring ticket's landing; a figure scoped to the
whole suite did not.** The standing instruction is unchanged and is now better evidenced: **replace
the totals with the SHAPE; do not refresh them.**
