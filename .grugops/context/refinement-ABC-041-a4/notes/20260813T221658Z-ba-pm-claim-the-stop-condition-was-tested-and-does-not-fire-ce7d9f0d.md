---
id: 20260813T221658Z-ba-pm-claim-the-stop-condition-was-tested-and-does-not-fire-ce7d9f0d
kind: claim
by: ba-pm
at: 2026-08-13T22:16:58Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - plans/tickets/ABC-041-render-seam-closure.md
  - src/render-seam.ts
  - src/render-seam.test.ts
supersedes: 
---

# The stop condition was TESTED, not waved past. It does not fire: every repaired criterion is already green on the delivered module, at my own hand.

The subtask's stop condition: *if the honest repair of `A4` changes what the module must **do** rather
than what the ticket must **say**, stop and say so.* That is a question with a mechanical answer on
this tree, and I ran it rather than reasoning about it.

## The measurement

```
cd ../cli-chess-bapm041 && npx vitest run src/render-seam.test.ts
  ✓ src/render-seam.test.ts (12 tests) 15ms
  Test Files  1 passed (1)
  Tests       12 passed (12)
```

`src/render-seam.ts` and `src/render-seam.test.ts` are **byte-untouched by this hop** — the branch's
`src/` diff against its base is empty. Those 12 rows are the Engineer's 8 plus the QE gate's 4, and
**the four QE added are exactly the instruments my repaired criteria name**:

| repaired criterion | the row that already asserts it | green on the delivered module |
|---|---|---|
| `A4` — width derived from the panels, never read off the frame | `A4 (width)` | **yes** |
| `A11` — the merged four are CALLED, exactly once each | `A4 (purpose)` | **yes** |
| `A1` — the `messages` parameter reaches the frame | `A1 (messages)` | **yes** |
| `A2` — `thinking` reaches `renderStatusPanel` verbatim, both ways | `A2 (thinking)` | **yes** |

For the two textual criteria I checked the module directly rather than through a test, because I was
writing new spellings into them and a criterion the delivered module fails would have been a module
change smuggled in as wording:

```
executable text (comments stripped):  digit false | process false | globalThis false | import.meta false
whole source:                         "process" 0 | "globalThis" 0 | "import.meta" 0
```

So `A3`'s *no digit character* and `A6`'s four spellings are satisfied by `src/render-seam.ts` **as
delivered**, with no edit.

## The reading

**Nothing in this repair asks the module to behave differently.** It asks the ticket to say what is
true, and it asks the *test file* to assert two properties it already asserts (QE wrote those rows)
plus nothing new. The work that follows is the Engineer re-labelling and re-anchoring rows against the
new text — `A4 (purpose)` becomes `A11`, `A4 (width)` folds into `A4`, `A1 (messages)` and
`A2 (thinking)` fold into `A1` and `A2` — and, if it wants, adding the three extra spellings to `A6`.
**That is a test-file hop with a byte-identical production module**, which is the shape the subtask
reserved for the Engineer.

**So the stop condition does not fire, and I did not stop.**

## Where it WOULD have fired, stated so the boundary is visible rather than implied

- If the repair had required the frame's board region to be genuinely unpadded, `assembleFrame` would
  have to change — a merged module `A10` freezes and `## Out of scope` excludes. **Scope change.**
- If `A11` had been written as *"no second board implementation exists in the repository"*, the seam
  could not satisfy it by itself at all; it needs a repo-wide guard. **Homed to `ABC-054`, not
  written into `ABC-041`.**
- If `A6` had been strengthened to a spelling the delivered module contains, the "wording fix" would
  have been a comment edit under `src/`. **Checked first; it does not.**

## What is NOT claimed

- Not claimed that the full suite was re-run on this branch. **It was not** — this hop touches no
  `src/` file, and the whole-suite numbers on this tip are QE's (828/828 on 29 files, skip 0), taken
  from `parent_ref` rather than re-measured here.
- Not claimed that the Engineer's next hop is zero-effort, only that it is test-file-only.
- Not claimed as a `finding`. No `finding` is admissible on this install and no stamp was invented;
  this is a `claim` resting on one command I ran and three greps I ran.
